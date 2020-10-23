import { Field, Int } from "type-graphql";

export class CharacterInput {
  @Field(() => String)
  name!: string;

  @Field(() => String)
  class: string;

  @Field(() => Int)
  level: number;

  @Field(() => String)
  clan: string;

  @Field(() => Int)
  vita: number;

  @Field(() => Int)
  mana: number;

  @Field(() => String)
  totalXP: number;

  @Field(() => String)
  dailyXP: number;
}
