// src/routes/communityRoutes.ts
import { Router } from 'express';
import verifyToken from '../middleware/verifyToken';
import {
    getAllPosts, 
    getPostById, 
    createPost, 
    updatePost, 
    deletePost, 
    getComments,
    createComment,
    updateComment,
    deleteComment,
    toggleLike,
    toggleBookmark
} from '../controllers/CommunityController';

const router = Router();

// --- 게시글 CRUD 라우팅 ---
router.get('/posts', verifyToken, getAllPosts);
router.get('/posts/:postId', verifyToken, getPostById);
router.post('/posts', verifyToken, createPost);
router.put('/posts/:postId', verifyToken, updatePost);
router.delete('/posts/:postId', verifyToken, deletePost);

// --- 댓글 CRUD 라우팅 ---
router.get('/posts/:postId/comments', getComments);
router.post('/posts/:postId/comments', verifyToken, createComment);
router.put('/comments/:commentId', verifyToken, updateComment);
router.delete('/comments/:commentId', verifyToken, deleteComment);

// --- 소셜 기능 라우팅 ---
router.post('/posts/:postId/like', verifyToken, toggleLike);
router.post('/posts/:postId/bookmark', verifyToken, toggleBookmark);

export default router;