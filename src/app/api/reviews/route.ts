import {auth} from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const movieId = searchParams.get("movieId");

        if (!movieId) {
            return NextResponse.json(
                { message: "Film-ID fehlt." },
                { status: 400 }
            );
        }

        const reviews = await prisma.review.findMany({
            where: {
                movieId,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(reviews);

    } catch (error) {
        console.error("Fehler beim Laden der Bewertungen:", error);

        return NextResponse.json(
            { message: "Bewertungen konnten nicht geladen werden." },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    // Aktuelle Sitzung überprüfen
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json(
            { message: "Nicht autorisiert." },
            { status: 401 }
        );
    }

    try {
        const { movieId, rating, comment } = await request.json();

        // Eingaben überprüfen
        if (
            !movieId ||
            typeof movieId !== "string" ||
            !Number.isInteger(rating) ||
            rating < 1 ||
            rating > 10 ||
            (comment !== undefined && comment !== null &&
                typeof comment !== "string")
        ) {
            return NextResponse.json(
                { message: "Ungültige Eingaben." },
                { status: 400 }
            );
        }

        // Film überprüfen
        const movie = await prisma.movie.findUnique({
            where: {
                id: movieId,
            },
        });

        if (!movie) {
            return NextResponse.json(
                { message: "Film nicht gefunden." },
                { status: 404 }
            );
        }

        // Prüfen, ob bereits eine Bewertung existiert
        const existingReview = await prisma.review.findUnique({
            where: {
                userId_movieId: {
                    userId: session.user.id,
                    movieId,
                },
            },
        });

        if (existingReview) {
            return NextResponse.json(
                { message: "Du hast diesen Film bereits bewertet." },
                { status: 409 }
            );
        }

        // Neue Bewertung erstellen
        const review = await prisma.review.create({
            data: {
                userId: session.user.id,
                movieId,
                rating,
                comment: comment?.trim() || null,
            },
        });

        return NextResponse.json(
            {
                message: "Bewertung erfolgreich erstellt.",
                review,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Fehler beim Erstellen der Bewertung:", error);

        return NextResponse.json(
            { message: "Bewertung konnte nicht erstellt werden." },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    // Aktuelle Sitzung überprüfen
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json(
            { message: "Nicht autorisiert." },
            { status: 401 }
        );
    }

    try {
        const { movieId, rating, comment } = await request.json();

        // Eingaben überprüfen
        if (
            !movieId ||
            typeof movieId !== "string" ||
            !Number.isInteger(rating) ||
            rating < 1 ||
            rating > 10 ||
            (comment !== undefined && comment !== null &&
                typeof comment !== "string")
        ) {
            return NextResponse.json(
                { message: "Ungültige Eingaben." },
                { status: 400 }
            );
        }

        // Eigene Bewertung suchen
        const existingReview = await prisma.review.findUnique({
            where: {
                userId_movieId: {
                    userId: session.user.id,
                    movieId,
                },
            },
        });

        if (!existingReview) {
            return NextResponse.json(
                { message: "Bewertung nicht gefunden." },
                { status: 404 }
            );
        }

        // Bewertung aktualisieren
        const updatedReview = await prisma.review.update({
            where: {
                userId_movieId: {
                    userId: session.user.id,
                    movieId,
                },
            },
            data: {
                rating,
                comment: comment?.trim() || null,
            },
        });

        return NextResponse.json({
            message: "Bewertung erfolgreich aktualisiert.",
            review: updatedReview,
        });

    } catch (error) {
        console.error("Fehler beim Aktualisieren der Bewertung:", error);

        return NextResponse.json(
            { message: "Bewertung konnte nicht aktualisiert werden." },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    // Aktuelle Sitzung überprüfen
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json(
            { message: "Nicht autorisiert." },
            { status: 401 }
        );
    }

    try {
        const { movieId } = await request.json();

        // Eingaben überprüfen
        if (!movieId || typeof movieId !== "string") {
            return NextResponse.json(
                { message: "Ungültige Eingaben." },
                { status: 400 }
            );
        }

        // Eigene Bewertung suchen
        const existingReview = await prisma.review.findUnique({
            where: {
                userId_movieId: {
                    userId: session.user.id,
                    movieId,
                },
            },
        });

        if (!existingReview) {
            return NextResponse.json(
                { message: "Bewertung nicht gefunden." },
                { status: 404 }
            );
        }

        // Bewertung löschen
        await prisma.review.delete({
            where: {
                userId_movieId: {
                    userId: session.user.id,
                    movieId,
                },
            },
        });

        return NextResponse.json({
            message: "Bewertung erfolgreich gelöscht.",
        });

    } catch (error) {
        console.error("Fehler beim Löschen der Bewertung:", error);

        return NextResponse.json(
            { message: "Bewertung konnte nicht gelöscht werden." },
            { status: 500 }
        );
    }
}

