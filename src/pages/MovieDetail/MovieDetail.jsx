import React, { useEffect, useState } from "react";
import "./MovieDetail.css";
import { Link, useParams } from "react-router-dom";
import {
  fetchMovieDetail,
  fetchTvDetail,
  formatDate,
  formatRating,
  formatRuntime,
  formatVoteCount,
  getImageUrl,
  getMovieTitle,
} from "../../utils/tmdb";

const MovieDetail = ({ mediaType = "movie" }) => {
  const [currentMovieDetail, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const controller = new AbortController();

    const getData = async () => {
      try {
        setIsLoading(true);
        setError("");
        const movie =
          mediaType === "tv"
            ? await fetchTvDetail(id, controller.signal)
            : await fetchMovieDetail(id, controller.signal);
        setMovie(movie);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Không thể tải chi tiết phim.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    getData();

    return () => controller.abort();
  }, [id, mediaType]);

  if (isLoading) {
    return (
      <main className="movie movie--loading" aria-live="polite">
        <div className="movie__detailSkeleton" />
      </main>
    );
  }

  if (error || !currentMovieDetail) {
    return (
      <main className="movie">
        <section className="movie__empty" role="status">
          <h1>Không tìm thấy phim</h1>
          <p>{error || "Phim này hiện chưa có dữ liệu hiển thị."}</p>
          <Link className="movie__backButton" to="/">
            Về trang chủ
          </Link>
        </section>
      </main>
    );
  }

  const title = getMovieTitle(currentMovieDetail);
  const backdropUrl = getImageUrl(currentMovieDetail.backdrop_path, "original");
  const posterUrl = getImageUrl(currentMovieDetail.poster_path, "w500");
  const productionCompanies =
    currentMovieDetail.production_companies?.filter((company) => company.logo_path) ||
    [];
  const cast = currentMovieDetail.credits?.cast?.slice(0, 12) || [];

  return (
    <main className="movie">
      <section
        className="movie__hero"
        style={
          backdropUrl
            ? {
                backgroundImage: `linear-gradient(90deg, rgba(7, 8, 13, 0.98), rgba(7, 8, 13, 0.78) 44%, rgba(7, 8, 13, 0.28)), linear-gradient(0deg, rgba(7, 8, 13, 0.94), rgba(7, 8, 13, 0.08)), url(${backdropUrl})`,
              }
            : undefined
        }
      >
        <div className="movie__heroInner">
          <div className="movie__posterBox">
            {posterUrl ? (
              <img className="movie__poster" src={posterUrl} alt={title} />
            ) : (
              <div className="movie__posterFallback">{title}</div>
            )}
          </div>

          <div className="movie__summary">
            <Link className="movie__backLink" to="/">
              <i className="fas fa-arrow-left" aria-hidden="true" /> Trang chủ
            </Link>
            <p className="movie__label">
              {currentMovieDetail.status || "Movie"}
            </p>
            <h1 className="movie__name">{title}</h1>
            {currentMovieDetail.tagline && (
              <p className="movie__tagline">{currentMovieDetail.tagline}</p>
            )}

            <div className="movie__facts" aria-label="Thông tin phim">
              <span className="movie__rating">
                <i className="fas fa-star" aria-hidden="true" />{" "}
                {formatRating(currentMovieDetail.vote_average)}
              </span>
              <span>{formatVoteCount(currentMovieDetail.vote_count)} lượt vote</span>
              <span>
                {mediaType === "tv"
                  ? formatRuntime(currentMovieDetail.episode_run_time?.[0])
                  : formatRuntime(currentMovieDetail.runtime)}
              </span>
              <span>
                {formatDate(
                  currentMovieDetail.release_date || currentMovieDetail.first_air_date
                )}
              </span>
            </div>

            {currentMovieDetail.genres?.length > 0 && (
              <div className="movie__genres" aria-label="Thể loại">
                {currentMovieDetail.genres.map((genre) => (
                  <span className="movie__genre" key={genre.id}>
                    {genre.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="movie__body">
        <article className="movie__synopsis">
          <p className="movie__sectionLabel">Nội dung</p>
          <h2>Synopsis</h2>
          <p>
            {currentMovieDetail.overview ||
              "Chưa có mô tả chính thức cho phim này."}
          </p>
        </article>

        <aside className="movie__links" aria-label="Liên kết hữu ích">
          <p className="movie__sectionLabel">Liên kết</p>
          <h2>Useful Links</h2>
          <div className="movie__linkList">
            {currentMovieDetail.homepage && (
              <a
                className="movie__Button movie__homeButton"
                href={currentMovieDetail.homepage}
                target="_blank"
                rel="noreferrer"
              >
                Homepage
                <i className="newTab fas fa-external-link-alt" aria-hidden="true" />
              </a>
            )}
            {currentMovieDetail.imdb_id && (
              <a
                className="movie__Button movie__imdbButton"
                href={`https://www.imdb.com/title/${currentMovieDetail.imdb_id}`}
                target="_blank"
                rel="noreferrer"
              >
                IMDb
                <i className="newTab fas fa-external-link-alt" aria-hidden="true" />
              </a>
            )}
          </div>
        </aside>
      </section>

      {cast.length > 0 && (
        <section className="movie__castSection">
          <p className="movie__sectionLabel">Diễn viên</p>
          <h2>Cast</h2>
          <div className="movie__castList">
            {cast.map((actor) => {
              const actorName = actor.name || actor.original_name || "Chưa rõ tên";
              const profileUrl = getImageUrl(actor.profile_path, "w185");

              return (
                <Link
                  className="movie__castMember"
                  to={`/stars?query=${encodeURIComponent(actorName)}`}
                  key={actor.cast_id || actor.credit_id}
                  aria-label={`Tìm kiếm ${actorName}`}
                >
                  <div className="movie__castPhoto">
                    {profileUrl ? (
                      <img src={profileUrl} alt={actorName} loading="lazy" />
                    ) : (
                      <span>{actorName}</span>
                    )}
                  </div>
                  <div>
                    <strong>{actorName}</strong>
                    {actor.character && <span>{actor.character}</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {productionCompanies.length > 0 && (
        <section className="movie__productionSection">
          <p className="movie__sectionLabel">Sản xuất</p>
          <h2>Production companies</h2>
          <div className="movie__production">
            {productionCompanies.map((company) => (
              <div className="productionCompanyImage" key={company.id}>
                <img
                  className="movie__productionCompany"
                  src={getImageUrl(company.logo_path, "w300")}
                  alt={company.name}
                  loading="lazy"
                />
                <span>{company.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default MovieDetail;
