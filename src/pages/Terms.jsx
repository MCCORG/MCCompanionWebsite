import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaGavel, FaArrowLeft } from "react-icons/fa";
import Layout from "@theme/Layout";

const NL = {
  bg: "#111318",
  surface: "#191c23",
  elevated: "#1f232c",
  border: "rgba(255,255,255,0.07)",
  text: "#e8e9ec",
  secondary: "#9299a6",
  muted: "#5a6070",
  accent: "#4fd1c5",
  accentDim: "rgba(79,209,197,0.10)",
  accentBorder: "rgba(79,209,197,0.22)",
};

const sections = [
  {
    title: "1. Use of the Application",
    content: "You may use NetherLink for lawful purposes only. You agree not to use the app to connect to servers that violate Minecraft's Terms of Service or engage in illegal activities. You are responsible for ensuring you have permission to connect to any server you access through NetherLink.",
  },
  {
    title: "2. Server Listings",
    content: "The featured servers list is provided as a community resource. We do not endorse, verify, or control the content of third-party Minecraft servers. Server owners are solely responsible for their server's content, rules, and compliance with applicable laws. We reserve the right to remove servers from our featured list without notice.",
  },
  {
    title: "3. No Warranty",
    content: "NetherLink is provided \"as is\" without warranties of any kind. We do not guarantee:",
    list: [
      "Uninterrupted or error-free operation",
      "Compatibility with all network configurations",
      "Connection stability to third-party servers",
      "Availability of featured servers",
    ],
  },
  {
    title: "4. Limitation of Liability",
    content: "We are not responsible for any damages, data loss, or issues arising from your use of NetherLink, including but not limited to connection problems, server bans, or interaction with third-party servers. Use the app at your own risk.",
  },
  {
    title: "5. Intellectual Property",
    content: "NetherLink and its source code are the intellectual property of the development team. The app is provided free of charge for personal use. You may not reverse engineer, modify, or redistribute the app without explicit permission. Server banners and data provided by third parties remain the property of their respective owners.",
  },
  {
    title: "6. Minecraft and Microsoft",
    content: "NetherLink is an independent project and is not affiliated with, endorsed by, or sponsored by Mojang Studios, Microsoft Corporation, or Minecraft. \"Minecraft\" is a trademark of Microsoft Corporation.",
  },
  {
    title: "7. User Conduct",
    content: "You agree not to:",
    list: [
      "Use the app to attack, exploit, or disrupt servers or networks",
      "Attempt to circumvent server bans or access restrictions",
      "Share or distribute malicious server addresses",
      "Violate any applicable laws or regulations",
    ],
  },
  {
    title: "8. Open Source",
    content: "NetherLink is open-source software. The source code is available on GitHub for review and contribution. By contributing code or suggestions, you grant us the right to use and distribute your contributions under the project's license.",
  },
  {
    title: "9. Modifications to Terms",
    content: "We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated revision date. Continued use of the app after changes constitutes acceptance of the new terms.",
  },
  {
    title: "10. Contact",
    content: "For questions, concerns, or support regarding NetherLink, please join our Discord community or open an issue on our GitHub repository.",
  },
  {
    title: "11. Featured Server Slots (Paid Service)",
    content: "NetherLink offers the option to feature your server in the application for a monthly fee. The following conditions apply:",
    list: [
      "Payment is collected securely via Stripe on a recurring monthly basis.",
      "You may cancel your slot at any time; simply notify us on Discord or by email. Your slot will remain active until the end of your paid period.",
      "If your payment cannot be processed, the slot will remain active until the end of your current billing month, after which your featured server will be removed.",
      "Refunds: We offer a satisfaction guarantee. If you are not satisfied, you may request a full refund for your current month, no questions asked.",
      "All agreements and custom arrangements are discussed personally via Discord (jens.co) or email (see contact page).",
      "Pricing Changes: NetherLink reserves the right to change the price for Featured Server Slots. Price changes will be announced in advance, and new pricing will apply from your next billing period.",
    ],
  },
  {
    title: "12. Server Metrics and Monitoring",
    content: "NetherLink collects aggregate server-level metrics to improve service quality and reliability. These metrics relate to the Minecraft servers that users connect to and do not include personal user identifiers.",
    list: [
      "What we collect: server address (IP/hostname), server port, a server ID or name (if available), connection timestamps, and aggregated counts.",
      "Purpose: service monitoring, troubleshooting, improving featured server lists, security analysis, and general usage statistics.",
      "No personal data: the collected metrics are not tied to individual users or devices and do not contain PII.",
      "Storage and retention: metrics may be stored on our backend for up to 12 months unless otherwise specified.",
      "Backend-level collection: metrics collection occurs on our backend infrastructure and cannot be disabled by users via the app.",
      "Contact for concerns: if you have concerns about metrics related to a server you own, contact us and we will review deletion requests on a case-by-case basis.",
    ],
  },
];

function Section({ section, index }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.025, duration: 0.38 }}
    >
      <h2 style={{
        fontSize: 13, fontWeight: 600, color: NL.text,
        margin: "0 0 10px",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{
          width: 3, height: 16, borderRadius: 2,
          background: NL.accent, flexShrink: 0,
          display: "inline-block",
        }} />
        {section.title}
      </h2>
      <div style={{
        background: NL.elevated, border: `1px solid ${NL.border}`,
        borderRadius: 12, padding: "16px 18px",
      }}>
        <p style={{ color: NL.secondary, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{section.content}</p>
        {section.list && (
          <ul style={{ margin: "12px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            {section.list.map((item, j) => (
              <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, color: NL.secondary, fontSize: 13, lineHeight: 1.6 }}>
                <span style={{
                  marginTop: 5, width: 5, height: 5, borderRadius: "50%",
                  background: NL.accent, opacity: 0.6, flexShrink: 0,
                }} />
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.section>
  );
}

export default function Terms() {
  return (
    <Layout>
      <div style={{
        minHeight: "100vh", background: NL.bg,
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: "64px 16px",
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>

          <motion.div
            style={{ textAlign: "center", marginBottom: 44 }}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 52, height: 52, borderRadius: 14,
              background: NL.surface, border: `1px solid ${NL.border}`,
              marginBottom: 16, color: NL.accent,
            }}>
              <FaGavel size={20} />
            </div>
            <h1 style={{
              fontSize: 28, fontWeight: 700, color: NL.text,
              letterSpacing: "-0.025em", margin: "0 0 10px",
            }}>Terms of Service</h1>
            <p style={{ fontSize: 14, color: NL.secondary, lineHeight: 1.6, margin: 0, maxWidth: 480, marginInline: "auto" }}>
              By accessing or using <span style={{ color: NL.text, fontWeight: 500 }}>NetherLink</span>, you agree to these terms.
              Please read them carefully.
            </p>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 40 }}>
            {sections.map((section, i) => (
              <Section key={i} section={section} index={i} />
            ))}
          </div>

          <p style={{ fontSize: 11, color: NL.muted, textAlign: "right", marginBottom: 32 }}>
            Last updated: March 24, 2026
          </p>

          <div style={{ textAlign: "center" }}>
            <Link
              to="/"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "10px 20px",
                background: NL.elevated, border: `1px solid ${NL.border}`,
                borderRadius: 10, color: NL.secondary,
                fontSize: 13, fontWeight: 500, textDecoration: "none",
                transition: "color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = NL.text; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = NL.secondary; e.currentTarget.style.borderColor = NL.border; }}
            >
              <FaArrowLeft size={12} /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}