import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../pages/Header';
import Footer from '../pages/Footer';
import axios from 'axios';

export default function Register() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      // ✅ 수정된 부분: API 경로를 '/api/auth/register'로 수정
      const response = await axios.post("/api/auth/register", {
        name: nickname,
        email: email,
        password,
      });

      console.log("✅ 회원가입 성공:", response.data);
      alert("회원가입 성공! 로그인 페이지로 이동합니다.");
      navigate("/login");
    } catch (error: any) {
      console.error("❌ 회원가입 실패:", error.response?.data || error.message);
      alert(error.response?.data?.message || "회원가입에 실패했습니다.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between bg-[#DAF8AA] bg-no-repeat bg-center"
      style={{
        backgroundImage: "url('/images/loginbanner.png')",
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <Header />
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="bg-white/80 backdrop-blur-md p-12 rounded-lg shadow-lg w-full max-w-2xl min-h-[600px] flex flex-col justify-center">
          <div className="flex flex-col items-center justify-center space-y-6 mb-8">
            <div className="flex items-center gap-2">
              <img src="/images/Branches_2.0_Logo.png" alt="Logo" className="h-8 w-auto" />
              <h1 className="text-4xl font-bold">회원가입</h1>
            </div>
          </div>

          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">닉네임</label>
              <input
                type="text"
                placeholder="닉네임"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">이메일</label>
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">비밀번호</label>
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">비밀번호 확인</label>
              <input
                type="password"
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700"
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded w-full"
              >
                회원가입
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}