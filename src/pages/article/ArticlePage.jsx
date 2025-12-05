import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("vi-VN");
}

export default function ArticlePage() {
  const [articles, setArticles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    async function fetchArticles() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("access_token");

        const res = await fetch(`${API_BASE_URL}/articles`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Fetch articles failed: ${res.status}`);
        }

        const data = await res.json();

        const normalized = (data || []).filter(
          (item) => item.status === "published"
        );

        setArticles(normalized);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError(err.message || "Đã xảy ra lỗi khi tải bài viết");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();

    return () => controller.abort();
  }, []);

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-10">
        {loading && (
          <p className="text-center text-gray-500 mt-10">
            Đang tải bài viết...
          </p>
        )}

        {!loading && error && (
          <p className="text-center text-red-500 mt-10">{error}</p>
        )}

        {/* Danh sách bài viết */}
        {!loading && !error && !selected && (
          <>
            <h1 className="text-3xl mt-10 font-semibold mb-6 text-center text-[#EB5A0D]">
              Tin tức & Bài viết
            </h1>

            {articles.length === 0 ? (
              <p className="text-center text-gray-500">
                Hiện chưa có bài viết nào.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((a) => (
                  <div
                    key={a.article_id}
                    className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer bg-white"
                    onClick={() => setSelected(a)}
                  >
                    <img
                      src={a.url}
                      alt={a.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h2 className="text-lg font-semibold mb-1 line-clamp-2">
                        {a.title}
                      </h2>

                      {a.author_name && (
                        <p className="text-xs text-gray-500 mb-1">
                          Tác giả: {a.author_name}
                        </p>
                      )}

                      <p className="text-sm text-gray-600 line-clamp-3">
                        {a.description}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-400">
                          {formatDate(a.create_at)}
                        </p>
                        <span className="text-[10px] uppercase px-2 py-1 rounded-full bg-green-100 text-green-700">
                          {a.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Chi tiết bài viết */}
        {!loading && !error && selected && (
          <article className="bg-white rounded-xl shadow-sm p-6">
            <button
              onClick={() => setSelected(null)}
              className="mb-4 text-sm text-[#EB5A0D] hover:underline"
            >
              ← Quay lại danh sách
            </button>

            <img
              src={selected.url}
              alt={selected.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />

            <h1 className="text-2xl font-semibold mb-1">
              {selected.title}
            </h1>

<div className="text-sm text-gray-500 mb-4">
  <div>Ngày: {formatDate(selected.create_at)}</div>

  {selected.author_name && (
    <div>Tác giả: {selected.author_name}</div>
  )}
</div>

            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {selected.description}
            </p>
          </article>
        )}
      </div>
      <Footer />
    </>
  );
}
