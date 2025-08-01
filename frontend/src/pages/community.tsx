import React from 'react';
import Header from '../pages/Header';
import Footer from '../pages/Footer';
import { useNavigate } from 'react-router-dom';


export default function CommunityPage() {
  const navigate = useNavigate();
  // 예시 게시글
  const posts = [
    {
      id: 1,
      title: '포트폴리오 디자인 이렇게 했어요!',
      summary: 'Figma와 Notion을 활용해 만든 제 포트폴리오입니다.',
      author: '은빈이',
    },
    {
      id: 2,
      title: '면접에서 자주 나오는 질문 Top 5',
      summary: '실제 면접에서 경험했던 질문과 답변 정리!',
      author: '취뽀하자',
    },
    {
      id: 3,
      title: 'AI로 이력서 자동 완성해봤어요',
      summary: 'Branches PFO로 만든 이력서 후기 공유합니다.',
      author: 'AI유저',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">
      <Header />

      <main className="flex-grow max-w-5xl w-full mx-auto px-6 py-12">
        {/* 제목 */}
        <h2 className="text-3xl font-bold text-center mb-12 border-b pb-4">Q&A</h2>

        {/* 탭 메뉴 */}
        <div className="flex justify-center space-x-6 mb-8 text-gray-500 text-sm">
          <span className="hover:text-black cursor-pointer">공지사항</span>
          <span className="hover:text-black cursor-pointer">취업게시판</span>
          <span className="font-semibold border-b-2 border-black text-black">자유게시판</span>
          <span className="hover:text-black cursor-pointer">포트폴리오 게시판</span>
          <span className="hover:text-black cursor-pointer">정보공유 게시판</span>
        </div>

        {/* 게시글 표 */}
        <table className="w-full border-t border-gray-300 text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="py-2 px-3 w-16">No</th>
              <th className="py-2 px-3">제목</th>
              <th className="py-2 px-3 w-32">글쓴이</th>
              <th className="py-2 px-3 w-32">작성일자</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr
                key={post.id}
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/post/${post.id}`)}
              >
                <td className="py-2 px-3">{post.id}</td>
                <td className="py-2 px-3">{post.title}</td>
                <td className="py-2 px-3">{post.author}</td>
                <td className="py-2 px-3">2025-07-31</td> {/* 예시 날짜 */}
              </tr>
            ))}
          </tbody>
        </table>

        {/* 검색창 + 글쓰기 버튼 */}
        <div className="mt-8 flex justify-between items-center">
          <div className="flex border border-gray-300 rounded px-2 py-1 w-1/2">
            <input
              type="text"
              placeholder="Search"
              className="flex-grow px-2 outline-none"
            />
            <button className="text-gray-500">🔍</button>
          </div>

          <button
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            onClick={() => {
              const isLoggedIn = !!localStorage.getItem('token');
              if (!isLoggedIn) {
                alert('로그인이 필요합니다.');
                navigate('/login');
              } else {
                navigate('/write');
              }
            }}
          >
            글쓰기
          </button>

        </div>
      </main>

      <Footer />
    </div>
  );
}