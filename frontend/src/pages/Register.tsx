import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [nickname, setNickname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 임시 알림으로 입력값 확인
    alert(`닉네임: ${nickname}\n아이디: ${username}\n비밀번호: ${password}\n비밀번호 확인: ${confirmPassword}`);
  };

  return (
    <div className="min-h-screen bg-lime-200 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="flex flex-col items-center justify-center space-y-6 mb-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
            <img
              src="/Branches_2.0_Logo.png"
              alt="Logo"
              className="h-8 w-auto"
            />
            <h1 className="text-4xl font-bold">회원가입</h1>
          </div>
        </div>

        <form onSubmit={handleRegister}>
          {/* 닉네임 */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">닉네임</label>
            <input
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>

          {/* 아이디 */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">아이디</label>
            <input
              type="text"
              placeholder="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>

          {/* 비밀번호 */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>

          {/* 비밀번호 재확인 */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">비밀번호 확인</label>
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
            >
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
