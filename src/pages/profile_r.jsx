// pages/MyVacancies.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyVacancies = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyVacancies = async () => {
      setLoading(true);
      const token = localStorage.getItem('token'); // проверь что это имя правильное

      if (!token) {
        console.error("Токен не найден в localStorage");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("https://quality-herring-fine.ngrok-free.app/api/vacancies/my/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        setVacancies(data);
      } catch (error) {
        console.error("Ошибка при загрузке моих вакансий:", error);
        setVacancies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyVacancies();
  }, []);

  if (loading) {
    return <p className="text-center mt-4">Загрузка...</p>;
  }

  if (!vacancies.length) {
    return <p className="text-center mt-4">У вас пока  нет добавленных вакансий.</p>;
  }

  return (

    <div className="container my-5">
      <h2 className="mb-4 text-center">Мои вакансии</h2>
      <div className="row g-4">
        {vacancies.map((v) => (
          <div key={v.id} className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{v.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  График: {v.work_time}
                </h6>
                <p className="card-text flex-grow-1">
                  {v.description ? v.description.slice(0, 100) + "..." : "Описание отсутствует"}
                </p>
                <div className="mt-auto d-flex justify-content-between">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/desc/${v.id}`)}
                  >
                    Подробнее
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
  
    </div>
  );
};

export default MyVacancies;
