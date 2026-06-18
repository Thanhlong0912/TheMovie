import React from "react";
import "./Header.css";
import { Link, NavLink } from "react-router-dom";

const navItems = [
  { to: "/movies/popular", label: "Phim hot" },
  { to: "/movies/top_rated", label: "Đánh giá cao" },
  { to: "/movies/upcoming", label: "Sắp chiếu" },
];

const Header = () => {
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

        <nav className="header__nav" aria-label="Danh mục phim">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) =>
                isActive ? "header__navItem is-active" : "header__navItem"
              }
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
