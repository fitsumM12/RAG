import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

export const uploadDocument = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/upload/", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const getDocuments = () => api.get("/documents/");

export const askQuestion = (payload) => api.post("/ask/", payload);

export const askQuestionStream = async (payload, onToken, onDone, onError) => {
  try {
    const response = await fetch(
      `${api.defaults.baseURL}/ask/stream/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok || !response.body) {
      throw new Error("Stream request failed");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() || "";
      for (const part of parts) {
        const line = part.trim();
        if (!line.startsWith("data:")) continue;
        const jsonPayload = line.replace("data:", "").trim();
        if (!jsonPayload) continue;
        const data = JSON.parse(jsonPayload);
        if (data.token) {
          onToken?.(data.token);
        }
        if (data.done) {
          onDone?.(data);
        }
      }
    }
  } catch (err) {
    onError?.(err);
  }
};

export default api;
