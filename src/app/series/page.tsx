import { prisma } from "@/lib/prisma";
import MovieSection from "@/components/movie/MovieSection";

export default async function SeriesPage() {

    const series = await prisma.movie.findMany({
        where: {
            type: "SERIES",
            status: "PUBLISHED",
        },
        orderBy: {
            tmdbRating: "desc",
        },
    });

    return (
        <main className="min-h-screen bg-[#080d1a] px-6 py-10 text-white md:px-12">

            <section className="mb-10">
                <h1 className="mb-3 text-4xl font-bold">
                    Alle Serien
                </h1>

                <p className="text-gray-400">
                    Entdecke unsere Sammlung der besten Serien.
                </p>
            </section>

            {series.length > 0 ? (
                <MovieSection
                    title="Beliebte Serien"
                    items={series}
                />
            ) : (
                <p className="rounded-xl bg-[#151d30] p-6 text-gray-400">
                    Zurzeit sind keine Serien verfügbar.
                </p>
            )}

        </main>
    );
}