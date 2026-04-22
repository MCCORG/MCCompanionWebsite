import { useState, useEffect, useRef } from "react";
import { FaDiscord, FaStar, FaBook, FaChevronDown } from "react-icons/fa";
import { useHistory, useLocation } from "@docusaurus/router";
import sidebars from '../../../sidebars.js';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseClient.js";

const DOC_SIDEBAR = sidebars.tutorialSidebar || sidebars.geyserSidebar || [];

function SidebarDropdown({ items, navigate, level = 0 }) {
  if (!items) return null;
  return (
    <ul className={level > 0 ? "pl-3 pt-1" : ""}>
      {items.map(item => {
        if (item.type === 'doc') {
          return (
            <li key={item.id}>
              <a
                href={`/docs/${item.id}`}
                className="block py-1.5 px-3 rounded text-slate-100 hover:text-slate-200 hover:bg-[#393e4d] transition whitespace-nowrap"
                onClick={e => { e.preventDefault(); navigate(`/docs/${item.id}`); }}
              >
                {item.label}
              </a>
            </li>
          );
        }

        if (item.type === 'category') {
          return (
            <li key={item.label} className="mt-1">
              <div className="flex items-center gap-2 font-semibold text-slate-300">
                <FaChevronDown className="text-xs opacity-60" />
                {item.label}
              </div>
              <SidebarDropdown items={item.items} navigate={navigate} level={level + 1} />
            </li>
          );
        }

        if (typeof item === 'string') {
          return (
            <li key={item}>
              <a
                href={`/docs/${item.replace(/\/?index$/, '')}`}
                className="block py-1.5 px-3 rounded text-slate-100 hover:text-slate-200  hover:bg-[#1b1d24] transition whitespace-nowrap"
                onClick={e => { e.preventDefault(); navigate(`/docs/${item.replace(/\/?index$/, '')}`); }}
              >
                {item.split('/').slice(-1)[0].replace(/-/g, ' ')}
              </a>
            </li>
          );
        }
        return null;
      })}
    </ul>
  );
}

