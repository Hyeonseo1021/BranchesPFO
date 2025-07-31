import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

export default function CmDetail() {
    const navigate = useNavigate();

    const [comments, setComments] = useState([
        { id: 1, author: '취준생1', content: '정말 유용하네요!' },
        { id: 2, author: '디자이너2', content: 'Figma 예시 더 보고 싶어요.' },
    ]);

    const [newComment, setNewComment] = useState('');

    const handleAddComment = () => {
        if (newComment.trim() === '') return;
        const newItem = {
            id: comments.length + 1,
            author: '익명', // 임시 작성자
            content: newComment,
        };
        setComments([...comments, newItem]);
        setNewComment('');
    };

    return (
        <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">
            <Header />

            <main className="flex-grow max-w-4xl w-full mx-auto px-6 py-12">
                {/* 게시글 제목 */}
                <h2 className="text-2xl font-bold mb-4 border-b pb-2">포트폴리오 디자인 이렇게 했어요!</h2>

                {/* 작성자 정보 */}
                <div className="flex justify-between text-sm text-gray-500 mb-6">
                    <span>글쓴이: 은빈이</span>
                    <span>작성일자: 2025-07-31</span>
                </div>

                {/* 본문 내용 */}
                <div className="text-base text-gray-700 leading-relaxed mb-10">
                    Figma와 Notion을 활용해 만든 제 포트폴리오입니다. 사용성 중심으로 디자인했어요.
                    <br />
                    혹시 피드백 주실 분 계시면 댓글 주세요!
                </div>

                {/* 댓글 리스트 */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">댓글</h3>
                    <ul className="space-y-3">
                        {comments.map((comment) => (
                            <li key={comment.id} className="border-b pb-2">
                                <p className="text-sm text-gray-700">{comment.content}</p>
                                <p className="text-xs text-gray-400">작성자: {comment.author}</p>
                            </li>
                        ))}
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
                <div className="text-right mt-6">  {/* ← 여기 margin-top 추가함 */}
                    <button
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={() => navigate(-1)} // 이전 페이지로
                    >
                        목록으로
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
}
