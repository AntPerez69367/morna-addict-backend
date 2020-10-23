import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { CharacterResolver } from "./resolvers/CharacterResolver";
import { Character } from "./entities/Characters";
import { CharacterScraper } from "./scripts/CharacterScraper";

import logger from "./logger";

require("dotenv").config();
var types = require("pg").types;
types.setTypeParser(20, BigInt);

logger.info("Logging enabled");
const main = async () => {
  await createConnection({
    type: "postgres",
    database: "addict",
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
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
