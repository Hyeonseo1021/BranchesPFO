import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import '../css/main.css';
export default function MainPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number | null>(null);
  const [showMore, setShowMore] = useState(false);
  const items = [
    {
      icon: '💡',
      title: 'AI 자동 생성',
      desc: '입력된 정보를 바탕으로 포트폴리오를 자동 구성합니다.',
      detail: 'AI가 템플릿을 선택하고 내용을 채워주는 완전 자동 생성 기능이에요. 사용자는 최소한의 입력만으로 결과를 얻을 수 있어요.',
    },
    {
      icon: '📁',
      title: '맞춤형 포트폴리오 추천',
      desc: '사용자 경험에 맞는 포트폴리오 템플릿을 제공합니다.',
      detail: '사용자의 입력과 선호도에 따라 가장 적합한 템플릿을 제안합니다. 다양한 스타일과 포맷 제공!',
    },
    {
      icon: '📈',
      title: '실시간 저장 및 수정',
      desc: '작성 즉시 저장되고, 언제든지 수정이 가능합니다.',
      detail: '작성하는 즉시 로컬에 저장되고, 원할 때 언제든지 이어서 작성할 수 있어요. 오토세이브 기능 탑재!',
    },
  ];


  
    return (
        <div className="bg-white text-gray-800 font-sans">
            <Header />

            {/* Hero Section */}
           <section
  className="bg-[#DAF8AA] bg-no-repeat bg-contain bg-center h-[400px] flex items-center justify-center"
  style={{ backgroundImage: "url('/images/hero-bg.png')" }}
>
  <div className="max-w-4xl mx-auto px-4 text-center">
    <h1 className="text-4xl font-bold mb-4 animate-fade-in-down transition-transform duration-700 transform hover:scale-105">
      AI와 함께 성장하는 IT 전문가의 시작, Branches PFO
    </h1>
    <p className="mb-6 opacity-80 text-lg animate-fade-in-down" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
     Branches PFO는 사용자의 경력과 자격 정보를 기반으로 IT기반 이력서와 포트폴리오를 완성합니다.
    </p>
    <button
      onClick={() => navigate('/aipfopage')}
      className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-all duration-300 hover:scale-105 animate-fade-in-down"
      style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
    >
      AI 이력서/포트폴리오 생성하기
    </button>
  </div>
</section>



            {/* About Section */}
          <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6"> About PFO AI?</h2>
        <p className="mb-10">
          Branches PFO는 Gemini 기반의 AI 시스템으로, 사용자 입력 최소화와 맞춤형 추천을 통해 이력서 및 포트폴리오 생성을 자동화합니다.
        </p>

        <div className="grid grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div
              key={i}
              onClick={() => setSelected(i)}
              className="group bg-gray-100 p-6 rounded shadow transition-all duration-300 hover:bg-[#DAF8AA] hover:text-black h-[100px] flex items-center justify-center text-center cursor-pointer"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-100 group-hover:opacity-0 text-lg font-semibold">
                  {item.icon} {item.title}
                </div>
                <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100 text-sm leading-snug px-2">
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 상세 설명 박스 */}
        {selected !== null && (
          <div className="mt-10 flex justify-center animate-fade-in-down">
            <div className="max-w-3xl bg-gray-100 p-6 rounded shadow text-left">
              <h4 className="text-xl font-semibold mb-2">
                {items[selected].icon} {items[selected].title}
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">{items[selected].detail}</p>
            </div>
          </div>
        )}
      </div>
    </section>

            {/* Service Section */}
            <section className="py-16 bg-gray-50">
  <div className="max-w-6xl mx-auto px-4 text-center">
    <h2 className="text-2xl font-semibold mb-6">주요 기능</h2>
    <p className="mb-10 text-gray-600">PFO의 다양한 기능들을 미리 만나보세요!</p>
    <div className="grid grid-cols-3 gap-6">

      {/* ✅ 이력서 관리 → /mypage/resumes */}
      <div
        className="bg-white p-4 rounded shadow hover:shadow-md transition cursor-pointer"
        onClick={() => navigate('/mypage/resumes')}
      >
        📋 이력서 관리
      </div>

      {/* ✅ 커뮤니티 (유지) */}
      <div
        className="bg-white p-4 rounded shadow hover:shadow-md transition cursor-pointer"
        onClick={() => navigate('/community')}
      >
        📌 커뮤니티
      </div>

      {/* ✅ 자격증 등록 → AI 도우미로 변경 + /aichatbot */}
      <div
        className="bg-white p-4 rounded shadow hover:shadow-md transition cursor-pointer"
        onClick={() => navigate('/aichatbot')}
      >
        🤖 AI 도우미
      </div>

      {/* ✅ 맞춤형 추천 → 취업 정보 추천 + /jobrecommend */}
      <div
        className="bg-white p-4 rounded shadow hover:shadow-md transition cursor-pointer"
        onClick={() => navigate('/jobrecommend')}
      >
        🌍 취업 정보 추천
      </div>

      {/* ✅ 모바일 공유 → 내 정보 보러가기 + /Mypage */}
      <div
        className="bg-white p-4 rounded shadow hover:shadow-md transition cursor-pointer"
        onClick={() => navigate('/Mypage')}
      >
        💬 내 정보 보러가기
      </div>

      {/* ✅ 자동저장 → 포트폴리오 관리 + /mypage/portfolios */}
      <div
        className="bg-white p-4 rounded shadow hover:shadow-md transition cursor-pointer"
        onClick={() => navigate('/mypage/portfolios')}
      >
        🔒 포트폴리오 관리
      </div>

    </div>
  </div>
