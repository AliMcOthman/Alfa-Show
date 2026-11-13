
import Link from "next/link";

type HeroSectionProps = {
    movie: {
        id: string;
        title: string;
        overview: string | null;
        backdropPath: string | null;
        year: number | null;
        tmdbRating: number | null;
    };
};

export default function HeroSection({ movie }: HeroSectionProps) {
    const imageUrl = movie.backdropPath
        ? `https://image.tmdb.org/t/p/original${movie.backdropPath}`
        : null;

    return (
        <section
            className="relative flex min-h-[550px] items-end overflow-hidden bg-[#080d1a] bg-cover bg-center"
            style={
                imageUrl
                    ? { backgroundImage: `url(${imageUrl})` }
                    : undefined
            }
        >
            {/* Dunkler Hintergrund */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#080d1a] via-[#080d1a]/70 to-transparent" />

            <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a] via-transparent to-transparent" />

            {/* Filminformationen */}
            <div className="relative z-10 max-w-2xl px-8 pb-16 md:px-16">

        <span className="mb-4 inline-block rounded-full bg-blue-600 px-4 py-1 text-xs font-bold uppercase tracking-wider">
          Film-Highlight
        </span>

                <h1 className="mb-4 text-4xl font-extrabold text-white md:text-6xl">
                    {movie.title}
                </h1>

                <div className="mb-5 flex items-center gap-4 text-sm text-gray-300">
                    <span>{movie.year ?? "Unbekanntes Jahr"}</span>

                    <span className="text-yellow-400">
            ★ {movie.tmdbRating?.toFixed(1) ?? "Keine Bewertung"}
          </span>

                    <span>Film</span>
                </div>

                <p className="mb-8 line-clamp-3 text-sm leading-7 text-gray-300 md:text-base">
                    {movie.overview || "Entdecke diesen Film auf Alfa-Show."}
                </p>

                <Link
                    href={`/movie/${movie.id}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-500"
                >
                    Details ansehen
                    <span>→</span>
                </Link>

            </div>
        </section>
    );
}
