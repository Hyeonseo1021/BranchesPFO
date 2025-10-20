// PortfolioEdit.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../pages/Header';
import Footer from '../pages/Footer';
import axiosInstance from '../api/axios';

export default function PortfolioEdit() {
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const navigate = useNavigate();
  
  const [portfolio, setPortfolio] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editedContent, setEditedContent] = useState('');

  // ✅ 포트폴리오 데이터 불러오기
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/portfolio/${portfolioId}`);
        const data = response.data.portfolio;
        setPortfolio(data);
        setEditedContent(data.generatedContent || '');
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

  // ✅ 포트폴리오 저장
  const handleSave = async () => {
    try {
      await axiosInstance.put(`/portfolio/${portfolioId}`, {
        generatedContent: editedContent
      });
      
      alert('포트폴리오가 저장되었습니다!');
      navigate(`/portfolio/result/${portfolioId}`);
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full border-4 border-green-500 border-t-transparent h-12 w-12" />
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
          포트폴리오 수정하기 ✏️
        </h2>
        <p
          className="text-white text-lg drop-shadow-[1px_1px_1px_rgba(0,0,0,0.4)] animate-fade-in-down"
          style={{ animationDelay: '0.3s' }}
        >
          AI가 생성한 포트폴리오의 HTML을 직접 수정할 수 있습니다
        </p>
      </section>

      <main className="max-w-7xl mx-auto py-10 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽: HTML 편집기 */}
          <div>
            <h3 className="text-xl font-semibold mb-4">HTML 편집</h3>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-[600px] p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none"
              placeholder="HTML 코드를 입력하세요..."
            />
          </div>

          {/* ✅ 오른쪽: iframe으로 미리보기 */}
          <div>
            <h3 className="text-xl font-semibold mb-4">미리보기</h3>
            <iframe
              srcDoc={editedContent}
              className="w-full h-[600px] border border-gray-300 rounded-lg bg-white"
              title="포트폴리오 미리보기"
              sandbox="allow-same-origin"
            />
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => navigate(`/portfolio/result/${portfolioId}`)}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            💾 저장하기
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}