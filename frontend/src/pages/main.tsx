import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../pages/Header';
import Footer from '../pages/Footer';

export default function MainPage() {
  const navigate = useNavigate();
    return (
        <div className="bg-white text-gray-800 font-sans">
            <Header />

            {/* Hero Section */}
            <section
  className="bg-[#DAF8AA] bg-no-repeat bg-contain bg-center h-[400px] flex items-center justify-center"
  style={{ backgroundImage: "url('/hero-bg.png')" }}
>
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-4">Branches PFO</h1>
                    <p className="mb-6">브랜치 포폴은 당신의 AI기반 이력서 포트폴리오를 생성합니다</p>
                    <button
                        onClick={() => navigate('/home')}
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                    >
                        AI 브랜치 생성기 체험하기
                    </button>
                </div>
            </section>

            {/* About Section */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Branches PFO 서비스 바로가기</h2>
                    <p className="mb-10">Branches PFO는 Gemini 기반의 AI 시스템으로, 사용자 입력 최소화와 맞춤형 추천을 통해 이력서 및 포트폴리오 생성을 자동화합니다.</p>
                    <div className="grid grid-cols-3 gap-8">
                        <div className="bg-gray-100 p-6 rounded shadow">💡  AI 자동 생성</div>
                        <div className="bg-gray-100 p-6 rounded shadow">📁 맞춤형 포트폴리오 추천</div>
                        <div className="bg-gray-100 p-6 rounded shadow">📈 실시간 저장 및 수정</div>
                    </div>
                </div>
            </section>

            {/* Service Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-semibold mb-6">주요 기능</h2>
                    <p className="mb-10 text-gray-600">resume Fotpolio</p>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-white p-4 rounded shadow hover:shadow-md transition">📋 이력서 관리</div>
                        <div className="bg-white p-4 rounded shadow hover:shadow-md transition">📌 커뮤니티</div>
                        <div className="bg-white p-4 rounded shadow hover:shadow-md transition">🎓 자격증 등록</div>
                        <div className="bg-white p-4 rounded shadow hover:shadow-md transition">🌍 맞춤형 추천</div>
                        <div className="bg-white p-4 rounded shadow hover:shadow-md transition">💬 모바일 공유</div>
                        <div className="bg-white p-4 rounded shadow hover:shadow-md transition">🔒 자동저장</div>
                    </div>
                </div>
            </section>

            {/* Portfolio Preview Section */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-8">MY PORTFOLIO</h2>
                    <p className="text-gray-600 mb-8">My page</p>
                    <div className="grid grid-cols-3 gap-6 mb-6">
                        <div className="h-48 bg-gray-200 rounded" />
                        <div className="h-48 bg-gray-200 rounded" />
                        <div className="h-48 bg-gray-200 rounded" />
                        <div className="h-48 bg-gray-200 rounded" />
                        <div className="h-48 bg-gray-200 rounded" />
                        <div className="h-48 bg-gray-200 rounded" />
                    </div>
                    <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">View All</button>
                </div>
            </section>

            <Footer />
        </div>
    );
}
