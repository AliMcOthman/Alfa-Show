import { NextResponse } from "next/server";
import {getTrendingMovies, getTrendingTV,} from "@/lib/tmdb";

export async function GET() {
    try {
        const [movies, series] = await Promise.all([
            getTrendingMovies(),
            getTrendingTV(),
        ]);

        return NextResponse.json({
            success: true,
            movies: movies.results,
            series: series.results,
        });
    } catch (error) {
        console.error("TMDB Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch data from TMDB",
            },
            { status: 500 }
        );
    }
}
