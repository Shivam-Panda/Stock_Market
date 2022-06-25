import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column("int")
  key: number;

  @Field()
  @Column()
  name: string;

  @Field(() => Int)
  @Column("int")
  total: number;

  @Field(() => [Int])
  @Column("simple-array")
  transactions: Array<number>
}