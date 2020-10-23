import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class Character extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt = new Date();

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt = new Date();

  @Field(() => String)
  @Column({ unique: true })
  name!: string;

  @Field(() => Int)
  @Column()
  level: number;

  @Field(() => String)
  @Column()
  class: string;

  @Field(() => String)
  @Column()
  clan?: string;

  @Field(() => Int)
  @Column()
  vita: number;

  @Field(() => Int)
  @Column()
  mana: number;

  @Field(() => String)
  @Column({ type: "bigint" })
  totalXP: number;

  @Field(() => String)
  @Column({ type: "bigint" })
  dailyXP: number;
}
