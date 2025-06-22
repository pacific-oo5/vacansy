import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Spinner, Alert, Modal } from 'react-bootstrap';

function MyVacancyResponses({ vacancyId }) {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedAnketa, setSelectedAnketa] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await axios.get(
          `https://quality-herring-fine.ngrok-free.app/api/vacancies/${vacancyId}/responses/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setResponses(res.data);
      } catch (err) {
        setError('Ошибка загрузки откликов');
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [vacancyId]);

  const openAnketaModal = async (username, anketaId) => {
    try {
      const res = await axios.get(
        `https://quality-herring-fine.ngrok-free.app/api/anketas/@${username}/anketa/${anketaId}/`
      );
      setSelectedAnketa(res.data);
      setShowModal(true);
    } catch (err) {
      console.error('Ошибка загрузки анкеты:', err);
    }
  };

  return (
    <Container className="mt-4">
      <h3>Откликнувшиеся</h3>

      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : responses.length === 0 ? (
        <Alert variant="info">Нет откликов</Alert>
      ) : (
        <Row>
          {responses.map((res) => (
            <Col md={4} key={res.id} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>{res.worker_username}</Card.Title>
                  <Card.Text>Статус: {res.status}</Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => openAnketaModal(res.worker_username, res.anketa_id)}
                  >
                    Посмотреть анкету
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Модалка с анкетой */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Анкета</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAnketa ? (
            <>
              <h5>{selectedAnketa.name}</h5>
              <p><strong>Обо мне:</strong> {selectedAnketa.about_me}</p>
              <p><strong>Город:</strong> {selectedAnketa.city}</p>
              {/* Добавь остальные поля при необходимости */}
            </>
          ) : (
            <Spinner animation="border" />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default MyVacancyResponses;