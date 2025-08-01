import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function MyPage() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const [name, setName] = useState('홍길동');
  const [birth, setBirth] = useState('2003년 12월 17일');
  const [address, setAddress] = useState('전남 순천시 별량길 50 2층');
  const [phone, setPhone] = useState('010-0000-0000');
  const [intro, setIntro] = useState('센스있고 적응력 좋은 인재입니다.');
  const [education, setEducation] = useState<string[]>([]);
  const [career, setCareer] = useState<string[]>([]);
  const [certificates, setCertificates] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [tools, setTools] = useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [photo, setPhoto] = useState('');

  useEffect(() => {
    setName(localStorage.getItem('mypage_name') || '홍길동');
    setBirth(localStorage.getItem('mypage_birth') || '2003년 12월 17일');
    setAddress(localStorage.getItem('mypage_address') || '전남 순천시 별량길 50 2층');
    setPhone(localStorage.getItem('mypage_phone') || '010-0000-0000');
    setIntro(localStorage.getItem('mypage_intro') || '센스있고 적응력 좋은 인재입니다.');
    setEducation(JSON.parse(localStorage.getItem('mypage_education') || '[]'));
    setCareer(JSON.parse(localStorage.getItem('mypage_careers') || '[]'));
    setCertificates(JSON.parse(localStorage.getItem('mypage_certificates') || '[]'));
    setSkills(JSON.parse(localStorage.getItem('mypage_skills') || '[]'));
    setTools(JSON.parse(localStorage.getItem('mypage_tools') || '[]'));
    setProjects(JSON.parse(localStorage.getItem('mypage_projects') || '[]'));
    setPhoto(localStorage.getItem('mypage_photo') || '');
  }, []);

  if (!isLoggedIn) {
    alert('로그인이 필요합니다.');
    window.location.href = '/login';
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="h-8 bg-[#E6FCB9]" />

      <div className="max-w-7xl mx-auto flex p-10 space-x-6 text-sm text-gray-800">
        {/* 사이드바 */}
        <aside className="w-60 border-r pr-6">
          <h3 className="font-bold text-base mb-4">내 활동</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:underline">📝 내가 쓴 글 보기</a>
            </li>
            <li>
              <a href="#" className="hover:underline">💬 내가 작성한 댓글</a>
            </li>
          </ul>

          <h3 className="font-bold text-base mt-6 mb-4">PFO 결과물 보기</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:underline">📄 이력서 보기</a>
            </li>
            <li>
              <a href="#" className="hover:underline">📁 포트폴리오 보기</a>
            </li>
          </ul>
        </aside>

        {/* 본문 영역 */}
        <main className="flex-1 space-y-8">
          {/* 상단 인적사항 */}
          <div className="flex border p-4 rounded">
            <img src={photo || "/user-avatar.png"} alt="프로필" className="w-32 h-40 border mr-6 object-cover" />
            <div className="flex-1 grid grid-cols-2 gap-x-10 gap-y-2">
              <div><strong>이름</strong><p>{name}</p></div>
              <div><strong>생년월일</strong><p>{birth}</p></div>
              <div><strong>연락처</strong><p>{phone}</p></div>
              <div><strong>주소</strong><p>{address}</p></div>
            </div>
          </div>

          {/* 자기소개 */}
          <div>
            <h3 className="font-bold border-b pb-1 mb-2 text-base">자기소개</h3>
            <p className="bg-gray-50 border p-4 rounded leading-relaxed whitespace-pre-wrap">{intro}</p>
          </div>

          {/* 학력 */}
          <div>
            <h3 className="font-bold border-b pb-1 mb-2 text-base">학력</h3>
            <div className="bg-white border p-4 rounded space-y-1">
              {education.length > 0 ? education.map((edu, idx) => <p key={idx}>{edu}</p>) : <p>작성된 학력이 없습니다.</p>}
            </div>
          </div>

          {/* 경력 */}
          <div>
            <h3 className="font-bold border-b pb-1 mb-2 text-base">경력</h3>
            <div className="bg-white border p-4 rounded space-y-1">
              {career.length > 0 ? career.map((c, idx) => <p key={idx}>{c}</p>) : <p>신입</p>}
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

          {/* 프로젝트 경험 */}
          <div>
            <h3 className="font-bold border-b pb-1 mb-2 text-base">프로젝트 경험</h3>
            <div className="bg-white border p-4 rounded space-y-4">
              {projects.length > 0 ? (
                projects.map((p, i) => {
                  const [title, detail] = p.split('::');
                  return (
                    <div key={i} className="space-y-1">
                      <p className="font-semibold text-sm">{title}</p>
                      {detail && (
                        <p className="text-gray-700 whitespace-pre-wrap text-sm">{detail}</p>
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
              onClick={() => navigate('/portfolio')}
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
