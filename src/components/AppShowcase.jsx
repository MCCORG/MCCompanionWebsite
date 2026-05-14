import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NL = {
    bg: "#111318",
    surface: "#191c23",
    elevated: "#1f232c",
    border: "rgba(255,255,255,0.07)",
    borderMid: "rgba(255,255,255,0.12)",
    text: "#e8e9ec",
    secondary: "#9299a6",
    muted: "#5a6070",
    accent: "#4fd1c5",
    accentDim: "rgba(79,209,197,0.10)",
    accentBorder: "rgba(79,209,197,0.22)",
};

const STEPS = [
    { id: 0, image: "/img/splash.png", title: "Launch", desc: "Open the app. Any console, any server — zero config.", accent: "#4fd1c5" },
    { id: 1, image: "/img/home.png", title: "Pick your server", desc: "Featured partner servers right at your fingertips.", accent: "#60a5fa" },
    { id: 2, image: "/img/partner.png", title: "Explore servers", desc: "Live player counts, online status — one tap to play.", accent: "#a78bfa" },
    { id: 3, image: "/img/support.png", title: "Support built in", desc: "Troubleshooting guides for every console. No Googling.", accent: "#fb923c" },
];

const PHONE_W = 300;
const PHONE_H = 600;

function PhoneMockup({ src, accent }) {
    return (
        <div style={{ position: "relative", width: PHONE_W, height: PHONE_H, flexShrink: 0 }}>
            <div style={{
                position: "absolute", inset: 0,
                borderRadius: 44,
                border: `2px solid ${accent}55`,
                background: "#08090c",
                overflow: "hidden",
                boxShadow: `0 0 0 1px ${accent}20, 0 32px 80px rgba(0,0,0,0.7)`,
            }}>
                <div style={{
                    position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)",
                    width: 88, height: 26, background: "#08090c", borderRadius: 13, zIndex: 10,
                }} />
                <div style={{
                    position: "absolute", top: 3, left: 3, right: 3, bottom: 3,
                    borderRadius: 42, overflow: "hidden", background: "#111318",
                }}>
                    <img src={src} alt="" style={{
                        width: "100%", height: "100%",
                        objectFit: "cover", objectPosition: "top center", display: "block",
                    }} />
                </div>
                <div style={{
                    position: "absolute", inset: 3, borderRadius: 42,
                    background: "linear-gradient(140deg, rgba(255,255,255,0.07) 0%, transparent 40%)",
                    pointerEvents: "none", zIndex: 5,
                }} />
            </div>
            <div style={{ position: "absolute", right: -3, top: 130, width: 4, height: 48, borderRadius: "0 3px 3px 0", background: "rgba(255,255,255,0.12)" }} />
            {[96, 142].map(t => (
                <div key={t} style={{ position: "absolute", left: -3, top: t, width: 4, height: 36, borderRadius: "3px 0 0 3px", background: "rgba(255,255,255,0.12)" }} />
            ))}
        </div>
    );
}

