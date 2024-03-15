import { ApolloServer } from "apollo-server";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./db/connectDB.js";
import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers/index.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

const startServer = async () => {
  try {
    await connectDB();
    const { url } = await server.listen();
    console.log(`Server running at ${url}`);
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};
startServer();
