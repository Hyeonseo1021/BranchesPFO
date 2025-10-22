import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../pages/Header';
import Footer from '../pages/Footer';
import axiosInstance from '../api/axios';

// PortfolioResult.tsx
export default function PortfolioResult() {
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/portfolio/${portfolioId}`);
        setPortfolio(response.data.portfolio);
      } catch (error) {
        console.error('포트폴리오 조회 실패:', error);
        alert('포트폴리오를 불러올 수 없습니다.');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    if (portfolioId) {
      fetchPortfolio();
    }
  }, [portfolioId, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('정말 이 포트폴리오를 삭제하시겠습니까?')) return;

    try {
      await axiosInstance.delete(`/portfolio/${portfolioId}`);
      alert('포트폴리오가 삭제되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleDownload = () => {
    if (!portfolio?.generatedContent) return;

    const blob = new Blob([portfolio.generatedContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${portfolio.title || 'portfolio'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full border-4 border-green-500 border-t-transparent h-12 w-12 mx-auto mb-4" />
          <p>포트폴리오를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>포트폴리오를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 font-sans">
      <Header />

      <section
        className="relative text-center py-28 px-4 bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/PFbanner.png')",
          backgroundSize: 'cover',
          minHeight: '300px',
        }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-[2px_2px_2px_rgba(0,0,0,0.5)] mb-4 animate-fade-in-down">
          분석 완료! 포트폴리오가 완성됐어요 🎉
        </h2>
        <p
          className="text-white text-lg drop-shadow-[1px_1px_1px_rgba(0,0,0,0.4)] animate-fade-in-down"
          style={{ animationDelay: '0.3s' }}
        >
          지금 PFO AI가 생성한 포트폴리오를 확인해보세요
        </p>
      </section>

      {/* PFO AI 메시지 */}
      <div className="text-center text-sm text-gray-700 italic mt-12 animate-fade-in-down">
        PFO AI가 <span className="font-semibold text-green-700">{portfolio.name}</span> 님의 입력 정보를 바탕으로,
        <br />
        <span className="font-semibold">직관적이고 돋보이는 포트폴리오</span>를 원하시는 스타일에 맞춰 구성해보았어요 😊
      </div>

      {/* ✅ iframe으로 격리하여 렌더링 */}
      <main className="max-w-7xl mx-auto py-10 px-6">
        <iframe
          srcDoc={portfolio.generatedContent}
          className="w-full h-[800px] border border-gray-300 rounded-lg shadow-xl bg-white"
          title="포트폴리오 미리보기"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
        />
      </main>

      {/* 수정 / 다운로드 / 삭제 버튼 */}
      <div className="flex justify-center gap-4 mt-10 mb-10">
        <button
          onClick={() => navigate(`/portfolio/edit/${portfolioId}`)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700"
        >
          ✏️ 수정하기
        </button>
        <button
          onClick={handleDownload}
          className="bg-gray-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-800"
        >
          💾 다운로드
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700"
        >
          🗑️ 삭제하기
        </button>
      </div>

      <Footer />
    </div>
  );
}