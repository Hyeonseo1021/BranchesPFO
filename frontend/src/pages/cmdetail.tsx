import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import axiosInstance from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';

interface Post {
  _id: string;
  title: string;
  content: string;
  author?: { nickname: string; id: string; _id?: string };
  createdAt: string;
}

interface Comment {
  _id: string;
  author?: { nickname: string; id: string; _id?: string };
  content: string;
  createdAt: string;
}

export default function CmDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axiosInstance.get('/auth/me');
        // ✅ user._id 또는 _id로 접근
        const userId = res.data.user?._id || res.data._id || res.data.id;
        console.log('현재 사용자 ID:', userId);
        console.log('전체 응답:', res.data);
        setCurrentUserId(userId);
      } catch (err) {
        console.error('사용자 정보 가져오기 실패:', err);
        // 로그인하지 않은 경우 null로 유지
      }
    };
    fetchCurrentUser();
  }, []);

  // 게시글 가져오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axiosInstance.get(`community/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error('게시글 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // 댓글 가져오기
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axiosInstance.get(`/community/posts/${id}/comments`);
        setComments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('댓글 불러오기 실패:', err);
      }
    };
    if (id) fetchComments();
  }, [id]);

  // 게시글 삭제
  const handleDeletePost = async () => {
    if (!window.confirm('게시글을 삭제하시겠습니까?')) return;

    try {
      await axiosInstance.delete(`/community/posts/${id}`);
      alert('게시글이 삭제되었습니다.');
      navigate('/community');
    } catch (err: any) {
      console.error('게시글 삭제 실패:', err);
      if (err.response?.status === 401) {
        alert('로그인이 필요합니다.');
        navigate('/login');
      } else if (err.response?.status === 404) {
        alert('게시글을 찾을 수 없거나 삭제할 권한이 없습니다.');
      } else {
        alert(err.response?.data?.message || '게시글 삭제에 실패했습니다.');
      }
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      await axiosInstance.delete(`/community/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      alert('댓글이 삭제되었습니다.');
    } catch (err: any) {
      console.error('댓글 삭제 실패:', err);
      if (err.response?.status === 401) {
        alert('로그인이 필요합니다.');
        navigate('/login');
      } else if (err.response?.status === 404) {
        alert('댓글을 찾을 수 없거나 삭제할 권한이 없습니다.');
      } else {
        alert(err.response?.data?.message || '댓글 삭제에 실패했습니다.');
      }
    }
  };

  // 댓글 작성
  const handleAddComment = async () => {
    if (newComment.trim() === '') {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      console.log('========== 댓글 작성 ==========');
      console.log('게시글 ID:', id);
      console.log('댓글 내용:', newComment);
      
      const res = await axiosInstance.post(`/community/posts/${id}/comments`, {
        content: newComment
      });
      
      console.log('✅ 댓글 작성 성공:', res.data);
      
      setComments((prev) => [...prev, res.data]);
      setNewComment('');
      
      alert('댓글이 작성되었습니다.');
    } catch (err: any) {
      console.error('❌ 댓글 작성 실패:', err);
      console.error('에러 상세:', err.response?.data);
      
      if (err.response?.status === 401) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }
      
      if (err.response?.status === 403) {
        alert('댓글 작성 권한이 없습니다.');
        return;
      }
      
      if (err.response?.status === 404) {
        alert('게시글을 찾을 수 없습니다.');
        return;
      }
      
      alert(err.response?.data?.message || '댓글 작성에 실패했습니다.');
    }
  };

  if (loading) return <p className="text-center mt-20">게시글 불러오는 중...</p>;
  if (!post) return <p className="text-center mt-20">게시글을 찾을 수 없습니다.</p>;

  // 현재 사용자가 게시글 작성자인지 확인 (_id 또는 id로 비교)
  const postAuthorId = post.author?._id || post.author?.id;
  const isPostAuthor = currentUserId && postAuthorId && (postAuthorId === currentUserId);
  
  console.log('게시글 작성자 확인:', {
    currentUserId,
    postAuthorId,
    isPostAuthor,
    postAuthor: post.author
  });

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">
      <Header />

      <main className="flex-grow max-w-4xl w-full mx-auto px-6 py-12">
        {/* 제목 */}
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">{post.title}</h2>

        {/* 작성자 + 날짜 */}
        <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
          <div>
            <span>글쓴이: {post.author?.nickname || '익명'}</span>
            <span className="ml-4">작성일자: {new Date(post.createdAt).toLocaleDateString()}</span>
          </div>

          {/* 삭제 버튼 - 작성자만 표시 */}
          {isPostAuthor && (
            <button
              onClick={handleDeletePost}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
            >
              삭제
            </button>
          )}
        </div>

        {/* 본문 */}
        <div className="text-base text-gray-700 leading-relaxed mb-10">{post.content}</div>

        {/* 댓글 리스트 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">댓글</h3>
          <ul className="space-y-3">
            {comments.length === 0 ? (
              <p className="text-sm text-gray-400">아직 댓글이 없습니다.</p>
            ) : (
              comments.map((comment) => {
                // 현재 사용자가 댓글 작성자인지 확인 (_id 또는 id로 비교)
                const commentAuthorId = comment.author?._id || comment.author?.id;
                const isCommentAuthor = currentUserId && commentAuthorId && (commentAuthorId === currentUserId);

                return (
                  <li key={comment._id} className="border-b pb-2">
                    <div className="flex justify-between items-start">
                      {/* 댓글 내용 */}
                      <p className="text-sm text-gray-700">{comment.content}</p>

                      {/* 삭제 버튼 - 작성자만 표시 */}
                      {isCommentAuthor && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs ml-2"
                        >
                          삭제
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-gray-400 mt-1">
                      작성자: {comment.author?.nickname || '익명'} |{' '}
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {/* 댓글 입력창 */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="댓글을 입력하세요"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-grow border border-gray-300 rounded px-4 py-2 outline-none"
          />
          <button
            onClick={handleAddComment}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            등록
          </button>
        </div>

        {/* 뒤로가기 버튼 */}
        <div className="text-right mt-6">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => navigate(-1)}
          >
            목록으로
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}