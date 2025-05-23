
import logo from './logo.svg';
import './App.css';

import React, { useState, FormEvent } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    alert(`아이디: ${username}, 비밀번호: ${password}`);
  };

  return (
    <div className="min-h-screen bg-lime-100 flex flex-col items-center justify-center px-4">
      <img src="/Branches_2.0_Logo.png" alt="Logo" className="h-28 mb-4" />

      <h1 className="text-4xl font-bold mb-6">LOGIN</h1>

      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 font-semibold mb-1">
            아이디
          </label>
          <input
            id="username"
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lime-500"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-semibold mb-1">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lime-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition-colors"
        >
          로그인
        </button>

        <div className="flex justify-between mt-4 text-sm text-gray-600">
          <a href="#" className="hover:underline">아이디/비번찾기</a>
          <a href="#" className="hover:underline">회원가입</a>
        </div>
      </form>
    </div>
  );
}

export default App;
