const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const token = process.env.TMDB_BEARER_TOKEN;

if (!token) {
    throw new Error("TMDB_BEARER_TOKEN is missing from .env.local");
}


export type TMDBItem = {
    id: number;

    title?: string;
    name?: string;

    original_title?: string;
    original_name?: string;

    overview: string;

    poster_path: string | null;
    backdrop_path: string | null;

    release_date?: string;
    first_air_date?: string;

    vote_average: number;
    vote_count: number;
};


type TMDBResponse = {
    page: number;
    results: TMDBItem[];
    total_pages: number;
    total_results: number;
};

async function tmdbFetch(endpoint: string): Promise<TMDBResponse> {
    const response = await fetch(`${TMDB_BASE_URL}${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`TMDB API Error: ${response.status}`);
    }

    return response.json();
}

export async function getTrendingMovies() {
    return tmdbFetch("/trending/movie/week?language=de-DE");
}

export async function getTrendingTV() {
    return tmdbFetch("/trending/tv/week?language=de-DE");
}
