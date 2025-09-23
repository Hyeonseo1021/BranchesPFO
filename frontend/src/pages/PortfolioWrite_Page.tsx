// pages/PortfolioPage.tsx
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useRouter } from 'next/router';

export default function PortfolioPage() {
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [intro, setIntro] = useState('');
  const [education, setEducation] = useState<string[]>([]);
  const [career, setCareer] = useState<string[]>([]);
  const [certificates, setCertificates] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [tools, setTools] = useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [photo, setPhoto] = useState('');

  useEffect(() => {
    setName(localStorage.getItem('mypage_name') || '');
    setBirth(localStorage.getItem('mypage_birth') || '');
    setAddress(localStorage.getItem('mypage_address') || '');
    setPhone(localStorage.getItem('mypage_phone') || '');
    setIntro(localStorage.getItem('mypage_intro') || '');
    setEducation(JSON.parse(localStorage.getItem('mypage_education') || '[]'));
    setCareer(JSON.parse(localStorage.getItem('mypage_careers') || '[]'));
    setCertificates(JSON.parse(localStorage.getItem('mypage_certificates') || '[]'));
    setSkills(JSON.parse(localStorage.getItem('mypage_skills') || '[]'));
    setTools(JSON.parse(localStorage.getItem('mypage_tools') || '[]'));
    setProjects(JSON.parse(localStorage.getItem('mypage_projects') || '[]'));
    setPhoto(localStorage.getItem('mypage_photo') || '');
  }, []);

  const handleSave = () => {
    localStorage.setItem('mypage_name', name);
    localStorage.setItem('mypage_birth', birth);
    localStorage.setItem('mypage_address', address);
    localStorage.setItem('mypage_phone', phone);
    localStorage.setItem('mypage_intro', intro);
    localStorage.setItem('mypage_education', JSON.stringify(education));
    localStorage.setItem('mypage_careers', JSON.stringify(career));
    localStorage.setItem('mypage_certificates', JSON.stringify(certificates));
    localStorage.setItem('mypage_skills', JSON.stringify(skills));
    localStorage.setItem('mypage_tools', JSON.stringify(tools));
    localStorage.setItem('mypage_projects', JSON.stringify(projects));
    localStorage.setItem('mypage_photo', photo);
    alert('저장되었습니다.');
    window.location.href = '/mypage';
  };
const handleAddressSearch = async () => {
    if (!address) {
      alert('주소를 입력해주세요.');
      return;
    }
    try {
      // 백엔드 API 호출
      const response = await fetch(`/auth/address/search?keyword=${encodeURIComponent(address)}`);
      const data = await response.json();

      // TODO: 검색 결과를 UI에 표시하는 로직을 여기에 추가합니다.
      // 예를 들어, 검색된 주소 목록을 모달창으로 보여주고 선택하게 할 수 있습니다.
      console.log(data);
      alert('주소 검색 API가 호출되었습니다. (개발자 콘솔을 확인해보세요)');
    } catch (error) {
      console.error("주소 검색 오류:", error);
      alert('주소 검색 중 오류가 발생했습니다.');
    }
  };
  const renderEditableList = (
    label: string,
    items: string[],
    setItems: React.Dispatch<React.SetStateAction<string[]>>,
    placeholder: string
  ) => (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">{label}</h3>
      {items.map((item, idx) => (
        <input
          key={idx}
          value={item}
          placeholder={placeholder}
          onChange={(e) => {
            const updated = [...items];
            updated[idx] = e.target.value;
            setItems(updated);
          }}
          className="w-full border p-2 rounded mb-2 text-sm"
        />
      ))}
      <button
        className="text-xs text-blue-600 mt-1"
        onClick={() => setItems((prev) => [...prev, ''])}
      >
        + 추가
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="h-8 bg-[#E6FCB9]" />

      <div className="max-w-5xl mx-auto py-10 px-6 text-sm text-gray-800">
        <h2 className="text-xl font-bold text-center mb-8">해당 정보를 바탕으로 PFO AI가 포트폴리오,이력서를 만들 수 있어요 !</h2>

        {/* 인적사항 */}
        <section className="bg-white border p-6 rounded mb-8 shadow-sm">
  <h3 className="text-lg font-semibold mb-4">인적사항</h3>
  <div className="flex gap-6">
    {/* 사진 업로드 */}
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

    {/* 텍스트 입력란 */}
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
        <label className="block text-xs mb-1">주소</label>
        <div className="flex gap-2">
          <input value={address} onChange={(e) => setAddress(e.target.value)} className="flex-1 border p-2 rounded text-sm" />
          <button
            onClick={handleAddressSearch}
            className="px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
          >
            주소 찾기
          </button>
        </div>
      </div>
    </div>
  </div>
</section>


        {/* 자기소개 */}
        <section className="bg-white border p-6 rounded mb-8 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">자기소개</h3>
          <textarea
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            className="w-full h-28 border p-3 rounded text-sm"
            placeholder="강점, 목표, 관심 분야를 간단하게 작성해주세요"
          />
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
        value={
          period.includes('재학중')
            ? ''
            : period.split('~')[1]?.trim() || ''
        }
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
          {renderEditableList('경력 사항', career, setCareer, '예: 삼성전자 / 백엔드 개발 / 2022~2023')}
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
            {renderEditableList('기술 역량', skills, setSkills, '예: JavaScript, React, Node.js')}
          </div>
          <div className="bg-white border p-6 rounded shadow-sm">
            {renderEditableList('툴/도구', tools, setTools, '예: GitHub, Figma')}
          </div>
        </section>
{/* 프로젝트 */} 
<section className="bg-white border p-6 rounded mb-8 shadow-sm">
  <h3 className="text-lg font-semibold mb-4">프로젝트 경험</h3>

  {projects.map((item, idx) => {
    const [title = '', detail = ''] = item.split('::');

    const updateProject = (newTitle: string, newDetail: string) => {
      const updated = [...projects];
      updated[idx] = `${newTitle}::${newDetail}`;
      setProjects(updated);
    };

    return (
      <div key={idx} className="mb-4 p-4 border rounded bg-gray-50 space-y-2">
        <input
          value={title}
          onChange={(e) => updateProject(e.target.value, detail)}
          placeholder="예: PFO 플랫폼 개발 / 프론트엔드 / Next.js"
          className="w-full border p-2 rounded text-sm"
        />
        <textarea
          value={detail}
          onChange={(e) => updateProject(title, e.target.value)}
          placeholder="상세 설명을 입력하세요. (예: 4인 팀으로 프론트엔드 담당. React와 Tailwind로 개발. 6주간 진행 등)"
          className="w-full border p-2 rounded text-sm"
          rows={3}
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
    onClick={() => setProjects([...projects, '::'])}
    className="text-xs text-blue-600"
  >
    + 프로젝트 추가
  </button>
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
