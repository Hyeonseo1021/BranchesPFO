import React, { useState, useRef, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import axiosInstance from '../api/axios'; 
import axios from 'axios';

export default function AIChatbotPage() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '안녕하세요! 무엇을 도와드릴까요?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => { 
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/chat/', {
        prompt: input
      });
      const botMessage = { sender: 'bot', text: response.data.response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching bot response:', error);
      let errorMessageText = '죄송합니다, 답변을 생성하는 데 실패했습니다.';
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessageText += ` (서버 에러: ${error.response.status})`;
        } else if (error.request) {
          errorMessageText += ' (서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.)';
        } else {
          errorMessageText += ` (요청 설정 오류: ${error.message})`;
        }
      }
      const errorMessage = { sender: 'bot', text: errorMessageText };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />

      <main className="flex-1 w-full mx-auto px-4 py-8">
        {/* 타이틀 */}
        <div className="max-w-5xl mx-auto mb-6">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            PFO AI 도우미
          </h1>
          <p className="text-center text-gray-600 mt-2">
            무엇이든 물어보세요! AI가 도와드립니다.
          </p>
        </div>

        {/* 채팅 컨테이너 */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col" 
             style={{ height: 'calc(100vh - 400px)', minHeight: '600px' }}>
          
          {/* 대화창 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                } animate-fadeIn`}
              >
                {/* 봇 아바타 */}
                {msg.sender === 'bot' && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold mr-3">
                    AI
                  </div>
                )}

                {/* 메시지 버블 */}
                <div
                  className={`px-6 py-3 rounded-2xl max-w-[75%] shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                  }`}
                >
                  <p className="text-base leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </p>
                </div>

                {/* 유저 아바타 */}
                {msg.sender === 'user' && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white font-bold ml-3">
                    나
                  </div>
                )}
              </div>
            ))}

            {/* 로딩 표시 */}
            {isLoading && (
              <div className="flex justify-start animate-fadeIn">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold mr-3">
                  AI
                </div>
                <div className="px-6 py-3 rounded-2xl bg-white border border-gray-200 rounded-bl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* 입력창 */}
          <div className="border-t border-gray-200 p-6 bg-white">
            <div className="flex gap-3">
              <input
                type="text"
                className="flex-1 border-2 border-gray-300 rounded-xl px-6 py-4 text-base focus:outline-none focus:border-green-500 transition-colors"
                placeholder="무엇이든 물어보세요..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isLoading) handleSend();
                }}
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isLoading ? '전송 중...' : '전송'}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}