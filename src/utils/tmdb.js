const TMDB_API_KEY = "e5d2b15814e40fdd2702780bca72cb4c";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const MOVIE_TYPE_LABELS = {
  popular: "Phim hot",
  top_rated: "Đánh giá cao",
  upcoming: "Sắp chiếu",
};

export const fetchMovies = async (type = "popular", signal) => {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${type}?api_key=${TMDB_API_KEY}&language=vi-VN&page=1`,
    { signal }
  );

  if (!response.ok) {
    throw new Error("Không thể tải danh sách phim.");
  }

  const data = await response.json();
  return Array.isArray(data.results) ? data.results : [];
};

export const fetchMovieDetail = async (id, signal) => {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=vi-VN`,
    { signal }
  );

  if (!response.ok) {
    throw new Error("Không thể tải chi tiết phim.");
  }

  return response.json();
};

export const getImageUrl = (path, size = "w500") => {
  if (!path) {
    return "";
  }

  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const getMovieTitle = (movie) =>
  movie?.title || movie?.original_title || movie?.name || "Chưa rõ tựa phim";

export const getMovieYear = (date) => {
  if (!date) {
    return "Chưa rõ";
  }

  const year = new Date(date).getFullYear();
  return Number.isNaN(year) ? "Chưa rõ" : year;
};

export const formatDate = (date) => {
  if (!date) {
    return "Chưa công bố";
  }

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatRating = (rating) => {
  if (typeof rating !== "number") {
    return "N/A";
  }

  return rating.toFixed(1);
};

export const formatRuntime = (runtime) => {
  if (!runtime) {
    return "Chưa rõ thời lượng";
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (!hours) {
    return `${minutes} phút`;
  }

  return `${hours} giờ ${minutes} phút`;
};

export const formatVoteCount = (count) =>
  new Intl.NumberFormat("vi-VN").format(count || 0);

