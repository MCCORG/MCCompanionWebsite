import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaDiscord, FaGithub } from "react-icons/fa";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToInfo = () => {
    if (location.pathname === "/") {
      const el = document.getElementById("how-it-works");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate("/", { state: { scrollTo: "how-it-works" } });
    }
  };

  return (
    <footer
      className="mt-16 pt-10 pb-8 px-4"
      style={{
        background: "linear-gradient(180deg, transparent 0%, rgba(0,229,255,0.03) 100%)",
        borderTop: "1px solid rgba(0,229,255,0.1)",
      }}
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-5">
        <div className="flex items-center gap-3">
          <span
            className="text-xl font-black tracking-tighter"
            style={{
              background: "linear-gradient(135deg, #00e5ff, #6366f1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 6px rgba(0,229,255,0.3))",
            }}
          >
            NL
          </span>
          <span className="font-bold text-slate-200 text-lg">NetherLink</span>
        </div>

        <div className="flex gap-3">
          <a
            href="https://discord.gg/xvaNzE35Rs"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord"
            className="p-3 rounded-full transition-all duration-200 text-white"
            style={{
              background: "linear-gradient(135deg, #5865f2, #4752c4)",
              boxShadow: "0 0 16px rgba(88,101,242,0.25)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = "0 0 28px rgba(88,101,242,0.5)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "0 0 16px rgba(88,101,242,0.25)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <FaDiscord size={18} />
          </a>
          <a
            href="https://github.com/NetherDevMc/NetherLinkWebsite"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="p-3 rounded-full transition-all duration-200 text-slate-300 hover:text-white"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.12)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <FaGithub size={18} />
          </a>
        </div>

        <nav className="flex flex-wrap gap-6 justify-center">
          <button
            onClick={scrollToInfo}
            className="text-slate-400 hover:text-cyan-400 font-medium transition-colors duration-200 text-sm"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            Info
          </button>

          {[
            { to: "/privacy", label: "Privacy" },
            { to: "/terms", label: "Terms" },
            { to: "/contact", label: "Contact" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-slate-400 hover:text-cyan-400 font-medium transition-colors duration-200 text-sm"
              style={{ textDecoration: "none" }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="text-slate-500 text-sm text-center">
          © {new Date().getFullYear()} NetherLink. Built by{" "}
          <span className="font-semibold" style={{ color: "#00e5ff" }}>
            Jens-Co
          </span>
          .
        </div>
      </div>
    </footer>
  );
}