import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CategoriesPage() {

    const categories = await prisma.category.findMany({
        orderBy: {
            name: "asc",
        },
    });

    return (
        <main className="min-h-screen bg-[#080d1a] px-6 py-10 text-white md:px-12">

            <section className="mb-10">
                <h1 className="mb-3 text-4xl font-bold">
                    Kategorien
                </h1>

                <p className="text-gray-400">
                    Entdecke Filme und Serien nach Kategorien.
                </p>
            </section>

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

                {categories.map((category) => (
                    <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        className="rounded-xl border border-white/10 bg-[#151d30] p-6 text-center transition hover:border-blue-500 hover:bg-[#1c2942]"
                    >
                        <h2 className="text-lg font-semibold">
                            {category.name}
                        </h2>
                    </Link>
                ))}

            </div>

        </main>
    );
}