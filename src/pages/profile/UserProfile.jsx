// src/pages/private/UserProfile.jsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import banner from "@/assets/images/login-private.jpg";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/Auth";
import {
  joinQueue,
  getQueueStatus,
  endSession,
  getSessionMessages,
} from "@/services/liveChat";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const authHeaders = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const SidebarItem = ({ active, icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
      active ? "bg-[#FFF3ED] text-[#EB5A0D]" : "hover:bg-gray-50 text-gray-600"
    }`}
  >
    <span className="text-base">{icon}</span>
    <span>{label}</span>
  </button>
);

const GENDERS = [
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
  { value: "other", label: "Khác" },
];

const GRADES = ["10", "11", "12", "Đã tốt nghiệp"];

const newConv = () => ({
  id: crypto.randomUUID(),
  title: "Cuộc trò chuyện mới",
  messages: [],
  rating: null,           
  createdAt: Date.now(),
  updatedAt: Date.now(),
});


const CHAT_RATING_KEY = "fpt_chatbot_session_ratings_v1";
const CHATBOT_PREFILL_KEY = "chatbot_prefill_message";


const loadRatings = () => {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CHAT_RATING_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const loadStoredConvs = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CHAT_CONV_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch (e) {
    console.warn("Cannot parse stored conversations", e);
    return null;
  }
};

const UserProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const [tab, setTab] = useState("profile");
  const location = useLocation();
  const [editing, setEditing] = useState(false);
  const [prefillSent, setPrefillSent] = useState(false);
const [sessionRatings, setSessionRatings] = useState(() => loadRatings());

// đọc query param ?tab=...
useEffect(() => {
  const params = new URLSearchParams(location.search);
  const qpTab = params.get("tab");
  if (qpTab && ["profile", "chatbot", "consultant", "transcript"].includes(qpTab)) {
    setTab(qpTab);
  }
}, [location.search]);

useEffect(() => {
  try {
    localStorage.setItem(CHAT_RATING_KEY, JSON.stringify(sessionRatings));
  } catch (e) {
    console.warn("Không thể lưu rating vào localStorage", e);
  }
}, [sessionRatings]);


  // ====== HỌC BẠ ======
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState([]);

  const ACCEPTED = ["application/pdf", "image/jpeg", "image/png"];
  const MAX_MB = 10;

  const onPickFiles = (e) => {
    const picked = Array.from(e.target.files || []);
    const valid = [];
    const errors = [];

    picked.forEach((file) => {
      if (!ACCEPTED.includes(file.type)) {
        errors.push(`File ${file.name} định dạng không hỗ trợ (PDF/JPG/PNG).`);
        return;
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        errors.push(`File ${file.name}: vượt quá ${MAX_MB}MB.`);
        return;
      }
      valid.push(file);
    });

    if (errors.length) alert(errors.join("\n"));
    if (valid.length) setFiles((prev) => [...prev, ...valid]);
    e.target.value = "";
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadTranscript = async () => {
    if (!files.length) {
      alert("Vui lòng chọn tối thiểu 1 file.");
      return;
    }
    try {
      setUploading(true);
      const results = files.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
        preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : null,
      }));
      setUploaded((prev) => [...prev, ...results]);
      setFiles([]);
      alert("Tải lên học bạ thành công!");
    } catch (e) {
      console.error(e);
      alert("Tải lên thất bại, thử lại sau.");
    } finally {
      setUploading(false);
    }
  };

// --- helper: build payload from scores state ---
const buildAcademicPayload = () => {
  const subjects = [...subjectsLeft, ...subjectsRight];
  const entries = subjects.map((subject) => {
    const s = scores[subject] || {};
    // normalize empty -> null so backend can ignore empty
    return {
      subject,
      grade_11: s["11"] ? String(s["11"]) : null,
      grade_12: s["12"] ? String(s["12"]) : null,
    };
  }).filter(e => e.grade_11 !== null || e.grade_12 !== null); // keep only filled subjects

  return {
    // adjust field names if backend expects different ones
    customer_id: user.id,
    entries, // array of { subject, grade_11, grade_12 }
  };
};

// --- Save academic scores ---
 // --- Save academic scores ---
const saveAcademicScores = async (e) => {
  e?.preventDefault?.();

  const payload = {};

  Object.entries(SUBJECT_API_FIELDS).forEach(([label, apiField]) => {
    const s = scores[label] || {};
    const vRaw = s["12"]; // chỉ dùng Học kỳ 2

    if (vRaw !== undefined && vRaw !== "") {
      const n = parseFloat(vRaw);
      if (!Number.isNaN(n)) {
        payload[apiField] = n;
      }
    }
  });

  const filledSubjects = Object.keys(payload).length;
  if (filledSubjects < 6) {
    alert("Cần nhập tối thiểu 06 môn.");
    return;
  }

  setUploading(true);

  try {
    const res = await axios.post(
      `${API_BASE_URL}/academic-score/upload`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
      }
    );

    console.log("Uploaded OK:", res.data);
    alert("Lưu học bạ thành công!");
  } catch (err) {
    console.error("Upload error:", err);
    console.error("Server message:", err?.response?.data);
    alert("Lưu thất bại, vui lòng kiểm tra lại.");
  } finally {
    setUploading(false);
  }
};


// call once when tab/transcript visible or when user changes
useEffect(() => {
    if (!user) return;

    const fetchScores = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/academic-score/users/${user.id}/academic-scores`,
          { headers: authHeaders() }
        );

        const data = res.data;
        if (!data) return;

        // Map từ object BE
        const next = {};
