import React, { useEffect, useRef, useState } from "react";
import ChatGuestHeader from "../../components/chatbotguest/ChatGuestHeader.jsx";
import { API_CONFIG } from "../../config/api.js";
import ReactMarkdown from "react-markdown";
const CHATBOT_PREFILL_KEY = "chatbot_prefill_message";
const GUEST_ID_KEY = "guest_user_id_v1";
const GUEST_SESSION_KEY = "guest_session_id_v1";


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function generateNumericId() {
  const max = 2_000_000_000;
  return Math.floor(Math.random() * max);
}



export default function ChatGuestPage() {
  const [messages, setMessages] = useState([]);  
  const [input, setInput] = useState("");
  const [wsReady, setWsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [partial, setPartial] = useState("");
  const [prefillMessage, setPrefillMessage] = useState(null);  

  const partialRef = useRef("");
  const wsRef = useRef(null);
  const listRef = useRef(null);

    const prefillSentRef = useRef(false);   
  // Tạo guestId + sessionId cố định cho guest (lưu vào localStorage)
const [guestId] = useState(() => {
  let stored = localStorage.getItem(GUEST_ID_KEY);


  let numeric;
  if (stored && !Number.isNaN(Number(stored))) {
    numeric = Number(stored);
  } else {
    numeric = generateNumericId();
    localStorage.setItem(GUEST_ID_KEY, String(numeric));
  }
  return numeric;
});

const [sessionId] = useState(() => {
  let stored = localStorage.getItem(GUEST_SESSION_KEY);

  let numeric;
  if (stored && !Number.isNaN(Number(stored))) {
    numeric = Number(stored);
  } else {
    numeric = generateNumericId();
    localStorage.setItem(GUEST_SESSION_KEY, String(numeric));
  }
  return numeric;
});
  // Auto-scroll xuống cuối mỗi khi có tin nhắn mới
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, partial]);

  // Kết nối WS khi mount
useEffect(() => {
  // Tự đổi http -> ws, https -> wss
  const wsUrl = API_BASE_URL.replace(/^http/, "ws") + "/chat/ws/chat";
  console.log("Guest WS URL:", wsUrl);

  const ws = new WebSocket(wsUrl);
  wsRef.current = ws;

  ws.onopen = () => {
    console.log("Guest WS connected");
    setWsReady(true);
    ws.send(
      JSON.stringify({

        session_id: sessionId,
      })
    );
  };

    ws.onmessage = (e) => {
      console.log("📩 WS message:", e.data);
      try {
        const data = JSON.parse(e.data);

        switch (data.event) {
          case "session_created":
            console.log("🆕 Session created for guest:", data);
            break;

          case "chunk":
            setPartial((prev) => {
              const next = prev + data.content;
              partialRef.current = next;
              return next;
            });
            break;
case "go":
case "done": {
  const finalText = (partialRef.current || "").trim();
  if (finalText) {
    const botMsg = { sender: "bot", text: finalText };
    setMessages((prev) => [...prev, botMsg]);
  }

  partialRef.current = "";
  setPartial("");             
  setIsLoading(false);
  break;
}

          case "error":
            console.error("⚠️ WS error:", data.message);
            setIsLoading(false);
            break;

          default:
            // Một số log hệ thống khác không theo format event/chunk/done
            console.warn("⚠️ Unknown WS event:", data);
        }
      } catch {
        // ignore log không phải JSON
      }
    };

    ws.onclose = () => {
      console.log("🔒 WS closed");
      setWsReady(false);
    };

    return () => ws.close();
  }, [guestId, sessionId]);

  // Lấy dữ liệu từ localStorage (có thể là JSON RIASEC hoặc legacy { text })
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHATBOT_PREFILL_KEY);
      if (!raw) return;

      localStorage.removeItem(CHATBOT_PREFILL_KEY);

      let initial = "";
      try {
        const parsed = JSON.parse(raw);

        // legacy: { text: "..." }
        if (parsed && typeof parsed === "object" && "text" in parsed) {
          initial = parsed.text;
          console.log("Prefill TEXT cho chatbot:", parsed.text);
        }
        // RIASEC JSON: { student_id, answers: {R,I,A,S,E,C} }
        else if (
          parsed &&
          typeof parsed === "object" &&
          "student_id" in parsed &&
          "answers" in parsed
        ) {
          initial = JSON.stringify(parsed);
          console.log("Prefill RIASEC JSON cho chatbot:", parsed);
        } else {
          // fallback: stringify
          initial = JSON.stringify(parsed);
        }
      } catch {
        // không parse được => dùng raw
        initial = raw;
      }

      if (!initial) return;

      // Hiển thị như 1 tin nhắn user
      setMessages([{ sender: "user", text: initial }]);
      setPrefillMessage(initial);
      setIsLoading(true);
    } catch {
      /* ignore */
    }
  }, []);


  useEffect(() => {
  if (!wsReady || !prefillMessage) return;
  if (wsRef.current?.readyState !== WebSocket.OPEN) return;
  if (prefillSentRef.current) return;

  wsRef.current.send(
    JSON.stringify({
      message: prefillMessage,
      session_id: sessionId,
    })
  );

  prefillSentRef.current = true; 
  setPrefillMessage(null);
}, [wsReady, prefillMessage, guestId, sessionId]);

  const send = (text) => {
    if (!text.trim()) return;

    const userMsg = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setPartial("");
    partialRef.current = "";

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          message: text,
          session_id: sessionId,
        })
      );
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!wsReady) return;
    send(input);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <ChatGuestHeader />

      {/* Khung chat */}
      <main className="mx-auto max-w-3xl px-4">
        <div ref={listRef} className="min-h-[60vh] pt-6 pb-40 overflow-y-auto">
          {messages.length === 0 && (
            <div className="mt-16 text-center text-gray-400">
              Hỏi bất kỳ điều gì… ✨
            </div>
          )}

       {messages.map((m, i) => (
  <div key={i} className={`mb-4 flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
    <div
      className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm ${
        m.sender === "user"
          ? "bg-[#10a37f] text-white"
          : "bg-white text-gray-800"
      }`}
    >
      {m.sender === "bot" ? (
        <ReactMarkdown>{m.text}</ReactMarkdown>
      ) : (
        m.text
      )}
    </div>
  </div>
))}

          {isLoading && (
            <div className="mb-4 flex justify-start">
              <div className="max-w-[85%] rounded-2xl bg-white px-4 py-3 text-[15px] text-gray-800 shadow-sm">
                {partial}
                <span className="ml-1 animate-pulse">▌</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Thanh nhập */}
      <form
        onSubmit={onSubmit}
        className="fixed bottom-0 left-0 right-0 z-20 border-t bg-[#f7f7f8]"
      >
        <div className="mx-auto max-w-3xl px-4 py-4">
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="flex items-end gap-3 p-3">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={wsReady ? "Hỏi bất kỳ điều gì…" : "Đang kết nối…"}
                className="max-h-40 flex-1 resize-none border-none p-2 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!wsReady || !input.trim()}
                className={`rounded-xl px-4 py-2 text-white ${
                  !wsReady || !input.trim()
                    ? "cursor-not-allowed bg-gray-300"
                    : "bg-[#10a37f] hover:opacity-90"
                }`}
              >
                Gửi
              </button>
            </div>
          </div>
          <div className="mt-2 text-center text-xs text-gray-400">
            Chatbot có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
          </div>
        </div>
      </form>
    </div>
  );
}
