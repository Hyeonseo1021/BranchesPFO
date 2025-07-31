import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login'; // login.tsx 파일
import AIPFOPage from './pages/home'; // home.tsx 파일의 export default 이름에 맞춤
import Portfolio from './pages/PortfolioWrite_Page';// PortfolioWrite_Page.tsx → 이름 바꾸자
import Register from './pages/Register'; 
import MainPage from './pages/main';
import CommunityPage from './pages/community';
import WritePage from './pages/write';
import { Home } from 'lucide-react';
import CmDetail from './pages/cmdetail';

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/login" element={<Login />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/home" element={<AIPFOPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/write" element={<WritePage />} />
        <Route path="/post/:id" element={<CmDetail />} />

      </Routes>
    </Router>
  );
}

export default App;
