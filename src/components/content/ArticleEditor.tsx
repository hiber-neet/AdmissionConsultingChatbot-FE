import { useState } from "react";

export default function ArticleEditor({ initialData }: { initialData?: { title: string } }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [body, setBody] = useState("");

  return (
    <div className="p-6">
      {/* Top bar */}
      <div className="bg-white border rounded-xl p-3 mb-4 flex items-center gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article Title"
          className="flex-1 text-lg font-semibold outline-none"
        />
        <button className="px-3 py-2 rounded-md border text-sm hover:bg-gray-50">
          Preview
        </button>
        <button className="px-3 py-2 rounded-md border text-sm hover:bg-gray-50">
          Save Draft
        </button>
        <button className="px-3 py-2 rounded-md bg-black text-white text-sm hover:opacity-90">
          Publish
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        {/* Editor */}
        <div className="bg-white border rounded-xl p-4 min-h-[60vh]">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Start writing your article content here..."
            className="w-full min-h-[50vh] outline-none resize-none"
          />
        </div>

        {/* Side panel */}
        <div className="bg-white border rounded-xl p-4 space-y-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">URL</div>
            <input className="w-full border rounded-md px-2 py-2 text-sm" placeholder="https://..." />
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">Major</div>
            <select className="w-full border rounded-md px-2 py-2 text-sm">
              <option>Select major</option>
              <option>Computer Science</option>
              <option>Business Administration</option>
              <option>Electrical Engineering</option>
              <option>Mechanical Engineering</option>
              <option>Psychology</option>
              <option>Biology</option>
              <option>Economics</option>
              <option>Political Science</option>
              <option>Mathematics</option>
              <option>English Literature</option>
            </select>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">Chuyên ngành hẹp</div>
            <select className="w-full border rounded-md px-2 py-2 text-sm">
              <option>Select specialized major</option>
              <option>Software Engineering</option>
              <option>Data Science</option>
              <option>Cybersecurity</option>
              <option>Artificial Intelligence</option>
              <option>Financial Management</option>
              <option>Digital Marketing</option>
              <option>International Business</option>
              <option>Biomedical Engineering</option>
              <option>Environmental Engineering</option>
              <option>Clinical Psychology</option>
              <option>Cognitive Psychology</option>
              <option>Molecular Biology</option>
              <option>Microbiology</option>
              <option>Econometrics</option>
              <option>International Relations</option>
            </select>
          </div>

          <div className="text-xs text-gray-400 pt-2">Last Modified • Not saved</div>
        </div>
      </div>
    </div>
  );
}
