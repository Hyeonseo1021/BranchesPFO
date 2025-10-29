import React, { useState } from "react";
import Header from "../pages/Header";
import Footer from "../pages/Footer";
import { Card, CardContent } from "../components/ui/card";

export default function JobRecommendPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const jobs = [
    { title: "백엔드 개발자", company: "삼성전자", location: "서울", tag: "IT" },
    { title: "프론트엔드 개발자", company: "네이버", location: "판교", tag: "IT" },
    { title: "UI/UX 디자이너", company: "카카오", location: "판교", tag: "디자인" },
    { title: "데이터 분석가", company: "LG CNS", location: "서울", tag: "데이터" },
  ];

  const filteredJobs =
    selectedCategory === "전체"
      ? jobs
      : jobs.filter((job) => job.tag === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-100 font-sans">
      <Header />

      {/* 배너 영역 */}
<section
  className="relative text-center py-28 px-4 bg-center bg-no-repeat"
  style={{
    backgroundImage: "url('/images/jobbanner.png')",
    backgroundSize: "cover",
    minHeight: "300px",
  }}
>
  <h2
    className="text-3xl md:text-4xl font-bold text-white drop-shadow-[2px_2px_2px_rgba(0,0,0,0.5)] mb-4 animate-fade-in-down"
    style={{ animationDelay: "0.1s", animationFillMode: "both" }}
  >
    AI 기반 맞춤형 IT 채용 추천
  </h2>

  <p
    className="text-white text-lg drop-shadow-[1px_1px_1px_rgba(0,0,0,0.4)] animate-fade-in-down"
    style={{ animationDelay: "0.3s", animationFillMode: "both" }}
  >
    당신의 스킬과 경력에 맞는 IT기반 맞춤형 채용 정보를 제공합니다.
  </p>
</section>

      {/* 본문 */}
      <main className="max-w-5xl mx-auto py-10 px-6 text-gray-800">
        <h3 className="text-xl font-bold text-center mb-6">
          관심 직무를 선택하세요
        </h3>

        {/* 카테고리 선택 */}
        <div className="flex justify-center flex-wrap gap-3 mb-8">
          {["전체", "IT", "디자인", "데이터", "기획"].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full border transition ${
                selectedCategory === category
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-green-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 추천 리스트 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job, idx) => (
            <Card
              key={idx}
              className="shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <CardContent className="p-5">
                <h4 className="text-lg font-semibold mb-1">{job.title}</h4>
                <p className="text-sm text-gray-600">{job.company}</p>
                <p className="text-sm text-gray-500 mb-2">{job.location}</p>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    {job.tag}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    신입/경력
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 더보기 버튼 */}
        <div className="text-center mt-10">
          <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
            더 많은 추천 보기
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