function HamburgerIcon() {
  return (
    <div className="w-7 h-7 flex flex-col items-center justify-center gap-[5px]">
      <span className="block h-0.5 w-6 rounded bg-white"></span>
      <span className="block h-0.5 w-6 rounded bg-white"></span>
      <span className="block h-0.5 w-6 rounded bg-white"></span>
    </div>
  );
}

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [wikiDrop, setWikiDrop] = useState(false);
  const [wikiDropMobile, setWikiDropMobile] = useState(false);
  const [user, setUser] = useState(null); // <-- auth state
  const menuRef = useRef();
  const wikiRef = useRef();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => { setDrawerOpen(false); setWikiDrop(false); setWikiDropMobile(false); }, [location.pathname]);

  useEffect(() => {
    function handle(e) {
      if (wikiRef.current && !wikiRef.current.contains(e.target)) setWikiDrop(false);
    }
    if (wikiDrop) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [wikiDrop]);

  useEffect(() => {
    function handle(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setDrawerOpen(false);
    }
    if (drawerOpen) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [drawerOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Observe firebase auth state (guarded for SSR: auth may be null)
  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  function navigate(path) {
    history.push(path);
    setDrawerOpen(false);
    setWikiDrop(false);
    setWikiDropMobile(false);
  }

  const NAVBAR_HEIGHT = 68;
  const NAV_BG = "#1b1d24";

  return (
    <header key={location.pathname} className="navbar nl-navbar fixed w-full top-0 z-40 transition-all" style={{
      background: NAV_BG,
      borderBottom: "1px solid rgba(120,64,200,0.10)",
      boxShadow: scrolled ? "0 4px 32px rgba(45,30,65,0.18)" : "none",
    }}>
      <div className="w-full px-5 md:px-12 py-3 flex items-center" style={{ maxWidth: "100vw" }}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => history.push("/")}>
          <span className="font-black text-2xl tracking-tight" style={{
            background: "linear-gradient(135deg, #9e9bac 0%, #a492b4 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 8px rgba(120,64,200,0.3))",
          }}>NL</span>
          <span className="font-bold text-slate-100 text-lg hidden sm:block tracking-wide">NetherLink</span>
        </div>
        <div className="flex-1"></div>
        <div className="hidden md:flex items-center gap-4">
          <div className="relative" ref={wikiRef}>
            <button
              onClick={() => setWikiDrop((x) => !x)}
              onMouseEnter={() => setWikiDrop(true)}
              className="flex items-center gap-2 text-slate-200 hover:text-slate-100 font-semibold px-2 py-1 rounded relative"
              style={{ background: "none", border: "none" }}
              aria-haspopup="menu"
              aria-expanded={wikiDrop}
            >
              <FaBook size={18} /> Wiki
              <FaChevronDown
                size={16}
                className={`transition-transform duration-200 ml-1 ${wikiDrop ? "rotate-180" : ""}`}
              />
            </button>
            {wikiDrop && DOC_SIDEBAR.length > 0 && (
              <div
                className="absolute left-0 top-full min-w-[240px] border border-gray-800 rounded-xl shadow-2xl p-2 mt-2 z-50"
                style={{ backgroundColor: "#1b1d24" }}
              >
                <SidebarDropdown items={DOC_SIDEBAR} navigate={navigate} />
              </div>
            )}
          </div>

          <button onClick={() => navigate("/slot")} className="flex items-center gap-2 text-slate-200 hover:text-slate-300 font-semibold px-2 py-1 rounded"><FaStar size={18} /> Featured Slot</button>

          {/* Dashboard button visible only when signed in */}
          {user && (
            <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-slate-200 hover:text-slate-300 font-semibold px-2 py-1 rounded bg-slate-900/20">
              Dashboard
            </button>
          )}

          <a href="https://discord.gg/xvaNzE35Rs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-200 hover:text-slate-300 font-semibold px-2 py-1 rounded"><FaDiscord size={18} /> Discord</a>
        </div>
        <button
          className="md:hidden ml-2"
          aria-label={drawerOpen ? "Close menu" : "Open menu"}
          onClick={() => setDrawerOpen(v => !v)}
          style={{
            background: "none",
            border: "none",
            boxShadow: "none",
          }}
        >
          <HamburgerIcon />
        </button>
      </div>

      <div
        ref={menuRef}
        className={`fixed top-0 right-0 z-50 h-full transition-transform duration-300 md:hidden ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{
          width: "80vw",
          maxWidth: 320,
          paddingTop: NAVBAR_HEIGHT + 18,
          display: "flex",
          flexDirection: "column",
          gap: "0.8rem",
          background: "#1b1d24",
          borderTopLeftRadius: 32,
          borderBottomLeftRadius: 32,
          overflowY: "auto",
          position: "fixed",
          right: 0,
          top: 0
        }}
      >
        <button
          onClick={() => setDrawerOpen(false)}
          aria-label="Close sidebar"
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            zIndex: 10001,
            background: "none",
            border: "none",
            color: "#5c534d",
            fontSize: 27,
            cursor: "pointer",
            padding: 5,
            lineHeight: 1
          }}
          tabIndex={0}
        >
          &#10005;
        </button>
        <div>
          <button onClick={() => setWikiDropMobile(x => !x)} className="w-full text-left flex items-center gap-2 px-5 py-4 rounded-2xl text-slate-200 hover:text-slate-300  font-semibold" style={{ background: "none", border: "none" }}>
            <FaBook className="inline-block" size={19} /> Wiki
            <FaChevronDown className={`ml-auto transition-transform ${wikiDropMobile ? "rotate-180" : ""}`} size={16} />
          </button>
          {wikiDropMobile && DOC_SIDEBAR.length > 0 && (
            <div className="pl-3 pt-1 fadein" style={{ borderLeft: "2px solid #26221f", backgroundColor: "#2c2824" }}>
              <SidebarDropdown items={DOC_SIDEBAR} navigate={navigate} />
            </div>
          )}
        </div>
        <button onClick={() => navigate("/slot")} className="w-full text-left flex items-center gap-2 px-5 py-4 rounded-2xl text-slate-200 hover:text-slate-300 font-semibold" style={{ background: "none", border: "none" }}>
          <FaStar className="inline-block" size={19} /> Featured Slot
        </button>

        {/* Dashboard (mobile) */}
        {user && (
          <button onClick={() => { navigate("/dashboard"); }} className="w-full text-left flex items-center gap-2 px-5 py-4 rounded-2xl text-slate-200 hover:text-slate-300 font-semibold" style={{ background: "none", border: "none" }}>
            Dashboard
          </button>
        )}

        <a href="https://discord.gg/xvaNzE35Rs" target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-2 px-5 py-4 rounded-2xl text-slate-200 hover:text-slate-300 font-semibold" style={{ background: "none", border: "none" }} onClick={() => setDrawerOpen(false)}>
          <FaDiscord className="inline-block" size={19} /> Discord
        </a>
      </div>
    </header>
  );
}