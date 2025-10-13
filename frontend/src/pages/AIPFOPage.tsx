import React, { useState } from "react";
import { Card, CardContent } from '../components/ui/card';
import { Checkbox } from "../components/ui/Checkbox";
import { Button } from '../components/ui/buttons';
import { useNavigate } from 'react-router-dom';
import Header from '../pages/Header';
import Footer from '../pages/Footer';



export default function AIPFOPage() {
  const navigate = useNavigate();
  const [selection, setSelection] = useState<'portfolio' | 'resume'>('portfolio');
  const [isLoading, setIsLoading] = useState(false);
  return (
    <> {/* ✅ Fragment로 감싸기 시작 */}

      {/* ✅ 로딩 중일 때 보여줄 전체 오버레이 */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-white bg-opacity-80 flex flex-col items-center justify-center">
          <img src="/images/Branches_2.0_Logo.png" className="w-12 h-12 mb-4 animate-bounce" />
          <p className="text-lg font-semibold mb-2">당신의 정보를 바탕으로 생성 중입니다...</p>
          <div className="animate-spin rounded-full border-4 border-green-500 border-t-transparent h-8 w-8" />
        </div>
      )}
      <div className="min-h-screen bg-gradient-to-b from-white to-green-100 font-sans">
        {/* ✅ 공통 Header 컴포넌트 */}
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
            Powered by AI · GPT 기반 이력서/포트폴리오
          </h2>
          <p className="text-white text-lg drop-shadow-[1px_1px_1px_rgba(0,0,0,0.4)] animate-fade-in-down" style={{ animationDelay: '0.3s' }}>
            사용자의 경력, 자격증 다양한 정보를 IT기반으로 포트폴리오/이력서를 생성하는 AI브랜치
          </p>
        </section>



        <main className="max-w-4xl mx-auto py-10 px-4">
          <h3 className="text-xl font-bold text-center mb-4">AI PFO에 오신것을 환영합니다 !</h3>
          <p className="text-center mb-6">
            저는 당신의 정보를 바탕으로 포트폴리오/이력서를 만들어주는 AI 브랜치에요!<br />
            먼저 원하시는 정보를 입력해주세요.
          </p>

          <div className="flex justify-center gap-4 items-center mb-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selection === 'portfolio'}
                onChange={() => setSelection('portfolio')}
              />
              포트폴리오
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selection === 'resume'}
                onChange={() => setSelection('resume')}
              />
              이력서
            </label>
          </div>

          <div className="max-w-2xl mx-auto mb-10">
            <label htmlFor="aiPrompt" className="block text-center font-semibold mb-2">
              {selection === 'portfolio' ? '포트폴리오 프롬프트 입력' : '이력서 프롬프트 입력'}
            </label>
            <textarea
              id="aiPrompt"
              placeholder={
                selection === 'portfolio'
                  ? '예: 사용자 경험을 잘 드러낼 수 있도록 포트폴리오를 만들어줘.'
                  : '예: 삼성전자에 지원할 수 있도록 이력서를 작성해줘.'
              }
              className="w-full p-3 border border-gray-300 rounded-md resize-none"
              rows={5}
            />
          </div>

          <div className="flex justify-center gap-8 mb-10">
            <div
  className="w-40 h-48 text-center cursor-pointer hover:shadow-xl transition"
  onClick={() => {
    const isLoggedIn = !!localStorage.getItem("token");
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      navigate('/login');
    } else {
      setIsLoading(true); // 로딩 시작
      setTimeout(() => {
        setIsLoading(false); // 로딩 끝
        navigate(selection === 'portfolio' ? '/portfolio-result' : '/resume-result');
      }, 2000); // 2초 가상 대기
    }
  }}
>
  <Card className="w-full h-full">
    <CardContent className="flex flex-col items-center justify-center h-full">
      <img src="/images/Branches_2.0_Logo.png" alt="내정보 불러오기" className="w-12 h-12 mb-2" />
      <span>내정보 불러오기</span>
    </CardContent>
  </Card>
</div>

            <div
              onClick={() => {
                const isLoggedIn = !!localStorage.getItem("token");
                if (!isLoggedIn) {
                  alert("로그인이 필요합니다.");
                  navigate('/login');
                } else {
                  navigate('/portfolio');
                }
              }}
              className="w-40 h-48 text-center cursor-pointer hover:shadow-xl transition"
            >
              <Card className="w-full h-full">
                <CardContent className="flex flex-col items-center justify-center h-full">
                  <img src="/images/Branches_2.0_Logo.png" alt="지금 직접 입력하기" className="w-12 h-12 mb-2" />
                  <span>지금 직접 입력하기</span>
                </CardContent>
              </Card>
            </div>
          </div>

          <h4 className="text-center text-lg font-semibold mb-4">
            이런 결과물이 완성돼요 ! (예시)
          </h4>

          <div className="flex justify-center gap-8">
            <img
              src="/images/resumeResult.jpg"
              alt="이력서 예시 1"
              className="w-40 h-56 rounded shadow object-cover"
            />
            <img
              src="/images/resumeResult.jpg"
              alt="이력서 예시 2"
              className="w-40 h-56 rounded shadow object-cover"
            />
          </div>

        </main>

        <Footer />
      </div>
    </>
  );
}
