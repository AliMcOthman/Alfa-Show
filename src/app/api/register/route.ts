import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        // Eingabedaten überprüfen
        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Alle Felder sind erforderlich." },
                { status: 400 }
            );
        }

        // E-Mail-Adresse normalisieren
        const normalizedEmail = email.trim().toLowerCase();

        // Prüfen, ob der Benutzer bereits existiert
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "Diese E-Mail-Adresse ist bereits registriert." },
                { status: 409 }
            );
        }

        // Passwort verschlüsseln (Hash erstellen)
        const hashedPassword = await hash(password, 12);

        // Neuen Benutzer erstellen
        const user = await prisma.user.create({
            data: {
                name: name.trim(),
                email: normalizedEmail,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });

        return NextResponse.json(
            {
                message: "Das Konto wurde erfolgreich erstellt.",
                user,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Fehler bei der Registrierung:", error);

        return NextResponse.json(
            { message: "Ein interner Serverfehler ist aufgetreten." },
            { status: 500 }
        );
    }
}
