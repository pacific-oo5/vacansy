import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      const res = await axios.post('https://quality-herring-fine.ngrok-free.app/api/auth/login/', {
        email,
        password,
      });
      const access = res.data.access; // JWT access token
      localStorage.setItem('token', access); // Сохраняем токен
      alert('Успешный вход!');
    } catch (err) {
      alert('Ошибка входа');
    }
  };

  return (
    <div>
      <h2>Вход</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Пароль" type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={login}>Войти</button>
    </div>
  );
};

export default Login;