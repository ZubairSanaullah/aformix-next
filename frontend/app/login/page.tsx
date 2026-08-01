"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                toast.error("Invalid email or password.");
                return;
            }

            toast.success("Login successful.");

        } catch (error) {
            console.error("Login error:", error);

            toast.error(
                "Something went wrong. Please try again."
            );
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center p-6">
            <div className="w-full max-w-md rounded-xl border p-6 shadow-lg">
                <h1 className="mb-6 text-3xl font-bold">Login</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-2 block">Email</label>
                        <input
                            type="email"
                            className="w-full rounded-md border p-3"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block">Password</label>
                        <input
                            type="password"
                            className="w-full rounded-md border p-3"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-md bg-black p-3 text-white"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </main>
    );
}