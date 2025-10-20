// src/controllers/communityController.ts

import { Request, Response } from 'express';
import Post from '../models/Postmodel';
import Comment from '../models/Commentmodel';
import User from '../models/User';
import { AuthRequest } from '../middleware/verifyToken';
import { Types } from 'mongoose';

// --- 게시글 컨트롤러 ---

/** 모든 게시글 조회 */
export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    // ✅ 'name'을 'nickname'으로 변경
    const posts = await Post.find().populate('author', 'nickname id').sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: '서버 오류' });
  }
};

/** 특정 게시글 조회 (조회수 증가 포함) */
export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'nickname id'); // ✅ nickname으로 변경

    if (!post) {
      res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
      return;
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: '서버 오류' });
  }
};

/** 새 게시글 생성 */
export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: '로그인 후 이용하세요.' });
      return;
    }

    const { title, content } = req.body;
    if (!title || !content) {
      res.status(400).json({ message: '제목과 내용을 모두 입력하세요.' });
      return;
    }

    const newPost = new Post({
      title,
      content,
      author: req.userId,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error('게시글 생성 오류:', error);
    res.status(500).json({ message: '서버 오류' });
  }
};

/** 게시글 수정 */
export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params.postId, author: req.userId },
      { title: req.body.title, content: req.body.content },
      { new: true }
    );

    if (!updatedPost) {
      res.status(404).json({ message: '게시글을 찾을 수 없거나 수정 권한이 없습니다.' });
      return;
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: '서버 오류' });
  }
};

/** 게시글 삭제 */
export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const deletedPost = await Post.findOneAndDelete({ 
      _id: req.params.postId, 
      author: req.userId
    });
    
    if (!deletedPost) {
      res.status(404).json({ message: '게시글을 찾을 수 없거나 삭제할 권한이 없습니다.' });
      return;
    }

    await Comment.deleteMany({ postId: deletedPost._id });
    res.status(200).json({ message: '게시글과 관련 댓글이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '서버 오류' });
  }
};

// --- 댓글 컨트롤러 ---

/** 특정 게시글의 모든 댓글 조회 */
export const getComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate('author', 'nickname id') // ✅ nickname으로 변경
      .sort({ createdAt: 1 });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: '서버 오류' });
  }
};

/** 댓글 생성 */
export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: '로그인 후 이용하세요.' });
      return;
    }

    const newComment = new Comment({
      content: req.body.content,
      postId: req.params.postId,
      author: req.userId,
    });

    await newComment.save();
    const populatedComment = await newComment.populate('author', 'nickname id'); // ✅ nickname으로 변경
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: '서버 오류' });
  }
};

/** 댓글 수정 */
export const updateComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const updatedComment = await Comment.findOneAndUpdate(
      { _id: req.params.commentId, author: req.userId },
      { content: req.body.content },
      { new: true }
    );

    if (!updatedComment) {
      res.status(404).json({ message: '댓글을 찾을 수 없거나 수정할 권한이 없습니다.' });
      return;
    }

    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: '서버 오류' });
  }
};

/** 댓글 삭제 */
export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const deletedComment = await Comment.findOneAndDelete({ 
      _id: req.params.commentId, 
      author: req.userId
    });
    
    if (!deletedComment) {
      res.status(404).json({ message: '댓글을 찾을 수 없거나 삭제할 권한이 없습니다.' });
      return;
    }

    res.status(200).json({ message: '댓글이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '서버 오류' });
  }
};

// --- 소셜 기능 컨트롤러 ---

/** 좋아요 토글 */
export const toggleLike = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
      return;
    }

    const userObjectId = new Types.ObjectId(req.userId);
    const likeIndex = post.likes.findIndex(id => id.equals(userObjectId));

    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(userObjectId);
    }

    await post.save();
    res.status(200).json({ likesCount: post.likes.length, isLiked: likeIndex === -1 });
  } catch (error) {
    res.status(500).json({ message: '서버 오류' });
  }
};

/** 북마크 토글 */
export const toggleBookmark = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      return;
    }

    const postObjectId = new Types.ObjectId(req.params.postId);
    const bookmarkIndex = user.bookmarks.findIndex(id => id.equals(postObjectId));

    if (bookmarkIndex > -1) {
      user.bookmarks.splice(bookmarkIndex, 1);
    } else {
      user.bookmarks.push(postObjectId);
    }

    await user.save();
    res.status(200).json({ isBookmarked: bookmarkIndex === -1 });
  } catch (error) {
    console.error('북마크 처리 중 오류:', error);
    res.status(500).json({ message: '서버 오류' });
  }
};