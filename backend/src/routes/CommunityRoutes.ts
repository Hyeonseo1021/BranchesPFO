// src/routes/communityRoutes.ts

import { Router } from 'express';
import authMiddleware from '../middleware/middleware';
import * as communityController from '../controllers/CommunityController';

const router = Router();

// --- 게시글 CRUD 라우팅 ---
router.get('/posts', communityController.getAllPosts);
router.get('/posts/:postId', communityController.getPostById);
router.post('/posts', authMiddleware, communityController.createPost);
router.put('/posts/:postId', authMiddleware, communityController.updatePost);
router.delete('/posts/:postId', authMiddleware, communityController.deletePost);

// --- 댓글 CRUD 라우팅 ---
router.get('/posts/:postId/comments', communityController.getComments);
router.post('/posts/:postId/comments', authMiddleware, communityController.createComment);
router.put('/comments/:commentId', authMiddleware, communityController.updateComment);
router.delete('/comments/:commentId', authMiddleware, communityController.deleteComment);

// --- 소셜 기능 라우팅 ---
router.post('/posts/:postId/like', authMiddleware, communityController.toggleLike);
router.post('/posts/:postId/bookmark', authMiddleware, communityController.toggleBookmark);

export default router;