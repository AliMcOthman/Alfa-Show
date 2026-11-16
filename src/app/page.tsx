import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/herosection/HeroSection";
import MovieSection from "@/components/movie/MovieSection";

export default async function HomePage() {
    // Filme aus der Datenbank laden
    const movies = await prisma.movie.findMany({
        where: {
            type: "MOVIE",
            status: "PUBLISHED",
        },
        orderBy: {
            tmdbRating: "desc",
        },
        take: 12,
    });

    // Serien aus der Datenbank laden
    const series = await prisma.movie.findMany({
        where: {
            type: "SERIES",
            status: "PUBLISHED",
        },
        orderBy: {
            tmdbRating: "desc",
        },
        take: 12,
    });

    // Besten Film für den Hero-Bereich laden
    const heroMovie = await prisma.movie.findFirst({
        where: {
            type: "MOVIE",
            status: "PUBLISHED",
            backdropPath: {
                not: null,
            },
        },
        orderBy: {
            tmdbRating: "desc",
        },
    });

    return (
        <main className="min-h-screen bg-[#080d1a] px-6 py-10 text-white md:px-12">

            {/* Hero-Bereich */}
            {heroMovie && <HeroSection movie={heroMovie} />}

            {/* Willkommen-Bereich */}
            <section className="mb-14">
                <h1 className="mb-3 text-4xl font-bold">
                    Willkommen bei Alfa-Show
                </h1>

                <p className="text-gray-400">
                    Entdecke Filme und Serien.
                </p>
            </section>

            {/* Beliebte Filme */}
            <MovieSection title="Beliebte Filme" items={movies}/>

            {/* Beliebte Serien */}
            <MovieSection title="Beliebte Serien" items={series}/>

        </main>
    );
}
