import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    // Aktuelle Sitzung überprüfen
    const session = await auth();

    // Prüfen, ob der Benutzer angemeldet ist
    if (!session?.user?.id) {
        return NextResponse.json(
            { message: "Nicht autorisiert." },
            { status: 401 }
        );
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

    return NextResponse.json(favorites);
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
        const { movieId } = await request.json();

        if (!movieId || typeof movieId !== "string") {
            return NextResponse.json(
                { message: "Ungültige Film-ID." },
                { status: 400 }
            );
        }

        // Prüfen, ob der Film existiert
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

        // Favorit speichern
        const favorite = await prisma.favorite.create({
            data: {
                userId: session.user.id,
                movieId,
            },
        });

        return NextResponse.json(
            {
                message: "Film wurde zu Favoriten hinzugefügt.",
                favorite,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Fehler beim Hinzufügen des Favoriten:", error);

        return NextResponse.json(
            { message: "Film konnte nicht hinzugefügt werden." },
            { status: 500 }
        );
    }
}


export async function DELETE(request: Request) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json(
            { message: "Nicht autorisiert." },
            { status: 401 }
        );
    }

    try {
        const { movieId } = await request.json();

        if (!movieId || typeof movieId !== "string") {
            return NextResponse.json(
                { message: "Ungültige Film-ID." },
                { status: 400 }
            );
        }

        await prisma.favorite.deleteMany({
            where: {
                userId: session.user.id,
                movieId,
            },
        });

        return NextResponse.json({
            message: "Film wurde aus Favoriten entfernt.",
        });

    } catch (error) {
        console.error("Fehler beim Entfernen des Favoriten:", error);

        return NextResponse.json(
            { message: "Film konnte nicht entfernt werden." },
            { status: 500 }
        );
    }
}
