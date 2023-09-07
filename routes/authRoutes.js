import express from 'express';
import {
  blockUser,
  createUser,
  deleteUser,
  getAllUser,
  getUserbyId,
  handleRefreshToken,
  loginUser,
  logout,
  unblockUser,
  updateUser,
} from '../controller/userController.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/', getAllUser);
router.get('/refresh', handleRefreshToken);
router.get('/logout', authMiddleware, logout);
router.get('/:id', authMiddleware, isAdmin, getUserbyId);
router.put('/:id', authMiddleware, updateUser);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);
router.delete('/:id', deleteUser);

export default router;
