import React, { useEffect, useState } from "react";
import "./Home.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import MovieList from "../../components/MovieList/MovieList";
import {
  fetchMovies,
  formatDate,
  formatRating,
  getImageUrl,
  getMovieTitle,
} from "../../utils/tmdb";

const Home = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadPopularMovies = async () => {
      try {
        setIsLoading(true);
        setError("");
        const movies = await fetchMovies("popular", controller.signal);
        setPopularMovies(movies);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Không thể tải phim nổi bật.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadPopularMovies();

    return () => controller.abort();
  }, [reloadKey]);

  const featuredMovies = popularMovies.slice(0, 6);

  return (
    <main className="home">
      <section className="poster" aria-label="Phim nổi bật">
        {isLoading && (
          <div className="poster__placeholder" aria-live="polite">
            <div className="poster__placeholderContent">
              <span>Đang tải phim nổi bật</span>
              <strong>Chuẩn bị rạp phim của bạn...</strong>
            </div>
          </div>
        )}

        {!isLoading && error && (
          <div className="poster__error" role="status">
            <span>Không tải được dữ liệu phim.</span>
            <button type="button" onClick={() => setReloadKey((key) => key + 1)}>
              Tải lại
            </button>
          </div>
        )}

        {!isLoading && !error && featuredMovies.length > 0 && (
          <Carousel
            showThumbs={false}
            autoPlay={true}
            interval={6200}
            transitionTime={700}
            infiniteLoop={true}
            showStatus={false}
            showIndicators={true}
            showArrows={true}
            swipeable={true}
            emulateTouch={true}
            stopOnHover={true}
          >
            {featuredMovies.map((movie) => {
              const title = getMovieTitle(movie);
              const backdropUrl = getImageUrl(movie.backdrop_path, "original");

              return (
                <Link
                  className="poster__slide"
                  to={`/movie/${movie.id}`}
                  key={movie.id}
                  aria-label={`Xem chi tiết ${title}`}
                >
                  <div className="posterImage">
                    {backdropUrl ? (
                      <img src={backdropUrl} alt="" />
                    ) : (
                      <div className="posterImage__fallback" />
                    )}
                  </div>
                  <div className="posterImage__overlay">
                    <span className="posterImage__eyebrow">
                      Đề xuất hôm nay
                    </span>
                    <div className="posterImage__title">{title}</div>
                    <div className="posterImage__runtime">
                      <span>{formatDate(movie.release_date)}</span>
                      <span className="posterImage__rating">
                        <i className="fas fa-star" aria-hidden="true" />{" "}
                        {formatRating(movie.vote_average)}
                      </span>
                    </div>
                    <div className="posterImage__description">
                      {movie.overview ||
                        "Một lựa chọn đáng xem trong danh sách phim đang được quan tâm."}
                    </div>
                    <div className="posterImage__actions">
                      <span className="posterImage__button posterImage__button--primary">
                        Xem chi tiết
                      </span>
                      <span className="posterImage__button posterImage__button--ghost">
                        IMDb {formatRating(movie.vote_average)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </Carousel>
        )}
      </section>

      <MovieList
        movies={popularMovies}
        loading={isLoading}
        error={error}
        title="Phim đang được quan tâm"
        intro="Những tựa phim nổi bật được cập nhật từ TMDb, trình bày gọn hơn để bạn lướt nhanh và chọn phim dễ hơn."
      />
    </main>
  );
};

export default Home;
