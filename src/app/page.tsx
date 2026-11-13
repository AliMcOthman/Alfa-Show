import { prisma } from "@/lib/prisma";
import Link from "next/link";
import HeroSection from "@/components/herosection/HeroSection";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

export default async function HomePage() {
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

            {heroMovie && <HeroSection movie={heroMovie} />}

            <section className="mb-14">
                <h1 className="mb-3 text-4xl font-bold">
                    Willkommen bei Alfa-Show
                </h1>

                <p className="text-gray-400">
                    Entdecke Sie die Filme und Serien.
                </p>
            </section>

            <MovieSection title="Popular Movies" items={movies} />

            <MovieSection title="Popular TV Series" items={series} />

        </main>
    );
}

function MovieSection({
                          title,
                          items,
                      }: {
    title: string;
    items: {
        id: string;
        title: string;
        posterPath: string | null;
        year: number | null;
        tmdbRating: number | null;
    }[];
}) {
    return (
        <section className="mb-14">
            <h2 className="mb-6 text-2xl font-bold">
                {title}
            </h2>

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">

                {items.map((item) => (
                    <Link
                        key={item.id}
                        href={`/movie/${item.id}`}
                        className="group overflow-hidden rounded-xl bg-[#151d30] transition hover:-translate-y-1 hover:shadow-xl"
                    >
                        {item.posterPath ? (
                            <img
                                src={`${IMAGE_URL}${item.posterPath}`}
                                alt={item.title}
                                className="aspect-[2/3] w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex aspect-[2/3] items-center justify-center bg-gray-800 text-gray-400">
                                Kein Poster
                            </div>
                        )}

                        <div className="p-3">
                            <h3 className="truncate font-semibold">
                                {item.title}
                            </h3>

                            <div className="mt-2 flex justify-between text-sm text-gray-400">
                                <span>{item.year ?? "Unbekannt"}</span>

                                <span className="text-yellow-400">
                                    ★ {item.tmdbRating?.toFixed(1) ?? "–"}
                                </span>
                            </div>

                            <p className="mt-3 text-sm font-semibold text-blue-400">
                                Details ansehen →
                            </p>
                        </div>
                    </Link>
                ))}

            </div>
        </section>
    );
}
