// pages/ResumeResult.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import axiosInstance from '../api/axios';

interface ResumeData {
  personal?: {
    name: string;
    birth: string;
    phone: string;
    email: string;
    address: string;
  };
  education?: Array<{
    school: string;
    major: string;
    period: string;
    status: string;
  }>;
  experience?: Array<{
    company: string;
    position: string;
    period: string;
    description: string;
  }>;
  certificates?: Array<{
    name: string;
    issuedBy: string;
    date: string;
  }>;
  introduction?: string;
}

export default function ResumeResult() {
  const { resumeId } = useParams<{ resumeId: string }>();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<'default' | 'modern'>('default');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await axiosInstance.get(`/resume/${resumeId}`);
        console.log('✅ 이력서 조회 성공:', response.data);
        
        // content가 문자열이면 파싱, 객체면 그대로 사용
        const content = typeof response.data.resume.content === 'string' 
          ? JSON.parse(response.data.resume.content)
          : response.data.resume.content;
          
        setResumeData(content);
      } catch (error: any) {
        console.error('❌ 이력서 조회 실패:', error);
        alert('이력서를 불러오는데 실패했습니다.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (resumeId) {
      fetchResume();
    }
  }, [resumeId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full border-4 border-green-500 border-t-transparent h-12 w-12 mx-auto mb-4" />
          <p>이력서를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!resumeData) {
    return <div>이력서 데이터가 없습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-100 font-sans">
      <Header />

      <section
        className="relative text-center py-28 px-4 bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/PFbanner.png')",
          backgroundSize: 'cover',
          minHeight: '300px',
        }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-[2px_2px_2px_rgba(0,0,0,0.5)] mb-4">
          분석 완료! 이력서가 완성됐어요 🎉
        </h2>
        <p className="text-white text-lg drop-shadow-[1px_1px_1px_rgba(0,0,0,0.4)]">
          지금 PFO AI가 생성한 이력서를 확인해보세요
        </p>
      </section>

      <div className="text-center text-sm text-gray-700 italic mt-20 mb-12">
        PFO AI가 <span className="font-semibold text-green-700">{resumeData.personal?.name || '사용자'}</span> 님의 입력 정보를 바탕으로,
        <br />
        <span className="font-semibold">간결하고 깔끔한 이력서</span>를 원하시는 스타일에 맞춰 작성해보았어요 😊
      </div>

      {/* 템플릿 선택 */}
      <div className="max-w-7xl mx-auto mt-10 px-4 flex justify-end">
        <select
          className="border px-3 py-1 rounded"
          value={template}
          onChange={(e) => setTemplate(e.target.value as 'default' | 'modern')}
        >
          <option value="default">기본 템플릿</option>
          <option value="modern">모던 템플릿</option>
        </select>
      </div>

      {/* 이력서 표시 */}
      <div className="flex justify-center flex-wrap gap-6 my-10 px-4">
        <main className="w-[210mm] h-[297mm] bg-white shadow-lg p-6 border border-black text-[13px] leading-normal">
          <div className="flex flex-col gap-4 h-full">
            {/* 기본 정보 */}
            <div className="flex">
              <div className="w-[140px] border border-black flex flex-col items-center justify-center text-center p-2">
                <div className="w-[100px] h-[130px] border border-black mb-2 flex items-center justify-center text-[12px]">사진</div>
                <p className="text-[11px] text-red-500">응시직종 입력</p>
              </div>
              <div className="flex-1 border border-black border-l-0 px-4 py-3 text-[12px] flex flex-col justify-center gap-1">
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  <div className="flex min-w-[120px]"><span className="font-bold mr-1">성명:</span><span>{resumeData.personal?.name || '[이름]'}</span></div>
                  <div className="flex min-w-[160px]"><span className="font-bold mr-1">생년월일:</span><span>{resumeData.personal?.birth || '1995.03.01'}</span></div>
                  <div className="flex flex-1"><span className="font-bold mr-1">주소:</span><span>{resumeData.personal?.address || '주소 미입력'}</span></div>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  <div className="flex min-w-[180px]"><span className="font-bold mr-1">연락처:</span><span>{resumeData.personal?.phone || '010-0000-0000'}</span></div>
                  <div className="flex min-w-[180px]"><span className="font-bold mr-1">이메일:</span><span>{resumeData.personal?.email || 'email@example.com'}</span></div>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-4 justify-between">
              {/* 학력사항 */}
              <div>
                <h4 className="font-bold border-b border-black">학력사항</h4>
                <table className="w-full border border-black text-left text-[12px]">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-black p-2">입학년월</th>
                      <th className="border border-black p-2">졸업년월</th>
                      <th className="border border-black p-2">학교명</th>
                      <th className="border border-black p-2">소재지</th>
                      <th className="border border-black p-2">평균학점</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumeData.education?.map((edu, idx) => (
                      <tr key={idx} className="h-[45px]">
                        <td className="border border-black p-2">{edu.period?.split('~')[0] || '-'}</td>
                        <td className="border border-black p-2">{edu.period?.split('~')[1] || '-'}</td>
                        <td className="border border-black p-2">{edu.school}</td>
                        <td className="border border-black p-2">-</td>
                        <td className="border border-black p-2">-</td>
                      </tr>
                    )) || <tr className="h-[45px]"><td colSpan={5} className="border border-black p-2 text-center">학력 정보 없음</td></tr>}
                  </tbody>
                </table>
              </div>

              {/* 경력사항 */}
              <div>
                <h4 className="font-bold border-b border-black">경력사항</h4>
                <table className="w-full border border-black text-left text-[12px]">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-black p-2">근무회사</th>
                      <th className="border border-black p-2">근무기간</th>
                      <th className="border border-black p-2">직위</th>
                      <th className="border border-black p-2">담당부서</th>
                      <th className="border border-black p-2">퇴직사유</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumeData.experience?.map((exp, idx) => (
                      <tr key={idx} className="h-[45px]">
                        <td className="border border-black p-2">{exp.company}</td>
                        <td className="border border-black p-2">{exp.period}</td>
                        <td className="border border-black p-2">{exp.position}</td>
                        <td className="border border-black p-2">-</td>
                        <td className="border border-black p-2">-</td>
                      </tr>
                    )) || <tr className="h-[45px]"><td colSpan={5} className="border border-black p-2 text-center">경력 정보 없음</td></tr>}
                  </tbody>
                </table>
              </div>

              {/* 자격증 */}
              <div>
                <h4 className="font-bold border-b border-black">자격증</h4>
                <table className="w-full border border-black text-left text-[12px]">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-black p-2">취득연도</th>
                      <th className="border border-black p-2">종류</th>
                      <th className="border border-black p-2">발급기관</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumeData.certificates?.map((cert, idx) => (
                      <tr key={idx} className="h-[45px]">
                        <td className="border border-black p-2">{cert.date}</td>
                        <td className="border border-black p-2">{cert.name}</td>
                        <td className="border border-black p-2">{cert.issuedBy}</td>
                      </tr>
                    )) || <tr className="h-[45px]"><td colSpan={3} className="border border-black p-2 text-center">자격증 정보 없음</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>

        {/* 자기소개서 */}
        <main className="w-[210mm] h-[297mm] bg-white border border-black shadow-lg p-6 text-[13px] leading-normal">
          <h3 className="text-base font-bold mb-2">☆ 자기 소개서</h3>
          <div className="border-t border-black h-[250mm]">
            <div className="flex h-full">
              <div className="w-[25%] bg-gray-100 border-r border-black p-2 font-bold">자기소개</div>
              <div className="w-[75%] p-4 whitespace-pre-wrap">
                {resumeData.introduction || '자기소개 내용이 생성되지 않았습니다.'}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-center gap-4 mb-10">
        <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-all">수정하기</button>
        <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-all">저장하기</button>
      </div>

      <Footer />
    </div>
  );
}