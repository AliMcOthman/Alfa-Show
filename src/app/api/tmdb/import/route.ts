import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {getTrendingMovies, getTrendingTV, type TMDBItem,} from "@/lib/tmdb";

export const runtime = "nodejs";

// TMDB Genre IDs für Filme
const movieGenreMap: Record<number, string> = {
    28: "action",
    12: "adventure",
    16: "animation",
    35: "comedy",
    18: "drama",
    27: "horror",
    878: "science-fiction",
    53: "thriller",
    10749: "romance",
    14: "fantasy",
};

// TMDB Genre IDs für Serien
const tvGenreMap: Record<number, string> = {
    10759: "action",
    16: "animation",
    35: "comedy",
    18: "drama",
    10765: "science-fiction",
};

function convertDate(date?: string): Date | null {
    if (!date) return null;

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return null;
    }

    return parsedDate;
}

async function getCategories(
    genreIds: number[],
    type: "MOVIE" | "SERIES"
) {
    const genreMap = type === "MOVIE"
        ? movieGenreMap
        : tvGenreMap;

    const slugs = genreIds
        .map((id) => genreMap[id])
        .filter((slug) => slug !== undefined);

    return prisma.category.findMany({
        where: {
            slug: {
                in: slugs,
            },
        },
    });
}

async function importItems(
    items: TMDBItem[],
    type: "MOVIE" | "SERIES"
) {
    let imported = 0;

    for (const item of items) {
        const releaseDate = convertDate(
            item.release_date || item.first_air_date
        );

        const year = releaseDate
            ? releaseDate.getFullYear()
            : null;

        const title = item.title || item.name;

        if (!title) continue;
        const categories = await getCategories(
            item.genre_ids,
            type
        );

        await prisma.movie.upsert({
            where: {
                tmdbId: item.id,
            },

            update: {
                categories: {
                    set: categories.map((category) => ({
                        id: category.id,
                    })),
                },
                title,
                originalTitle: item.original_title || item.original_name || null,
                overview: item.overview || null,
                posterPath: item.poster_path,
                backdropPath: item.backdrop_path,
                releaseDate,
                year,
                tmdbRating: item.vote_average,
                tmdbVoteCount: item.vote_count,
                type,
            },

            create: {
                tmdbId: item.id,
                categories: {
                    connect: categories.map((category) => ({
                        id: category.id,
                    })),
                },
                title,
                originalTitle: item.original_title || item.original_name || null,
                overview: item.overview || null,
                posterPath: item.poster_path,
                backdropPath: item.backdrop_path,
                releaseDate,
                year,
                tmdbRating: item.vote_average,
                tmdbVoteCount: item.vote_count,
                type,
            },
        });

        imported++;
    }

    return imported;
}

export async function POST() {
    try {
        const [movies, series] = await Promise.all([
            getTrendingMovies(),
            getTrendingTV(),
        ]);

        const importedMovies = await importItems(
            movies.results,
            "MOVIE"
        );

        const importedSeries = await importItems(
            series.results,
            "SERIES"
        );

        return NextResponse.json({
            success: true,
            message: "TMDB data imported successfully",
            importedMovies,
            importedSeries,
            total: importedMovies + importedSeries,
        });
    } catch (error) {
        console.error("Import Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to import TMDB data",
            },
            { status: 500 }
        );
    }
}
