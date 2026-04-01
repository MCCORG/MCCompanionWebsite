import { motion } from "framer-motion";
import { FaDiscord } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function FeaturedSlot() {
  return (
    <div
      className="min-h-screen font-sans flex flex-col"
      style={{
        background:
          "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(0,229,255,0.07) 0%, transparent 60%), #0a0a0f",
      }}
    >
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <motion.div
          className="w-full max-w-md mx-auto rounded-2xl p-8 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(0,229,255,0.04) 100%)",
            border: "1px solid rgba(0,229,255,0.12)",
            boxShadow: "0 8px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,229,255,0.05)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0,
              height: "2px",
              background: "linear-gradient(90deg, #00e5ff88, #6366f188, transparent)",
            }}
          />

          <h1
            className="text-3xl md:text-4xl font-extrabold text-center mb-4"
            style={{
              background: "linear-gradient(135deg, #e2e8f0, #00e5ff 50%, #6366f1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 16px rgba(0,229,255,0.2))",
            }}
          >
            Featured Server Slot
          </h1>

          <p className="mb-6 text-slate-400 text-center text-sm leading-relaxed">
            Showcase your Minecraft Bedrock server in the{" "}
            <span className="text-cyan-400 font-semibold">Featured</span> section of NetherLink.
          </p>

          <div
            className="mb-6 rounded-xl p-5 text-center"
            style={{
              background: "rgba(0,229,255,0.05)",
              border: "1px solid rgba(0,229,255,0.12)",
            }}
          >
            <span className="block text-slate-400 text-xs uppercase tracking-widest mb-2 font-semibold">
              Price
            </span>
            <div className="flex items-baseline justify-center gap-1">
              <span
                className="text-4xl font-black"
                style={{ color: "#00e5ff", filter: "drop-shadow(0 0 10px rgba(0,229,255,0.4))" }}
              >
                $50
              </span>
              <span className="text-slate-500 text-base font-medium">/ month</span>
            </div>
            <p className="text-slate-500 text-xs mt-2">
              The price for the IP/Port placeholder within the NetherLink app is to be discussed.
            </p>
          </div>

          <div className="mb-6 text-center">
            <p className="text-slate-300 font-semibold mb-1 text-sm">How to arrange your slot?</p>
            <p className="text-slate-400 text-sm mb-3">
              Contact <span className="text-cyan-400 font-semibold">Jens.Co</span> on Discord or join our server:
            </p>
            <a
              href="https://discord.gg/xvaNzE35Rs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm text-white transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #5865f2, #4752c4)",
                boxShadow: "0 0 20px rgba(88,101,242,0.3)",
                textDecoration: "none",
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
              <FaDiscord size={16} /> Join Discord Server
            </a>
          </div>

          <p className="text-xs text-slate-600 text-center leading-relaxed">
            Your slot helps support NetherLink development and keeps the service online for everyone!
          </p>

          <div className="mt-6 text-center">
            <Link
              to="/terms"
              className="text-xs font-medium transition-colors duration-200"
              style={{ color: "#475569", textDecoration: "underline" }}
              onMouseEnter={e => e.currentTarget.style.color = "#00e5ff"}
              onMouseLeave={e => e.currentTarget.style.color = "#475569"}
            >
              View Terms of Service
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}