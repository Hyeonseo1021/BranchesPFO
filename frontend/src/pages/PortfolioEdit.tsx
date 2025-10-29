// PortfolioEdit.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../pages/Header';
import Footer from '../pages/Footer';
import axiosInstance from '../api/axios';

export default function PortfolioEdit() {
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [editPrompt, setEditPrompt] = useState('');

  // ✅ 포트폴리오 데이터 불러오기
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/portfolio/${portfolioId}`);
        const data = response.data.portfolio;
        setPortfolio(data);
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

  // ✅ 포트폴리오 재생성
  const handleRegenerate = async () => {
    if (!editPrompt.trim()) {
      alert('수정 요청 사항을 입력해주세요.');
      return;
    }

    setIsSaving(true);
    try {
      await axiosInstance.post(`/portfolio/${portfolioId}/regenerate`, {
        userPrompt: editPrompt
      });

      alert('포트폴리오가 수정되었습니다! 🎉');
      navigate(`/portfolio/result/${portfolioId}`);
    } catch (error: any) {
      console.error('재생성 실패:', error);
      alert(error.response?.data?.message || '포트폴리오 수정에 실패했습니다.');
    } finally {
      setIsSaving(false);
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
          포트폴리오 AI 수정하기 ✨
        </h2>
        <p
          className="text-white text-lg drop-shadow-[1px_1px_1px_rgba(0,0,0,0.4)] animate-fade-in-down"
          style={{ animationDelay: '0.3s' }}
        >
          어떻게 수정하고 싶은지 AI에게 요청해보세요!
        </p>
      </section>

      <main className="max-w-5xl mx-auto py-10 px-6">
        {/* 현재 포트폴리오 미리보기 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">현재 포트폴리오</h3>
          <iframe
            srcDoc={portfolio?.generatedContent}
            className="w-full h-[400px] border border-gray-300 rounded-lg bg-white"
            title="현재 포트폴리오"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
          />
        </div>

        {/* AI 수정 요청 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">AI에게 수정 요청하기</h3>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              어떻게 수정하고 싶으신가요? 🤔
            </label>
            <textarea
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={8}
              placeholder="예시:&#10;• 배경색을 파란색 계열로 바꿔주세요&#10;• 프로젝트 섹션을 더 강조해주세요&#10;• 폰트를 더 세련되게 바꿔주세요&#10;• 다크모드로 만들어주세요&#10;• 애니메이션 효과를 추가해주세요&#10;&#10;💡 팁: 구체적으로 요청할수록 더 정확한 결과를 얻을 수 있어요!"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-800 mb-2">💡 수정 요청 예시</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• "전체적인 색상을 보라색 계열로 바꿔주세요"</li>
              <li>• "프로젝트 카드에 그림자 효과를 추가해주세요"</li>
              <li>• "헤더를 더 크고 임팩트있게 만들어주세요"</li>
              <li>• "스킬 섹션을 아이콘과 함께 표시해주세요"</li>
              <li>• "전체적으로 미니멀한 느낌으로 수정해주세요"</li>
            </ul>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => navigate(`/portfolio/result/${portfolioId}`)}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all"
              disabled={isSaving}
            >
              취소
            </button>
            <button
              onClick={handleRegenerate}
              disabled={isSaving || !editPrompt.trim()}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full border-2 border-white border-t-transparent h-4 w-4" />
                  <span>AI가 수정 중...</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>AI로 수정하기</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
