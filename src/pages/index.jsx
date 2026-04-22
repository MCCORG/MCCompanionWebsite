import { useState, useEffect } from "react";
import { FaWindows, FaApple, FaAndroid, FaSave, FaBolt, FaCheckCircle, FaServer, FaUsers } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
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
  background: "linear-gradient(135deg, #242f3a 0%, #1b232b 100%)",
  border: "1.5px solid rgba(47,66,90,0.18)",
  boxShadow: "0 6px 36px rgba(30,46,85,0.14)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
};

function RotatingWords({
  prefix = "No bullshit. Just",
  words = ["add your server", "start mode", "connect", "play"],
  interval = 2200,
  accentColor = "#55eafc",
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval]);

  const display = words[idx].charAt(0).toUpperCase() + words[idx].slice(1);

  return (
    <span style={{ display: "inline-block", marginLeft: 6 }}>
      <span style={{ color: "inherit", fontWeight: 600 }}>{prefix} </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.36, ease: "easeOut" }}
          style={{ display: "inline-block", color: accentColor, fontWeight: 800 }}
        >
          {display}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

function StatPill({ icon, value, label, loading }) {
  return (
    <div
      className="flex items-center gap-3 px-5 py-3 rounded-2xl"
      style={{
        background: "rgba(44,56,72,0.13)",
        border: "1px solid rgba(47,66,90,0.21)",
        boxShadow: "0 2px 10px rgba(30,46,85,0.10)",
        backdropFilter: "blur(7px)",
      }}
    >
      <span style={{ color: "#49caff", fontSize: "18px" }}>{icon}</span>
      <div className="flex flex-col leading-tight">
        {loading ? (
          <span className="w-12 h-5 rounded animate-pulse" style={{ background: "#315174" }} />
        ) : (
          <span className="text-xl font-black text-slate-100" style={{ fontVariantNumeric: "tabular-nums" }}>
            {value.toLocaleString()}
          </span>
        )}
        <span className="text-xs text-slate-400 font-medium">{label}</span>
      </div>
    </div>
  );
}

export default function Home() {
  const { totalServers, totalJoins, loading: metricsLoading } = useCombinedMetrics();

  return (
    <Layout>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 w-full flex flex-col items-center px-4 sm:px-6 pt-28 sm:pt-36">

          <section className="max-w-2xl pb-10 mx-auto text-center flex flex-col gap-6 items-center w-full">
            <motion.section
              className="w-full max-w-2xl mb-10"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.45 }}
            >
              <div className="rounded-2xl px-6 py-5 text-sm shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #273746 0%, #212932 100%)",
                  border: "1.5px solid rgba(47,66,90,0.21)",
                  color: "#bde9f7",
                }}
              >
                <b style={{ color: "#41cdfc" }}>Update soon:</b>{" "}
                Backend servers rewritten, better performance, more stability and a new website layout.{" "}
              </div>
            </motion.section>

            <motion.p
              className="mt-2 mb-4 text-base sm:text-lg text-slate-200 font-medium max-w-xl mx-auto"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
              style={{
                textShadow: "0 2px 10px rgba(30,45,60,0.10)",
              }}
            >
              <RotatingWords words={["add your server", "start mode", "connect", "play"]} interval={2200} />
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
                  className="rounded-2xl flex flex-col items-center justify-center h-32 w-full cursor-pointer transition-all"
                  style={{
                    background: "linear-gradient(135deg, #232f3c 0%, #263741 100%)",
                    border: "1.5px solid rgba(47,66,90,0.18)",
                    boxShadow: "0 4px 28px rgba(30,46,85,0.12)",
                    backdropFilter: "blur(7px)",
                    textDecoration: "none",
                    color: "#eaf6fd",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "linear-gradient(135deg, #25384a 0%, #355470 100%)";
                    e.currentTarget.style.border = `1.5px solid ${p.color}`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "linear-gradient(135deg, #232f3c 0%, #263741 100%)";
                    e.currentTarget.style.border = "1.5px solid rgba(47,66,90,0.18)";
                  }}
                >
                  <span className="mb-2" style={{ color: p.color }}>{p.icon}</span>
                  <span className="font-semibold text-slate-100 text-sm">{p.label}</span>
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
        </main>
      </div>
    </Layout>
  );
}