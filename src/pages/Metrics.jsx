import React, { useCallback, useEffect, useState } from "react";
import Layout from "@theme/Layout";

const REGION_BASES = {
  EU: "https://eubackend.netherlink.net",
  US: "https://usbackend.netherlink.net",
};

function IconRefresh({ spinning }) {
  return (
    <svg className={spinning ? "animate-spin" : ""} width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 4v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.51 15a9 9 0 1 0 .49-4.95" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconServer() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="8" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="2" y="14" width="20" height="8" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      <line x1="6" y1="6" x2="6.01" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="6" y1="18" x2="6.01" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconGlobe() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3V0a12 12 0 100 24v-4l-3 3 3 3v4a12 12 0 01-12-12z"/>
    </svg>
  );
}

const MEDAL = ["🥇", "🥈", "🥉"];

function RegionCard({ region, data, onRefresh }) {
  const { top = [], totalCount = 0, totalServers = 0, loading, error } = data;
  const maxCount = top[0]?.count || 1;

  return (
    <div className="bg-[rgba(12,9,18,0.7)] backdrop-blur-xl rounded-2xl border border-white/6 shadow-xl flex flex-col overflow-hidden">

      <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
            <IconGlobe />
          </div>
          <div>
            <h2 className="text-base font-bold text-white leading-none">
              {region === "EU" ? "Europe" : "United States"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{region} region</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Stats chips */}
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 font-medium">
              <IconServer /> {totalServers.toLocaleString()} servers
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium">
              <IconUsers /> {totalCount.toLocaleString()} joins
            </span>
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${
              loading
                ? "bg-white/3 border-white/6 text-slate-600 cursor-not-allowed"
                : "bg-white/5 border-white/8 text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <IconRefresh spinning={loading} />
            Refresh
          </button>
        </div>
      </div>

      <div className="flex sm:hidden gap-2 px-6 pt-4">
        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 font-medium">
          <IconServer /> {totalServers.toLocaleString()} servers
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium">
          <IconUsers /> {totalCount.toLocaleString()} joins
        </span>
      </div>

      <div className="p-6 flex flex-col gap-2 flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
            <Spinner />
            <span className="text-sm">Loading {region} metrics…</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-500">
            <span className="text-2xl">⚠️</span>
            <p className="text-sm text-rose-400">{error}</p>
            <button onClick={onRefresh} className="text-xs text-slate-400 hover:text-white underline mt-1">Try again</button>
          </div>
        ) : top.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-500">
            <span className="text-2xl">📭</span>
            <p className="text-sm">No data yet for {region}.</p>
          </div>
        ) : (
          top.map((row, idx) => {
            const pct = Math.max(4, Math.round((row.count / maxCount) * 100));
            const isTop3 = idx < 3;
            return (
              <div key={row.ip}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                  idx === 0
                    ? "bg-amber-500/8 border-amber-500/20 hover:bg-amber-500/12"
                    : isTop3
                    ? "bg-white/3 border-white/5 hover:bg-white/5"
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
                    <span className={`text-xs font-bold shrink-0 tabular-nums ${
                      idx === 0 ? "text-amber-300" : isTop3 ? "text-slate-300" : "text-slate-500"
                    }`}>
                      {Number(row.count).toLocaleString()}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        idx === 0 ? "bg-amber-400/70" : idx === 1 ? "bg-slate-400/50" : idx === 2 ? "bg-orange-600/50" : "bg-violet-500/40"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function MetricsPage() {
  const [metrics, setMetrics] = useState({
    EU: { top: [], totalCount: 0, totalServers: 0, loading: false, error: null },
    US: { top: [], totalCount: 0, totalServers: 0, loading: false, error: null },
  });

  const fetchMetricsFor = useCallback(async (region) => {
    const base = REGION_BASES[region];
    if (!base) return;
    setMetrics(prev => ({ ...prev, [region]: { ...prev[region], loading: true, error: null } }));
    try {
      const res = await fetch(`${base}/api/metrics`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const top          = Array.isArray(json.top) ? json.top : (json.topServers || []);
      const totalCount   = json.totalCount   ?? json.totalJoins   ?? 0;
      const totalServers = json.totalServers ?? top.length;
      setMetrics(prev => ({ ...prev, [region]: { top, totalCount, totalServers, loading: false, error: null } }));
    } catch (err) {
      setMetrics(prev => ({ ...prev, [region]: { ...prev[region], loading: false, error: `Failed: ${err.message || err}` } }));
    }
  }, []);

  useEffect(() => {
    fetchMetricsFor("EU");
    fetchMetricsFor("US");
  }, [fetchMetricsFor]);

  const totalJoins   = metrics.EU.totalCount   + metrics.US.totalCount;
  const totalServers = metrics.EU.totalServers  + metrics.US.totalServers;

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.4)]" />
              Live data
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Server Metrics
            </h1>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Rankings based on recent connections through the NetherLink app, updated in real time.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-[rgba(12,9,18,0.7)] rounded-xl border border-white/6 px-5 py-4 text-center">
              <p className="text-xs text-slate-500 mb-1">Total servers</p>
              <p className="text-3xl font-bold text-white tabular-nums">{totalServers.toLocaleString()}</p>
              <p className="text-xs text-slate-600 mt-1">across EU + US</p>
            </div>
            <div className="bg-[rgba(12,9,18,0.7)] rounded-xl border border-white/6 px-5 py-4 text-center">
              <p className="text-xs text-slate-500 mb-1">Total joins</p>
              <p className="text-3xl font-bold text-white tabular-nums">{totalJoins.toLocaleString()}</p>
              <p className="text-xs text-slate-600 mt-1">across EU + US</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(REGION_BASES).map(region => (
              <RegionCard
                key={region}
                region={region}
                data={metrics[region]}
                onRefresh={() => fetchMetricsFor(region)}
              />
            ))}
          </div>

          <p className="text-center text-xs text-slate-600 mt-8">
            {Object.entries(REGION_BASES).map(([k, v]) => `${k}: ${v}`).join("  ·  ")}
          </p>
        </div>
      </div>
    </Layout>
  );
}