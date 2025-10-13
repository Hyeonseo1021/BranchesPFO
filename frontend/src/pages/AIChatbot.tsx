import React, { useState, useRef, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import axios from 'axios'; // axios 추가

export default function AIChatbotPage() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '안녕하세요! 무엇을 도와드릴까요?' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => { 
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      // 백엔드 API에 요청
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/chat/`, 
        {prompt: input},
        {withCredentials: true}
      );
      const botMessage = { sender: 'bot', text: response.data.response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching bot response:', error);
      let errorMessageText = '죄송합니다, 답변을 생성하는 데 실패했습니다.';
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessageText += ` (서버 에러: ${error.response.status})`
        } else if (error.request) {
          errorMessageText += ' (서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.)'
        } else {
          errorMessageText += ` (요청 설정 오류: ${error.message})`
        }
      }
      const errorMessage = { sender: 'bot', text: errorMessageText };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  // 자동 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-4 text-center">PFO AI 도우미</h1>

        {/* 대화창 */}
        <div className="bg-white border rounded-md h-[500px] overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-[70%] text-sm ${
                  msg.sender === 'user'
                    ? 'bg-green-200 text-right'
                    : 'bg-gray-200 text-left'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* 입력창 */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded px-4 py-2"
            placeholder="무엇이든 물어보세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          <button
            onClick={handleSend}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            전송
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
