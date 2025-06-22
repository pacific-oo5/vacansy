import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';

const API_URL = "https://quality-herring-fine.ngrok-free.app/api";

const VacancyDetail = () => {
  const { vacancyId } = useParams();
  const navigate = useNavigate();
  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vacancyRes = await axios.get(`${API_URL}/vacancies/${vacancyId}/`);
        setVacancy(vacancyRes.data);
        setFormData(vacancyRes.data);

        if (token) {
          const profileRes = await axios.get(`${API_URL}/my/`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCurrentUser(profileRes.data);
        }
      } catch (err) {
        console.error("Ошибка загрузки:", err);
        setMessage("Ошибка загрузки данных.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [vacancyId, token]);

  const isEmployer = currentUser?.user_r === true;
  const isOwner = currentUser && vacancy && currentUser.id === vacancy.user;

  const handleDelete = async () => {
    if (window.confirm("Вы уверены, что хотите удалить вакансию?")) {
      try {
        await axios.delete(`${API_URL}/vacancies/${vacancyId}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate("/MyVacancies");
      } catch (err) {
        console.error("Ошибка при удалении:", err);
        alert("Ошибка при удалении.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`${API_URL}/my/vacancies/${vacancyId}/`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVacancy(res.data);
      setFormData(res.data);
      setIsEditing(false);
      setMessage("✅ Вакансия успешно обновлена.");
    } catch (err) {
      console.error("Ошибка при сохранении:", err);
      setMessage("❌ Ошибка при сохранении.");
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
            {isEditing ? (
              <>
                <Form>
                  <Form.Group>
                    <Form.Label>Название</Form.Label>
                    <Form.Control
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mt-2">
                    <Form.Label>Описание</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={formData.description || ''}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mt-2">
                    <Form.Label>О себе</Form.Label>
                    <Form.Control
                      name="about_me"
                      value={formData.about_me || ''}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mt-2">
                    <Form.Label>Тип работы</Form.Label>
                    <Form.Control
                      name="work_type"
                      value={formData.work_type || ''}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mt-2">
                    <Form.Label>График</Form.Label>
                    <Form.Control
                      name="work_time"
                      value={formData.work_time || ''}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mt-2">
                    <Form.Label>Зарплата</Form.Label>
                    <Form.Control
                      type="number"
                      name="salary"
                      value={formData.salary || ''}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mt-2">
                    <Form.Label>Страна</Form.Label>
                    <Form.Control
                      name="country"
                      value={formData.country || ''}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mt-2">
                    <Form.Label>Город</Form.Label>
                    <Form.Control
                      name="city"
                      value={formData.city || ''}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mt-2">
                    <Form.Check
                      label="Удалённая работа"
                      type="checkbox"
                      name="is_remote"
                      checked={formData.is_remote || false}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mt-2">
                    <Form.Label>Требования</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="requirements"
                      value={formData.requirements || ''}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mt-2">
                    <Form.Label>Обязанности</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="responsibilities"
                      value={formData.responsibilities || ''}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mt-2">
                    <Form.Label>Telegram</Form.Label>
                    <Form.Control
                      name="telegram"
                      value={formData.telegram || ''}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mt-2">
                    <Form.Label>Ссылка на Telegram</Form.Label>
                    <Form.Control
                      name="telegram_link"
                      value={formData.telegram_link || ''}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <div className="mt-3 d-flex gap-2">
                    <Button variant="success" onClick={handleSave}>
                      💾 Сохранить
                    </Button>
                    <Button variant="secondary" onClick={() => setIsEditing(false)}>
                      ❌ Отмена
                    </Button>
                  </div>
                </Form>
              </>
            ) : (
              <>
                <Card.Title>{vacancy.name}</Card.Title>
                <Card.Text><strong>Описание:</strong> {vacancy.description}</Card.Text>
                <Card.Text><strong>О себе:</strong> {vacancy.about_me}</Card.Text>
                <Card.Text><strong>Тип работы:</strong> {vacancy.work_type}</Card.Text>
                <Card.Text><strong>График:</strong> {vacancy.work_time}</Card.Text>
                <Card.Text><strong>Зарплата:</strong> {vacancy.salary} сом</Card.Text>
                <Card.Text><strong>Страна:</strong> {vacancy.country}</Card.Text>
                <Card.Text><strong>Город:</strong> {vacancy.city}</Card.Text>
                <Card.Text><strong>Удалённая работа:</strong> {vacancy.is_remote ? 'Да' : 'Нет'}</Card.Text>
                <Card.Text><strong>Требования:</strong> {vacancy.requirements}</Card.Text>
                <Card.Text><strong>Обязанности:</strong> {vacancy.responsibilities}</Card.Text>
                <Card.Text><strong>Telegram:</strong> {vacancy.telegram}</Card.Text>
                <Card.Text>
                  <strong>Ссылка на Telegram:</strong>{' '}
                  <a href={vacancy.telegram_link} target="_blank" rel="noopener noreferrer">
                    {vacancy.telegram_link}
                  </a>
                </Card.Text>
                <Card.Text><strong>Опубликовано:</strong> {new Date(vacancy.published_at).toLocaleString()}</Card.Text>
                <Card.Text><strong>Активна:</strong> {vacancy.is_active ? 'Да' : 'Нет'}</Card.Text>

                {/* Только для работодателя-владельца */}
              
                  <div className="mt-3 d-flex gap-2">
                    <Button variant="primary" onClick={() => setIsEditing(true)}>
                      ✏ Редактировать
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                      🗑 Удалить
                    </Button>
                  </div>
          
              </>
            )}
          </Card.Body>
        </Card>
      ) : (
        <Alert variant="danger" className="mt-3">Вакансия не найдена.</Alert>
      )}

      {message && <Alert variant="info" className="mt-3">{message}</Alert>}
    </Container>
  );
};

export default VacancyDetail;