Object.entries(SUBJECT_API_FIELDS).forEach(([label, apiField]) => {
  const v = data[apiField];
  if (v !== null && v !== undefined) {
    next[label] = {
      "12": v.toString(),  
    };
  }
});

setScores(next);

        setScores(next);
      } catch (err) {
        const status = err?.response?.status;

        if (status === 404 || status === 500) {
          console.log(
            "Không load được học bạ (chưa có hoặc BE trả lỗi).",
            status,
            err?.response?.data
          );
          return;
        }

        console.error("fetch academic scores", err);
      }
    };

    fetchScores();
  }, [user]);

  useEffect(() => {
    return () => {
      uploaded.forEach((u) => u.preview && URL.revokeObjectURL(u.preview));
    };
  }, [uploaded]);

// mỗi conv = 1 ChatSession trong DB
// { id: session_id, title, createdAt, updatedAt, last_message_preview }
const [convs, setConvs] = useState([]);
const [activeId, setActiveId] = useState(null);
const activeConv = convs.find((c) => c.id === activeId) || null;
// message đang hiển thị của session active
const [messages, setMessages] = useState([]);


  const liveWsRef = useRef(null);
  const convsRef = useRef(convs);
  useEffect(() => {
    convsRef.current = convs;
  }, [convs]);



  const [chatSessionId, setChatSessionId] = useState(null);
  const chatSessionIdRef = useRef(null);

useEffect(() => {
  chatSessionIdRef.current = chatSessionId;
}, [chatSessionId]);

// CHATBOT – quản lý list phiên
useEffect(() => {
  if (tab !== "chatbot" || !user) return;

  const fetchSessions = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/chat/user/${user.id}/sessions`,
        { headers: authHeaders() }
      );
      const sessions = res.data?.sessions || [];

      setConvs((prev) => {
        const prevMap = new Map(prev.map((c) => [c.id, c]));
        return sessions.map((s) => {
          const old = prevMap.get(s.session_id);
          return {
            id: s.session_id,
title:
  old?.title ||
  s.last_message_preview ||   // dùng preview làm title
  "Cuộc trò chuyện",
            createdAt: s.start_time ? new Date(s.start_time).getTime() : Date.now(),
            updatedAt: s.last_message_time
              ? new Date(s.last_message_time).getTime()
              : (s.start_time ? new Date(s.start_time).getTime() : Date.now()),
            last_message_preview: s.last_message_preview || "",
          };
        });
      });

      if (sessions.length) {
        // nếu chưa có session đang chọn thì chọn cái mới nhất
        setActiveId((current) => current ?? sessions[0].session_id);
        setChatSessionId((current) => current ?? sessions[0].session_id);
      } else {
        // chưa có session nào -> tạo mới
        try {
          const resCreate = await axios.post(
            `${API_BASE_URL}/chat/session/create`,
            null,
            {
              params: { user_id: user.id, session_type: "chatbot" },
              headers: authHeaders(),
            }
          );
          const newId = resCreate.data.session_id;
          const newConv = {
            id: newId,
            title: "Cuộc trò chuyện mới",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            last_message_preview: "",
          };
          setConvs([newConv]);
          setActiveId(newId);
          setChatSessionId(newId);
        } catch (e) {
          console.error("Không tạo được session mặc định", e);
        }
      }
    } catch (err) {
      console.error("Lỗi load danh sách session", err);
    }
  };

  fetchSessions();
}, [tab, user]);



  const [liveStatus, setLiveStatus] = useState("idle");
  const [queueInfo, setQueueInfo] = useState(null);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [liveMessages, setLiveMessages] = useState([]);
  const [liveInput, setLiveInput] = useState("");
  const customerEventSourceRef = useRef(null);
  useEffect(() => {
    chatSessionIdRef.current = chatSessionId;
  }, [chatSessionId]);

  // WebSocket live chat với tư vấn viên
 useEffect(() => {
  if (liveStatus !== "chatting" || !sessionInfo?.session_id || !user) {
    if (liveWsRef.current && liveWsRef.current.readyState === WebSocket.OPEN) {
      liveWsRef.current.close();
    }
    liveWsRef.current = null;
    return;
  }

  // close existing WS if any (prevent duplicates)
  if (liveWsRef.current && liveWsRef.current.readyState === WebSocket.OPEN) {
    try { liveWsRef.current.close(); } catch (e) { console.warn(e); }
    liveWsRef.current = null;
  }

  const wsUrl = API_BASE_URL.replace(/^http/, "ws") +
    `/live_chat/livechat/chat/${sessionInfo.session_id}`;

  const ws = new WebSocket(wsUrl);
  liveWsRef.current = ws;

    ws.onopen = () => {
      console.log("Live chat WS connected");
    };

   ws.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);

    // server broadcast payload (see LiveChatService.broadcast_message):
    // { event: "message", session_id, sender_id, message, timestamp }

    // ensure we only handle 'message' events here (server may send other events)
    if (data.event === "message") {
      // Build the message object for UI
      const msg = {
        sender: data.sender_id === user.id ? "customer" : "official",
        content: data.message,
        // server sends ISO timestamp in `timestamp`
        created_at: data.timestamp ?? new Date().toISOString(),
      };

      // Append the message (do NOT append optimistically when sending)
      setLiveMessages((prev) => [...prev, msg]);
    } else if (data.event === "chat_ended") {
      // optionally handle end event here
      setLiveStatus("ended");
    } else {
      // handle other events if needed
      console.log("Live WS unhandled event:", data);
    }
  } catch (err) {
    console.warn("Cannot parse WS message:", event.data, err);
  }
};

    ws.onerror = (err) => {
      console.error("Live chat WS error", err);
    };

    ws.onclose = () => {
      console.log("Live chat WS closed");
    };

     return () => {
    if (ws && ws.readyState === WebSocket.OPEN) ws.close();
  };
}, [liveStatus, sessionInfo?.session_id, user]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [partialResponse, setPartialResponse] = useState("");
  const wsRef = useRef(null);
  const partialRef = useRef("");
  const [wsReady, setWsReady] = useState(false);

  // cập nhật messages của conversation đang active
const pushToActive = (msg) => {
  const currentId = chatSessionIdRef.current;
  if (!currentId) return;

  const isUser = msg.sender === "user";

  setConvs((prev) =>
    prev.map((c) => {
      if (c.id !== currentId) return c;

      const preview =
        msg.text.length > 50 ? msg.text.slice(0, 50) + "..." : msg.text;

      const isDefaultTitle =
        !c.title ||
        c.title === "Cuộc trò chuyện" ||
        c.title === "Cuộc trò chuyện mới";

      return {
        ...c,
        last_message_preview: preview,
        updatedAt: Date.now(),
        title: isUser && isDefaultTitle ? preview : c.title,
      };
    })
  );
};

  //set rating cho phiên đang active
const setRatingForActive = (value) => {
  if (!activeId) return;
  setConvs((prev) =>
    prev.map((c) =>
      c.id === activeId
        ? { ...c, rating: value, updatedAt: Date.now() }
        : c
    )
  );
};

const createConversation = async () => {
  if (!user) return;
  try {
    const res = await axios.post(
      `${API_BASE_URL}/chat/session/create`,
      null,
      {
        params: { user_id: user.id, session_type: "chatbot" },
        headers: authHeaders(),
      }
    );
    const newId = res.data.session_id;

    const newConv = {
      id: newId,
      title: "Cuộc trò chuyện mới",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      last_message_preview: "",
    };

    setConvs((prev) => [newConv, ...prev]);
    setActiveId(newId);
    setChatSessionId(newId);
    setMessages([]);
  } catch (err) {
    console.error("Không tạo được phiên chat mới", err);
    alert("Không tạo được phiên chat mới, thử lại sau.");
  }
};

const selectConversation = (id) => {
  setActiveId(id);
  setChatSessionId(id);      
};

useEffect(() => {
  if (tab !== "chatbot" || !user || !chatSessionId) {
    setMessages([]);
    return;
  }

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/chat/session/${chatSessionId}/history`,
        { headers: authHeaders() }
      );
      const msgs = res.data?.messages || [];
      const mapped = msgs.map((m) => ({
        sender: m.is_from_bot ? "bot" : "user",
        text: m.message_text,
      }));
      setMessages(mapped);
    } catch (err) {
      console.error("Lỗi load lịch sử chat", err);
      setMessages([]);
    }
  };

  fetchHistory();
}, [tab, user, chatSessionId]);



 

