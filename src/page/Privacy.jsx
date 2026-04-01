import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaShieldAlt, FaArrowLeft } from "react-icons/fa";

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

export default function Privacy() {
  return (
    <div
      className="min-h-screen font-sans"
      style={{
        background:
          "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(0,229,255,0.06) 0%, transparent 60%), #0a0a0f",
      }}
    >
      <div className="max-w-4xl mx-auto px-3 py-12">
        <motion.div
          className="relative rounded-2xl p-8 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(0,229,255,0.03) 100%)",
            border: "1px solid rgba(0,229,255,0.1)",
            boxShadow: "0 8px 48px rgba(0,0,0,0.4)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "2px",
            background: "linear-gradient(90deg, #00e5ff66, #6366f166, transparent)",
          }} />

          <div className="flex justify-center mb-8">
            <div className="relative">
              <div style={{
                position: "absolute", inset: 0,
                background: "rgba(0,229,255,0.1)", borderRadius: "50%", filter: "blur(16px)",
              }} />
              <div className="relative p-5 rounded-full" style={{
                background: "rgba(0,229,255,0.07)",
                border: "1px solid rgba(0,229,255,0.2)",
              }}>
                <FaShieldAlt size={40} style={{ color: "#00e5ff" }} />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-5 text-center" style={{
            background: "linear-gradient(135deg, #e2e8f0, #00e5ff 50%, #6366f1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 20px rgba(0,229,255,0.2))",
          }}>
            Privacy Policy
          </h1>
          <p className="mb-10 text-slate-400 text-base text-center max-w-2xl mx-auto leading-relaxed">
            At <span className="text-slate-200 font-semibold">NetherLink</span>, we are committed to protecting your privacy.
            This policy outlines what information we collect and how we use it.
          </p>

          <div className="space-y-5">
            {sections.map((section, i) => (
              <motion.section
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
              >
                <h2 className="text-base font-bold mb-3" style={{
                  borderLeft: "3px solid #00e5ff",
                  paddingLeft: "12px",
                  color: "#e2e8f0",
                }}>
                  {section.title}
                </h2>
                <div style={{
                  background: "rgba(0,229,255,0.03)",
                  border: "1px solid rgba(0,229,255,0.07)",
                  borderRadius: "12px",
                  padding: "16px 20px",
                }}>
                  <p className="text-slate-400 text-sm leading-relaxed">{section.content}</p>
                  {section.list && (
                    <ul className="mt-3 space-y-1.5 pl-2">
                      {section.list.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-slate-400 text-sm">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: "rgba(0,229,255,0.5)" }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.footer && (
                    <p className="text-slate-400 text-sm leading-relaxed mt-3">{section.footer}</p>
                  )}
                </div>
              </motion.section>
            ))}
          </div>

          <p className="mt-10 text-xs text-slate-600 text-right font-medium">
            Last updated: March 24, 2026
          </p>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-200"
              style={{
                background: "rgba(0,229,255,0.07)",
                border: "1px solid rgba(0,229,255,0.15)",
                color: "#e2e8f0",
                textDecoration: "none",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(0,229,255,0.12)";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(0,229,255,0.15)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(0,229,255,0.07)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <FaArrowLeft size={13} /> Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}