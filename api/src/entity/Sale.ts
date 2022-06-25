import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class Sale extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => Int)
    @Column("int")
    seller: number;

    @Field(() => Int)
    @Column("int")
    company: number;

    @Field(() => Int)
    @Column("int")
    share_amount: number;
}