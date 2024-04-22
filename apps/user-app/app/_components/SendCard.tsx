"use client";

import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card"
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/text-input"
import { useState } from "react";
import { P2PTransfer } from "../lib/actions/P2PTransfer";

export const Sendcard = () => {
  const [number, setNumber] = useState<number>();
  const [amount, setAmount] = useState<number>()

  return <div className="h-[90vh]">
    <Center>
      <Card title="Send">
        <div className="min-w-72 pt-2">
          <TextInput placeholder="Number" label="Number" onChange={setNumber} />
          <TextInput placeholder="Amount" label="Amount" onChange={setAmount} />
        </div>
        <div className="pt-4 flex justify-center">
          <Button onClick={async () => {
            await P2PTransfer(String(number), Number(amount) * 100)
          }}>
            Send
          </Button>
        </div>
      </Card>
    </Center>
  </div>
}
