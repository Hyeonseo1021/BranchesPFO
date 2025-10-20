import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading, logout } = useAuth();

  const handleProtectedNavigation = (path: string) => {
    if (!isLoggedIn) {
      navigate('/unauthorized');
    } else {
      navigate(path);
    }
  };

  const handleLogout = async () => {
    await logout();
    alert('로그아웃 되었습니다.');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/main')}>
          <img src="/images/Branches_2.0_Logo.png" alt="로고" className="h-8 w-auto" />
          <h1 className="text-xl font-bold">Branches PFO</h1>
        </div>
        <nav className="space-x-4 text-sm text-gray-400">
          로딩 중...
        </nav>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/main')}>
        <img src="/images/Branches_2.0_Logo.png" alt="로고" className="h-8 w-auto" />
        <h1 className="text-xl font-bold">Branches PFO</h1>
      </div>

      <nav className="space-x-4 text-sm">
        <a onClick={() => handleProtectedNavigation('/community')} className="hover:underline cursor-pointer">커뮤니티</a>
        <a onClick={() => handleProtectedNavigation('/aichatbot')} className="hover:underline cursor-pointer">AI도우미</a>
        <a onClick={() => handleProtectedNavigation('/aipfopage')} className="hover:underline cursor-pointer">이력서/포트폴리오 생성</a>
        <a onClick={() => handleProtectedNavigation('/jobrecommend')} className="hover:underline cursor-pointer">취업 정보 추천</a>
        <a onClick={() => handleProtectedNavigation('/mypage')} className="hover:underline cursor-pointer">MyPage</a>
        
        {isLoggedIn ? (
          <a onClick={handleLogout} className="hover:underline cursor-pointer text-red-600">로그아웃</a>
        ) : (
          <a onClick={() => navigate('/login')} className="hover:underline cursor-pointer text-blue-600">로그인</a>
        )}
      </nav>
    </header>
  );
}