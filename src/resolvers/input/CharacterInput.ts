import { Field, InputType, Int } from "type-graphql";

@InputType()
export class CharacterInput {
  id!: number;
  createdAt = new Date();
  updatedAt = new Date();

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
  totalXP: bigint;

  @Field(() => Int)
  dailyXP: number;
}
