import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

const IMAGE_URL = "https://image.tmdb.org/t/p/original";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function MovieDetailsPage({ params }: Props) {
    const { id } = await params;

    const movie = await prisma.movie.findUnique({
        where: {
            id,
        },
        include: {
            categories: true,
            watchLinks: true,
        },
    });

    if (!movie) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#080d1a] text-white">


            {/* Movie Backdrop */}
            <section
                className="relative flex min-h-[550px] items-end overflow-hidden bg-cover bg-center md:min-h-[650px]"
                style={
                    movie.backdropPath
                        ? {
                            backgroundImage: `url(${IMAGE_URL}${movie.backdropPath})`,
                        }
                        : {
                            backgroundColor: "#151d30",
                        }
                }
            >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a] via-[#080d1a]/70 to-[#080d1a]/20" />

                <div className="absolute inset-0 bg-gradient-to-r from-[#080d1a]/90 via-transparent to-transparent" />

                {/* Movie Content */}
                <div className="relative z-10 max-w-4xl px-6 pb-16 pt-28 md:px-16 md:pb-20">

                    <Link
                        href="/"
                        className="mb-10 inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm text-gray-200 backdrop-blur-sm transition hover:bg-white/20"
                    >
                        ← Zurück zur Startseite
                    </Link>

                    <div className="mb-5">
                        <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold">
                            {movie.type === "MOVIE" ? "Film" : "Serie"}
                        </span>
                    </div>

                    <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-6xl">
                        {movie.title}
                    </h1>

                    <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-200">

                        <span>{movie.year ?? "Unbekanntes Jahr"}</span>

                        {movie.runtime && (
                            <span>{movie.runtime} Minuten</span>
                        )}

                        <span className="font-semibold text-yellow-400">
                ★ {movie.tmdbRating?.toFixed(1) ?? "Keine Bewertung"}
            </span>

                    </div>

                    <p className="max-w-2xl text-base leading-8 text-gray-300 md:text-lg">
                        {movie.overview || "Für diesen Film ist keine Beschreibung verfügbar."}
                    </p>

                </div>
            </section>


            {/* Movie Information */}
            <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[250px_1fr]">

                {/* Poster */}
                <div>
                    {movie.posterPath ? (
                        <img
                            src={`${IMAGE_URL}${movie.posterPath}`}
                            alt={movie.title}
                            className="w-full rounded-xl shadow-2xl"
                        />
                    ) : (
                        <div className="flex aspect-[2/3] items-center justify-center rounded-xl bg-gray-800 text-gray-400">
                            Kein Poster verfügbar
                        </div>
                    )}
                </div>

                {/* Details */}
                <div>

                    <h2 className="mb-5 text-2xl font-bold">
                        Filminformationen
                    </h2>

                    <div className="mb-8 space-y-4 text-gray-300">

                        <p>
                            <span className="font-semibold text-white">Titel:</span>{" "}
                            {movie.title}
                        </p>

                        <p>
                            <span className="font-semibold text-white">Erscheinungsjahr:</span>{" "}
                            {movie.year ?? "Unbekannt"}
                        </p>

                        <p>
                            <span className="font-semibold text-white">Laufzeit:</span>{" "}
                            {movie.runtime ? `${movie.runtime} Minuten` : "Nicht verfügbar"}
                        </p>

                        <p>
                            <span className="font-semibold text-white">TMDB-Bewertung:</span>{" "}
                            {movie.tmdbRating?.toFixed(1) ?? "Keine Bewertung"}
                        </p>

                    </div>

                    {/* Categories */}
                    <h2 className="mb-4 text-xl font-bold">
                        Kategorien
                    </h2>

                    <div className="mb-10 flex flex-wrap gap-2">
                        {movie.categories.length > 0 ? (
                            movie.categories.map((category) => (
                                <span
                                    key={category.id}
                                    className="rounded-full bg-blue-600/20 px-4 py-2 text-sm text-blue-300"
                                >
                  {category.name}
                </span>
                            ))
                        ) : (
                            <span className="text-gray-400">
                Keine Kategorien verfügbar
              </span>
                        )}
                    </div>

                    {/* Watch Links */}
                    <h2 className="mb-4 text-xl font-bold">
                        Wo kann ich diesen Film ansehen?
                    </h2>

                    <div className="flex flex-wrap gap-3">
                        {movie.watchLinks.length > 0 ? (
                            movie.watchLinks.map((link) => (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-lg bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500"
                                >
                                    {link.name} ↗
                                </a>
                            ))
                        ) : (
                            <p className="text-gray-400">
                                Zurzeit sind keine Streaming-Links verfügbar.
                            </p>
                        )}
                    </div>

                </div>
            </section>

        </main>
    );
}
