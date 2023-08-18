import User from '../models/userModel.js';

import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  console.log(req);
  if (req?.header.Authorization?.startsWith('Bearer')) {
    token = req.header.Authorization.split(' ')[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
      }
    } catch (error) {
      throw new Error('Not Authorized token expried. Please login again');
    }
  } else {
    throw new Error('There is no token to attach to header');
  }
});

export { authMiddleware };
