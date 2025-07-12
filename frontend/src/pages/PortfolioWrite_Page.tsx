import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/buttons';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PortfolioPage() {
  const navigate = useNavigate();

  const [certificates, setCertificates] = useState<string[]>([
    '정보처리기사 / 2025.06.13 / 상반기',
    '컴퓨터활용능력 2급 / 2025.06.13 / 상반기'
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
    setSelectedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white">
        <header className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
            <img src="/Branches_2.0_Logo.png" alt="Logo" className="h-8 w-auto" />
            <h1 className="text-xl font-bold">Branches PFO</h1>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/')}>로그아웃</Button>
        </header>
      </div>
      <div className="h-8 bg-[#E6FCB9]"></div>

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

        <div className="flex-1 px-8">
          {certificates.map((cert, index) => (
            <Card key={index} className="mb-4">
              <CardContent className="p-4 text-sm">
                <input
                  type="text"
                  className="w-full border-none outline-none"
                  placeholder="자격증 정보 입력"
                  value={cert}
                  onChange={(e) => {
                    const updated = [...certificates];
                    updated[index] = e.target.value;
                    setCertificates(updated);
                  }}
                />
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-center mt-4">
            <Button variant="outline" size="icon" onClick={addCertificate}>
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}