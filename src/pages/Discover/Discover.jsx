import React, { useEffect, useMemo, useState } from "react";
import "./Discover.css";
import { Link, useSearchParams } from "react-router-dom";
import Card from "../../components/Card/Card";
import { discoverMedia } from "../../utils/tmdb";
import { getCountryFilter, getGenreFilter } from "../../utils/filters";

const Discover = () => {
  const [searchParams] = useSearchParams();
  const mediaType = searchParams.get("media") === "tv" ? "tv" : "movie";
  const genre = getGenreFilter(searchParams.get("genre"));
  const country = getCountryFilter(searchParams.get("country"));
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadItems = async () => {
      try {
        setIsLoading(true);
        setError("");
        const results = await discoverMedia(
          { mediaType, genre, country },
          controller.signal
        );
        setItems(results);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Không thể tải danh sách phim.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadItems();

    return () => controller.abort();
  }, [mediaType, genre, country]);

  const title = useMemo(() => {
    const mediaLabel = mediaType === "tv" ? "Phim Bộ" : "Phim Lẻ";

    if (genre && country) {
      return `${mediaLabel} ${genre.label} ${country.label}`;
    }

    if (genre) {
      return `${mediaLabel} ${genre.label}`;
    }

    if (country) {
      return `${mediaLabel} ${country.label}`;
    }

    return mediaLabel;
  }, [country, genre, mediaType]);

  const filterParams = new URLSearchParams();
  if (genre) {
    filterParams.set("genre", genre.slug);
  }
  if (country) {
    filterParams.set("country", country.code);
  }

  const movieLink = `/discover?media=movie${
    filterParams.toString() ? `&${filterParams.toString()}` : ""
  }`;
  const tvLink = `/discover?media=tv${
    filterParams.toString() ? `&${filterParams.toString()}` : ""
  }`;

  return (
    <main className="discover">
      <section className="discover__header">
        <div>
          <p className="discover__eyebrow">Bộ lọc</p>
          <h1>{title}</h1>
        </div>
        <div className="discover__switch" aria-label="Chọn loại nội dung">
          <Link className={mediaType === "movie" ? "is-active" : ""} to={movieLink}>
            Phim Lẻ
          </Link>
          <Link className={mediaType === "tv" ? "is-active" : ""} to={tvLink}>
            Phim Bộ
          </Link>
        </div>
      </section>

      <section className="discover__results" aria-live="polite">
        {isLoading && (
          <div className="discover__grid">
            {Array.from({ length: 12 }).map((_, index) => (
              <div className="discover__skeleton" key={index} />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="discover__message" role="status">
            {error}
          </div>
        )}

        {!isLoading && !error && items.length === 0 && (
          <div className="discover__message" role="status">
            Chưa có nội dung phù hợp.
          </div>
        )}

        {!isLoading && !error && items.length > 0 && (
          <div className="discover__grid">
            {items.map((item, index) => (
              <Card
                movie={item}
                rank={index + 1}
                mediaType={mediaType}
                key={item.id}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Discover;
