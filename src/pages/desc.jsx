import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const Desc = () => {
  const { id } = useParams();
  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        const res = await axios.get(`/api/vacancies/${id}/`);
        setVacancy(res.data);
      } catch (err) {
        console.error('Ошибка загрузки вакансии', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVacancy();
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (!vacancy) return <p>Вакансия не найдена.</p>;

  return (
    <div className="container my-4">
      <div className="card shadow">
        <div className="card-header">
          <h3>{vacancy.name}</h3>
          <small className="text-muted">
            Опубликовано: {new Date(vacancy.published_at).toLocaleDateString()}
          </small>
        </div>
        <div className="card-body">
          <h5>Описание</h5>
          <p>{vacancy.description}</p>

          <h5>О себе</h5>
          <p>{vacancy.about_me}</p>

          <h5>Требования</h5>
          <p>{vacancy.requirements}</p>

          <h5>Обязанности</h5>
          <p>{vacancy.responsibilities}</p>

          <h5>Тип работы</h5>
          <p>{vacancy.work_type}</p>

          <h5>График работы</h5>
          <p>{vacancy.work_time}</p>

          <h5>Зарплата</h5>
          <p>{vacancy.salary.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</p>

          <h5>Местоположение</h5>
          <p>{vacancy.location}</p>

          <h5>Удалённая работа</h5> 
          <p>{vacancy.is_remote ? 'Да' : 'Нет'}</p>
  
        </div>
        <div className="card-footer">
          <Link to="/" className="btn btn-secondary me-2">Назад</Link>
          <button className="btn btn-primary">Откликнуться</button>
        </div>
      </div>
    </div>
  );
};

export default Desc;