const deleteConversation = async (id) => {
  if (!confirm("Xoá phiên chat này?")) return;

  try {
    await axios.delete(`${API_BASE_URL}/chat/session/${id}`, {
      params: { user_id: user.id },
      headers: authHeaders(),
    });

    setConvs((prev) => {
      const next = prev.filter((c) => c.id !== id);

      if (activeId === id) {
        const newActive = next[0] || null;
        setActiveId(newActive ? newActive.id : null);
        setChatSessionId(newActive ? newActive.id : null);  
        setMessages([]);
      }

      return next;
    });
  } catch (err) {
    console.error("Xoá session trên server lỗi:", err);
    alert("Không xoá được session, vui lòng thử lại.");
  }
};

  // ====== LIVE CHAT QUEUE ======
  const handleJoinQueue = async () => {
    if (!user) {
      alert("Bạn cần đăng nhập trước.");
      return;
    }
    try {
      setLiveStatus("in_queue");
      // tạm thời hard-code official_id = 3 (đúng theo Swagger anh gửi)
      const data = await joinQueue(user.id, 3);
      setQueueInfo(data);
      console.log("join_queue result:", data);
    } catch (err) {
      console.error("joinQueue error:", err);
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Không thể tham gia hàng chờ, vui lòng thử lại.";
      alert(msg);
      setLiveStatus("idle");
    }
  };

 const handleSendLiveMessage = async (e) => {
  e.preventDefault();
  if (!liveInput.trim() || !sessionInfo?.session_id) return;
  const content = liveInput.trim();

  // Do NOT append locally here; server will broadcast the message back to all participants
  setLiveInput("");

  if (!liveWsRef.current || liveWsRef.current.readyState !== WebSocket.OPEN) {
    console.warn("Live chat WS not ready");
    return;
  }

  liveWsRef.current.send(
    JSON.stringify({
      sender_id: user.id,
      message: content,
    })
  );
};

  const handleEndLiveChat = async () => {
    if (!sessionInfo?.session_id) return;
    try {
      await endSession(sessionInfo.session_id, user.id);
    } catch (err) {
      console.error(err);
    }
    setLiveStatus("ended");
    setSessionInfo(null);
  };

  // ====== SSE CUSTOMER (queue + accepted + chat_ended) ======
  useEffect(() => {
    if (tab !== "consultant" || !user) {
      if (customerEventSourceRef.current) {
        customerEventSourceRef.current.close();
        customerEventSourceRef.current = null;
      }
      return;
    }

    const token = localStorage.getItem("access_token") || "";
    const url =
      `${API_BASE_URL}/live_chat/livechat/sse/customer/` +
      `${user.id}?token=${encodeURIComponent(token)}`;

    const es = new EventSource(url);
    customerEventSourceRef.current = es;

    es.onopen = () => {
      console.log("SSE customer connected");
    };

    es.onerror = (err) => {
      console.error("SSE error", err);
    };

    const handleSseEvent = async (event) => {
      try {
        let payload;

        try {
          // trường hợp server đã trả đúng JSON
          payload = JSON.parse(event.data);
        } catch {
          // fallback cho format hiện tại: {'event': 'queued', ...}
          const normalized = event.data
            .replace(/'/g, '"')
            .replace(/\bNone\b/g, "null")
            .replace(/\bTrue\b/g, "true")
            .replace(/\bFalse\b/g, "false");

          payload = JSON.parse(normalized);
        }

        console.log("SSE data parsed:", payload);

        const ev = payload.event;  

        switch (ev) {
          case "queued": {
            try {
              const res = await axios.get(
                `${API_BASE_URL}/live_chat/livechatcustomer/queue/status/${user.id}`,
                { headers: authHeaders() }
              );
              setQueueInfo(res.data);
            } catch (err) {
              console.error("getQueueStatus error:", err);
            }
            setLiveStatus("in_queue");
            break;
          }
          case "accepted": {
            const sessionId = payload.session_id;
            setSessionInfo({
              session_id: sessionId,
              official_name: "Tư vấn viên",
            });
            setLiveStatus("chatting");
            if (sessionId) {
              const msgs = await getSessionMessages(sessionId);
              setLiveMessages(msgs || []);
            }
            break;
          }
          case "chat_ended": {
            setLiveStatus("ended");
            break;
          }
          default:
            console.log("Unhandled SSE:", payload);
        }
      } catch (e) {
        console.warn("SSE parse error:", event.data, e);
      }
    };

    es.addEventListener("queued", handleSseEvent);
    es.addEventListener("accepted", handleSseEvent);
    es.addEventListener("chat_ended", handleSseEvent);
    es.onmessage = handleSseEvent;

    return () => {
      es.close();
    };
  }, [tab, user]);

  // ====== PROFILE ======
  const [form, setForm] = useState({
    fullName: "",
    gender: "male",
    dob: "",
    email: "",
    phone: "",
    address: "",
    school: "",
    grade: "12",
    admissionScore: "",
    subjects: "",
    preferredMajor: "",
    riasecCode: "",
  });

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.warn("No access_token in localStorage");
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/profile/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;
        const sp = data.student_profile || {};

        const preferredMajor =
          sp.preferred_major ||
          data.interest_desired_major ||
          sp.interest?.desired_major ||
          "";

        const riasecCode = sp.riasec_code || sp.riasec_result?.result || "";

        setForm({
          fullName: data.full_name || "",
          gender: sp.gender || "male",
          dob: sp.dob || "",
          email: data.email || user.email,
          phone: data.phone_number || "",
          address: sp.address || "",
          school: sp.school || "",
          grade: sp.grade || "12",
          admissionScore:
            sp.admission_score != null ? String(sp.admission_score) : "",
          subjects: sp.subjects || "",
          preferredMajor,
          riasecCode,
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, [user]);

  // ====== WebSocket Chatbot (LLM) ======
  useEffect(() => {
  // nếu không ở tab chatbot hoặc chưa có user / session -> đóng WS
  if (tab !== "chatbot" || !user || !chatSessionId) {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
    wsRef.current = null;
    setWsReady(false);
    setIsLoading(false);
    setPartialResponse("");
    partialRef.current = "";
    return;
  }

  // đã có session_id -> mở WS mới cho phiên đó
  const wsUrl = API_BASE_URL.replace(/^http/, "ws") + "/chat/ws/chat";
  const ws = new WebSocket(wsUrl);
  wsRef.current = ws;

  ws.onopen = () => {
    console.log("✅ Connected to WebSocket chatbot, session:", chatSessionIdRef.current);
    ws.send(
      JSON.stringify({
        user_id: user.id,
        session_id: chatSessionIdRef.current,   // BE sẽ dùng session này, không tạo mới
      })
    );
    setWsReady(true);
  };

    ws.onmessage = (event) => {
      console.log("📩 WS chatbot:", event.data);

      let data;
      try {
        data = JSON.parse(event.data);
      } catch (err) {
        console.error("❌ Không parse được JSON:", event.data);
        return;
      }

      const ev = data.event || data.type;

      switch (ev) {
        case "session_created": {
          if (data.session_id) {
            console.log("🆕 Chat session created:", data.session_id);
            setChatSessionId(data.session_id);
          }
          break;
        }

        case "chunk": {
          const chunk = data.content ?? data.text ?? data.message ?? "";
          setPartialResponse((prev) => {
            const updated = prev + chunk;
            partialRef.current = updated;
            return updated;
          });
          setIsLoading(true);
          break;
        }

        case "done": {
          const finalText =
            partialRef.current && partialRef.current.trim() !== ""
              ? partialRef.current
              : "(không có phản hồi)";

          const botMsg = { sender: "bot", text: finalText };
          setMessages((prev) => [...prev, botMsg]);
          pushToActive(botMsg);

          partialRef.current = "";
          setPartialResponse("");
          setIsLoading(false);
          break;
        }

        case "error": {
          console.error("⚠️ WS error:", data.message || data);
          const errText =
            data.message ||
            "Xin lỗi, đã có lỗi xảy ra trong quá trình xử lý câu hỏi. Bạn hãy thử lại sau hoặc thử một câu hỏi khác nhé.";
          const botMsg = { sender: "bot", text: errText };
          setMessages((prev) => [...prev, botMsg]);
          pushToActive(botMsg);
          setIsLoading(false);
          break;
        }

        default:
          console.warn("⚠️ Sự kiện không xác định:", data);
      }
    };

    ws.onclose = () => {
    console.log("🔒 WebSocket chatbot closed");
    setWsReady(false);
    setIsLoading(false);
    setPartialResponse("");
    partialRef.current = "";
  };

  return () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  };
}, [tab, user, chatSessionId]);  


useEffect(() => {
  // chỉ chạy khi đang ở tab chatbot, đã login, có session & WS sẵn sàng
  if (
    tab !== "chatbot" ||
    !user ||
    !chatSessionId ||
    !wsReady ||
    prefillSent
  ) {
    return;
  }

  const raw = localStorage.getItem(CHATBOT_PREFILL_KEY);
  if (!raw) return;

  // raw đã là chuỗi JSON mà Riasec lưu, ví dụ:
  // {"student_id":"guest-1765219998608","answers":{"R":5,"I":5,"A":5,"S":5,"E":5,"C":5}}
  const text = raw;

  // hiển thị như tin nhắn user
  const userMsg = { sender: "user", text };
  setMessages((prev) => [...prev, userMsg]);
  pushToActive(userMsg);

  if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
    wsRef.current.send(
      JSON.stringify({
        message: text,                     // <<< GỬI ĐÚNG CHUỖI JSON
        user_id: user.id,
        session_id: chatSessionIdRef.current ?? chatSessionId,
      })
    );
  }

  // chỉ gửi 1 lần rồi xoá
  setPrefillSent(true);
  localStorage.removeItem(CHATBOT_PREFILL_KEY);
}, [tab, user, wsReady, chatSessionId, prefillSent]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !activeId) return;

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      alert(
        "Kết nối chatbot đã bị ngắt. Hãy đổi sang tab khác rồi quay lại Chatbot hoặc reload trang."
      );
      return;
    }

    const text = input.trim();
    const userMsg = { sender: "user", text };

    setMessages((prev) => [...prev, userMsg]);
    pushToActive(userMsg);

