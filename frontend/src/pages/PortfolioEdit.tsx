import React, { useState, useRef } from 'react';
import Header from '../pages/Header';
import Footer from '../pages/Footer';
import { useNavigate } from 'react-router-dom';

export default function PortfolioEdit() {
      const navigate = useNavigate();
  const [title, setTitle] = useState('👋 안녕하세요!');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [currentPage, setCurrentPage] = useState(1);
const [titlePos, setTitlePos] = useState({ x: 50, y: 50 });
const [history, setHistory] = useState<any[]>([]);
const [redoStack, setRedoStack] = useState<any[]>([]);

const saveHistory = () => {
  setHistory((prev) => [
    ...prev,
    { title, introList, imageList, bgColor, currentPage },
  ]);
  setRedoStack([]); // 새 기록 시 redo 초기화
};

// 🔹 Undo
const handleUndo = () => {
  if (history.length === 0) return;
  const prevState = history[history.length - 1];
  setRedoStack((r) => [
    ...r,
    { title, introList, imageList, bgColor, currentPage },
  ]);
  setTitle(prevState.title);
  setIntroList(prevState.introList);
  setImageList(prevState.imageList);
  setBgColor(prevState.bgColor);
  setCurrentPage(prevState.currentPage);
  setHistory((h) => h.slice(0, -1));
};

// 🔹 Redo
const handleRedo = () => {
  if (redoStack.length === 0) return;
  const nextState = redoStack[redoStack.length - 1];
  setHistory((h) => [
    ...h,
    { title, introList, imageList, bgColor, currentPage },
  ]);
  setTitle(nextState.title);
  setIntroList(nextState.introList);
  setImageList(nextState.imageList);
  setBgColor(nextState.bgColor);
  setCurrentPage(nextState.currentPage);
  setRedoStack((r) => r.slice(0, -1));
};

// 🔹 초기화
const handleReset = () => {
  saveHistory(); // 초기화 전 상태 저장
  setTitle('👋 안녕하세요!');
  setTitlePos({ x: 50, y: 50 }); // ✅ 제목 위치도 초기화
  setIntroList([
    {
      id: 1,
      text: '저는 사용자 경험과 UI/UX에 집중하는 프론트엔드 개발자입니다.',
      x: 50,
      y: 150,
    },
  ]);
  setImageList([]);
  setBgColor('#ffffff');
  setCurrentPage(1);
};
// ✅ 소개문구 여러 개 관리
  

  const [introList, setIntroList] = useState([
    { id: 1, text: '저는 사용자 경험과 UI/UX에 집중하는 프론트엔드 개발자입니다.', x: 50, y: 150 },
  ]);

  // ✅ 이미지 여러 개 관리
  const [imageList, setImageList] = useState<
    { id: number; src: string; x: number; y: number; size: number }[]
  >([]);

  const [dragging, setDragging] = useState<string | null>(null);
  const offset = useRef({ x: 0, y: 0 });

  // 🔹 드래그 시작
  const handleMouseDown = (
    e: React.MouseEvent,
    target: string,
    pos: { x: number; y: number }
  ) => {
    setDragging(target);
    offset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
  };

  // 🔹 드래그 이동
const handleMouseMove = (e: React.MouseEvent) => {
  if (!dragging) return;
  const [type, idStr] = dragging.split('-');
  const id = parseInt(idStr);
  const newPos = {
    x: e.clientX - offset.current.x,
    y: e.clientY - offset.current.y,
  };

  if (type === 'title') {
    setTitlePos(newPos);
  } else if (type === 'intro') {
    setIntroList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...newPos } : item))
    );
  } else if (type === 'image') {
    setImageList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...newPos } : item))
    );
  }
};

  const handleMouseUp = () => setDragging(null);

  // ✅ 소개문구 추가
  const addIntro = () => {
    const newId = introList.length ? introList[introList.length - 1].id + 1 : 1;
    setIntroList([
      ...introList,
      { id: newId, text: '새로운 소개문구', x: 100, y: 200 + newId * 30 },
    ]);
  };

  // ✅ 소개문구 삭제
  const deleteIntro = (id: number) => {
    setIntroList(introList.filter((item) => item.id !== id));
  };

  // ✅ 이미지 추가
  const addImage = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const newId = imageList.length ? imageList[imageList.length - 1].id + 1 : 1;
      setImageList([
        ...imageList,
        { id: newId, src: reader.result as string, x: 100, y: 300 + newId * 40, size: 200 },
      ]);
    };
    reader.readAsDataURL(file);
  };

  // ✅ 이미지 삭제
  const deleteImage = (id: number) => {
    setImageList(imageList.filter((img) => img.id !== id));
  };

  // ✅ 이미지 크기 변경
  const changeImageSize = (id: number, newSize: number) => {
    setImageList((prev) =>
      prev.map((img) => (img.id === id ? { ...img, size: newSize } : img))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 font-sans">
      <Header />

      {/* ✅ 배너 */}
      <section
        className="relative text-center py-28 px-4 bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/PFbanner.png')",
          backgroundSize: 'cover',
          minHeight: '300px',
        }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-[2px_2px_2px_rgba(0,0,0,0.5)] mb-4 animate-fade-in-down">
          포트폴리오 수정하기 ✏️
        </h2>
        <p
          className="text-white text-lg drop-shadow-[1px_1px_1px_rgba(0,0,0,0.4)] animate-fade-in-down"
          style={{ animationDelay: '0.3s' }}
        >
          여러 페이지의 포트폴리오를 자유롭게 수정하고 구성해보세요!
        </p>
      </section>

{/* 🔹 배너 아래 조작 버튼 */}
<div className="max-w-7xl mx-auto mt-6 mb-4 flex justify-center gap-4">
  <button
    onClick={handleReset}
    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded shadow"
  >
    🔄 초기화
  </button>
  <button
    onClick={handleUndo}
    disabled={history.length === 0}
    className={`px-4 py-2 rounded shadow ${
      history.length === 0
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : 'bg-white hover:bg-gray-100 text-gray-800'
    }`}
  >
    ⬅ 되돌리기
  </button>
  <button
    onClick={handleRedo}
    disabled={redoStack.length === 0}
    className={`px-4 py-2 rounded shadow ${
      redoStack.length === 0
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : 'bg-white hover:bg-gray-100 text-gray-800'
    }`}
  >
    앞으로 ➡
  </button>
</div>

      {/* ✅ 본문 (왼쪽: 미리보기 / 오른쪽: 수정폼) */}
      <main
        className="max-w-7xl mx-auto py-10 px-6 flex gap-10"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* 🎨 왼쪽 미리보기 */}
        <div className="flex-1 relative">
          <div
            className="p-6 rounded shadow border relative"
            style={{
              backgroundColor: bgColor,
              height: '600px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* 제목 */}
    <h3
  className="absolute cursor-move text-2xl font-bold"
  onMouseDown={(e) => handleMouseDown(e, 'title-0', titlePos)}
  style={{ transform: `translate(${titlePos.x}px, ${titlePos.y}px)` }}
>
  {title}
</h3>

            {/* 소개문구 여러 개 */}
            {introList.map((item) => (
              <div
                key={item.id}
                className="absolute cursor-move bg-white/60 p-2 rounded"
                onMouseDown={(e) => handleMouseDown(e, `intro-${item.id}`, item)}
                style={{ transform: `translate(${item.x}px, ${item.y}px)` }}
              >
                <p className="text-gray-800 leading-relaxed w-[300px]">{item.text}</p>
              </div>
            ))}

            {/* 이미지 여러 개 */}
            {imageList.map((img) => (
              <div
                key={img.id}
                className="absolute cursor-move"
                onMouseDown={(e) => handleMouseDown(e, `image-${img.id}`, img)}
                style={{
                  transform: `translate(${img.x}px, ${img.y}px)`,
                  width: img.size,
                }}
              >
                <img
                  src={img.src}
                  alt="preview"
                  className="rounded shadow w-full h-auto select-none pointer-events-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ✏️ 오른쪽 수정창 */}
        <div className="flex-1 space-y-6 bg-white p-6 rounded shadow border border-gray-200 overflow-y-auto max-h-[600px]">
          {/* 제목 */}
          <div>
            <label className="font-semibold block mb-2">제목</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>

          {/* 소개문구 편집 */}
          <div>
            <label className="font-semibold block mb-2 flex justify-between items-center">
              <span>소개 문구</span>
              <button
                onClick={addIntro}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm"
              >
                + 추가
              </button>
            </label>

            {introList.map((item) => (
              <div key={item.id} className="mb-3 border rounded p-2">
                <textarea
                  value={item.text}
                  onChange={(e) =>
                    setIntroList((prev) =>
                      prev.map((intro) =>
                        intro.id === item.id ? { ...intro, text: e.target.value } : intro
                      )
                    )
                  }
                  className="w-full border border-gray-300 rounded p-2 mb-2"
                  rows={2}
                />
                <button
                  onClick={() => deleteIntro(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>

          {/* 배경 색상 */}
          <div>
            <label className="font-semibold block mb-2">배경 색상</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-16 h-10 cursor-pointer border rounded"
            />
          </div>

          {/* 이미지 추가 */}
          <div>
            <label className="font-semibold block mb-2 flex justify-between items-center">
              <span>이미지 관리</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) addImage(file);
                }}
              />
            </label>

            {imageList.map((img) => (
              <div key={img.id} className="mb-3 border rounded p-2">
                <img src={img.src} alt="" className="w-32 rounded mb-2" />
                <label className="block text-sm mb-1">크기 조절</label>
                <input
                  type="range"
                  min={100}
                  max={400}
                  value={img.size}
                  onChange={(e) => changeImageSize(img.id, Number(e.target.value))}
                  className="w-full mb-2"
                />
                <button
                  onClick={() => deleteImage(img.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ✅ 하단 버튼 */}
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 pb-10 mt-4">
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="bg-gray-300 hover:bg-gray-400 text-sm px-4 py-2 rounded"
          >
            ◀ 이전
          </button>
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            className="bg-gray-300 hover:bg-gray-400 text-sm px-4 py-2 rounded"
          >
            다음 ▶
          </button>
          <span className="ml-2 text-sm text-gray-700">페이지 {currentPage}</span>
        </div>

        <div className="flex gap-4">
        <button
          onClick={() => navigate('/portfolio-result')} // ← 페이지 이동
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
        >
          취소
        </button>
          <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            저장하기
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
