"use client";

import { useEffect, useState } from "react";

type Review = {
    id: string;
    rating: number;
    comment: string | null;
    userId: string;
    movieId: string;
    user: {
        name: string | null;
        image: string | null;
    };
    createdAt: string;
};

type ReviewSectionProps = {
    movieId: string;
    isLoggedIn: boolean;
    currentUserId: string | null;
};

export default function ReviewSection({
                                          movieId,
                                          isLoggedIn,
                                          currentUserId,
                                      }: ReviewSectionProps) {

    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Neues Review
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [formMessage, setFormMessage] = useState("");

    // Review bearbeiten
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editRating, setEditRating] = useState(0);
    const [editHoverRating, setEditHoverRating] = useState(0);
    const [editComment, setEditComment] = useState("");
    const [updating, setUpdating] = useState(false);

    // Review löschen
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Bewertungen laden
    async function fetchReviews() {
        try {
            setError("");

            const response = await fetch(
                `/api/reviews?movieId=${movieId}`
            );

            if (!response.ok) {
                throw new Error(
                    "Bewertungen konnten nicht geladen werden."
                );
            }

            const data: Review[] = await response.json();
            setReviews(data);

        } catch (error) {
            console.error(error);
            setError(
                "Bewertungen konnten nicht geladen werden."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchReviews();
    }, [movieId]);

    // Neues Review erstellen
    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (rating === 0) {
            setFormMessage("Bitte wähle eine Bewertung aus.");
            return;
        }

        try {
            setSubmitting(true);
            setFormMessage("");

            const response = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    movieId,
                    rating,
                    comment,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Fehler beim Speichern."
                );
            }

            setComment("");
            setRating(0);
            setFormMessage("Bewertung erfolgreich erstellt.");

            await fetchReviews();

        } catch (error) {
            setFormMessage(
                error instanceof Error
                    ? error.message
                    : "Ein Fehler ist aufgetreten."
            );
        } finally {
            setSubmitting(false);
        }
    }

    // Review bearbeiten starten
    function handleEdit(review: Review) {
        setEditingId(review.id);
        setEditRating(review.rating);
        setEditComment(review.comment || "");
        setEditHoverRating(0);
    }

    // Review aktualisieren
    async function handleUpdate(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (editRating === 0) {
            return;
        }

        try {
            setUpdating(true);

            const response = await fetch("/api/reviews", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    movieId,
                    rating: editRating,
                    comment: editComment,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Fehler beim Aktualisieren."
                );
            }

            setEditingId(null);
            await fetchReviews();

        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "Ein Fehler ist aufgetreten."
            );
        } finally {
            setUpdating(false);
        }
    }

    // Review löschen
    async function handleDelete() {
        const confirmed = window.confirm(
            "Möchtest du deine Bewertung wirklich löschen?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(currentUserId);

            const response = await fetch("/api/reviews", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    movieId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Fehler beim Löschen."
                );
            }

            setEditingId(null);
            await fetchReviews();

        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "Ein Fehler ist aufgetreten."
            );
        } finally {
            setDeletingId(null);
        }
    }

    // Sterne-Komponente
    function renderStars(
        selectedRating: number,
        hover: number,
        onSelect: (value: number) => void,
        onHover: (value: number) => void,
        onLeave: () => void
    ) {
        return (
            <div className="flex flex-wrap items-center gap-1">
                {Array.from({ length: 10 }, (_, index) => {
                    const starValue = index + 1;

                    return (
                        <button
                            key={starValue}
                            type="button"
                            onClick={() => onSelect(starValue)}
                            onMouseEnter={() => onHover(starValue)}
                            onMouseLeave={onLeave}
                            className="text-2xl transition-transform hover:scale-110"
                            aria-label={`${starValue} von 10 Sternen`}
                        >
                            <span
                                className={
                                    starValue <= (hover || selectedRating)
                                        ? "text-yellow-400"
                                        : "text-gray-600"
                                }
                            >
                                ★
                            </span>
                        </button>
                    );
                })}
            </div>
        );
    }

    if (loading) {
        return (
            <section className="mt-12">
                <p className="text-gray-400">
                    Bewertungen werden geladen...
                </p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="mt-12">
                <p className="text-red-500">{error}</p>
            </section>
        );
    }

    return (
        <section className="mt-12">

            {/* Bewertungsformular */}
            {isLoggedIn && (
                <form
                    onSubmit={handleSubmit}
                    className="w-4/5 mx-auto bg-gray-800/70 border border-gray-700 rounded-2xl p-5 mb-8"
                >
                    <h2 className="text-2xl font-bold mb-6">
                        Bewertungen ({reviews.length})
                    </h2>

                    <h3 className="text-lg font-semibold mb-2">
                        Film bewerten
                    </h3>

                    <p className="text-gray-400 text-sm mb-4">
                        Wie hat dir dieser Film gefallen?
                    </p>

                    {renderStars(
                        rating,
                        hoverRating,
                        setRating,
                        setHoverRating,
                        () => setHoverRating(0)
                    )}

                    <p className="text-yellow-400 text-sm mb-5 mt-2">
                        {rating > 0
                            ? `${rating} / 10 Sterne`
                            : "Noch keine Bewertung ausgewählt"}
                    </p>

                    <label className="block mb-2 font-medium">
                        Dein Kommentar
                    </label>

                    <textarea
                        value={comment}
                        onChange={(event) =>
                            setComment(event.target.value)
                        }
                        placeholder="Schreibe deine Meinung zum Film..."
                        rows={3}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y mb-4"
                    />

                    <button
                        type="submit"
                        disabled={submitting || rating === 0}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-5 py-2.5 rounded-lg font-medium transition"
                    >
                        {submitting
                            ? "Wird gespeichert..."
                            : "Bewertung absenden"}
                    </button>

                    {formMessage && (
                        <p className="mt-3 text-sm text-gray-300">
                            {formMessage}
                        </p>
                    )}
                </form>
            )}

            {/* Bewertungen anzeigen */}
            <div className="w-4/5 mx-auto space-y-4 pb-12">

                <h2 className="text-2xl font-bold mb-6">
                    Alle Bewertungen ({reviews.length})
                </h2>

                {reviews.length === 0 ? (
                    <p className="text-gray-400">
                        Noch keine Bewertungen vorhanden.
                    </p>
                ) : (
                    reviews.map((review) => (
                        <article
                            key={review.id}
                            className="bg-gray-800 border border-gray-700 rounded-xl p-5"
                        >

                            {/* Bearbeitungsmodus */}
                            {editingId === review.id ? (
                                <form onSubmit={handleUpdate}>

                                    <h3 className="font-semibold mb-4">
                                        Bewertung bearbeiten
                                    </h3>

                                    {renderStars(
                                        editRating,
                                        editHoverRating,
                                        setEditRating,
                                        setEditHoverRating,
                                        () => setEditHoverRating(0)
                                    )}

                                    <p className="text-yellow-400 text-sm mt-2 mb-4">
                                        {editRating}/10 Sterne
                                    </p>

                                    <textarea
                                        value={editComment}
                                        onChange={(event) =>
                                            setEditComment(event.target.value)
                                        }
                                        rows={3}
                                        placeholder="Dein Kommentar..."
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                                    />

                                    <div className="flex gap-3">
                                        <button
                                            type="submit"
                                            disabled={updating || editRating === 0}
                                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg text-sm"
                                        >
                                            {updating
                                                ? "Wird gespeichert..."
                                                : "Speichern"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setEditingId(null)}
                                            className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg text-sm"
                                        >
                                            Abbrechen
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    {/* Review-Informationen */}
                                    <div className="flex justify-between items-center gap-3 mb-3">
                                        <h3 className="font-semibold">
                                            {review.user.name ||
                                                "Unbekannter Benutzer"}
                                        </h3>

                                        <span className="text-yellow-400 font-bold whitespace-nowrap">
                                            {"★".repeat(review.rating)}
                                            <span className="text-gray-600">
                                                {"★".repeat(10 - review.rating)}
                                            </span>
                                            <span className="ml-2 text-sm">
                                                {review.rating}/10
                                            </span>
                                        </span>
                                    </div>

                                    {review.comment && (
                                        <p className="text-gray-300 mb-4 whitespace-pre-wrap">
                                            {review.comment}
                                        </p>
                                    )}

                                    <p className="text-gray-500 text-xs mb-4">
                                        {new Date(
                                            review.createdAt
                                        ).toLocaleDateString("de-DE")}
                                    </p>

                                    {/* Eigene Bewertung bearbeiten/löschen */}
                                    {currentUserId === review.userId && (
                                        <div className="flex gap-3 border-t border-gray-700 pt-4">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleEdit(review)
                                                }
                                                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                                            >
                                                <span className="mr-1">✏️</span>
                                                Bearbeiten
                                            </button>

                                            <button
                                                type="button"
                                                onClick={handleDelete}
                                                disabled={deletingId === currentUserId}
                                                className="text-red-400 hover:text-red-300 disabled:opacity-50 text-sm font-medium"
                                            >
                                                <span className="mr-1">🗑️</span>
                                                {deletingId === currentUserId
                                                    ? "Wird gelöscht..."
                                                    : "Löschen"}
                                            </button>

                                        </div>
                                    )}
                                </>
                            )}
                        </article>
                    ))
                )}
            </div>

        </section>
    );
}
