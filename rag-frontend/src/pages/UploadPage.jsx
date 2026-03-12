import { useEffect, useState } from "react";
import { getDocuments, uploadDocument } from "../services/api.js";

export default function UploadPage() {
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchDocuments = async () => {
    const response = await getDocuments();
    setDocuments(response.data);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;
    setLoading(true);
    setStatus("");
    try {
      const response = await uploadDocument(selectedFile);
      setStatus(`Uploaded ${response.data.name} (${response.data.chunks} chunks)`);
      setSelectedFile(null);
      await fetchDocuments();
    } catch (error) {
      setStatus(error?.response?.data?.error || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr,1.2fr]">
      <section className="rounded-3xl bg-white/70 p-6 shadow-inner">
        <h2 className="font-display text-2xl text-ink">Upload Documents</h2>
        <p className="mt-2 text-sm text-ink/70">
          Supported formats: PDF, TXT, DOCX. Files are chunked and embedded automatically.
        </p>
        <form onSubmit={handleUpload} className="mt-6 space-y-4">
          <input
            type="file"
            accept=".pdf,.txt,.docx"
            onChange={(event) => setSelectedFile(event.target.files[0])}
            className="w-full rounded-xl border border-white/70 bg-white/80 px-4 py-3 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-clay px-4 py-3 text-sm font-semibold text-white shadow hover:bg-clay/90 disabled:opacity-60"
          >
            {loading ? "Processing..." : "Upload"}
          </button>
        </form>
        {status && <p className="mt-4 text-sm text-ink/70">{status}</p>}
      </section>

      <section className="rounded-3xl bg-white/70 p-6 shadow-inner">
        <h2 className="font-display text-2xl text-ink">Uploaded Files</h2>
        <div className="mt-6 space-y-4">
          {documents.length === 0 && (
            <p className="text-sm text-ink/60">No documents uploaded yet.</p>
          )}
          {documents.map((doc) => (
            <div key={doc.id} className="rounded-2xl border border-white/70 bg-white/80 px-4 py-4">
              <p className="font-semibold text-ink">{doc.name}</p>
              <p className="text-xs text-ink/60">{doc.file_type.toUpperCase()}</p>
              <p className="text-xs text-ink/50 mt-1">
                Uploaded {new Date(doc.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
