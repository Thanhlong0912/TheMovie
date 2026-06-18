import React, { useEffect, useState } from "react";
import "./StarSearch.css";
import { Link, useSearchParams } from "react-router-dom";
import {
  formatKnownFor,
  formatRating,
  getImageUrl,
  getKnownForTitle,
  getPersonName,
  searchPeople,
} from "../../utils/tmdb";

const StarSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [searchValue, setSearchValue] = useState(query);
  const [people, setPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  useEffect(() => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      setPeople([]);
      setError("");
      setIsLoading(false);
      return undefined;
    }

    const controller = new AbortController();

    const loadPeople = async () => {
      try {
        setIsLoading(true);
        setError("");
        const results = await searchPeople(normalizedQuery, controller.signal);
        setPeople(results);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Không thể tìm kiếm ngôi sao.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadPeople();

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
    <main className="starSearch">
      <section className="starSearch__hero">
        <p className="starSearch__eyebrow">Hồ sơ diễn viên</p>
        <h1>
          Tìm kiếm <span>Ngôi Sao</span>
        </h1>
        <p className="starSearch__intro">
          Hàng nghìn hồ sơ chi tiết về các diễn viên, đạo diễn và nhà làm phim
          hàng đầu thế giới
        </p>
        <form className="starSearch__form" onSubmit={handleSubmit}>
          <i className="fas fa-search" aria-hidden="true" />
          <input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Tìm kiếm diễn viên, đạo diễn..."
            aria-label="Tìm kiếm ngôi sao"
          />
        </form>
      </section>

      <section className="starSearch__results" aria-live="polite">
        {query.trim() && (
          <div className="starSearch__resultHeader">
            <h2>Kết quả cho "{query.trim()}"</h2>
            {!isLoading && !error && <span>{people.length} hồ sơ</span>}
          </div>
        )}

        {isLoading && (
          <div className="starSearch__grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <div className="starSearch__skeleton" key={index} />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="starSearch__message" role="status">
            {error}
          </div>
        )}

        {!isLoading && !error && !query.trim() && (
          <div className="starSearch__message" role="status">
            Sẵn sàng tìm hồ sơ nghệ sĩ.
          </div>
        )}

        {!isLoading && !error && query.trim() && people.length === 0 && (
          <div className="starSearch__message" role="status">
            Chưa có hồ sơ phù hợp.
          </div>
        )}

        {!isLoading && !error && people.length > 0 && (
          <div className="starSearch__grid">
            {people.map((person) => {
              const name = getPersonName(person);
              const profileUrl = getImageUrl(person.profile_path, "w500");
              const knownFor = person.known_for || [];

              return (
                <article className="starCard" key={person.id}>
                  <div className="starCard__photo">
                    {profileUrl ? (
                      <img src={profileUrl} alt={name} loading="lazy" />
                    ) : (
                      <div className="starCard__fallback">{name}</div>
                    )}
                  </div>
                  <div className="starCard__body">
                    <p className="starCard__department">
                      {person.known_for_department || "Nghệ sĩ"}
                    </p>
                    <h3>{name}</h3>
                    <p className="starCard__knownFor">{formatKnownFor(knownFor)}</p>
                    {knownFor.length > 0 && (
                      <div className="starCard__works">
                        {knownFor.slice(0, 3).map((item) => {
                          const title = getKnownForTitle(item);
                          const mediaPath =
                            item.media_type === "tv"
                              ? `/tv/${item.id}`
                              : `/movie/${item.id}`;

                          return (
                            <Link to={mediaPath} key={`${item.media_type}-${item.id}`}>
                              {title || "Tác phẩm"}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                    <span className="starCard__score">
                      <i className="fas fa-star" aria-hidden="true" />
                      {formatRating(person.popularity)}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default StarSearch;
