import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Spinner, Alert } from 'react-bootstrap';

function MyProfile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    about_me: '',
    experience: '',
    country: '',
    city: '',
    phone_number: '',
    is_active: true
  });

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://quality-herring-fine.ngrok-free.app/api/my/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
      } catch (err) {
        setError('Не удалось загрузить данные профиля. Убедитесь, что вы авторизованы.');
        console.error('Ошибка при получении профиля:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://quality-herring-fine.ngrok-free.app/api/my/anketas/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setMessage('✅ Анкета успешно добавлена!');
      setFormData({
        name: '',
        about_me: '',
        experience: '',
        country: '',
        city: '',
        phone_number: '',
        is_active: true
      });
    } catch (err) {
      console.error('Ошибка при создании анкеты:', err);
      setMessage('❌ Не удалось добавить анкету. Проверьте заполненные данные.');
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h1 className="mb-4">Создание Анкеты</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="info">{message}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Имя</Form.Label>
          <Form.Control name="name" value={formData.name} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Обо мне</Form.Label>
          <Form.Control as="textarea" name="about_me" rows={3} value={formData.about_me} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Опыт</Form.Label>
          <Form.Control name="experience" value={formData.experience} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Страна</Form.Label>
          <Form.Control name="country" value={formData.country} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Город</Form.Label>
          <Form.Control name="city" value={formData.city} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Номер телефона</Form.Label>
          <Form.Control name="phone_number" value={formData.phone_number} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check type="checkbox" label="Активна" name="is_active" checked={formData.is_active} onChange={handleChange} />
        </Form.Group>

        <Button variant="primary" type="submit">
          Сохранить анкету
        </Button>
      </Form>
    </Container>
  );
}

export default MyProfile;
