import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-green-700 text-white py-6 mt-10">
      <div className="text-center mb-2 font-semibold text-lg">Branches PFO</div>
      <div className="text-center text-sm mb-2">
        By. Branches 2.0
      </div>
      <div className="text-center text-sm">
        <a
          href="https://github.com/Hyeonseo1021/BranchesPFO"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-300 transition"
        >
          GitHub 저장소 바로가기 →
        </a>
      </div>
    </footer>
  );
}
