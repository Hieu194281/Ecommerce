import User from '../models/userModel.js';

import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith('Bearer')) {
    token = req.headers?.authorization.split(' ')[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error('Not Authorized token expried. Please login again');
    }
  } else {
    throw new Error('There is no token to attach to header');
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    throw new Error('you are not a admin');
  } else {
    next();
  }
});
export { authMiddleware, isAdmin };
