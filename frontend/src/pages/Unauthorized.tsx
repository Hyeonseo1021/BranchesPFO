// src/pages/Unauthorized.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          {/* 아이콘 */}
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <svg 
                className="w-12 h-12 text-red-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                />
              </svg>
            </div>
          </div>

          {/* 메시지 */}
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            로그인이 필요합니다
          </h1>
          <p className="text-gray-600 mb-8">
            이 페이지에 접근하려면 로그인이 필요합니다.<br />
            로그인 후 다시 시도해주세요.
          </p>

          {/* 버튼들 */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition"
            >
              로그인
            </button>
            <button
              onClick={() => navigate('/register')}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded transition"
            >
              회원가입
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full text-gray-600 hover:text-gray-800 font-medium py-2"
            >
              메인으로 돌아가기
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}