import React from "react";
import "./Card.css";
import { Link } from "react-router-dom";
import {
  formatRating,
  getImageUrl,
  getMovieTitle,
  getMovieYear,
} from "../../utils/tmdb";

const Card = ({ movie, rank, variant = "ranked" }) => {
  const title = getMovieTitle(movie);
  const posterUrl = getImageUrl(movie?.poster_path, "w500");
  const backdropUrl = getImageUrl(movie?.backdrop_path, "w780");
  const imageUrl = posterUrl || backdropUrl;
  const previewImageUrl = backdropUrl || posterUrl;
  const releaseYear = getMovieYear(movie.release_date);
  const episode = Math.max(10, Math.round(movie.vote_average || 10) + (rank || 0));
  const overview =
    movie?.overview ||
    "Chưa có mô tả, nhưng phim này đang nằm trong danh sách đáng chú ý.";

  if (variant === "wide") {
    return (
      <Link
        className="movie-card movie-card--wide"
        to={`/movie/${movie.id}`}
        aria-label={`Xem chi tiết ${title}`}
      >
        <article className="wide-card">
          <div className="wide-card__backdrop">
            {previewImageUrl ? (
              <img src={previewImageUrl} alt="" loading="lazy" />
            ) : (
              <div className="cards__posterFallback">{title}</div>
            )}
          </div>

          <div className="wide-card__body">
            <div className="wide-card__poster">
              {posterUrl ? (
                <img src={posterUrl} alt={title} loading="lazy" />
              ) : (
                <div className="cards__posterFallback">{title}</div>
              )}
              <span>PĐ. {episode}</span>
            </div>

            <div className="wide-card__meta">
              <h3>{title}</h3>
              <p>{movie.original_title || title}</p>
              <small>
                {releaseYear} • TMDb {formatRating(movie.vote_average)}
              </small>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link
      className="movie-card"
      to={`/movie/${movie.id}`}
      aria-label={`Xem chi tiết ${title}`}
    >
      <article className="cards">
        <div className="cards__media">
          {imageUrl ? (
            <img className="cards__img" src={imageUrl} alt={title} loading="lazy" />
          ) : (
            <div className="cards__posterFallback">{title}</div>
          )}
          <div className="cards__quality" aria-hidden="true">
            <span>PĐ. {episode}</span>
            <span>QL. HD</span>
          </div>
        </div>
        <div className="cards__content">
          <span className="card__rank">{rank}</span>
          <div className="card__meta">
            <h3 className="card__title">{title}</h3>
            <p className="card__subtitle">{movie.original_title || title}</p>
            <small>HD • {releaseYear}</small>
          </div>
        </div>

        <div className="cards__hoverPanel" aria-hidden="true">
          <div className="cards__previewMedia">
            {previewImageUrl ? (
              <img src={previewImageUrl} alt="" loading="lazy" />
            ) : (
              <div className="cards__posterFallback">{title}</div>
            )}
          </div>
          <div className="cards__previewBody">
            <h3>{title}</h3>
            <p className="cards__previewSubtitle">{movie.original_title || title}</p>
            <div className="cards__previewActions">
              <span className="cards__watch">
                <i className="fas fa-play" aria-hidden="true" />
                Xem ngay
              </span>
              <span>
                <i className="fas fa-heart" aria-hidden="true" />
                Thích
              </span>
              <span>
                <i className="fas fa-info-circle" aria-hidden="true" />
                Chi tiết
              </span>
            </div>
            <div className="cards__chips">
              <span>TOP {rank}</span>
              <span>TMDb {formatRating(movie.vote_average)}</span>
              <span>{releaseYear}</span>
              <span>HD</span>
              <span>Vietsub</span>
            </div>
            <p className="cards__previewDescription">{overview}</p>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default Card;
