import { useEffect, useState, useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaExternalLinkAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const DATA_URL =
  "https://raw.githubusercontent.com/NetherDevMc/NetherLinkData/main/featured/featured-servers";

export default function FeaturedServersCarousel() {
  const [servers, setServers] = useState([]);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const timer = useRef();

  useEffect(() => {
    fetch(DATA_URL)
      .then(r => r.json())
      .then(data => {
        setServers(data);
        if (data.length) setActive(Math.floor(Math.random() * data.length));
      })
      .catch(() => setServers([]));
  }, []);

  useEffect(() => {
    if (!servers.length) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setDirection(1);
      setActive(a => (a === servers.length - 1 ? 0 : a + 1));
    }, 4500);
    return () => clearTimeout(timer.current);
  }, [active, servers.length]);

  const prev = () => {
    setDirection(-1);
    setActive(a => (a === 0 ? servers.length - 1 : a - 1));
  };
  const next = () => {
    setDirection(1);
    setActive(a => (a === servers.length - 1 ? 0 : a + 1));
  };

  const slideVariants = {
    enter: d => ({ opacity: 0, x: d > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
    exit: d => ({ opacity: 0, x: d > 0 ? -40 : 40, transition: { duration: 0.25 } }),
  };

  if (!servers.length) {
    return (
      <section className="w-full max-w-xl mx-auto mb-12">
        <div
          className="rounded-2xl px-7 py-8 flex justify-center items-center min-h-[160px]"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(0,229,255,0.03) 100%)",
            border: "1px solid rgba(0,229,255,0.1)",
          }}
        >
          <span className="text-slate-500 font-semibold animate-pulse">Loading featured servers...</span>
        </div>
      </section>
    );
  }

  const current = servers[active];

  return (
    <section className="w-full max-w-xl mx-auto mb-12 px-2">
      <div
        className="rounded-2xl py-6 px-4 relative overflow-hidden min-h-[200px] flex flex-col items-center"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(0,229,255,0.04) 100%)",
          border: "1px solid rgba(0,229,255,0.12)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,229,255,0.05)",
          backdropFilter: "blur(16px)",
        }}
      >
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full transition-all duration-200 text-slate-300 hover:text-cyan-400"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(0,229,255,0.1)";
            e.currentTarget.style.border = "1px solid rgba(0,229,255,0.25)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)";
          }}
          aria-label="Previous server"
        >
          <FaChevronLeft size={18} />
        </button>

        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full transition-all duration-200 text-slate-300 hover:text-cyan-400"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(0,229,255,0.1)";
            e.currentTarget.style.border = "1px solid rgba(0,229,255,0.25)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)";
          }}
          aria-label="Next server"
        >
          <FaChevronRight size={18} />
        </button>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={active}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex flex-col items-center text-center px-10 w-full"
          >
            {current.iconUrl && (
              <img
                src={current.iconUrl}
                alt={current.name + " icon"}
                className="w-16 h-16 rounded-xl mb-3 object-cover"
                style={{
                  border: "1px solid rgba(0,229,255,0.2)",
                  boxShadow: "0 0 20px rgba(0,229,255,0.1)",
                  background: "rgba(255,255,255,0.05)",
                }}
              />
            )}
            <h3
              className="text-lg font-bold mb-1"
              style={{ color: "#e2e8f0" }}
            >
              {current.name}
            </h3>
            <div className="text-cyan-400 text-xs font-mono mb-1">
              {current.address}:{current.port}
            </div>
            <div className="text-slate-400 text-xs mb-4">{current.description}</div>
            <a
              href={current.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200"
              style={{
                color: "#00e5ff",
                background: "rgba(0,229,255,0.08)",
                border: "1px solid rgba(0,229,255,0.2)",
                textDecoration: "none",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(0,229,255,0.15)";
                e.currentTarget.style.boxShadow = "0 0 16px rgba(0,229,255,0.2)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(0,229,255,0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Visit website <FaExternalLinkAlt size={11} />
            </a>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-1.5 justify-center mt-5">
          {servers.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > active ? 1 : -1); setActive(i); }}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === active ? "20px" : "8px",
                height: "8px",
                background: i === active ? "#00e5ff" : "rgba(255,255,255,0.15)",
                boxShadow: i === active ? "0 0 8px rgba(0,229,255,0.6)" : "none",
                border: "none",
                cursor: "pointer",
              }}
              aria-label={`Go to server ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}