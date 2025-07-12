import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/buttons';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../pages/Header';
import Footer from '../pages/Footer';

export default function PortfolioPage() {
  const navigate = useNavigate();

  const [certificates, setCertificates] = useState<string[]>([
    '정보처리기사 / 2025.06.13 / 상반기',
    '컴퓨터활용능력 2급 / 2025.06.13 / 상반기'
  ]);
  const [educations, setEducations] = useState<string[]>([
  '순천대학교 / 소프트웨어공학과 / 학사 / 2022.03 ~ 재학 중'
]);


  const addCertificate = () => {
    setCertificates(prev => [...prev, '']);
  };

  const [selectedItems, setSelectedItems] = useState({
    education: false,
    career: false,
    certificate: false,
    jobPreference: false,
    companyPreference: false,
    otherPortfolios: false,
    community: false
  });

const toggleItem = (key: keyof typeof selectedItems) => {
  const newState: typeof selectedItems = {
    education: false,
    career: false,
    certificate: false,
    jobPreference: false,
    companyPreference: false,
    otherPortfolios: false,
    community: false,
  };
  newState[key] = true; // 클릭된 항목만 true
  setSelectedItems(newState);
};

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="bg-white">
      </div>
      <div className="h-8 bg-[#E6FCB9]"></div>

{/* 사용자 정보 영역 추가 */}
<div className="flex items-center gap-4 px-10 py-4 bg-gray-50 border-b">
  <img src="/user-avatar.png" alt="사진" className="w-12 h-12 rounded-full" />
  <div>
    <h2 className="text-lg font-semibold">홍길동님</h2>
    <p className="text-sm text-gray-500">2025년 취업 준비 중</p>
  </div>
</div>

      <div className="flex px-10 py-10">
        <div className="w-64">
          <div className="bg-green-700 text-white p-4 rounded-t-md">포트폴리오 및 이력서</div>
          <div className="bg-gray-100 p-4">
            <ul className="text-sm space-y-1">
              <li><button onClick={() => toggleItem('education')} className={selectedItems.education ? 'font-bold' : ''}>• 학력 작성</button></li>
              <li><button onClick={() => toggleItem('career')} className={selectedItems.career ? 'font-bold' : ''}>• 일반 경력 작성</button></li>
              <li><button onClick={() => toggleItem('certificate')} className={selectedItems.certificate ? 'font-bold' : ''}>• 자격증 작성</button></li>
              <li><button onClick={() => toggleItem('jobPreference')} className={selectedItems.jobPreference ? 'font-bold' : ''}>• 원하는 직종 선택</button></li>
              <li><button onClick={() => toggleItem('companyPreference')} className={selectedItems.companyPreference ? 'font-bold' : ''}>• 원하는 회사 선택</button></li>
            </ul>
          </div>

          <div className="bg-green-700 text-white p-4 mt-6 rounded-t-md">작성 방식 설명 및 다른 사용자 포트폴리오 구경</div>
          <div className="bg-gray-100 p-4">
            <ul className="text-sm space-y-1">
              <li><button onClick={() => toggleItem('otherPortfolios')} className={selectedItems.otherPortfolios ? 'font-bold' : ''}>• 다른 사용자의 포트폴리오</button></li>
              <li><button onClick={() => toggleItem('community')} className={selectedItems.community ? 'font-bold' : ''}>• 커뮤니티</button></li>
            </ul>
          </div>
        </div>

 {/* 콘텐츠 영역 */}
        <div className="flex-1 px-8">
          {/* 아무 항목도 선택 안 했을 때 안내 */}
          {!Object.values(selectedItems).includes(true) && (
            <div className="text-center text-gray-500 mt-20">
              좌측 메뉴에서 작성할 항목을 선택해주세요.
            </div>
          )}

          {/* 자격증 입력 */}
          {selectedItems.certificate && (
            <>
              <h3 className="text-lg font-semibold mb-4">자격증 정보 입력</h3>
              {certificates.map((cert, index) => (
  <Card key={index} className="mb-4 relative">
    <CardContent className="p-4 text-sm">
      <input
        type="text"
        className="w-full border-none outline-none pr-8"
        placeholder="자격증 정보 입력"
        value={cert}
        onChange={(e) => {
          const updated = [...certificates];
          updated[index] = e.target.value;
          setCertificates(updated);
        }}
      />
      {/* X 삭제 버튼 */}
      <button
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-lg"
        onClick={() => {
          const updated = certificates.filter((_, i) => i !== index);
          setCertificates(updated);
        }}
        aria-label="삭제"
      >
        ×
      </button>
    </CardContent>
  </Card>
))}

              <div className="flex justify-center mt-4">
                <Button variant="outline" size="icon" onClick={addCertificate}>
                  <Plus className="h-6 w-6" />
                </Button>
              </div>
            </>
          )}

          {/* 추가: 학력 작성 예시 (미구현 안내) */}
          {selectedItems.education && (
  <>
    <h3 className="text-lg font-semibold mb-4">학력 정보 입력</h3>
    {educations.map((edu, index) => (
      <Card key={index} className="mb-4 relative">
        <CardContent className="p-4 text-sm">
          <input
            type="text"
            className="w-full border-none outline-none pr-8"
            placeholder="학교명 / 전공 / 학위 / 재학기간 등"
            value={edu}
            onChange={(e) => {
              const updated = [...educations];
              updated[index] = e.target.value;
              setEducations(updated);
            }}
          />
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-lg"
            onClick={() => {
              const updated = educations.filter((_, i) => i !== index);
              setEducations(updated);
            }}
            aria-label="삭제"
          >
            ×
          </button>
        </CardContent>
      </Card>
    ))}

    <div className="flex justify-center mt-4">
      <Button variant="outline" size="icon" onClick={() => setEducations(prev => [...prev, ''])}>
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  </>
)}
{selectedItems.career && (
  <div className="mt-8">
    <h3 className="text-lg font-semibold">일반 경력 정보 입력</h3>
    <p className="text-sm text-gray-500">※ 이 영역은 추후 구현 예정입니다.</p>
  </div>
)}
{selectedItems.jobPreference && (
  <div className="mt-8">
    <h3 className="text-lg font-semibold">원하는 직종 선택</h3>
    <p className="text-sm text-gray-500">※ 이 영역은 추후 구현 예정입니다.</p>
  </div>
)}
{selectedItems.companyPreference && (
  <div className="mt-8">
    <h3 className="text-lg font-semibold">원하는 회사 선택</h3>
    <p className="text-sm text-gray-500">※ 이 영역은 추후 구현 예정입니다.</p>
  </div>
)}


          {/* 필요한 항목들 추가 가능 */}
        </div>
      </div>

      <Footer />
    </div>
  );
}