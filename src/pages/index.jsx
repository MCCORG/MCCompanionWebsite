import { useState, useEffect } from "react";
import { FaWindows, FaApple, FaAndroid, FaServer, FaUsers } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import FeaturedServersCarousel from "../components/FeaturedServersCarousel";
import { useCombinedMetrics } from "../hooks/useMetrics";
import ChangelogSection from "../components/ChangelogSection";
import Layout from '@theme/Layout';

const platforms = [
  { icon: <FaWindows size={26} />, label: "Windows", url: "https://apps.microsoft.com/detail/9NSFPT6D8PTR", color: "#00adef" },
  { icon: <FaApple size={26} />, label: "macOS", url: "https://github.com/NetherLinkMC/NetherLinkWebsite/raw/refs/heads/main/downloads/apple/NetherLink.dmg", color: "#a8a8a8" },
  { icon: <FaAndroid size={26} />, label: "Android", url: "https://play.google.com/store/apps/details?id=net.netherdev.netherLink", color: "#3ddc84" },
  { icon: <FaApple size={26} />, label: "iOS", url: "https://apps.apple.com/be/app/netherlink/id6747323142?l=en", color: "#a8a8a8" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.09, duration: 0.5, ease: "easeOut" },
  }),
};

function RotatingWords({
  prefix = "No bullshit. Just",
  words = ["add your server", "start mode", "connect", "play"],
  interval = 2200,
  accentColor = "#55eafc",
}) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval]);

  return (
    <span>
      <span className="text-slate-200 font-medium">{prefix} </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          style={{ display: "inline-block", color: accentColor, fontWeight: 800 }}
        >
          {words[idx].charAt(0).toUpperCase() + words[idx].slice(1)}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Home() {
  const { totalServers, totalJoins, loading: metricsLoading } = useCombinedMetrics();

  return (
    <Layout>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 w-full flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16">
          <div className="w-full max-w-6xl flex flex-col gap-8">

            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
            </motion.div>

            <motion.div
              className="flex flex-col gap-4 items-center text-center"
              variants={fadeUp} custom={0} initial="hidden" animate="visible"
            >
              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight">
                Connect to any <span style={{ color: "#55eafc" }}>Minecraft</span> server
              </h1>
              <p className="text-lg text-slate-400">
                <RotatingWords words={["add your server", "start mode", "connect", "play"]} interval={2200} />
              </p>
              <div className="flex gap-3 flex-wrap justify-center">
                {[
                  { icon: <FaServer size={12} />, value: totalServers, label: "servers joined" },
                  { icon: <FaUsers size={12} />, value: totalJoins, label: "players connected" },
                ].map(s => (
                  <div
                    key={s.label}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <span className="text-cyan-400">{s.icon}</span>
                    {metricsLoading
                      ? <span className="w-10 h-4 rounded animate-pulse bg-white/10" />
                      : <span className="text-sm font-bold text-white tabular-nums">{s.value.toLocaleString()}</span>
                    }
                    <span className="text-xs text-slate-500">{s.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

              <div className="flex-1 min-w-0 flex flex-col gap-6">

                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                  variants={fadeUp} custom={1} initial="hidden" animate="visible"
                >
                  {platforms.map(p => (
                    <motion.a
                      key={p.label}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.04, y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex flex-col items-center justify-center gap-2.5 py-6 rounded-2xl"
                      style={{
                        background: "linear-gradient(135deg, #232f3c 0%, #1e2a36 100%)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        textDecoration: "none",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.border = `1px solid ${p.color}55`;
                        e.currentTarget.style.background = "linear-gradient(135deg, #25384a 0%, #1e2a36 100%)";
                        e.currentTarget.style.boxShadow = `0 4px 20px ${p.color}18`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)";
                        e.currentTarget.style.background = "linear-gradient(135deg, #232f3c 0%, #1e2a36 100%)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <span style={{ color: p.color }}>{p.icon}</span>
                      <span className="text-xs font-semibold text-slate-300">{p.label}</span>
                    </motion.a>
                  ))}
                </motion.div>

                <motion.div
                  className="w-full"
                  variants={fadeUp} custom={2} initial="hidden" animate="visible"
                >
                  <FeaturedServersCarousel />
                </motion.div>

              </div>

              <motion.div
                className="w-full lg:w-[360px] xl:w-[400px] shrink-0"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
              >
                <ChangelogSection />
              </motion.div>

            </div>

          </div>
        </main>
      </div>
    </Layout>
  );
}