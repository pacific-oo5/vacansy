import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function MyProfile() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  const navigate = useNavigate();
    useEffect(() => {
        const fetchMyData = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setError('Токен не найден. Пожалуйста, авторизуйтесь.');
                    setLoading(false);
                    return;
                }

                const response = await axios.get('https://quality-herring-fine.ngrok-free.app/api/my/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setData(response.data);
            } catch (err) {
                setError('Не удалось загрузить данные профиля. Пожалуйста, убедитесь, что вы авторизованы.');
                console.error('Ошибка при получении данных профиля:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyData();
    }, []);

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Загрузка...</span>
                </Spinner>
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

    // Проверяем, являются ли данные о вакансиях или анкетах
    const isEmployer = data && data.vacancies;

    return (
        <Container className="mt-5">
            <h1 className="mb-4">Мой Профиль</h1>

            {isEmployer ? (
                <>
                    <h2>Мои Вакансии</h2>
                    {data.vacancies.length > 0 ? (
                        <Row xs={1} md={2} lg={3} className="g-4">
                            {data.vacancies.map((vacancy) => (
                                <Col key={vacancy.id}>
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>{vacancy.name}</Card.Title>
                                            <Card.Text>
                                                <strong>Зарплата:</strong> {vacancy.salary} сомов
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Город:</strong> {vacancy.city || 'Не указан'}
                                                {vacancy.is_remote && ' (Удаленно)'}
                                            </Card.Text>
                                       <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/DescR/${vacancy.id}`)}
                  >
                    Подробнее
                  </button>
                      <button
                    className="btn btn-outline-success"
                    onClick={() => navigate(`/respond/${vacancy.id}`)}
                  >
                    Откликнувшиеся
                  </button>
                                     
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <Alert variant="info">У вас пока нет активных вакансий. <Link to="/createVac">Создать вакансию</Link></Alert>
                    )}
                </>
            ) : (
                <>
                    <h2>Мои Анкеты</h2>
                    {data.ankets && data.ankets.length > 0 ? (
                        <Row xs={1} md={2} lg={3} className="g-4">
                            {data.ankets.map((anketa) => (
                                <Col key={anketa.id}>
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>{anketa.name}</Card.Title>
                                            <Card.Text>
                                                <strong>Обо мне:</strong> {anketa.about_me?.substring(0, 100)}...
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Город:</strong> {anketa.city || 'Не указан'}
                                            </Card.Text>
                                    
                                               <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/A_desc/${anketa.id}/`)}
                  >
                    Подробнее
                  </button>
                  
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <Alert variant="info">У вас пока нет активных анкет.     <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/createAnk`)}
                  >
                    Подробнее
                  </button></Alert>
                    )}
                </>
            )}
        </Container>
    );
}

export default MyProfile;
