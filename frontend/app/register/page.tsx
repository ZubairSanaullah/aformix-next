"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Registration failed.");
                return;
            }

            toast.success(data.message);

            setName("");
            setEmail("");
            setPassword("");
        } catch (error) {
            console.error("Registration error:", error);

            toast.error(
                "Something went wrong. Please try again."
            );
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center p-6">
            <div className="w-full max-w-md rounded-xl border p-6 shadow-lg">
                <h1 className="mb-6 text-3xl font-bold">
                    Create Account
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-2 block">
                            Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-md border p-3"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-md border p-3"
                            placeholder="john@example.com"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-md border p-3"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-md bg-black p-3 text-white"
                    >
                        Create Account
                    </button>
                </form>
            </div>
        </main>
    );
}