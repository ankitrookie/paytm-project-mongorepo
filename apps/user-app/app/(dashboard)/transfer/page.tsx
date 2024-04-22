import db from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { AddMoney } from "../../_components/AddMoneyCard";
import { OnRampTransaction } from "../../_components/OnRampTransaction";
import { BalanceCard } from "../../_components/BalanceCard";

async function getBalance() {
  const session = await getServerSession(authOptions);
  const balance = await db.balance.findFirst({
    where: {
      userId: session?.user?.id
    }
  });
  return {
    amount: balance?.amount || 0,
    locked: balance?.locked || 0
  }
}

async function getOnRampTransactions() {
  const session = await getServerSession(authOptions);
  const txns = await db.onRampTransaction.findMany({
    where: {
      userId: session?.user?.id
    }
  });
  return txns.map(t => ({
    time: t.startTime,
    amount: t.amount,
    status: t.status,
    provider: t.provider
  }))
}

export default async function() {
  const balance = await getBalance();
  const transactions = await getOnRampTransactions();
  console.log(transactions)

  return <div className="w-screen">
    <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
      Transfer
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <div>
        <AddMoney />
      </div>
      <div>
        <BalanceCard amount={balance.amount} locked={balance.locked} />
        <div className="pt-4">
          <OnRampTransaction transactions={transactions} />
        </div>
      </div>
    </div>
  </div>
}
