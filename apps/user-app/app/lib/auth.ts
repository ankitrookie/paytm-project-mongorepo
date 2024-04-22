import { userAuthValidationSchema } from "@repo/zod/schemas";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@repo/db/client"
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { type: "text", label: "Phone Number", placeholder: "Phone Number" },
        password: { type: "password", label: "password", placeholder: "1234" }
      },
      async authorize(credentials) {
        const { phone, password } = credentials as {
          phone: string,
          password: string
        };
        console.log(typeof phone)
        const { success } = userAuthValidationSchema.safeParse({ phone, password });

        if (!success) {
          return null;
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const existingUser = await db.user.findFirst({
          where: {
            number: phone
          }
        })

        if (existingUser) {
          const passwordValidation = await bcrypt.compare(password, existingUser.passwod);
          if (passwordValidation) {
            return {
              id: existingUser.id,
              name: existingUser.name,
              email: existingUser.email
            }
          }
          return null;
        }

        try {
          const createUser = await db.user.create({
            data: {
              number: phone,
              passwod: hashPassword
            }
          });

          return {
            id: createUser.id,
            name: createUser.name,
            email: createUser.number
          }

        } catch (error) {
          console.log(error)
        }

        return null;
      }
    })
  ],
  secret: process.env.JWT_SECRT || "secret",
  callbacks: {
    // TODO: can u fix the type here? Using any is bad
    async session({ token, session }: any) {
      session.user.id = token.sub
      return session
    }
  }
}
