import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaShieldAlt, FaArrowLeft } from "react-icons/fa";
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
    title: "1. Application Data",
    content: "NetherLink stores data locally on your device to enhance your experience:",
    list: [
      "Your saved server list (IP addresses, ports, custom names)",
      "Bedrock profile information (usernames and display names)",
      "App preferences and settings",
    ],
    footer: "All data is stored locally on your device. We do not collect, transmit, or store any personal information on external servers.",
  },
  {
    title: "2. Network Activity",
    content: "NetherLink acts as a UDP proxy between your console and remote Minecraft servers. The app only processes game traffic necessary for connectivity and does not log, monitor, or store any gameplay data, chat messages, or player information.",
  },
  {
    title: "3. Featured Servers List",
    content: "The app downloads a public list of featured servers from our GitHub repository and backend API. This list contains only server addresses, ports, and optional banner images. No personal data is transmitted when fetching this list.",
  },
  {
    title: "4. Data Security",
    content: "Since all data is stored locally on your device, you maintain full control over your information. We recommend securing your device with a password or biometric authentication to protect your saved servers and profiles.",
  },
  {
    title: "5. Third-Party Services",
    content: "NetherLink does not integrate third-party analytics, advertising, or tracking services. App Store and Google Play may collect standard installation and usage metrics according to their own privacy policies.",
  },
  {
    title: "6. Children's Privacy",
    content: "NetherLink does not knowingly collect any personal information from children. All data remains on the user's device and is never transmitted to external servers.",
  },
  {
    title: "7. Data Removal",
    content: "You can delete all saved data at any time by uninstalling the app or clearing app data through your device settings. Since no data is stored on our servers by default, uninstalling the app completely removes all local information.",
  },
  {
    title: "8. Changes to This Policy",
    content: "We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date.",
  },
  {
    title: "9. Server Metrics and Aggregated Usage Statistics",
    content: "NetherLink collects aggregate, server-level metrics to help improve the service and monitor reliability. These metrics do not contain personal user data.",
    list: [
      "What we collect: server address (IP/hostname), server port, server name or ID (if available), connection timestamps, and aggregated counts such as total connections and connections per server.",
      "How we use it: to detect connection issues, improve featured server lists, capacity planning, and general service analytics.",
      "No PII: metrics are not tied to individual users or devices and do not contain personally identifiable information.",
      "Storage and retention: metrics may be stored on our backend and are retained by default for up to 12 months.",
      "Security: we protect metrics with appropriate technical and organizational measures.",
      "Backend collection and disabling: metrics collection is performed at our backend infrastructure level and cannot be disabled by users from the app.",
      "Requests and remediation: if you are the owner of a server and require removal or redaction of metrics, contact us via Discord or email.",
      "Third parties: we do not provide raw metrics that link server addresses to individual users to third parties.",
    ],
  },
];

function Section({ section, index }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.03, duration: 0.38 }}
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
        {section.footer && (
          <p style={{ color: NL.secondary, fontSize: 13, lineHeight: 1.7, marginTop: 12, marginBottom: 0 }}>{section.footer}</p>
        )}
      </div>
    </motion.section>
  );
}

export default function Privacy() {
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
              <FaShieldAlt size={20} />
            </div>
            <h1 style={{
              fontSize: 28, fontWeight: 700, color: NL.text,
              letterSpacing: "-0.025em", margin: "0 0 10px",
            }}>Privacy Policy</h1>
            <p style={{ fontSize: 14, color: NL.secondary, lineHeight: 1.6, margin: 0, maxWidth: 480, marginInline: "auto" }}>
              At <span style={{ color: NL.text, fontWeight: 500 }}>NetherLink</span>, we are committed to protecting your privacy.
              This policy outlines what information we collect and how we use it.
            </p>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
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