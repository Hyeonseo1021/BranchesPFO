// src/pages/MyPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import axiosInstance from '../api/axios';

export default function Mypage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [name, setName] = useState('홍길동');
  const [birth, setBirth] = useState('2003년 12월 17일');
  const [address, setAddress] = useState('전남 순천시 별량길 50 2층');
  const [phone, setPhone] = useState('010-0000-0000');
  
  // ✅ 키워드 자기소개
  const [introKeywords, setIntroKeywords] = useState({
    positions: [] as string[],
    strengths: [] as string[],
    interests: [] as string[],
    goals: [] as string[]
  });
  
  const [education, setEducation] = useState<string[]>([]);
  const [career, setCareer] = useState<string[]>([]);
  const [certificates, setCertificates] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [tools, setTools] = useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [photo, setPhoto] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('🔍 프로필 요청...');
        
        const meRes = await axiosInstance.get('/auth/me');
        const userId = meRes.data.user._id;
        
        console.log('✅ userId:', userId);
        setIsAuthenticated(true);

        const profileRes = await axiosInstance.get(`/profile/${userId}`);
        const profile = profileRes.data;
        
        console.log('✅ 프로필 데이터:', profile);

        setName(profile.name || meRes.data.user.nickname || '');
        setBirth(profile.birth || '');
        setAddress(profile.address || '');
        setPhone(profile.phone || '');
        
        // ✅ 키워드 자기소개
        if (profile.introductionKeywords) {
          setIntroKeywords({
            positions: profile.introductionKeywords.positions || [],
            strengths: profile.introductionKeywords.strengths || [],
            interests: profile.introductionKeywords.interests || [],
            goals: profile.introductionKeywords.goals || []
          });
        }
        
        setEducation(profile.education?.map((e: any) => 
          `${e.schoolType || ''} / ${e.school || ''} / ${e.major || ''} / ${e.degree || ''} / (${e.period || ''})`
        ) || []);
        
        setCareer(profile.experiences?.map((exp: any) => 
          `${exp.company} / ${exp.position} (${exp.period})`
        ) || []);
        
        setCertificates(profile.certificates?.map((c: any) => 
          `${c.name} (${c.date || '취득일 미상'})`
        ) || []);
        
        setSkills(profile.skills || []);
        setTools(profile.tools || []);
        
        setProjects((profile.projects || []).map((p: any) => 
          `${p.title}||${p.description}||${p.role}||${(p.techStack || []).join(',')}||${p.period}||${p.link}`
        ));
        
        setPhoto(profile.avatar || '');

      } catch (error: any) {
        console.error('❌ 프로필 불러오기 실패:', error);
        console.error('에러 상세:', error.response?.data);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const hasKeywords = introKeywords.positions.length > 0 || 
                      introKeywords.strengths.length > 0 || 
                      introKeywords.interests.length > 0 || 
                      introKeywords.goals.length > 0;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="h-8 bg-[#E6FCB9]" />
      <div className="max-w-7xl mx-auto flex p-10 space-x-6 text-sm text-gray-800">
        {/* 사이드바 */}
        <aside className="w-60 border-r pr-6">
          <h3 className="font-bold text-base mb-4">내 활동</h3>
          <ul className="space-y-2">
            {/* ✅ 글 보기 - ?tab=posts */}
            <li>
              <a href="/my-activity?tab=posts" className="hover:underline">
                📝 내가 쓴 글 보기
              </a>
            </li>
            
            {/* ✅ 댓글 보기 - ?tab=comments */}
            <li>
              <a href="/my-activity?tab=comments" className="hover:underline">
                💬 내가 작성한 댓글
              </a>
            </li>
          </ul>

          <h3 className="font-bold text-base mt-6 mb-4">PFO 결과물 보기</h3>
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => navigate('/mypage/resumes')}
                className="hover:underline text-left w-full"
              >
                📄 이력서 보기
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('/mypage/portfolios')}
                className="hover:underline text-left w-full"
              >
                📁 포트폴리오 보기
              </button>
            </li>
          </ul>
        </aside>

        {/* 본문 */}
        <main className="flex-1 space-y-8">
          {/* 인적사항 */}
          <div className="flex border p-4 rounded">
            <img src={photo || "/user-avatar.png"} alt="프로필" className="w-32 h-40 border mr-6 object-cover" />
            <div className="flex-1 grid grid-cols-2 gap-x-10 gap-y-2">
              <div><strong>이름</strong><p>{name}</p></div>
              <div><strong>생년월일</strong><p>{birth}</p></div>
              <div><strong>연락처</strong><p>{phone}</p></div>
              <div><strong>주소</strong><p>{address}</p></div>
            </div>
          </div>

          {/* ✅ 자기소개 키워드 */}
          <div>
            <h3 className="font-bold border-b pb-1 mb-2 text-base">자기소개 키워드</h3>
            
            {hasKeywords ? (
              <div className="bg-gray-50 border p-4 rounded">
                {introKeywords.positions.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-1">💼 희망 직무</p>
                    <div className="flex flex-wrap gap-1">
                      {introKeywords.positions.map((k, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {introKeywords.strengths.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-1">💪 나의 강점</p>
                    <div className="flex flex-wrap gap-1">
                      {introKeywords.strengths.map((k, i) => (
                        <span key={i} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {introKeywords.interests.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-1">🎯 관심 분야</p>
                    <div className="flex flex-wrap gap-1">
                      {introKeywords.interests.map((k, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {introKeywords.goals.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1">🚀 목표/지향점</p>
                    <div className="flex flex-wrap gap-1">
                      {introKeywords.goals.map((k, i) => (
                        <span key={i} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="bg-gray-50 border p-4 rounded text-gray-400">
                자기소개 키워드가 설정되지 않았습니다. 정보 수정 페이지에서 키워드를 선택해주세요.
              </p>
            )}
          </div>

          {/* 학력 */}
          <div>
            <h3 className="font-bold border-b pb-1 mb-2 text-base">학력</h3>
            <div className="bg-white border p-4 rounded space-y-1">
              {education.length > 0 ? education.map((e, i) => <p key={i}>{e}</p>) : <p>작성된 학력이 없습니다.</p>}
            </div>
          </div>

          {/* 경력 */}
          <div>
            <h3 className="font-bold border-b pb-1 mb-2 text-base">경력</h3>
            <div className="bg-white border p-4 rounded space-y-1">
              {career.length > 0 ? career.map((c, i) => <p key={i}>{c}</p>) : <p>신입</p>}
            </div>
          </div>

          {/* 자격증 */}
          <div>
            <h3 className="font-bold border-b pb-1 mb-2 text-base">자격증</h3>
            <div className="bg-white border p-4 rounded space-y-1">
              {certificates.length > 0 ? certificates.map((cert, i) => <p key={i}>{cert}</p>) : <p>미입력</p>}
            </div>
          </div>

          {/* 기술 및 툴 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold border-b pb-1 mb-2 text-base">기술 역량</h3>
              <div className="bg-white border p-4 rounded space-y-1">
                {skills.length > 0 ? skills.map((s, i) => <p key={i}>{s}</p>) : <p>미입력</p>}
              </div>
            </div>
            <div>
              <h3 className="font-bold border-b pb-1 mb-2 text-base">활용 툴</h3>
              <div className="bg-white border p-4 rounded space-y-1">
                {tools.length > 0 ? tools.map((t, i) => <p key={i}>{t}</p>) : <p>미입력</p>}
              </div>
            </div>
          </div>

          {/* 프로젝트 */}
          <div>
            <h3 className="font-bold border-b pb-1 mb-2 text-base">프로젝트 경험</h3>
            <div className="bg-white border p-4 rounded space-y-4">
              {projects.length > 0 ? (
                projects.map((p, i) => {
                  const [title, description, role, techStackStr, period, link] = p.split('||');
                  const techStack = techStackStr ? techStackStr.split(',').filter(t => t.trim()) : [];
                  
                  return (
                    <div key={i} className="border-b pb-3 last:border-b-0 space-y-2">
                      <p className="font-semibold text-sm">{title}</p>
                      
                      {role && (
                        <p className="text-xs text-gray-600">
                          <span className="font-semibold">역할:</span> {role}
                        </p>
                      )}
                      
                      {period && (
                        <p className="text-xs text-gray-600">
                          <span className="font-semibold">기간:</span> {period}
                        </p>
                      )}
                      
                      {techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {techStack.map((tech, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {description && (
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">{description}</p>
                      )}
                      
                      {link && (
                        <a 
                          href={link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline inline-block"
                        >
                          🔗 프로젝트 링크
                        </a>
                      )}
                    </div>
                  );
                })
              ) : (
                <p>없음</p>
              )}
            </div>
          </div>

          {/* 수정 버튼 */}
          <div className="text-right">
            <button
              onClick={() => navigate('/profile')}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
            >
              정보 수정
            </button>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}