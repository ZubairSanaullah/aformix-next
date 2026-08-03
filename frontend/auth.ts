import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";

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

                const user = await prisma.user.findUnique({
                    where: {
                        email,
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

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role,
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
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub!;
                session.user.role = token.role as string;
            }

            return session;
        },
    },

    secret: process.env.AUTH_SECRET,
});