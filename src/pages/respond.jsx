import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "https://quality-herring-fine.ngrok-free.app/api";

const getAccessToken = () => localStorage.getItem("token");

const Respond = () => {
  const { vacancyId } = useParams();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const token = getAccessToken();
        const res = await axios.get(`${API_URL}/vacancies/${vacancyId}/responses/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setResponses(res.data || []);
      } catch (err) {
        console.error("Ошибка загрузки откликнувшихся:", err);
        setResponses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [vacancyId]);

  if (loading) return <p className="text-center mt-4">Загрузка откликов...</p>;

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Откликнувшиеся на вакансию #{vacancyId}</h2>
      {responses.length === 0 ? (
        <p className="text-center">Пока никто не откликнулся.</p>
      ) : (
        <ul className="list-group">
          {responses.map((r) => (
            <li key={r.id} className="list-group-item">
              <strong>{r.username || "Неизвестный пользователь"}</strong><br />
              Email: {r.email || "Не указан"}<br />
              Статус: {r.status || "Ожидает"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Respond;
