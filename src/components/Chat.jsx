import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chat = ({ idInstance, apiTokenInstance, chatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');

  const saveChatState = (chatId, messages) => {
    localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
  };

  const loadChatState = (chatId) => {
    const savedMessages = localStorage.getItem(`chat_${chatId}`);
    return savedMessages ? JSON.parse(savedMessages) : [];
  };

  useEffect(() => {
    const loadedMessages = loadChatState(chatId);
    setMessages(loadedMessages);
  }, [chatId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const url = `https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;
    const payload = {
      chatId,
      message: newMessage,
    };

    try {
      await axios.post(url, payload);
      const newMsg = { text: newMessage, sender: 'me' };
      const updatedMessages = [...messages, newMsg];
      setMessages(updatedMessages);
      saveChatState(chatId, updatedMessages);
      setNewMessage('');
      setError('');
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      setError('Не удалось отправить сообщение. Проверьте авторизацию и номер телефона.');
    }
  };

  const fetchMessages = async () => {
    const url = `https://api.green-api.com/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`;

    try {
      const response = await axios.get(url);

      if (response.data) {
        const notification = response.data;
        const messageData = notification?.body?.messageData?.textMessageData?.textMessage;
        const sender = notification?.body?.senderData?.sender;
        const receiptId = notification.receiptId;

        if (messageData && sender === chatId) {
          setMessages((prevMessages) => {
            const isDuplicate = prevMessages.some((msg) => msg.text === messageData);
            if (!isDuplicate) {
              const updatedMessages = [...prevMessages, { text: messageData, sender: 'them' }];
              saveChatState(chatId, updatedMessages);
              return updatedMessages;
            }
            return prevMessages;
          });
        }

        await axios.delete(
          `https://api.green-api.com/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`
        );
      }
    } catch (error) {
      console.error('Ошибка получения уведомлений:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchMessages, 1000); 
    return () => clearInterval(interval);
  }, [chatId]);

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === 'me' ? 'me' : 'them'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Введите сообщение..."
        />
        <button onClick={sendMessage}>Отправить</button>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Chat;
