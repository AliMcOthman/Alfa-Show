import { prisma } from "@/lib/prisma";
import MovieSection from "@/components/movie/MovieSection";

type Props = {
    searchParams: Promise<{
        q?: string;
    }>;
};

export default async function SearchPage({ searchParams }: Props) {
    const { q } = await searchParams;

    const searchTerm = q?.trim() ?? "";

    const results = searchTerm
        ? await prisma.movie.findMany({
            where: {
                status: "PUBLISHED",
                title: {
                    contains: searchTerm,
                },
            },
            orderBy: {
                tmdbRating: "desc",
            },
            take: 24,
        })
        : [];

    return (
        <main className="min-h-screen bg-[#080d1a] px-6 py-10 text-white md:px-12">

            <h1 className="mb-3 text-3xl font-bold">
                Suchergebnisse
            </h1>

            {searchTerm ? (
                <p className="mb-8 text-gray-400">
                    Ergebnisse für: "{searchTerm}"
                </p>
            ) : (
                <p className="mb-8 text-gray-400">
                    Bitte gib einen Filmtitel oder Seriennamen ein.
                </p>
            )}

            {results.length > 0 ? (
                <MovieSection
                    title="Gefundene Filme und Serien"
                    items={results}
                />
            ) : searchTerm ? (
                <p className="rounded-xl bg-[#151d30] p-6 text-gray-400">
                    Keine Ergebnisse gefunden.
                </p>
            ) : null}

        </main>
    );
}
