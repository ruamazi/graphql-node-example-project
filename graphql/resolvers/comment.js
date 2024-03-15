import { Post } from "../../models/Post.js";
import { checkAuth } from "../../utils/checkAuth.js";
import { UserInputError, AuthenticationError } from "apollo-server";

export const commentResolvers = {
  Query: {},
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      if (!body || body.trim() === " ") {
        return new UserInputError("You cannot post empty comment");
      }
      const user = checkAuth(context);
      try {
        const post = await Post.findById(postId);
        if (!post) {
          return new UserInputError("Post not found");
        }
        post.comments.unshift({
          body,
          username: user.username,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      } catch (err) {
        console.log(err);
        return new Error(err.message);
      }
    },
    deleteComment: async (_, { postId, commentId }, context) => {
      const { username } = checkAuth(context);
      try {
        const post = await Post.findById(postId);
        if (!post) {
          return new UserInputError("Post not found");
        }
        const commentIndex = post.comments.findIndex((c) => c.id === commentId);
        if (post.comments[commentIndex].username !== username) {
          return new AuthenticationError("Action not allowed");
        }
        post.comments.splice(commentIndex, 1);
        await post.save();
        return post;
      } catch (err) {
        console.log(err);
        return new Error(err.message);
      }
    },
  },
};
