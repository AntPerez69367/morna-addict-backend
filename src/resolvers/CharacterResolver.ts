import { Character } from "../entities/Characters";
import { Arg, Query, Resolver } from "type-graphql";

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
}
