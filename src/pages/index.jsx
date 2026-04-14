import { FaWindows, FaApple, FaAndroid, FaSave, FaBolt, FaCheckCircle, FaServer, FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";
import FeaturedServersCarousel from "../components/FeaturedServersCarousel";
import { useCombinedMetrics } from "../hooks/useMetrics";
import Layout from '@theme/Layout';

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
  background: "linear-gradient(135deg, rgba(34, 17, 60, 0.16) 0%, rgba(32,18,77,0.11) 100%)",
  border: "1px solid rgba(81,51,150,0.16)",
  boxShadow: "0 8px 32px rgba(32,18,77,0.28)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
};

function StatPill({ icon, value, label, loading }) {
  return (
    <div
      className="flex items-center gap-3 px-5 py-3 rounded-2xl"
      style={{
        background: "rgba(100,80,160,0.09)",
        border: "1px solid rgba(120,96,200,0.16)",
        backdropFilter: "blur(12px)",
      }}
    >
      <span style={{ color: "#a184fa", fontSize: "18px" }}>{icon}</span>
      <div className="flex flex-col leading-tight">
        {loading ? (
          <span className="w-12 h-5 rounded animate-pulse" style={{ background: "rgba(120,96,200,0.13)" }} />
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
    <Layout>
      <div
        className="min-h-screen flex flex-col">
        <main className="flex-1 w-full flex flex-col items-center px-4 sm:px-6 pt-28 sm:pt-36">

          <section className="max-w-2xl pb-10 mx-auto text-center flex flex-col gap-6 items-center w-full">
            <motion.section
              className="w-full max-w-2xl mb-10"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.45 }}
            >
              <div className="rounded-2xl px-6 py-5 text-sm"
                style={{
                  background: "linear-gradient(135deg, rgba(54, 28, 120, 0.07) 0%, rgba(92, 52, 160, 0.08) 100%)",
                  border: "1px solid rgba(81,51,150,0.16)",
                  color: "#b5aaf0",
                }}
              >
                <b className="text-violet-300">Update soon:</b>{" "}
                Java Mode, allowing bedrock players to play java only servers.
              </div>
            </motion.section>

            <motion.p
              className="mt-2 mb-4 text-base sm:text-lg text-slate-300 font-medium max-w-xl mx-auto"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
              style={{
                textShadow: "0 2px 10px rgba(70,40,160,0.12)",
              }}
            >
              Play on any server from any platform Xbox, PlayStation 4-5, or Nindendo Switch. Simple, seamless, and together.
            </motion.p>

            <motion.div
              className="flex gap-4 justify-center flex-wrap"
              initial="hidden" animate="visible" variants={fadeUp} custom={2}
            >
              <StatPill
                icon={<FaServer />}
                value={totalServers}
                label="Total servers joined"
                loading={metricsLoading}
              />
              <StatPill
                icon={<FaUsers />}
                value={totalJoins}
                label="Total players connected"
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
                    background: "linear-gradient(135deg, rgba(66,51,150,0.14) 0%, rgba(26,8,40,0.09) 100%)",
                    border: "1px solid rgba(81,51,150,0.19)",
                    boxShadow: "0 4px 24px rgba(38,22,53,0.14)",
                    backdropFilter: "blur(12px)",
                    textDecoration: "none",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.border = `1px solid ${p.color}44`;
                    e.currentTarget.style.boxShadow = `0 8px 32px rgba(80,64,110,0.17), 0 0 20px ${p.color}30`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.border = "1px solid rgba(81,51,150,0.19)";
                    e.currentTarget.style.boxShadow = "0 4px 24px rgba(38,22,53,0.14)";
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
                    style={{ background: "rgba(81,51,150,0.12)", color: "#a184fa", fontSize: "16px" }}>
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
    </Layout>
  );
}