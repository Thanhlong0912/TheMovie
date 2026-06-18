export const GENRE_FILTERS = [
  { slug: "hanh-dong", label: "Hành Động", movieGenreId: 28, tvGenreId: 10759 },
  { slug: "tinh-cam", label: "Tình Cảm", movieGenreId: 10749, tvGenreId: 18 },
  { slug: "hai-huoc", label: "Hài Hước", movieGenreId: 35, tvGenreId: 35 },
  { slug: "co-trang", label: "Cổ Trang", movieGenreId: 36, tvGenreId: 10765 },
  { slug: "tam-ly", label: "Tâm Lý", movieGenreId: 18, tvGenreId: 18 },
  { slug: "hinh-su", label: "Hình Sự", movieGenreId: 80, tvGenreId: 80 },
  { slug: "chien-tranh", label: "Chiến Tranh", movieGenreId: 10752, tvGenreId: 10768 },
  { slug: "the-thao", label: "Thể Thao", movieGenreId: 99, tvGenreId: 99 },
  { slug: "vo-thuat", label: "Võ Thuật", movieGenreId: 28, tvGenreId: 10759 },
  { slug: "vien-tuong", label: "Viễn Tưởng", movieGenreId: 878, tvGenreId: 10765 },
  { slug: "phieu-luu", label: "Phiêu Lưu", movieGenreId: 12, tvGenreId: 10759 },
  { slug: "khoa-hoc", label: "Khoa Học", movieGenreId: 878, tvGenreId: 10765 },
  { slug: "kinh-di", label: "Kinh Dị", movieGenreId: 27, tvGenreId: 9648 },
  { slug: "chinh-kich", label: "Chính Kịch", movieGenreId: 18, tvGenreId: 18 },
  { slug: "bi-an", label: "Bí Ẩn", movieGenreId: 9648, tvGenreId: 9648 },
  { slug: "hoat-hinh", label: "Hoạt Hình", movieGenreId: 16, tvGenreId: 16 },
  { slug: "gia-dinh", label: "Gia Đình", movieGenreId: 10751, tvGenreId: 10751 },
  { slug: "boy-love", label: "Boy Love", movieGenreId: 10749, tvGenreId: 18 },
  { slug: "girl-love", label: "Girl Love", movieGenreId: 10749, tvGenreId: 18 },
];

export const COUNTRY_FILTERS = [
  { code: "CN", label: "Trung Quốc" },
  { code: "KR", label: "Hàn Quốc" },
  { code: "JP", label: "Nhật Bản" },
  { code: "TH", label: "Thái Lan" },
  { code: "US", label: "Âu Mỹ" },
  { code: "TW", label: "Đài Loan" },
  { code: "HK", label: "Hồng Kông" },
  { code: "IN", label: "Ấn Độ" },
  { code: "GB", label: "Anh" },
  { code: "FR", label: "Pháp" },
  { code: "CA", label: "Canada" },
  { code: "VN", label: "Việt Nam" },
  { code: "RU", label: "Nga" },
  { code: "PH", label: "Philippines" },
];

export const getGenreFilter = (slug) =>
  GENRE_FILTERS.find((genre) => genre.slug === slug);

export const getCountryFilter = (code) =>
  COUNTRY_FILTERS.find((country) => country.code === code);
