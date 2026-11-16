import Link from "next/link";

const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

type MovieCardProps = {
    id: string;
    title: string;
    posterPath: string | null;
    year: number | null;
    tmdbRating: number | null;
};

export default function MovieCard({
                                      id,
                                      title,
                                      posterPath,
                                      year,
                                      tmdbRating,
                                  }: MovieCardProps) {
    return (
        <Link
            href={`/movie/${id}`}
            className="group overflow-hidden rounded-xl bg-[#151d30] transition hover:-translate-y-1 hover:shadow-xl"
        >
            {posterPath ? (
                <img
                    src={`${IMAGE_URL}${posterPath}`}
                    alt={title}
                    className="aspect-[2/3] w-full object-cover transition duration-300 group-hover:scale-105"
                />
            ) : (
                <div className="flex aspect-[2/3] items-center justify-center bg-gray-800 text-gray-400">
                    Kein Poster
                </div>
            )}

            <div className="p-3">
                <h3 className="truncate font-semibold">
                    {title}
                </h3>

                <div className="mt-2 flex justify-between text-sm text-gray-400">
                    <span>{year ?? "Unbekannt"}</span>

                    <span className="text-yellow-400">
                        ★ {tmdbRating?.toFixed(1) ?? "–"}
                    </span>
                </div>

                <p className="mt-3 text-sm font-semibold text-blue-400">
                    Details ansehen →
                </p>
            </div>
        </Link>
    );
}