wsRef.current.send(
  JSON.stringify({
    message: text,
    user_id: user.id,
    session_id: chatSessionIdRef.current ?? null,
  })
);

    setInput("");
    setPartialResponse("");
    partialRef.current = "";
    setIsLoading(true);
  };

  // ====== Profile handlers, transcript... (giữ nguyên) ======
  const handleChange = (e) => {
    if (!editing) return;
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleAdmissionScoreChange = (e) => {
    if (!editing) return;
    let val = e.target.value;
    if (val === "") {
      setForm((p) => ({ ...p, admissionScore: "" }));
      return;
    }
    const num = Number(val);
    if (Number.isNaN(num)) return;
    const clamped = Math.max(0, Math.min(30, num));
    setForm((p) => ({ ...p, admissionScore: clamped }));
  };

  const onSave = async (e) => {
    e?.preventDefault?.();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      alert("Vui lòng nhập đúng định dạng email.");
      return;
    }
    const phonePattern = /^0\d{9}$/;
    if (!phonePattern.test(form.phone)) {
      alert("Số điện thoại phải bắt đầu bằng 0 và gồm 10 chữ số.");
      return;
    }
    // if (
    //   form.admissionScore === "" ||
    //   Number.isNaN(Number(form.admissionScore)) ||
    //   Number(form.admissionScore) > 30 ||
    //   Number(form.admissionScore) < 0
    // ) {
    //   alert("Admission score chỉ được nhập số từ 0 đến 30.");
    //   return;
    // }

    try {
      alert("Profile saved!");
      setEditing(false);
    } catch (error) {
      alert("Cập nhật thất bại!");
      console.error(error);
    }
  };

  const onCancel = () => setEditing(false);

  const subjectsLeft = [
    "Toán học(*)",
    "Ngoại ngữ",
    "Hóa học",
    "Lịch sử",
  ];

  const subjectsRight = [
    "Ngữ văn(*)",
    "Vật lý",
    "Sinh học",
    "Địa lý",
  ];

    const SUBJECT_API_FIELDS = {
    "Toán học(*)": "math",
    "Ngữ văn(*)": "literature",
    "Ngoại ngữ": "english",
    "Vật lý": "physics",
    "Hóa học": "chemistry",
    "Sinh học": "biology",
    "Lịch sử": "history",
    "Địa lý": "geography",
  };

  const [scores, setScores] = useState({});

  const handleScoreChange = (subject, grade, rawValue) => {
    let value = rawValue;
    value = value.replace(/[^0-9.]/g, "");
    const digits = value.replace(/\./g, "");
    if (digits.length > 2) value = digits.slice(0, 2);

    if (/^[0-9]{2}$/.test(value)) {
      const intVal = parseInt(value, 10);
      if (intVal > 10) value = (intVal / 10).toFixed(1);
    }

    if (/^[0-9]\.[0-9]$/.test(value)) {
      let f = parseFloat(value);
      if (f > 10) f = 10;
      value = f.toString();
    }

    let num = parseFloat(value);
    if (!isNaN(num) && num > 10) value = "10";
    value = value.match(/^\d{1,2}(\.\d{0,1})?/)?.[0] || "";

    setScores((prev) => ({
      ...prev,
      [subject]: {
        ...prev[subject],
        [grade]: value,
      },
    }));
  };

