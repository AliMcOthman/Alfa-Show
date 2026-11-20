
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
    params: Promise<{
        slug: string;
    }>;
    searchParams: Promise<{
        type?: string;
    }>;
};

export default async function CategoryPage({
                                               params,
                                               searchParams,
                                           }: Props) {
    const { slug } = await params;
    const { type } = await searchParams;

    const selectedType =
        type === "MOVIE" || type === "SERIES"
            ? type
            : undefined;

    // Find category
    const category = await prisma.category.findUnique({
        where: {
            slug,
        },
    });

    if (!category) {
        notFound();
    }

    // Get movies and series
    const movies = await prisma.movie.findMany({
        where: {
            categories: {
                some: {
                    id: category.id,
                },
            },
            status: "PUBLISHED",
            ...(selectedType && {
                type: selectedType,
            }),
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    // Count all, movies and series
    const [allCount, moviesCount, seriesCount] = await Promise.all([
        prisma.movie.count({
            where: {
                categories: {
                    some: {
                        id: category.id,
                    },
                },
                status: "PUBLISHED",
            },
        }),

        prisma.movie.count({
            where: {
                categories: {
                    some: {
                        id: category.id,
                    },
                },
                status: "PUBLISHED",
                type: "MOVIE",
            },
        }),

        prisma.movie.count({
            where: {
                categories: {
                    some: {
                        id: category.id,
                    },
                },
                status: "PUBLISHED",
                type: "SERIES",
            },
        }),
    ]);

    return (
        <main className="container mx-auto px-4 py-10">

            {/* Category Title */}
            <h1 className="mb-4 text-3xl font-bold">
                {category.name}
            </h1>

            {/* Movies Count */}
            <p className="mb-8 text-gray-400">
                {movies.length} Titel
            </p>

            {/* Filters */}
            <div className="mb-8 flex flex-wrap gap-3">

                <Link
                    href={`/categories/${slug}`}
                    className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
                        !selectedType
                            ? "bg-blue-600 text-white"
                            : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                    }`}
                >
                    Alle ({allCount})
                </Link>

                <Link
                    href={`/categories/${slug}?type=MOVIE`}
                    className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
                        selectedType === "MOVIE"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                    }`}
                >
                    Filme ({moviesCount})
                </Link>

                <Link
                    href={`/categories/${slug}?type=SERIES`}
                    className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
                        selectedType === "SERIES"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                    }`}
                >
                    Serien ({seriesCount})
                </Link>

            </div>

            {/* Movies Grid */}
            {movies.length === 0 ? (
                <p className="text-gray-400">
                    Keine Filme oder Serien in dieser Kategorie gefunden.
                </p>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

                    {movies.map((movie) => (
                        <Link
                            key={movie.id}
                            href={`/movie/${movie.id}`}
                            className="group overflow-hidden rounded-xl bg-slate-800 transition duration-300 hover:-translate-y-1 hover:bg-slate-700"
                        >

                            {/* Poster */}
                            {movie.posterPath && (
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                                    alt={movie.title}
                                    className="mb-3 aspect-[2/3] w-full rounded-md object-cover"
                                />
                            )}

                            {/* Type */}
                            <span className="mx-3 inline-block rounded bg-blue-600 px-2 py-1 text-xs font-semibold">
                                {movie.type === "MOVIE" ? "Film" : "Serie"}
                            </span>

                            {/* Title */}
                            <h2 className="px-3 font-semibold">
                                {movie.title}
                            </h2>

                            {/* Year */}
                            <p className="mt-2 px-3 text-sm text-gray-400">
                                {movie.year ?? "–"}
                            </p>

                            {/* Rating */}
                            {movie.tmdbRating !== null && (
                                <p className="mt-2 px-3 pb-3 text-sm text-yellow-400">
                                    ★ {movie.tmdbRating.toFixed(1)} / 10
                                </p>
                            )}

                        </Link>
                    ))}

                </div>
            )}

        </main>
    );
}
