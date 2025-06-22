import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';

const API_URL = "https://quality-herring-fine.ngrok-free.app/api";

const VacancyDetail = () => {
  const { vacancyId } = useParams();
  const [vacancy, setVacancy] = useState(null);
  const [ankets, setAnkets] = useState([]);
  const [selectedAnketa, setSelectedAnketa] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получаем данные вакансии
        const vacancyRes = await axios.get(`${API_URL}/vacancies/${vacancyId}/`);
        setVacancy(vacancyRes.data);

        if (token) {
          // Получаем профиль текущего пользователя
          const profileRes = await axios.get(`${API_URL}/my/`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCurrentUser(profileRes.data);

          // Если это студент (user_r === false), берем анкеты из профиля
        
            const anketaList = profileRes.data.ankets || [];
            setAnkets(anketaList);
          
        }
      } catch (err) {
        console.error("Ошибка загрузки данных:", err);
        setMessage("Ошибка загрузки данных.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [vacancyId, token]);

  const handleRespond = async () => {
    if (!selectedAnketa) {
      alert("Пожалуйста, выберите анкету для отклика.");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/vacancies/${vacancyId}/respond/`,
        { anketa_id: selectedAnketa },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setMessage("✅ Отклик успешно отправлен!");
    } catch (err) {
      console.error("Ошибка отклика:", err);
      setMessage("❌ Ошибка при отправке отклика.");
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      {vacancy ? (
        <Card>
          <Card.Body>
            <Card.Title>{vacancy.name}</Card.Title>
            <Card.Text><strong>Описание:</strong> {vacancy.description}</Card.Text>
            <Card.Text><strong>Тип работы:</strong> {vacancy.work_type}</Card.Text>
            <Card.Text><strong>График:</strong> {vacancy.work_time}</Card.Text>
            <Card.Text><strong>Зарплата:</strong> {vacancy.salary} сом</Card.Text>
            <Card.Text><strong>Страна:</strong> {vacancy.country}</Card.Text>
            <Card.Text><strong>Город:</strong> {vacancy.city}</Card.Text>
            <Card.Text><strong>Удалённая работа:</strong> {vacancy.is_remote ? 'Да' : 'Нет'}</Card.Text>
            <Card.Text><strong>Требования:</strong> {vacancy.requirements}</Card.Text>
            <Card.Text><strong>Обязанности:</strong> {vacancy.responsibilities}</Card.Text>
            {vacancy.telegram && (
              <Card.Text><strong>Telegram:</strong> {vacancy.telegram}</Card.Text>
            )}
            {vacancy.telegram_link && (
              <Card.Text>
                <strong>Ссылка на Telegram:</strong>{' '}
                <a href={vacancy.telegram_link} target="_blank" rel="noopener noreferrer">
                  {vacancy.telegram_link}
                </a>
              </Card.Text>
            )}
            <Card.Text><strong>Опубликовано:</strong> {new Date(vacancy.published_at).toLocaleString()}</Card.Text>
            <Card.Text><strong>Активна:</strong> {vacancy.is_active ? 'Да' : 'Нет'}</Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <Alert variant="danger" className="mt-3">Вакансия не найдена.</Alert>
      )}

      {/* Если пользователь — студент, показываем форму для выбора анкеты и отклика */}
     
        <Form className="mt-4">
          <Form.Group controlId="selectAnketa">
            <Form.Label>Выберите анкету для отклика</Form.Label>
            <Form.Select
              value={selectedAnketa}
              onChange={(e) => setSelectedAnketa(e.target.value)}
            >
              <option value="">-- Выберите анкету --</option>
              {ankets.length === 0 && <option disabled>Анкеты не найдены</option>}
              {ankets.map((anketa) => (
                <option key={anketa.id} value={anketa.id}>
                  {anketa.name || `Анкета #${anketa.id}`}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Button className="mt-3" onClick={handleRespond}>Откликнуться</Button>
        </Form>
     

      {message && <Alert className="mt-3" variant="info">{message}</Alert>}
    </Container>
  );
};

export default VacancyDetail;
