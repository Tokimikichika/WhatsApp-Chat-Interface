import React, { useState } from 'react';
import Login from './components/Login';
import Chat from './components/Chat';
import './styles.css';

const App = () => {
  const [credentials, setCredentials] = useState(() => {
    const savedCredentials = localStorage.getItem('whatsapp-chat-credentials');
    return savedCredentials ? JSON.parse(savedCredentials) : null;
  });
  const [phoneNumber, setPhoneNumber] = useState(''); 
  const [chatId, setChatId] = useState(''); 

  const handleLogin = (credentials) => {
    setCredentials(credentials);
    localStorage.setItem('whatsapp-chat-credentials', JSON.stringify(credentials));
  };

  const handleLogout = () => {
    setCredentials(null);
    setPhoneNumber('');
    setChatId('');
    localStorage.removeItem('whatsapp-chat-credentials');
  };

  const startChat = () => {
    if (phoneNumber.length === 11) {
      setChatId(`${phoneNumber}@c.us`); 
    } else {
      alert('Номер телефона должен состоять из 11 цифр.');
    }
  };

  return (
    <div className="app">
      {!credentials ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="chat-interface">
          <button onClick={handleLogout} >
            Выйти
          </button>

          <div className="chat-container">
            <div className="chat-header">
              Чат с {chatId ? chatId.replace('@c.us', '') : 'новым собеседником'}
            </div>
            {chatId ? (
              <Chat
                idInstance={credentials.idInstance}
                apiTokenInstance={credentials.apiTokenInstance}
                chatId={chatId}
              />
            ) : (
              <div className="chat-messages">
                <input
                  type="text"
                  placeholder="Введите номер телефона (например, 70000000000)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  maxLength={11}
                />
                <button onClick={startChat}>Начать чат</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;