import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // ✅ 추가
import Login from './pages/login';
import AIPFOPage from './pages/AIPFOPage';
import Profile from './pages/ProfilePage';
import Register from './pages/Register'; 
import MainPage from './pages/main';
import CommunityPage from './pages/community';
import WritePage from './pages/write';
import CmDetail from './pages/cmdetail';
import AIChatbot from './pages/AIChatbot';
import Mypage from './pages/Mypage';
import ResumeResult from './pages/ResumeResult';
import ResumeEdit from './pages/ResumeEdit';
import PortfolioResult from './pages/PortfolioResult';
import JobRecommendPage from './pages/JobRecommendPage'; 
import PortfolioEdit from './pages/PortfolioEdit'; 
import Unauthorized from './pages/Unauthorized';
import MyResumeList from './pages/MyResumeList';
import MyPortfolioList from './pages/MyPortfolioList';
import MyActivity from './pages/MyActivity';

function App() {
  return (
    <AuthProvider> 
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/main" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/aipfopage" element={<AIPFOPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/write" element={<WritePage />} />
          <Route path="/post/:id" element={<CmDetail />} />
          <Route path="/my-activity" element={<MyActivity />} />
          <Route path="/aichatbot" element={<AIChatbot />} />
          <Route path="/Mypage" element={<Mypage />} />
          <Route path="/mypage/resumes" element={<MyResumeList />} />
          <Route path="/mypage/portfolios" element={<MyPortfolioList />} />
          <Route path="/resume/result/:resumeId" element={<ResumeResult />} />
          <Route path="/resume/edit/:resumeId" element={<ResumeEdit />} />
          <Route path="/portfolio/result/:portfolioId" element={<PortfolioResult />} />
          <Route path="/portfolio/edit/:portfolioId" element={<PortfolioEdit />} />
          <Route path="/portfolio-result" element={<PortfolioResult />} />
          <Route path="/jobrecommend" element={<JobRecommendPage />} /> 
          <Route path="/portfolioedit" element={<PortfolioEdit />} /> 
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;