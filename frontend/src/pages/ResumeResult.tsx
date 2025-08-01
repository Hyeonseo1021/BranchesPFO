// pages/ResumeResult.tsx
import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function ResumeResult() {
  const [template, setTemplate] = useState<'default' | 'modern'>('default');

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
        <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-[2px_2px_2px_rgba(0,0,0,0.5)] mb-4 animate-fade-in-down">
          분석 완료! 이력서가 완성됐어요 🎉
        </h2>
        <p
          className="text-white text-lg drop-shadow-[1px_1px_1px_rgba(0,0,0,0.4)] animate-fade-in-down"
          style={{ animationDelay: '0.3s' }}
        >
          지금 FPO AI가 생성한 이력서를 확인해보세요
        </p>
      </section>
{/* FPO AI 메시지 */}
<div className="text-center text-sm text-gray-700 italic mt-20 mb-12 animate-fade-in-down">
  FPO AI가 <span className="font-semibold text-green-700">홍길동</span> 님의 입력 정보를 바탕으로,
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

      {/* 이력서와 자기소개서 나란히 */}
      <div className="flex justify-center flex-wrap gap-6 my-10 px-4">
        {/* 이력서 */}
        <main className="w-[210mm] h-[297mm] bg-white shadow-lg p-6 border border-black text-[13px] leading-normal">
          <div className="flex flex-col gap-4 h-full">
            <div className="flex">
              <div className="w-[140px] border border-black flex flex-col items-center justify-center text-center p-2">
                <div className="w-[100px] h-[130px] border border-black mb-2 flex items-center justify-center text-[12px]">사진</div>
                <p className="text-[11px] text-red-500">응시직종 입력</p>
              </div>
              <div className="flex-1 border border-black border-l-0 px-4 py-3 text-[12px] flex flex-col justify-center gap-1">
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  <div className="flex min-w-[120px]"><span className="font-bold mr-1">성명:</span><span>[한글]</span></div>
                  <div className="flex min-w-[120px]"><span className="font-bold mr-1">성별:</span><span>남</span></div>
                  <div className="flex min-w-[160px]"><span className="font-bold mr-1">생년월일:</span><span>1995.03.01</span></div>
                  <div className="flex flex-1"><span className="font-bold mr-1">주소:</span><span>서울특별시 강남구 역삼동</span></div>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  <div className="flex min-w-[180px]"><span className="font-bold mr-1">연락처:</span><span>010-0000-0000</span></div>
                  <div className="flex min-w-[180px]"><span className="font-bold mr-1">휴대폰:</span><span>010-1234-5678</span></div>
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
                    <tr className="h-[45px]">
                      <td className="border border-black p-2">2011.03</td>
                      <td className="border border-black p-2">2014.02</td>
                      <td className="border border-black p-2">서울고등학교</td>
                      <td className="border border-black p-2">서울</td>
                      <td className="border border-black p-2">-</td>
                    </tr>
                    <tr className="h-[45px]">
                      <td className="border border-black p-2">2014.03</td>
                      <td className="border border-black p-2">2018.02</td>
                      <td className="border border-black p-2">순천대학교</td>
                      <td className="border border-black p-2">전남</td>
                      <td className="border border-black p-2">3.9/4.5</td>
                    </tr>
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
                    <tr className="h-[45px]">
                      <td className="border border-black p-2">카카오</td>
                      <td className="border border-black p-2">2024.01 ~ 2024.06</td>
                      <td className="border border-black p-2">인턴</td>
                      <td className="border border-black p-2">FE팀</td>
                      <td className="border border-black p-2">인턴 종료</td>
                    </tr>
                    <tr className="h-[45px]">
                      <td className="border border-black p-2">&nbsp;</td>
                      <td className="border border-black p-2">&nbsp;</td>
                      <td className="border border-black p-2">&nbsp;</td>
                      <td className="border border-black p-2">&nbsp;</td>
                      <td className="border border-black p-2">&nbsp;</td>
                    </tr>
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
                    <tr className="h-[45px]">
                      <td className="border border-black p-2">2023</td>
                      <td className="border border-black p-2">정보처리기사</td>
                      <td className="border border-black p-2">한국산업인력공단</td>
                    </tr>
                    <tr className="h-[45px]">
                      <td className="border border-black p-2">&nbsp;</td>
                      <td className="border border-black p-2">&nbsp;</td>
                      <td className="border border-black p-2">&nbsp;</td>
                      
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 어학능력 */}
              <div>
                <h4 className="font-bold border-b border-black">어학능력</h4>
                <table className="w-full border border-black text-left text-[12px]">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-black p-2">구분</th>
                      <th className="border border-black p-2">시험명</th>
                      <th className="border border-black p-2">점수</th>
                      <th className="border border-black p-2">취득연도</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="h-[45px]">
                      <td className="border border-black p-2">영어</td>
                      <td className="border border-black p-2">TOEIC</td>
                      <td className="border border-black p-2">900</td>
                      <td className="border border-black p-2">2023</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 가족사항 */}
              <div>
                <h4 className="font-bold border-b border-black">가족사항</h4>
                <table className="w-full border border-black text-left text-[12px]">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-black p-2">관계</th>
                      <th className="border border-black p-2">성명</th>
                      <th className="border border-black p-2">나이</th>
                      <th className="border border-black p-2">학력</th>
                      <th className="border border-black p-2">직업</th>
                      <th className="border border-black p-2">휴대폰</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="h-[45px]">
                      <td className="border border-black p-2">부</td>
                      <td className="border border-black p-2">홍아버지</td>
                      <td className="border border-black p-2">60</td>
                      <td className="border border-black p-2">대졸</td>
                      <td className="border border-black p-2">회사원</td>
                      <td className="border border-black p-2">010-1111-1111</td>
                    </tr>
                    <tr className="h-[45px]">
                      <td className="border border-black p-2">모</td>
                      <td className="border border-black p-2">홍어머니</td>
                      <td className="border border-black p-2">58</td>
                      <td className="border border-black p-2">대졸</td>
                      <td className="border border-black p-2">주부</td>
                      <td className="border border-black p-2">010-2222-2222</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>

        {/* 자기소개서 */}
      <main className="w-[210mm] h-[297mm] bg-white border border-black shadow-lg p-6 text-[13px] leading-normal">
  <h3 className="text-base font-bold mb-2">☐ 자기 소개서</h3>

  {/* 주요경력 / 업무강점 등 */}
  <div className="border-t border-black h-[90mm]">
    <div className="flex h-full">
      <div className="w-[25%] bg-gray-100 border-r border-black p-2 font-bold">주요경력 /<br />업무강점 등</div>
      <div className="w-[75%] p-4 whitespace-pre-wrap">
        안녕하세요. 저는 프론트엔드 개발자로서 사용자 경험과 디자인에 관심이 많습니다. 다양한 팀 프로젝트를 통해 React, TypeScript, Tailwind 등을 활용한 UI 구현 경험이 있으며, 사용자 친화적인 인터페이스에 집중해 왔습니다.
      </div>
    </div>
  </div>

  {/* 성장과정 */}
  <div className="border-t border-black h-[60mm]">
    <div className="flex h-full">
      <div className="w-[25%] bg-gray-100 border-r border-black p-2 font-bold">성장과정</div>
      <div className="w-[75%] p-4 whitespace-pre-wrap">
        어릴 때부터 문제 해결과 논리적 사고에 흥미가 많았고, 대학에서는 컴퓨터공학을 전공하며 프로그래밍에 대한 기초를 다졌습니다. 다양한 동아리와 교내외 활동을 통해 소통과 협업의 중요성을 배우며 성장해왔습니다.
      </div>
    </div>
  </div>

  {/* 성격의 장단점 */}
  <div className="border-t border-black h-[60mm]">
    <div className="flex h-full">
      <div className="w-[25%] bg-gray-100 border-r border-black p-2 font-bold">성격의 장, 단점</div>
      <div className="w-[75%] p-4 whitespace-pre-wrap">
        꼼꼼하고 책임감 있는 성격으로 맡은 일은 끝까지 해내는 스타일입니다. 다만 가끔 완벽주의적인 성향으로 인해 시간 관리에 어려움을 겪는 경우가 있어 이를 보완하기 위해 우선순위 설정에 집중하고 있습니다.
      </div>
    </div>
  </div>

  {/* 지원동기 및 입사포부 */}
  <div className="border-t border-black border-b h-[60mm]">
    <div className="flex h-full">
      <div className="w-[25%] bg-gray-100 border-r border-black p-2 font-bold">지원동기 및<br />입사 포부</div>
      <div className="w-[75%] p-4 whitespace-pre-wrap">
        귀사의 서비스와 가치에 공감하여 지원하게 되었습니다. 특히 사용자 중심의 인터페이스 설계와 지속적인 기술 혁신에 매력을 느꼈습니다. 입사 후에는 팀원들과 협업하며 서비스의 품질을 높이는 데 기여하고 싶습니다.
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
