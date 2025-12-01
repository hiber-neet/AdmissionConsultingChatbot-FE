// src/services/liveChat.ts
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/live_chat/livechat";

// Học sinh join hàng chờ
export const joinQueue = async (customerId: number) => {
  const token = localStorage.getItem("access_token") || "";

  const res = await axios.post(
    `${BASE_URL}/live-chat/join_queue`,
    null, // không có body, dùng query param
    {
      params: {
        customer_id: customerId,
        official_id: 6, // tạm fix 1 tư vấn viên
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// Lấy trạng thái hàng chờ của 1 học sinh
export const getQueueStatus = async (customerId: number) => {
  const token = localStorage.getItem("access_token") || "";

  const res = await axios.get(
    `${BASE_URL}/customer/queue/status/${customerId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// Gửi tin nhắn trong 1 session (REST, nếu bạn có endpoint riêng)
// Nếu BE của bạn dùng WebSocket để gửi thì có thể không dùng hàm này.
export const sendSessionMessage = async (
  sessionId: number,
  payload: { sender: string; content: string }
) => {
  const token = localStorage.getItem("access_token") || "";

  const res = await axios.post(
    `${BASE_URL}/session/${sessionId}/messages`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// Lấy lịch sử tin nhắn của 1 session
export const getSessionMessages = async (sessionId: number) => {
  const token = localStorage.getItem("access_token") || "";

  const res = await axios.get(
    `${BASE_URL}/session/${sessionId}/messages`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// Kết thúc session live chat
export const endSession = async (sessionId: number, endedBy: number) => {
  const token = localStorage.getItem("access_token") || "";

  const res = await axios.post(
    `${BASE_URL}/live-chat/end`,
    null,
    {
      params: {
        session_id: sessionId,
        ended_by: endedBy,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
