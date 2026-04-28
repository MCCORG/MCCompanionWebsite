import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaTrophy, FaServer, FaGlobeEurope, FaGlobeAmericas, FaSync, FaUsers } from "react-icons/fa";
import Layout from "@theme/Layout";

const cardStyle = {
    border: "1px solid rgba(0,229,255,0.1)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
};

function MetricBadge({ icon, value, label, color }) {
    const colors = {
        blue: { bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)", text: "#93c5fd" },
        cyan: { bg: "rgba(0,229,255,0.08)", border: "rgba(0,229,255,0.2)", text: "#00e5ff" },
    };
    const c = colors[color] || colors.blue;
    return (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm"
            style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
            {icon}
            <span className="text-base font-bold">{value}</span>
            <span className="text-xs opacity-75">{label}</span>
        </div>
    );
}

function MetricsList({ region, topServers = [], totalServers = 0, totalJoins = 0, loading, refetch }) {
    return (
        <motion.div className="rounded-2xl p-6 sm:p-8" style={cardStyle}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3" style={{ color: "#e2e8f0" }}>
                    <span style={{ color: "#00e5ff" }}>
                        {region === "EU" ? <FaGlobeEurope /> : <FaGlobeAmericas />}
                    </span>
                    Top Servers ({region})
                </h2>
                <div className="flex gap-2 flex-wrap">
                    <MetricBadge icon={<FaServer size={13} />} value={totalServers} label="servers" color="blue" />
                    <MetricBadge icon={<FaUsers size={13} />} value={totalJoins} label="joins" color="cyan" />
                </div>
                <button
                    className="flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full transition-all duration-200"
                    style={{
                        background: "rgba(0,229,255,0.07)",
                        border: "1px solid rgba(0,229,255,0.15)",
                        color: loading ? "#4b5563" : "#00e5ff",
                        cursor: loading ? "not-allowed" : "pointer",
                    }}
                    onClick={refetch}
                    disabled={loading}
                    onMouseEnter={e => {
                        if (!loading) {
                            e.currentTarget.style.background = "rgba(0,229,255,0.13)";
                            e.currentTarget.style.boxShadow = "0 0 14px rgba(0,229,255,0.15)";
                        }
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = "rgba(0,229,255,0.07)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                >
                    <FaSync className={loading ? "animate-spin" : ""} size={12} />
                    Refresh
                </button>
            </div>

            <div className="overflow-x-auto">
                {loading ? (
                    <div className="py-10 text-center">
                        <span className="text-slate-500 font-medium animate-pulse">Loading metrics...</span>
                    </div>
                ) : topServers.length === 0 ? (
                    <div className="py-10 text-center text-slate-600 font-medium">No data yet.</div>
                ) : (
                    <table className="w-full min-w-[360px] rounded-xl overflow-hidden text-sm">
                        <thead>
                            <tr className="text-left" style={{
                                background: "rgba(0,229,255,0.05)",
                                borderBottom: "1px solid rgba(0,229,255,0.1)",
                                color: "#94a3b8",
                            }}>
                                <th className="p-3 w-10 rounded-tl-xl">#</th>
                                <th className="p-3">
                                    <FaServer className="inline mb-0.5 mr-1.5 opacity-60" size={12} />
                                    Server IP
                                </th>
                                <th className="p-3 text-right rounded-tr-xl">
                                    <FaTrophy className="inline mb-0.5 mr-1.5 opacity-60" size={12} />
                                    Joins
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {topServers.map((row, idx) => (
                                <tr key={row.ip}
                                    style={{
                                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                                        background: idx === 0 ? "rgba(250,204,21,0.06)" : idx < 3 ? "rgba(250,204,21,0.03)" : "transparent",
                                        transition: "background 0.2s",
                                    }}
                                    onMouseEnter={e => { if (idx >= 3) e.currentTarget.style.background = "rgba(0,229,255,0.04)"; }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background =
                                            idx === 0 ? "rgba(250,204,21,0.06)" : idx < 3 ? "rgba(250,204,21,0.03)" : "transparent";
                                    }}
                                >
                                    <td className="p-3 text-center font-bold" style={{ color: idx < 3 ? "#fbbf24" : "#64748b" }}>
                                        {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
                                    </td>
                                    <td className="p-3 font-mono break-all" style={{ color: idx === 0 ? "#e2e8f0" : "#94a3b8" }}>
                                        {row.ip}
                                    </td>
                                    <td className="p-3 text-right font-bold" style={{ color: idx === 0 ? "#00e5ff" : "#64748b" }}>
                                        {Number(row.count).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </motion.div>
    );
}

const REGION_BASES = {
    EU: "https://eubackend.netherlink.net",
    US: "https://usbackend.netherlink.net",
};

export default function MetricsPage() {
    const [metrics, setMetrics] = useState({
        EU: { top: [], totalCount: 0, totalServers: 0, loading: false, error: null },
        US: { top: [], totalCount: 0, totalServers: 0, loading: false, error: null },
    });
    const [globalError, setGlobalError] = useState(null);

    const fetchMetricsFor = useCallback(async (region) => {
        const base = REGION_BASES[region];
        if (!base) return;
        setMetrics(prev => ({ ...prev, [region]: { ...prev[region], loading: true, error: null } }));
        try {
            const res = await fetch(`${base}/api/metrics`, { method: "GET" });
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            const json = await res.json();
            const top = Array.isArray(json.top) ? json.top : (json.topServers || []);
            const totalCount = json.totalCount ?? json.totalJoins ?? 0;
            const totalServers = json.totalServers ?? (top.length);
            setMetrics(prev => ({ ...prev, [region]: { top, totalCount, totalServers, loading: false, error: null } }));
        } catch (err) {
            console.error(`[metrics:${region}] fetch error`, err);
            setMetrics(prev => ({ ...prev, [region]: { ...prev[region], loading: false, error: String(err) } }));
            setGlobalError(`Could not fetch ${region} metrics: ${err.message || err}`);
        }
    }, []);

    useEffect(() => {
        fetchMetricsFor("EU");
        fetchMetricsFor("US");
    }, [fetchMetricsFor]);

    return (
        <Layout>
            <div className="min-h-screen px-2 py-12 pt-24">
                <div className="max-w-7xl mx-auto mb-10 text-center">
                    <motion.h1 className="text-4xl sm:text-5xl font-bold mb-3"
                        style={{
                            background: "linear-gradient(135deg, #e2e8f0, #00e5ff 50%, #6366f1)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            filter: "drop-shadow(0 0 24px rgba(0,229,255,0.2))",
                        }}
                        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                    >
                        NetherLink Server Metrics
                    </motion.h1>
                    <motion.p className="text-slate-400 font-medium max-w-xl mx-auto text-sm"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        See which servers are trending! Rankings are based on recent{" "}
                        <span className="text-cyan-400 font-semibold">connections</span> in the NetherLink app.
                    </motion.p>
                </div>

                <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <MetricsList
                            region="EU"
                            topServers={metrics.EU.top}
                            totalServers={metrics.EU.totalServers}
                            totalJoins={metrics.EU.totalCount}
                            loading={metrics.EU.loading}
                            refetch={() => fetchMetricsFor("EU")}
                        />
                        {metrics.EU.error && <div className="text-sm text-rose-400 mt-2">{metrics.EU.error}</div>}
                    </div>

                    <div className="flex-1">
                        <MetricsList
                            region="US"
                            topServers={metrics.US.top}
                            totalServers={metrics.US.totalServers}
                            totalJoins={metrics.US.totalCount}
                            loading={metrics.US.loading}
                            refetch={() => fetchMetricsFor("US")}
                        />
                        {metrics.US.error && <div className="text-sm text-rose-400 mt-2">{metrics.US.error}</div>}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto mt-8 px-6">
                    {globalError && <div className="text-center text-red-500">{globalError}</div>}
                    <div className="mt-4 text-sm text-slate-400 text-center">
                        Regions: {Object.entries(REGION_BASES).map(([k, v]) => `${k}: ${v}`).join("  •  ")}
                    </div>
                </div>
            </div>
        </Layout>
    );
}