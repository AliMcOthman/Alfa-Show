"use client";
import {signIn} from "next-auth/react";
import Link from "next/link";
import type {FormEvent} from "react";
import { useState} from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);
        setMessage("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setMessage("E-Mail-Adresse oder Passwort ist falsch.");
                return;
            }

            window.location.href = "/";

        } catch (error) {
            console.error("Anmeldefehler:", error);
            setMessage("Ein Verbindungsfehler ist aufgetreten.");

        } finally {
            setIsLoading(false);
        }
    };
    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">

            <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-xl">

                <h1 className="mb-2 text-center text-3xl font-bold text-white">
                    Willkommen zurück
                </h1>

                <p className="mb-8 text-center text-slate-400">
                    Melde dich bei alfaShow an.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* E-Mail */}
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-slate-300"
                        >
                            E-Mail-Adresse
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                        />
                    </div>

                    {/* Passwort */}
                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-slate-300"
                        >
                            Passwort
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Passwort eingeben"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                        />
                    </div>
                    {message && (
                        <p className="text-sm text-red-400">
                            {message}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        {isLoading ? "Wird angemeldet..." : "Anmelden" }
                    </button>

                </form>

                <p className="mt-6 text-center text-sm text-slate-400">
                    Du hast noch kein Konto?{" "}
                    <Link
                        href="/register"
                        className="font-medium text-blue-400 hover:text-blue-300"
                    >
                        Jetzt registrieren
                    </Link>
                </p>

            </div>
        </main>
    );
}
