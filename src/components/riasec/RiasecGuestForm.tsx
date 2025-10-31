import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/Auth"; // dùng để biết user đã đăng nhập chưa

type Trait = "R" | "I" | "A" | "S" | "E" | "C";

type Question = {
  id: string;
  trait: Trait;
  text: string;
};

const TRAIT_LABEL: Record<Trait, string> = {
  R: "Realistic (Thực tế)",
  I: "Investigative (Nghiên cứu)",
  A: "Artistic (Nghệ thuật)",
  S: "Social (Xã hội)",
  E: "Enterprising (Quản trị/Kinh doanh)",
  C: "Conventional (Quy củ/Hệ thống)",
};

const TRAIT_SUMMARY: Record<Trait, string> = {
  R: "Thực hành, thích làm việc với máy móc, công cụ, môi trường ngoài trời.",
  I: "Phân tích, thích tìm hiểu nguyên lý, dữ liệu, nghiên cứu.",
  A: "Sáng tạo, thẩm mỹ, thích thiết kế/biểu đạt.",
  S: "Giúp đỡ, giao tiếp, đào tạo, chăm sóc cộng đồng.",
  E: "Dẫn dắt, thuyết phục, kinh doanh, lập chiến lược.",
  C: "Tổ chức, quy trình, chi tiết, dữ liệu – thích làm việc theo chuẩn.",
};

// Gợi ý ngành chi tiết (hiển thị khi đã đăng nhập)
const TRAIT_MAJORS: Record<Trait, string[]> = {
  R: ["Kỹ thuật cơ khí", "Xây dựng", "Kỹ thuật điện - điện tử", "Logistics vận hành"],
  I: ["Khoa học máy tính / AI", "Phân tích dữ liệu", "Sinh học / Hóa học ứng dụng"],
  A: ["Thiết kế đồ họa", "Thiết kế UX/UI", "Truyền thông đa phương tiện", "Kiến trúc"],
  S: ["Sư phạm / Đào tạo", "Công tác xã hội", "Y tế cộng đồng", "Tâm lý học"],
  E: ["Quản trị kinh doanh", "Marketing", "Tài chính - Khởi nghiệp", "Quản trị du lịch"],
  C: ["Kế toán - Kiểm toán", "Quản trị hệ thống thông tin", "Thư ký - Hành chính"],
};

const LIKERT = [
  { value: 1, label: "Rất không đồng ý" },
  { value: 2, label: "Không đồng ý" },
  { value: 3, label: "Trung lập" },
  { value: 4, label: "Đồng ý" },
  { value: 5, label: "Rất đồng ý" },
];

// 18 câu – 3 câu cho mỗi nhóm (gọn mà vẫn đủ tín hiệu)
const QUESTIONS: Question[] = [
  // R
  { id: "q1", trait: "R", text: "Tôi thích sửa chữa hoặc lắp ráp máy móc, đồ vật." },
  { id: "q2", trait: "R", text: "Tôi thích các hoạt động ngoài trời, vận động thể chất." },
  { id: "q3", trait: "R", text: "Tôi thích dùng công cụ để tạo ra thứ gì đó hữu ích." },
  // I
  { id: "q4", trait: "I", text: "Tôi thích phân tích vấn đề và tìm ra nguyên lý đằng sau." },
  { id: "q5", trait: "I", text: "Tôi hứng thú với nghiên cứu khoa học / dữ liệu." },
  { id: "q6", trait: "I", text: "Tôi thích viết code, giải thuật hoặc thí nghiệm." },
  // A
  { id: "q7", trait: "A", text: "Tôi thích vẽ, thiết kế, chụp ảnh hoặc sáng tác." },
  { id: "q8", trait: "A", text: "Tôi quan tâm thẩm mỹ và cách thể hiện ý tưởng." },
  { id: "q9", trait: "A", text: "Tôi thích những công việc không quá gò bó, có tự do sáng tạo." },
  // S
  { id: "q10", trait: "S", text: "Tôi thích hỗ trợ, lắng nghe và hướng dẫn người khác." },
  { id: "q11", trait: "S", text: "Tôi làm việc nhóm tốt và muốn tạo giá trị cho cộng đồng." },
  { id: "q12", trait: "S", text: "Tôi kiên nhẫn khi giải thích điều khó cho người khác." },
  // E
  { id: "q13", trait: "E", text: "Tôi thích dẫn dắt nhóm và đưa ra quyết định." },
  { id: "q14", trait: "E", text: "Tôi quan tâm kinh doanh/khởi nghiệp, thuyết phục người khác." },
  { id: "q15", trait: "E", text: "Tôi thích thương lượng, xây dựng quan hệ và đạt mục tiêu." },
  // C
  { id: "q16", trait: "C", text: "Tôi chú ý chi tiết và làm việc có trình tự rõ ràng." },
  { id: "q17", trait: "C", text: "Tôi thấy thoải mái với số liệu, biểu mẫu, quy trình." },
  { id: "q18", trait: "C", text: "Tôi thích công việc ổn định, quy củ và có hướng dẫn rõ ràng." },
];

