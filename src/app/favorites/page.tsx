
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import MovieSection from "@/components/movie/MovieSection";

export default async function FavoritesPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    // Favoriten des aktuellen Benutzers abrufen
    const favorites = await prisma.favorite.findMany({
        where: {
            userId: session.user.id,
        },
        include: {
            movie: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const movies = favorites.map((favorite) => ({
        id: favorite.movie.id,
        title: favorite.movie.title,
        posterPath: favorite.movie.posterPath,
        year: favorite.movie.year,
        tmdbRating: favorite.movie.tmdbRating,
    }));

    return (
        <main className="mx-auto min-h-screen max-w-7xl px-6 py-10">
            <h1 className="mb-8 text-3xl font-bold text-white">
                Meine Favoriten
            </h1>

            {movies.length === 0 ? (
                <p className="text-gray-400">
                    Du hast noch keine Favoriten hinzugefügt.
                </p>
            ) : (
                <MovieSection
                    title="Meine gespeicherten Filme"
                    items={movies}
                />
            )}
        </main>
    );
}
