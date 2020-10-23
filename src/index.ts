import "reflect-metadata";
import { __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { CharacterResolver } from "./resolvers/characters";
import { createConnection } from "typeorm";
import { Character } from "./entities/Characters";

const pino = require("pino");
const logger = pino(
  {
    prettyPrint: { colorize: true },
    level: process.env.LOG_LEVEL || "info",
  },
  process.stderr
);

logger.info("Logging enabled");
const main = async () => {
  await createConnection({
    type: "postgres",
    database: "addict",
    host: "***REMOVED***",
    username: "postgres",
    password: "***REMOVED***",
    logging: ["schema", "error", "warn"],
    synchronize: true,
    entities: [Character],
  });
  logger.info("Connected to Database.");

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [CharacterResolver],
      validate: false,
    }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    logger.info("server started on port 4000");
  });
};

main();
