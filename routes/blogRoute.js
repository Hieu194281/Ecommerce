import express from 'express';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';
import {
  createBlog,
  deleteBlog,
  dislikeBlog,
  getAllBlog,
  getBlogbyId,
  likeBlog,
  updateBlog,
} from '../controller/blogController.js';

const router = express.Router();
router.post('/', authMiddleware, isAdmin, createBlog);
router.delete('/:id', authMiddleware, isAdmin, deleteBlog);
router.put('/likes', authMiddleware, likeBlog);
router.put('/dislikes', authMiddleware, dislikeBlog);
router.get('/:id', getBlogbyId);
router.get('/', getAllBlog);
router.put('/:id', authMiddleware, isAdmin, updateBlog);

export default router;
