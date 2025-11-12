import React, { useEffect, useRef, useState } from "react";
import ChatGuestHeader from "../../components/chatbotguest/ChatGuestHeader.jsx";
const CHATBOT_PREFILL_KEY = "chatbot_prefill_message";

export default function ChatGuestPage() {
  const [messages, setMessages] = useState([]); // {sender: "user"|"bot", text: string}[]
  const [input, setInput] = useState("");
  const [wsReady, setWsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [partial, setPartial] = useState("");
  const partialRef = useRef("");
  const wsRef = useRef(null);
  const listRef = useRef(null);

  // Auto-scroll xuống cuối mỗi khi có tin nhắn mới
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, partial]);

  // Kết nối WS khi mount
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/chat/ws/chat");
    wsRef.current = ws;

    ws.onopen = () => setWsReady(true);

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.event === "chunk") {
          setPartial((prev) => {
            const next = prev + data.content;
            partialRef.current = next;
            return next;
          });
        } else if (data.event === "done") {
          const final =
            partialRef.current && partialRef.current.trim() !== ""
              ? partialRef.current
              : "(không có phản hồi)";
          setMessages((prev) => [...prev, { sender: "bot", text: final }]);
          setPartial("");
          partialRef.current = "";
          setIsLoading(false);
        }
      } catch {
        /* ignore */
      }
    };

    ws.onclose = () => setWsReady(false);
    return () => ws.close();
  }, []);

 
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHATBOT_PREFILL_KEY);
      if (!raw) return;
      localStorage.removeItem(CHATBOT_PREFILL_KEY);
      const { text } = JSON.parse(raw) || {};
      if (text) {
 
        setMessages([{ sender: "user", text }]);
        setIsLoading(true);
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ message: text }));
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  const send = (text) => {
    if (!text.trim()) return;
    const userMsg = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setPartial("");
    partialRef.current = "";
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ message: text }));
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

      {/* Khung chat ở giữa */}
      <main className="mx-auto max-w-3xl px-4">
        <div
          ref={listRef}
          className="min-h-[60vh] pt-6 pb-40 overflow-y-auto"
        >
          {messages.length === 0 && (
            <div className="mt-16 text-center text-gray-400">
              Hỏi bất kỳ điều gì… ✨
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`mb-4 flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm ${
                  m.sender === "user"
                    ? "bg-[#10a37f] text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                {m.text}
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

      {/* Thanh nhập cố định dưới cùng, ở giữa màn hình */}
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
