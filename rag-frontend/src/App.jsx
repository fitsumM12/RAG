import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import UploadPage from "./pages/UploadPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";

const navLinkClass = ({ isActive }) =>
  `px-4 py-2 rounded-full text-sm font-medium transition ${
    isActive
      ? "bg-moss text-white shadow"
      : "text-ink/70 hover:text-ink hover:bg-white/70"
  }`;

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen px-6 py-10">
        <div className="app-shell max-w-6xl mx-auto rounded-[32px] p-8">
          <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-clay/70">RAG Studio</p>
              <h1 className="font-display text-3xl md:text-4xl text-ink">
                Retrieval Augmented Knowledge Hub
              </h1>
              <p className="mt-2 text-ink/70 max-w-xl">
                Upload documents, run semantic search, and chat with your private knowledge base.
              </p>
            </div>
            <nav className="flex gap-2 bg-white/60 p-2 rounded-full shadow-inner">
              <NavLink to="/" className={navLinkClass}>
                Chat
              </NavLink>
              <NavLink to="/upload" className={navLinkClass}>
                Upload
              </NavLink>
            </nav>
          </header>

          <main className="mt-10">
            <Routes>
              <Route path="/" element={<ChatPage />} />
              <Route path="/upload" element={<UploadPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
