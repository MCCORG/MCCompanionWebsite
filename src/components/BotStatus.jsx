import { useState, useEffect, useCallback } from "react";

const NL = {
  bg: "#111318",
  surface: "#191c23",
  elevated: "#1f232c",
  subtle: "#252931",
  border: "rgba(255,255,255,0.07)",
  borderMid: "rgba(255,255,255,0.12)",
  text: "#e8e9ec",
  secondary: "#9299a6",
  muted: "#5a6070",
  accent: "#67e404",
  accentDim: "rgba(103,228,4,0.08)",
  accentBorder: "rgba(103,228,4,0.20)",
  warn: "#f59e0b",
  warnDim: "rgba(245,158,11,0.10)",
  warnBorder: "rgba(245,158,11,0.22)",
  danger: "#f87171",
};

const REGIONS = [
  { key: "EU", label: "Europe", flag: "🇪🇺", url: "https://api.mccompanion.net/api/bots?region=eu" },
  { key: "US", label: "United States", flag: "🇺🇸", url: "https://api.mccompanion.net/api/bots?region=us" },
];

function IconRefresh({ spinning }) {
  return (
    <svg
      style={{
        animation: spinning ? "spin 0.8s linear infinite" : "none",
        display: "block",
      }}
      width="13" height="13" viewBox="0 0 24 24" fill="none"
    >
      <path d="M1 4v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.51 15a9 9 0 1 0 .49-4.95" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

function IconXbox() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.102 5.388C3.214 6.528 2.5 7.978 2.5 9.74c0 2.977 1.376 5.635 3.527 7.373C7.217 15.66 8.757 13.61 10.578 12c-1.828-2.01-4.238-5.17-6.476-6.612zm15.796 0C17.66 6.83 15.25 9.99 13.422 12c1.821 1.61 3.361 3.66 4.551 5.113A9.47 9.47 0 0 0 21.5 9.74c0-1.762-.714-3.212-1.602-4.352zM12 2C9.86 2 7.91 2.8 6.43 4.14 8.96 5.64 11.43 9.07 12 9.73c.57-.66 3.04-4.09 5.57-5.59C16.09 2.8 14.14 2 12 2zm0 11.06c-1.66 1.55-3.17 3.61-4.25 5.71A9.46 9.46 0 0 0 12 20.5c1.55 0 3.01-.37 4.25-1.02C15.17 17.37 13.66 15.31 12 13.76z" />
    </svg>
  );
}

function FriendBar({ count, max = 2000 }) {
  const pct = max > 0 ? Math.min(100, Math.round((count / max) * 100)) : 0;
  const isAlmostFull = pct >= 90;
  const isHalfFull = pct >= 50;
  const barColor = isAlmostFull ? NL.warn : isAlmostFull || isHalfFull ? NL.accent : NL.accent;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: NL.muted }}>
          Friends
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12, fontWeight: 700,
          color: isAlmostFull ? NL.warn : NL.text,
        }}>
          {count.toLocaleString()}
          <span style={{ color: NL.muted, fontWeight: 400 }}> / {max.toLocaleString()}</span>
        </span>
      </div>
      <div style={{ height: 4, borderRadius: 4, background: NL.subtle, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 4,
          background: isAlmostFull ? NL.warn : NL.accent,
          width: `${pct}%`,
          transition: "width 0.7s cubic-bezier(0.4,0,0.2,1)",
        }} />
      </div>
      {isAlmostFull && (
        <p style={{ fontSize: 10, color: NL.warn, marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>
          ⚠ Almost full
        </p>
      )}
    </div>
  );
}

function BotCard({ bot, index }) {
  const hasFriends = typeof bot.friendCount === "number";

  return (
    <div style={{
      background: NL.elevated,
      border: `1px solid ${NL.border}`,
      borderRadius: 12,
      padding: "14px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      transition: "border-color 0.2s",
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = NL.borderMid}
      onMouseLeave={e => e.currentTarget.style.borderColor = NL.border}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 28, height: 28, borderRadius: 8,
          background: NL.accentDim, border: `1px solid ${NL.accentBorder}`,
          color: NL.accent, flexShrink: 0,
        }}>
          <IconXbox />
        </span>
        <div style={{ minWidth: 0 }}>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13, fontWeight: 600, color: NL.text,
            margin: 0,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {bot.gamertag}
          </p>
          <p style={{ fontSize: 10, color: NL.muted, margin: 0, marginTop: 1 }}>
            Bot {index + 1}
          </p>
        </div>
      </div>

      {hasFriends
        ? <FriendBar count={bot.friendCount} max={bot.maxFriends ?? 2000} />
        : (
          <p style={{
            fontSize: 11, color: NL.muted,
            fontFamily: "'JetBrains Mono', monospace",
            margin: 0,
          }}>
            Friend count unavailable
          </p>
        )
      }
    </div>
  );
}

