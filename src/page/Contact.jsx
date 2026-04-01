import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaEnvelope, FaMapMarkerAlt, FaDiscord,
  FaArrowLeft, FaBuilding, FaIdCard,
} from "react-icons/fa";

const cardStyle = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(0,229,255,0.03) 100%)",
  border: "1px solid rgba(0,229,255,0.1)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
};

const accentBar = {
  position: "absolute",
  top: 0, left: 0, right: 0,
  height: "2px",
  background: "linear-gradient(90deg, #00e5ff66, #6366f166, transparent)",
};

const sectionHeadingStyle = {
  borderLeft: "3px solid #00e5ff",
  paddingLeft: "12px",
  color: "#e2e8f0",
  marginBottom: "16px",
};

const innerCardStyle = {
  background: "rgba(0,229,255,0.03)",
  border: "1px solid rgba(0,229,255,0.08)",
  borderRadius: "12px",
  padding: "20px",
};

const iconBoxStyle = {
  width: "44px", height: "44px",
  background: "rgba(0,229,255,0.08)",
  border: "1px solid rgba(0,229,255,0.15)",
  borderRadius: "12px",
  display: "flex", alignItems: "center", justifyContent: "center",
  flexShrink: 0,
  color: "#00e5ff",
};

const contactDetails = [
  { icon: <FaBuilding />, label: "Company Name", value: "Jens-Co" },
  {
    icon: <FaMapMarkerAlt />, label: "Address",
    value: <>Statiestraat 26<br />1570 Tollembeek<br />Belgium</>,
  },
  {
    icon: <FaEnvelope />, label: "Email",
    value: <a href="mailto:jenscollaert@icloud.com" style={{ color: "#00e5ff", textDecoration: "none" }}
      onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
      onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
    >jenscollaert@icloud.com</a>,
  },
  {
    icon: <FaDiscord />, label: "Discord",
    value: <a href="https://discord.gg/xvaNzE35Rs" target="_blank" rel="noopener noreferrer"
      style={{ color: "#00e5ff", textDecoration: "none" }}
      onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
      onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
    >Join our community</a>,
  },
  { icon: <FaIdCard />, label: "KBO Number", value: <span style={{ fontFamily: "monospace", color: "#94a3b8" }}>1025.363.838</span> },
];

const quickContacts = [
  {
    icon: <FaEnvelope />,
    label: "Email Support",
    value: "jenscollaert@icloud.com",
    href: "mailto:jenscollaert@icloud.com",
  },
  {
    icon: <FaDiscord />,
    label: "Community Discord",
    value: "discord.gg/xvaNzE35Rs",
    href: "https://discord.gg/xvaNzE35Rs",
    external: true,
  },
];

export default function Contact() {
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
          style={cardStyle}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={accentBar} />

          <div className="flex justify-center mb-8">
            <div className="relative">
              <div
                style={{
                  position: "absolute", inset: 0,
                  background: "rgba(0,229,255,0.1)",
                  borderRadius: "50%", filter: "blur(16px)",
                }}
              />
              <div
                className="relative p-5 rounded-full"
                style={{
                  background: "rgba(0,229,255,0.07)",
                  border: "1px solid rgba(0,229,255,0.2)",
                }}
              >
                <FaEnvelope size={40} style={{ color: "#00e5ff" }} />
              </div>
            </div>
          </div>

          <h1
            className="text-4xl font-bold mb-5 text-center"
            style={{
              background: "linear-gradient(135deg, #e2e8f0, #00e5ff 50%, #6366f1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 20px rgba(0,229,255,0.2))",
            }}
          >
            Contact Us
          </h1>
          <p className="mb-10 text-slate-400 text-base text-center max-w-2xl mx-auto leading-relaxed">
            Need help or want to get in touch with{" "}
            <span className="text-slate-200 font-semibold">NetherLink</span>?
            We're happy to assist with support, business inquiries, or feedback!
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-lg font-bold" style={sectionHeadingStyle}>Company Details</h2>
              <div style={innerCardStyle}>
                <div className="grid gap-5">
                  {contactDetails.map(({ icon, label, value }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div style={iconBoxStyle}>{icon}</div>
                      <div>
                        <div className="font-semibold text-sm text-slate-400 mb-0.5">{label}</div>
                        <div className="text-slate-200 text-sm">{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold" style={sectionHeadingStyle}>Support & Quick Contact</h2>
              <div style={innerCardStyle}>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  The quickest way to get help is via our Discord community.
                  For business or privacy matters, please email us directly.
                </p>
                <div className="space-y-3">
                  {quickContacts.map(({ icon, label, value, href, external }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 rounded-xl p-4 transition-all duration-200"
                      style={{
                        background: "rgba(0,229,255,0.03)",
                        border: "1px solid rgba(0,229,255,0.08)",
                      }}
                    >
                      <span style={{ color: "#00e5ff", fontSize: "16px", flexShrink: 0 }}>{icon}</span>
                      <div>
                        <div className="text-xs text-slate-500 mb-0.5">{label}</div>
                        <a
                          href={href}
                          target={external ? "_blank" : undefined}
                          rel={external ? "noopener noreferrer" : undefined}
                          className="text-sm font-medium transition-colors duration-200"
                          style={{ color: "#00e5ff", textDecoration: "none" }}
                          onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                          onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                        >
                          {value}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div className="mt-10 text-center">
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