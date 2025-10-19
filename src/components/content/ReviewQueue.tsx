import { Check, X, MessageSquare } from "lucide-react";

const items = [
  {
    title: "Financial Aid Checklist – Complete FAFSA Guide",
    author: "Michael Torres",
    submitted: "2024-10-21",
    tags: ["Financial Aid", "FAFSA", "Scholarship"],
  },
  {
    title: "International Student Visa Guide – F-1 Process",
    author: "Michael Torres",
    submitted: "2024-10-20",
    tags: ["International", "Visa", "F-1"],
  },
];

export default function ReviewQueue() {
  const empty = false; // set true to see empty state

  if (empty) {
    return (
      <div className="p-6">
        <div className="text-xl font-semibold mb-4">Review Queue</div>
        <div className="bg-white border rounded-xl p-12 text-center text-gray-500">
          <div className="text-5xl mb-4">✓</div>
          No Articles In Review — Great work!
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="text-xl font-semibold mb-4">Review Queue</div>

      <div className="space-y-4">
        {items.map((i, idx) => (
          <div key={idx} className="bg-white border rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{i.title}</div>
                <div className="text-xs text-gray-500 mt-1">
                  By {i.author} • Submitted {i.submitted}
                </div>
                <div className="flex gap-2 mt-2">
                  {i.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="px-3 py-2 text-sm rounded-md bg-green-600 text-white hover:opacity-90">
                  <div className="flex items-center gap-1">
                    <Check size={14} /> Approve & Publish
                  </div>
                </button>
                <button className="px-3 py-2 text-sm rounded-md border hover:bg-gray-50">
                  <div className="flex items-center gap-1">
                    <MessageSquare size={14} /> Request Change
                  </div>
                </button>
                <button className="px-3 py-2 text-sm rounded-md border hover:bg-gray-50">
                  Open in Editor
                </button>
                <button className="px-3 py-2 text-sm rounded-md border hover:bg-gray-50">
                  <X size={14} /> Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
