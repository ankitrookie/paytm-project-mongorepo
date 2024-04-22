"use server";

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import db from "@repo/db/client"

export const P2PTransfer = async (to: string, amount: number) => {
  const session = await getServerSession(authOptions);
  const from = session.user.id;
  if (!from) {
    return {
      message: "Error while sending!"
    }
  }

  const userId = await db.user.findFirst({
    where: {
      number: to
    }
  })

  if (!userId) {
    return {
      message: "User not found!"
    }
  }

  await db.$transaction(async (tx) => {
    const senderBalance = await tx.balance.findUnique({
      where: {
        userId: from
      }
    })

    if (!senderBalance || senderBalance.amount < amount) {
      throw new Error('Insufficient funds');
    }

    await tx.balance.update({
      where: {
        userId: from
      },
      data: {
        amount: {
          decrement: amount
        }
      }
    })

    await tx.balance.update({
      where: {
        userId: userId.id
      },
      data: {
        amount: {
          increment: amount
        }
      }
    })
  })
}
