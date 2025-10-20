// src/pages/MyPortfolioList.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import axiosInstance from '../api/axios';

interface Portfolio {
  _id: string;
  title: string;
  viewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export default function MyPortfolioList() {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await axiosInstance.get('/portfolio/my-portfolio');
        setPortfolios(response.data.portfolios);
      } catch (error) {
        console.error('포트폴리오 목록 조회 실패:', error);
        alert('포트폴리오를 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  const handleDelete = async (portfolioId: string) => {
    if (!window.confirm('정말 이 포트폴리오를 삭제하시겠습니까?')) return;

    try {
      await axiosInstance.delete(`/portfolio/${portfolioId}`);
      setPortfolios(portfolios.filter(p => p._id !== portfolioId));
      alert('포트폴리오가 삭제되었습니다.');
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full border-4 border-green-500 border-t-transparent h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="h-8 bg-[#E6FCB9]" />

      <div className="max-w-7xl mx-auto p-10">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">내 포트폴리오 목록 📁</h2>
          <button
            onClick={() => navigate('/mypage')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            ← 돌아가기
          </button>
        </div>

        {portfolios.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg border">
            <p className="text-gray-500 mb-4">아직 생성된 포트폴리오가 없습니다.</p>
            <button
              onClick={() => navigate('/aipfo')}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              포트폴리오 생성하러 가기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((portfolio) => (
              <div
                key={portfolio._id}
                className="border rounded-lg p-6 hover:shadow-lg transition cursor-pointer"
              >
                <div onClick={() => navigate(`/portfolio/result/${portfolio._id}`)}>
                  <h3 className="font-semibold text-lg mb-2 text-green-700">
                    {portfolio.title || '제목 없음'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    생성일: {formatDate(portfolio.createdAt)}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    수정일: {formatDate(portfolio.updatedAt)}
                  </p>
                  {portfolio.viewCount !== undefined && (
                    <p className="text-sm text-gray-600 mb-4">
                      조회수: {portfolio.viewCount}회
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/portfolio/result/${portfolio._id}`)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
                  >
                    보기
                  </button>
                  <button
                    onClick={() => handleDelete(portfolio._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}