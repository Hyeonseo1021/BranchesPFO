import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../pages/Header';
import Footer from '../pages/Footer';
import { Link } from 'react-router-dom';
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState('');   // username → email
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        email,
        password,
      });

      // ✅ 백엔드가 내려주는 토큰을 localStorage에 저장
      localStorage.setItem("token", response.data.token);

      alert("로그인 성공! 메인 페이지로 이동합니다.");
      navigate("/main");
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "로그인 실패");
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

          {/* 상단 로고 + 타이틀 */}
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

          {/* 로그인 입력 폼 */}
          <form onSubmit={handleLogin}>
            {/* 이메일 입력 */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                이메일
              </label>
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}  // email로 변경
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700"
              />
            </div>

            {/* 비밀번호 입력 */}
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

            {/* 로그인 버튼 */}
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded w-full"
              >
                로그인
              </button>
            </div>

            {/* 하단 링크 */}
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
