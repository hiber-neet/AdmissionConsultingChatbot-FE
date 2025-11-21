import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

const mockArticles = [
  {
    id: 1,
    title: "Hướng dẫn chọn ngành học phù hợp với bản thân",
    summary: "Khám phá cách xác định thế mạnh và chọn ngành học đúng đắn dựa trên sở thích, năng lực và xu hướng nghề nghiệp tương lai.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
    content: `Chọn ngành học là một trong những quyết định quan trọng nhất trong đời. 
    Để chọn đúng, bạn cần hiểu rõ bản thân — điểm mạnh, điểm yếu, sở thích, và giá trị cá nhân. 
    Bài test RIASEC có thể giúp bạn xác định xu hướng nghề nghiệp và nhóm tính cách phù hợp.`,
    date: "2025-11-22",
  },
  {
    id: 2,
    title: "Cơ hội việc làm trong ngành Trí tuệ nhân tạo (AI)",
    summary: "AI đang trở thành lĩnh vực mũi nhọn của thế kỷ 21. Tìm hiểu cơ hội nghề nghiệp và kỹ năng cần có để thành công.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    content: `AI (Artificial Intelligence) đang thay đổi mọi lĩnh vực — từ giáo dục, y tế, đến thương mại. 
    Nếu bạn có tư duy logic, yêu thích công nghệ và muốn tạo ra ảnh hưởng lớn, 
    đây là ngành học có tiềm năng phát triển vượt bậc.`,
    date: "2025-11-18",
  },
    {
    id: 3,
    title: "Cơ hội việc làm trong ngành Trí tuệ nhân tạo (AI)",
    summary: "AI đang trở thành lĩnh vực mũi nhọn của thế kỷ 21. Tìm hiểu cơ hội nghề nghiệp và kỹ năng cần có để thành công.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    content: `AI (Artificial Intelligence) đang thay đổi mọi lĩnh vực — từ giáo dục, y tế, đến thương mại. 
    Nếu bạn có tư duy logic, yêu thích công nghệ và muốn tạo ra ảnh hưởng lớn, 
    đây là ngành học có tiềm năng phát triển vượt bậc.`,
    date: "2025-11-18",
  },
    {
    id: 4,
    title: "Cơ hội việc làm trong ngành Trí tuệ nhân tạo (AI)",
    summary: "AI đang trở thành lĩnh vực mũi nhọn của thế kỷ 21. Tìm hiểu cơ hội nghề nghiệp và kỹ năng cần có để thành công.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    content: `AI (Artificial Intelligence) đang thay đổi mọi lĩnh vực — từ giáo dục, y tế, đến thương mại. 
    Nếu bạn có tư duy logic, yêu thích công nghệ và muốn tạo ra ảnh hưởng lớn, 
    đây là ngành học có tiềm năng phát triển vượt bậc.`,
    date: "2025-11-18",
  },
];

export default function ArticlePage() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-10">
        {!selected ? (
          <>
            <h1 className="text-3xl mt-10 font-semibold mb-6 text-center text-[#EB5A0D]">
              Tin tức & Bài viết
            </h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockArticles.map((a) => (
                <div
                  key={a.id}
                  className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer bg-white"
                  onClick={() => setSelected(a)}
                >
                  <img
                    src={a.image}
                    alt={a.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                      {a.title}
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {a.summary}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">{a.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <article className="bg-white rounded-xl shadow-sm p-6">
            <button
              onClick={() => setSelected(null)}
              className="mb-4 text-sm text-[#EB5A0D] hover:underline"
            >
              ← Quay lại danh sách
            </button>
            <img
              src={selected.image}
              alt={selected.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            <h1 className="text-2xl font-semibold mb-2">{selected.title}</h1>
            <p className="text-sm text-gray-400 mb-4">{selected.date}</p>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {selected.content}
            </p>
          </article>
        )}
      </div>
      <Footer />
    </>
  );
}
