import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const login = async () => {
    try {
      const res = await axios.post('/api/auth/login/', {
        email,
        password,
      });

      const access = res.data.access;
      localStorage.setItem('token', access);

      alert('Успешный вход!');

      navigate('/ProfileS'); // ⬅ перенаправление после входа
    } catch (err) {
      alert('Ошибка входа');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Вход</h2>
      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <input
        placeholder="Пароль"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <button onClick={login}>Войти</button>
    </div>
  );
};

export default Login;
