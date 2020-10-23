"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const characters_1 = require("./resolvers/characters");
const typeorm_1 = require("typeorm");
const Characters_1 = require("./entities/Characters");
const pino = require("pino");
const logger = pino({
    prettyPrint: { colorize: true },
    level: process.env.LOG_LEVEL || "info",
}, process.stderr);
logger.info("Logging enabled");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield typeorm_1.createConnection({
        type: "postgres",
        database: "addict",
        host: "***REMOVED***",
        username: "postgres",
        password: "***REMOVED***",
        logging: ["schema", "error", "warn"],
        synchronize: true,
        entities: [Characters_1.Character],
    });
    logger.info("Connected to Database.");
    const app = express_1.default();
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [characters_1.CharacterResolver],
            validate: false,
        }),
    });
    apolloServer.applyMiddleware({ app });
    app.listen(4000, () => {
        logger.info("server started on port 4000");
    });
});
main();
//# sourceMappingURL=index.js.map