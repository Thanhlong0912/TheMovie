import React, { useEffect, useMemo, useState } from "react";
import "./MovieList.css";
import { useParams } from "react-router-dom";
import Card from "../Card/Card";
import { fetchMovies, MOVIE_TYPE_LABELS } from "../../utils/tmdb";

const SKELETON_CARDS = 12;

const MovieList = ({
  movies,
  loading,
  error,
  title,
  intro,
  typeOverride,
}) => {
  const { type } = useParams();
  const resolvedType = typeOverride || type || "popular";
  const hasProvidedMovies = Array.isArray(movies);
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(!hasProvidedMovies);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (hasProvidedMovies) {
      return undefined;
    }

    const controller = new AbortController();

    const getData = async () => {
      try {
        setIsLoading(true);
        setLoadError("");
        const fetchedMovies = await fetchMovies(resolvedType, controller.signal);
        setMovieList(fetchedMovies);
      } catch (err) {
        if (err.name !== "AbortError") {
          setLoadError(err.message || "Không thể tải danh sách phim.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    getData();

    return () => controller.abort();
  }, [hasProvidedMovies, resolvedType]);

  const displayedMovies = hasProvidedMovies ? movies : movieList;
  const displayedLoading = hasProvidedMovies ? loading : isLoading;
  const displayedError = hasProvidedMovies ? error : loadError;
  const cardVariant = hasProvidedMovies ? "ranked" : "wide";
  const cardsClassName = hasProvidedMovies
    ? "list__cards"
    : "list__cards list__cards--wide";

  const sectionTitle = useMemo(() => {
    if (title) {
      return title;
    }

    return MOVIE_TYPE_LABELS[resolvedType] || "Danh sách phim";
  }, [resolvedType, title]);

  return (
    <section className="movie__list" aria-labelledby="movie-list-title">
      <div className="list__header">
        <div>
          <p className="list__eyebrow">Khám phá nhanh</p>
          <h2 className="list__title" id="movie-list-title">
            {sectionTitle}
          </h2>
        </div>
        {intro && <p className="list__intro">{intro}</p>}
      </div>

      {displayedLoading && (
        <div className={cardsClassName} aria-live="polite">
          {Array.from({ length: SKELETON_CARDS }).map((_, index) => (
            <div className="list__cardSkeleton" key={index} />
          ))}
        </div>
      )}

      {!displayedLoading && displayedError && (
        <div className="list__message" role="status">
          {displayedError}
        </div>
      )}

      {!displayedLoading && !displayedError && displayedMovies.length === 0 && (
        <div className="list__message" role="status">
          Chưa có phim để hiển thị.
        </div>
      )}

      {!displayedLoading && !displayedError && displayedMovies.length > 0 && (
        <div className={cardsClassName}>
          {displayedMovies.map((movie, index) => (
            <Card
              movie={movie}
              rank={index + 1}
              variant={cardVariant}
              key={movie.id}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default MovieList;