const renderScoreInput = (subject) => (
  <input
    type="text"
    maxLength={4}
    value={scores?.[subject]?.["12"] ?? ""}
    onChange={(e) => handleScoreChange(subject, "12", e.target.value)}
    className="w-full px-3 py-2 rounded-md text-black placeholder-gray-400"
  />
);

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className="text-center py-10">
          Bạn cần đăng nhập để xem trang này.
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="container mx-auto px-4 py-10">
        {/* Banner */}
        <div className="mb-8">
          <img
            src={banner}
            alt="Profile Banner"
            className="w-full h-[250px] object-cover rounded-2xl shadow-md"
          />
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold mb-6">
          Welcome, <span className="text-[#EB5A0D]">{form.fullName}</span>
        </h1>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="col-span-12 md:col-span-3">
            <div className="rounded-2xl border border-gray-200 p-4 sticky top-4">
              <SidebarItem
                active={tab === "profile"}
                icon="👤"
                label="Profile"
                onClick={() => setTab("profile")}
              />
              <SidebarItem
                active={tab === "chatbot"}
                icon="🤖"
                label="Chatbot"
                onClick={() => setTab("chatbot")}
              />
              <SidebarItem
                active={tab === "consultant"}
                icon="💼"
                label="Consultant"
                onClick={() => setTab("consultant")}
              />
              <SidebarItem
                active={tab === "transcript"}
                icon="📄"
                label="School records"
                onClick={() => setTab("transcript")}
              />
              <div className="mt-6 text-xs text-gray-400 px-2">Help</div>
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <section className="col-span-12 md:col-span-9">
            {/* PROFILE TAB */}
            {tab === "profile" && (
              <div className="rounded-2xl overflow-hidden border border-gray-200">
                <div className="h-14 bg-[#EB5A0D]" />
                <div className="p-6">
                  {/* name + email */}
                  <div className="flex items-end gap-4 mb-6 -mt-2">
                    <div className="pb-1">
                      <div className="font-semibold">{form.fullName}</div>
                      <div className="text-sm text-gray-500">{form.email}</div>
                    </div>
                    <div className="pb-1 flex-1 flex justify-end">
                      <Link
                        to="/riasec"
                        className="shrink-0 whitespace-nowrap inline-flex items-center gap-2
               px-3 py-1.5 rounded-md text-xs bg-[#EB5A0D] text-white hover:opacity-90"
                        title="Làm bài trắc nghiệm RIASEC"
                      >
                        RIASEC
                      </Link>
                    </div>
                  </div>

                  <form
                    onSubmit={onSave}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                  >
                    {/* Họ tên */}
                    <div>
                      <label className="text-sm text-gray-500">Full Name</label>
                      <input
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        disabled={!editing}
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB5A0D]"
                      />
                    </div>

                    {/* Giới tính */}
                    {/* <div>
                      <label className="text-sm text-gray-500">Gender</label>
                      <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        disabled={!editing}
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB5A0D] bg-white"
                      >
                        {GENDERS.map((g) => (
                          <option key={g.value} value={g.value}>
                            {g.label}
                          </option>
                        ))}
                      </select>
                    </div> */}

                    {/* Ngày sinh */}
                    {/* <div>
                      <label className="text-sm text-gray-500">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={form.dob}
                        onChange={handleChange}
                        disabled={!editing}
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB5A0D]"
                      />
                    </div> */}

                    {/* Email */}
                    <div>
                      <label className="text-sm text-gray-500">Email</label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        disabled={!editing}
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB5A0D]"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="text-sm text-gray-500">
                        Phone Number
                      </label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        disabled={!editing}
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB5A0D]"
                      />
                    </div>

                    {/* Address */}
                    {/* <div>
                      <label className="text-sm text-gray-500">Address</label>
                      <input
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        disabled={!editing}
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB5A0D]"
                      />
                    </div> */}

                    {/* Trường */}
                    {/* <div>
                      <label className="text-sm text-gray-500">
                        High School
                      </label>
                      <input
                        name="school"
                        value={form.school}
                        onChange={handleChange}
                        disabled={!editing}
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB5A0D]"
                      />
                    </div> */}

                    {/* Lớp/Khối */}
                    {/* <div>
                      <label className="text-sm text-gray-500">Grade</label>
                      <select
                        name="grade"
                        value={form.grade}
                        onChange={handleChange}
                        disabled={!editing}
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB5A0D] bg-white"
                      >
                        {GRADES.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div> */}

                    {/* Điểm xét tuyển */}
                    {/* <div>
                      <label className="text-sm text-gray-500">
                        Admission score
                      </label>
                      <input
                        name="admissionScore"
                        type="number"
                        inputMode="decimal"
                        step="0.1"
                        min="0"
                        max="30"
                        value={form.admissionScore}
                        onChange={handleAdmissionScoreChange}
                        disabled={!editing}
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB5A0D]"
                      />
                    </div> */}

                    {/* Tổ hợp môn */}
                    {/* <div>
                      <label className="text-sm text-gray-500">
                        Combination of 3 subjects
                      </label>
                      <select
                        name="subjects"
                        value={form.subjects}
                        onChange={handleChange}
                        disabled={!editing}
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm 
               focus:outline-none focus:ring-2 focus:ring-[#EB5A0D] bg-white"
                      >
                        <option value="">Chọn tổ hợp</option>
                        <option value="A00">A00 - Toán, Lý, Hóa</option>
                        <option value="A01">A01 - Toán, Lý, Anh</option>
                        <option value="B00">B00 - Toán, Hóa, Sinh</option>
                        <option value="C00">C00 - Văn, Sử, Địa</option>
                        <option value="D01">D01 - Toán, Văn, Anh</option>
                        <option value="D07">D07 - Toán, Hóa, Anh</option>
                        <option value="D90">D90 - Toán, Anh, KHTN</option>
                      </select>
                    </div> */}

                    {/* Ngành mong muốn */}
                    <div>
                      <label className="text-sm text-gray-500">
                        Preferred major
                      </label>
                      <select
                        name="preferredMajor"
                        value={form.preferredMajor}
                        onChange={handleChange}
                        disabled={!editing}
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm 
               focus:outline-none focus:ring-2 focus:ring-[#EB5A0D] bg-white"
                      >
                        <option value="">Chọn ngành học</option>
                        <option value="software">Kỹ thuật phần mềm</option>
                        <option value="design">Thiết kế đồ họa</option>
                        <option value="ai">Trí tuệ nhân tạo</option>
                        <option value="security">An ninh mạng</option>
                        <option value="business">Kinh doanh số</option>
                        <option value="game">Thiết kế trò chơi</option>
                      </select>
                    </div>

                    {/* Mã RIASEC */}
                    {/* <div>
                      <label className="text-sm text-gray-500">
                        RIASEC code
                      </label>
                      <input
                        name="riasecCode"
                        value={form.riasecCode}
                        onChange={handleChange}
                        disabled={!editing}
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB5A0D]"
                      />
                    </div> */}

                    {/* Actions */}
                    <div className="col-span-1 sm:col-span-2 flex items-center justify-center gap-3 mt-2">
                      {!editing ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setEditing(true);
                          }}
                          className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Edit
                        </button>
                      ) : (
                        <>
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={onCancel}
                            className="px-5 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* CHATBOT TAB */}
            {tab === "chatbot" && (
              <div className="rounded-2xl border border-gray-200 bg-white grid grid-cols-12 overflow-hidden min-h-[600px]">
                {/* LEFT: danh sách phiên */}
                <aside className="col-span-12 md:col-span-4 border-r border-gray-100 flex flex-col">
                  <div className="flex items-center justify-between px-4 py-3 bg-[#FFF3ED]">
                    <div className="font-semibold text-[#EB5A0D]">
                      Đoạn chat
                    </div>
                    <button
                      onClick={createConversation}
                      className="px-3 py-1 rounded-md bg-[#EB5A0D] text-white text-sm hover:opacity-90"
                    >
                      + Phiên mới
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    <ul className="divide-y divide-gray-100">
                      {convs.map((c) => (
                        <li
                          key={c.id}
                          className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                            c.id === activeId ? "bg-orange-50" : ""
                          }`}
                          onClick={() => selectConversation(c.id)}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="truncate font-medium">
                              {c.title}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteConversation(c.id);
                                }}
                                className="text-xs text-red-600 hover:text-red-700"
                                title="Xoá"
                              >
                                Xoá
                              </button>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(c.updatedAt).toLocaleString()}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>

                {/* RIGHT: khung chat */}
               <section className="col-span-12 md:col-span-8 flex flex-col">
  <div className="bg-[#EB5A0D] text-white px-6 py-3 flex items-center justify-between">
    <div className="text-lg font-semibold">ChatBotFPT</div>

    {activeConv && (
      <div className="flex items-center gap-1 text-sm">
        <span className="hidden sm:inline mr-2">Đánh giá phiên:</span>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRatingForActive(star)}
            className="focus:outline-none"
          >
            <span
              className={
                star <= (activeConv.rating || 0)
                  ? "text-yellow-300"
                  : "text-white/50"
              }
            >
              ★
            </span>
          </button>
        ))}
      </div>
    )}
  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                    {!messages.length ? (
                      <p className="text-gray-400 text-center mt-10">
                        Hãy bắt đầu trò chuyện…
                      </p>
                    ) : (
                      messages.map((m, i) => (
                        <div
                          key={i}
                          className={`flex ${
                            m.sender === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`px-4 py-2 max-w-[70%] rounded-xl text-sm ${
                              m.sender === "user"
                                ? "bg-[#EB5A0D] text-white"
                                : "bg-gray-200 text-gray-800"
                            }`}
                          >
                            {m.text}
                          </div>
                        </div>
                      ))
                    )}

                    {isLoading && (
                      <div className="flex justify-start mt-1">
                        <div className="px-4 py-2 max-w-[70%] rounded-xl text-sm bg-gray-200 text-gray-800">
                          {partialResponse}
                          <span className="animate-pulse">▌</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <form
                    onSubmit={handleSend}
                    className="flex items-center gap-3 border-t border-gray-200 p-4"
                  >
                    <input
                      type="text"
                      placeholder="Nhập tin nhắn..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB5A0D]"
                    />
                    <button
                      type="submit"
                      disabled={!wsReady || !input.trim() || !activeId}
                      className={`px-4 py-2 rounded-md text-white ${
                        !wsReady || !input.trim() || !activeId
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-[#EB5A0D] hover:opacity-90"
                      }`}
                    >
                      {wsReady ? "Gửi" : "Đang kết nối..."}
                    </button>
                  </form>
                </section>
              </div>
            )}

            {/* CONSULTANT TAB */}
            {tab === "consultant" && (
              <div className="rounded-2xl border border-gray-200 bg-white flex flex-col min-h-[600px]">
                <div className="bg-[#EB5A0D] text-white px-6 py-3 flex items-center justify-between">
                  <div className="text-lg font-semibold">
                    Live chat với tư vấn viên
                  </div>
                  <div className="text-sm">
                    Trạng thái:{" "}
                    <span className="font-semibold">
                      {liveStatus === "idle" && "Chưa bắt đầu"}
                      {liveStatus === "in_queue" && "Đang trong hàng chờ"}
                      {liveStatus === "chatting" && "Đang trò chuyện"}
                      {liveStatus === "ended" && "Đã kết thúc"}
                    </span>
                  </div>
                </div>

                {/* Info hàng chờ / tư vấn viên */}
                <div className="px-6 py-3 border-b border-gray-100 flex flex-wrap items-center gap-4 text-sm text-gray-700">
                  {liveStatus === "idle" && (
                    <>
                      <p>
                        Ấn nút dưới đây để vào hàng chờ và kết nối với tư vấn
                        viên tuyển sinh.
                      </p>
                      <button
                        onClick={handleJoinQueue}
                        className="ml-auto bg-[#EB5A0D] text-white px-4 py-2 rounded-md hover:opacity-90"
                      >
                        Bắt đầu chat
                      </button>
                    </>
                  )}

                  {liveStatus === "in_queue" && (
                    <>
                      <p>
                        Bạn đang trong hàng chờ…
                        {queueInfo?.position != null && (
                          <span> Vị trí hiện tại: {queueInfo.position}</span>
                        )}
                      </p>
                    </>
                  )}

                  {liveStatus === "chatting" && (
                    <>
                      <p>
                        Đang trò chuyện với{" "}
                        <span className="font-semibold">
                          {sessionInfo?.official_name || "tư vấn viên"}
                        </span>
                      </p>
                      <button
                        onClick={handleEndLiveChat}
                        className="ml-auto text-sm text-red-600 hover:underline"
                      >
                        Kết thúc phiên
                      </button>
                    </>
                  )}

                  {liveStatus === "ended" && (
                    <>
                      <p>
                        Phiên chat đã kết thúc. Bạn có thể bắt đầu lại nếu cần.
                      </p>
                      <button
                        onClick={handleJoinQueue}
                        className="ml-auto bg-[#EB5A0D] text-white px-4 py-2 rounded-md hover:opacity-90"
                      >
                        Bắt đầu lại
                      </button>
                    </>
                  )}
                </div>

                {/* KHUNG CHAT */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-3">
                  {!liveMessages.length ? (
                    <p className="text-gray-400 text-center mt-10">
                      {liveStatus === "idle"
                        ? "Chưa có cuộc hội thoại nào."
                        : "Đang chờ tin nhắn..."}
                    </p>
                  ) : (
                    liveMessages.map((m, idx) => (
                      <div
                        key={idx}
                        className={`flex ${
                          m.sender === "customer"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`px-4 py-2 max-w-[70%] rounded-xl text-sm ${
                            m.sender === "customer"
                              ? "bg-[#EB5A0D] text-white"
                              : "bg-white text-gray-800 border border-gray-200"
                          }`}
                        >
                          {m.content}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* INPUT */}
                <form
                  onSubmit={handleSendLiveMessage}
                  className="flex items-center gap-3 border-t border-gray-200 p-4"
                >
                  <input
                    type="text"
                    placeholder={
                      liveStatus === "chatting"
                        ? "Nhập tin nhắn..."
                        : "Hãy vào hàng chờ để bắt đầu chat..."
                    }
                    value={liveInput}
                    onChange={(e) => setLiveInput(e.target.value)}
                    disabled={liveStatus !== "chatting"}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB5A0D] disabled:bg-gray-100"
                  />
                  <button
                    type="submit"
                    disabled={liveStatus !== "chatting" || !liveInput.trim()}
                    className={`px-4 py-2 rounded-md text-white ${
                      liveStatus !== "chatting" || !liveInput.trim()
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-[#EB5A0D] hover:opacity-90"
                    }`}
                  >
                    Gửi
                  </button>
                </form>
              </div>
            )}

            {/* TRANSCRIPT TAB */}
            {tab === "transcript" && (
<div className="rounded-2xl border border-gray-200 bg-white p-6">
    <div className="bg-orange-500 p-6 rounded-lg text-white">
      <p className="mb-6 text-sm">
        Cần nhập tối thiểu 06 môn cho cả bảng điểm, nếu điểm là số
        thập phân, sử dụng dấu chấm
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT */}
        <div>
          <div className="grid grid-cols-2 gap-4 font-semibold mb-3 text-white">
            <div>Môn học</div>
            <div className="text-center">Học kỳ</div>
          </div>

          <div>
            {subjectsLeft.map((subject) => (
              <div
                key={subject}
                className="grid grid-cols-2 gap-4 items-center mb-3"
              >
                <div className="font-semibold">{subject}</div>
                <div>{renderScoreInput(subject)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <div className="grid grid-cols-2 gap-4 font-semibold mb-3 text-white">
            <div>Môn học</div>
            <div className="text-center">Học kỳ 2</div>
          </div>

          <div>
            {subjectsRight.map((subject) => (
              <div
                key={subject}
                className="grid grid-cols-2 gap-4 items-center mb-3"
              >
                <div className="font-semibold">{subject}</div>
                <div>{renderScoreInput(subject)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={saveAcademicScores}
          className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-2xl px-16 py-3 rounded-full"
          disabled={uploading}
        >
          {uploading ? "Đang lưu..." : "Save"}
        </button>
      </div>
    </div>
  </div>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default UserProfile;
