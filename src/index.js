import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <>
      {/* 🔥 Баннер 1XBET */}
      <div style={{
        backgroundColor: '#0047ab',
        color: 'white',
        padding: '10px',
        textAlign: 'center'
      }}>
        <a 
          href="https://1xbet.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{color: 'white', textDecoration: 'none'}}
        >
          🔥 Делай ставки на 1XBET — лучшие коэффициенты и быстрые выплаты! 🔥
        </a>
      </div>

      {/* 🎯 Контент */}
      <App />

      {/* 🦾 Футер */}
      <footer style={{
        backgroundColor: '#222',
        color: 'white',
        padding: '20px',
        textAlign: 'center',
        marginTop: '20px'
      }}>
        <h3>Vacansy</h3>
        <p>Платформа для поиска вакансий, стажировок и фриланс-заказов.</p>
        
        <div style={{margin: '10px 0'}}>
          <a href="/createVac" style={{color: '#ddd', margin: '0 10px'}}>Добавить вакансию</a>
          <a href="/createAnk" style={{color: '#ddd', margin: '0 10px'}}>Создать анкету</a>
          <a href="/responded" style={{color: '#ddd', margin: '0 10px'}}>Мои отклики</a>
        </div>

        <div style={{margin: '10px 0'}}>
          <p>Email: vacansssy@gmail.com</p>
          <p>Телефон: +996 (705) 011-148</p>
          <p>Адрес: г. Бишкек, пр. Айтматова, 66</p>
        </div>

        <div style={{margin: '10px 0'}}>
          <a href="https://t.me/Vacansssy" target="_blank" rel="noopener noreferrer" style={{color: '#ddd', margin: '0 8px'}}>Telegram</a>
          <a href="https://instagram.com/vacansssy" target="_blank" rel="noopener noreferrer" style={{color: '#ddd', margin: '0 8px'}}>Instagram</a>
        </div>

        <p style={{marginTop: '15px', fontSize: '0.9rem', color: '#aaa'}}>
          © 2025 Vacansy. Все права защищены.
        </p>
      </footer>
    </>
  </React.StrictMode>
);
