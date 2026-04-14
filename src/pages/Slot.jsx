import { motion } from "framer-motion";
import { FaDiscord } from "react-icons/fa";
import { Link } from "react-router-dom";
import Layout from '@theme/Layout';

export default function FeaturedSlot() {
  return (
    <Layout>
      <div className="min-h-screen font-sans flex flex-col">
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
          <motion.div
            className="w-full max-w-md mx-auto rounded-2xl p-8 relative overflow-hidden"
            style={{
              background: "#231f36",
              border: "1.5px solid #413c53",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1
              className="text-3xl md:text-4xl font-extrabold text-center mb-3"
              style={{
                color: "#fff",
                letterSpacing: "-0.03em",
                lineHeight: 1.19
              }}
            >
              Featured Server Slot
            </h1>
            <p className="mb-7 text-white text-center text-base leading-relaxed font-semibold">
              Showcase your Minecraft server in the <span className="text-[#a184fa] font-bold">Featured</span> section of NetherLink.
              <br />
              <span className="text-slate-100/70 font-normal text-sm">Get instantly visible for thousands of console players.</span>
            </p>

            <div
              className="mb-7 rounded-xl p-5 text-center"
              style={{
                background: "#2b2545",
                border: "1.5px solid #7157c733",
              }}
            >
              <span className="block text-[#a184fa] text-xs uppercase tracking-widest mb-2 font-bold">
                Price
              </span>
              <div className="flex items-baseline justify-center gap-1 mb-1">
                <span className="text-4xl font-black" style={{ color: "#fff" }}>$50</span>
                <span className="text-[#ddd] text-base font-bold">/ month</span>
              </div>
              <p className="text-[#e5e5f7] text-[0.98em] mt-1">
                Your server appears in our app, website and Discord Server Of The Day.
              </p>
            </div>

            <div className="mb-7 text-center">
              <p className="text-white font-bold mb-1 text-base">How to request your Featured Slot?</p>
              <p className="text-[#edeeff] text-[15px] mb-4">
                DM <span className="font-bold text-[#a184fa]">Jens.Co</span> on Discord or join the public server:&nbsp;
                <a
                  href="https://discord.gg/xvaNzE35Rs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 align-middle group"
                  style={{ textDecoration: "none", color: "#fff", fontWeight: 500 }}
                >
                  <FaDiscord size={20} className="text-white group-hover:text-[#a184fa] transition-colors duration-150" />
                  <span className="font-semibold">Discord</span>
                </a>
              </p>
            </div>

            <div className="flex flex-col gap-1 items-center">
              <Link
                to="/terms"
                className="text-xs font-medium underline underline-offset-2 text-[#a184fa] hover:text-white"
              >
                Terms of Service
              </Link>
              <p className="text-xs text-[#ddd] text-center mt-1 max-w-xs">
                Your slot supports NetherLink's development and keeps the platform online for everyone.
              </p>
            </div>
          </motion.div>
        </main>
      </div>
    </Layout>
  );
}