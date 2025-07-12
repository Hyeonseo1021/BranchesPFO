import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/main')}>
        <img src="/Branches_2.0_Logo.png" alt="로고" className="h-8 w-auto" />
        <h1 className="text-xl font-bold">Branches PFO</h1>
      </div>

      <nav className="space-x-4 text-sm">
        <a onClick={() => navigate('/community')} className="hover:underline cursor-pointer">커뮤니티</a>
        <a href="#" className="hover:underline">AI도우미</a>
        <a onClick={() => navigate('/home')} className="hover:underline cursor-pointer">분석받기</a>
        <a onClick={() => navigate('/login')} className="hover:underline cursor-pointer">로그인</a>
      </nav>
    </header>
  );
}
