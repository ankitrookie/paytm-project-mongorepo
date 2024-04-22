"use server";

import { getServerSession } from "next-auth"
import { authOptions } from "./auth"
import db from "@repo/db/client";

export const CreateOnRampTransection = async (amount: number, provider: string) => {
  const session = await getServerSession(authOptions);
  const token = Math.random().toString()
  const userId = session?.user?.id;

  if (!userId) {
    return {
      message: "You'r not loggedin."
    }
  }

  await db.onRampTransaction.create({
    data: {
      userId: userId,
      status: "Processing",
      startTime: new Date(),
      provider: provider,
      amount: amount * 100,
      token: token
    }
  })

  return {
    message: "On ramp transection addes"
  }
}
