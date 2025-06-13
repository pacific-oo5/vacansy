// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";

import Navbar from "./pages/navbar";
import Main from "./pages/main";
import Responded from "./pages/responded";
import Profile from "./pages/profile";
import Login from "./pages/login";
import Register from "./pages/register";
import Desc from "./pages/desc";
import "./App.css";

axios.defaults.baseURL = "https://quality-herring-fine.ngrok-free.app/";
axios.defaults.withCredentials = true;

function App() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query) => {
    setLoading(true);
    try {
      const url = query.trim()
        ? `/api/vacancies/?search=${encodeURIComponent(query)}`
        : `/api/vacancies/`;
      const res = await axios.get(url);
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setVacancies(data);
    } catch (err) {
      console.error("Ошибка при поиске:", err);
      setVacancies([]);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем все вакансии при старте
  useEffect(() => {
    handleSearch("");
  }, []);

  return (
    <Router>
      <Navbar onSearch={handleSearch} />
      <Routes>
        <Route path="/" element={<Main vacancies={vacancies} loading={loading} />} />
        <Route path="/responded" element={<Responded />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Desc/:id" element={<Desc />} />
      </Routes>
    </Router>
  );
}

export default App;
