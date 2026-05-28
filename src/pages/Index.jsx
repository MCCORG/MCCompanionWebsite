import { useState, useEffect } from "react";
import { FaWindows, FaApple, FaAndroid } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import FeaturedServersCarousel from "../components/FeaturedServersCarousel";
import ChangelogSection from "../components/ChangelogSection";
import AppShowcase from "../components/AppShowcase";
import BotStatus from "../components/BotStatus";
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
  accent: "#67e404",
  accentDim: "rgba(103,228,4,0.10)",
  accentBorder: "rgba(103,228,4,0.22)",
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

function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10, letterSpacing: "0.12em",
        textTransform: "uppercase", color: NL.muted,
        flexShrink: 0,
      }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: NL.border }} />
    </div>
  );
}

export default function Home() {
  return (
    <Layout>
      <div style={{ background: NL.bg, fontFamily: "'Inter', system-ui, sans-serif" }}>

        <main style={{
          width: "100%",
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "72px 20px 56px",
          boxSizing: "border-box",
        }}>
          <div style={{ width: "100%", maxWidth: 1100, display: "flex", flexDirection: "column", gap: 32 }}>

            <motion.div
              style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center", textAlign: "center" }}
              variants={fadeUp} custom={0} initial="hidden" animate="visible"
            >
              <h1 style={{
                fontSize: "clamp(28px, 5vw, 46px)",
                fontWeight: 700, color: NL.text,
                letterSpacing: "-0.03em", lineHeight: 1.15, margin: 0,
              }}>
                The complete{" "}
                <span style={{ color: NL.accent }}>Minecraft</span>{" "}
                companion
              </h1>
              <p style={{ fontSize: 15, color: NL.secondary, marginTop: 4 }}>
                <RotatingWords
                  prefix="Everything you need to"
                  words={["connect to any server", "edit your skin", "look up players", "play with friends"]}
                  interval={2200}
                />
              </p>
            </motion.div>

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

          </div>
        </main>

        <AppShowcase />

        <div style={{
          width: "100%", boxSizing: "border-box",
          padding: "0 20px 80px",
          display: "flex", justifyContent: "center",
        }}>
          <div style={{ width: "100%", maxWidth: 1100, display: "flex", flexDirection: "column", gap: 48 }}>

            <div>
              <SectionLabel>Featured servers</SectionLabel>
              <FeaturedServersCarousel />
            </div>

            <div>
              <SectionLabel>Player lookup</SectionLabel>
              <a href="/lookup" style={{ textDecoration: "none", display: "block" }}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  gap: 20, padding: "22px 28px",
                  background: NL.surface,
                  border: `1px solid ${NL.border}`,
                  borderRadius: 16,
                  transition: "border-color 0.2s, background 0.2s",
                  flexWrap: "wrap",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = NL.borderMid; e.currentTarget.style.background = NL.elevated; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = NL.border; e.currentTarget.style.background = NL.surface; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      background: NL.accentDim, border: `1px solid ${NL.accentBorder}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 20,
                    }}>🔍</div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: NL.text, margin: 0 }}>
                        Look up any Minecraft player
                      </p>
                      <p style={{ fontSize: 12, color: NL.secondary, margin: "3px 0 0" }}>
                        Search by Xbox gamertag, Java username, or XUID — see skin, UUID, and linked accounts
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {["Gamertag", "Java username", "XUID"].map(tag => (
                        <span key={tag} style={{
                          fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 5,
                          background: NL.subtle, border: `1px solid ${NL.border}`,
                          color: NL.muted, fontFamily: "'JetBrains Mono', monospace",
                          whiteSpace: "nowrap",
                        }}>{tag}</span>
                      ))}
                    </div>
                    <span style={{
                      fontSize: 13, fontWeight: 600, color: NL.accent,
                      display: "flex", alignItems: "center", gap: 4,
                    }}>Try it →</span>
                  </div>
                </div>
              </a>
            </div>

            <div>
              <BotStatus />
            </div>

            <div>
              <SectionLabel>Recent changes</SectionLabel>
              <ChangelogSection />
            </div>

          </div>
        </div>

      </div>
    </Layout>
  );
}