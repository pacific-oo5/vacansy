import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Desc = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [anketa, setAnketa] = useState(null);
  const [editedAnketa, setEditedAnketa] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Вы не авторизованы.');
          setLoading(false);
          return;
        }

        const userRes = await axios.get('https://quality-herring-fine.ngrok-free.app/api/my/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = userRes.data;
        setUserData(user);

        const isStudent = user?.role === 'student';
        const url = isStudent
          ? `https://quality-herring-fine.ngrok-free.app/api/anketas/@${user.username}/anketa/${id}/`
          : `https://quality-herring-fine.ngrok-free.app/api/my/anketas/${id}/`;

        const anketaRes = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const anketaData = anketaRes.data;
        setAnketa(anketaData);
        setEditedAnketa(anketaData);

        const anketaOwnerId = typeof anketaData.user === 'object'
          ? anketaData.user?.id
          : anketaData.user || anketaData.owner || anketaData.owner_id;

        setIsOwner(anketaOwnerId === user.id);
      } catch (err) {
        if (err.response?.status === 403) {
          setError('Ошибка 403: Доступ запрещен.');
        } else if (err.response?.status === 404) {
          setError('Ошибка 404: Анкета не найдена.');
        } else {
          setError('Ошибка при загрузке данных.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Удалить анкету?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://quality-herring-fine.ngrok-free.app/api/my/anketas/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Анкета удалена.');
      navigate('/ProfileS');
    } catch (err) {
      console.error(err);
      alert('Ошибка при удалении.');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedAnketa({ ...editedAnketa, [name]: value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(
        `https://quality-herring-fine.ngrok-free.app/api/my/anketas/${id}/`,
        editedAnketa,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAnketa(res.data);
      setIsEditing(false);
      alert('Анкета обновлена.');
    } catch (err) {
      console.error(err);
      alert('Ошибка при обновлении.');
    }
  };

  if (loading) return <p className="text-center mt-4">Загрузка...</p>;
  if (error) return <p className="text-center text-danger mt-4">{error}</p>;
  if (!anketa) return <p className="text-center mt-4">Анкета не найдена.</p>;

  return (
    <div className="container my-4">
      <div className="card shadow">
        <div className="card-header">
          {isEditing ? (
            <input className="form-control" name="name" value={editedAnketa.name} onChange={handleEditChange} />
          ) : (
            <>
              <h3>{anketa.name}</h3>
              <small className="text-muted">
                Возраст: {anketa.age} | Пол: {anketa.gender}
              </small>
            </>
          )}
        </div>
        <div className="card-body">
          {[
            ['about_me', 'Обо мне'],
            ['experience', 'Опыт'],
            ['education', 'Образование'],
            ['city', 'Город'],
            ['country', 'Страна'],
            ['phone_number', 'Телефон'],
            ['email', 'Email'],
          ].map(([key, label]) => (
            <div key={key}>
              <h5>{label}</h5>
              {isEditing ? (
                <input
                  className="form-control mb-2"
                  name={key}
                  value={editedAnketa[key] || ''}
                  onChange={handleEditChange}
                />
              ) : (
                <p>{anketa[key]}</p>
              )}
            </div>
          ))}
        </div>

        <div className="card-footer d-flex justify-content-between flex-wrap">
          <Link to={userData?.role === 'student' ? '/ProfileS' : '/'} className="btn btn-secondary mb-2">
            ← Назад
          </Link>

         
            <div className="d-flex gap-2 mb-2">
              {isEditing ? (
                <>
                  <button className="btn btn-success" onClick={handleSave}>💾 Сохранить</button>
                  <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>❌ Отмена</button>
                </>
              ) : (
                <>
                  <button className="btn btn-warning" onClick={() => setIsEditing(true)}>✏️ Редактировать</button>
                  <button className="btn btn-danger" onClick={handleDelete}>🗑 Удалить</button>
                </>
              )}
            </div>
        
        </div>
      </div>
    </div>
  );
};

export default Desc;
