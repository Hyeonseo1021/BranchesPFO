import React, { useEffect, useState } from 'react';
import Header from '../pages/Header';
import Footer from '../pages/Footer';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

interface Post {
  _id: string;
  title: string;
  content: string;
  author: { name: string; id: string };
  createdAt: string;
}

export default function CommunityPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('========== 게시글 목록 조회 ==========');
        
        // ✅ axiosInstance 사용 (withCredentials 자동 적용)
        const res = await axiosInstance.get('/community/posts');
        
        console.log('✅ 게시글 응답:', res.data);
        
        // ✅ res.data로 접근
        setPosts(Array.isArray(res.data) ? res.data : []);
      } catch (err: any) {
        console.error('❌ 게시글 불러오기 실패:', err);
        console.error('에러 상세:', err.response?.data);
        
        // 에러가 발생해도 빈 배열로 설정 (UI는 정상 표시)
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  // 📌 글쓰기 버튼 클릭 (로그인 확인)
  const handleWriteClick = async () => {
    try {
      console.log('========== 로그인 상태 확인 ==========');
      
      await axiosInstance.get('/auth/me');
      
      console.log('✅ 로그인 확인 성공');
      
      // 로그인 되어 있으면 글쓰기 페이지로 이동
      navigate('/write');
    } catch (error: any) {
      console.error('❌ 로그인 상태 확인 실패:', error);
      console.error('에러 상세:', error.response?.data);
      
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  };

  if (loading) return <p className="text-center mt-20">불러오는 중...</p>;

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">
      <Header />

      <main className="flex-grow max-w-5xl w-full mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-12 border-b pb-4">Q&A</h2>

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
            {posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-400">
                  게시글이 없습니다.
                </td>
              </tr>
            ) : (
              posts.map((post, index) => (
                <tr
                  key={post._id}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/post/${post._id}`)} // 상세보기 페이지로 이동
                >
                  <td className="py-2 px-3">{index + 1}</td>
                  <td className="py-2 px-3">{post.title}</td>
                  <td className="py-2 px-3">{post.author?.name || "익명"}</td>
                  <td className="py-2 px-3">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
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
            onClick={handleWriteClick}
          >
          글쓰기
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
