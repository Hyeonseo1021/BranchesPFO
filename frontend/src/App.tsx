import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login'; // login.tsx 파일
import Portfolio from './pages/PortfolioWrite_Page'; // PortfolioWrite_Page.tsx → 이름 바꾸자

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/portfolio" element={<Portfolio />} />
      </Routes>
    </Router>
  );
}

export default App;
