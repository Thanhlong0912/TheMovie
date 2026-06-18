import React, { useEffect, useRef, useState } from "react";
import "./Header.css";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { COUNTRY_FILTERS, GENRE_FILTERS } from "../../utils/filters";

const ADD_ON_LINKS = [
  { to: "/movies/popular", label: "Phim hot" },
  { to: "/movies/top_rated", label: "Đánh giá cao" },
  { to: "/movies/upcoming", label: "Sắp chiếu" },
];

const Header = () => {
  const [openMenu, setOpenMenu] = useState("");
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [movieQuery, setMovieQuery] = useState("");
  const navMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isGenreActive =
    location.pathname === "/discover" && Boolean(searchParams.get("genre"));
  const isCountryActive =
    location.pathname === "/discover" && Boolean(searchParams.get("country"));
  const isMoreActive =
    location.pathname.startsWith("/stars") ||
    location.pathname.startsWith("/star-search") ||
    location.pathname.startsWith("/movies/");

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (navMenuRef.current && !navMenuRef.current.contains(event.target)) {
        setOpenMenu("");
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpenMenu("");
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setOpenMenu("");
    setIsControlsOpen(false);
  }, [location.pathname, location.search]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const normalizedQuery = movieQuery.trim();

    if (normalizedQuery) {
      navigate(`/search?query=${encodeURIComponent(normalizedQuery)}`);
      setMovieQuery("");
      setOpenMenu("");
      setIsControlsOpen(false);
    }
  };

  const toggleMenu = (menu) => {
    setOpenMenu((currentMenu) => (currentMenu === menu ? "" : menu));
  };

  const toggleControls = () => {
    setIsControlsOpen((currentState) => !currentState);
    setOpenMenu("");
  };

  const closeMenu = () => {
    setOpenMenu("");
    setIsControlsOpen(false);
  };

  return (
    <header className="header">
      <div className="header__inner">
        <Link className="header__brand" to="/" aria-label="Themovie trang chủ">
          <span className="header__brandMark" aria-hidden="true">
            TM
          </span>
          <span className="header__brandText">
            <strong>Themovie</strong>
            <span>Movie discovery</span>
          </span>
        </Link>

        <button
          type="button"
          className={
            isControlsOpen ? "header__toggle is-open" : "header__toggle"
          }
          aria-label={isControlsOpen ? "Đóng tìm kiếm và bộ lọc" : "Mở tìm kiếm và bộ lọc"}
          aria-controls="header-controls"
          aria-expanded={isControlsOpen}
          onClick={toggleControls}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <div
          className={
            isControlsOpen ? "header__controls is-open" : "header__controls"
          }
          id="header-controls"
        >
          <form className="header__search" onSubmit={handleSearchSubmit}>
            <i className="fas fa-search" aria-hidden="true" />
            <input
              type="search"
              value={movieQuery}
              onChange={(event) => setMovieQuery(event.target.value)}
              placeholder="Tìm kiếm phim..."
              aria-label="Tìm kiếm phim"
            />
          </form>

          <nav className="header__nav" aria-label="Danh mục phim" ref={navMenuRef}>
            <NavLink
              className={({ isActive }) =>
                isActive && searchParams.get("media") !== "tv"
                  ? "header__navItem is-active"
                  : "header__navItem"
              }
              to="/discover?media=movie"
            >
              Phim Lẻ
            </NavLink>
            <NavLink
              className={() =>
                location.pathname === "/discover" && searchParams.get("media") === "tv"
                  ? "header__navItem is-active"
                  : "header__navItem"
              }
              to="/discover?media=tv"
            >
              Phim Bộ
            </NavLink>

            <div className="header__menu">
              <button
                type="button"
                className={
                  isGenreActive
                    ? "header__navItem header__menuButton is-active"
                    : "header__navItem header__menuButton"
                }
                aria-expanded={openMenu === "genres"}
                aria-haspopup="menu"
                onClick={() => toggleMenu("genres")}
              >
                Thể Loại
                <i className="fas fa-chevron-down" aria-hidden="true" />
              </button>
              {openMenu === "genres" && (
                <div
                  className="header__dropdown header__dropdown--genres"
                  role="menu"
                >
                  {GENRE_FILTERS.map((genre) => (
                    <Link
                      className="header__dropdownLink"
                      to={`/discover?genre=${genre.slug}`}
                      role="menuitem"
                      onClick={closeMenu}
                      key={genre.slug}
                    >
                      {genre.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="header__menu">
              <button
                type="button"
                className={
                  isCountryActive
                    ? "header__navItem header__menuButton is-active"
                    : "header__navItem header__menuButton"
                }
                aria-expanded={openMenu === "countries"}
                aria-haspopup="menu"
                onClick={() => toggleMenu("countries")}
              >
                Quốc Gia
                <i className="fas fa-chevron-down" aria-hidden="true" />
              </button>
              {openMenu === "countries" && (
                <div
                  className="header__dropdown header__dropdown--countries"
                  role="menu"
                >
                  {COUNTRY_FILTERS.map((country) => (
                    <Link
                      className="header__dropdownLink"
                      to={`/discover?country=${country.code}`}
                      role="menuitem"
                      onClick={closeMenu}
                      key={country.code}
                    >
                      {country.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="header__menu">
              <button
                type="button"
                className={
                  isMoreActive
                    ? "header__navItem header__menuButton is-active"
                    : "header__navItem header__menuButton"
                }
                aria-expanded={openMenu === "more"}
                aria-haspopup="menu"
                onClick={() => toggleMenu("more")}
              >
                Thêm
                <i className="fas fa-chevron-down" aria-hidden="true" />
              </button>
              {openMenu === "more" && (
                <div className="header__dropdown header__dropdown--more" role="menu">
                  <Link
                    className="header__dropdownLink header__dropdownLink--featured"
                    to="/stars"
                    role="menuitem"
                    onClick={closeMenu}
                  >
                    Diễn viên
                  </Link>
                  <div className="header__dropdownDivider" aria-hidden="true" />
                  {ADD_ON_LINKS.map((item) => (
                    <Link
                      className="header__dropdownLink"
                      to={item.to}
                      role="menuitem"
                      onClick={closeMenu}
                      key={item.to}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
