import { generateToken } from '../configs/jwtToken.js';
import userModel from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import { validateMongoDbId } from '../utils/validateMongodbId.js';
import { generateRefreshToken } from '../configs/refreshToken.js';
import jwt from 'jsonwebtoken';
import { sendMail } from './emailController.js';
import crypto from 'crypto';
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  console.log(email);
  const findUser = await userModel.findOne({ email: email });
  if (!findUser) {
    //create a new user
    console.log(req.body);

    const newUser = await userModel.create(req.body);
    res.json(newUser);
  } else {
    //user exist
    // res.json({
    //   msg: 'User Already exists',
    //   success: false,
    // });
    throw new Error('User Already Existssss');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  // check if user exist or not
  const findUser = await userModel.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = generateRefreshToken(findUser?._id);

    const updateUser = await userModel.findByIdAndUpdate(
      findUser?._id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      },
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      firstName: findUser?.firstName,
      lastName: findUser?.lastName,
      email: findUser?.email,
      mobile: findUser?.mobile,
      access_token: generateToken(findUser?._id),
    });
  } else {
    throw new Error('Invailid login credentials');
  }
});

//handle refresh token

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) {
    throw new Error('No refresh token in cookies');
  } else {
    const refreshToken = cookie.refreshToken;
    const user = await userModel.findOne({ refreshToken });
    console.log(user);
    if (!user) {
      throw new Error('No refresh token present in db orr not matched');
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      console.log(decoded);
      if (err || user?._id != decoded?.id) {
        throw new Error('There is some wrong with refresh token');
      }
      const access_token = generateToken(user?._id);
      res.json({ access_token });
    });
  }
});

//logout

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) {
    throw new Error('No refreshToken in Cookies');
  }
  const refreshToken = cookie.refreshToken;
  const user = await userModel.findOne({ refreshToken });
  console.log(user);
  if (!user) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
    });
    res.sendStatus(204); // forbideen
  }
  await userModel.findByIdAndUpdate(user?._id, {
    refreshToken: '',
  });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(200);
});
//fetch user

const getAllUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await userModel.find();
    res.json({
      users: getUsers,
      total: getUsers.length,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//get user by id

const getUserbyId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getUserbyId = await userModel.findById(id);
    res.json(getUserbyId);
  } catch (error) {
    throw new Error(error);
  }
});

// update user
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateUser = await userModel.findByIdAndUpdate(
      id,
      {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      },
    );

    res.json(updateUser);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const deleteUser = await userModel.findByIdAndDelete(id);
    res.json(deleteUser);
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const blockUser = await userModel.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      },
    );
    res.json({
      message: 'User blocked',
    });
  } catch (error) {
    throw new Error(error);
  }
});
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const blockUser = await userModel.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      },
    );
    res.json({
      message: 'User unblocked',
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const password = req.body.password;
  validateMongoDbId(_id);
  const user = await userModel.findById(_id);
  if (password) {
    user.password = password;
    const updatePassword = await user.save();
    res.json(updatePassword);
  } else {
    res.json(user);
  }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new Error('User not found with email');
  }
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, please folloe this link to reset Your password. THis link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click here</a>`;
    const data = {
      to: email,
      subject: 'FOrgor Password Link',
      html: resetURL,
    };
    sendMail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await userModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error('TOken expired, please try again later');
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});
export {
  createUser,
  loginUser,
  getAllUser,
  getUserbyId,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
};
