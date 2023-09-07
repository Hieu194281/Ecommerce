import express from 'express';

import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getaProduct,
  updateProduct,
} from '../controller/productController.js';

const router = express.Router();

router.post('/register', authMiddleware, isAdmin, createProduct);
router.put('/:id', authMiddleware, isAdmin, updateProduct);
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);
router.get('/:id', getaProduct);
router.get('/', getAllProduct);

export default router;
