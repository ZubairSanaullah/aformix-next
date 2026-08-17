import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";

export class EmailNotVerifiedError extends CredentialsSignin {
    code = "email_not_verified";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),

    session: {
        strategy: "jwt",
    },

    providers: [
        Credentials({
            name: "Credentials",

            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },

            async authorize(credentials) {
                const result = loginSchema.safeParse(credentials);

                if (!result.success) {
                    return null;
                }

                const { email, password } = result.data;
                const normalizedEmail = email.trim().toLowerCase();

                const user = await prisma.user.findUnique({
                    where: {
                        email: normalizedEmail,
                    },
                });

                if (!user || !user.password) {
                    return null;
                }

                const passwordMatches = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!passwordMatches) {
                    return null;
                }

                if (!user.emailVerified) {
                    throw new EmailNotVerifiedError();
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role,
                    emailVerified: user.emailVerified,
                };
            },
        }),
    ],

    pages: {
        signIn: "/login",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.emailVerified = user.emailVerified;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub!;
                session.user.role = token.role as string;
                session.user.emailVerified = (token.emailVerified as Date | null) ?? null;
            }

            return session;
        },
    },

    secret: process.env.AUTH_SECRET,
});