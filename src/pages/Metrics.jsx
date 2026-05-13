import React, { useCallback, useEffect, useState } from "react";
import Layout from "@theme/Layout";

const REGION_BASES = {
  EU: "https://eubackend.netherlink.net",
  US: "https://usbackend.netherlink.net",
};

async function dbFetch(path, options = {}) {
  for (const base of [REGION_BASES.EU, REGION_BASES.US]) {
    try {
      const res = await fetch(`${base}${path}`, options);
      if (res.ok || res.status < 500) {
        const data = await res.json().catch(() => ({}));
        return { ok: res.ok, status: res.status, data };
      }
    } catch (_) { }
  }
  throw new Error("Both regions unreachable");
}

function IconRefresh({ spinning }) {
  return (
    <svg className={spinning ? "animate-spin" : ""} width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 4v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.51 15a9 9 0 1 0 .49-4.95" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconServer() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="8" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="2" y="14" width="20" height="8" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <line x1="6" y1="6" x2="6.01" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="6" y1="18" x2="6.01" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Spinner() {
  return (
    <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3V0a12 12 0 100 24v-4l-3 3 3 3v4a12 12 0 01-12-12z" />
    </svg>
  );
}

const MEDAL = ["🥇", "🥈", "🥉"];

export default function MetricsPage() {
  const [top, setTop] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalServers, setTotalServers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const { ok, status, data: json } = await dbFetch("/api/metrics");
      if (!ok) throw new Error(`HTTP ${status}`);
      setTop(Array.isArray(json.top) ? json.top : []);
      setTotalCount(json.totalCount ?? 0);
      setTotalServers(json.totalServers ?? 0);
    } catch (err) {
      setError(`Failed: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMetrics(); }, [fetchMetrics]);

  const maxCount = top[0]?.count || 1;

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.4)]" />
              Live data
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Server Metrics</h1>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Rankings based on connections through the NetherLink app.
            </p>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-[rgba(12,9,18,0.7)] rounded-xl border border-white/6 px-5 py-4 text-center">
              <p className="text-xs text-slate-500 mb-1 flex items-center justify-center gap-1.5"><IconServer /> Total servers</p>
              <p className="text-3xl font-bold text-white tabular-nums">{totalServers.toLocaleString()}</p>
            </div>
            <div className="bg-[rgba(12,9,18,0.7)] rounded-xl border border-white/6 px-5 py-4 text-center">
              <p className="text-xs text-slate-500 mb-1 flex items-center justify-center gap-1.5"><IconUsers /> Total joins</p>
              <p className="text-3xl font-bold text-white tabular-nums">{totalCount.toLocaleString()}</p>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-[rgba(12,9,18,0.7)] backdrop-blur-xl rounded-2xl border border-white/6 shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-100">Top servers</h2>
              <button
                onClick={fetchMetrics} disabled={loading}
                className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${loading ? "bg-white/3 border-white/6 text-slate-600 cursor-not-allowed"
                    : "bg-white/5 border-white/8 text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}>
                <IconRefresh spinning={loading} /> Refresh
              </button>
            </div>

            <div className="p-4 flex flex-col gap-1.5">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
                  <Spinner /><span className="text-sm">Loading metrics…</span>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-500">
                  <span className="text-2xl">⚠️</span>
                  <p className="text-sm text-rose-400">{error}</p>
                  <button onClick={fetchMetrics} className="text-xs text-slate-400 hover:text-white underline mt-1">Try again</button>
                </div>
              ) : top.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-500">
                  <span className="text-2xl">📭</span>
                  <p className="text-sm">No data yet.</p>
                </div>
              ) : top.map((row, idx) => {
                const pct = Math.max(4, Math.round((row.count / maxCount) * 100));
                const isTop3 = idx < 3;
                return (
                  <div key={row.ip}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${idx === 0 ? "bg-amber-500/8 border-amber-500/20 hover:bg-amber-500/12"
                        : isTop3 ? "bg-white/3 border-white/5 hover:bg-white/5"
                          : "bg-transparent border-transparent hover:bg-white/3 hover:border-white/5"
                      }`}
                  >
                    <div className="w-8 text-center shrink-0">
                      {idx < 3
                        ? <span className="text-base leading-none">{MEDAL[idx]}</span>
                        : <span className="text-xs font-bold text-slate-600">{idx + 1}</span>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className={`font-mono text-sm truncate ${idx === 0 ? "text-white" : "text-slate-300"}`}>
                          {row.ip}
                        </span>
                        <span className={`text-xs font-bold shrink-0 tabular-nums ${idx === 0 ? "text-amber-300" : isTop3 ? "text-slate-300" : "text-slate-500"
                          }`}>
                          {Number(row.count).toLocaleString()}
                        </span>
                      </div>
                      <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${idx === 0 ? "bg-amber-400/70"
                              : idx === 1 ? "bg-slate-400/50"
                                : idx === 2 ? "bg-orange-600/50"
                                  : "bg-violet-500/40"
                            }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}