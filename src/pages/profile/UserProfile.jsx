import React, { useState, useEffect } from "react";
import axios from "axios";  
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import banner from "@/assets/images/login-private.jpg";   
// import { BASE } from "@/configs/base";  

const SidebarItem = ({ active, icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition
      ${
        active
          ? "bg-[#FFF3ED] text-[#EB5A0D]"
          : "hover:bg-gray-50 text-gray-600"
      }`}
  >
    <span className="text-base">{icon}</span>
    <span>{label}</span>
  </button>
);

const UserProfile = () => {
  const [tab, setTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
const [consultants] = useState([
  { id: "c1", name: "Ms. Linh", role: "Tư vấn tuyển sinh", avatar: "https://i.pravatar.cc/100?img=11" },
  { id: "c2", name: "Mr. Nam", role: "Tư vấn học vụ", avatar: "https://i.pravatar.cc/100?img=12" },
  { id: "c3", name: "Ms. Hanh", role: "Hướng nghiệp", avatar: "https://i.pravatar.cc/100?img=13" },
]);

const [selectedConsultant, setSelectedConsultant] = useState(null);
const [cMessages, setCMessages] = useState({}); // { [consultantId]: Message[] }
const [cInput, setCInput] = useState("");

const openConsultant = (c) => {
  setSelectedConsultant(c);
  setCMessages((prev) => {
    if (prev[c.id]) return prev;
    return {
      ...prev,
      [c.id]: [
        {
          sender: "bot",
          text: `Xin chào, mình là ${c.name} – ${c.role}. Bạn cần hỗ trợ gì?`,
        },
      ],
    };
  });
};

//tin nhắn trong tab Consultant
const handleConsultSend = (e) => {
  e.preventDefault();
  if (!selectedConsultant || !cInput.trim()) return;

  const id = selectedConsultant.id;

  setCMessages((prev) => ({
    ...prev,
    [id]: [...(prev[id] || []), { sender: "user", text: cInput }],
  }));

  // stimulate response
  const userText = cInput;
  setCInput("");
  setTimeout(() => {
    setCMessages((prev) => ({
      ...prev,
      [id]: [
        ...(prev[id] || []),
        {
          sender: "bot",
          text: `${selectedConsultant.name} đã nhận câu hỏi: "${userText}". Mình sẽ phản hồi chi tiết sớm nhất nhé!`,
        },
      ],
    }));
  }, 700);
};

  const [form, setForm] = useState({
    name: "Nguyen Thanh Dat",
    email: "a@gmail.com",
    phone: "0123456789",
    admissionScore: "25",
    subjects: "Toan, Ly, Hoa",
    studyField: "Technology",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${BASE.BASE_URL}/account/profile`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      setForm(response.data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

const handleAdmissionScoreChange = (e) => {
    if (!editing) return;
    let val = e.target.value;
    if(val === ""){
      setForm((p) => ({ ...p, admissionScore: "" }));
      return;
    }

    const num = Number(val);
    if(Number.isNaN(num)) return;
    const clamped = Math.max(0, Math.min(30, num));
    setForm((p) => ({ ...p, admissionScore: clamped }));
  };

const handleSend = (e) => {
  e.preventDefault();
  if (!input.trim()) return;

  const userMsg = { sender: "user", text: input };
  setMessages((prev) => [...prev, userMsg]);

  // Giả lập phản hồi của chatbot
  setTimeout(() => {
    const botReply = {
      sender: "bot",
      text: `Cảm ơn bạn đã hỏi: "${input}".`,
    };
    setMessages((prev) => [...prev, botReply]);
  }, 800);

  setInput("");
};


  const handleChange = (e) =>
  {
     if (!editing) return; 
         setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }


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
    await axios.put(`${BASE.BASE_URL}/account/update`, form);
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
            alt="Shop Banner"
            className="w-full h-[250px] object-cover rounded-2xl shadow-md"
          />
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold mb-6">
          Welcome, <span className="text-[#EB5A0D]">{form.name}</span>
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
              <div className="mt-6 text-xs text-gray-400 px-2">Help</div>
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <section className="col-span-12 md:col-span-9">
            {tab === "profile" && (
              <div className="rounded-2xl overflow-hidden border border-gray-200">
                <div className="h-14 bg-[#EB5A0D]" />
                <div className="p-6">
                  {/* avatar + name */}
                  <div className="flex items-end gap-4 mb-6 -mt-2">
                    <div className="pb-1">
                      <div className="font-semibold">{form.name}</div>
                      <div className="text-sm text-gray-500">{form.email}</div>
                    </div>
                  </div>

                  <form onSubmit={onSave} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm text-gray-500">Full Name</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        disabled={!editing}
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB5A0D]"
                      />
                    </div>
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

                    <div>
                      <label className="text-sm text-gray-500">What do you want to study?</label>
                      <input
                        name="studyField"
                        value={form.studyField}
                        onChange={handleChange}
                        disabled={!editing}
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB5A0D]"
                      />
                    </div>

                    <div className="col-span-1 sm:col-span-2 flex items-center justify-center gap-3 mt-2">
                      {!editing ? (
                        <button
                          type="button"
                          onClick={(e) => {
                          e.preventDefault();

                          setEditing(true)}}
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
    {/* Header */}
    <div className="bg-[#EB5A0D] flex justify-center text-white px-6 py-3 text-lg font-semibold rounded-t-2xl">
      ChatBotFPT
    </div>

    {/* Chat area */}
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
      {messages.length === 0 ? (
        <p className="text-gray-400 text-center mt-10">
          Hello, welcome to ChatBotFPT! How can I assist you today?
        </p>
      ) : (
        messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 max-w-[70%] rounded-xl text-sm ${
                msg.sender === "user"
                  ? "bg-[#EB5A0D] text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))
      )}
    </div>

    {/* Input area */}
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
        className="px-4 py-2 bg-[#EB5A0D] text-white rounded-md hover:opacity-90 transition"
      >
        Gửi
      </button>
    </form>
  </div>
)}

            {tab === "consultant" && (
  <div className="rounded-2xl border border-gray-200 bg-white grid grid-cols-12 overflow-hidden min-h-[600px]">
    {/* Sidebar consultants */}
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
            <img
              src={c.avatar}
              alt={c.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-gray-500">{c.role}</div>
            </div>
          </li>
        ))}
      </ul>
    </aside>

    {/* Chat area */}
    <section className="col-span-12 md:col-span-8 flex flex-col">
      <div className="bg-[#EB5A0D] text-white px-6 py-3 text-lg font-semibold text-center">
        {selectedConsultant ? `Chat với ${selectedConsultant.name} ` : "Chọn một tư vấn viên để bắt đầu"}
      </div>

      {/* Nội dung chat */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {!selectedConsultant ? (
          <div className="text-gray-400 text-center mt-10">
            Hãy chọn một tư vấn viên ở danh sách bên trái để trò chuyện 💬
          </div>
        ) : (
          (cMessages[selectedConsultant.id] || []).map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 max-w-[70%] rounded-xl text-sm ${
                  msg.sender === "user"
                    ? "bg-[#EB5A0D] text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Ô nhập */}
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
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default UserProfile;
