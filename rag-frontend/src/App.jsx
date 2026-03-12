import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import UploadPage from "./pages/UploadPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import BackgroundFX from "./components/BackgroundFX.jsx";

const navLinkClass = ({ isActive }) =>
  `px-4 py-2 rounded-full text-sm font-medium transition ${isActive
    ? "bg-primary text-black shadow"
    : "text-ink/70 hover:text-black hover:bg-secondary/40"
  }`;

export default function App() {
  return (
    <BrowserRouter>
      <BackgroundFX />
      <div className="bg-glow-overlay" />
      <div className="min-h-screen px-6 py-10">
        <div className="app-shell max-w-6xl mx-auto rounded-[32px] p-8">
          <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <span className="h-6 w-[3px] bg-red rounded-full shrink-0" aria-hidden="true" />
                <p className="text-sm uppercase tracking-[0.4em] text-primary/80">RAG Studio</p>
              </div>
              <h1 className="font-display text-3xl md:text-4xl text-black">
                Fitsum EAII
              </h1>
              <p className="mt-2 text-black/70 max-w-xl">
                Upload documents, run semantic search, and chat with your private knowledge base.
              </p>
            </div>
            <nav className="flex gap-2 bg-secondary/40 p-2 rounded-full shadow-inner border border-secondary/60">
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
