import { motion } from "framer-motion";
import { FaDiscord } from "react-icons/fa";
import { Link } from "react-router-dom";
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

function FeatureLine({ children }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "9px 0",
      borderBottom: `1px solid ${NL.border}`,
      color: NL.secondary, fontSize: 13,
    }}>
      <span style={{
        width: 16, height: 16, flexShrink: 0,
        background: NL.accentDim, border: `1px solid ${NL.accentBorder}`,
        borderRadius: 4,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 9, color: NL.accent,
      }}>✓</span>
      {children}
    </div>
  );
}

export default function FeaturedSlot() {
  return (
    <Layout>
      <div style={{
        minHeight: "100vh", background: NL.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "64px 16px",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        <motion.div
          style={{ width: "100%", maxWidth: 440 }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: "easeOut" }}
        >
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, letterSpacing: "0.13em", textTransform: "uppercase",
              color: NL.accent, background: NL.accentDim,
              border: `1px solid ${NL.accentBorder}`,
              borderRadius: 4, padding: "4px 12px",
            }}>Featured Slot</span>
          </div>

          <div style={{
            background: NL.surface,
            border: `1px solid ${NL.border}`,
            borderRadius: 20,
            overflow: "hidden",
            position: "relative",
          }}>
            <div style={{
              height: 2,
              background: `linear-gradient(90deg, ${NL.accent}66 0%, ${NL.accent}18 60%, transparent 100%)`,
            }} />

            <div style={{ padding: "26px 26px 22px" }}>
              <h1 style={{
                fontSize: 24, fontWeight: 700, color: NL.text,
                letterSpacing: "-0.025em", margin: "0 0 8px", lineHeight: 1.2,
              }}>
                Showcase your server
              </h1>
              <p style={{
                color: NL.secondary, fontSize: 13, lineHeight: 1.65, margin: "0 0 22px",
              }}>
                Appear in the <span style={{ color: NL.text, fontWeight: 500 }}>Featured</span> section
                of MCCompanion — instantly visible to thousands of console players on PlayStation, Xbox, and Switch.
              </p>

              <div style={{
                background: NL.elevated, border: `1px solid ${NL.borderMid}`,
                borderRadius: 12, padding: "18px 18px 14px",
                marginBottom: 18, textAlign: "center",
              }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, justifyContent: "center" }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 44, fontWeight: 700, color: NL.text, letterSpacing: "-0.04em", lineHeight: 1,
                  }}>$50</span>
                  <span style={{ color: NL.muted, fontSize: 15, fontWeight: 500 }}>/ month</span>
                </div>
                <p style={{ color: NL.muted, fontSize: 11, marginTop: 7, letterSpacing: "0.01em" }}>
                  Billed monthly · Cancel anytime
                </p>
              </div>

              <div style={{ marginBottom: 20 }}>
                <FeatureLine>Listed in the Featured section of the app</FeatureLine>
                <FeatureLine>Shown on the MCCompanion website</FeatureLine>
                <FeatureLine>Discord Server of the Day rotation</FeatureLine>
                <FeatureLine>Cancel anytime · Full refund guarantee</FeatureLine>
              </div>

              <p style={{ fontSize: 13, color: NL.secondary, marginBottom: 10, lineHeight: 1.5 }}>
                Contact <strong style={{ color: NL.text, fontWeight: 600 }}>Jens.Co</strong> on Discord to request your slot:
              </p>
              <a
                href="https://discord.gg/xvaNzE35Rs"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "11px",
                  background: NL.elevated, border: `1px solid ${NL.borderMid}`,
                  borderRadius: 10, color: NL.text,
                  textDecoration: "none", fontSize: 14, fontWeight: 600,
                  marginBottom: 16,
                  transition: "border-color 0.2s, background 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = NL.accentBorder;
                  e.currentTarget.style.background = NL.accentDim;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = NL.borderMid;
                  e.currentTarget.style.background = NL.elevated;
                }}
              >
                <FaDiscord size={16} style={{ color: "#7289da" }} />
                Open Discord
              </a>

              <p style={{ fontSize: 12, color: NL.muted, textAlign: "center", lineHeight: 1.5 }}>
                Read the{" "}
                <Link to="/terms" style={{ color: NL.secondary, textDecoration: "underline", textUnderlineOffset: 3 }}>
                  Terms of Service
                </Link>{" "}
                before purchasing.
              </p>
            </div>
          </div>

          <p style={{
            textAlign: "center", color: NL.muted,
            fontSize: 12, marginTop: 18, lineHeight: 1.5,
          }}>
            Your slot keeps MCCompanion running for all players.
          </p>
        </motion.div>
      </div>
    </Layout>
  );
}