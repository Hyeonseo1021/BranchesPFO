import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login'; // login.tsx 파일
import AIPFOPage from './pages/home'; // home.tsx 파일의 export default 이름에 맞춤
import Portfolio from './pages/PortfolioWrite_Page'; // PortfolioWrite_Page.tsx → 이름 바꾸자
import { Home } from 'lucide-react';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/home" element={<AIPFOPage />} />
      </Routes>
    </Router>
  );
}

export default App;
