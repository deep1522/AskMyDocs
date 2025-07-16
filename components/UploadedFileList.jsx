export default function UploadedFileList({ files }) {
    return (
      <div className="p-4 bg-white border rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-2">Uploaded Files</h3>
        <ul className="space-y-1">
          {files.map((file, i) => (
            <li key={i} className="text-sm text-gray-800">
              📄 {file.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  