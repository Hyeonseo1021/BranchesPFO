// pages/ResumeEdit.tsx
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

export default function ResumeEdit() {
  const { resumeId } = useParams<{ resumeId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>({
    personal: { name: '', birth: '', phone: '', email: '', address: '' },
    education: [],
    experience: [],
    certificates: [],
    skills: [],
    tools: [],
    projects: [],
    coverLetter: { strengths: '', growth: '', personality: '', motivation: '' }
  });

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await axiosInstance.get(`/resume/${resumeId}`);
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
        
        setResumeData(formattedData);
      } catch (error) {
        console.error('이력서 조회 실패:', error);
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

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosInstance.put(`/resume/${resumeId}`, resumeData);
      alert('수정사항이 저장되었습니다! 🎉');
      navigate(`/resume/${resumeId}`);
    } catch (error) {
      console.error('이력서 수정 실패:', error);
      alert('수정사항 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  // 개인정보 변경
  const updatePersonal = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personal: { ...prev.personal!, [field]: value }
    }));
  };

  // 학력 추가
  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...(prev.education || []), { school: '', major: '', degree: '', period: '', schoolType: '' }]
    }));
  };

  // 학력 수정
  const updateEducation = (index: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education?.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  // 학력 삭제
  const removeEducation = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education?.filter((_, i) => i !== index)
    }));
  };

  // 경력 추가
  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...(prev.experience || []), { company: '', position: '', period: '', description: '' }]
    }));
  };

  // 경력 수정
  const updateExperience = (index: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience?.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  // 경력 삭제
  const removeExperience = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience?.filter((_, i) => i !== index)
    }));
  };

  // 자격증 추가
  const addCertificate = () => {
    setResumeData(prev => ({
      ...prev,
      certificates: [...(prev.certificates || []), { name: '', issuedBy: '', date: '' }]
    }));
  };

  // 자격증 수정
  const updateCertificate = (index: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      certificates: prev.certificates?.map((cert, i) => 
        i === index ? { ...cert, [field]: value } : cert
      )
    }));
  };

  // 자격증 삭제
  const removeCertificate = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      certificates: prev.certificates?.filter((_, i) => i !== index)
    }));
  };

  // 스킬 추가
  const addSkill = () => {
    const skill = prompt('추가할 기술을 입력하세요:');
    if (skill) {
      setResumeData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), skill]
      }));
    }
  };

  // 스킬 삭제
  const removeSkill = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills?.filter((_, i) => i !== index)
    }));
  };

  // 툴 추가
  const addTool = () => {
    const tool = prompt('추가할 도구를 입력하세요:');
    if (tool) {
      setResumeData(prev => ({
        ...prev,
        tools: [...(prev.tools || []), tool]
      }));
    }
  };

  // 툴 삭제
  const removeTool = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      tools: prev.tools?.filter((_, i) => i !== index)
    }));
  };

  // 프로젝트 추가
  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...(prev.projects || []), { 
        title: '', 
        description: '', 
        role: '', 
        techStack: [], 
        period: '', 
        link: '' 
      }]
    }));
  };

  // 프로젝트 수정
  const updateProject = (index: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects?.map((proj, i) => 
        i === index ? { ...proj, [field]: value } : proj
      )
    }));
  };

  // 프로젝트 삭제
  const removeProject = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects?.filter((_, i) => i !== index)
    }));
  };

  // 자기소개서 수정
  const updateCoverLetter = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      coverLetter: { ...prev.coverLetter!, [field]: value }
    }));
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-100">
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-8">이력서 수정하기 ✏️</h1>

        {/* 개인정보 */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">개인정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">이름</label>
              <input
                type="text"
                value={resumeData.personal?.name}
                onChange={(e) => updatePersonal('name', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">생년월일</label>
              <input
                type="text"
                value={resumeData.personal?.birth}
                onChange={(e) => updatePersonal('birth', e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="YYYY-MM-DD"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">전화번호</label>
              <input
                type="text"
                value={resumeData.personal?.phone}
                onChange={(e) => updatePersonal('phone', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">이메일</label>
              <input
                type="email"
                value={resumeData.personal?.email}
                onChange={(e) => updatePersonal('email', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">주소</label>
              <input
                type="text"
                value={resumeData.personal?.address}
                onChange={(e) => updatePersonal('address', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </section>

        {/* 학력사항 */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-xl font-bold">학력사항</h2>
            <button
              onClick={addEducation}
              className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700"
            >
              + 추가
            </button>
          </div>
          {resumeData.education?.map((edu, index) => (
            <div key={index} className="border rounded p-4 mb-4">
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => removeEducation(index)}
                  className="text-red-600 text-sm hover:underline"
                >
                  삭제
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">구분</label>
                  <input
                    type="text"
                    value={edu.schoolType}
                    onChange={(e) => updateEducation(index, 'schoolType', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="예: 대학교"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">학교명</label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => updateEducation(index, 'school', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">전공</label>
                  <input
                    type="text"
                    value={edu.major}
                    onChange={(e) => updateEducation(index, 'major', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">학위</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="예: 학사"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1">기간</label>
                  <input
                    type="text"
                    value={edu.period}
                    onChange={(e) => updateEducation(index, 'period', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="예: 2020.03 ~ 2024.02"
                  />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* 경력사항 */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-xl font-bold">경력사항</h2>
            <button
              onClick={addExperience}
              className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700"
            >
              + 추가
            </button>
          </div>
          {resumeData.experience?.map((exp, index) => (
            <div key={index} className="border rounded p-4 mb-4">
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => removeExperience(index)}
                  className="text-red-600 text-sm hover:underline"
                >
                  삭제
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">회사명</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">직위</label>
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => updateExperience(index, 'position', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1">근무기간</label>
                  <input
                    type="text"
                    value={exp.period}
                    onChange={(e) => updateExperience(index, 'period', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="예: 2021.03 ~ 2023.12"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1">업무 설명</label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* 자격증 */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-xl font-bold">자격증</h2>
            <button
              onClick={addCertificate}
              className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700"
            >
              + 추가
            </button>
          </div>
          {resumeData.certificates?.map((cert, index) => (
            <div key={index} className="border rounded p-4 mb-4">
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => removeCertificate(index)}
                  className="text-red-600 text-sm hover:underline"
                >
                  삭제
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">자격증명</label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => updateCertificate(index, 'name', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">발급기관</label>
                  <input
                    type="text"
                    value={cert.issuedBy}
                    onChange={(e) => updateCertificate(index, 'issuedBy', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">취득일</label>
                  <input
                    type="text"
                    value={cert.date}
                    onChange={(e) => updateCertificate(index, 'date', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="YYYY-MM-DD"
                  />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* 기술 스택 & 도구 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* 기술 스택 */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-xl font-bold">기술 역량</h2>
              <button
                onClick={addSkill}
                className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700"
              >
                + 추가
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="bg-green-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </section>

          {/* 도구 */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-xl font-bold">도구</h2>
              <button
                onClick={addTool}
                className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700"
              >
                + 추가
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {resumeData.tools?.map((tool, index) => (
                <span
                  key={index}
                  className="bg-blue-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {tool}
                  <button
                    onClick={() => removeTool(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* 프로젝트 */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-xl font-bold">프로젝트 경험</h2>
            <button
              onClick={addProject}
              className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700"
            >
              + 추가
            </button>
          </div>
          {resumeData.projects?.map((project, index) => (
            <div key={index} className="border rounded p-4 mb-4">
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => removeProject(index)}
                  className="text-red-600 text-sm hover:underline"
                >
                  삭제
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">프로젝트명</label>
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => updateProject(index, 'title', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">역할</label>
                  <input
                    type="text"
                    value={project.role}
                    onChange={(e) => updateProject(index, 'role', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">기간</label>
                  <input
                    type="text"
                    value={project.period}
                    onChange={(e) => updateProject(index, 'period', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="예: 2023.01 ~ 2023.06"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">설명</label>
                  <textarea
                    value={project.description}
                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">링크</label>
                  <input
                    type="text"
                    value={project.link}
                    onChange={(e) => updateProject(index, 'link', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="https://"
                  />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* 자기소개서 */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">자기소개서</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">주요경력 및 업무강점</label>
              <textarea
                value={resumeData.coverLetter?.strengths}
                onChange={(e) => updateCoverLetter('strengths', e.target.value)}
                className="w-full border rounded px-3 py-2"
                rows={5}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">성장과정</label>
              <textarea
                value={resumeData.coverLetter?.growth}
                onChange={(e) => updateCoverLetter('growth', e.target.value)}
                className="w-full border rounded px-3 py-2"
                rows={5}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">성격의 장단점</label>
              <textarea
                value={resumeData.coverLetter?.personality}
                onChange={(e) => updateCoverLetter('personality', e.target.value)}
                className="w-full border rounded px-3 py-2"
                rows={5}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">지원동기 및 입사포부</label>
              <textarea
                value={resumeData.coverLetter?.motivation}
                onChange={(e) => updateCoverLetter('motivation', e.target.value)}
                className="w-full border rounded px-3 py-2"
                rows={5}
              />
            </div>
          </div>
        </section>

        {/* 버튼 영역 */}
        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={() => navigate(`/resume/result/${resumeId}`)}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-all"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-all disabled:opacity-50"
          >
            {saving ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}