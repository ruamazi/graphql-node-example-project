import { Post } from "../../models/Post.js";
import { checkAuth } from "../../utils/checkAuth.js";
import { AuthenticationError, UserInputError } from "apollo-server";

export const postResolvers = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        console.log(err);
        return new Error(err.message);
      }
    },
    getPost: async (_, { postId }) => {
      try {
        const post = await Post.findById(postId);
        if (!post) {
          return new Error("Post not found");
        }
        return post;
      } catch (err) {
        console.log(err);
        return new Error(err.message);
      }
    },
  },
  Mutation: {
    createPost: async (_, { body }, context) => {
      const user = checkAuth(context);
      if (body.trim().length === 0) {
        return new UserInputError("You cannot publish an empty post");
      }
      try {
        const newPost = new Post({
          body,
          user: user.id,
          username: user.username,
          createdAt: new Date().toISOString(),
        });
        await newPost.save();
        return newPost;
      } catch (err) {
        console.log(err);
        return new Error(err.message);
      }
    },
    deletePost: async (_, { postId }, context) => {
      const user = checkAuth(context);
      try {
        const postToDelete = await Post.findById(postId);
        if (!postToDelete) {
          throw new UserInputError("Post not found");
        }
        if (user.username !== postToDelete.username) {
          throw new AuthenticationError("You cannot delete this post");
        }

        await Post.findByIdAndDelete(postId);
        return "Post deleted successfully";
      } catch (err) {
        console.log(err);
        return new Error(err.message);
      }
    },
    likePost: async (_, { postId }, context) => {
      const { username } = checkAuth(context);
      try {
        const post = await Post.findById(postId);
        if (!post) {
          return new UserInputError("Post not found");
        }
        const userLiked = post.likes.find((like) => like.username === username);
        if (userLiked) {
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          post.likes.push({ username, createdAt: new Date().toISOString() });
        }
        await post.save();
        return post;
      } catch (err) {
        console.log(err);
        return new Error(err.message);
      }
    },
  },
};
