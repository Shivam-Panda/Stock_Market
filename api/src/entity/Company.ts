import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class Company extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => String)
    @Column()
    name: string;

    @Field(() => Int)
    @Column("int")
    revenue: number;
    
    @Field(() => Int)
    @Column("int")
    marginal_revenue:number;

    @Field(() => Int)
    @Column("int")
    cost: number;

    @Field(() => Int)
    @Column("int")
    issued: number;

    @Field(() => Int)
    @Column("int")
    bought: number;

    @Field(() => Int)
    @Column("int")
    key: number;

    @Field(() => Boolean)
    @Column("boolean")
    good: boolean

    @Field(() => [Int])
    @Column("simple-array", {nullable: true})
    owned: Array<number>
}