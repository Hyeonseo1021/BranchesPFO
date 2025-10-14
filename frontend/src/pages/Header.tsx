import React from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

export default function Header() {
  const navigate = useNavigate();

  // ✅ localStorage 체크 제거 - 쿠키 기반 인증 사용
  const handleLogout = async () => {
    try {
      // ✅ 백엔드 로그아웃 API 호출 (쿠키 삭제)
      await axiosInstance.post('/auth/logout');
      alert('로그아웃 되었습니다.');
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // 실패해도 로그인 페이지로 이동
      navigate('/login');
    }
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
        <a onClick={() => navigate('/jobrecommend')} className="hover:underline cursor-pointer">취업 정보 추천</a>
        
        {/* ✅ 로그인 체크 없이 바로 이동 - MyPage에서 인증 확인 */}
        <a onClick={() => navigate('/mypage')} className="hover:underline cursor-pointer">Mypage</a>
        
        <a onClick={handleLogout} className="hover:underline cursor-pointer text-red-600">로그아웃</a>
      </nav>
    </header>
  );
}