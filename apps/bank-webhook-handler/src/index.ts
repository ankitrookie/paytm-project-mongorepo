import express, { Request, Response, Express } from "express";
import db from "@repo/db/client";
import { webhookValidationSchema } from "@repo/zod/schemas";

const app: Express = express();
app.use(express.json());

app.post("/hdfcwebhook", (req: Request, res: Response) => {
  const { token, user_identifier, amount } = req.body;
  console.log(token, user_identifier, amount)

  const { success } = webhookValidationSchema.safeParse({ token, user_identifier, amount });

  if (!success) {
    res.status(411).json({
      message: "Invalid Inputs!"
    })
    return;
  }
  // so high level this webhook does two very importet thing, 1st -> it will update  the balance of the the user in primary database, 2nd -> it will also update onRampTranseaction 
  // where we keep track of the user transeaction, if it is success or failur etc (History track) -> 

  try {
    // transection api hook to make updation at all together
    db.$transaction([
      db.balance.updateMany({
        where: {
          userId: user_identifier
        },
        data: {
          amount: {
            increment: Number(amount)
          }
        }
      }),
      db.onRampTransaction.updateMany({
        where: {
          token: token
        },
        data: {
          status: "Success"
        }
      })
    ]);

    res.json({
      message: "Captured"
    })
  } catch (error) {
    // catch error 
    console.log(error);
    res.status(411).json({
      message: "Error while processing webhoook"
    })
  }
});

app.listen(3005, () => {
  console.log(`PORT is running at http://localhost:3005`);
})


