import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaGavel, FaArrowLeft } from "react-icons/fa";
import Layout from '@theme/Layout';

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

export default function Terms() {
  return (
    <Layout>
    <div
      className="min-h-screen font-sans"
    >
      <div className="max-w-4xl mx-auto px-3 py-12">
        <motion.div
          className="relative rounded-2xl p-8 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(81,51,150,0.12) 0%, rgba(161,132,250,0.13) 100%)",
            border: "1px solid rgba(120,64,200,0.13)",
            boxShadow: "0 8px 48px rgba(40,20,60,0.32)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "2px",
            background: "linear-gradient(90deg, #a184fa99, #6e3c9b77, transparent)",
          }} />

          <div className="flex justify-center mb-8">
            <div className="relative">
              <div style={{
                position: "absolute", inset: 0,
                background: "rgba(120,64,200,0.13)", borderRadius: "50%", filter: "blur(16px)",
              }} />
              <div className="relative p-5 rounded-full" style={{
                background: "rgba(120,64,200,0.10)",
                border: "1px solid #a184fa77",
              }}>
                <FaGavel size={40} style={{ color: "#a184fa" }} />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-5 text-center" style={{
            background: "linear-gradient(135deg, #e2e8f0, #a184fa 60%, #6e3c9b 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 20px #a184fa33)",
          }}>
            Terms of Service
          </h1>
          <p className="mb-10 text-slate-400 text-base text-center max-w-2xl mx-auto leading-relaxed">
            By accessing or using <span className="text-slate-200 font-semibold">NetherLink</span>,
            you agree to these terms. Please read them carefully.
          </p>

          <div className="space-y-5">
            {sections.map((section, i) => (
              <motion.section
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.03, duration: 0.4 }}
              >
                <h2 className="text-base font-bold mb-3" style={{
                  borderLeft: "3px solid #a184fa",
                  paddingLeft: "12px",
                  color: "#e2e8f0",
                }}>
                  {section.title}
                </h2>
                <div style={{
                  background: "rgba(120,64,200,0.07)",
                  border: "1px solid #a184fa27",
                  borderRadius: "12px",
                  padding: "16px 20px",
                }}>
                  <p className="text-slate-400 text-sm leading-relaxed">{section.content}</p>
                  {section.list && (
                    <ul className="mt-3 space-y-1.5 pl-2">
                      {section.list.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-slate-400 text-sm">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: "#a184fa99" }} />
                          {item}
                        </li>
                      ))}
                    </ul>
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
                background: "rgba(120,64,200,0.11)",
                border: "1px solid #a184fa27",
                color: "#e2e8f0",
                textDecoration: "none",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(161,132,250,0.18)";
                e.currentTarget.style.boxShadow = "0 0 20px #a184fa33";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(120,64,200,0.11)";
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
    </Layout>
  );
}