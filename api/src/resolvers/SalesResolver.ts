import { Company } from "src/entity/Company";
import { Share } from "src/entity/Shares";
import { Transaction } from "src/entity/Transaction";
import { User } from "src/entity/User";
import { Arg, Field, InputType, Int, Mutation, Resolver } from "type-graphql";
import { hashCode } from "./AuthResolver";

@InputType()
class IssueShareInput {
    @Field(() => String)
    name: string;

    @Field(() => Int)
    issue: number;

    @Field(() => String)
    password: string;
}

@InputType()
class BuyShareInput {
    @Field(() => String)
    name: string

    @Field(() => String)
    password: string

    @Field(() => String)
    company_name: string

    @Field(() => Int)
    amount: number;
}

@Resolver()
export class SalesResolver {
    @Mutation(() => Boolean)
    async issueShares(
        @Arg("input", () => IssueShareInput) input: IssueShareInput
    ) {
        const key = hashCode(input.password)
        const comp = await Company.findOne({
            name: input.name,
            key
        });
        if(comp) {
            await Company.update({
                name: input.name
            }, {
                issued: comp.issued + input.issue
            });
            return true;
        } else {
            return false;
        }
    }

    @Mutation(() => Boolean)
    async buyShares(
        @Arg("input", () => BuyShareInput) input: BuyShareInput
    ) {
        const comp = await Company.findOne({
            name: input.company_name
        });
        const key = hashCode(input.password);
        const user = await User.findOne(({
            name: input.name,
            key
        }));
        if(comp && user) {
            const left = comp.issued - comp.bought;
            if(left > input.amount) {
                return false;
            }
            const s = await Share.create({
                amount: input.amount,
                company: input.company_name
            });
            s.save();
            const t = await Transaction.create({
                seller: comp.id,
                company: comp.id,
                buyer: user.id,
                share_amount: input.amount
            })
            const owned = user.owned;
            owned.push(s.id);
            const transactions = user.transactions;
            transactions.push(t.id)
            await User.update({
                name: input.name
            }, {
                owned,
                transactions
            })
            return true;
        } else {
            return false;
        }
    }
}