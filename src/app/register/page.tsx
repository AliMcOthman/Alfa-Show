"use client";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {

    // Formularwerte
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Statusmeldungen
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error" | "">("");
    const [isLoading, setIsLoading] = useState(false);

    // Formular absenden
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Passwörter vergleichen
        if (password !== confirmPassword) {
            setMessage("Die Passwörter stimmen nicht überein.");
            setMessageType("error");
            return;
        }

        // Ladezustand aktivieren
        setIsLoading(true);
        setMessage("");
        setMessageType("");

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
                setMessage(data.message);
                setMessageType("error");
                return;
            }

            setMessage(data.message);
            setMessageType("success");

        } catch (error) {
            console.error("Registrierungsfehler:", error);
            setMessage("Ein Verbindungsfehler ist aufgetreten.");

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">

            <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-xl">

                <h1 className="mb-2 text-center text-3xl font-bold text-white">
                    Konto erstellen
                </h1>

                <p className="mb-8 text-center text-slate-400">
                    Erstelle dein kostenloses Konto bei alfaShow.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-medium text-slate-300"
                        >
                            Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Dein Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                        />
                    </div>

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

                    {/* Passwort bestätigen */}
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="mb-2 block text-sm font-medium text-slate-300"
                        >
                            Passwort bestätigen
                        </label>

                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Passwort erneut eingeben"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                        />
                    </div>

                    {/* Statusmeldung */}
                    {message && (
                        <p
                            className={`text-sm ${
                                messageType === "success"
                                    ? "text-green-400"
                                    : "text-red-400"
                            }`}
                        >
                            {message}
                        </p>
                    )}

                    {/* Registrieren */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading ? "Wird registriert..." : "Registrieren"}
                    </button>

                </form>

                <p className="mt-6 text-center text-sm text-slate-400">
                    Du hast bereits ein Konto?{" "}
                    <Link
                        href="/login"
                        className="font-medium text-blue-400 hover:text-blue-300"
                    >
                        Jetzt anmelden
                    </Link>
                </p>

            </div>
        </main>
    );
}
