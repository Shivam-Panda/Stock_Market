import { Company } from "src/entity/Company";
import { Sale } from "src/entity/Sale";
import { Share } from "src/entity/Shares";
import { Transaction } from "src/entity/Transaction";
import { User } from "src/entity/User";
import { Arg, Field, InputType, Int, Mutation, Resolver } from "type-graphql";
import { hashCode } from "./AuthResolver";

@InputType()
class SellShareInput {
    @Field(() => String)
    name: string;

    @Field(() => String)
    password: string;

    @Field(() => String)
    company_name: string;

    @Field(() => Int)
    amount: number;
}

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
class BuyShareCompanyInput {
    @Field(() => String)
    name: string

    @Field(() => String)
    password: string

    @Field(() => String)
    company_name: string

    @Field(() => Int)
    amount: number;
}

export const share_value = (c: Company, amount: number): number => {
    const rev = c.revenue;
    const shares = c.issued;

    const ind_val = rev / shares;

    return ind_val * amount;
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
    async buySharesCompany(
        @Arg("input", () => BuyShareCompanyInput) input: BuyShareCompanyInput
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
                user: user.id,
                amount: input.amount,
                company: comp.id
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

            const cost = share_value(comp, input.amount);

            await User.update({
                name: input.name
            }, {
                owned,
                transactions,
                total: user.total - cost
            });
            return true;
        } else {
            return false;
        }
    }

    @Mutation(() => Boolean)
    async sellShare(
        @Arg("input", () => SellShareInput) input: SellShareInput
    ) {
        const key = hashCode(input.password);
        const user = await User.findOne({
            name: input.name,
            key
        });

        const comp = await Company.findOne({
            name: input.company_name
        });

        if(user && comp) {
            // Check if user has enough shares
            const owned = await Share.find({
                user: user.id,
                company: comp.id
            });
            for(let i = 0; i < owned.length; i++) {
                let o = owned[i]
                if(o.amount >= input.amount) {
                    const s = await Sale.create({
                        seller: user.id,
                        company: comp.id,
                        share_amount: input.amount
                    }).save();
                    await Share.update({
                        id: o.id
                    }, {
                        amount: o.amount - input.amount
                    });
                    return true;
                }
            }
            return false;
        } else {
            return false;
        }
    }
}