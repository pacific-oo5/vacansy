// components/Navbar.js
import React, { useState } from "react";

const Navbar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid justify-content-between">
        <a className="navbar-brand" href="/">Вакансии</a>
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
      </div>
    </nav>
  );
};

export default Navbar;