function RegionPanel({ region, bots, loading, error }) {
  const totalFriends = bots.reduce((s, b) => s + (b.friendCount ?? 0), 0);
  const totalMax = bots.reduce((s, b) => s + (b.maxFriends ?? 2000), 0);
  const capacity = totalMax > 0 ? Math.round((totalFriends / totalMax) * 100) : 0;

  return (
    <div style={{
      background: NL.surface,
      border: `1px solid ${NL.border}`,
      borderRadius: 16,
      overflow: "hidden",
      flex: 1, minWidth: 0,
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 16px",
        borderBottom: `1px solid ${NL.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>{region.flag}</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: NL.text, margin: 0 }}>
              {region.label}
            </p>
            <p style={{ fontSize: 10, color: NL.muted, margin: 0, fontFamily: "'JetBrains Mono', monospace" }}>
              {region.key}
            </p>
          </div>
        </div>

        {!loading && !error && bots.length > 0 && (
          <div style={{ textAlign: "right" }}>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 18, fontWeight: 700,
              color: capacity >= 90 ? NL.warn : NL.accent,
              margin: 0, lineHeight: 1,
            }}>
              {capacity}%
            </p>
            <p style={{ fontSize: 10, color: NL.muted, margin: 0, marginTop: 2 }}>
              capacity
            </p>
          </div>
        )}
      </div>

      <div style={{ padding: 12 }}>
        {loading ? (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 8, padding: "28px 0", color: NL.muted,
          }}>
            <svg style={{ animation: "spin 0.8s linear infinite" }} width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </svg>
            <span style={{ fontSize: 12 }}>Loading…</span>
          </div>
        ) : error ? (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            padding: "24px 0", gap: 4,
          }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <p style={{ fontSize: 12, color: NL.danger, margin: 0 }}>Unreachable</p>
          </div>
        ) : bots.length === 0 ? (
          <p style={{ fontSize: 12, color: NL.muted, textAlign: "center", padding: "24px 0" }}>
            No bots configured
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {bots.map((bot, i) => <BotCard key={bot.gamertag} bot={bot} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BotStatus() {
  const [regionData, setRegionData] = useState({
    EU: { bots: [], loading: true, error: false },
    US: { bots: [], loading: true, error: false },
  });
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAll = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);

    const results = await Promise.allSettled(
      REGIONS.map(async (region) => {
        const res = await fetch(region.url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return { key: region.key, bots: data.bots ?? [] };
      })
    );

    const next = { ...regionData };
    results.forEach((result, i) => {
      const key = REGIONS[i].key;
      if (result.status === "fulfilled") {
        next[key] = { bots: result.value.bots, loading: false, error: false };
      } else {
        next[key] = { bots: [], loading: false, error: true };
      }
    });

    setRegionData(next);
    setLastUpdated(new Date());
    if (isRefresh) setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(() => fetchAll(), 30_000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const formatTime = (date) => {
    if (!date) return null;
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <div>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 14,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", display: "inline-block", flexShrink: 0 }} />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, letterSpacing: "0.12em",
            textTransform: "uppercase", color: NL.muted,
          }}>
            Xbox bots — live
          </span>
          {lastUpdated && (
            <span style={{ fontSize: 10, color: NL.muted, opacity: 0.6 }}>
              updated {formatTime(lastUpdated)}
            </span>
          )}
        </div>

        <button
          onClick={() => fetchAll(true)}
          disabled={refreshing}
          style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: 11, padding: "5px 10px",
            background: NL.elevated, border: `1px solid ${NL.border}`,
            borderRadius: 7, color: NL.secondary,
            fontFamily: "inherit", cursor: refreshing ? "not-allowed" : "pointer",
            opacity: refreshing ? 0.5 : 1,
            transition: "color 0.15s, border-color 0.15s",
          }}
          onMouseEnter={e => !refreshing && (e.currentTarget.style.color = NL.text)}
          onMouseLeave={e => (e.currentTarget.style.color = NL.secondary)}
        >
          <IconRefresh spinning={refreshing} /> Refresh
        </button>
      </div>

      <div style={{
        display: "flex", gap: 12,
        flexWrap: "wrap",
      }}>
        {REGIONS.map(region => (
          <RegionPanel
            key={region.key}
            region={region}
            bots={regionData[region.key].bots}
            loading={regionData[region.key].loading}
            error={regionData[region.key].error}
          />
        ))}
      </div>

      <p style={{ fontSize: 10, color: NL.muted, marginTop: 10, textAlign: "right" }}>
        Auto-refreshes every 30 seconds · Max 2,000 friends per bot
      </p>
    </div>
  );
}
