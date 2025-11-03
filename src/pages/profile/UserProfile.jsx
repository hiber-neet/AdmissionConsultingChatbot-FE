// src/pages/private/UserProfile.jsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import banner from "@/assets/images/login-private.jpg";
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

  


  // Chatbot states
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [partialResponse, setPartialResponse] = useState("");
  const wsRef = useRef(null);
  const partialRef = useRef("");
  const [wsReady, setWsReady] = useState(false);

  
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
    fullName: "Nguyễn Thanh Đạt",
    gender: "male",
    dob: "2006-01-01",
    email: "a@gmail.com",
    phone: "0123456789",
    address: "Thủ Đức, TP.HCM",
    school: "THPT Demo",
    grade: "12",
    admissionScore: "25",
    subjects: "Toán, Lý, Hóa",
    preferredMajor: "Kỹ thuật phần mềm",
    riasecCode: "RIA",  
  });

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
    if (!input.trim()) return;
    const msg = input;
    setMessages((prev) => [...prev, { sender: "user", text: msg }]);
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
              <div className="rounded-2xl border border-gray-200 bg-white flex flex-col h-[600px]">
                <div className="bg-[#EB5A0D] flex justify-center text-white px-6 py-3 text-lg font-semibold rounded-t-2xl">
                  ChatBotFPT
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                  {messages.length === 0 ? (
                    <p className="text-gray-400 text-center mt-10">
                      Hello, welcome to ChatBotFPT! How can I assist you today?
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
                    disabled={!wsReady || !input.trim()}
                    className={`px-4 py-2 rounded-md text-white transition ${
                      !wsReady || !input.trim()
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-[#EB5A0D] hover:opacity-90"
                    }`}
                  >
                    {wsReady ? "Gửi" : "Đang kết nối..."}
                  </button>
                </form>
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
                <h2 className="text-xl font-semibold mb-1">Tải lên học bạ</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Chấp nhận: PDF, JPG, PNG (tối đa {MAX_MB}MB mỗi file). Bạn có thể tải lên nhiều trang.
                </p>

                <div className="grid gap-4">
<div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
  {/* Ẩn input thật, dùng label làm nút */}
  <input
    id="transcriptFiles"
    type="file"
    multiple
    accept=".pdf,image/png,image/jpeg"
    onChange={onPickFiles}
    className="hidden"
  />
  <label
    htmlFor="transcriptFiles"
    className="inline-flex items-center px-4 py-2 rounded-md bg-[#EB5A0D] text-white cursor-pointer hover:opacity-90"
  >
    Chọn file
  </label>

  {/* Thông tin ngắn gọn thay cho “No file chosen” */}
  <span className="text-sm text-gray-600">
    {files.length ? `${files.length} file đã chọn` : "Chưa chọn file"}
  </span>

  {/* Nút tải lên dạt phải nhưng vẫn cùng một hàng */}
  <div className="ml-auto">
    <button
      type="button"
      onClick={uploadTranscript}
      disabled={!files.length || uploading}
      className={`px-4 py-2 rounded-md text-white ${
        !files.length || uploading
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-[#EB5A0D] hover:opacity-90"
      }`}
    >
      {uploading ? "Đang tải..." : "Tải lên"}
    </button>
  </div>
</div>

                  {/* Danh sách file đang chờ upload */}
                  {files.length > 0 && (
                    <div className="border rounded-lg p-3">
                      <div className="font-medium mb-2">Hàng chờ ({files.length})</div>
                      <ul className="space-y-2">
                        {files.map((f, i) => (
                          <li key={i} className="flex items-center justify-between text-sm">
                            <span className="truncate">
                              {f.name} <span className="text-gray-500">({(f.size / (1024 * 1024)).toFixed(2)}MB)</span>
                            </span>
                            <button onClick={() => removeFile(i)} className="text-red-600 hover:underline">
                              Xóa
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Danh sách đã upload */}
{uploaded.length > 0 && (
  <div className="border rounded-lg p-3">
    <div className="font-medium mb-3">Đã tải lên ({uploaded.length})</div>
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
      {uploaded.map((u, idx) => (
        <div key={idx} className="relative border rounded-md p-2 text-sm">
          {/* Nút Xóa ở góc phải trên */}
          <button
            type="button"
            onClick={() => deleteUploaded(idx)}
            className="absolute top-2 right-2 rounded-md px-2 py-1 text-xs bg-red-100 text-red-600 hover:bg-red-200"
            title="Xóa file này"
          >
            Xóa
          </button>

          <div className="font-medium truncate pr-10 mb-1">{u.name}</div>
          <div className="text-gray-500 mb-2">{(u.size / (1024 * 1024)).toFixed(2)}MB</div>

          {u.preview ? (
            <img src={u.preview} alt={u.name} className="w-full h-32 object-cover rounded" />
          ) : (
            <div className="h-32 flex items-center justify-center bg-gray-50 rounded">
              <span className="text-gray-400">PDF</span>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
)}
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
