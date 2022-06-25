import { Arg, Field, InputType, Int, Mutation, Query, Resolver } from "type-graphql";

import { User } from '../entity/User';

import { Company } from '../entity/Company';

export const hashCode = (str: string) => {
    var hash = 0, i = 0, len = str.length;
    while ( i < len ) {
        hash  = ((hash << 5) - hash + str.charCodeAt(i++)) << 0;
    }
    return hash;
}

@InputType()
class CreateUserInput {
    @Field(() => Int)
    total: number;

    @Field(() => String)
    password: string;

    @Field(() => String)
    name: string;
}

@InputType()
class CreateCompanyInput {
    @Field(() => Int)
    production_cost: number

    @Field(() => Int)
    beginning_revenue: number

    @Field(() => String)
    password: string

    @Field(() => Boolean)
    good: boolean

    @Field(() => String)
    name: string;
}

@InputType()
class CompanyInput {
    @Field(() => String)
    name: string;

    @Field(() => String)
    password: string;
}

@InputType()
class LoginInput {
    @Field(() => String)
    name: string;

    @Field(() => String)
    password: string;
}

@Resolver()
export class AuthResolver {
    @Mutation(() => Boolean)
    async createUser(
        @Arg("input", () => CreateUserInput) input: CreateUserInput
    ) {
        const key = hashCode(input.password);
        const us = await User.create({
            key,
            name: input.name,
            total: input.total,
            transactions: [],
            owned: []
        }).save();
        if(us != null) {
            return true;
        } else {
            return false;
        }
    }

    @Mutation(() => Boolean)
    async createCompany(
        @Arg("input", () => CreateCompanyInput) input: CreateCompanyInput 
    ) {
        const key = hashCode(input.password);
        const comp = await Company.create({
            key,
            name: input.name,
            revenue: input.beginning_revenue,
            issued: 0,
            owned: [],
            cost: input.production_cost,
            good: input.good,
            bought: 0
        }).save();
        if(comp != null) {
            return true;
        } else {
            return false;
        }
    }

    @Query(() => Company!)
    async getCompany(
        @Arg("input", () => CompanyInput) input: CompanyInput
    ) {
        const key = hashCode(input.password);
        const comp = await Company.findOne({
            name: input.name,
            key
        });
        return comp;
    }

    @Query(() => Boolean)
    async login(
        @Arg("input", () => LoginInput) input: LoginInput
    ) {
        const key = hashCode(input.password);
        const user = await User.findOne({ 
            name: input.name,
            key
        });
        if(user != null) {
            return true;
        } else {
            return false;
        }
    }

    @Query(() => User!)
    async getUser(
        @Arg("id", () => Int) id: number 
    ) {
        const user = await User.findOne({ id });
        console.log(user);
        return user;
    }

    @Query(() => [User]!)
    async allUsers() {
        return await User.find();
    }
    
    @Mutation(() => Boolean)
    async reset() {
        await User.delete({});
        return true;
    }
}