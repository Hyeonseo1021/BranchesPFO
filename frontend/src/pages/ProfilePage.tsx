// pages/PortfolioPage.tsx
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

declare global {
  interface Window {
    daum: any;
  }
}

// 키워드 옵션 정의
const KEYWORD_OPTIONS = {
  positions: [
    '백엔드 개발자', '프론트엔드 개발자', '풀스택 개발자',
    'AI/ML 엔지니어', '데이터 엔지니어', 'DevOps 엔지니어',
    '모바일 개발자', '게임 개발자', 'QA 엔지니어', '보안 전문가'
  ],
  strengths: [
    '빠른 학습 능력', '문제 해결 능력', '책임감', '협업 능력',
    '커뮤니케이션', '리더십', '창의성', '꼼꼼함',
    '적극성', '분석력', '인내심', '도전정신'
  ],
  interests: [
    '웹 개발', '모바일 앱', 'AI/머신러닝', '클라우드/인프라',
    '데이터베이스', '블록체인', 'UI/UX 디자인', '보안',
    '빅데이터', 'IoT', 'AR/VR', '게임 개발'
  ],
  goals: [
    '기술 전문가로 성장', '문제 해결형 개발자', '팀 리더/매니저',
    '오픈소스 기여', '스타트업 창업', '글로벌 기업 근무',
    '사회 기여', '지속적 학습', '멘토링', '기술 블로그 운영'
  ]
};

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [phone, setPhone] = useState('');
  
  // ✅ 키워드 선택
  const [selectedKeywords, setSelectedKeywords] = useState({
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
  const [agree, setAgree] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const navigate = useNavigate();

  /** 프로필 불러오기 */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const meRes = await axiosInstance.get('/auth/me');
        const currentUserId = meRes.data.user._id;
        setUserId(currentUserId);

        const profileRes = await axiosInstance.get(`/profile/${currentUserId}`);
        const data = profileRes.data;

        if (data) {
          setName(data.name || "");
          setBirth(data.birth || "");
          setPhone(data.phone || "");
          const fullAddress = data.address || "";
          const addressParts = fullAddress.split('|||');
          setAddress(addressParts[0] || "");
          setDetailAddress(addressParts[1] || "");
          
          // ✅ 키워드 데이터 불러오기
          if (data.introductionKeywords) {
            setSelectedKeywords({
              positions: data.introductionKeywords.positions || [],
              strengths: data.introductionKeywords.strengths || [],
              interests: data.introductionKeywords.interests || [],
              goals: data.introductionKeywords.goals || []
            });
          }
          
          setEducation(
            (data.education || []).map(
              (e: any) => `${e.schoolType || ''} / ${e.school || ""} / ${e.major || ""} / ${e.degree || ""} / ${e.period || ""}`
            )
          );
          setCareer((data.experiences || []).map((e: any) => `${e.company} / ${e.position} / ${e.period}`));
          setCertificates((data.certificates || []).map((c: any) => c.name));
          setSkills(data.skills || []);
          setTools(data.tools || []);
          setProjects((data.projects || []).map((p: any) => 
            `${p.title || ''}||${p.description || ''}||${p.role || ''}||${(p.techStack || []).join(',')}||${p.period || ''}||${p.link || ''}`
          ));
          setPhoto(data.avatar || "");
        }
      } catch (err: any) {
        console.error("프로필 불러오기 실패:", err);
        if (err.response?.status === 401) {
          alert('로그인이 필요합니다.');
          navigate('/login');
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  /** 키워드 토글 */
  const toggleKeyword = (category: keyof typeof selectedKeywords, keyword: string) => {
    setSelectedKeywords(prev => {
      const current = prev[category];
      const isSelected = current.includes(keyword);
      
      return {
        ...prev,
        [category]: isSelected
          ? current.filter(k => k !== keyword)
          : [...current, keyword]
      };
    });
  };

  /** 저장 */
  const handleSave = async () => {
    if (!agree) {
      alert("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    if (!userId) {
      alert("사용자 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    // 최소 3개씩 선택 확인
    const { positions, strengths, interests, goals } = selectedKeywords;
    if (positions.length < 3 || strengths.length < 3 || interests.length < 3 || goals.length < 3) {
      alert('자기소개 키워드를 각 카테고리에서 최소 3개 이상 선택해주세요!');
      return;
    }

    const body = {
      name,
      birth,
      phone,
      address: detailAddress ? `${address}|||${detailAddress}` : address,
      avatar: photo,
      introductionKeywords: selectedKeywords,
      education: education.map((item) => {
        const [schoolType, school, major, degree, period] = item.split(" / ");
        return { schoolType, school, major, degree, period };
      }),
      experiences: career.map((item) => {
        const [company, position, period] = item.split(" / ");
        return { company, position, period, description: "" };
      }),
      certificates: certificates.map((c) => ({ name: c })),
      skills,
      tools,
      projects: projects.map((item) => {
        const [title, description, role, techStackStr, period, link] = item.split('||');
        return { 
          title, 
          description, 
          role, 
          techStack: techStackStr ? techStackStr.split(',').filter(t => t.trim()) : [], 
          period, 
          link 
        };
      }),
    };

    try {
      await axiosInstance.patch(`/profile/${userId}/basic`, body);
      alert("서버에 저장되었습니다.");
      navigate("/mypage");
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        alert('로그인이 필요합니다.');
        navigate('/login');
      } else {
        alert("저장 중 오류가 발생했습니다.");
      }
    }
  };

  /** 주소 검색 */
  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function(data: any) {
        const fullAddress = data.roadAddress || data.jibunAddress;
        setAddress(fullAddress);
        setDetailAddress('');
      }
    }).open();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="h-8 bg-[#E6FCB9]" />

      <div className="max-w-5xl mx-auto py-10 px-6 text-sm text-gray-800">
        <h2 className="text-xl font-bold text-center mb-8">해당 정보를 바탕으로 PFO AI가 포트폴리오, 이력서를 만들 수 있어요!</h2>

        {/* 인적사항 */}
        <section className="bg-white border p-6 rounded mb-8 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">인적사항</h3>
          <div className="flex gap-6">
            <div>
              <img
                src={photo || '/user-avatar.png'}
                alt="프로필"
                className="w-32 h-40 border object-cover mb-2"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setPhoto(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1">
              <div>
                <label className="block text-xs mb-1">이름</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded text-sm" />
              </div>
              <div>
                <label className="block text-xs mb-1">생년월일</label>
                <input
                  type="date"
                  value={birth}
                  onChange={(e) => setBirth(e.target.value)}
                  className="w-full border p-2 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">연락처</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border p-2 rounded text-sm" />
              </div>
              <div>
                <label className="block mb-1 font-medium">주소</label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={address}
                    placeholder=""
                    className="flex-1 border p-2 rounded bg-gray-50"
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={handleAddressSearch}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 whitespace-nowrap"
                  >
                    우편번호 검색
                  </button>
                </div>
                <input
                  id="detailAddress"
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                  placeholder="상세주소 입력 (예: 101동 203호)"
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ✅ 자기소개 키워드 선택 */}
        <section className="bg-white border p-6 rounded mb-8 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">자기소개 키워드 선택</h3>
          <p className="text-xs text-gray-600 mb-6">
            각 카테고리에서 최소 3개 이상 선택해주세요. 
            선택한 키워드는 이력서 생성 시 AI가 자기소개를 작성하는데 활용됩니다.
          </p>

          {/* 1. 희망 직무 */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              💼 희망 직무/포지션
              <span className="text-xs text-gray-500">({selectedKeywords.positions.length}/최소 3개)</span>
            </h4>
<div className="flex flex-wrap gap-2">
  {[
    ...KEYWORD_OPTIONS.positions,
    // ✅ 기존 리스트에 없는 사용자 입력 키워드만 추가로 표시
    ...selectedKeywords.positions.filter(k => !KEYWORD_OPTIONS.positions.includes(k))
  ].map(keyword => (
    <button
      key={keyword}
      onClick={() => toggleKeyword('positions', keyword)}
      className={`px-3 py-2 rounded text-sm transition-colors ${
        selectedKeywords.positions.includes(keyword)
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {keyword}
    </button>
  ))}

 {/* ✅ 기타 버튼 */}
  <button
    onClick={() => {
      const custom = prompt('직접 입력할 키워드를 적어주세요.');
      if (custom && custom.trim() !== '') {
        setSelectedKeywords(prev => {
          if (prev.positions.includes(custom.trim())) return prev;
          return {
            ...prev,
            positions: [...prev.positions, custom.trim()]
          };
        });
      }
    }}
    className="px-3 py-2 rounded text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
  >
    + 기타
  </button>
</div>
          </div>

          {/* 2. 나의 강점 */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              💪 나의 강점
              <span className="text-xs text-gray-500">({selectedKeywords.strengths.length}/최소 3개)</span>
            </h4>
            <div className="flex flex-wrap gap-2">
    {[
      ...KEYWORD_OPTIONS.strengths,
      // ✅ 기존 리스트에 없는 사용자 입력 키워드도 함께 렌더링
      ...selectedKeywords.strengths.filter(
        (k) => !KEYWORD_OPTIONS.strengths.includes(k)
      ),
    ].map((keyword) => (
      <button
        key={keyword}
        onClick={() => toggleKeyword('strengths', keyword)}
        className={`px-3 py-2 rounded text-sm transition-colors ${
          selectedKeywords.strengths.includes(keyword)
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {keyword}
      </button>
    ))}

    {/* ✅ 기타 버튼 */}
    <button
      onClick={() => {
        const custom = prompt('직접 입력할 강점을 적어주세요.');
        if (custom && custom.trim() !== '') {
          setSelectedKeywords((prev) => {
            if (prev.strengths.includes(custom.trim())) return prev;
            return {
              ...prev,
              strengths: [...prev.strengths, custom.trim()],
            };
          });
        }
      }}
      className="px-3 py-2 rounded text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
    >
      + 기타
    </button>
  </div>
</div>

          {/* 3. 관심 기술/분야 */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              🎯 관심 기술/분야
              <span className="text-xs text-gray-500">({selectedKeywords.interests.length}/최소 3개)</span>
            </h4>
            <div className="flex flex-wrap gap-2">
    {[
      ...KEYWORD_OPTIONS.interests,
      // ✅ 기존 리스트에 없는 사용자 입력 키워드도 함께 렌더링
      ...selectedKeywords.interests.filter(
        (k) => !KEYWORD_OPTIONS.interests.includes(k)
      ),
    ].map((keyword) => (
      <button
        key={keyword}
        onClick={() => toggleKeyword('interests', keyword)}
        className={`px-3 py-2 rounded text-sm transition-colors ${
          selectedKeywords.interests.includes(keyword)
            ? 'bg-purple-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {keyword}
      </button>
    ))}

    {/* ✅ 기타 버튼 */}
    <button
      onClick={() => {
        const custom = prompt('직접 입력할 관심 기술 또는 분야를 적어주세요.');
        if (custom && custom.trim() !== '') {
          setSelectedKeywords((prev) => {
            if (prev.interests.includes(custom.trim())) return prev;
            return {
              ...prev,
              interests: [...prev.interests, custom.trim()],
            };
          });
        }
      }}
      className="px-3 py-2 rounded text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
    >
      + 기타
    </button>
  </div>
</div>

          {/* 4. 목표/지향점 */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              🚀 목표/지향점
              <span className="text-xs text-gray-500">({selectedKeywords.goals.length}/최소 3개)</span>
            </h4>
            <div className="flex flex-wrap gap-2">
    {[
      ...KEYWORD_OPTIONS.goals,
      // ✅ 기존 리스트에 없는 사용자 입력 키워드도 함께 렌더링
      ...selectedKeywords.goals.filter(
        (k) => !KEYWORD_OPTIONS.goals.includes(k)
      ),
    ].map((keyword) => (
      <button
        key={keyword}
        onClick={() => toggleKeyword('goals', keyword)}
        className={`px-3 py-2 rounded text-sm transition-colors ${
          selectedKeywords.goals.includes(keyword)
            ? 'bg-orange-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {keyword}
      </button>
    ))}

    {/* ✅ 기타 버튼 */}
    <button
      onClick={() => {
        const custom = prompt('직접 입력할 목표 또는 지향점을 적어주세요.');
        if (custom && custom.trim() !== '') {
          setSelectedKeywords((prev) => {
            if (prev.goals.includes(custom.trim())) return prev;
            return {
              ...prev,
              goals: [...prev.goals, custom.trim()],
            };
          });
        }
      }}
      className="px-3 py-2 rounded text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
    >
      + 기타
    </button>
  </div>
</div>
        </section>

        {/* 학력 */}
        <section className="bg-white border p-6 rounded mb-8 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">학력</h3>
          {education.map((item, idx) => {
            const [schoolType = '', schoolName = '', major = '', degree = '', period = ''] = item.split(' / ');
            const updateItem = (index: number, fieldIndex: number, value: string) => {
              const fields = (education[index] || '').split(' / ');
              fields[fieldIndex] = value;
              const newValue = fields.map(f => f || '').join(' / ');
              const updated = [...education];
              updated[index] = newValue;
              setEducation(updated);
            };
            return (
              <div key={idx} className="mb-4 p-4 border rounded bg-gray-50 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={schoolType}
                    onChange={(e) => updateItem(idx, 0, e.target.value)}
                    className="border p-2 rounded text-sm"
                  >
                    <option value="">학교 구분</option>
                    <option value="고등학교">고등학교</option>
                    <option value="대학교">대학교</option>
                    <option value="대학원">대학원</option>
                  </select>
                  <div className="flex gap-2">
                    <input
                      value={schoolName}
                      onChange={(e) => updateItem(idx, 1, e.target.value)}
                      className="flex-1 border p-2 rounded text-sm"
                      placeholder="학교명"
                    />
                    <button
                      onClick={() => alert('학교 검색은 추후 연동 예정')}
                      className="px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                    >
                      학교 찾기
                    </button>
                  </div>
                </div>
                <input
                  value={major}
                  onChange={(e) => updateItem(idx, 2, e.target.value)}
                  className="w-full border p-2 rounded text-sm"
                  placeholder="전공 (예: 컴퓨터공학과)"
                />
                <input
                  value={degree}
                  onChange={(e) => updateItem(idx, 3, e.target.value)}
                  className="w-full border p-2 rounded text-sm"
                  placeholder="학위 (예: 학사, 석사, 박사)"
                />
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 items-center">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">입학일</label>
                      <input
                        type="date"
                        value={period.split('~')[0]?.trim() || ''}
                        onChange={(e) => {
                          const end = period.split('~')[1]?.trim() || '';
                          updateItem(idx, 4, `${e.target.value} ~ ${end}`);
                        }}
                        className="w-full border p-2 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">졸업일</label>
                      <input
                        type="date"
                        disabled={period.includes('재학중')}
                        value={period.includes('재학중') ? '' : period.split('~')[1]?.trim() || ''}
                        onChange={(e) => {
                          const start = period.split('~')[0]?.trim() || '';
                          updateItem(idx, 4, `${start} ~ ${e.target.value}`);
                        }}
                        className="w-full border p-2 rounded text-sm"
                      />
                    </div>
                  </div>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={period.includes('재학중')}
                      onChange={(e) => {
                        const start = period.split('~')[0]?.trim() || '';
                        const end = e.target.checked ? '재학중' : '';
                        updateItem(idx, 4, `${start} ~ ${end}`);
                      }}
                    />
                    재학중
                  </label>
                </div>
                <div className="text-right">
                  <button
                    className="text-xs text-red-500"
                    onClick={() => {
                      const updated = [...education];
                      updated.splice(idx, 1);
                      setEducation(updated);
                    }}
                  >
                    삭제
                  </button>
                </div>
              </div>
            );
          })}
          <button
            className="text-xs text-blue-600 mt-2"
            onClick={() => setEducation(prev => [...prev, ' / / / / '])}
          >
            + 학력 추가
          </button>
        </section>

        {/* 경력 */}
        <section className="bg-white border p-6 rounded mb-8 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">경력</h3>
          {career.map((item, idx) => {
            const [company = '', position = '', period = ''] = item.split(' / ');
            const updateCareer = (index: number, fieldIndex: number, value: string) => {
              const fields = (career[index] || '').split(' / ');
              fields[fieldIndex] = value;
              const newValue = fields.map(f => f || '').join(' / ');
              const updated = [...career];
              updated[index] = newValue;
              setCareer(updated);
            };
            return (
              <div key={idx} className="mb-4 p-4 border rounded bg-gray-50 space-y-2">
                <input
                  value={company}
                  onChange={(e) => updateCareer(idx, 0, e.target.value)}
                  placeholder="회사명 (예: 삼성전자)"
                  className="w-full border p-2 rounded text-sm"
                />
                <input
                  value={position}
                  onChange={(e) => updateCareer(idx, 1, e.target.value)}
                  placeholder="직책 (예: 백엔드 개발자)"
                  className="w-full border p-2 rounded text-sm"
                />
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">입사일</label>
                      <input
                        type="date"
                        value={period.split('~')[0]?.trim() || ''}
                        onChange={(e) => {
                          const end = period.split('~')[1]?.trim() || '';
                          updateCareer(idx, 2, `${e.target.value} ~ ${end}`);
                        }}
                        className="w-full border p-2 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">퇴사일</label>
                      <input
                        type="date"
                        disabled={period.includes('재직중')}
                        value={period.includes('재직중') ? '' : period.split('~')[1]?.trim() || ''}
                        onChange={(e) => {
                          const start = period.split('~')[0]?.trim() || '';
                          updateCareer(idx, 2, `${start} ~ ${e.target.value}`);
                        }}
                        className="w-full border p-2 rounded text-sm"
                      />
                    </div>
                  </div>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={period.includes('재직중')}
                      onChange={(e) => {
                        const start = period.split('~')[0]?.trim() || '';
                        const end = e.target.checked ? '재직중' : '';
                        updateCareer(idx, 2, `${start} ~ ${end}`);
                      }}
                    />
                    재직중
                  </label>
                </div>
                <div className="text-right">
                  <button
                    className="text-xs text-red-500"
                    onClick={() => {
                      const updated = [...career];
                      updated.splice(idx, 1);
                      setCareer(updated);
                    }}
                  >
                    삭제
                  </button>
                </div>
              </div>
            );
          })}
          <button
            className="text-xs text-blue-600 mt-2"
            onClick={() => setCareer((prev) => [...prev, ' /  / '])}
          >
            + 경력 추가
          </button>
        </section>

        {/* 자격증 */}
        <section className="bg-white border p-6 rounded mb-8 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">자격증</h3>
          <div className="space-y-2 mb-3">
            {certificates.map((cert, idx) => (
              <div key={idx} className="flex justify-between bg-gray-50 p-2 rounded border">
                <span className="text-sm">{cert}</span>
                <button
                  className="text-red-500 text-xs"
                  onClick={() => setCertificates((prev) => prev.filter((_, i) => i !== idx))}
                >
                  삭제
                </button>
              </div>
            ))}
            {certificates.length === 0 && <p className="text-sm text-gray-400">등록된 자격증이 없습니다.</p>}
          </div>
          <button
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            onClick={() => {
              const cert = prompt('찾고 싶은 자격증을 입력하세요 (예: 정보처리기사)');
              if (cert) setCertificates((prev) => [...prev, cert]);
            }}
          >
            자격증 찾기
          </button>
        </section>

        {/* 기술, 툴 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border p-6 rounded shadow-sm">
            <h3 className="font-semibold mb-2">기술 역량</h3>
            {skills.map((skill, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input
                  value={skill}
                  onChange={(e) => {
                    const updated = [...skills];
                    updated[idx] = e.target.value;
                    setSkills(updated);
                  }}
                  placeholder="예: JavaScript, React, Node.js"
                  className="flex-1 border p-2 rounded text-sm"
                />
                <button
                  className="text-xs text-red-500"
                  onClick={() => {
                    const updated = [...skills];
                    updated.splice(idx, 1);
                    setSkills(updated);
                  }}
                >
                  삭제
                </button>
              </div>
            ))}
            <button
              className="text-xs text-blue-600 mt-1"
              onClick={() => setSkills((prev) => [...prev, ''])}
            >
              + 추가
            </button>
          </div>
          <div className="bg-white border p-6 rounded shadow-sm">
            <h3 className="font-semibold mb-2">툴 / 도구</h3>
            {tools.map((tool, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input
                  value={tool}
                  onChange={(e) => {
                    const updated = [...tools];
                    updated[idx] = e.target.value;
                    setTools(updated);
                  }}
                  placeholder="예: GitHub, Figma"
                  className="flex-1 border p-2 rounded text-sm"
                />
                <button
                  className="text-xs text-red-500"
                  onClick={() => {
                    const updated = [...tools];
                    updated.splice(idx, 1);
                    setTools(updated);
                  }}
                >
                  삭제
                </button>
              </div>
            ))}
            <button
              className="text-xs text-blue-600 mt-1"
              onClick={() => setTools((prev) => [...prev, ''])}
            >
              + 추가
            </button>
          </div>
        </section>

        {/* 프로젝트 */}
        <section className="bg-white border p-6 rounded mb-8 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">프로젝트 경험</h3>
          {projects.map((item, idx) => {
            const [title = '', description = '', role = '', techStackStr = '', period = '', link = ''] = item.split('||');
            const techStack = techStackStr ? techStackStr.split(',') : [];
            
            const updateProject = (field: number, value: string) => {
              const fields = item.split('||');
              fields[field] = value;
              const updated = [...projects];
              updated[idx] = fields.join('||');
              setProjects(updated);
            };
            
            return (
              <div key={idx} className="mb-4 p-4 border rounded bg-gray-50 space-y-2">
                <input
                  value={title}
                  onChange={(e) => updateProject(0, e.target.value)}
                  placeholder="프로젝트명 (예: PFO 플랫폼 개발)"
                  className="w-full border p-2 rounded text-sm"
                />
                <textarea
                  value={description}
                  onChange={(e) => updateProject(1, e.target.value)}
                  placeholder="프로젝트 설명"
                  className="w-full border p-2 rounded text-sm"
                  rows={2}
                />
                <input
                  value={role}
                  onChange={(e) => updateProject(2, e.target.value)}
                  placeholder="담당 역할 (예: 프론트엔드 개발)"
                  className="w-full border p-2 rounded text-sm"
                />
                <input
                  value={techStackStr}
                  onChange={(e) => updateProject(3, e.target.value)}
                  placeholder="기술 스택 (쉼표로 구분, 예: React,TypeScript,Tailwind)"
                  className="w-full border p-2 rounded text-sm"
                />
                <input
                  value={period}
                  onChange={(e) => updateProject(4, e.target.value)}
                  placeholder="기간 (예: 2024.01 ~ 2024.06)"
                  className="w-full border p-2 rounded text-sm"
                />
                <input
                  value={link}
                  onChange={(e) => updateProject(5, e.target.value)}
                  placeholder="링크 (예: https://github.com/...)"
                  className="w-full border p-2 rounded text-sm"
                />
                <div className="text-right">
                  <button
                    onClick={() => {
                      const updated = [...projects];
                      updated.splice(idx, 1);
                      setProjects(updated);
                    }}
                    className="text-xs text-red-500"
                  >
                    삭제
                  </button>
                </div>
              </div>
            );
          })}
          <button
            onClick={() => setProjects([...projects, '||||||'])}
            className="text-xs text-blue-600"
          >
            + 프로젝트 추가
          </button>
        </section>

        {/* 개인정보 고지 및 동의 */}
        <section className="bg-white border p-4 rounded mb-8 shadow-sm">
          <p className="text-sm text-gray-700 mb-2">
            ⚠️ 작성된 모든 정보는 이력서 및 포트폴리오 자동 생성 목적에만 사용되며,
            저장 시 이에 동의한 것으로 간주됩니다.
          </p>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="w-4 h-4"
            />
            위의 개인정보 활용에 동의합니다.
          </label>
        </section>

        {/* 저장 버튼 */}
        <div className="text-right">
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
          >
            저장하기
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}