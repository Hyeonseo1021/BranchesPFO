import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('로그아웃 되었습니다.');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/main')}>
        <img src="/images/Branches_2.0_Logo.png" alt="로고" className="h-8 w-auto" />
        <h1 className="text-xl font-bold">Branches PFO</h1>
      </div>

      <nav className="space-x-4 text-sm">
        <a onClick={() => navigate('/community')} className="hover:underline cursor-pointer">커뮤니티</a>
        <a onClick={() => navigate('/aichatbot')} className="hover:underline cursor-pointer">AI도우미</a>
        <a onClick={() => navigate('/aipfopage')} className="hover:underline cursor-pointer">이력서/포트폴리오 생성</a>
          <a
          onClick={() => navigate('/jobrecommend')}
          className="hover:underline cursor-pointer"
        >
          취업 정보 추천
        </a>
        <a
          onClick={() => {
            if (!isLoggedIn) {
              alert('로그인이 필요합니다.');
              navigate('/login');
            } else {
              navigate('/mypage');
            }
          }}
          className="hover:underline cursor-pointer"
        >
          Mypage
        </a>

        {isLoggedIn ? (
          <a onClick={handleLogout} className="hover:underline cursor-pointer text-red-600">로그아웃</a>
        ) : (
          <a onClick={() => navigate('/login')} className="hover:underline cursor-pointer">로그인</a>
        )}
      </nav>
    </header>
  );
}
