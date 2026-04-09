import { useState, useEffect } from "react";
import { FaDiscord } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (location.pathname === "/" && location.state?.scrollTo) {
      const id = location.state.scrollTo;
      const t = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
      return () => clearTimeout(t);
    }
  }, [location]);

  const scrollToInfo = () => {
    setOpen(false);
    if (location.pathname === "/") {
      const el = document.getElementById("how-it-works");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate("/", { state: { scrollTo: "how-it-works" } });
    }
  };

  return (
    <header
      className="fixed w-full top-0 z-40 transition-all duration-300"
      style={{
        background: scrolled
          ? "linear-gradient(135deg, rgba(10,10,15,0.95) 0%, rgba(0,229,255,0.03) 100%)"
          : "linear-gradient(135deg, rgba(10,10,15,0.7) 0%, rgba(0,229,255,0.02) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: scrolled
          ? "1px solid rgba(0,229,255,0.15)"
          : "1px solid rgba(0,229,255,0.05)",
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.5)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer select-none group"
          onClick={() => navigate("/")}
        >
          <span
            className="font-black text-2xl tracking-tight transition-all duration-300 group-hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #00e5ff, #6366f1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 8px rgba(0,229,255,0.4))",
            }}
          >
            NL
          </span>
          <span className="font-bold text-slate-100 text-lg hidden sm:block tracking-wide">
            NetherLink
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate("/slot")}
            className="px-4 py-2 rounded-full font-bold transition-all duration-200 text-slate-200 hover:text-cyan-300"
            style={{
              background: "rgba(0,229,255,0.06)",
              border: "1px solid rgba(0,229,255,0.15)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(0,229,255,0.12)";
              e.currentTarget.style.border = "1px solid rgba(0,229,255,0.35)";
              e.currentTarget.style.boxShadow = "0 0 16px rgba(0,229,255,0.15)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(0,229,255,0.06)";
              e.currentTarget.style.border = "1px solid rgba(0,229,255,0.15)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Featured Server Slot
          </button>
          <a
            href="https://discord.gg/xvaNzE35Rs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-5 py-2 rounded-full font-semibold transition-all duration-200 text-white"
            style={{
              background: "linear-gradient(135deg, #5865f2, #4752c4)",
              boxShadow: "0 0 20px rgba(88,101,242,0.3)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = "0 0 32px rgba(88,101,242,0.5)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "0 0 20px rgba(88,101,242,0.3)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <FaDiscord className="mr-2" /> Discord
          </a>
        </nav>

        <button
          className="md:hidden p-2 rounded-full transition-all duration-200 text-slate-300 hover:text-cyan-400"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          onClick={() => setOpen(v => !v)}
        >
          <svg width={24} height={24} fill="none" stroke="currentColor" strokeWidth="2">
            {!open
              ? <path d="M4 7h16M4 13h16M4 19h16" />
              : <path d="M6 6L18 18M6 18L18 6" />
            }
          </svg>
        </button>
      </div>

      {open && (
        <div
          className="md:hidden px-5 pt-3 pb-4 flex flex-col gap-2"
          style={{
            background: "rgba(10,10,15,0.97)",
            borderTop: "1px solid rgba(0,229,255,0.1)",
          }}
        >
          <button
            onClick={scrollToInfo}
            className="w-full text-left px-4 py-2.5 rounded-xl text-slate-300 hover:text-cyan-400 font-medium transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            Info
          </button>
          <button
            onClick={() => { navigate("/slot"); setOpen(false); }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-slate-200 hover:text-cyan-300 font-bold transition-all duration-200"
            style={{ background: "rgba(0,229,255,0.06)", border: "1px solid rgba(0,229,255,0.15)" }}
          >
            Featured Server Slot
          </button>
          <a
            href="https://discord.gg/xvaNzE35Rs"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl text-white font-semibold text-left"
            style={{ background: "linear-gradient(135deg, #5865f2, #4752c4)" }}
            onClick={() => setOpen(false)}
          >
            <FaDiscord className="inline-block mr-2" /> Discord
          </a>
        </div>
      )}
    </header>
  );
}