// src/routes/portfolioRoutes.ts
import { Router } from 'express';
import verifyToken from '../middleware/verifyToken';
import {
  generatePortfolio,
  getPortfolio,
  getMyPortfolios,
  updatePortfolio,
  deletePortfolio,
  regeneratePortfolio
} from '../controllers/PortfolioController';

const portfolioRoutes = Router();

// 포트폴리오 생성
portfolioRoutes.post('/generate', verifyToken, generatePortfolio);

// 포트폴리오 AI 재생성
portfolioRoutes.post('/:portfolioId/regenerate', verifyToken, regeneratePortfolio);

// 내 포트폴리오 목록
portfolioRoutes.get('/my-portfolio', verifyToken, getMyPortfolios);

// 특정 포트폴리오 조회
portfolioRoutes.get('/:portfolioId', verifyToken, getPortfolio);

// 포트폴리오 수정
portfolioRoutes.put('/:portfolioId', verifyToken, updatePortfolio);

// 포트폴리오 삭제
portfolioRoutes.delete('/:portfolioId', verifyToken, deletePortfolio);

export default portfolioRoutes;