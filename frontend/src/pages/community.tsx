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
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">커뮤니티</h2>
          <button
  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
  onClick={() => navigate('/write')}
>
  글쓰기
</button>
        </div>

        <div className="grid gap-6">
          {posts.map((post) => (
            <div key={post.id} className="border rounded-lg p-5 hover:shadow-md transition">
              <h3 className="text-lg font-semibold mb-1">{post.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{post.summary}</p>
              <p className="text-xs text-gray-400">작성자: {post.author}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
