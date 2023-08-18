import e from 'express';
import { generateToken } from '../configs/jwtToken.js';
import userModel from '../models/userModel.js';
import asyncHandler from 'express-async-handler';

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
  console.log(id);
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
  try {
    const deleteUser = await userModel.findByIdAndDelete(id);
    res.json(deleteUser);
  } catch (error) {
    throw new Error(error);
  }
});
export {
  createUser,
  loginUser,
  getAllUser,
  getUserbyId,
  updateUser,
  deleteUser,
};
