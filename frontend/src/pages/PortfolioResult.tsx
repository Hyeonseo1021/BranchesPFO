import React, { useState, useEffect, useRef } from 'react';
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
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  // HTML 다운로드
  const handleDownloadHTML = () => {
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
    setShowDownloadModal(false);
  };

  // PDF 다운로드
  const handleDownloadPDF = async () => {
    if (!iframeRef.current || !portfolio?.generatedContent) return;

    try {
      // html2canvas와 jsPDF를 동적으로 import
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

      if (!iframeDoc || !iframeDoc.body) {
        alert('포트폴리오 내용을 가져올 수 없습니다.');
        return;
      }

      // iframe 내부의 body를 캡처
      const canvas = await html2canvas(iframeDoc.body, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: iframeDoc.body.scrollWidth * 2,
        windowHeight: iframeDoc.body.scrollHeight * 2
      } as any);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${portfolio.title || 'portfolio'}.pdf`);
      setShowDownloadModal(false);
    } catch (error) {
      console.error('PDF 생성 실패:', error);
      alert('PDF 생성에 실패했습니다. 대신 HTML 형식으로 다운로드해주세요.');
    }
  };

  // 이미지 다운로드
  const handleDownloadImage = async () => {
    if (!iframeRef.current || !portfolio?.generatedContent) return;

    try {
      const html2canvas = (await import('html2canvas')).default;

      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

      if (!iframeDoc || !iframeDoc.body) {
        alert('포트폴리오 내용을 가져올 수 없습니다.');
        return;
      }

      const canvas = await html2canvas(iframeDoc.body, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: iframeDoc.body.scrollWidth * 2,
        windowHeight: iframeDoc.body.scrollHeight * 2
      } as any);

      canvas.toBlob((blob: Blob | null) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${portfolio.title || 'portfolio'}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });

      setShowDownloadModal(false);
    } catch (error) {
      console.error('이미지 생성 실패:', error);
      alert('이미지 생성에 실패했습니다.');
    }
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
          ref={iframeRef}
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
          onClick={() => setShowDownloadModal(true)}
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

      {/* 다운로드 형식 선택 모달 */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
              다운로드 형식 선택
            </h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              포트폴리오를 어떤 형식으로 저장하시겠습니까?
            </p>

            <div className="space-y-3">
              {/* HTML 다운로드 */}
              <button
                onClick={handleDownloadHTML}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-lg shadow-md hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 flex items-center justify-between"
              >
                <span className="flex items-center gap-3">
                  <span className="text-2xl">📄</span>
                  <div className="text-left">
                    <div className="font-bold">HTML 파일</div>
                    <div className="text-xs opacity-90">웹 브라우저에서 열 수 있는 파일</div>
                  </div>
                </span>
                <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">추천</span>
              </button>

              {/* PDF 다운로드 */}
              <button
                onClick={handleDownloadPDF}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-lg shadow-md hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 flex items-center"
              >
                <span className="flex items-center gap-3">
                  <span className="text-2xl">📕</span>
                  <div className="text-left">
                    <div className="font-bold">PDF 파일</div>
                    <div className="text-xs opacity-90">인쇄하기 좋은 문서 형식</div>
                  </div>
                </span>
              </button>

              {/* 이미지 다운로드 */}
              <button
                onClick={handleDownloadImage}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 flex items-center"
              >
                <span className="flex items-center gap-3">
                  <span className="text-2xl">🖼️</span>
                  <div className="text-left">
                    <div className="font-bold">이미지 파일 (PNG)</div>
                    <div className="text-xs opacity-90">SNS 공유나 미리보기용</div>
                  </div>
                </span>
              </button>
            </div>

            {/* 취소 버튼 */}
            <button
              onClick={() => setShowDownloadModal(false)}
              className="w-full mt-4 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
            >
              취소
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}