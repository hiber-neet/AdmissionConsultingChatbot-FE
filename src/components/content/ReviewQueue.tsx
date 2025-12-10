import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "react-toastify";
import { articlesAPI } from "../../services/fastapi";
import { ReviewArticle } from "../../types/review.types";

export default function ReviewQueue() {
  const [articles, setArticles] = useState<ReviewArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFor, setOpenFor] = useState<ReviewArticle | null>(null);
  const [feedback, setFeedback] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch articles for review on component mount
  useEffect(() => {
    fetchReviewQueue();
  }, []);

  const fetchReviewQueue = async () => {
    setLoading(true);
    try {
      const data = await articlesAPI.getReviewQueue();
      setArticles(data);
    } catch (error) {
      console.error('Failed to fetch review queue:', error);
      toast.error('Không thể tải bài viết cần duyệt. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Handle approval
  const handleApprove = async (article: ReviewArticle) => {
    setActionLoading(true);
    try {
      await articlesAPI.updateStatus(article.article_id, {
        status: "published",
        note: "Đã Phê Duyệt"
      });
      toast.success(`Bài viết "${article.title}" đã được phê duyệt và xuất bản!`);
      await fetchReviewQueue(); // Refresh the list
    } catch (error) {
      console.error('Failed to approve article:', error);
      toast.error('Không thể phê duyệt bài viết. Vui lòng thử lại.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle rejection with mandatory reason
  const handleReject = (article: ReviewArticle) => {
    setOpenFor(article);
    setFeedback("");
  };

  // Submit rejection with reason
  const submitFeedback = async () => {
    if (!feedback.trim()) {
      toast.error("Vui lòng cung cấp lý do từ chối.");
      return;
    }
    
    if (!openFor) return;

    setActionLoading(true);
    try {
      await articlesAPI.updateStatus(openFor.article_id, {
        status: "rejected",
        note: feedback
      });
      toast.success(`Bài viết "${openFor.title}" đã bị từ chối.`);
      setFeedback("");
      setOpenFor(null);
      await fetchReviewQueue(); // Refresh the list
    } catch (error) {
      console.error('Failed to reject article:', error);
      toast.error('Không thể từ chối bài viết. Vui lòng thử lại.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle escape key for modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenFor(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-xl font-semibold">Hàng Đợi Duyệt Bài</div>
        <div className="text-sm text-gray-500 mb-6">Đang tải...</div>
        <div className="bg-white border rounded-2xl p-12 text-center text-gray-500">
          <div className="text-lg">Đang tải bài viết cần duyệt...</div>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="p-6">
        <div className="text-xl font-semibold">Hàng Đợi Duyệt Bài</div>
        <div className="text-sm text-gray-500 mb-6">0 bài viết đang chờ duyệt</div>
        <div className="bg-white border rounded-2xl p-12 text-center text-gray-500">
          <div className="text-5xl mb-4">✓</div>
          Không Có Bài Viết Cần Duyệt — Làm Tốt Lắm!
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-2 text-xl font-semibold">Hàng Đợi Duyệt Bài</div>
      <div className="text-sm text-gray-500 mb-6">
        {articles.length} bài viết đang chờ <span className="ml-1">duyệt</span>
      </div>

      <div className="space-y-6">
        {articles.map((article) => (
          <div key={article.article_id} className="bg-white border rounded-2xl p-5 shadow-sm/5">
            {/* Title + badge */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold leading-6">{article.title}</h3>
                <span className="inline-flex items-center rounded-full bg-orange-100 text-orange-700 text-xs px-2 py-0.5">
                  Đang Duyệt
                </span>
              </div>
            </div>

            {/* Meta line */}
            <div className="mt-2 text-xs text-gray-600 flex flex-wrap items-center gap-2">
              <span>Bởi {article.author_name || 'Không Rõ Tác Giả'}</span>
              <span className="mx-1">•</span>
              <span>
                <span className="text-gray-500">Danh Mục:</span> {article.major_name || 'Chung'}
              </span>
              <span className="mx-1">•</span>
              <span>
                <span className="text-gray-500">Gửi Lúc:</span> {new Date(article.create_at).toLocaleDateString()}
              </span>
            </div>

            {/* Tags */}
            <div className="mt-3 flex flex-wrap gap-2">
              {article.major_name && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                  {article.major_name}
                </span>
              )}
              {article.specialization_name && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                  {article.specialization_name}
                </span>
              )}
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                {article.status}
              </span>
            </div>

            {/* Summary box */}
            <div className="mt-4 rounded-lg bg-gray-50 text-gray-700 text-sm px-4 py-3">
              {article.description}
            </div>

            {/* URL if available */}
            {article.url && (
              <div className="mt-2 text-sm">
                <span className="text-gray-500">URL:</span>{" "}
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {article.url}
                </a>
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button 
                onClick={() => handleApprove(article)}
                disabled={actionLoading}
                className="inline-flex items-center gap-2 rounded-md bg-green-600 text-white text-sm px-3 py-2 hover:opacity-90 disabled:opacity-50"
              >
                <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-white/15">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {actionLoading ? 'Đang xử lý...' : 'Phê Duyệt & Xuất Bản'}
              </button>

              <button 
                onClick={() => handleReject(article)}
                disabled={actionLoading}
                className="inline-flex items-center gap-2 rounded-md bg-red-600 text-white text-sm px-3 py-2 hover:opacity-90 disabled:opacity-50"
              >
                <X className="h-4 w-4" />Từ Chối</button>
            </div>
          </div>
        ))}
      </div>

      {/* Rejection Reason Modal */}
      {openFor && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={() => setOpenFor(null)}
          aria-modal
          role="dialog"
        >
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/50" />

          {/* dialog */}
          <div
            className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
              <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Từ Chối Bài Viết</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Vui lòng cung cấp lý do từ chối bài viết này
                  </p>
                </div>
                <button
                  onClick={() => setOpenFor(null)}
                  className="p-1.5 rounded-md hover:bg-gray-100"
                  aria-label="Đóng"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-5 text-sm">
                <div className="text-gray-700">
                  <span className="font-medium text-gray-900">Bài Viết: </span>
                  {openFor.title}
                </div>
                <div className="text-gray-700 mt-1">
                  <span className="font-medium text-gray-900">Tác Giả: </span>
                  {openFor.author_name || 'Không Rõ Tác Giả'}
                </div>

                <textarea
                  rows={5}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Vui lòng giải thích lý do từ chối bài viết này..."
                  className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setOpenFor(null)}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl border hover:bg-gray-50 disabled:opacity-50"
                >Hủy</button>
                <button
                  onClick={submitFeedback}
                  disabled={actionLoading || !feedback.trim()}
                  className="px-5 py-2 rounded-xl bg-red-600 text-white hover:opacity-90 disabled:opacity-50"
                >
                  {actionLoading ? 'Đang Từ Chối...' : 'Từ Chối Bài Viết'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
