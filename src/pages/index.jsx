import { useState, useEffect } from "react";
import { FaWindows, FaApple, FaAndroid } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import FeaturedServersCarousel from "../components/FeaturedServersCarousel";
import ChangelogSection from "../components/ChangelogSection";
import Layout from "@theme/Layout";

const NL = {
  bg: "#111318",
  surface: "#191c23",
  elevated: "#1f232c",
  subtle: "#252931",
  border: "rgba(255,255,255,0.07)",
  borderMid: "rgba(255,255,255,0.12)",
  text: "#e8e9ec",
  secondary: "#9299a6",
  muted: "#5a6070",
  accent: "#4fd1c5",
  accentDim: "rgba(79,209,197,0.10)",
  accentBorder: "rgba(79,209,197,0.22)",
};

const platforms = [
  { icon: <FaWindows size={20} />, label: "Windows", url: "https://apps.microsoft.com/detail/9NSFPT6D8PTR", color: "#60a5fa" },
  { icon: <FaApple size={20} />, label: "macOS", url: "https://github.com/NetherLinkMC/NetherLinkWebsite/raw/refs/heads/main/downloads/apple/NetherLink.dmg", color: "#9299a6" },
  { icon: <FaAndroid size={20} />, label: "Android", url: "https://play.google.com/store/apps/details?id=net.netherdev.netherLink", color: "#34d399" },
  { icon: <FaApple size={20} />, label: "iOS", url: "https://apps.apple.com/be/app/netherlink/id6747323142?l=en", color: "#9299a6" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.42, ease: "easeOut" },
  }),
};

function RotatingWords({ prefix = "No bullshit. Just", words = ["add your server", "start mode", "connect", "play"], interval = 2200 }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval]);

  return (
    <span style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <span style={{ color: NL.secondary, fontWeight: 400 }}>{prefix} </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          style={{ display: "inline-block", color: NL.accent, fontWeight: 700 }}
        >
          {words[idx].charAt(0).toUpperCase() + words[idx].slice(1)}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Home() {
  return (
    <Layout>
      <div style={{ minHeight: "100vh", background: NL.bg, fontFamily: "'Inter', system-ui, sans-serif" }}>
        <main style={{
          flex: 1, width: "100%",
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "72px 20px 64px",
        }}>
          <div style={{ width: "100%", maxWidth: 1100, display: "flex", flexDirection: "column", gap: 32 }}>

            <motion.div
              style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center", textAlign: "center" }}
              variants={fadeUp} custom={0} initial="hidden" animate="visible"
            >
              <h1 style={{
                fontSize: "clamp(28px, 5vw, 46px)",
                fontWeight: 700,
                color: NL.text,
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
                margin: 0,
              }}>
                Connect to any{" "}
                <span style={{ color: NL.accent }}>Minecraft</span>{" "}
                server
              </h1>

              <p style={{ fontSize: 15, color: NL.secondary, marginTop: 4 }}>
                <RotatingWords words={["add your server", "start mode", "connect", "play"]} interval={2200} />
              </p>
            </motion.div>

            <div style={{
              display: "flex", flexDirection: "row",
              gap: 24, alignItems: "flex-start",
              flexWrap: "wrap",
            }}>
              <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 16 }}>

                <motion.div
                  style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}
                  variants={fadeUp} custom={1} initial="hidden" animate="visible"
                >
                  {platforms.map(p => (
                    <motion.a
                      key={p.label}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        gap: 8, padding: "20px 8px",
                        borderRadius: 12,
                        background: NL.surface,
                        border: `1px solid ${NL.border}`,
                        textDecoration: "none",
                        transition: "border-color 0.2s, background 0.2s",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = p.color + "44";
                        e.currentTarget.style.background = NL.elevated;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = NL.border;
                        e.currentTarget.style.background = NL.surface;
                      }}
                    >
                      <span style={{ color: p.color }}>{p.icon}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: NL.secondary, letterSpacing: "0.01em" }}>
                        {p.label}
                      </span>
                    </motion.a>
                  ))}
                </motion.div>

                <motion.div
                  style={{ width: "100%" }}
                  variants={fadeUp} custom={2} initial="hidden" animate="visible"
                >
                  <FeaturedServersCarousel />
                </motion.div>
              </div>

              <motion.div
                style={{ width: "100%", maxWidth: 360, flexShrink: 0 }}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.45, ease: "easeOut" }}
              >
                <ChangelogSection />
              </motion.div>
            </div>

          </div>
        </main>
      </div>
    </Layout>
  );
}