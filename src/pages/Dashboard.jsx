import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useHistory } from "@docusaurus/router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebaseClient";
import { fetchIdToken } from "../firebaseAuthHelpers";
import Layout from '@theme/Layout';

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
    } catch (_) { /* network error — try next region */ }
  }
  throw new Error("Both regions unreachable");
}

const EVENTS_CAP = 1500;

function IconCopy() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="inline-block" xmlns="http://www.w3.org/2000/svg"><path d="M9 9H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><rect x="9" y="3" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function IconRefresh() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M3.51 15a9 9 0 1 0 .49-4.95" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function IconSignOut() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function IconBan() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
}
function IconGlobe() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function IconUsers() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function IconTrash() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 6V4h6v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function IconPlus() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}


function Badge({ children, color = "slate" }) {
  const cls = {
    slate: "bg-slate-700/60 text-slate-300 border border-slate-600/40",
    green: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
    red: "bg-rose-500/15 text-rose-400 border border-rose-500/25",
    yellow: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
    violet: "bg-violet-500/15 text-violet-400 border border-violet-500/25",
    blue: "bg-blue-500/15 text-blue-400 border border-blue-500/25",
  }[color] || "bg-slate-700/60 text-slate-300";
  return <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{children}</span>;
}

function Button({ children, onClick, variant = "primary", size = "md", className = "", disabled, title, type = "button" }) {
  const base = "inline-flex items-center gap-1.5 font-semibold transition-all rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/50";
  const sizes = { sm: "px-2.5 py-1.5 text-xs", md: "px-3.5 py-2 text-sm" };
  const variants = {
    primary: "bg-violet-600 text-white hover:bg-violet-500 active:bg-violet-700",
    secondary: "bg-white/8 text-slate-200 hover:bg-white/12 border border-white/8",
    danger: "bg-rose-600/90 text-white hover:bg-rose-500 active:bg-rose-700",
    ghost: "bg-transparent text-slate-300 hover:bg-white/6 border border-white/8",
    success: "bg-emerald-600 text-white hover:bg-emerald-500",
  };
  return (
    <button type={type} title={title} onClick={onClick} disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className} ${disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""}`}>
      {children}
    </button>
  );
}

function Card({ title, subtitle, children, className = "", action }) {
  return (
    <section className={`bg-[rgba(12,9,18,0.7)] backdrop-blur-xl rounded-2xl border border-white/6 shadow-xl overflow-hidden flex flex-col ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-5 flex flex-col flex-1">{children}</div>
    </section>
  );
}

function RegionResultBadge({ results }) {
  if (!results) return null;
  return (
    <div className="flex gap-1.5 mt-2">
      {Object.entries(results).map(([r, ok]) => (
        <span key={r} className={`text-xs px-2 py-0.5 rounded-full font-medium ${ok ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"}`}>
          {r} {ok ? "✓" : "✗"}
        </span>
      ))}
    </div>
  );
}

function StatusDot({ status }) {
  const colors = {
    open: "bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.4)]",
    connecting: "bg-amber-400 shadow-[0_0_6px_2px_rgba(251,191,36,0.4)] animate-pulse",
    error: "bg-rose-400 shadow-[0_0_6px_2px_rgba(251,113,133,0.4)]",
    closed: "bg-slate-500",
  };
  return <span className={`inline-block w-2 h-2 rounded-full ${colors[status] || colors.closed}`} />;
}

function Spinner({ size = 16 }) {
  return (
    <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3V0a12 12 0 100 24v-4l-3 3 3 3v4a12 12 0 01-12-12z" />
    </svg>
  );
}

function SyncToggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)}
      title={value ? "Sending to all regions" : "Sending to active region only"}
      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border font-semibold transition-all ${value
        ? "bg-violet-600/20 border-violet-500/40 text-violet-300"
        : "bg-white/4 border-white/8 text-slate-500 hover:text-slate-300"}`}>
      <IconGlobe />
      {value ? "All regions" : "This region"}
    </button>
  );
}

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "partners", label: "Partners" },
];

function TabBar({ active, onChange }) {
  return (
    <div className="flex gap-1 bg-white/4 rounded-xl p-1 border border-white/6">
      {TABS.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${active === t.id
            ? "bg-violet-600 text-white shadow"
            : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

const EVENT_META = {
  set: { color: "border-emerald-500/50 bg-emerald-500/4", dot: "bg-emerald-400", label: "SET", badge: "green" },
  del: { color: "border-rose-500/50 bg-rose-500/4", dot: "bg-rose-400", label: "DEL", badge: "red" },
  clear: { color: "border-amber-500/50 bg-amber-500/4", dot: "bg-amber-400", label: "CLEAR", badge: "yellow" },
  snapshot: { color: "border-blue-500/50 bg-blue-500/4", dot: "bg-blue-400", label: "SNAPSHOT", badge: "blue" },
};

function FeedEventRow({ ev, onBan, isBanned }) {
  const [expanded, setExpanded] = useState(false);
  const meta = EVENT_META[ev.type] || EVENT_META.set;
  const v = ev.value || {};
  const publicIp = v.publicIp || v.publicIP || v.public || ev.key || "";
  const player = v.playerName || "";
  const remoteIp = v.remoteServerIp || v.remoteServerIP || v.remote || "";
  const remotePort = v.remoteServerPort || v.remotePort || v.port || "";
  const time = ev.time ? new Date(ev.time).toLocaleTimeString() : "";

  if (ev.type === "snapshot") return (
    <div className={`rounded-xl border-l-2 ${meta.color} px-3 py-2.5 border border-blue-500/20`}>
      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${meta.dot}`} />
        <Badge color="blue">SNAPSHOT</Badge>
        <span className="text-xs text-slate-400">{ev.count} entries loaded</span>
        <span className="ml-auto text-xs text-slate-600">{time}</span>
      </div>
    </div>
  );

  if (ev.type === "clear") return (
    <div className={`rounded-xl border-l-2 ${meta.color} px-3 py-2.5 border border-amber-500/20`}>
      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${meta.dot}`} />
        <Badge color="yellow">CLEAR</Badge>
        <span className="text-xs text-slate-400">{ev.entries?.length ?? 0} entries cleared</span>
        <span className="ml-auto text-xs text-slate-600">{time}</span>
      </div>
    </div>
  );

  return (
    <div className={`rounded-xl border-l-2 ${meta.color} border border-white/4 px-3 py-2.5 transition-all`}>
      <div className="flex items-center gap-2 min-w-0">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${meta.dot}`} />
        <Badge color={meta.badge}>{meta.label}</Badge>
        <span className="font-mono text-slate-200 text-xs truncate max-w-[130px]" title={publicIp}>{publicIp || "—"}</span>
        {player && (<><span className="text-slate-600 text-xs">·</span><span className="text-xs text-slate-300 truncate max-w-[100px]" title={player}>{player}</span></>)}
        {remoteIp && (<><span className="text-slate-600 text-xs hidden sm:inline">→</span><span className="font-mono text-xs text-slate-500 truncate hidden sm:inline max-w-[120px]">{remoteIp}{remotePort ? `:${remotePort}` : ""}</span></>)}
        <div className="ml-auto flex items-center gap-1.5 shrink-0">
          <span className="text-xs text-slate-600 hidden sm:inline">{time}</span>
          {ev.type === "set" && publicIp && !isBanned && (
            <button onClick={() => onBan(publicIp)} className="p-1 rounded text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition" title="Ban IP"><IconBan /></button>
          )}
          <button onClick={() => setExpanded(x => !x)} className="p-1 rounded text-slate-600 hover:text-slate-300 transition text-xs">{expanded ? "▲" : "▼"}</button>
        </div>
      </div>
      {expanded && (
        <div className="mt-2 pt-2 border-t border-white/5">
          <pre className="text-xs text-slate-400 bg-black/30 rounded-lg p-2.5 overflow-auto max-h-40">
            {JSON.stringify(ev.type === "set" || ev.type === "del" ? v : ev, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

function SlotEditor({ uid, current, apiBase, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(current));
  const [saving, setSaving] = useState(false);

  async function save() {
    const n = parseInt(value, 10);
    if (isNaN(n) || n < 0 || n > 100) return;
    setSaving(true);
    try {
      const token = await fetchIdToken();
      const res = await fetch(`${apiBase}/api/admin/members/${encodeURIComponent(uid)}/slots`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ slots: n }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      onUpdate(n);
      setEditing(false);
    } catch (e) {
      alert("Failed to update slots: " + e.message);
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <button
        onClick={() => { setValue(String(current)); setEditing(true); }}
        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-white/5 bg-white/3 text-slate-400 hover:text-white hover:bg-white/6 transition shrink-0"
        title="Edit server slots"
      >
        <span className="font-mono">{current}</span>
        <span className="text-slate-600">slot{current !== 1 ? "s" : ""}</span>
        <span className="text-slate-600 text-[10px]">✏</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 shrink-0">
      <input
        type="number" min="0" max="100"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(false); }}
        className="w-14 px-2 py-1.5 rounded-lg border border-violet-500/40 bg-black/30 text-slate-100 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/40 text-center"
        autoFocus
      />
      <button onClick={save} disabled={saving}
        className="text-xs px-2 py-1.5 rounded-lg bg-emerald-600/80 text-white hover:bg-emerald-500 transition disabled:opacity-40">
        {saving ? "…" : "✓"}
      </button>
      <button onClick={() => setEditing(false)}
        className="text-xs px-2 py-1.5 rounded-lg bg-white/4 text-slate-400 hover:text-white transition">
        ✕
      </button>
    </div>
  );
}

function PartnersPanel({ apiBase }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ firebaseUid: "", email: "" });
  const [formError, setFormError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [expandedUid, setExpandedUid] = useState(null);
  const [memberServers, setMemberServers] = useState({});
  const [loadingServers, setLoadingServers] = useState({});

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const token = await fetchIdToken();
      const res = await fetch(`${apiBase}/api/admin/members`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(`${res.status}`);
      const json = await res.json();
      setMembers(json.members || []);
    } catch (e) {
      setError("Failed to load members: " + e.message);
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(e) {
    e.preventDefault();
    setFormError(null); setCreating(true);
    try {
      const token = await fetchIdToken();
      const res = await fetch(`${apiBase}/api/admin/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ firebaseUid: form.firebaseUid.trim(), email: form.email.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || `${res.status}`);
      setForm({ firebaseUid: "", email: "" });
      setShowForm(false);
      await load();
    } catch (e) {
      setFormError(e.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(uid, email) {
    if (!confirm(`Remove partner account for ${email}?\n\nThis also deletes all their servers.`)) return;
    setDeleting(uid);
    try {
      const token = await fetchIdToken();
      const res = await fetch(`${apiBase}/api/admin/members/${encodeURIComponent(uid)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`${res.status}`);
      setMembers(p => p.filter(m => m.firebase_uid !== uid));
    } catch (e) {
      alert("Failed to delete: " + e.message);
    } finally {
      setDeleting(null);
    }
  }

  async function loadServersForMember(uid) {
    setLoadingServers(p => ({ ...p, [uid]: true }));
    try {
      const token = await fetchIdToken();
      const res = await fetch(`${apiBase}/api/featured-servers/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const json = await res.json();
      const owned = (json.servers || []).filter(s => s.ownerUid === uid);
      setMemberServers(p => ({ ...p, [uid]: owned }));
    } catch (_) {
      setMemberServers(p => ({ ...p, [uid]: [] }));
    } finally {
      setLoadingServers(p => ({ ...p, [uid]: false }));
    }
  }

  async function toggleFeatured(server) {
    const newVal = !server.featured;
    try {
      const token = await fetchIdToken();
      const res = await fetch(`${apiBase}/api/featured-servers/admin/${server.id}/featured`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ featured: newVal }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      setMemberServers(p => ({
        ...p,
        [server.ownerUid]: (p[server.ownerUid] || []).map(s =>
          s.id === server.id ? { ...s, featured: newVal } : s
        ),
      }));
    } catch (e) {
      alert("Failed to toggle featured: " + e.message);
    }
  }

  function toggleExpand(uid) {
    if (expandedUid === uid) {
      setExpandedUid(null);
    } else {
      setExpandedUid(uid);
      loadServersForMember(uid);
    }
  }

  function fmtDate(t) { return t ? new Date(t).toLocaleDateString() : ""; }
  function copyToClipboard(text) { try { navigator.clipboard?.writeText(text || ""); } catch (_) { } }

  return (
    <div className="space-y-5">
      <Card
        title="Partner accounts"
        subtitle={`${members.length} registered`}
        action={
          <div className="flex items-center gap-2">
            <button onClick={load} className="text-slate-500 hover:text-slate-300 transition p-1 rounded-lg hover:bg-white/5" title="Refresh">
              <IconRefresh />
            </button>
            <Button size="sm" onClick={() => { setShowForm(p => !p); setFormError(null); }}>
              <IconPlus /> {showForm ? "Cancel" : "Add partner"}
            </Button>
          </div>
        }
      >
        {/* ── create form ── */}
        {showForm && (
          <form onSubmit={handleCreate} className="mb-5 p-4 rounded-xl border border-violet-500/20 bg-violet-500/5 flex flex-col gap-3">
            <p className="text-xs font-semibold text-violet-300 mb-1">New partner account</p>
            <p className="text-xs text-slate-500 -mt-1">
              First create the Firebase account in the{" "}
              <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">Firebase console</a>
              , then paste the UID here.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 tracking-widest">FIREBASE UID</label>
                <input
                  value={form.firebaseUid}
                  onChange={e => setForm(p => ({ ...p, firebaseUid: e.target.value }))}
                  placeholder="aBcDeFgH1234…"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-white/6 bg-black/30 text-slate-100 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/40 placeholder:text-slate-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 tracking-widest">EMAIL</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="partner@example.com"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-white/6 bg-black/30 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/40 placeholder:text-slate-600"
                />
              </div>
            </div>

            {formError && <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">{formError}</p>}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => { setShowForm(false); setFormError(null); }}>Cancel</Button>
              <Button type="submit" variant="success" size="sm" disabled={creating}>
                {creating ? <><Spinner size={12} /> Creating…</> : <><IconPlus /> Create partner</>}
              </Button>
            </div>
          </form>
        )}

        {/* ── member list ── */}
        {loading ? (
          <div className="flex items-center gap-2 text-slate-500 text-sm py-6 justify-center"><Spinner size={14} /> Loading…</div>
        ) : error ? (
          <p className="text-xs text-rose-400 py-4 text-center">{error}</p>
        ) : members.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-xl bg-white/4 border border-white/6 flex items-center justify-center mx-auto mb-3">
              <IconUsers />
            </div>
            <p className="text-sm text-slate-400">No partner accounts yet.</p>
            <p className="text-xs text-slate-600 mt-1">Click "Add partner" to create one.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {members.map(m => {
              const uid = m.firebase_uid;
              const isExpanded = expandedUid === uid;
              const servers = memberServers[uid];
              const serversLoading = loadingServers[uid];

              return (
                <div key={uid} className="rounded-xl border border-white/5 bg-white/2 overflow-hidden">
                  {/* member row */}
                  <div className="flex items-center gap-3 px-4 py-3">
                    {/* avatar */}
                    <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/25 flex items-center justify-center shrink-0 text-xs font-bold text-violet-300">
                      {(m.email || "?")[0].toUpperCase()}
                    </div>

                    {/* info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-100 truncate">{m.email}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-xs text-slate-600 truncate max-w-[160px]">{uid}</span>
                        <button onClick={() => copyToClipboard(uid)} className="text-slate-700 hover:text-slate-400 transition shrink-0" title="Copy UID">
                          <IconCopy />
                        </button>
                      </div>
                    </div>

                    {/* date */}
                    <span className="text-xs text-slate-600 hidden sm:block shrink-0">{fmtDate(m.created_at)}</span>

                    {/* slots editor */}
                    <SlotEditor
                      uid={uid}
                      current={m.server_slots ?? 1}
                      apiBase={apiBase}
                      onUpdate={(newSlots) => setMembers(p => p.map(x => x.firebase_uid === uid ? { ...x, server_slots: newSlots } : x))}
                    />

                    {/* expand servers */}
                    <button
                      onClick={() => toggleExpand(uid)}
                      className="text-xs text-slate-500 hover:text-slate-300 px-2.5 py-1.5 rounded-lg hover:bg-white/5 border border-white/5 transition shrink-0"
                    >
                      Servers {isExpanded ? "▲" : "▼"}
                    </button>

                    {/* delete */}
                    <button
                      onClick={() => handleDelete(uid, m.email)}
                      disabled={deleting === uid}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition shrink-0 disabled:opacity-40"
                      title="Remove partner"
                    >
                      {deleting === uid ? <Spinner size={13} /> : <IconTrash />}
                    </button>
                  </div>

                  {/* servers drawer */}
                  {isExpanded && (
                    <div className="border-t border-white/5 bg-black/20 px-4 py-3">
                      {serversLoading ? (
                        <div className="flex items-center gap-2 text-slate-600 text-xs py-2"><Spinner size={12} /> Loading servers…</div>
                      ) : !servers || servers.length === 0 ? (
                        <p className="text-xs text-slate-600 py-1">No servers listed by this partner.</p>
                      ) : (
                        <div className="space-y-2">
                          {servers.map(s => (
                            <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/3 border border-white/4">
                              {s.iconUrl && (
                                <img src={s.iconUrl} alt={s.name} className="w-8 h-8 rounded-lg object-cover shrink-0" onError={e => e.currentTarget.style.display = "none"} />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-semibold text-slate-200 truncate">{s.name}</span>
                                </div>
                                <span className="text-xs text-slate-600 font-mono">{s.address}:{s.port}</span>
                              </div>
                              {/* featured toggle */}
                              <button
                                onClick={() => toggleFeatured(s)}
                                title={s.featured ? "Remove featured" : "Mark as featured"}
                                className={`shrink-0 flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border font-semibold transition-all ${s.featured
                                    ? "bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
                                    : "bg-white/4 border-white/8 text-slate-500 hover:text-amber-400 hover:border-amber-500/30"
                                  }`}
                              >
                                ★ {s.featured ? "Featured" : "Feature"}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  const history = useHistory();

  const [region, setRegion] = useState("EU");
  const apiBase = REGION_BASES[region];
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const [currentNotification, setCurrentNotification] = useState("");
  const [editing, setEditing] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const [currentVersion, setCurrentVersion] = useState("");
  const [versionUpdatedAt, setVersionUpdatedAt] = useState("");
  const [editingVersion, setEditingVersion] = useState("");
  const [isVersionDirty, setIsVersionDirty] = useState(false);
  const [savingVersion, setSavingVersion] = useState(false);
  const [versionError, setVersionError] = useState(null);

  const [eventsFeed, setEventsFeed] = useState([]);
  const [sseStatus, setSseStatus] = useState("closed");
  const esRef = useRef(null);
  const feedContainerRef = useRef(null);
  const [currentMap, setCurrentMap] = useState({});
  const [rawFilter, setRawFilter] = useState("");
  const [filter, setFilter] = useState("");
  const filterTimer = useRef(null);
  const [showOnly, setShowOnly] = useState("all");
  const [autoStart, setAutoStart] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  const [bans, setBans] = useState([]);
  const [bansLoading, setBansLoading] = useState(false);
  const [banIpInput, setBanIpInput] = useState("");
  const [banReasonInput, setBanReasonInput] = useState("");
  const [banError, setBanError] = useState(null);

  useEffect(() => {
    if (!auth) { setChecking(false); history.replace("/login"); return; }
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { setChecking(false); history.replace("/login"); return; }
      setUser(u);
      try {
        const token = await u.getIdToken();
        const res = await fetch("https://eubackend.netherlink.net/api/admin/members", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status !== 200) { history.replace("/partner"); return; }
      } catch (_) { history.replace("/login"); return; }
      setChecking(false);
    });
    return () => unsub();
  }, []);

  async function loadCurrentNotification() {
    try {
      const token = await fetchIdToken(); if (!token) return;
      const { ok, data: json } = await dbFetch("/notification", { headers: { Authorization: `Bearer ${token}` } });
      if (!ok) return;
      const msg = json?.message || "";
      setCurrentNotification(msg); setEditing(msg); setIsDirty(false);
    } catch (err) { console.warn("loadCurrentNotification error", err); }
  }

  async function loadCurrentVersion() {
    setVersionError(null);
    try {
      const token = await fetchIdToken(); if (!token) return;
      const { ok: vOk, status: vStatus, data: json } = await dbFetch("/api/version", { headers: { Authorization: `Bearer ${token}` } });
      if (vStatus === 404) { setCurrentVersion(""); setEditingVersion(""); setVersionUpdatedAt(""); return; }
      if (!vOk) throw new Error(`Failed to load version: ${vStatus}`);
      setCurrentVersion(json?.version || ""); setEditingVersion(json?.version || "");
      setVersionUpdatedAt(json?.updated_at || ""); setIsVersionDirty(false);
    } catch (err) { console.warn("loadCurrentVersion error", err); setVersionError(String(err)); }
  }

  async function loadBans() {
    setBansLoading(true); setBanError(null);
    try {
      const token = await fetchIdToken(); if (!token) throw new Error("Not authenticated");
      const { ok: bOk, status: bStatus, data: json } = await dbFetch("/api/admin/bans", { headers: { Authorization: `Bearer ${token}` } });
      if (!bOk) throw new Error(`Failed to load bans: ${bStatus}`);
      setBans(Array.isArray(json.bans) ? json.bans : []);
    } catch (err) { console.error("loadBans error", err); setBanError(String(err)); setBans([]); }
    finally { setBansLoading(false); }
  }

  useEffect(() => { if (user) { loadBans(); loadCurrentNotification(); loadCurrentVersion(); } }, [user, apiBase]);

  useEffect(() => {
    if (filterTimer.current) clearTimeout(filterTimer.current);
    filterTimer.current = setTimeout(() => setFilter(rawFilter.trim()), 220);
    return () => { if (filterTimer.current) clearTimeout(filterTimer.current); };
  }, [rawFilter]);

  useEffect(() => {
    if (autoScroll && feedContainerRef.current) feedContainerRef.current.scrollTop = 0;
  }, [eventsFeed, autoScroll]);

  const startStream = useCallback(async () => {
    if (esRef.current) return;
    setSseStatus("connecting");
    try {
      const token = await fetchIdToken(); if (!token) throw new Error("Not authenticated");
      const r = await fetch(`${apiBase}/cache/admin/cache/stream-token`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      if (!r.ok) throw new Error("stream-token failed");
      const { streamToken } = await r.json();
      const es = new EventSource(`${apiBase}/cache/admin/cache/stream?streamToken=${encodeURIComponent(streamToken)}`);
      esRef.current = es;
      es.onopen = () => setSseStatus("open");
      es.onerror = () => setSseStatus("error");

      es.addEventListener("snapshot", e => {
        try {
          const d = JSON.parse(e.data || "{}");
          const entries = Array.isArray(d.entries) ? d.entries : [];
          const map = {};
          for (const { key, value } of entries) { if (key && value) map[key] = value; }
          setCurrentMap(map);
          setEventsFeed(prev => [...prev, { type: "snapshot", count: entries.length, time: d.time || Date.now() }].slice(-EVENTS_CAP));
        } catch (_) { }
      });
      es.addEventListener("set", e => {
        try {
          const d = JSON.parse(e.data || "{}");
          setEventsFeed(prev => [...prev, { type: "set", key: d.key, value: d.value, time: d.time || Date.now() }].slice(-EVENTS_CAP));
          if (d.key) setCurrentMap(prev => ({ ...prev, [d.key]: d.value || {} }));
        } catch (_) { }
      });
      es.addEventListener("del", e => {
        try {
          const d = JSON.parse(e.data || "{}");
          setEventsFeed(prev => [...prev, { type: "del", key: d.key, value: d.value, existed: d.existed, time: d.time || Date.now() }].slice(-EVENTS_CAP));
          if (d.key) setCurrentMap(prev => { const n = { ...prev }; delete n[d.key]; return n; });
        } catch (_) { }
      });
      es.addEventListener("clear", e => {
        try {
          const d = JSON.parse(e.data || "{}");
          setEventsFeed(prev => [...prev, { type: "clear", entries: d.entries || [], time: d.time || Date.now() }].slice(-EVENTS_CAP));
          setCurrentMap({});
        } catch (_) { }
      });
    } catch (err) { setSseStatus("closed"); console.warn(err); }
  }, [apiBase]);

  const stopStream = useCallback(() => {
    if (esRef.current) { try { esRef.current.close(); } catch (_) { } esRef.current = null; }
    setSseStatus("closed");
  }, []);

  useEffect(() => () => stopStream(), [stopStream]);
  useEffect(() => { if (esRef.current) stopStream(); }, [region, stopStream]);
  useEffect(() => { if (autoStart && sseStatus === "closed" && user) startStream(); }, [autoStart, user]);

  async function handleUpsert(e) {
    e?.preventDefault(); setSaving(true); setNotifResults(null);
    try {
      const token = await fetchIdToken(); if (!token) throw new Error("Not authenticated");
      const { ok } = await dbFetch("/notification", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: editing || "" }),
      });
      if (ok) { setCurrentNotification(editing); setIsDirty(false); }
    } catch (err) { console.warn(err); } finally { setSaving(false); }
  }

  async function handleClearNotification() {
    if (!confirm("Clear notification?")) return;
    setSaving(true); setNotifResults(null);
    try {
      const token = await fetchIdToken(); if (!token) throw new Error("Not authenticated");
      const { ok: dOk } = await dbFetch("/notification", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (dOk) { setCurrentNotification(""); setEditing(""); setIsDirty(false); }
    } catch (err) { console.warn(err); } finally { setSaving(false); }
  }

  async function handleSaveVersion(e) {
    e?.preventDefault(); setVersionError(null); setSavingVersion(true); setVersionResults(null);
    try {
      const token = await fetchIdToken(); if (!token) throw new Error("Not authenticated");
      if (!/^\d+\.\d+\.\d+(\+\d+)?$/.test(editingVersion.trim())) { setVersionError("Format must be 1.0.0 or 1.0.0+1"); return; }
      const { ok: vOk2, status: vStatus2, data: vJson } = await dbFetch("/api/version", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ version: editingVersion.trim() }),
      });
      if (vOk2) {
        setCurrentVersion(vJson.version || "");
        setVersionUpdatedAt(vJson.updated_at || "");
        setIsVersionDirty(false);
      } else {
        setVersionError(`Failed: ${vStatus2}`);
      }
    } catch (err) { console.error(err); setVersionError(String(err)); }
    finally { setSavingVersion(false); }
  }

  async function handleBan(ip, reason = "") {
    setBanError(null);
    if (!ip || typeof ip !== "string") { setBanError("Invalid IP"); return; }
    if (!confirm(`Ban ${ip}?`)) return;
    try {
      const token = await fetchIdToken(); if (!token) throw new Error("Not authenticated");
      const { ok: banOk, status: banStatus } = await dbFetch("/api/admin/bans", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ip, reason }),
      });
      if (!banOk) { setBanError(`Failed: ${banStatus}`); return; }
      await loadBans();
      setCurrentMap(prev => { const n = { ...prev }; delete n[ip]; return n; });
      setBanIpInput(""); setBanReasonInput("");
    } catch (err) { console.error(err); setBanError(String(err)); }
  }

  async function handleUnban(ip) {
    if (!ip || !confirm(`Unban ${ip}?`)) return;
    setBanError(null);
    try {
      const token = await fetchIdToken(); if (!token) throw new Error("Not authenticated");
      await dbFetch(`/api/admin/bans/${encodeURIComponent(ip)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadBans();
    } catch (err) { console.error(err); setBanError(String(err)); }
  }

  const filtered = useMemo(() => {
    return [...eventsFeed].reverse().filter(ev => {
      if (showOnly !== "all" && ev.type !== showOnly) return false;
      if (!filter) return true;
      const s = filter.toLowerCase();
      const v = ev.value || {};
      return [v.publicIp, v.publicIP, v.public, v.remoteServerIp, v.remoteServerIP, v.remote,
      String(v.remoteServerPort || v.remotePort || v.port || ""), v.playerName, ev.key
      ].some(x => (x || "").toLowerCase().includes(s));
    });
  }, [eventsFeed, filter, showOnly]);

  function isIpLocallyBanned(ip) { return ip ? bans.some(b => String(b.ip).toLowerCase() === String(ip).toLowerCase()) : false; }
  function copyToClipboard(text) { try { navigator.clipboard?.writeText(text || ""); } catch (_) { } }
  function fmtTime(t) { return t ? new Date(t).toLocaleString() : ""; }

  return (
    <Layout>
      <div className="min-h-screen py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Header ── */}
          <header className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                <span className="text-violet-400 text-lg">⚡</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white leading-none">NetherLink Admin</h1>
                <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <TabBar active={activeTab} onChange={setActiveTab} />

              <Button onClick={async () => { try { await signOut(auth); } catch (e) { console.error(e); } }} variant="ghost" size="sm">
                <IconSignOut /> Sign out
              </Button>
            </div>
          </header>

          {/* ── Partners tab ── */}
          {activeTab === "partners" && (
            <PartnersPanel apiBase={apiBase} />
          )}

          {/* ── Overview tab ── */}
          {activeTab === "overview" && (<>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Live players", value: Object.keys(currentMap).length, sub: "In cache" },
                { label: "Active bans", value: bans.length, sub: "Shared DB" },
                { label: "Feed events", value: eventsFeed.length, sub: `Cap ${EVENTS_CAP}` },
              ].map(s => (
                <div key={s.label} className="bg-[rgba(12,9,18,0.7)] rounded-xl border border-white/6 px-4 py-3">
                  <p className="text-xs text-slate-500 mb-1">{s.label}</p>
                  <p className="text-2xl font-bold text-white leading-none">{s.value}</p>
                  <p className="text-xs text-slate-600 mt-1">{s.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              <div className="xl:col-span-2 space-y-5">

                {/* Notification + Version */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ alignItems: "stretch" }}>
                  <Card title="Notification" subtitle="Shown in the app to all users">
                    <textarea
                      value={editing}
                      onChange={e => { setEditing(e.target.value); setIsDirty(e.target.value !== currentNotification); setNotifResults(null); }}
                      className="w-full p-3 rounded-xl border border-white/6 bg-white/3 text-slate-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/40 placeholder:text-slate-600 flex-1 min-h-[80px]"
                      placeholder="Short notification text..."
                    />
                    <div className="mt-3 flex flex-wrap items-center gap-2 shrink-0">
                      <Button onClick={handleUpsert} disabled={!isDirty || saving} size="sm">
                        {saving ? <><Spinner size={12} /> Saving…</> : "Save"}
                      </Button>
                      <Button onClick={handleClearNotification} variant="danger" size="sm" disabled={saving || !currentNotification}>Clear</Button>
                      <span className={`ml-auto text-xs px-2 py-1 rounded-full ${currentNotification ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-700/50 text-slate-500"}`}>
                        {currentNotification ? "Active" : "Empty"}
                      </span>
                    </div>
                  </Card>

                  <Card title="App Version" subtitle="Flutter app update check">
                    <div className="flex gap-2 shrink-0">
                      <input
                        value={editingVersion}
                        onChange={e => { setEditingVersion(e.target.value); setIsVersionDirty(e.target.value !== currentVersion); setVersionError(null); setVersionResults(null); }}
                        placeholder="e.g. 1.0.2"
                        className="flex-1 p-3 rounded-xl border border-white/6 bg-white/3 text-slate-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 placeholder:text-slate-600"
                      />
                      <Button onClick={handleSaveVersion} disabled={!isVersionDirty || savingVersion} size="sm">
                        {savingVersion ? <Spinner size={12} /> : "Publish"}
                      </Button>
                      <Button onClick={loadCurrentVersion} variant="ghost" size="sm" title="Reload from API">
                        <IconRefresh />
                      </Button>
                    </div>
                    {versionError && <p className="text-xs text-rose-400 mt-2 shrink-0">{versionError}</p>}
                    <div className="flex-1" />
                    <div className="shrink-0">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">Current version</p>
                          <p className="text-3xl font-bold font-mono text-white">{currentVersion || "—"}</p>
                        </div>
                        {versionUpdatedAt && (
                          <div className="text-right">
                            <p className="text-xs text-slate-500">Last published</p>
                            <p className="text-xs text-slate-400">{fmtTime(versionUpdatedAt)}</p>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-2">Format: <code className="text-slate-500">1.0.0</code> or <code className="text-slate-500">1.0.0+1</code></p>
                    </div>
                  </Card>
                </div>

                {/* Live Feed */}
                <Card
                  title="Live cache feed"
                  subtitle={`${filtered.length} events`}
                  action={
                    <div className="flex items-center gap-2">
                      {/* Region selector — only affects the live cache feed */}
                      <div className="flex rounded-lg overflow-hidden border border-white/8">
                        {Object.keys(REGION_BASES).map(r => (
                          <button key={r} onClick={() => { if (r !== region) { stopStream(); setRegion(r); } }}
                            className={`px-3 py-1.5 text-xs font-semibold transition ${region === r ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
                            {r}
                          </button>
                        ))}
                      </div>
                      <StatusDot status={sseStatus} />
                      <span className="text-xs text-slate-500">{sseStatus}</span>
                      {sseStatus !== "open" && sseStatus !== "connecting"
                        ? <Button onClick={startStream} size="sm" variant="primary">Start</Button>
                        : <Button onClick={stopStream} size="sm" variant="secondary">Stop</Button>
                      }
                    </div>
                  }
                >
                  <div className="flex flex-col sm:flex-row gap-2 mb-3 shrink-0">
                    <input
                      placeholder="Filter by IP / player / remote…"
                      value={rawFilter}
                      onChange={e => setRawFilter(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-white/6 bg-white/3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 placeholder:text-slate-600"
                    />
                    <div className="flex gap-1">
                      {["all", "set", "del", "clear", "snapshot"].map(v => (
                        <button key={v} onClick={() => setShowOnly(v)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition ${showOnly === v ? "bg-violet-600 border-violet-500 text-white" : "border-white/6 text-slate-400 hover:text-white hover:bg-white/5"}`}>
                          {v === "all" ? "All" : v.charAt(0).toUpperCase() + v.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-3 shrink-0">
                    <label className="flex items-center gap-2 text-xs text-slate-400">
                      <input type="checkbox" checked={autoStart} onChange={e => setAutoStart(e.target.checked)} className="accent-violet-500 rounded" />
                      Auto-start
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-400">
                      <input type="checkbox" checked={autoScroll} onChange={e => setAutoScroll(e.target.checked)} className="accent-violet-500 rounded" />
                      Auto-scroll
                    </label>
                    <div className="ml-auto flex gap-2">
                      <Button onClick={() => setEventsFeed(p => p.slice(-50))} variant="secondary" size="sm">Trim to 50</Button>
                      <Button onClick={() => { setEventsFeed([]); setCurrentMap({}); }} variant="ghost" size="sm">Clear</Button>
                    </div>
                  </div>
                  <div ref={feedContainerRef} className="flex-1 overflow-auto rounded-xl border border-white/5 bg-black/20 min-h-[300px] max-h-[500px] p-2 space-y-1.5">
                    {filtered.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full py-12 text-slate-500">
                        <div className="text-3xl mb-2">📡</div>
                        <p className="text-sm">{sseStatus === "open" ? "Waiting for events…" : "Start the feed to begin streaming."}</p>
                      </div>
                    ) : filtered.map((ev, i) => (
                      <FeedEventRow key={i} ev={ev}
                        isBanned={isIpLocallyBanned(ev.key || ev.value?.publicIp)}
                        onBan={ip => handleBan(ip, `Banned from live feed by ${user?.email || 'admin'}`)}
                      />
                    ))}
                  </div>
                </Card>
              </div>

              {/* Right col */}
              <div className="space-y-5">
                <Card title="Live players" subtitle={`${Object.keys(currentMap).length} in cache`}>
                  <div className="space-y-2 max-h-64 overflow-auto pr-1">
                    {Object.keys(currentMap).length === 0 ? (
                      <p className="text-sm text-slate-500 py-4 text-center">No players in cache</p>
                    ) : Object.entries(currentMap).map(([key, val]) => {
                      const player = val?.playerName || "—";
                      const remote = val?.remoteServerIp || val?.remote || "—";
                      const port = val?.remoteServerPort || val?.remotePort || val?.port || "";
                      const banned = isIpLocallyBanned(key);
                      return (
                        <div key={key} className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white/3 border border-white/4 hover:bg-white/5 transition-colors">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-100 truncate">{player}</p>
                            <p className="text-xs text-slate-500 font-mono truncate mt-0.5">{key} → {remote}{port ? `:${port}` : ""}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button onClick={() => copyToClipboard(key)} title="Copy IP" className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition"><IconCopy /></button>
                            {banned
                              ? <span className="text-xs px-2 py-1 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/20">Banned</span>
                              : <button onClick={() => handleBan(key, `Banned from dashboard by ${user?.email || 'admin'}`)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition" title="Ban"><IconBan /></button>
                            }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                <Card title="Ban IP" subtitle="Manually ban an IP address">
                  <div className="space-y-2">
                    <input placeholder="IP address" value={banIpInput} onChange={e => setBanIpInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleBan(banIpInput.trim(), banReasonInput.trim())}
                      className="w-full px-3 py-2.5 rounded-xl border border-white/6 bg-white/3 text-slate-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/40 placeholder:text-slate-600" />
                    <input placeholder="Reason (optional)" value={banReasonInput} onChange={e => setBanReasonInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleBan(banIpInput.trim(), banReasonInput.trim())}
                      className="w-full px-3 py-2.5 rounded-xl border border-white/6 bg-white/3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/40 placeholder:text-slate-600" />
                    <div className="flex items-center gap-2">
                      <Button onClick={() => handleBan(banIpInput.trim(), banReasonInput.trim())} variant="danger" className="flex-1 justify-center" disabled={!banIpInput.trim()}>
                        <IconBan /> Ban IP
                      </Button>
                    </div>
                    {banError && <p className="text-xs text-rose-400 pt-1">{banError}</p>}
                  </div>
                </Card>

                <Card
                  title="Active bans"
                  subtitle={`${bans.length} total`}
                  action={
                    <button onClick={loadBans} className="text-slate-500 hover:text-slate-300 transition p-1 rounded-lg hover:bg-white/5" title="Refresh"><IconRefresh /></button>
                  }
                >
                  {bansLoading ? (
                    <div className="flex items-center gap-2 text-slate-500 text-sm py-4 justify-center"><Spinner size={14} /> Loading…</div>
                  ) : bans.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">No active bans</p>
                  ) : (
                    <div className="space-y-2 max-h-52 overflow-auto pr-1">
                      {bans.map(b => (
                        <div key={b.ip} className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-rose-500/5 border border-rose-500/10">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-mono font-medium text-slate-200 truncate">{b.ip}</p>
                            <p className="text-xs text-slate-500 truncate mt-0.5">{b.reason || "No reason"}</p>
                            <p className="text-xs text-slate-600 mt-0.5">{b.created_at}</p>
                          </div>
                          <button onClick={() => handleUnban(b.ip)}
                            className="text-xs px-2.5 py-1.5 rounded-lg bg-white/6 text-slate-300 hover:bg-white/10 hover:text-white transition shrink-0">
                            Unban
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                <Card title="Quick actions">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Metrics", action: () => window.open('/metrics', '_blank') },
                      { label: "Panel", action: () => window.open('https://panel.netherlink.net', '_blank') },
                    ].map(a => (
                      <button key={a.label} onClick={a.action}
                        className="px-3 py-2.5 rounded-xl bg-white/4 border border-white/6 text-sm text-slate-300 hover:bg-white/8 hover:text-white transition text-center">
                        {a.label} ↗
                      </button>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </>)}

        </div>
      </div>
    </Layout>
  );
}