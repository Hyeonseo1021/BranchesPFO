// src/pages/MyActivity.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import axiosInstance from '../api/axios';

interface Post {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  views: number;
  likes: string[];
}

interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  post: {
    _id: string;
    title: string;
  };
}

export default function MyActivity() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // ✅ URL에서 tab 파라미터 읽기 (기본값: 'posts')
  const activeTab = (searchParams.get('tab') as 'posts' | 'comments') || 'posts';
  
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [myComments, setMyComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ 탭 변경 함수
  const handleTabChange = (tab: 'posts' | 'comments') => {
    setSearchParams({ tab });
  };

  // 내가 쓴 글 불러오기
  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/community/my-posts');
      setMyPosts(response.data.posts || []);
    } catch (error) {
      console.error('내 게시글 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 내가 쓴 댓글 불러오기
  const fetchMyComments = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/community/my-comments');
      setMyComments(response.data.comments || []);
    } catch (error) {
      console.error('내 댓글 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'posts') {
      fetchMyPosts();
    } else {
      fetchMyComments();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">내 활동</h1>

        {/* 탭 버튼 */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-2 flex gap-2">
          <button
            onClick={() => handleTabChange('posts')}
            className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all ${
              activeTab === 'posts'
                ? 'bg-green-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📝 내가 쓴 글 ({myPosts.length})
          </button>
          <button
            onClick={() => handleTabChange('comments')}
            className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all ${
              activeTab === 'comments'
                ? 'bg-green-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            💬 내가 작성한 댓글 ({myComments.length})
          </button>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">불러오는 중...</p>
            </div>
          ) : (
            <>
              {/* 내가 쓴 글 목록 */}
              {activeTab === 'posts' && (
                <div className="space-y-4">
                  {myPosts.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <p className="text-lg">작성한 글이 없습니다.</p>
                      <button
                        onClick={() => navigate('/community')}
                        className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
                      >
                        게시글 작성하러 가기
                      </button>
                    </div>
                  ) : (
                    myPosts.map((post) => (
                      <div
                        key={post._id}
                        onClick={() => navigate(`/community/posts/${post._id}`)}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>👁️ {post.views}</span>
                          <span>❤️ {post.likes.length}</span>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 내가 쓴 댓글 목록 */}
              {activeTab === 'comments' && (
                <div className="space-y-4">
                  {myComments.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <p className="text-lg">작성한 댓글이 없습니다.</p>
                      <button
                        onClick={() => navigate('/community')}
                        className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
                      >
                        댓글 작성하러 가기
                      </button>
                    </div>
                  ) : (
                    myComments.map((comment) => (
                      <div
                        key={comment._id}
                        onClick={() => navigate(`/community/posts/${comment.post._id}`)}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-gray-500 text-sm">📌 게시글:</span>
                          <span className="font-semibold text-gray-700">
                            {comment.post.title}
                          </span>
                        </div>
                        <p className="text-gray-800 mb-3 pl-6">
                          {comment.content}
                        </p>
                        <div className="text-sm text-gray-500 pl-6">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}