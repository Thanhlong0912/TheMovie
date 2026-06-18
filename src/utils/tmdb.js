const TMDB_API_KEY = "e5d2b15814e40fdd2702780bca72cb4c";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const MOVIE_TYPE_LABELS = {
  popular: "Phim hot",
  top_rated: "Đánh giá cao",
  upcoming: "Sắp chiếu",
};

export const TV_TYPE_LABELS = {
  popular: "Phim bộ phổ biến",
  top_rated: "Phim bộ đánh giá cao",
  on_the_air: "Đang phát sóng",
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

export const fetchTvShows = async (type = "popular", signal) => {
  const response = await fetch(
    `${TMDB_BASE_URL}/tv/${type}?api_key=${TMDB_API_KEY}&language=vi-VN&page=1`,
    { signal }
  );

  if (!response.ok) {
    throw new Error("Không thể tải danh sách phim bộ.");
  }

  const data = await response.json();
  return Array.isArray(data.results) ? data.results : [];
};

export const discoverMedia = async (
  { mediaType = "movie", genre, country },
  signal
) => {
  const type = mediaType === "tv" ? "tv" : "movie";
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: "vi-VN",
    page: "1",
    sort_by: "popularity.desc",
    include_adult: "false",
  });

  if (type === "movie") {
    params.set("include_video", "false");
  }

  if (genre) {
    const genreId = type === "tv" ? genre.tvGenreId : genre.movieGenreId;
    params.set("with_genres", String(genreId));
  }

  if (country) {
    params.set("with_origin_country", country.code);
  }

  const response = await fetch(`${TMDB_BASE_URL}/discover/${type}?${params}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error("Không thể tải bộ lọc phim.");
  }

  const data = await response.json();
  return Array.isArray(data.results) ? data.results : [];
};

export const searchMovies = async (query, signal) => {
  const normalizedQuery = query?.trim();

  if (!normalizedQuery) {
    return [];
  }

  const response = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=vi-VN&query=${encodeURIComponent(
      normalizedQuery
    )}&page=1&include_adult=false`,
    { signal }
  );

  if (!response.ok) {
    throw new Error("Không thể tìm kiếm phim.");
  }

  const data = await response.json();
  return Array.isArray(data.results) ? data.results : [];
};

export const searchPeople = async (query, signal) => {
  const normalizedQuery = query?.trim();

  if (!normalizedQuery) {
    return [];
  }

  const response = await fetch(
    `${TMDB_BASE_URL}/search/person?api_key=${TMDB_API_KEY}&language=vi-VN&query=${encodeURIComponent(
      normalizedQuery
    )}&page=1&include_adult=false`,
    { signal }
  );

  if (!response.ok) {
    throw new Error("Không thể tìm kiếm ngôi sao.");
  }

  const data = await response.json();
  return Array.isArray(data.results) ? data.results : [];
};

export const fetchMovieDetail = async (id, signal) => {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=vi-VN&append_to_response=credits`,
    { signal }
  );

  if (!response.ok) {
    throw new Error("Không thể tải chi tiết phim.");
  }

  return response.json();
};

export const fetchTvDetail = async (id, signal) => {
  const response = await fetch(
    `${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}&language=vi-VN&append_to_response=credits`,
    { signal }
  );

  if (!response.ok) {
    throw new Error("Không thể tải chi tiết phim bộ.");
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

export const getPersonName = (person) =>
  person?.name || person?.original_name || "Chưa rõ tên";

export const getKnownForTitle = (item) =>
  item?.title || item?.name || item?.original_title || item?.original_name || "";

export const formatKnownFor = (knownFor = []) => {
  const titles = knownFor.map(getKnownForTitle).filter(Boolean).slice(0, 3);
  return titles.length > 0 ? titles.join(", ") : "Đang cập nhật tác phẩm";
};

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
