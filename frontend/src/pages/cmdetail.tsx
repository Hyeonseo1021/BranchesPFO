import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useNavigate, useParams } from 'react-router-dom';

interface Post {
  _id: string;
  title: string;
  content: string;
  author?: { name: string; id: string };
  createdAt: string;
}

interface Comment {
  _id: string;
  author?: { name: string; id: string };
  content: string;
  createdAt: string;
}

export default function CmDetail() {
  const navigate = useNavigate();
  const { id } = useParams(); // URL에서 게시글 ID
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  // 📌 게시글 가져오기 (쿠키 포함)
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/community/posts/${id}`, {
          credentials: 'include', // ✅ 쿠키 인증 포함
        });
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        const data = await res.json();
        setPost(data);
      } catch (err) {
        console.error('게시글 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // 📌 댓글 가져오기 (쿠키 포함)
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/community/posts/${id}/comments`, {
          credentials: 'include', // ✅ 쿠키 인증 포함
        });
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []); // ✅ 안전하게 배열만 저장
      } catch (err) {
        console.error('댓글 불러오기 실패:', err);
      }
    };
    if (id) fetchComments();
  }, [id]);

  // 📌 댓글 작성 (쿠키 인증 포함)
  const handleAddComment = async () => {
    if (newComment.trim() === '') return;

    try {
      const res = await fetch(`http://localhost:5000/api/community/posts/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
        credentials: 'include', // ✅ 쿠키 인증 포함
      });

      if (res.status === 401) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      if (!res.ok) throw new Error(`댓글 작성 실패: ${res.status}`);

      const data = await res.json();
      setComments((prev) => [...prev, data]); // 새 댓글 추가
      setNewComment('');
    } catch (err) {
      console.error('댓글 작성 실패:', err);
    }
  };

  if (loading) return <p className="text-center mt-20">게시글 불러오는 중...</p>;
  if (!post) return <p className="text-center mt-20">게시글을 찾을 수 없습니다.</p>;

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">
      <Header />

      <main className="flex-grow max-w-4xl w-full mx-auto px-6 py-12">
        {/* 제목 */}
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">{post.title}</h2>

        {/* 작성자 + 날짜 */}
        <div className="flex justify-between text-sm text-gray-500 mb-6">
          <span>글쓴이: {post.author?.name || '익명'}</span>
          <span>작성일자: {new Date(post.createdAt).toLocaleDateString()}</span>
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
              comments.map((comment) => (
                <li key={comment._id} className="border-b pb-2">
                  <p className="text-sm text-gray-700">{comment.content}</p>
                  <p className="text-xs text-gray-400">
                    작성자: {comment.author?.name || '익명'} |{' '}
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))
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
