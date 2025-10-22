import React, { useState, useEffect } from "react";
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/buttons';
import { useNavigate } from 'react-router-dom';
import Header from '../pages/Header';
import Footer from '../pages/Footer';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function AIPFOPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [selection, setSelection] = useState<'portfolio' | 'resume'>('resume');
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [profileData, setProfileData] = useState<any>(null);

  // ✅ 사용자 프로필 미리 불러오기
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const meRes = await axiosInstance.get('/auth/me');
        const userId = meRes.data.user._id;
        const profileRes = await axiosInstance.get(`/profile/${userId}`);
        setProfileData({
          userId,
          user: meRes.data.user,
          profile: profileRes.data
        });
      } catch (error) {
        console.error('프로필 불러오기 실패:', error);
      }
    };
    if (isLoggedIn) {
      fetchProfile();
    }
  }, [isLoggedIn]);

  // ✅ 프로필 데이터 검증 함수
  const checkProfileData = () => {
    if (!profileData?.profile) return { isValid: false, missing: ['프로필 전체'] };

    const { profile } = profileData;
    const missing = [];

    // 포트폴리오에 필요한 최소 데이터
    const hasProjects = profile.projects && profile.projects.length > 0;
    const hasSkills = profile.skills && profile.skills.length > 0;
    const hasExperiences = profile.experiences && profile.experiences.length > 0;

    if (!hasProjects) missing.push('프로젝트');
    if (!hasSkills) missing.push('스킬');
    if (!hasExperiences) missing.push('경력');

    // 최소 1개 이상 있으면 OK
    const isValid = hasProjects || hasSkills || hasExperiences;

    return { isValid, missing, hasProjects, hasSkills, hasExperiences };
  };

  // ✅ selection에 따라 다른 API 호출
  const handleGenerate = async () => {
    try {
      if (!isLoggedIn) {
        alert("로그인이 필요합니다.");
        navigate('/login');
        return;
      }

      if (!profileData) {
        alert('사용자 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
        return;
      }

      const { profile, user } = profileData;

      // ✅ 포트폴리오 선택 시 필수 데이터 검증
      if (selection === 'portfolio') {
        const validation = checkProfileData();
        
        if (!validation.isValid) {
          const missingText = validation.missing.join(', ');
          const confirmed = window.confirm(
            `⚠️ 포트폴리오 생성에 필요한 정보가 부족합니다!\n\n` +
            `부족한 정보: ${missingText}\n\n` +
            `포트폴리오를 제대로 만들려면 프로젝트, 스킬, 경력 중\n` +
            `최소 1개 이상의 정보가 필요해요.\n\n` +
            `프로필 작성 페이지로 이동하시겠어요?`
          );
          
          if (confirmed) {
            navigate('/profile');
          }
          return;
        }

        // ✅ 데이터는 있지만 적을 때 경고
        const totalItems = 
          (validation.hasProjects ? 1 : 0) + 
          (validation.hasSkills ? 1 : 0) + 
          (validation.hasExperiences ? 1 : 0);
        
        if (totalItems === 1) {
          const confirmed = window.confirm(
            `📝 현재 입력된 정보가 적어요!\n\n` +
            `더 풍부한 포트폴리오를 만들려면\n` +
            `추가 정보를 입력하는 것을 추천드려요.\n\n` +
            `그래도 지금 생성하시겠어요?`
          );
          
          if (!confirmed) return;
        }
      }

      setIsLoading(true);

      if (selection === 'resume') {
        // ✅ 이력서 생성
        const response = await axiosInstance.post('/resume/generate', {
          name: profile.name || user.nickname || '',
          email: user.email || '',
          phone: profile.phone || '',
          birth: profile.birth || '',
          desiredJob: prompt || '백엔드 개발자',
          address: profile.address || '',
          certificates: profile.certificates || [],
          experiences: profile.experiences || [],
          education: profile.education || [],
          skills: profile.skills || [],
          tools: profile.tools || [],
          projects: profile.projects || [],
          introductionKeywords: profile.introductionKeywords || {
            positions: [],
            strengths: [],
            interests: [],
            goals: []
          },
          title: prompt ? `${prompt} 이력서` : '내 이력서'
        });
        console.log('✅ 이력서 생성 성공:', response.data);
        navigate(`/resume/result/${response.data.resumeId}`);

      } else {
        // ✅ 포트폴리오 생성 - 제목 자동 생성!
        const userName = profile.name || user.nickname || '사용자';
        const today = new Date();
        const dateString = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
        const autoTitle = `${userName}님의 포트폴리오 - ${dateString}`;
        
        console.log('🎯 자동 생성된 제목:', autoTitle);
        
        const response = await axiosInstance.post('/portfolio/generate', {
          name: profile.name || user.nickname || '',
          email: user.email || '',
          phone: profile.phone || '',
          title: autoTitle,  // ✅ 자동 생성된 제목!
          
          // ✅ 키워드
          introductionKeywords: profile.introductionKeywords || {
            positions: [],
            strengths: [],
            interests: [],
            goals: []
          },
          
          // ✅ 프로젝트 (포트폴리오의 핵심!)
          projects: profile.projects || [],
          
          // ✅ 기술 & 툴
          skills: profile.skills || [],
          tools: profile.tools || [],
          
          // ✅ 선택적 정보 (있으면 더 풍부한 포트폴리오)
          experiences: profile.experiences || [],
          education: profile.education || [],
          certificates: profile.certificates || [],
          
          // ✅ 🎨 사용자 프롬프트 추가! (가장 중요!)
          userPrompt: prompt || ''
        });

        console.log('✅ 포트폴리오 생성 성공:', response.data);
        navigate(`/portfolio/result/${response.data.portfolioId}`);
      }
      
    } catch (error: any) {
      console.error('❌ 생성 실패:', error);
      console.error('에러 상세:', error.response?.data);
      alert(error.response?.data?.message || error.response?.data?.error || '생성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ 프로필 상태 계산
  const validation = profileData ? checkProfileData() : null;
  const profileStatus = validation ? {
    isValid: validation.isValid,
    hasProjects: validation.hasProjects,
    hasSkills: validation.hasSkills,
    hasExperiences: validation.hasExperiences,
    missing: validation.missing
  } : null;

  return (
    <>
      {/* ✅ 로딩 중일 때 보여줄 전체 오버레이 */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-white bg-opacity-80 flex flex-col items-center justify-center">
          <img src="/images/Branches_2.0_Logo.png" className="w-12 h-12 mb-4 animate-bounce" alt="로딩" />
          <p className="text-lg font-semibold mb-2">당신의 정보를 바탕으로 생성 중입니다...</p>
          <div className="animate-spin rounded-full border-4 border-green-500 border-t-transparent h-8 w-8" />
        </div>
      )}

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
          <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-[2px_2px_2px_rgba(0,0,0,0.5)] mb-4 animate-fade-in-down">
            Powered by AI 기반 이력서/포트폴리오
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
                type="radio"
                name="selection"
                checked={selection === 'portfolio'}
                onChange={() => setSelection('portfolio')}
              />
              포트폴리오
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="selection"
                checked={selection === 'resume'}
                onChange={() => setSelection('resume')}
              />
              이력서
            </label>
          </div>

          {/* ✅ 포트폴리오 선택 시 프로필 상태 표시 */}
          {selection === 'portfolio' && profileStatus && (
            <div className={`max-w-2xl mx-auto mb-6 p-4 rounded-lg border-2 ${
              profileStatus.isValid 
                ? 'bg-green-50 border-green-300' 
                : 'bg-yellow-50 border-yellow-300'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">
                  {profileStatus.isValid ? '✅' : '⚠️'}
                </span>
                <span className="font-semibold">
                  {profileStatus.isValid ? '프로필 정보 확인됨' : '프로필 정보 부족'}
                </span>
              </div>
              <div className="text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <span>{profileStatus.hasProjects ? '✅' : '❌'}</span>
                  <span>프로젝트 {profileStatus.hasProjects ? '있음' : '없음'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{profileStatus.hasSkills ? '✅' : '❌'}</span>
                  <span>스킬 {profileStatus.hasSkills ? '있음' : '없음'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{profileStatus.hasExperiences ? '✅' : '❌'}</span>
                  <span>경력 {profileStatus.hasExperiences ? '있음' : '없음'}</span>
                </div>
              </div>
              {!profileStatus.isValid && (
                <button
                  onClick={() => navigate('/profile')}
                  className="mt-3 w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
                >
                  프로필 작성하러 가기 →
                </button>
              )}
            </div>
          )}

          {/* ✅ 프롬프트 입력란 - 포트폴리오와 이력서에 따라 다른 설명 */}
          <div className="max-w-2xl mx-auto mb-10">
            <label htmlFor="aiPrompt" className="block text-center font-semibold mb-2">
              {selection === 'portfolio' 
                ? '🎨 원하는 포트폴리오 스타일 입력 (선택사항)' 
                : '📝 이력서 프롬프트 입력'}
            </label>
            <textarea
              id="aiPrompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                selection === 'portfolio'
                  ? '예시:\n• 글래스모피즘 스타일로 만들어주세요\n• 다크모드로 해주세요\n• 미니멀하고 깔끔한 디자인 원해요\n• 프로젝트를 갤러리 형식으로 보여주세요\n\n입력하지 않으면 AI가 자동으로 멋진 디자인을 선택해요!'
                  : '예: 삼성전자에 지원할 수 있도록 이력서를 작성해줘.'
              }
              className="w-full p-3 border border-gray-300 rounded-md resize-none"
              rows={selection === 'portfolio' ? 6 : 3}
            />
            
            {/* ✅ 포트폴리오일 때만 추가 설명 표시 */}
            {selection === 'portfolio' && (
              <div className="mt-3">
                <p className="text-xs text-gray-600 text-center">
                  💡 팁: 구체적으로 설명할수록 원하는 결과물을 얻을 수 있어요!<br />
                  비워두면 AI가 랜덤으로 멋진 디자인을 만들어줘요.
                </p>
                <p className="text-xs text-green-600 text-center mt-2">
                  📁 포트폴리오는 자동으로 "<strong>{profileData?.profile?.name || profileData?.user?.nickname || '사용자'}님의 포트폴리오 - {new Date().toLocaleDateString('ko-KR')}</strong>" 제목으로 저장돼요
                </p>
              </div>
            )}
          </div>

          {/* ✅ 생성 버튼 - 중앙에 크게 */}
          <div className="flex justify-center mb-10">
            <div 
              className={`w-64 h-64 text-center cursor-pointer hover:shadow-2xl transition-all transform hover:scale-105 ${
                selection === 'portfolio' && profileStatus && !profileStatus.isValid 
                  ? 'opacity-60' 
                  : ''
              }`}
              onClick={handleGenerate}
            >
              <Card className="w-full h-full bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-300">
                <CardContent className="flex flex-col items-center justify-center h-full p-6">
                  <img 
                    src="/images/Branches_2.0_Logo.png" 
                    alt="AI로 생성하기" 
                    className="w-20 h-20 mb-4 animate-pulse" 
                  />
                  <span className="text-xl font-bold text-green-700 mb-2">
                    내 정보 불러오기
                  </span>
                  <span className="text-sm text-gray-600">
                    내 프로필 정보로 {selection === 'portfolio' ? '포트폴리오' : '이력서'} 만들기
                  </span>
                  {selection === 'portfolio' && profileStatus && !profileStatus.isValid && (
                    <p className="text-xs text-red-500 mt-3 font-semibold">
                      ⚠️ 프로필 작성 필요
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ✅ 프로필 작성 안내 */}
          <div className="text-center mb-10">
            <p className="text-sm text-gray-600 mb-2">
              프로필 정보가 없으신가요?
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="text-green-600 font-semibold hover:underline"
            >
              프로필 작성하러 가기 →
            </button>
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