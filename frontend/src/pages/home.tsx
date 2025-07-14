import React from "react";
import { Card, CardContent } from '../components/ui/card';
import { Checkbox } from "../components/ui/Checkbox";
import { Button } from '../components/ui/buttons';
import { useNavigate } from 'react-router-dom';
import Header from '../pages/Header';
import Footer from '../pages/Footer';


export default function AIPFOPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-100 font-sans">
      {/* ✅ 공통 Header 컴포넌트 */}
      <Header />

      <section className="text-center py-10 bg-green-100">
        <h2 className="text-2xl font-bold mb-2">Powered by AI · GPT 기반 포트폴리오 생성기</h2>
        <p className="text-gray-700 mb-4">당신의 경력, 자격증 다양한 정보를 기반으로 생성하는 AI브랜치</p>
      </section>

      <main className="max-w-4xl mx-auto py-10 px-4">
        <h3 className="text-xl font-bold text-center mb-4">AI FPO에 오신것을 환영합니다 !</h3>
        <p className="text-center mb-6">
          저는 당신의 정보를 바탕으로 포트폴리오/이력서를 만들어주는 AI 브랜치에요!<br />
          먼저 자신의 정보를 입력해주시겠어요 ?
        </p>

        <div className="flex justify-center gap-4 items-center mb-8">
          <label className="flex items-center gap-2">
            <Checkbox defaultChecked /> 포트폴리오
          </label>
          <label className="flex items-center gap-2">
            <Checkbox defaultChecked /> 이력서
          </label>
        </div>

        <div className="flex justify-center gap-8 mb-10">
          <Card className="w-40 h-48 text-center cursor-pointer hover:shadow-xl transition">
            <CardContent className="flex flex-col items-center justify-center h-full">
              <img src="/Branches_2.0_Logo.png" alt="내정보 불러오기" className="w-12 h-12 mb-2" />
              <span>내정보 불러오기</span>
            </CardContent>
          </Card>

          <div onClick={() => navigate('/portfolio')} className="w-40 h-48 text-center cursor-pointer hover:shadow-xl transition">
            <Card className="w-full h-full">
              <CardContent className="flex flex-col items-center justify-center h-full">
                <img src="/Branches_2.0_Logo.png" alt="지금 직접 입력하기" className="w-12 h-12 mb-2" />
                <span>지금 직접 입력하기</span>
              </CardContent>
            </Card>
          </div>
        </div>

        <h4 className="text-center text-lg font-semibold mb-4">이런 결과물이 완성돼요 ! (예시)</h4>
        <div className="flex justify-center gap-8">
          <div className="w-40 h-56 bg-gray-200 rounded" />
          <div className="w-40 h-56 bg-gray-200 rounded" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
