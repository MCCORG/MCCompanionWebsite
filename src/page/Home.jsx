import { FaWindows, FaApple, FaAndroid, FaBroadcastTower, FaSave, FaBolt, FaCheckCircle, FaSitemap, FaWrench, FaServer, FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";
import FeaturedServersCarousel from "../components/FeaturedServersCarousel";
import { useCombinedMetrics } from "../hooks/useMetrics";

const platforms = [
  { icon: <FaWindows size={30} />, label: "Windows", url: "https://apps.microsoft.com/detail/9NSFPT6D8PTR", color: "#00adef" },
  { icon: <FaApple size={30} />, label: "macOS", url: "https://github.com/NetherLinkMC/NetherLinkWebsite/raw/refs/heads/main/downloads/apple/NetherLink.dmg", color: "#a8a8a8" },
  { icon: <FaAndroid size={30} />, label: "Android", url: "https://play.google.com/store/apps/details?id=net.netherdev.netherLink", color: "#3ddc84" },
  { icon: <FaApple size={30} />, label: "iOS", url: "https://apps.apple.com/be/app/netherlink/id6747323142?l=en", color: "#a8a8a8" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const cardStyle = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(0,229,255,0.03) 100%)",
  border: "1px solid rgba(0,229,255,0.1)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
};

function SectionCard({ icon, title, children }) {
  return (
    <motion.div
      className="relative rounded-2xl p-7 overflow-hidden"
      style={cardStyle}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "2px",
        background: "linear-gradient(90deg, #00e5ff66, #6366f166, transparent)",
      }} />
      <h2 className="text-xl font-bold mb-5 flex items-center gap-3 text-slate-100">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.15)" }}>
          <span style={{ color: "#00e5ff", fontSize: "16px" }}>{icon}</span>
        </div>
        {title}
      </h2>
      {children}
    </motion.div>
  );
}

function StatPill({ icon, value, label, loading }) {
  return (
    <div
      className="flex items-center gap-3 px-5 py-3 rounded-2xl"
      style={{
        background: "rgba(0,229,255,0.05)",
        border: "1px solid rgba(0,229,255,0.12)",
        backdropFilter: "blur(12px)",
      }}
    >
      <span style={{ color: "#00e5ff", fontSize: "18px" }}>{icon}</span>
      <div className="flex flex-col leading-tight">
        {loading ? (
          <span className="w-12 h-5 rounded animate-pulse" style={{ background: "rgba(0,229,255,0.1)" }} />
        ) : (
          <span className="text-xl font-black text-slate-100" style={{ fontVariantNumeric: "tabular-nums" }}>
            {value.toLocaleString()}
          </span>
        )}
        <span className="text-xs text-slate-500 font-medium">{label}</span>
      </div>
    </div>
  );
}

export default function Home() {
  const { totalServers, totalJoins, loading: metricsLoading } = useCombinedMetrics();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "radial-gradient(ellipse 90% 50% at 50% -5%, rgba(0,229,255,0.09) 0%, transparent 65%), radial-gradient(ellipse 50% 30% at 85% 85%, rgba(99,102,241,0.07) 0%, transparent 60%), #0a0a0f",
      }}
    >
      <main className="flex-1 w-full flex flex-col items-center px-4 sm:px-6 pt-28 sm:pt-36">

        <section className="max-w-2xl pb-10 mx-auto text-center flex flex-col gap-6 items-center w-full">
          <motion.section
            className="w-full max-w-2xl mb-10"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.45 }}
          >
            <div className="rounded-2xl px-6 py-5 text-sm"
              style={{
                background: "linear-gradient(135deg, rgba(0,229,255,0.05) 0%, rgba(99,102,241,0.05) 100%)",
                border: "1px solid rgba(0,229,255,0.12)",
                color: "#94a3b8",
              }}
            >
              <b className="text-cyan-400">Update soon:</b>{" "}
              Java Mode, allowing bedrock players to play java only servers.
            </div>
          </motion.section>
          <motion.h1
            className="text-[2.2rem] sm:text-5xl font-extrabold leading-tight"
            style={{
              background: "linear-gradient(135deg, #e2e8f0 0%, #00e5ff 50%, #6366f1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 24px rgba(0,229,255,0.25))",
            }}
            initial="hidden" animate="visible" variants={fadeUp} custom={0}
          >
            NetherLink          </motion.h1>

          <motion.div
            className="flex gap-4 justify-center flex-wrap"
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
          >
            <StatPill
              icon={<FaServer />}
              value={totalServers}
              label="active servers"
              loading={metricsLoading}
            />
            <StatPill
              icon={<FaUsers />}
              value={totalJoins}
              label="total joins"
              loading={metricsLoading}
            />
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mt-2">
            {platforms.map((p, i) => (
              <motion.a
                key={p.label}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeUp}
                custom={3 + i}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.06, y: -4 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-2xl flex flex-col items-center justify-center h-32 w-full cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(0,229,255,0.03) 100%)",
                  border: "1px solid rgba(0,229,255,0.1)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                  backdropFilter: "blur(12px)",
                  textDecoration: "none",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.border = `1px solid ${p.color}44`;
                  e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${p.color}18`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.border = "1px solid rgba(0,229,255,0.1)";
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.3)";
                }}
              >
                <span className="mb-2" style={{ color: p.color }}>{p.icon}</span>
                <span className="font-semibold text-slate-200 text-sm">{p.label}</span>
              </motion.a>
            ))}
          </div>
        </section>

        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <FeaturedServersCarousel />
        </motion.div>

        <motion.section
          className="w-full max-w-4xl mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: <FaCheckCircle />, title: "Simple Setup", desc: "Install the app, choose which mode you need and press start" },
              { icon: <FaSave />, title: "Saveable Server List", desc: "no need to retype IPs, just select and connect." },
              { icon: <FaBolt />, title: "Intelligent Relay & Auto Failover", desc: "Always the fastest relay is used, fallback to EU/USR" },
            ].map((f, i) => (
              <motion.div
                key={i}
                className="flex flex-col gap-3 rounded-2xl px-5 py-6"
                style={cardStyle}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(0,229,255,0.1)", color: "#00e5ff", fontSize: "16px" }}>
                  {f.icon}
                </div>
                <h4 className="font-bold text-slate-100">{f.title}</h4>
                <p className="text-slate-400 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}