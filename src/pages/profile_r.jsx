import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://quality-herring-fine.ngrok-free.app/api";

const getAccessToken = () => localStorage.getItem("token");
const getRefreshToken = () => localStorage.getItem("refreshToken");

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error("Refresh token отсутствует");

  try {
    const res = await axios.post(`${API_URL}/token/refresh/`, { refresh });
    localStorage.setItem("token", res.data.access);
    return res.data.access;
  } catch (e) {
    console.error("Не удалось обновить токен", e);
    throw e;
  }
}

const MyVacancies = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyVacancies = async () => {
      setLoading(true);
      let token = getAccessToken();

      if (!token) {
        console.error("Токен не найден в localStorage");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/vacancies/my/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        setVacancies(data);
      } catch (error) {
        if (
          error.response &&
          error.response.data.code === "token_not_valid"
        ) {
          try {
            token = await refreshAccessToken();
            const res = await axios.get(`${API_URL}/vacancies/my/`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const data = Array.isArray(res.data) ? res.data : res.data.results || [];
            setVacancies(data);
          } catch (refreshError) {
            console.error("Ошибка обновления токена:", refreshError);
            setVacancies([]);
          }
        } else {
          console.error("Ошибка при загрузке моих вакансий:", error);
          setVacancies([]);
        }
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
    return <p className="text-center mt-4">У вас пока нет добавленных вакансий.</p>;
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
                <div className="mt-auto d-flex justify-content-between flex-wrap gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/desc/${v.id}`)}
                  >
                    Подробнее
                  </button>
                  <button
                    className="btn btn-outline-success"
                    onClick={() => navigate(`/respond/${v.id}`)}
                  >
                    Откликнувшиеся
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
