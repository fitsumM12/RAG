import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
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
      <section className="rounded-3xl bg-secondary/20 p-6 shadow-inner border border-secondary/40">
        <h2 className="font-display text-2xl text-black">Upload Documents</h2>
        <p className="mt-2 text-sm text-black/70">
          Supported formats: PDF, TXT, DOCX. Files are chunked and embedded automatically.
        </p>
        <form onSubmit={handleUpload} className="mt-6 space-y-4">
          <input
            type="file"
            accept=".pdf,.txt,.docx"
            onChange={(event) => setSelectedFile(event.target.files[0])}
            className="w-full rounded-xl border border-secondary/60 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-red px-4 py-3 text-sm font-semibold text-white shadow hover:bg-red/90 disabled:opacity-60"
          >
            <span className="inline-flex items-center justify-center gap-2">
              {loading && (
                <Icon icon="svg-spinners:3-dots-scale" className="text-white text-lg" />
              )}
              {loading ? "Processing..." : "Upload"}
            </span>
          </button>
        </form>
        {status && <p className="mt-4 text-sm text-black/70">{status}</p>}
      </section>

      <section className="rounded-3xl bg-secondary/20 p-6 shadow-inner border border-secondary/40">
        <h2 className="font-display text-2xl text-black">Uploaded Files</h2>
        <div className="mt-6 space-y-4">
          {documents.length === 0 && (
            <p className="text-sm text-black/60">No documents uploaded yet.</p>
          )}
          {documents.map((doc) => (
            <div key={doc.id} className="rounded-2xl border border-secondary/50 bg-white px-4 py-4">
              <p className="font-semibold text-black">{doc.name}</p>
              <p className="text-xs text-black/60">{doc.file_type.toUpperCase()}</p>
              <p className="text-xs text-black/50 mt-1">
                Uploaded {new Date(doc.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
