// src/api/axios.ts

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:7000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,  // ✅ 쿠키 자동 전송
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ 요청 인터셉터 (토큰 헤더 설정 제거)
axiosInstance.interceptors.request.use(
  (config) => {
    
    return config;
  },
  (error) => {
    console.error('❌ 요청 인터셉터 에러:', error);
    return Promise.reject(error);
  }
);

// ✅ 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ 응답 성공:', response.status, response.config.url);
    return response;
  },
  (error) => {
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error('❌ 인증 실패!');
      alert('로그인이 필요하거나 세션이 만료되었습니다.');
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;