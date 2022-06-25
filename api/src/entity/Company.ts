import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class Company extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => Int)
    @Column("int")
    revenue: number;

    @Field(() => Int)
    @Column("int")
    cost: number;

    @Field(() => Int)
    @Column("int")
    issued: number;

    @Field(() => Int)
    @Column("int")
    bought: number;

    @Field(() => String)
    @Column()
    key: string;

    @Field(() => Boolean)
    @Column("bool")
    good: boolean
}