import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

export default function WritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`제목: ${title}\n내용: ${content}`);
    // 이후 백엔드에 전송 또는 로컬 상태 저장 로직 추가 가능
    navigate('/community'); // 글 작성 후 커뮤니티로 이동
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <Header />

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">게시글 작성</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="제목을 입력하세요"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border px-4 py-2 rounded h-60 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="내용을 입력하세요"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              등록하기
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
