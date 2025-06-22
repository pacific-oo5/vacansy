import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: '',
    user_r: false  // Новое поле
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('https://quality-herring-fine.ngrok-free.app/api/auth/register/', formData);
      setMessage('Регистрация прошла успешно!');
      console.log('Success:', res.data);
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data) {
        const errors = Object.entries(error.response.data)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');
        setMessage(`Ошибка:\n${errors}`);
      } else {
        setMessage('Сетевая ошибка. Проверьте доступность сервера.');
      }
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4">Регистрация</h2>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Имя пользователя</label>
          <input
            type="text"
            name="username"
            className="form-control"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Пароль</label>
          <input
            type="password"
            name="password1"
            className="form-control"
            value={formData.password1}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Повторите пароль</label>
          <input
            type="password"
            name="password2"
            className="form-control"
            value={formData.password2}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            name="user_r"
            className="form-check-input"
            checked={formData.user_r}
            onChange={handleChange}
          />
          <label className="form-check-label">если вы работадатель</label>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};

export default Register;
