"use client";
import React, {useEffect, useState} from "react";
import Link from "next/link";
type SearchResult = {
    id:string;
    title:string;
    posterPath:string | null;
    year: number |null ;
    tmdbRating: number | null;
    type: string;
}
export default function SearchInput() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searched, setSearched] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            searchMovies(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);
    async function searchMovies(value: string) {
        if (!value.trim()) {
            setResults([]);
            setSearched(false)
            return;
        }

        const response = await fetch(
            `/api/search?q=${encodeURIComponent(value)}`
        );

        const data: SearchResult[] = await response.json();

        setResults(data);
        setSearched(true);
    }
    return (
        <div className="relative">
            <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Filme und Serien suchen..."
                className="w-56 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            {searchTerm.trim() !== "" && searched && (
                <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-white/10 bg-[#151d30] shadow-xl">

                    {results.length > 0 ? (
                        <>
                            {results.map((movie) => (
                                <Link
                                    key={movie.id}
                                    href={`/movie/${movie.id}`}
                                    onClick={() => {
                                        setSearchTerm("");
                                        setResults([]);
                                        setSearched(false);
                                    }}
                                    className="block border-b border-white/10 px-4 py-3 transition hover:bg-white/10 last:border-0"
                                >
                                    <div className="flex items-center gap-3">

                                        {movie.posterPath ? (
                                            <img
                                                src={`https://image.tmdb.org/t/p/w92${movie.posterPath}`}
                                                alt={movie.title}
                                                className="h-16 w-11 rounded object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-16 w-11 items-center justify-center rounded bg-gray-700 text-xs text-gray-400">
                                                Kein Bild
                                            </div>
                                        )}

                                        <div>
                                            <p className="font-semibold text-white">
                                                {movie.title}
                                            </p>

                                            <p className="text-sm text-gray-400">
                                                {movie.year ?? "Unbekannt"} · {movie.type === "MOVIE" ? "Film" : "Serie"}
                                            </p>

                                            <p className="mt-1 text-sm text-yellow-400">
                                                ★ {movie.tmdbRating?.toFixed(1) ?? "Keine Bewertung"}
                                            </p>
                                        </div>

                                    </div>
                                </Link>
                            ))}

                            <Link
                                href={`/search?q=${encodeURIComponent(searchTerm)}`}
                                onClick={() => {
                                    setSearchTerm("");
                                    setResults([]);
                                    setSearched(false);
                                }}
                                className="block border-t border-white/10 px-4 py-3 text-center text-sm font-semibold text-blue-400 transition hover:bg-white/10 hover:text-blue-300"
                            >
                                Alle Ergebnisse anzeigen →
                            </Link>
                        </>
                    ) : (
                        <p className="px-4 py-5 text-center text-sm text-gray-400">
                            Keine Ergebnisse gefunden.
                        </p>
                    )}

                </div>
            )}
        </div>
    );
}