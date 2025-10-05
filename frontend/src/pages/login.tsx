import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../pages/Header';
import Footer from '../pages/Footer';
import { Link } from 'react-router-dom';
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // ✅ 수정된 부분: 하드코딩된 URL을 제거하고, API 경로를 '/api/auth/login'으로 수정
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      alert("로그인 성공! 메인 페이지로 이동합니다.");
      navigate("/main");
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "로그인에 실패했습니다.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between bg-[#DAF8AA] bg-no-repeat bg-center"
      style={{
        backgroundImage: "url('/images/loginbanner.png')",
        backgroundSize: 'contain',
      }}
    >
      <Header />
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="bg-white/80 backdrop-blur-md p-12 rounded-lg shadow-lg w-full max-w-2xl min-h-[600px] flex flex-col justify-center">
          <div className="flex flex-col items-center justify-center space-y-6 mb-8">
            <div className="flex items-center gap-2">
              <img
                src="/images/Branches_2.0_Logo.png"
                alt="Logo"
                className="h-8 w-auto"
              />
              <h1 className="text-4xl font-bold">LOGIN</h1>
            </div>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                이메일
              </label>
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700"
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
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700"
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded w-full"
              >
                로그인
              </button>
            </div>
            <div className="flex justify-between mt-4 text-sm text-gray-600">
              <a href="#" className="hover:underline">아이디/비번찾기</a>
              <Link to="/register" className="hover:underline">회원가입</Link>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}