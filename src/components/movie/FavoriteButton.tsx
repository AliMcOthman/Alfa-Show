
"use client";

import { useState } from "react";
import Link from "next/link";

type FavoriteButtonProps = {
    movieId: string;
    initialIsFavorite: boolean;
    isLoggedIn: boolean;
};

export default function FavoriteButton({
                                           movieId,
                                           initialIsFavorite,
                                           isLoggedIn,
                                       }: FavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isLoggedIn) {
        return (
            <Link
                href="/login"
                className="inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
            >
                ❤️ Login zum Speichern
            </Link>
        );
    }

    async function handleFavorite() {
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/favorites", {
                method: isFavorite ? "DELETE" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ movieId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Ein Fehler ist aufgetreten.");
            }

            setIsFavorite(!isFavorite);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Ein Fehler ist aufgetreten."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mt-6">
            <button
                onClick={handleFavorite}
                disabled={loading}
                className={`rounded-lg px-5 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    isFavorite
                        ? "bg-red-600 hover:bg-red-500"
                        : "bg-blue-600 hover:bg-blue-500"
                }`}
            >
                {loading
                    ? "Bitte warten..."
                    : isFavorite
                        ? "💔 Aus Favoriten entfernen"
                        : "❤️ Zu Favoriten hinzufügen"}
            </button>

            {error && (
                <p className="mt-3 text-sm text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}
