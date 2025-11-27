// src/pages/private/UserProfile.jsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import banner from "@/assets/images/login-private.jpg";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/Auth";

// import { BASE } from "@/configs/base";

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

const GRADES = [
  "10",
  "11",
  "12",
  "Đã tốt nghiệp",
];

const UserProfile = () => {
      const { user, isAuthenticated  } = useAuth();
  const [tab, setTab] = useState("profile");
  const [editing, setEditing] = useState(false);

 


//hoc ba
const [files, setFiles] = useState([]);        // File[] chờ upload
const [uploading, setUploading] = useState(false);
const [uploaded, setUploaded] = useState([]);  // danh sách đã upload (mock)

const ACCEPTED = ["application/pdf", "image/jpeg", "image/png"];
const MAX_MB = 10;

// chọn file
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

  // cho phép chọn lại cùng file
  e.target.value = "";
};

// xóa file khỏi hàng chờ
const removeFile = (index) => {
  setFiles((prev) => prev.filter((_, i) => i !== index));
};

// upload (mock). TODO: thay bằng gọi API backend với FormData nếu có.
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

// dọn URL tạm để tránh leak khi rời trang
useEffect(() => {
  return () => {
    uploaded.forEach((u) => u.preview && URL.revokeObjectURL(u.preview));
  };
}, [uploaded]);

  const LS_KEY = "chat_conversations_v1";
