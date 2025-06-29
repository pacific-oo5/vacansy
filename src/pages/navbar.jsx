// components/Navbar.js
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid justify-content-between">
        
        {/* Логотип */}
        <a className="navbar-brand" href="/">Вакансии</a>

        {/* Поиск */}
        <form className="d-flex mx-auto" onSubmit={handleSubmit} style={{ width: '50%' }}>
          <input
            className="form-control me-2"
            type="search"
            placeholder="Поиск вакансий..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-outline-light" type="submit">Поиск</button>
        </form>

        {/* Справа — Личный кабинет */}
        <div>
          <Link to="/ProfileS" className="btn btn-outline-light">
            Личный кабинет
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;