import { Character } from "../entities/Characters";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { CharacterInput } from "./input/CharacterInput";

const pino = require("pino");
const logger = pino(
  {
    prettyPrint: { colorize: true },
    level: process.env.LOG_LEVEL || "info",
  },
  process.stderr
);

@Resolver(() => Character)
export class CharacterResolver {
  @Query(() => [Character])
  characters(): Promise<Character[]> {
    return Character.find();
  }

  @Query(() => Character, { nullable: true })
  character(
    @Arg("name", () => String) name: string
  ): Promise<Character | undefined> {
    return Character.findOne({ where: { name } });
  }

  // @Mutation(() => Character, { nullable: true })
  // async createOrUpdateCharacter(
  //   @Arg("data") characterData: CharacterInput
  // ): Promise<Character | undefined> {
  //   const charEntity = await Character.findOne({
  //     where: { name: characterData.name },
  //   });

  //   if (!charEntity) {
  //     logger.info(
  //       `Creating Character ${JSON.stringify(characterData, null, 2)}`
  //     );
  //     return await Character.create({ ...characterData }).save();
  //   }
  //   logger.info(`Updating Character ${JSON.stringify(characterData, null, 2)}`);
  //   await Character.update({ id: charEntity.id }, { ...characterData });
  //   return await Character.findOne({
  //     where: { name: characterData.name },
  //   });
  // }
}
