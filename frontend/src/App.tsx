import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login'; // login.tsx 파일
import AIPFOPage from './pages/home'; // home.tsx 파일의 export default 이름에 맞춤
import Portfolio from './pages/PortfolioWrite_Page';// PortfolioWrite_Page.tsx → 이름 바꾸자
import Register from './pages/Register'; 
import MainPage from './pages/main';
import CommunityPage from './pages/community';
import WritePage from './pages/write';
import { Home } from 'lucide-react';
import CmDetail from './pages/cmdetail';
import AIChatbot from './pages/AIChatbot';
import Mypage from './pages/Mypage';
import ResumeResult from './pages/ResumeResult';
import PortfolioResult from './pages/PortfolioResult';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/main" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/home" element={<AIPFOPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/write" element={<WritePage />} />
        <Route path="/post/:id" element={<CmDetail />} />
        <Route path="/aihelp" element={<AIChatbot />} />
        <Route path="/Mypage" element={<Mypage />} />
        <Route path="/resume-result" element={<ResumeResult />} />
        <Route path="/portfolio-result" element={<PortfolioResult />} />

      </Routes>
    </Router>
  );
}

export default App;
