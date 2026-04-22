import Link from '@docusaurus/Link';
import { FaDiscord, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      className="mt-16 pt-10 pb-8 px-4"
      style={{
        borderTop: "1px solid rgba(120,64,200,0.10)",
        background: "#1b1d24",
      }}
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-5">
        <div className="flex items-center gap-3">
          <span
            className="text-xl font-black tracking-tighter"
            style={{
              background: "linear-gradient(135deg, #a184fa 0%, #6e3c9b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 6px rgba(120,64,200,0.3))",
            }}
          >
            NL
          </span>
          <span className="font-bold text-slate-100 text-lg">NetherLink</span>
        </div>

        <div className="flex gap-3">
          <a
            href="https://discord.gg/xvaNzE35Rs"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord"
            className="p-3 rounded-full transition-all duration-200 text-white"
            style={{
              background: "linear-gradient(135deg, #a184fa, #6e3c9b)",
              boxShadow: "0 0 16px rgba(120,64,200,0.22)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = "0 0 28px rgba(120,64,200,0.35)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "0 0 16px rgba(120,64,200,0.22)";
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
            className="p-3 rounded-full transition-all duration-200 text-slate-100 hover:text-white"
            style={{
              background: "rgba(160,128,250,0.13)",
              border: "1px solid rgba(120,64,200,0.17)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(160,128,250,0.18)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(160,128,250,0.13)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <FaGithub size={18} />
          </a>
        </div>

        <nav className="flex flex-wrap gap-6 justify-center">
          {[
            { to: "/privacy", label: "Privacy" },
            { to: "/terms", label: "Terms" },
            { to: "/contact", label: "Contact" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-slate-100 hover:text-white-300 font-medium transition-colors duration-200 text-sm"
              style={{ textDecoration: "none" }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="text-slate-500 text-sm text-center">
          © {new Date().getFullYear()} NetherLink. Built by{" "}
          <span className="font-semibold" style={{ color: "#a184fa" }}>
            Jens-Co
          </span>
          .
        </div>
      </div>
    </footer>
  );
}