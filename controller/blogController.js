import blogModel from '../models/blogModel.js';
import userModel from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import { validateMongoDbId } from '../utils/validateMongodbId.js';

const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await blogModel.create(req.body);
    res.json(newBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateBlog = await blogModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const getBlogbyId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const blogbyId = await blogModel.findById(id);
    await blogModel.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true },
    );
    res.json(blogbyId);
  } catch (error) {
    throw new Error(error);
  }
});
const getAllBlog = asyncHandler(async (req, res) => {
  try {
    const blogCount = await blogModel.countDocuments();
    const allBlog = await blogModel.find();
    res.json({
      data: allBlog,
      total: blogCount,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteBlog = await blogModel.findByIdAndDelete(id);
    res.json(deleteBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);

  console.log(req.body);
  console.log(blogId);
  //find blog want to like
  const blog = await blogModel.findById(blogId);
  // find login user
  const loginUserId = req?.user?._id;
  //find if user has liked blog
  const isLiked = blog?.isLiked;
  // find if the user has disliked the blog
  const alreadyDisliked = blog?.dislikes?.find(
    userID => userID?.toString() === loginUserId?.toString(),
  );
  if (alreadyDisliked) {
    const blog = await blogModel.findByIdAndUpdate(
      blogId,
      {
        $pull: {
          dislikes: loginUserId,
        },
        isDisliked: false,
      },
      {
        new: true,
      },
    );
    res.json(blog);
  } else if (isLiked) {
    const blog = await blogModel.findByIdAndUpdate(
      blogId,
      {
        $pull: {
          likes: loginUserId,
        },
        isLiked: false,
      },
      {
        new: true,
      },
    );
    res.json(blog);
  } else {
    const blog = await blogModel.findByIdAndUpdate(
      blogId,
      {
        $push: {
          likes: loginUserId,
        },
        isLiked: true,
      },
      {
        new: true,
      },
    );
    res.json(blog);
  }
});

const dislikeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);

  console.log(req.body);
  console.log(blogId);
  //find blog want to like
  const blog = await blogModel.findById(blogId);
  // find login user
  const loginUserId = req?.user?._id;
  //find if user has liked blog
  const isdisLiked = blog?.isDisliked;
  // find if the user has disliked the blog
  const alreadyliked = blog?.likes?.find(
    userID => userID?.toString() === loginUserId?.toString(),
  );
  if (alreadyliked) {
    const blog = await blogModel.findByIdAndUpdate(
      blogId,
      {
        $pull: {
          likes: loginUserId,
        },
        isLiked: false,
      },
      {
        new: true,
      },
    );
    res.json(blog);
  } else if (isdisLiked) {
    const blog = await blogModel.findByIdAndUpdate(
      blogId,
      {
        $pull: {
          dislikes: loginUserId,
        },
        isDisliked: false,
      },
      {
        new: true,
      },
    );
    res.json(blog);
  } else {
    const blog = await blogModel.findByIdAndUpdate(
      blogId,
      {
        $push: {
          dislikes: loginUserId,
        },
        isDisliked: true,
      },
      {
        new: true,
      },
    );
    res.json(blog);
  }
});

export {
  createBlog,
  updateBlog,
  getBlogbyId,
  getAllBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog,
};
