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
    degree: string;
    period: string;
    schoolType?: string;
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
  skills?: string[];
  tools?: string[];
  projects?: Array<{
    title: string;
    description: string;
    role: string;
    techStack: string[];
    period: string;
    link: string;
  }>;
  coverLetter?: {
    strengths: string;
    growth: string;
    personality: string;
    motivation: string;
  };
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
        
        const resume = response.data.resume;
        
        const formattedData: ResumeData = {
          personal: {
            name: resume.name || '',
            birth: resume.birth || '',
            phone: resume.phone || '',
            email: resume.email || '',
            address: resume.address?.address || resume.address || ''
          },
          education: resume.education || [],
          experience: resume.experiences || [],
          certificates: resume.certificates || [],
          skills: resume.skills || [],
          tools: resume.tools || [],
          projects: resume.projects || [],
          coverLetter: resume.coverLetter || {
            strengths: '',
            growth: '',
            personality: '',
            motivation: ''
          }
        };
        
        console.log('📋 변환된 데이터:', formattedData);
        setResumeData(formattedData);
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
        {/* 1페이지 */}
        <main className="w-[210mm] h-[297mm] bg-white shadow-lg p-6 border border-black text-[13px] leading-normal">
          <div className="flex flex-col gap-3.5 h-full"> {/* ✅ gap-3 → gap-3.5 */}
            {/* 기본 정보 */}
            <div className="flex">
              <div className="w-[140px] border border-black flex flex-col items-center justify-center text-center p-2">
                <div className="w-[100px] h-[130px] border border-black mb-2 flex items-center justify-center text-[12px]">사진</div>
                <p className="text-[11px] text-red-500">응시직종 입력</p>
              </div>
              <div className="flex-1 border border-black border-l-0 px-4 py-3 text-[12px] flex flex-col justify-center gap-1">
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  <div className="flex min-w-[120px]"><span className="font-bold mr-1">성명:</span><span>{resumeData.personal?.name || '[이름]'}</span></div>
                  <div className="flex min-w-[160px]"><span className="font-bold mr-1">생년월일:</span><span>{resumeData.personal?.birth || ''}</span></div>
                  <div className="flex flex-1"><span className="font-bold mr-1">주소:</span><span>{resumeData.personal?.address || '주소 미입력'}</span></div>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  <div className="flex min-w-[180px]"><span className="font-bold mr-1">연락처:</span><span>{resumeData.personal?.phone || '010-0000-0000'}</span></div>
                  <div className="flex min-w-[180px]"><span className="font-bold mr-1">이메일:</span><span>{resumeData.personal?.email || 'email@example.com'}</span></div>
                </div>
              </div>
            </div>

            <div className="space-y-3.5"> {/* ✅ space-y-3 → space-y-3.5 */}
              {/* 학력사항 */}
              <div>
                <h4 className="font-bold border-b border-black py-1 mb-1">학력사항</h4>
                <table className="w-full border border-black text-left text-[11px]">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-black p-2">구분</th> {/* ✅ p-1.5 → p-2 */}
                      <th className="border border-black p-2">입학년월</th>
                      <th className="border border-black p-2">졸업년월</th>
                      <th className="border border-black p-2">학교명</th>
                      <th className="border border-black p-2">전공</th>
                      <th className="border border-black p-2">학위</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumeData.education && resumeData.education.length > 0 ? (
                      resumeData.education.map((edu, idx) => (
                        <tr key={idx} className="h-[40px]"> {/* ✅ h-[36px] → h-[40px] */}
                          <td className="border border-black p-2">{edu.schoolType || '-'}</td>
                          <td className="border border-black p-2">{edu.period?.split('~')[0]?.trim() || '-'}</td>
                          <td className="border border-black p-2">{edu.period?.split('~')[1]?.trim() || '-'}</td>
                          <td className="border border-black p-2">{edu.school}</td>
                          <td className="border border-black p-2">{edu.major || '-'}</td>
                          <td className="border border-black p-2">{edu.degree || '-'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="h-[40px]">
                        <td colSpan={6} className="border border-black p-2 text-center">학력 정보 없음</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* 경력사항 */}
              <div>
                <h4 className="font-bold border-b border-black py-1 mb-1">경력사항</h4>
                <table className="w-full border border-black text-left text-[11px]">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-black p-2">근무회사</th>
                      <th className="border border-black p-2">근무기간</th>
                      <th className="border border-black p-2">직위</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumeData.experience && resumeData.experience.length > 0 ? (
                      resumeData.experience.map((exp, idx) => (
                        <tr key={idx} className="h-[40px]">
                          <td className="border border-black p-2">{exp.company}</td>
                          <td className="border border-black p-2">{exp.period}</td>
                          <td className="border border-black p-2">{exp.position}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="h-[40px]">
                        <td colSpan={4} className="border border-black p-2 text-center">경력 정보 없음</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* 자격증 */}
              <div>
                <h4 className="font-bold border-b border-black py-1 mb-1">자격증</h4>
                <table className="w-full border border-black text-left text-[11px]">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-black p-2">취득연도</th>
                      <th className="border border-black p-2">종류</th>
                      <th className="border border-black p-2">발급기관</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumeData.certificates && resumeData.certificates.length > 0 ? (
                      resumeData.certificates.map((cert, idx) => (
                        <tr key={idx} className="h-[40px]">
                          <td className="border border-black p-2">{cert.date || '-'}</td>
                          <td className="border border-black p-2">{cert.name}</td>
                          <td className="border border-black p-2">{cert.issuedBy || '-'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="h-[40px]">
                        <td colSpan={3} className="border border-black p-2 text-center">자격증 정보 없음</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* 기술 스택 & 툴 */}
              <div className="grid grid-cols-2 gap-3.5"> {/* ✅ gap-3 → gap-3.5 */}
                {/* 기술 역량 */}
                <div>
                  <h4 className="font-bold border-b border-black py-1 mb-1">기술 역량</h4>
                  <div className="border border-black p-3 min-h-[80px] text-[11px]"> {/* ✅ p-2.5 → p-3, min-h-[70px] → min-h-[80px] */}
                    {resumeData.skills && resumeData.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {resumeData.skills.map((skill, idx) => (
                          <span key={idx} className="bg-green-100 px-2 py-1 rounded text-[10px]">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-[10px]">기술 스택 정보 없음</p>
                    )}
                  </div>
                </div>

                {/* 툴/도구 */}
                <div>
                  <h4 className="font-bold border-b border-black py-1 mb-1">툴 / 도구</h4>
                  <div className="border border-black p-3 min-h-[80px] text-[11px]">
                    {resumeData.tools && resumeData.tools.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {resumeData.tools.map((tool, idx) => (
                          <span key={idx} className="bg-blue-100 px-2 py-1 rounded text-[10px]">
                            {tool}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-[10px]">툴 정보 없음</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 프로젝트 경험 */}
              <div>
                <h4 className="font-bold border-b border-black py-1 mb-1">프로젝트 경험</h4>
                <div className="border border-black p-3 min-h-[80px] space-y-2 text-[11px]">
                  {resumeData.projects && resumeData.projects.length > 0 ? (
                    resumeData.projects.slice(0, 2).map((project, idx) => (
                      <div key={idx} className="border-b pb-2 last:border-b-0">
                        <p className="font-bold text-[11px]">{project.title}</p>
                        <p className="text-[10px] text-gray-700 leading-snug mt-0.5">{project.description}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-[10px]">프로젝트 정보 없음</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* 2페이지 - 자기소개서 (동일) */}
        <main className="w-[210mm] h-[297mm] bg-white border border-black shadow-lg p-6 text-[13px] leading-normal">
          <h3 className="text-base font-bold mb-2">☆ 자기 소개서</h3>
          <div className="border-t border-black flex flex-col">
            {/* 주요경력 및 업무강점 */}
            <div className="flex border-b border-black min-h-[60mm]">
              <div className="w-[25%] bg-gray-100 border-r border-black p-3 font-bold flex items-start">
                주요경력 및<br/>업무강점
              </div>
              <div className="w-[75%] p-3 text-[12px] leading-relaxed whitespace-pre-wrap">
                {resumeData.coverLetter?.strengths || '내용이 생성되지 않았습니다.'}
              </div>
            </div>

            {/* 성장과정 */}
            <div className="flex border-b border-black min-h-[60mm]">
              <div className="w-[25%] bg-gray-100 border-r border-black p-3 font-bold flex items-start">
                성장과정
              </div>
              <div className="w-[75%] p-3 text-[12px] leading-relaxed whitespace-pre-wrap">
                {resumeData.coverLetter?.growth || '내용이 생성되지 않았습니다.'}
              </div>
            </div>

            {/* 성격의 장단점 */}
            <div className="flex border-b border-black min-h-[60mm]">
              <div className="w-[25%] bg-gray-100 border-r border-black p-3 font-bold flex items-start">
                성격의<br/>장단점
              </div>
              <div className="w-[75%] p-3 text-[12px] leading-relaxed whitespace-pre-wrap">
                {resumeData.coverLetter?.personality || '내용이 생성되지 않았습니다.'}
              </div>
            </div>

            {/* 지원동기 및 입사포부 */}
            <div className="flex min-h-[60mm]">
              <div className="w-[25%] bg-gray-100 border-r border-black p-3 font-bold flex items-start">
                지원동기 및<br/>입사포부
              </div>
              <div className="w-[75%] p-3 text-[12px] leading-relaxed whitespace-pre-wrap">
                {resumeData.coverLetter?.motivation || '내용이 생성되지 않았습니다.'}
              </div>
            </div>
          </div>
        </main>
      </div>

        
      {/* 버튼 영역 */}
      <div className="flex justify-center gap-4 mb-10">
        <button 
          onClick={() => navigate(`/resume/edit/${resumeId}`)}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-all"
        >
          수정하기
        </button>
      </div>

      <Footer />
    </div>
  );
}