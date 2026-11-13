
import Link from "next/link";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080d1a]/95 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">

                {/* Logo */}
                <Link href="/" className="shrink-0 text-2xl font-extrabold tracking-wide">
                    <span className="text-blue-500">ALFA</span>
                    <span className="text-white">-SHOW</span>
                </Link>

                {/* Navigation */}
                <nav className="hidden items-center gap-7 md:flex">
                    <Link href="/" className="text-blue-400 transition hover:text-blue-300">
                        Home
                    </Link>

                    <Link href="/movies" className="text-gray-300 transition hover:text-white">
                        Movies
                    </Link>

                    <Link href="/series" className="text-gray-300 transition hover:text-white">
                        TV Series
                    </Link>

                    <Link href="/categories" className="text-gray-300 transition hover:text-white">
                        Categories
                    </Link>
                </nav>

                {/* Search and Login */}
                <div className="flex items-center gap-3">

                    <form action="/search" method="GET" className="hidden sm:block">
                        <input
                            type="search"
                            name="q"
                            placeholder="Search movies..."
                            className="w-44 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 lg:w-56"
                        />
                    </form>

                    <Link
                        href="/login"
                        className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
                    >
                        Login
                    </Link>

                </div>
            </div>
        </header>
    );
}
