import jwt from "jsonwebtoken";

export const generateToken = (username, email, user) => {
  const token = jwt.sign({ id: user._id, email, username }, process.env.SEC, {
    expiresIn: "1d",
  });
  return token;
};
