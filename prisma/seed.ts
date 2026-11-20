import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
    adapter,
});

const categories = [
    { name: "Action", slug: "action" },
    { name: "Abenteuer", slug: "adventure" },
    { name: "Animation", slug: "animation" },
    { name: "Comedy", slug: "comedy" },
    { name: "Drama", slug: "drama" },
    { name: "Horror", slug: "horror" },
    { name: "Science-Fiction", slug: "science-fiction" },
    { name: "Thriller", slug: "thriller" },
    { name: "Romantik", slug: "romance" },
    { name: "Fantasy", slug: "fantasy" },
];

async function main() {
    for (const category of categories) {
        await prisma.category.upsert({
            where: {
                slug: category.slug,
            },
            update: {
                name: category.name,
            },
            create: category,
        });
    }

    console.log("Kategorien wurden erfolgreich erstellt!");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
