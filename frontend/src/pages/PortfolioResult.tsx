import { useNavigate } from 'react-router-dom';

import React, { useState } from 'react';
import Header from '../pages/Header';
import Footer from '../pages/Footer';

const slideStyle = "w-[1280px] h-[720px] mx-auto bg-white shadow-xl border border-gray-300 p-10 flex flex-col justify-center";

export default function PortfolioResult() {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);

    const pages = [
        <div className={slideStyle} key="page1">
            <h2 className="text-3xl font-bold mb-6 text-green-700">👋 안녕하세요!</h2>
            <p className="text-lg mb-6 leading-relaxed">
                저는 사용자 경험과 UI/UX에 집중하는 프론트엔드 개발자입니다.<br />
                React, TypeScript, Tailwind를 기반으로 깔끔한 인터페이스를 제작합니다.
            </p>
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <h4 className="font-semibold mb-2">💼 경력 요약</h4>
                    <ul className="list-disc list-inside text-gray-700">
                        <li>Branches PFO 프론트엔드 개발</li>
                        <li>음성인식 키오스크 프로젝트</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">🎓 학력</h4>
                    <p>OO대학교 컴퓨터공학과</p>
                </div>
            </div>
        </div>,

        <div className={slideStyle} key="page2">
            <h2 className="text-2xl font-bold mb-4 text-green-700">📁 프로젝트 경험</h2>
            <div className="space-y-4 text-gray-800">
                <div>
                    <h4 className="font-semibold">Branches PFO</h4>
                    <p>AI 기반 이력서/포트폴리오 생성기. GPT API 기반 자동 생성 기능 개발</p>
                </div>
                <div>
                    <h4 className="font-semibold">음성 인식 키오스크</h4>
                    <p>Python, Whisper, TTS 기반의 키오스크 시스템 개발. 실시간 음성 명령 대응</p>
                </div>
            </div>
        </div>,

        <div className={slideStyle} key="page3">
            <h2 className="text-2xl font-bold mb-4 text-green-700">🛠️ 보유 기술 / 자격증</h2>
            <div className="grid grid-cols-2 gap-6 text-gray-800">
                <div>
                    <h4 className="font-semibold mb-1">Frontend</h4>
                    <p>React, TypeScript, Tailwind, Zustand</p>
                </div>
                <div>
                    <h4 className="font-semibold mb-1">Backend & 기타</h4>
                    <p>Node.js, Express, Firebase, MongoDB</p>
                </div>
                <div className="col-span-2">
                    <h4 className="font-semibold mb-1">자격증</h4>
                    <p>정보처리기사, 해커톤 수상</p>
                </div>
            </div>
        </div>
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-green-50 font-sans relative">
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
                PFO AI가 <span className="font-semibold text-green-700">홍길동</span> 님의 입력 정보를 바탕으로,
                <br />
                <span className="font-semibold">직관적이고 돋보이는 포트폴리오</span>를 원하시는 스타일에 맞춰 구성해보았어요 😊
            </div>

            <main className="flex justify-center items-center py-10">
                {pages[page]}
            </main>

            {/* 페이지 넘기기 */}
            <div className="flex justify-center gap-4 mt-4">
                {page > 0 && (
                    <button onClick={() => setPage(page - 1)} className="px-4 py-2 bg-gray-500 text-white rounded">
                        이전
                    </button>
                )}
                {page < pages.length - 1 && (
                    <button onClick={() => setPage(page + 1)} className="px-4 py-2 bg-green-600 text-white rounded">
                        다음
                    </button>
                )}
            </div>

            {/* 수정 / 저장 버튼 */}
            <div className="flex justify-center gap-4 mt-10 mb-10">
                <button
  onClick={() => navigate('/portfolioedit')}
  className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700"
>
  수정하기
</button>
                <button className="bg-gray-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-800">저장하기</button>
                <button className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700">삭제하기</button>
            </div>

            <Footer />
        </div>
    );
}