export default function AppShowcase() {
    const [active, setActive] = useState(0);
    const [dir, setDir] = useState(1);
    const timerRef = useRef(null);

    function startTimer() {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setDir(1);
            setActive(a => (a + 1) % STEPS.length);
        }, 3600);
    }

    useEffect(() => { startTimer(); return () => clearInterval(timerRef.current); }, []);

    function goTo(idx) {
        if (idx === active) return;
        setDir(idx > active ? 1 : -1);
        setActive(idx);
        startTimer();
    }

    const step = STEPS[active];

    return (
        <section style={{
            width: "100%", boxSizing: "border-box",
            background: NL.bg,
            padding: "64px 24px 72px",
            display: "flex", flexDirection: "column", alignItems: "center",
            fontFamily: "'Inter', system-ui, sans-serif",
            position: "relative", overflow: "hidden",
        }}>

            <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                backgroundImage: `radial-gradient(circle, ${NL.border} 1px, transparent 1px)`,
                backgroundSize: "28px 28px",
                maskImage: "radial-gradient(ellipse 70% 80% at 50% 50%, black 30%, transparent 100%)",
                WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 50% 50%, black 30%, transparent 100%)",
            }} />

            <div style={{ textAlign: "center", marginBottom: 56, position: "relative", zIndex: 1 }}>
                <span style={{
                    display: "inline-block",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11, letterSpacing: "0.13em", textTransform: "uppercase",
                    color: NL.accent, background: NL.accentDim,
                    border: `1px solid ${NL.accentBorder}`,
                    borderRadius: 4, padding: "4px 12px", marginBottom: 18,
                }}>The app</span>
                <h2 style={{
                    fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, color: NL.text,
                    letterSpacing: "-0.025em", margin: "0 0 10px", lineHeight: 1.2,
                }}>
                    Everything you need, in your pocket
                </h2>
                <p style={{ fontSize: 15, color: NL.secondary, margin: 0 }}>
                    From splash to server in under 10 seconds.
                </p>
            </div>

            <div style={{
                display: "flex", flexDirection: "row",
                gap: 72, alignItems: "center",
                width: "100%", maxWidth: 960,
                flexWrap: "wrap", justifyContent: "center",
                position: "relative", zIndex: 1,
            }}>

                <div style={{ position: "relative", flexShrink: 0 }}>
                    <div style={{
                        position: "absolute", top: "50%", left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: PHONE_W + 120, height: PHONE_H + 120,
                        borderRadius: "50%",
                        background: `radial-gradient(ellipse at center, ${step.accent}28 0%, transparent 65%)`,
                        transition: "background 0.6s ease",
                        pointerEvents: "none",
                    }} />
                    <div style={{ position: "relative", width: PHONE_W, height: PHONE_H }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={active}
                                initial={{ opacity: 0, x: dir * 30, scale: 0.97 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: dir * -30, scale: 0.97 }}
                                transition={{ duration: 0.35, ease: [0.25, 0, 0.15, 1] }}
                                style={{ position: "absolute", inset: 0 }}
                            >
                                <PhoneMockup src={step.image} accent={step.accent} />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minWidth: 260, maxWidth: 360 }}>
                    {STEPS.map((s, i) => {
                        const isActive = i === active;
                        return (
                            <button
                                key={s.id}
                                onClick={() => goTo(i)}
                                style={{
                                    display: "flex", alignItems: "flex-start", gap: 16,
                                    padding: "16px 18px", borderRadius: 16,
                                    background: isActive ? NL.elevated : "transparent",
                                    border: `1px solid ${isActive ? s.accent + "33" : "transparent"}`,
                                    cursor: "pointer", textAlign: "left",
                                    transition: "background 0.22s, border-color 0.22s",
                                    fontFamily: "'Inter', system-ui, sans-serif",
                                    outline: "none",
                                }}
                                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = NL.surface; }}
                                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                            >
                                <div style={{
                                    width: 32, height: 32, borderRadius: 10, flexShrink: 0, marginTop: 1,
                                    background: isActive ? s.accent + "20" : NL.elevated,
                                    border: `1px solid ${isActive ? s.accent + "44" : NL.border}`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    transition: "all 0.22s",
                                }}>
                                    <span style={{
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontSize: 12, fontWeight: 700,
                                        color: isActive ? s.accent : NL.muted,
                                        transition: "color 0.22s",
                                    }}>0{i + 1}</span>
                                </div>

                                <div>
                                    <div style={{
                                        fontSize: 15, fontWeight: 600,
                                        color: isActive ? NL.text : NL.secondary,
                                        margin: "0 0 4px",
                                        transition: "color 0.22s",
                                    }}>{s.title}</div>
                                    <div style={{
                                        fontSize: 13, color: NL.muted, lineHeight: 1.6,
                                        maxHeight: isActive ? 80 : 0,
                                        overflow: "hidden",
                                        transition: "max-height 0.35s ease",
                                    }}>{s.desc}</div>
                                </div>
                            </button>
                        );
                    })}

                    <div style={{ display: "flex", gap: 6, padding: "8px 18px 0" }}>
                        {STEPS.map((s, i) => (
                            <button key={i} onClick={() => goTo(i)} style={{
                                width: i === active ? 24 : 7, height: 7, borderRadius: 4,
                                background: i === active ? step.accent : NL.elevated,
                                border: "none", cursor: "pointer", padding: 0,
                                transition: "width 0.3s, background 0.3s",
                            }} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}