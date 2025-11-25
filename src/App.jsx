import { BrowserRouter } from "react-router-dom";
import "./styles/index.css";
import Router from "./router/Router.jsx";
import { AuthProvider } from "./contexts/Auth";
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function App() {
  useEffect(() => {
    // 1. Kiểm tra xem trong kho (LocalStorage) đã có vé chưa
    let currentSessionId = localStorage.getItem('guest_session_id');

    // 2. Nếu chưa có (nghĩa là khách mới tinh) -> Tạo vé mới
    if (!currentSessionId) {
      currentSessionId = uuidv4(); // Tạo chuỗi ví dụ: '550e8400-e29b...'
      localStorage.setItem('guest_session_id', currentSessionId);
      console.log("Đã tạo session mới cho Guest:", currentSessionId);
    } else {
      console.log("Chào mừng Guest quay lại, ID của bạn là:", currentSessionId);
    }
    
  }, []);
  return (
    <BrowserRouter>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </BrowserRouter>
  );
}