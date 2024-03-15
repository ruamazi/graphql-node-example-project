import { User } from "../../models/User.js";
import bcrypt from "bcryptjs";
import { UserInputError } from "apollo-server";
import {
  validateLoginInputs,
  validateSignupInputs,
} from "../../utils/validators.js";
import { generateToken } from "../../utils/generateToken.js";

export const userResolvers = {
  Query: {},
  Mutation: {
    signup: async (_, args) => {
      const { username, password, email, confirmPassword } = args.registerInput;
      const { valid, errors } = validateSignupInputs(
        username,
        password,
        confirmPassword,
        email
      );
      if (!valid) {
        throw new UserInputError("Error", { errors });
      }
      try {
        const userExists = await User.findOne({ username });
        if (userExists) {
          return new UserInputError("Error", {
            errors: {
              username: "Username taken",
            },
          });
        }
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          return new UserInputError("Error", {
            errors: {
              email: "User already exists",
            },
          });
        }
        const hashedPsw = await bcrypt.hash(password, 10);
        const newUser = new User({
          email,
          username,
          password: hashedPsw,
          createdAt: new Date().toISOString(),
        });
        await newUser.save();
        const token = generateToken(username, email, newUser);
        return {
          ...newUser._doc,
          id: newUser._id,
          token,
        };
      } catch (err) {
        console.log(err);
        throw new Error("internal server error");
      }
    },
    login: async (_, { username, password }) => {
      const { valid, errors } = validateLoginInputs(username, password);
      if (!valid) {
        throw new UserInputError("Error", { errors });
      }
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return new UserInputError("Error", {
            errors: {
              general: "Wrong credentials",
            },
          });
        }
        const comparePsw = bcrypt.compare(password, user.password);
        if (!comparePsw) {
          return new UserInputError("Error", {
            errors: {
              general: "Wrong credentials",
            },
          });
        }
        const token = generateToken(username, user.email, user);
        return {
          ...user._doc,
          id: user._id,
          token,
        };
      } catch (err) {
        console.log(err);
        throw new Error("Internal server error");
      }
    },
  },
};
