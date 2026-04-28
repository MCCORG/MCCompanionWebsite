import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "@docusaurus/router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebaseClient";
import { fetchIdToken } from "../firebaseAuthHelpers";
import Layout from '@theme/Layout';

const REGION_BASES = {
    EU: "https://eubackend.netherlink.net",
    US: "https://usbackend.netherlink.net"
};
const EVENTS_CAP = 1500;

function Button({ children, onClick, variant = "primary", className = "", disabled }) {
    const base = "font-semibold rounded-md transition focus:outline-none";
    const variants = {
        primary: "bg-violet-600 text-white hover:bg-violet-500",
        secondary: "bg-gray-700 text-white hover:bg-gray-600",
        danger: "bg-rose-600 text-white hover:bg-rose-500",
        ghost: "bg-transparent text-slate-200 hover:bg-white/5",
    };
    return (
        <button onClick={onClick} disabled={disabled}
            className={`${base} ${variants[variant]} px-4 py-2 ${className} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}>
            {children}
        </button>
    );
}

async function handleSignOut() {
    try {
        if (!auth) return;
        await signOut(auth);
    } catch (err) {
        console.error("Sign out failed", err);
    }
}

function Card({ title, children, className = "" }) {
    return (
        <section
            className={`bg-[rgba(8,6,10,0.5)] backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/8 ${className}`}
            style={{
                boxShadow: "0 6px 24px rgba(8,12,18,0.35)",
            }}
        >
            {title && <h3 className="text-xl font-semibold mb-4 text-slate-100">{title}</h3>}
            {children}
        </section>
    );
}

function EventTable({ events }) {
    const fmt = (t) => (t ? new Date(t).toLocaleString() : "");
    return (
        <div className="overflow-auto rounded-md border border-white/6">
            <table className="w-full text-sm">
                <thead className="text-slate-300 bg-[rgba(255,255,255,0.02)]">
                    <tr>
                        <th className="text-left p-3">Type</th>
                        <th className="text-left p-3">Key / IP</th>
                        <th className="text-left p-3">Player</th>
                        <th className="text-left p-3">Remote</th>
                        <th className="text-left p-3">Port</th>
                        <th className="text-left p-3">Mode</th>
                        <th className="text-left p-3">Time</th>
                        <th className="text-left p-3">JSON</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((ev, i) => {
                        const v = ev.value || {};
                        const publicIp = v.publicIp || v.publicIP || v.public || "";
                        const player = v.playerName || "";
                        const remoteIp = v.remoteServerIp || v.remoteServerIP || v.remote || "";
                        const remotePort = v.remoteServerPort || v.remotePort || v.port || "";
                        const mode = v.mode || "";
                        return (
                            <tr key={i} className="border-t border-white/6">
                                <td className="p-3">{ev.type}</td>
                                <td className="p-3 truncate max-w-[20ch]">{publicIp || ev.key || "—"}</td>
                                <td className="p-3 truncate max-w-[20ch]">{player || "—"}</td>
                                <td className="p-3 truncate max-w-[20ch]">{remoteIp || "—"}</td>
                                <td className="p-3">{remotePort || "—"}</td>
                                <td className="p-3">{mode || "—"}</td>
                                <td className="p-3">{fmt(ev.time)}</td>
                                <td className="p-3">
                                    <details className="text-xs text-slate-200">
                                        <summary className="cursor-pointer">view</summary>
                                        <pre className="mt-2 p-2 text-xs bg-[rgba(255,255,255,0.02)] rounded-md overflow-auto max-h-48">{JSON.stringify(ev, null, 2)}</pre>
                                    </details>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

function EventCard({ ev }) {
    const t = ev.time ? new Date(ev.time).toLocaleString() : "";
    const v = ev.value || {};
    const publicIp = v.publicIp || v.publicIP || v.public || "";
    const player = v.playerName || "";
    const remoteIp = v.remoteServerIp || v.remoteServerIP || v.remote || "";
    const remotePort = v.remoteServerPort || v.remotePort || v.port || "";
    const mode = v.mode || "";
    return (
        <div className="border-t border-white/6 py-3">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-sm font-medium text-slate-100">
                        {player ? `${player} — ${publicIp || ev.key || "—"}` : (publicIp || ev.key || "—")}
                        {remotePort ? `:${remotePort}` : ""}
                    </div>
                    <div className="text-xs text-slate-300">{remoteIp} • {mode}</div>
                </div>
                <div className="text-xs text-slate-300">{t}</div>
            </div>
            <details className="mt-2 text-xs text-slate-200">
                <summary className="cursor-pointer">JSON</summary>
                <pre className="mt-2 p-2 text-xs bg-[rgba(255,255,255,0.02)] rounded-md overflow-auto">{JSON.stringify(ev, null, 2)}</pre>
            </details>
        </div>
    );
}

export default function DashboardPage() {
    const history = useHistory();

    const [region, setRegion] = useState("EU");
    const apiBase = REGION_BASES[region];

    const [user, setUser] = useState(null);
    const [checking, setChecking] = useState(true);

    const [currentNotification, setCurrentNotification] = useState("");
    const [editing, setEditing] = useState("");
    const [isDirty, setIsDirty] = useState(false);
    const [saving, setSaving] = useState(false);

    const [eventsFeed, setEventsFeed] = useState([]);
    const [sseStatus, setSseStatus] = useState("closed");
    const esRef = useRef(null);

    const [currentMap, setCurrentMap] = useState({});

    const [filter, setFilter] = useState("");
    const [showOnly, setShowOnly] = useState("all");
    const [autoStart, setAutoStart] = useState(false);

    const [bans, setBans] = useState([]);
    const [bansLoading, setBansLoading] = useState(false);
    const [banIpInput, setBanIpInput] = useState("");
    const [banReasonInput, setBanReasonInput] = useState("");
    const [banError, setBanError] = useState(null);

    useEffect(() => {
        if (!auth) { setChecking(false); return; }
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setChecking(false);
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        if (!checking && !user) history.replace("/login");
    }, [checking, user, history]);

    async function loadCurrentNotification() {
        try {
            const token = await fetchIdToken();
            if (!token) return;
            const res = await fetch(`${apiBase}/notification`, { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) return;
            const json = await res.json();
            const msg = json?.message || "";
            setCurrentNotification(msg);
            setEditing(msg);
            setIsDirty(false);
        } catch (err) {
            console.warn("loadCurrentNotification error", err);
        }
    }

    async function loadBans() {
        setBansLoading(true);
        setBanError(null);
        try {
            const token = await fetchIdToken();
            if (!token) throw new Error("Not authenticated");
            const res = await fetch(`${apiBase}/api/admin/bans`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(`Failed to load bans: ${res.status}`);
            const json = await res.json();
            setBans(Array.isArray(json.bans) ? json.bans : []);
        } catch (err) {
            console.error("loadBans error", err);
            setBanError(String(err));
            setBans([]);
        } finally {
            setBansLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            loadBans();
            loadCurrentNotification();
        }
    }, [user, apiBase]);

    useEffect(() => {
        if (esRef.current) stopStream();
    }, [region]);

    async function startStream() {
        if (esRef.current) return;
        setSseStatus("connecting");
        try {
            const token = await fetchIdToken();
            if (!token) throw new Error("Not authenticated");
            const r = await fetch(`${apiBase}/cache/admin/cache/stream-token`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!r.ok) throw new Error("stream-token failed");
            const { streamToken } = await r.json();
            const es = new EventSource(`${apiBase}/cache/admin/cache/stream?streamToken=${encodeURIComponent(streamToken)}`);
            esRef.current = es;

            es.onopen = () => { setSseStatus("open"); };
            es.onerror = () => { setSseStatus("error"); };

            es.addEventListener('set', (e) => {
                try {
                    const d = JSON.parse(e.data || "{}");
                    const ev = { type: "set", key: d.key, value: d.value, time: d.time || Date.now() };
                    setEventsFeed(prev => [ev, ...prev].slice(0, EVENTS_CAP));
                    if (d.key) setCurrentMap(prev => ({ ...prev, [d.key]: d.value || {} }));
                } catch (_) { }
            });

            es.addEventListener('del', (e) => {
                try {
                    const d = JSON.parse(e.data || "{}");
                    const ev = { type: "del", key: d.key, value: d.value, existed: d.existed, time: d.time || Date.now() };
                    setEventsFeed(prev => [ev, ...prev].slice(0, EVENTS_CAP));
                    if (d.key) setCurrentMap(prev => { const next = { ...prev }; delete next[d.key]; return next; });
                } catch (_) { }
            });

            es.addEventListener('clear', (e) => {
                try {
                    const d = JSON.parse(e.data || "{}");
                    const ev = { type: "clear", entries: d.entries || [], time: d.time || Date.now() };
                    setEventsFeed(prev => [ev, ...prev].slice(0, EVENTS_CAP));
                    setCurrentMap({});
                } catch (_) { }
            });
        } catch (err) {
            setSseStatus("closed");
            console.warn(err);
        }
    }

    function stopStream() {
        if (esRef.current) {
            try { esRef.current.close(); } catch (_) { }
            esRef.current = null;
        }
        setSseStatus("closed");
    }

    function clearFeed() { setEventsFeed([]); }

    async function handleUpsert(e) {
        e?.preventDefault();
        setSaving(true);
        try {
            const token = await fetchIdToken();
            if (!token) throw new Error("Not authenticated");
            const res = await fetch(`${apiBase}/notification`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ message: editing || "" })
            });
            if (res.ok) {
                const json = await res.json();
                setCurrentNotification(json.message || "");
                setIsDirty(false);
            } else {
                console.warn("notification upsert failed", res.status);
            }
        } catch (err) {
            console.warn(err);
        } finally {
            setSaving(false);
        }
    }

    async function handleClearNotification() {
        if (!confirm("Clear notification?")) return;
        setSaving(true);
        try {
            const token = await fetchIdToken();
            if (!token) throw new Error("Not authenticated");
            const res = await fetch(`${apiBase}/notification`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) { setCurrentNotification(""); setEditing(""); setIsDirty(false); }
        } catch (err) {
            console.warn(err);
        } finally { setSaving(false); }
    }

    async function handleBan(ip, reason = "") {
        setBanError(null);
        if (!ip || typeof ip !== 'string') { setBanError("Invalid IP"); return; }
        if (!confirm(`Ban ${ip}?`)) return;
        try {
            const token = await fetchIdToken();
            if (!token) throw new Error("Not authenticated");
            const res = await fetch(`${apiBase}/api/admin/bans`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ip, reason })
            });
            if (!res.ok) {
                const txt = await res.text().catch(() => "");
                throw new Error(`Ban failed: ${res.status} ${txt}`);
            }
            await loadBans();
            setCurrentMap(prev => { const next = { ...prev }; delete next[ip]; return next; });
            setBanIpInput(""); setBanReasonInput("");
        } catch (err) {
            console.error("handleBan error", err);
            setBanError(String(err));
        }
    }

    async function handleUnban(ip) {
        if (!ip) return;
        if (!confirm(`Unban ${ip}?`)) return;
        setBanError(null);
        try {
            const token = await fetchIdToken();
            if (!token) throw new Error("Not authenticated");
            const res = await fetch(`${apiBase}/api/admin/bans/${encodeURIComponent(ip)}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) {
                const txt = await res.text().catch(() => "");
                throw new Error(`Unban failed: ${res.status} ${txt}`);
            }
            await loadBans();
        } catch (err) {
            console.error("handleUnban error", err);
            setBanError(String(err));
        }
    }

    const filtered = eventsFeed.filter(ev => {
        if (showOnly !== "all" && ev.type !== showOnly) return false;
        if (!filter) return true;
        const s = filter.toLowerCase();
        const v = ev.value || {};
        const publicIp = (v.publicIp || v.publicIP || v.public || "").toLowerCase();
        const remoteIp = (v.remoteServerIp || v.remoteServerIP || v.remote || "").toLowerCase();
        const port = String(v.remoteServerPort || v.remotePort || v.port || "");
        const playerName = (v.playerName || "").toLowerCase();
        return publicIp.includes(s) || remoteIp.includes(s) || port.includes(s) || playerName.includes(s) || (ev.key || "").toLowerCase().includes(s);
    });

    function isIpLocallyBanned(ip) {
        if (!ip) return false;
        return bans.some(b => String(b.ip).toLowerCase() === String(ip).toLowerCase());
    }

    return (
        <Layout>
            <div className="min-h-screen py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <header className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">Admin Dashboard</h1>
                            <div className="text-sm text-slate-300 mt-1">Signed in as <span className="font-medium text-slate-100">{user?.email}</span></div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-slate-300 mr-1">Region</label>
                                <select value={region} onChange={e => setRegion(e.target.value)}
                                    className="p-2 rounded bg-[rgba(117, 90, 90, 0.02)] text-slate-400 border border-white/6">
                                    <option value="EU">EU</option>
                                    <option value="US">US</option>
                                </select>
                            </div>

                            <div className="ml-auto sm:ml-0">
                                <Button onClick={handleSignOut} variant="secondary">Sign out</Button>
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <Card>
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-semibold text-slate-100 mb-2">Notification</h2>
                                        <div className="text-sm text-slate-300 mb-2">Loaded: <span className="font-medium text-slate-100">{currentNotification ? "Yes" : "No"}</span></div>
                                        <textarea
                                            value={editing}
                                            onChange={e => { setEditing(e.target.value); setIsDirty(e.target.value !== currentNotification); }}
                                            rows={2}
                                            className="w-full p-3 rounded-md border border-white/6 bg-[rgba(255,255,255,0.02)] text-slate-100"
                                            placeholder="Short notification text..."
                                        />
                                        <div className="mt-4 flex items-center gap-3">
                                            <Button onClick={handleUpsert} variant="primary" disabled={!isDirty || saving}>{saving ? "Saving..." : "Save"}</Button>
                                            <Button onClick={handleClearNotification} variant="danger" disabled={saving || !currentNotification}>Clear</Button>
                                            <div className="ml-auto text-sm text-slate-300">Last saved: <span className="font-medium text-slate-100">{currentNotification ? "present" : "none"}</span></div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card title={`Live feed (${filtered.length})`}>
                                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                                    <input placeholder="Filter by IP / port / key / player..." value={filter} onChange={e => setFilter(e.target.value)}
                                        className="flex-1 p-3 rounded-md border border-white/6 bg-[rgba(255,255,255,0.02)] text-slate-100 min-w-0" />

                                    <div className="flex items-center gap-2 flex-wrap">
                                        <select value={showOnly} onChange={e => setShowOnly(e.target.value)}
                                            className="p-3 rounded-md border border-white/6 bg-[rgba(255,255,255,0.02)] text-slate-100">
                                            <option value="all">All</option>
                                            <option value="set">Set</option>
                                            <option value="del">Del</option>
                                            <option value="clear">Clear</option>
                                        </select>

                                        <label className="flex items-center gap-2 text-sm text-slate-300">
                                            <input type="checkbox" checked={autoStart} onChange={e => setAutoStart(e.target.checked)} className="accent-violet-500" />
                                            Auto-start
                                        </label>

                                        <div className="flex gap-2 flex-wrap">
                                            <Button onClick={startStream} variant="primary" disabled={sseStatus === "open" || sseStatus === "connecting"}>Start</Button>
                                            <Button onClick={stopStream} variant="secondary" disabled={sseStatus === "closed"}>Stop</Button>
                                            <Button onClick={clearFeed} variant="secondary">Clear feed</Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-slate-100">
                                    <div className="hidden lg:block">
                                        {filtered.length === 0 ? (
                                            <div className="p-10 text-center text-slate-300">No live events yet. Click <strong>Start</strong> to connect the feed.</div>
                                        ) : (
                                            <EventTable events={filtered} />
                                        )}
                                    </div>

                                    <div className="lg:hidden">
                                        {filtered.length === 0 ? (
                                            <div className="p-6 text-center text-slate-300">No live events yet. Click <strong>Start</strong> to connect the feed.</div>
                                        ) : (
                                            filtered.map((ev, i) => <EventCard key={i} ev={ev} />)
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <aside className="lg:col-span-1 space-y-6">
                            <Card title="Status & metrics">
                                <div className="space-y-3 text-sm">
                                    <div><strong>Feed:</strong> <span className="ml-2 text-slate-100">{sseStatus}</span></div>
                                    <div><strong>Events stored:</strong> <span className="ml-2 text-slate-100">{eventsFeed.length}</span></div>
                                    <div><strong>Recent type:</strong> <span className="ml-2 text-slate-100">{eventsFeed[0]?.type || "—"}</span></div>
                                    <div className="mt-3 flex gap-2">
                                        <Button onClick={() => { setEventsFeed(prev => prev.slice(0, 50)); }} variant="secondary">Trim to 50</Button>
                                        <Button onClick={() => setEventsFeed([])} variant="ghost">Clear locally</Button>
                                    </div>
                                </div>
                            </Card>

                            <Card title="Current players">
                                <div className="space-y-2 text-sm text-slate-100">
                                    {Object.keys(currentMap).length === 0 ? (
                                        <div className="text-slate-400">No players connected</div>
                                    ) : (
                                        Object.entries(currentMap).map(([key, val]) => {
                                            const player = val?.playerName || "—";
                                            const remote = val?.remoteServerIp || val?.remote || "—";
                                            const port = val?.remoteServerPort || val?.remotePort || val?.port || "";
                                            const banned = isIpLocallyBanned(key);
                                            return (
                                                <div key={key} className="flex items-center justify-between gap-3 p-2 bg-[rgba(255,255,255,0.01)] rounded">
                                                    <div className="min-w-0">
                                                        <div className="font-medium truncate">{player}</div>
                                                        <div className="text-xs text-slate-400 truncate">{key} → {remote}{port ? `:${port}` : ""}</div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button className="text-xs text-slate-300 hover:underline" onClick={() => {
                                                            setEventsFeed(prev => [{ type: 'inspect', key, value: val, time: Date.now() }, ...prev].slice(0, EVENTS_CAP));
                                                        }}>Inspect</button>

                                                        {banned ? (
                                                            <span className="text-xs px-2 py-1 rounded bg-rose-600/20 text-rose-300">Banned</span>
                                                        ) : (
                                                            <button
                                                                className="text-xs px-2 py-1 rounded bg-rose-600 text-white hover:bg-rose-500"
                                                                onClick={() => handleBan(key, `Banned from dashboard by ${user?.email || 'admin'}`)}
                                                            >
                                                                Ban
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </Card>

                            <Card title="Ban management">
                                <div className="space-y-3">
                                    <div className="flex flex-col gap-2">
                                        <input
                                            placeholder="IP to ban"
                                            value={banIpInput}
                                            onChange={e => setBanIpInput(e.target.value)}
                                            className="w-full p-2 rounded-md border border-white/6 bg-[rgba(255,255,255,0.02)] text-slate-100"
                                        />
                                        <input
                                            placeholder="Reason (optional)"
                                            value={banReasonInput}
                                            onChange={e => setBanReasonInput(e.target.value)}
                                            className="w-full p-2 rounded-md border border-white/6 bg-[rgba(255,255,255,0.02)] text-slate-100"
                                        />
                                        <button
                                            onClick={() => handleBan(banIpInput.trim(), banReasonInput.trim())}
                                            className="w-full px-4 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-500 transition"
                                        >
                                            Ban
                                        </button>
                                    </div>

                                    {banError && <div className="text-sm text-rose-400">{banError}</div>}
                                    <div className="text-xs text-slate-400">Bans are per-region (EU/US). Change region to manage the other cluster.</div>
                                </div>
                            </Card>

                            <Card title="Active bans">
                                <div className="space-y-2 text-sm">
                                    {bansLoading ? (
                                        <div className="text-slate-400">Loading bans…</div>
                                    ) : bans.length === 0 ? (
                                        <div className="text-slate-400">No active bans for this region.</div>
                                    ) : (
                                        <div className="space-y-2 max-h-52 overflow-auto pr-1">
                                            {bans.map(b => (
                                                <div key={b.ip} className="flex items-center justify-between gap-2 p-2 bg-[rgba(255,255,255,0.01)] rounded">
                                                    <div className="min-w-0">
                                                        <div className="font-medium truncate">{b.ip}</div>
                                                        <div className="text-xs text-slate-400 truncate">{b.reason || "—"}</div>
                                                        <div className="text-xs text-slate-500 mt-1">{b.created_at}</div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <button
                                                            onClick={() => handleUnban(b.ip)}
                                                            className="px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600 text-xs"
                                                        >
                                                            Unban
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Card>

                            <Card title="Quick actions">
                                <div className="flex flex-col gap-3">
                                    <button onClick={() => { window.open('/metrics', '_blank'); }} className="w-full px-4 py-2 rounded bg-slate-700 text-white hover:bg-slate-600">Open metrics</button>
                                    <button onClick={() => { alert('Not implemented'); }} className="w-full px-4 py-2 rounded bg-slate-700 text-white hover:bg-slate-600">Force cache clear</button>
                                </div>
                            </Card>
                        </aside>
                    </div>
                </div>
            </div>
        </Layout>
    );
}