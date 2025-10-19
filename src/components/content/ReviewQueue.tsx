// src/components/content/ReviewQueue.tsx
import { useEffect, useState } from "react";
import { Check, X, MessageSquare, Edit3 } from "lucide-react";

type Item = {
  title: string;
  author: string;
  submitted: string;
  category: string;
  tags: string[];
  summary: string;
};

const items: Item[] = [
  {
    title: "Financial Aid Checklist – Complete FAFSA Guide",
    author: "Michael Torres",
    category: "Financial Aid",
    submitted: "2024-10-03",
    tags: ["Financial Aid", "FAFSA", "Scholarships"],
    summary:
      "Step-by-step walkthrough of the FAFSA application process with important deadlines and required documentation.",
  },
  {
    title: "International Student Visa Guide – F-1 Process",
    author: "Michael Torres",
    category: "International",
    submitted: "2024-10-02",
    tags: ["International", "Visa", "F-1"],
    summary:
      "Complete guide for international students on obtaining F-1 student visa including documentation and interview preparation.",
  },
];

export default function ReviewQueue() {
  const empty = false;

  // NEW: state cho modal "Request Changes"
  const [openFor, setOpenFor] = useState<Item | null>(null);
  const [feedback, setFeedback] = useState("");

  // NEW: đóng modal bằng phím ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenFor(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const submitFeedback = () => {
    if (!feedback.trim()) {
      alert("Vui lòng nhập nội dung phản hồi.");
      return;
    }
    // TODO: gọi API gửi feedback tại đây
    alert(`Đã gửi phản hồi cho: ${openFor?.title}\n\n${feedback}`);
    setFeedback("");
    setOpenFor(null);
  };

  if (empty) {
    return (
      <div className="p-6">
        <div className="text-xl font-semibold">Review Queue</div>
        <div className="text-sm text-gray-500 mb-6">0 articles awaiting</div>
        <div className="bg-white border rounded-2xl p-12 text-center text-gray-500">
          <div className="text-5xl mb-4">✓</div>
          No Articles In Review — Great work!
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-2 text-xl font-semibold">Review Queue</div>
      <div className="text-sm text-gray-500 mb-6">
        {items.length} articles awaiting <span className="ml-1">review</span>
      </div>

      <div className="space-y-6">
        {items.map((i, idx) => (
          <div key={idx} className="bg-white border rounded-2xl p-5 shadow-sm/5">
            {/* Title + badge */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold leading-6">{i.title}</h3>
                <span className="inline-flex items-center rounded-full bg-orange-100 text-orange-700 text-xs px-2 py-0.5">
                  In Review
                </span>
              </div>
            </div>

            {/* Meta line */}
            <div className="mt-2 text-xs text-gray-600 flex flex-wrap items-center gap-2">
              <span>By {i.author}</span>
              <span className="mx-1">•</span>
              <span>
                <span className="text-gray-500">Category:</span> {i.category}
              </span>
              <span className="mx-1">•</span>
              <span>
                <span className="text-gray-500">Submitted:</span> {i.submitted}
              </span>
            </div>

            {/* Tags */}
            <div className="mt-3 flex flex-wrap gap-2">
              {i.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Summary box */}
            <div className="mt-4 rounded-lg bg-gray-50 text-gray-700 text-sm px-4 py-3">
              {i.summary}
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-md bg-green-600 text-white text-sm px-3 py-2 hover:opacity-90">
                <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-white/15">
                  <Check className="h-3.5 w-3.5" />
                </span>
                Approve & Publish
              </button>

              {/* NEW: mở modal */}
              <button
                onClick={() => {
                  setOpenFor(i);
                  setFeedback("");
                }}
                className="inline-flex items-center gap-2 rounded-md border text-sm px-3 py-2 hover:bg-gray-50"
              >
                <MessageSquare className="h-4 w-4" />
                Request Changes
              </button>

              <button className="inline-flex items-center gap-2 rounded-md border text-sm px-3 py-2 hover:bg-gray-50">
                <Edit3 className="h-4 w-4" />
                Open to Edit
              </button>

              <button className="inline-flex items-center gap-2 rounded-md border text-sm px-3 py-2 hover:bg-gray-50">
                <X className="h-4 w-4" />
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* NEW: Modal Request Changes */}
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
                  <h2 className="text-xl font-semibold">Request Changes</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Provide feedback for the author about what needs to be revised
                  </p>
                </div>
                <button
                  onClick={() => setOpenFor(null)}
                  className="p-1.5 rounded-md hover:bg-gray-100"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-5 text-sm">
                <div className="text-gray-700">
                  <span className="font-medium text-gray-900">Article: </span>
                  {openFor.title}
                </div>

                <textarea
                  rows={5}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Explain what changes are needed..."
                  className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-black/60"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setOpenFor(null)}
                  className="px-4 py-2 rounded-xl border hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitFeedback}
                  className="px-5 py-2 rounded-xl bg-black text-white hover:opacity-90"
                >
                  Send Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
