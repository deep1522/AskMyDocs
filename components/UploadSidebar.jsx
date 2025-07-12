"use client";
import { useState } from "react";

export default function UploadSidebar() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length === 0) return;

    setLoading(true);
    try {
      for (const file of newFiles) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Upload failed:", text);
          continue;
        }

        setFiles((prev) => [...prev, file.name]);
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute left-8 top-1/2 -translate-y-1/2 w-64 h-[38rem] bg-zinc-800 text-white border border-zinc-700 rounded-xl shadow-lg flex flex-col p-4 overflow-y-auto">

      <h2 className="text-lg font-semibold mb-4">📁 Uploaded Files</h2>

      <ul className="flex-1 space-y-2 text-sm overflow-y-auto">
        {files.length === 0 ? (
          <li className="text-zinc-400">No files uploaded.</li>
        ) : (
          files.map((name, i) => <li key={i}>• {name}</li>)
        )}
      </ul>

      <div className="mt-4">
        <input
          id="file-upload"
          type="file"
          onChange={handleUpload}
          multiple
          disabled={loading}
          className="hidden"
        />
        <label
          htmlFor="file-upload"
          className="block text-center bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded cursor-pointer transition"
        >
          {loading ? "Uploading..." : "Insert Files"}
        </label>
      </div>
    </div>
  );
}
