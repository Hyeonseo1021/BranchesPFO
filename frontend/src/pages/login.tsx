import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../pages/Header';
import Footer from '../pages/Footer';
import { Link } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`아이디: ${username}, 비밀번호: ${password}`);
  };

  return (
   <div
  className="min-h-screen flex flex-col justify-between bg-[#DAF8AA] bg-no-repeat bg-center"
  style={{
    backgroundImage: "url('/loginbanner.png')",
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
                src="/Branches_2.0_Logo.png"
                alt="Logo"
                className="h-8 w-auto"
              />
              <h1 className="text-4xl font-bold">LOGIN</h1>
            </div>
          </div>


          {/* 로그인 입력 폼 */}
          <form onSubmit={handleLogin}>
            {/* 아이디 입력 */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                아이디
              </label>
              <input
                type="text"
                placeholder="아이디"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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