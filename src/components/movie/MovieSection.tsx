import MovieCard from "@/components/movie/MovieCard";

type MovieItem = {
    id:string;
    title:string;
    posterPath:string | null;
    year:number | null;
    tmdbRating:number | null;
};

type MovieSectionProps = {
    title:string;
    items:MovieItem[] ;
};

export default function MovieSection({
    title,
    items,
} : MovieSectionProps) {
    return(
        <section className="mb-14">
            <h2 className="mb-6 text-2xl font-bold">
                {title}
            </h2>

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {items.map((item) => (
                    <MovieCard key={item.id} {...item}/>
                ))

                }
            </div>
        </section>
    )
}