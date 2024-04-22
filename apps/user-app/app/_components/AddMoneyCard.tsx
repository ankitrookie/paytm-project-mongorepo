"use client";

import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { TextInput } from "@repo/ui/text-input";
import { useState } from "react";
import { CreateOnRampTransection } from "../lib/CreateonRamptrx";

const SUPPORTED_BANK = [{
  name: "HDFC Bank",
  redirectUrl: "https://netbanking.hdfcbank.com"
}, {
  name: "Axis Bank",
  redirectUrl: "https://www.axisbank.com/"
}];

export const AddMoney = () => {
  const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANK[0]?.redirectUrl);
  const [amount, setAmount] = useState<number>(0);
  const [provider, setProvider] = useState<string>(SUPPORTED_BANK[0]?.name || "");

  console.log(provider)
  return <Card title="Add Money" >
    <TextInput placeholder="Amount" label="Amount" onChange={setAmount} />

    <div className="py-4 text-left">
      Bank
    </div>

    <Select
      onSelect={(value) => {
        setProvider(SUPPORTED_BANK.find(x => x.name === value)?.name || " ")
        setRedirectUrl(SUPPORTED_BANK.find(x => x.name === value)?.name || " ")
      }}
      options={SUPPORTED_BANK.map(x => ({
        key: x.name,
        value: x.redirectUrl
      }))}
    />

    <div className="flex justify-center pt-4">
      <Button onClick={() => {
        CreateOnRampTransection(amount * 100, provider);
        window.location.href = redirectUrl || ""
      }}>
        Add money
      </Button>
    </div>
  </Card>
}
