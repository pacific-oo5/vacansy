import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';

const API_URL = 'https://quality-herring-fine.ngrok-free.app/api';

function MyResponses() {
  const [responses, setResponses] = useState([]);
  const [vacancyTitles, setVacancyTitles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Токен не найден. Пожалуйста, авторизуйтесь.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}/my/responses/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data.results;
        setResponses(data);

        // Загружаем названия вакансий
        const vacancyIds = [...new Set(data.map(r => r.vacancy))];
        const titles = {};

        await Promise.all(
          vacancyIds.map(async (id) => {
            try {
              const res = await axios.get(`${API_URL}/vacancies/${id}/`);
              titles[id] = res.data.name;
            } catch (e) {
              titles[id] = `Вакансия #${id}`;
            }
          })
        );

        setVacancyTitles(titles);
      } catch (err) {
        console.error('Ошибка при получении откликов:', err);
        setError('Не удалось загрузить отклики. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, []);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h1 className="mb-4">Мои отклики</h1>
      {responses.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {responses.map((item) => (
            <Col key={item.id}>
              <Card>
                <Card.Body>
                  <Card.Title>{vacancyTitles[item.vacancy] || `Вакансия #${item.vacancy}`}</Card.Title>
                  <Card.Text>
                    <strong>Статус:</strong>{' '}
                    {item.status === 'pending'
                      ? 'Ожидание'
                      : item.status === 'accepted'
                      ? 'Принято'
                      : 'Отклонено'}
                  </Card.Text>
                  <Card.Text>
                    <strong>Дата отклика:</strong>{' '}
                    {new Date(item.responded_at).toLocaleDateString()}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info">У вас пока нет откликов.</Alert>
      )}
    </Container>
  );
}

export default MyResponses;