export default function RiasecGuestForm() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = Object.keys(answers).length === QUESTIONS.length;

  const scores = useMemo(() => {
    const init: Record<Trait, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    for (const q of QUESTIONS) {
      const v = answers[q.id] ?? 0;
      init[q.trait] += v;
    }
    return init;
  }, [answers]);

  const ranking = useMemo(() => {
    return (Object.keys(scores) as Trait[])
      .map((t) => ({ trait: t, score: scores[t] }))
      .sort((a, b) => b.score - a.score);
  }, [scores]);

  const top3 = ranking.slice(0, 3).map((r) => r.trait).join("");

  const handleChange = (qid: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allAnswered) {
      alert("Bạn cần trả lời tất cả câu hỏi trước khi xem kết quả.");
      return;
    }
    setSubmitted(true);
    
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Trắc nghiệm RIASEC (dành cho khách)</h1>
        <p className="text-gray-600">
          Đánh giá xu hướng nghề nghiệp theo 6 nhóm: Realistic, Investigative, Artistic, Social, Enterprising, Conventional.
        </p>
      </header>

      {!submitted && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {QUESTIONS.map((q, idx) => (
            <div key={q.id} className="rounded-xl border bg-white p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium">
                  {idx + 1}. {q.text}
                </div>
                <span className="text-xs text-gray-500">{TRAIT_LABEL[q.trait]}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {LIKERT.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-2 rounded-lg border p-2 cursor-pointer hover:bg-gray-50 ${
                      answers[q.id] === opt.value ? "border-[#EB5A0D]" : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      className="accent-[#EB5A0D]"
                      checked={answers[q.id] === opt.value}
                      onChange={() => handleChange(q.id, opt.value)}
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Đã trả lời: {Object.keys(answers).length}/{QUESTIONS.length}
            </div>
            <button
              type="submit"
              disabled={!allAnswered}
              className={`px-4 py-2 rounded-md text-white ${
                allAnswered ? "bg-[#EB5A0D] hover:opacity-90" : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Xem kết quả
            </button>
          </div>
        </form>
      )}

      {submitted && (
        <div className="space-y-6">
          {/* Tóm tắt điểm */}
          <section className="rounded-xl border bg-white p-5">
            <h2 className="text-lg font-semibold mb-2">Kết quả tóm tắt</h2>
            <p className="text-gray-600 mb-4">
              Bộ 3 nổi trội: <b>{top3}</b>
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {(Object.keys(scores) as Trait[]).map((t) => {
                // scale max = 3 câu * 5 điểm = 15
                const percent = Math.round((scores[t] / 15) * 100);
                return (
                  <div key={t} className="p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium">{TRAIT_LABEL[t]}</div>
                      <div className="text-sm text-gray-500">{scores[t]} / 15</div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded">
                      <div
                        className="h-2 bg-[#EB5A0D] rounded"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{TRAIT_SUMMARY[t]}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Chặn chi tiết khi chưa đăng nhập */}
          {!user && (
            <section className="rounded-xl border bg-white p-5">
              <h3 className="font-semibold mb-2">Gợi ý ngành phù hợp (đầy đủ)</h3>
              <p className="text-gray-600">
                Để xem **ngành học phù hợp** theo từng nhóm RIASEC và lộ trình chi tiết, vui lòng đăng nhập.
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  className="px-4 py-2 rounded-md bg-black text-white hover:opacity-90"
                  onClick={() => navigate("/loginprivate")}
                >
                  Đăng nhập để xem chi tiết
                </button>
                <button
                  className="px-4 py-2 rounded-md border hover:bg-gray-50"
                  onClick={() => {
                    // quay lại chỉnh câu trả lời
                    setSubmitted(false);
                  }}
                >
                  Làm lại bài
                </button>
              </div>
            </section>
          )}

          {/* Nếu đã đăng nhập, hiển thị gợi ý ngành chi tiết */}
          {user && (
            <section className="rounded-xl border bg-white p-5">
              <h3 className="font-semibold mb-4">Gợi ý ngành học theo điểm mạnh của bạn</h3>

              <div className="grid md:grid-cols-2 gap-4">
                {ranking.map(({ trait }) => (
                  <div key={trait} className="p-4 rounded-lg border">
                    <div className="font-medium mb-1">{TRAIT_LABEL[trait]}</div>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {TRAIT_MAJORS[trait].map((m) => (
                        <li key={m}>{m}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-sm text-gray-500">
                Gợi ý được sắp theo mức điểm từ cao xuống thấp. Bạn có thể kết hợp Top-2/Top-3
                (ví dụ {top3}) để chọn chuyên ngành phù hợp nhất.
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
