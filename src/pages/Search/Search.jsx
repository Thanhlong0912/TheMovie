import React, { useEffect, useState } from "react";
import "./Search.css";
import { useSearchParams } from "react-router-dom";
import Card from "../../components/Card/Card";
import { searchMovies } from "../../utils/tmdb";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [searchValue, setSearchValue] = useState(query);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  useEffect(() => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      setMovies([]);
      setError("");
      setIsLoading(false);
      return undefined;
    }

    const controller = new AbortController();

    const loadMovies = async () => {
      try {
        setIsLoading(true);
        setError("");
        const results = await searchMovies(normalizedQuery, controller.signal);
        setMovies(results);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Không thể tìm kiếm phim.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadMovies();

    return () => controller.abort();
  }, [query]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const normalizedValue = searchValue.trim();

    if (normalizedValue) {
      setSearchParams({ query: normalizedValue });
    } else {
      setSearchParams({});
    }
  };

  return (
    <main className="searchPage">
      <section className="searchPage__hero">
        <p className="searchPage__eyebrow">Kho phim TMDb</p>
        <h1>Tìm kiếm phim</h1>
        <form className="searchPage__form" onSubmit={handleSubmit}>
          <i className="fas fa-search" aria-hidden="true" />
          <input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Tìm kiếm phim..."
            aria-label="Tìm kiếm phim"
          />
        </form>
      </section>

      <section className="searchPage__results" aria-live="polite">
        {query.trim() && (
          <div className="searchPage__resultHeader">
            <h2>Kết quả cho "{query.trim()}"</h2>
            {!isLoading && !error && <span>{movies.length} phim</span>}
          </div>
        )}

        {isLoading && (
          <div className="searchPage__grid">
            {Array.from({ length: 10 }).map((_, index) => (
              <div className="searchPage__skeleton" key={index} />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="searchPage__message" role="status">
            {error}
          </div>
        )}

        {!isLoading && !error && !query.trim() && (
          <div className="searchPage__message" role="status">
            Sẵn sàng tìm bộ phim tiếp theo.
          </div>
        )}

        {!isLoading && !error && query.trim() && movies.length === 0 && (
          <div className="searchPage__message" role="status">
            Chưa có phim phù hợp.
          </div>
        )}

        {!isLoading && !error && movies.length > 0 && (
          <div className="searchPage__grid">
            {movies.map((movie, index) => (
              <Card movie={movie} rank={index + 1} key={movie.id} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Search;
