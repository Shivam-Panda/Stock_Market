import { Arg, Field, InputType, Int, Mutation, Query, Resolver } from "type-graphql";
import { Company } from "../entity/Company";
import { Sale } from "../entity/Sale";
import { Share } from "../entity/Shares";
import { Transaction } from "../entity/Transaction";
import { User } from "../entity/User";
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

@InputType()
class BuyShareInput {
    @Field(() => String)
    name: string

    @Field(() => String)
    password: string

    @Field(() => Int)
    sale: number
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
            await Sale.create({
                seller: comp.id,
                share_amount: input.issue,
                company: comp.id
            }).save();
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
        const key = hashCode(input.password);
        const user = await User.findOne({
            name: input.name,
            key
        });
        if(user == undefined) {
            console.log('Return for User')
            return false;
        }
        else {
            const comp = await Company.findOne({
                name: input.company_name
            });
            if(comp == undefined) {
                console.log('Return for Comp')
                return false;
            }
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

            await Company.update({
                name: comp.name
            }, {
                bought: comp.bought + input.amount,
                revenue: comp.revenue + cost
            })
            console.log('Regular Return')
            return true;
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
                    await Sale.create({
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

    @Mutation(() => Boolean)
    async reset() {
        await Company.delete({});
        await Sale.delete({});
        await Share.delete({});
        await Transaction.delete({});
        await User.delete({});
        return true;
    }

    @Mutation(() => Boolean)
    async buyShare(
        @Arg("input", () => BuyShareInput) input: BuyShareInput
    ) {
        const key = hashCode(input.password);
        const buyer = await User.findOne({
            name: input.name,
            key
        });
        const sale = await Sale.findOne({ id: input.sale });
        if(buyer && sale) {
            const seller = await User.findOne({
                id: sale.seller
            });
            if(seller) {
                const t = await Transaction.create({
                    seller: seller.id,
                    buyer: buyer.id,
                    company: sale.company,
                    share_amount: sale.share_amount
                });
                const t_id = t.id;
                t.save();
                const c = await Company.findOne({
                    id: sale.company
                });
                if(c == undefined) {
                    return false;
                }
                const cost = share_value(c, sale.share_amount);
                const seller_trans = seller.transactions;
                const bought_trans = buyer.transactions;
                seller_trans.push(t_id)
                bought_trans.push(t_id)
                await User.update({
                    id: buyer.id
                }, {
                    transactions: bought_trans,
                    total: buyer.total - cost
                });
                await User.update({
                    id: seller.id,
                }, {
                    transactions: seller_trans,
                    total: seller.total + cost
                })
                return true;
            }
            return false;
        }
        return false;
    }

    @Query(() => [Sale])
    async getAllSales() {
        return await Sale.find();
    }
}