// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";

import Navbar from "./pages/navbar";
import Main from "./pages/main";
import Responded from "./pages/status/responded";
import CreateVac from "./pages/createVac";
import CreateAnk  from "./pages/createAnk";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Desc from "./pages/desc/desc";
import Respond from "./pages/status/respond";
import ProfileS from "./pages/ProfileS"
import A_desc from "./pages/desc/A_desc"
import A_descForW from "./pages/desc/A_descForW"
import Desc_R from "./pages/desc/Desc_R"

import "./App.css";

axios.defaults.baseURL = "https://quality-herring-fine.ngrok-free.app/";
axios.defaults.withCredentials = true;

function App() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Универсальная функция для загрузки вакансий с параметрами фильтрации
  const fetchVacancies = async (filterParams = {}) => {
    setLoading(true);
    try {
      // Создаем query string из объекта параметров
      const query = new URLSearchParams(filterParams).toString();
      const url = query ? `/api/vacancies/?${query}` : `/api/vacancies/`;
      const res = await axios.get(url);
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setVacancies(data);
    } catch (err) {
      console.error("Ошибка при загрузке вакансий:", err);
      setVacancies([]);
    } finally {
      setLoading(false);
    }
  };

  // Обработка поиска (просто обертка для fetchVacancies)
  const handleSearch = (query) => {
    fetchVacancies({ search: query });
  };

  // Функция, которую передадим в Main для фильтрации по зарплате, графику и т.д.
  const handleFilterUpdate = (queryString) => {
    // Пример queryString: "?salary__gte=10000&salary__lte=50000&work_time=Гибкий график"
    // Нужно преобразовать в объект, чтобы передать в fetchVacancies
    const params = {};
    if (queryString.startsWith("?")) {
      const urlParams = new URLSearchParams(queryString.substring(1));
      urlParams.forEach((value, key) => {
        // Если параметр уже есть, превращаем его в массив, чтобы поддержать несколько значений
        if (params[key]) {
          if (Array.isArray(params[key])) {
            params[key].push(value);
          } else {
            params[key] = [params[key], value];
          }
        } else {
          params[key] = value;
        }
      });
    }
    fetchVacancies(params);
  };

  useEffect(() => {
    fetchVacancies();
  }, []);

  return (
    <Router>
      <Navbar onSearch={handleSearch} />
      <Routes>
        <Route
          path="/"
          element={
            <Main
              vacancies={vacancies}
              loading={loading}
              onFilterUpdate={handleFilterUpdate} // передаем функцию фильтрации
            />
          }
        />
        <Route path="/responded" element={<Responded />} />
        <Route path="/CreateVac" element={<CreateVac />} />
        <Route path="/login" element={<Login />} />
        <Route path="/CreateAnk" element={<CreateAnk/>} />
        <Route path="/Register" element={<Register/>} />
        <Route path="/Desc/:vacancyId" element={<Desc />} />
         <Route path="/ProfileS" element={<ProfileS/>} /> 
         <Route path="/DescR/:vacancyId" element={<Desc_R/>} /> 
       <Route path="/respond/:vacancyId" element={<Respond />} />
       <Route path="/A_desc/:id" element={<A_desc />} />
  <Route path="/Responded" element={<Responded />} />
<Route path="/A_descForW/:username/:id" element={<A_descForW />} />
      </Routes>
    </Router>
  );
}

export default App;
