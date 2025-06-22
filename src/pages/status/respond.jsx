import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Modal, Button, Spinner } from "react-bootstrap";

const API_URL = "https://quality-herring-fine.ngrok-free.app/api";
const getAccessToken = () => localStorage.getItem("token");

const Respond = () => {
  const { vacancyId } = useParams();
  const [responses, setResponses] = useState([]);
  const [anketas, setAnketas] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const fetchResponses = async () => {
    try {
      const token = getAccessToken();
      const res = await axios.get(`${API_URL}/vacancies/${vacancyId}/responses/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = res.data || [];
      setResponses(data);

      // Получаем анкеты
      const anketaPromises = data
        .filter((r) => r.anketa_id && r.anketa_username)
        .map((r) =>
          axios.get(
            `${API_URL}/anketas/@${r.anketa_username}/anketa/${r.anketa_id}/`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        );

      const anketaResults = await Promise.all(anketaPromises);
      const anketaMap = {};
      anketaResults.forEach((r) => {
        anketaMap[r.data.id] = r.data;
      });
      setAnketas(anketaMap);
    } catch (err) {
      console.error("Ошибка загрузки откликов:", err);
      setResponses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, [vacancyId]);

  const handleShowAnketa = async (username, anketaId) => {
    try {
      const token = getAccessToken();
      const res = await axios.get(
        `${API_URL}/anketas/@${username}/anketa/${anketaId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalContent(res.data);
      setShowModal(true);
    } catch {
      alert("Ошибка загрузки анкеты");
    }
  };

  const updateStatus = async (responseId, status) => {
    try {
      const token = getAccessToken();
      await axios.post(
        `${API_URL}/vacancies/${vacancyId}/responses/${responseId}/set_status/`,
        { status }, // например: { status: "accepted" }
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      await fetchResponses(); // обновить список после изменения
    } catch (err) {
      console.error("Ошибка при обновлении статуса:", err);
      alert("Не удалось обновить статус.");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Откликнувшиеся на вакансию #{vacancyId}</h2>
      {responses.length === 0 ? (
        <p className="text-center">Пока никто не откликнулся.</p>
      ) : (
        <ul className="list-group">
          {responses.map((r) => {
            const anketa = anketas[r.anketa_id];
            return (
              <li key={r.id} className="list-group-item">
                <strong>{anketa?.name || "Имя отсутствует"}</strong>
                <br />
                Статус:{" "}
                {r.status === "accepted"
                  ? "✅ Принят"
                  : r.status === "rejected"
                  ? "❌ Отклонён"
                  : "⏳ Ожидает"}
                <div className="d-flex gap-2 flex-wrap mt-2">
                  {r.anketa_id && r.anketa_username && (
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() =>
                        handleShowAnketa(r.anketa_username, r.anketa_id)
                      }
                    >
                      Резюме
                    </button>
                  )}

                  {r.status === "pending" && (
                    <>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => updateStatus(r.id, "accepted")}
                      >
                        Принять
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => updateStatus(r.id, "rejected")}
                      >
                        Отклонить
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Анкета пользователя</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalContent ? (
            <>
              <h4>{modalContent.name}</h4>
              <p><strong>Email:</strong> {modalContent.email}</p>
              <p><strong>О себе:</strong> {modalContent.about_me}</p>
              <p><strong>Опыт:</strong> {modalContent.experience}</p>
              <p><strong>Телефон:</strong> {modalContent.phone_number}</p>
              <p><strong>Город:</strong> {modalContent.city}</p>
              <p><strong>Страна:</strong> {modalContent.country}</p>
              {modalContent.telegram && (
                <p><strong>Telegram:</strong> @{modalContent.telegram}</p>
              )}
            </>
          ) : (
            <p>Загрузка...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Respond;
