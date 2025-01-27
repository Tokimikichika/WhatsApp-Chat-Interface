import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [notification, setNotification] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!idInstance || !apiTokenInstance) {
      setNotification('Пожалуйста, заполните все поля');
      return;
    }
    setNotification('Успешный вход');
    onLogin({ idInstance, apiTokenInstance });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Вход в WhatsApp</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="idInstance"
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value)}
          />
          <input
            type="text"
            placeholder="apiTokenInstance"
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value)}
          />
          <button type="submit">Войти</button>
        </form>
        {notification && <div className="notification-box">{notification}</div>}
      </div>
    </div>
  );
};

export default Login;
