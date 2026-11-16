import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const searchTerm = searchParams.get("q")?.trim();

    if (!searchTerm) {
        return NextResponse.json([]);
    }

    const results = await prisma.movie.findMany({
        where: {
            status: "PUBLISHED",
            title: {
                contains: searchTerm,
            },
        },
        orderBy: {
            tmdbRating: "desc",
        },
        take: 6,
        select: {
            id: true,
            title: true,
            posterPath: true,
            year: true,
            tmdbRating: true,
            type: true,
        },
    });

    return NextResponse.json(results);
}