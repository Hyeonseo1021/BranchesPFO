import { Router, Request, Response } from 'express';
import Post from '../models/Postmodel';
import Comment from '../models/Commentmodel';
import User from '../models/User';
import authMiddleware, { AuthRequest } from '../middleware/middleware';
import { Types } from 'mongoose';

const router = Router();

// --- 게시글 CRUD ---
router.get('/posts', async (req: Request, res: Response) => { /* 모든 게시글 조회 */
    try {
        const posts = await Post.find().populate('author', 'name id').sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) { res.status(500).json({ message: "서버 오류" }); }
});
router.get('/posts/:postId', async (req: Request, res: Response) => { /* 특정 게시글 조회 */
    try {
        const post = await Post.findByIdAndUpdate(req.params.postId, { $inc: { views: 1 } }, { new: true }).populate('author', 'name id');
        if (!post) return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
        res.status(200).json(post);
    } catch (error) { res.status(500).json({ message: "서버 오류" }); }
});
router.post('/posts', authMiddleware, async (req: AuthRequest, res: Response) => { /* 게시글 생성 */
    try {
        const { title, content } = req.body;
        const author = req.user?.id;
        const newPost = new Post({ title, content, author });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) { res.status(500).json({ message: "서버 오류" }); }
});
router.put('/posts/:postId', authMiddleware, async (req: AuthRequest, res: Response) => { /* 게시글 수정 */
    try {
        const updatedPost = await Post.findOneAndUpdate({ _id: req.params.postId, author: req.user?.id }, { title: req.body.content }, { new: true });
        if (!updatedPost) return res.status(404).json({ message: "게시글을 찾을 수 없거나 수정 권한이 없습니다." });
        res.status(200).json(updatedPost);
    } catch (error) { res.status(500).json({ message: "서버 오류" }); }
});
router.delete('/posts/:postId', authMiddleware, async (req: AuthRequest, res: Response) => { /* 게시글 삭제 */
    try {
        const deletedPost = await Post.findOneAndDelete({ _id: req.params.postId, author: req.user?.id });
        if (!deletedPost) return res.status(404).json({ message: "게시글을 찾을 수 없거나 삭제할 권한이 없습니다." });
        await Comment.deleteMany({ postId: deletedPost._id });
        res.status(200).json({ message: "게시글과 관련 댓글이 성공적으로 삭제되었습니다." });
    } catch (error) { res.status(500).json({ message: "서버 오류" }); }
});

// --- 댓글 CRUD ---
router.get('/posts/:postId/comments', async (req: Request, res: Response) => { /* 댓글 조회 */
    try {
        const comments = await Comment.find({ postId: req.params.postId }).populate('author', 'name id').sort({ createdAt: 1 });
        res.status(200).json(comments);
    } catch (error) { res.status(500).json({ message: "서버 오류" }); }
});
router.post('/posts/:postId/comments', authMiddleware, async (req: AuthRequest, res: Response) => { /* 댓글 생성 */
    try {
        const newComment = new Comment({ content: req.body.content, postId: req.params.postId, author: req.user?.id });
        await newComment.save();
        const populatedComment = await newComment.populate('author', 'name id');
        res.status(201).json(populatedComment);
    } catch (error) { res.status(500).json({ message: "서버 오류" }); }
});
router.put('/comments/:commentId', authMiddleware, async (req: AuthRequest, res: Response) => { /* 댓글 수정 */
    try {
        const updatedComment = await Comment.findOneAndUpdate({ _id: req.params.commentId, author: req.user?.id }, { content: req.body.content }, { new: true });
        if (!updatedComment) return res.status(404).json({ message: "댓글을 찾을 수 없거나 수정할 권한이 없습니다." });
        res.status(200).json(updatedComment);
    } catch (error) { res.status(500).json({ message: "서버 오류" }); }
});
router.delete('/comments/:commentId', authMiddleware, async (req: AuthRequest, res: Response) => { /* 댓글 삭제 */
    try {
        const deletedComment = await Comment.findOneAndDelete({ _id: req.params.commentId, author: req.user?.id });
        if (!deletedComment) return res.status(404).json({ message: "댓글을 찾을 수 없거나 삭제할 권한이 없습니다." });
        res.status(200).json({ message: "댓글이 성공적으로 삭제되었습니다." });
    } catch (error) { res.status(500).json({ message: "서버 오류" }); }
});

// --- 소셜 기능 ---
router.post('/posts/:postId/like', authMiddleware, async (req: AuthRequest, res: Response) => { /* 좋아요 토글 */
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });

        const userObjectId = new Types.ObjectId(req.user?.id);
        const likeIndex = post.likes.findIndex(id => id.equals(userObjectId));
        
        if (likeIndex > -1) { post.likes.splice(likeIndex, 1); } 
        else { post.likes.push(userObjectId); }
        await post.save();
        
        res.status(200).json({ likesCount: post.likes.length, isLiked: likeIndex === -1 });
    } catch (error) { res.status(500).json({ message: "서버 오류" }); }
});
router.post('/posts/:postId/bookmark', authMiddleware, async (req: AuthRequest, res: Response) => { /* 북마크 토글 */
    try {
        const user = await User.findById(req.user?.id);
        if (!user) return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
        
        const postObjectId = new Types.ObjectId(req.params.postId);
        const bookmarkIndex = user.bookmarks.findIndex(id => id.equals(postObjectId));

        if (bookmarkIndex > -1) { user.bookmarks.splice(bookmarkIndex, 1); }
        else { user.bookmarks.push(postObjectId); }
        await user.save();

        res.status(200).json({ isBookmarked: bookmarkIndex === -1 });
    } catch (error) { 
        console.error("북마크 처리 중 오류:", error);
        res.status(500).json({ message: "서버 오류" }); 
    }
});

export default router;
