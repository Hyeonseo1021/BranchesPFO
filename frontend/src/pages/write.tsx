import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';

export default function WritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`제목: ${title}\n내용: ${content}`);
    navigate('/community');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-green-50 text-gray-800 font-sans">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
        {/* 상단 인트로 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-green-700 font-semibold text-xl mb-2">
            <Pencil className="w-6 h-6" />
            글쓰기 공간
          </div>
          <p className="text-gray-600 text-sm">커뮤니티에 공유하고 싶은 내용을 자유롭게 작성해주세요</p>
        </div>

        {/* 카드 형태의 작성 폼 */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg p-8 space-y-6 border border-gray-200"
        >
          <div>
            <label className="block mb-2 font-semibold text-gray-700">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="제목을 입력하세요"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border px-4 py-2 rounded-md h-60 resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="내용을 입력하세요"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-all"
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
