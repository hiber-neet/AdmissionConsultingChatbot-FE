import { useState } from "react";

export default function ArticleEditor() {
  const [title, setTitle] = useState("");
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
            <div className="text-sm text-gray-500 mb-1">Status</div>
            <select className="w-full border rounded-md px-2 py-2 text-sm">
              <option>Draft</option>
              <option>Review</option>
              <option>Published</option>
            </select>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">Category / University</div>
            <select className="w-full border rounded-md px-2 py-2 text-sm">
              <option>Select category</option>
              <option>MIT</option>
              <option>UC Berkeley</option>
              <option>Stanford</option>
            </select>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">Tags</div>
            <input className="w-full border rounded-md px-2 py-2 text-sm" placeholder="Add tag..." />
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">Featured Image URL</div>
            <input className="w-full border rounded-md px-2 py-2 text-sm" placeholder="https://..." />
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">SEO Title</div>
            <input className="w-full border rounded-md px-2 py-2 text-sm" />
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">Meta Description</div>
            <textarea className="w-full border rounded-md px-2 py-2 text-sm min-h-[90px]" />
          </div>

          <div className="text-xs text-gray-400 pt-2">Last Modified • Not saved</div>
        </div>
      </div>
    </div>
  );
}
