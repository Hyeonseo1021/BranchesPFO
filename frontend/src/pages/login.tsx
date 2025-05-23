import React, { useState, FormEvent } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`아이디: ${username}, 비밀번호: ${password}`);
  };

  return (
    <div className="min-h-screen bg-lime-200 flex flex-col items-center justify-center relative">
      <div className="absolute top-4 left-4">
        <img src="Branches_2.0_Logo.png" alt="Logo" className="h-10 w-auto" />
      </div>
      <h1 className="text-4xl font-bold mb-8">LOGIN</h1>
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            아이디
          </label>
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            비밀번호
          </label>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            로그인
          </button>
        </div>
        <div className="flex justify-between mt-4 text-sm text-gray-600">
          <a href="#" className="hover:underline">아이디/비번찾기</a>
          <a href="#" className="hover:underline">회원가입</a>
        </div>
      </form>
    </div>
  );
}
