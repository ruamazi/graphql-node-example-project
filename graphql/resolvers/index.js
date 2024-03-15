import { commentResolvers } from "./comment.js";
import { postResolvers } from "./post.js";
import { userResolvers } from "./users.js";

export const resolvers = {
  Post: {
    likeCount: (parent) => {
      return parent.likes.length;
    },
    commentCount: (parent) => {
      return parent.comments.length;
    },
  },
  Query: {
    ...postResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolvers.Mutation,
  },
};