const newConv = () => ({
  id: crypto.randomUUID(),
  title: "Cuộc trò chuyện mới",
  messages: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

const [convs, setConvs] = useState(() => {
  const raw = localStorage.getItem(LS_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch {}
  }
  return [newConv()];
});

const [activeId, setActiveId] = useState(convs[0]?.id || null);

  // Chatbot states
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [partialResponse, setPartialResponse] = useState("");
  const wsRef = useRef(null);
  const partialRef = useRef("");
  const [wsReady, setWsReady] = useState(false);


// load messages khi đổi phiên
useEffect(() => {
  const c = convs.find(c => c.id === activeId);
  setMessages(c ? c.messages : []);
}, [activeId, convs]);

const persistConvs = (next) => {
  setConvs(next);
  localStorage.setItem(LS_KEY, JSON.stringify(next));
};

const createConversation = () => {
  const c = newConv();
  const next = [c, ...convs];
  persistConvs(next);
  setActiveId(c.id);
};

const selectConversation = (id) => setActiveId(id);

const renameConversation = (id) => {
  const title = prompt("Đặt tên phiên chat:");
  if (!title) return;
  const next = convs.map(c => c.id === id ? { ...c, title } : c);
  persistConvs(next);
};

const deleteConversation = (id) => {
  if (!confirm("Xoá phiên chat này?")) return;
  const next = convs.filter(c => c.id !== id);
  persistConvs(next);
  if (activeId === id) setActiveId(next[0]?.id || null);
};

// cập nhật phiên hiện tại khi có tin nhắn mới
const pushToActive = (msg) => {
  const next = convs.map(c => {
    if (c.id !== activeId) return c;
    return {
      ...c,
      messages: [...c.messages, msg],
      updatedAt: Date.now(),
    };
  });
  persistConvs(next);
};




  
  const [consultants] = useState([
    { id: "c1", name: "Consultant 1", role: "Tư vấn tuyển sinh", avatar: "https://i.pravatar.cc/100?img=11" },
    { id: "c2", name: "Consultant 2", role: "Tư vấn học vụ", avatar: "https://i.pravatar.cc/100?img=12" },
    { id: "c3", name: "Consultant 3", role: "Hướng nghiệp", avatar: "https://i.pravatar.cc/100?img=13" },
  ]);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [cMessages, setCMessages] = useState({});
  const [cInput, setCInput] = useState("");

  const openConsultant = (c) => {
    setSelectedConsultant(c);
    setCMessages((prev) => {
      if (prev[c.id]) return prev;
      return {
        ...prev,
        [c.id]: [
          { sender: "bot", text: `Xin chào, mình là ${c.name} – ${c.role}. Bạn cần hỗ trợ gì?` },
        ],
      };
    });
  };

const deleteUploaded = (index) => {
  setUploaded((prev) => {
    const next = [...prev];
    const [removed] = next.splice(index, 1);
    if (removed?.preview) URL.revokeObjectURL(removed.preview);
    return next;
  });
};


  const handleConsultSend = (e) => {
    e.preventDefault();
    if (!selectedConsultant || !cInput.trim()) return;
    const id = selectedConsultant.id;

    setCMessages((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), { sender: "user", text: cInput }],
    }));

    const userText = cInput;
    setCInput("");
    setTimeout(() => {
      setCMessages((prev) => ({
        ...prev,
        [id]: [
          ...(prev[id] || []),
          { sender: "bot", text: `${selectedConsultant.name} đã nhận câu hỏi: "${userText}". Mình sẽ phản hồi sớm nhất!` },
        ],
      }));
    }, 700);
  };

 
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
  // chỉ gọi khi đã có user (tức là đã login)
  if (!user) return;

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.warn("No access_token in localStorage");
        return;
      }

      // Giả sử BE có endpoint: GET /profile/{user_id}
      const res = await axios.get(
        `http://127.0.0.1:8000/profile/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data;
      console.log("🔥 Profile from backend:", data);

      // map field từ BE sang form của FE
      setForm({
        fullName: data.full_name || "",
        gender: data.gender || "male",
        dob: data.dob || "",
        email: data.email || user.email,         // fallback
        phone: data.phone || "",
        address: data.address || "",
        school: data.school || "",
        grade: data.grade || "12",
        admissionScore: data.admission_score?.toString() || "",
        subjects: data.subjects || "",
        preferredMajor: data.preferred_major || "",
        riasecCode: data.riasec_code || "",
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  fetchProfile();
}, [user]);


  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // const response = await axios.get(`${BASE.BASE_URL}/account/profile`, {
      //   headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      // });
      // setForm(response.data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  // Kết nối WS khi vào tab chatbot
  useEffect(() => {
    if (tab !== "chatbot") {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      setWsReady(false);
      return;
    }

    const ws = new WebSocket("ws://localhost:8000/chat/ws/chat");
    wsRef.current = ws;

    ws.onopen = () => setWsReady(true);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === "chunk") {
          setPartialResponse((prev) => {
            const next = prev + data.content;
            partialRef.current = next;
            return next;
          });
        } else if (data.event === "done") {
          const finalText =
            partialRef.current && partialRef.current.trim() !== ""
              ? partialRef.current
              : "(không có phản hồi)";

          setMessages((prev) => [...prev, { sender: "bot", text: finalText }]);
          pushToActive({ sender: "bot", text: finalText });
          partialRef.current = "";
          setPartialResponse("");
          setIsLoading(false);
        }
      } catch (_) {
        // ignore non-JSON logs
      }
    };

    ws.onclose = () => setWsReady(false);

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, [tab]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !activeId) return;
    const msg = { sender: "user", text: input };
     setMessages(prev => [...prev, msg]);
  pushToActive(msg);  
    setPartialResponse("");
    partialRef.current = "";
    setIsLoading(true);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ message: msg }));
    }
    setInput("");
  };

  // ------- Form handlers --------
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
    if (
      form.admissionScore === "" ||
      Number.isNaN(Number(form.admissionScore)) ||
      Number(form.admissionScore) > 30 ||
      Number(form.admissionScore) < 0
    ) {
      alert("Admission score chỉ được nhập số từ 0 đến 30.");
      return;
    }

    try {
      // await axios.put(`${BASE.BASE_URL}/account/update`, form);
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
    "Công nghệ",
    "Giáo dục KT - PL",
  ];

  const subjectsRight = [
    "Ngữ văn(*)",
    "Vật lý",
    "Sinh học",
    "Địa lý",
    "Tin học",
  ];

  const [scores, setScores] = useState({}); // key: `${subject}_${grade}` -> value string

const handleScoreChange = (subject, grade, rawValue) => {
  let value = rawValue;

 
  value = value.replace(/[^0-9.]/g, "");

  const digits = value.replace(/\./g, "");

  if (digits.length > 2) {

    value = digits.slice(0, 2);
  }


  if (/^[0-9]{2}$/.test(value)) {
    const intVal = parseInt(value, 10);

    if (intVal > 10) {
 
      value = (intVal / 10).toFixed(1);
    }
  }

  // Nếu dạng X.Y
  if (/^[0-9]\.[0-9]$/.test(value)) {
    let f = parseFloat(value);
    if (f > 10) f = 10;
    value = f.toString();
  }

  // ép max = 10
  let num = parseFloat(value);
  if (!isNaN(num) && num > 10) value = "10";

  // Chỉ cho tối đa 1 số thập phân
  value = value.match(/^\d{1,2}(\.\d{0,1})?/)?.[0] || "";

  // Cập nhật state
  setScores((prev) => ({
    ...prev,
    [subject]: {
      ...prev[subject],
      [grade]: value
    }
  }));
};

const renderScoreInput = (subject, grade) => (
  <input
    type="text"
    maxLength={4}
    value={scores?.[subject]?.[grade] ?? ""}
    onChange={(e) => handleScoreChange(subject, grade, e.target.value)}
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
               <SidebarItem active={tab === "transcript"} icon="📄" label="School records
" onClick={() => setTab("transcript")} />
              <div className="mt-6 text-xs text-gray-400 px-2">Help</div>
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <section className="col-span-12 md:col-span-9">
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

                  <form onSubmit={onSave} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                    <div>
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
                    </div>

                    {/* Ngày sinh */}
                    <div>
                      <label className="text-sm text-gray-500">Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        value={form.dob}
                        onChange={handleChange}
                        disabled={!editing}
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB5A0D]"
                      />
                    </div>

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
                      <label className="text-sm text-gray-500">Phone Number</label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        disabled={!editing}
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB5A0D]"
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label className="text-sm text-gray-500">Address</label>
                      <input
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        disabled={!editing}
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB5A0D]"
                      />
                    </div>

                    {/* Trường */}
                    <div>
                      <label className="text-sm text-gray-500">High School</label>
                      <input
                        name="school"
                        value={form.school}
                        onChange={handleChange}
                        disabled={!editing}
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB5A0D]"
                      />
                    </div>

                    {/* Lớp/Khối */}
                    <div>
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
                    </div>

                    {/* Điểm xét tuyển */}
                    <div>
                      <label className="text-sm text-gray-500">Admission score</label>
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
                    </div>

                    {/* Tổ hợp môn */}
                    <div>
                      <label className="text-sm text-gray-500">Combination of 3 subjects</label>
                      <input
                        name="subjects"
                        value={form.subjects}
                        onChange={handleChange}
                        disabled={!editing}
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB5A0D]"
                      />
                    </div>

                    {/* Ngành mong muốn */}
                    <div>
                      <label className="text-sm text-gray-500">Preferred major</label>
                      <input
                        name="preferredMajor"
                        value={form.preferredMajor}
                        onChange={handleChange}
                        disabled={!editing}
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB5A0D]"
                      />
                    </div>

                    {/* Mã RIASEC (readonly nếu muốn) */}
                    <div>
                      <label className="text-sm text-gray-500">RIASEC code</label>
                      <input
                        name="riasecCode"
                        value={form.riasecCode}
                        onChange={handleChange}
                        disabled={!editing}
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB5A0D]"
                      />
                    </div>

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

{tab === "chatbot" && (
  <div className="rounded-2xl border border-gray-200 bg-white grid grid-cols-12 overflow-hidden min-h-[600px]">
    {/* LEFT: danh sách phiên */}
    <aside className="col-span-12 md:col-span-4 border-r border-gray-100 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-[#FFF3ED]">
        <div className="font-semibold text-[#EB5A0D]">Đoạn chat</div>
        <button
          onClick={createConversation}
          className="px-3 py-1 rounded-md bg-[#EB5A0D] text-white text-sm hover:opacity-90"
        >
          + Phiên mới
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ul className="divide-y divide-gray-100">
          {convs.map(c => (
            <li
              key={c.id}
              className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                c.id === activeId ? "bg-orange-50" : ""
              }`}
              onClick={() => selectConversation(c.id)}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="truncate font-medium">{c.title}</div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); renameConversation(c.id); }}
                    className="text-xs text-gray-500 hover:text-gray-700"
                    title="Đổi tên"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteConversation(c.id); }}
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

    {/* RIGHT: khung chat của phiên đang chọn */}
    <section className="col-span-12 md:col-span-8 flex flex-col">
      <div className="bg-[#EB5A0D] text-white px-6 py-3 text-lg font-semibold text-center">
        ChatBotFPT
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {!messages.length ? (
          <p className="text-gray-400 text-center mt-10">
            Hãy bắt đầu trò chuyện…
          </p>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`px-4 py-2 max-w-[70%] rounded-xl text-sm ${
                  m.sender === "user" ? "bg-[#EB5A0D] text-white" : "bg-gray-200 text-gray-800"
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

      <form onSubmit={handleSend} className="flex items-center gap-3 border-t border-gray-200 p-4">
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

            {tab === "consultant" && (
              <div className="rounded-2xl border border-gray-200 bg-white grid grid-cols-12 overflow-hidden min-h-[600px]">
                <aside className="col-span-12 md:col-span-4 border-r border-gray-100">
                  <div className="bg-[#EB5A0D] text-white px-6 py-3 text-lg font-semibold">
                    Danh sách tư vấn viên
                  </div>
                  <ul className="divide-y divide-gray-100">
                    {consultants.map((c) => (
                      <li
                        key={c.id}
                        onClick={() => openConsultant(c)}
                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition ${
                          selectedConsultant?.id === c.id ? "bg-[#FFF3ED]" : ""
                        }`}
                      >
                        <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <div className="font-medium">{c.name}</div>
                          <div className="text-xs text-gray-500">{c.role}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </aside>

                <section className="col-span-12 md:col-span-8 flex flex-col">
                  <div className="bg-[#EB5A0D] text-white px-6 py-3 text-lg font-semibold text-center">
                    {selectedConsultant ? `Chat với ${selectedConsultant.name}` : "Chọn một tư vấn viên để bắt đầu"}
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                    {!selectedConsultant ? (
                      <div className="text-gray-400 text-center mt-10">
                        Hãy chọn một tư vấn viên ở danh sách bên trái để trò chuyện 💬
                      </div>
                    ) : (
                      (cMessages[selectedConsultant.id] || []).map((msg, i) => (
                        <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`px-4 py-2 max-w-[70%] rounded-xl text-sm ${
                              msg.sender === "user" ? "bg-[#EB5A0D] text-white" : "bg-gray-200 text-gray-800"
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={handleConsultSend} className="flex items-center gap-3 border-t border-gray-200 p-4">
                    <input
                      type="text"
                      placeholder={selectedConsultant ? "Nhập tin nhắn..." : "Chọn tư vấn viên trước khi nhập..."}
                      value={cInput}
                      onChange={(e) => setCInput(e.target.value)}
                      disabled={!selectedConsultant}
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB5A0D] disabled:bg-gray-100"
                    />
                    <button
                      type="submit"
                      disabled={!selectedConsultant || !cInput.trim()}
                      className={`px-4 py-2 rounded-md text-white transition ${
                        !selectedConsultant || !cInput.trim()
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-[#EB5A0D] hover:opacity-90"
                      }`}
                    >
                      Gửi
                    </button>
                  </form>
                </section>
              </div>
            )}

            {tab === "transcript" && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                {/* Replaced upload UI with the score table matching your provided design */}
                <div className="bg-orange-500 p-6 rounded-lg text-white">
                  <p className="mb-6 text-sm">Cần nhập tối thiểu 06 môn cho cả bảng điểm, nếu điểm là số thập phân, sử dụng dấu chấm</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* LEFT */}
                    <div>
                      <div className="grid grid-cols-3 gap-4 font-semibold mb-3 text-white">
                        <div>Môn học</div>
                        <div className="text-center">Học kỳ 1</div>
                        <div className="text-center">Học kỳ 2</div>
                      </div>

                      <div>
                        {subjectsLeft.map((subject) => (
                          <div key={subject} className="grid grid-cols-3 gap-4 items-center mb-3">
                            <div className="font-semibold">{subject}</div>
                            <div>{renderScoreInput(subject, "11")}</div>
                            <div>{renderScoreInput(subject, "12")}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div>
                      <div className="grid grid-cols-3 gap-4 font-semibold mb-3 text-white">
                        <div>Môn học</div>
                        <div className="text-center">Học Kỳ 1</div>
                        <div className="text-center">Học Kỳ 2</div>
                      </div>

                      <div>
                        {subjectsRight.map((subject) => (
                          <div key={subject} className="grid grid-cols-3 gap-4 items-center mb-3">
                            <div className="font-semibold">{subject}</div>
                            <div>{renderScoreInput(subject, "11")}</div>
                            <div>{renderScoreInput(subject, "12")}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center mt-10">
                    <button
                      onClick={() => {
                        // Temporary: console.log the scores object
                        console.log("Scores:", scores);
                        alert("Save thành công!");
                      }}
                      className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-2xl px-16 py-3 rounded-full"
                    >
                      Save
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
