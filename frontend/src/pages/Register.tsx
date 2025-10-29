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

    console.log("🔍 회원가입 요청 데이터:", { nickname, email, password: "***" });
    console.log("🔍 API URL:", `${process.env.REACT_APP_API_URL}/auth/register`);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        {
          nickname,
          email,
          password,
        },
        { withCredentials: true}
      );

      console.log("✅ 회원가입 성공:", response.data);
      alert("회원가입 성공!");
      navigate("/login");
    } catch (error: any) {
      console.error("❌ 회원가입 실패 - 전체 에러:", error);
      console.error("❌ 응답 데이터:", error.response?.data);
      console.error("❌ 상태 코드:", error.response?.status);

      let errorMessage = "회원가입 실패";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.cause) {
        // MongoDB 중복 키 오류 처리
        if (error.response.data.cause.includes('dup key')) {
          errorMessage = "이미 사용 중인 닉네임 또는 이메일입니다.";
        } else {
          errorMessage = error.response.data.cause;
        }
      }

      alert(errorMessage);
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

          {/* 로고 + 타이틀 */}
          <div className="flex flex-col items-center justify-center space-y-6 mb-8">
            <div className="flex items-center gap-2">
              <img src="/images/Branches_2.0_Logo.png" alt="Logo" className="h-8 w-auto" />
              <h1 className="text-4xl font-bold">회원가입</h1>
            </div>
          </div>

          {/* 회원가입 폼 */}
          <form onSubmit={handleRegister}>
            {/* 닉네임 */}
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
            {/* 이메일 ✅ 추가 */}
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
            {/* 비밀번호 */}
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

            {/* 비밀번호 확인 */}
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

            {/* 버튼 */}
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