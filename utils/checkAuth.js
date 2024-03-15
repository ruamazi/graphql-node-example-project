import jwt from "jsonwebtoken";
import { AuthenticationError } from "apollo-server";

export const checkAuth = (context) => {
  const authHeader = context.req.headers.authorization;
  if (!authHeader) {
    throw new AuthenticationError("Unauthorized");
  }
  const token = authHeader.split("Bearer ")[1];
  if (!token) {
    throw new AuthenticationError("Unauthorized");
  }
  const user = jwt.verify(token, process.env.SEC);
  if (!user) {
    throw new AuthenticationError("Invalid or expired token");
  }
  return user;
};