</section>


{/* 포트폴리오 미리보기 Section */}
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-6">포트폴리오 미리보기</h2>
        <p className="text-gray-600 mb-8">
          Branches PFO에서 제공하는 다양한 스타일의 AI 포트폴리오 예시를 미리 확인해보세요.
        </p>

        {/* ✅ 첫 번째 sample1 세 개 */}
{/* ✅ 첫 번째 sample1 세 개 */}
<div className="grid grid-cols-3 gap-6">
  {[1, 2, 3].map((i) => (
    <div
      key={`sample1-${i}`}
      className="h-48 bg-gray-100 rounded overflow-hidden shadow hover:shadow-lg transition cursor-pointer transform hover:scale-[1.02]"
      onClick={() =>
        window.open(
          '/images/PFO샘플님의 포트폴리오 - 2025.10.26.html',
          '_blank'
        )
      }
    >
      <img
        src={`/images/sample1.png`}
        alt={`Portfolio Sample ${i}`}
        className="w-full h-full object-cover"
      />
    </div>
  ))}
</div>

{/* ✅ 더보기 클릭 시 sample2 세 개 + sample3 세 개 표시 */}
{showMore && (
  <>
    <div className="grid grid-cols-3 gap-6 mt-6">
      {[1, 2, 3].map((i) => (
        <div
          key={`sample2-${i}`}
          className="h-48 bg-gray-100 rounded overflow-hidden shadow hover:shadow-lg transition cursor-pointer transform hover:scale-[1.02]"
          onClick={() =>
            window.open(
              '/images/PFO샘플님의 포트폴리오 - 2025.10.26 (1).html',
              '_blank'
            )
          }
        >
          <img
            src={`/images/sample2.png`}
            alt={`Portfolio Sample 2 - ${i}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>

    {/* ✅ sample3 세 개 추가 */}
    <div className="grid grid-cols-3 gap-6 mt-6">
      {[1, 2, 3].map((i) => (
        <div
          key={`sample3-${i}`}
          className="h-48 bg-gray-100 rounded overflow-hidden shadow hover:shadow-lg transition cursor-pointer transform hover:scale-[1.02]"
          onClick={() =>
            window.open(
              '/images/PFO샘플님의 포트폴리오 - 2025.10.26 (2).html',
              '_blank'
            )
          }
        >
          <img
            src={`/images/sample3.png`}
            alt={`Portfolio Sample 3 - ${i}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  </>
)}

        {/* ✅ 버튼 (토글형) */}
        <button
          className="mt-10 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          onClick={() => setShowMore((prev) => !prev)}
        >
          {showMore ? '접기 ▲' : '다른 작품 더보기 ▼'}
        </button>
      </div>
    </section>


            <Footer />
        </div>
    );
}
