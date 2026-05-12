import React, { useEffect, useState, useCallback } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebaseClient";
import { fetchIdToken } from "../firebaseAuthHelpers";
import Layout from "@theme/Layout";

const REGION_BASES = {
  EU: "https://eubackend.netherlink.net",
  US: "https://usbackend.netherlink.net",
};

async function apiFetch(path, options = {}) {
  const token = await fetchIdToken();
  const res = await fetch(`${REGION_BASES.EU}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.message || res.statusText), { data });
  return data;
}

async function apiBoth(path, options = {}) {
  const token = await fetchIdToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const [euResult, usResult] = await Promise.allSettled(
    Object.values(REGION_BASES).map((base) =>
      fetch(`${base}${path}`, { ...options, headers }).then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data.message || r.statusText);
        return data;
      })
    )
  );
  if (euResult.status === "fulfilled") return euResult.value;
  if (usResult.status === "fulfilled") return usResult.value;
  throw new Error(euResult.reason?.message || "Request failed on both regions");
}

function Spinner({ size = 16 }) {
  return (
    <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3V0a12 12 0 100 24v-4l-3 3 3 3v4a12 12 0 01-12-12z" />
    </svg>
  );
}

function Button({ children, onClick, variant = "primary", size = "md", disabled, className = "", type = "button" }) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/40";
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2.5 text-sm" };
  const variants = {
    primary:   "bg-gradient-to-r from-cyan-400 to-blue-500 text-[#07111c] hover:opacity-90",
    secondary: "bg-white/6 text-slate-300 hover:bg-white/10 border border-white/8",
    danger:    "bg-rose-600/90 text-white hover:bg-rose-500",
    ghost:     "bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/6 border border-white/8",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""} ${className}`}>
      {children}
    </button>
  );
}

function Card({ title, subtitle, children, action, className = "" }) {
  return (
    <section className={`bg-[#0c1a27] border border-[#1e3045] rounded-2xl overflow-hidden flex flex-col ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e3045] shrink-0">
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

function Tag({ children, color = "cyan" }) {
  const colors = {
    cyan:  "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
    amber: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  };
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${colors[color] || colors.cyan}`}>{children}</span>;
}


function StatsChart({ data, label, color = "#22d3ee" }) {
  if (!data || data.length === 0) {
    return <p className="text-xs text-slate-600 py-2 text-center">No data yet</p>;
  }

  const max = Math.max(...data.map(d => d.count), 1);
  const H = 48; 
  const barW = Math.max(4, Math.floor(200 / data.length) - 2);

  return (
    <div>
      <div className="flex items-end gap-0.5 overflow-x-auto pb-1" style={{ minHeight: H + 4 }}>
        {data.map((d) => {
          const h = Math.max(2, Math.round((d.count / max) * H));
          const day = d.day.slice(5);
          return (
            <div key={d.day} className="flex flex-col items-center gap-0.5 shrink-0 group" style={{ width: barW }}>
              <div className="relative flex items-end" style={{ height: H }}>
                <div
                  style={{ width: barW, height: h, background: color, borderRadius: 2, opacity: 0.85 }}
                  className="group-hover:opacity-100 transition-opacity"
                />
                {/* tooltip */}
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-10 pointer-events-none">
                  <div className="bg-[#07111c] border border-[#1e3045] rounded-lg px-2 py-1 text-xs text-white font-bold whitespace-nowrap shadow-xl">
                    {d.count}
                  </div>
                  <div className="w-1.5 h-1.5 bg-[#1e3045] rotate-45 -mt-1" />
                </div>
              </div>
              {data.length <= 14 && (
                <span className="text-[9px] text-slate-600 rotate-0 tabular-nums">{day}</span>
              )}
            </div>
          );
        })}
      </div>
      {data.length > 14 && (
        <div className="flex justify-between text-[9px] text-slate-600 mt-1">
          <span>{data[0]?.day.slice(5)}</span>
          <span>{data[data.length - 1]?.day.slice(5)}</span>
        </div>
      )}
    </div>
  );
}

function useToasts() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  }, []);
  const remove = useCallback((id) => setToasts((p) => p.filter((t) => t.id !== id)), []);
  return { toasts, add, remove };
}

function ToastContainer({ toasts, remove }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl pointer-events-auto min-w-[240px] max-w-[340px] bg-[#0c1a27] ${t.type === "error" ? "border-rose-500/30" : "border-emerald-500/30"}`}
          style={{ animation: "slideIn 0.2s ease" }}>
          <span className={`w-2 h-2 rounded-full shrink-0 ${t.type === "error" ? "bg-rose-400" : "bg-emerald-400"}`} />
          <span className="text-sm text-slate-200 flex-1">{t.message}</span>
          <button onClick={() => remove(t.id)} className="text-slate-600 hover:text-slate-400 transition shrink-0 text-xs">✕</button>
        </div>
      ))}
      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }`}</style>
    </div>
  );
}

function MiniChart({ daily }) {
  if (!daily || daily.length === 0) return null;
  const max = Math.max(...daily.map(d => d.count), 1);
  const slice = daily.slice(-14);
  return (
    <div className="mt-1 mb-2">
      <div className="flex items-end gap-px h-8">
        {slice.map(({ day, count }) => (
          <div
            key={day}
            title={`${day}: ${count}`}
            className="flex-1 rounded-sm transition-all"
            style={{
              height: `${Math.max(2, Math.round((count / max) * 100))}%`,
              background: count > 0 ? "linear-gradient(to top, #22d3ee80, #3b82f680)" : "#1e3045",
              minWidth: 2,
            }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-0.5">
        <span className="text-[9px] text-slate-700">{slice[0]?.day?.slice(5)}</span>
        <span className="text-[9px] text-slate-700">{slice[slice.length - 1]?.day?.slice(5)}</span>
      </div>
    </div>
  );
}

const EMPTY = { name: "", address: "", port: "19132", description: "", iconUrl: "", websiteUrl: "" };

function ServerForm({ initial = EMPTY, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(initial);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-[#1e3045] bg-[#0a1520] text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/40 transition";

  const fields = [
    { key: "name",       label: "SERVER NAME",  placeholder: "My Awesome Server",            type: "text",   required: true  },
    { key: "address",    label: "ADDRESS",      placeholder: "play.myserver.net",             type: "text",   required: true  },
    { key: "port",       label: "PORT",         placeholder: "19132",                         type: "number", required: false },
    { key: "iconUrl",    label: "ICON URL",     placeholder: "https://example.com/icon.png", type: "url",    required: false },
    { key: "websiteUrl", label: "WEBSITE URL",  placeholder: "https://myserver.net",          type: "url",    required: false },
  ];

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...form, port: Number(form.port) || 19132 }); }}
      className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ key, label, placeholder, type, required }) => (
          <div key={key} className={key === "name" ? "sm:col-span-2" : ""}>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 tracking-widest">{label}</label>
            <input type={type} value={form[key]} onChange={set(key)} placeholder={placeholder} required={required} className={inputCls} />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1.5 tracking-widest">DESCRIPTION</label>
        <textarea value={form.description} onChange={set("description")} rows={3}
          placeholder="Tell players about your server…" className={`${inputCls} resize-none`} />
      </div>

      {form.iconUrl && (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-[#1e3045] bg-[#0a1520]">
          <img src={form.iconUrl} alt="preview" className="w-10 h-10 rounded-lg object-cover"
            onError={(e) => e.currentTarget.style.display = "none"} />
          <span className="text-xs text-slate-500">Icon preview</span>
        </div>
      )}

      <div className="flex gap-3 pt-1">
        <Button type="button" onClick={onCancel} variant="ghost" className="flex-1">Cancel</Button>
        <Button type="submit" disabled={submitting} className="flex-[2]">
          {submitting ? <><Spinner size={14} /> Saving…</> : initial.name ? "Save changes" : "Add server"}
        </Button>
      </div>
    </form>
  );
}

function ServerCard({ server, onEdit, onDelete, deleting }) {
  const [statsRange, setStatsRange] = useState("week");
  const chartData = statsRange === "week" ? (server.statsWeek || []) : (server.statsMonth || []);

  return (
    <div className="bg-[#0c1a27] border border-[#1e3045] rounded-2xl overflow-hidden flex flex-col">
      <div className="p-4 flex gap-3 flex-1">
        <div className="w-14 h-14 rounded-xl border border-[#1e3045] bg-[#0a1520] shrink-0 overflow-hidden flex items-center justify-center">
          {server.iconUrl
            ? <img src={server.iconUrl} alt={server.name} className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = "none"} />
            : <span className="text-xl">🖥</span>
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm font-bold text-slate-100 truncate">{server.name}</span>
            {server.featured && <Tag color="amber">FEATURED</Tag>}
          </div>
          <p className="text-xs text-slate-500 font-mono mb-2">{server.address}:{server.port}</p>
          {server.connections !== undefined && (
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-xs text-slate-600">All-time:</span>
              <span className="text-xs font-bold text-cyan-400 tabular-nums">{server.connections.toLocaleString()}</span>
              <span className="text-xs text-slate-600">connections</span>
            </div>
          )}
          {server.description && (
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{server.description}</p>
          )}
          {server.websiteUrl && (
            <a href={server.websiteUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 mt-1.5 no-underline w-fit">
              🌐 {server.websiteUrl.replace(/^https?:\/\//, "").split("/")[0]}
            </a>
          )}
        </div>
      </div>
      {/* stats chart */}
      <div className="px-4 pb-3 border-t border-[#1e3045] pt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500">Connections</span>
          <div className="flex gap-1">
            {["week", "month"].map(r => (
              <button key={r} onClick={() => setStatsRange(r)}
                className={`text-xs px-2 py-0.5 rounded-md font-semibold transition ${statsRange === r ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-slate-600 hover:text-slate-400"}`}>
                {r === "week" ? "7d" : "30d"}
              </button>
            ))}
          </div>
        </div>
        <StatsChart data={chartData} color="#22d3ee" />
      </div>

      <div className="border-t border-[#1e3045] grid grid-cols-2">
        <button onClick={() => onEdit(server)}
          className="flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-cyan-400 hover:bg-cyan-500/8 transition border-r border-[#1e3045]">
          ✏ Edit
        </button>
        <button onClick={() => onDelete(server.id)} disabled={deleting}
          className="flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-rose-400 hover:bg-rose-500/8 transition disabled:opacity-40">
          {deleting ? <Spinner size={12} /> : "🗑"} Delete
        </button>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      if (!auth) throw new Error("Firebase not initialised");
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (err) {
      setError(err.code === "auth/invalid-credential" ? "Invalid email or password." : err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07111c] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔗</span>
          </div>
          <h1 className="text-xl font-bold text-white">Partner Portal</h1>
          <p className="text-sm text-slate-500 mt-1">NetherLink Partner Dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-[#0c1a27] border border-[#1e3045] rounded-2xl p-6 flex flex-col gap-4">
          {[
            { label: "EMAIL",    type: "email",    val: email,    set: setEmail    },
            { label: "PASSWORD", type: "password", val: password, set: setPassword },
          ].map(({ label, type, val, set }) => (
            <div key={label}>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 tracking-widest">{label}</label>
              <input type={type} value={val} onChange={(e) => set(e.target.value)} required
                autoComplete={type === "email" ? "email" : "current-password"}
                className="w-full px-3 py-2.5 rounded-xl border border-[#1e3045] bg-[#0a1520] text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/40" />
            </div>
          ))}
          {error && <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full mt-1">
            {loading ? <><Spinner size={14} /> Signing in…</> : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}


function Dashboard({ user }) {
  const [servers, setServers]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [mode, setMode]           = useState("list");
  const [editTarget, setEditTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { toasts, add: toast, remove: removeToast } = useToasts();

  const [slots, setSlots] = useState({ used: 0, total: 1 });

  const loadServers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/partner/servers");
      setServers(data.servers ?? []);
      if (data.slots) setSlots(data.slots);
    } catch (err) {
      toast("Failed to load servers: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshStats = useCallback(async () => {
    try {
      const data = await apiFetch("/api/partner/servers/stats");
      const statsMap = Object.fromEntries((data.stats ?? []).map(s => [s.id, s]));
      setServers(prev => prev.map(s => {
        const fresh = statsMap[s.id];
        if (!fresh) return s;
        return { ...s, connections: fresh.connections ?? s.connections ?? 0, statsWeek: fresh.statsWeek ?? s.statsWeek, statsMonth: fresh.statsMonth ?? s.statsMonth };
      }));
    } catch (_) { /* silently ignore */ }
  }, []);

  useEffect(() => { loadServers(); }, [loadServers]);

  useEffect(() => {
    const interval = setInterval(refreshStats, 60_000);
    return () => clearInterval(interval);
  }, [refreshStats]);

  async function handleAdd(formData) {
    setSubmitting(true);
    try {
      await apiBoth("/api/partner/servers", { method: "POST", body: JSON.stringify(formData) });
      toast("Server added successfully");
      await loadServers();
      setMode("list");
    } catch (err) {
      toast(err.message || "Failed to add server", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEdit(formData) {
    setSubmitting(true);
    try {
      await apiBoth(`/api/partner/servers/${editTarget.id}`, { method: "PATCH", body: JSON.stringify(formData) });
      toast("Server updated");
      await loadServers();
      setMode("list");
    } catch (err) {
      toast(err.message || "Failed to update", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this server? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await apiBoth(`/api/partner/servers/${id}`, { method: "DELETE" });
      toast("Server deleted");
      setServers((p) => p.filter((s) => s.id !== id));
    } catch (err) {
      toast(err.message || "Failed to delete", "error");
    } finally {
      setDeletingId(null);
    }
  }

  function startEdit(server) { setEditTarget(server); setMode("edit"); }
  function cancelForm()      { setMode("list"); setEditTarget(null); }

  return (
    <div className="min-h-screen bg-[#07111c]">
      <div className="h-14 border-b border-[#1e3045] bg-[#0a1520] flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-cyan-400" style={{ boxShadow: "0 0 8px #22d3ee80" }} />
          <span className="text-sm font-bold text-white">NetherLink</span>
          <span className="text-slate-600 text-sm">/</span>
          <span className="text-sm text-slate-400">Partner Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500 hidden sm:block">{user.email}</span>
          <button onClick={() => signOut(auth)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition px-3 py-1.5 rounded-lg border border-[#1e3045] hover:bg-white/4">
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white">Your Servers</h1>
            <p className="text-sm text-slate-500 mt-1">
              Servers you add here appear in the NetherLink app for all players.
            </p>
          </div>
          {mode === "list" && slots.used < slots.total && (
            <Button onClick={() => setMode("add")}>+ Add Server</Button>
          )}
        </div>

        {mode === "list" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Featured", value: servers.filter((s) => s.featured).length },
            ].map((s) => (
              <div key={s.label} className="bg-[#0c1a27] border border-[#1e3045] rounded-xl px-4 py-3">
                <p className="text-xs text-slate-500">{s.label}</p>
                <p className="text-xl font-bold text-white mt-0.5">{s.value}</p>
              </div>
            ))}
            {/* slot meter */}
            <div className="sm:col-span-2 bg-[#0c1a27] border border-[#1e3045] rounded-xl px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-500">Server slots</p>
                <p className="text-xs font-bold text-slate-300">{slots.used} / {slots.total}</p>
              </div>
              <div className="h-1.5 rounded-full bg-[#1e3045] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (slots.used / Math.max(slots.total, 1)) * 100)}%`,
                    background: slots.used >= slots.total ? "#f87171" : "linear-gradient(90deg, #22d3ee, #3b82f6)",
                  }}
                />
              </div>
              {slots.used >= slots.total && (
                <p className="text-xs text-rose-400 mt-1.5">Slot limit reached — contact NetherLink for more.</p>
              )}
            </div>
          </div>
        )}

        {mode !== "list" && (
          <Card title={mode === "add" ? "Add a new server" : `Edit — ${editTarget?.name}`}>
            <ServerForm
              initial={mode === "edit" ? {
                name:        editTarget.name,
                address:     editTarget.address,
                port:        String(editTarget.port),
                description: editTarget.description ?? "",
                iconUrl:     editTarget.iconUrl ?? "",
                websiteUrl:  editTarget.websiteUrl ?? "",
              } : EMPTY}
              onSubmit={mode === "add" ? handleAdd : handleEdit}
              onCancel={cancelForm}
              submitting={submitting}
            />
          </Card>
        )}

        {mode === "list" && (
          loading ? (
            <div className="flex items-center justify-center gap-3 py-24 text-slate-500">
              <Spinner size={20} /><span className="text-sm">Loading your servers…</span>
            </div>
          ) : servers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#0c1a27] border border-[#1e3045] flex items-center justify-center text-2xl">🖥</div>
              <div>
                <p className="text-base font-bold text-slate-200">No servers yet</p>
                <p className="text-sm text-slate-500 mt-1 max-w-xs">Add your first server to get listed in the NetherLink app for PlayStation, Xbox and Nintendo players.</p>
              </div>
              <Button onClick={() => setMode("add")}>+ Add your first server</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {servers.map((s) => (
                <ServerCard key={s.id} server={s} onEdit={startEdit} onDelete={handleDelete} deleting={deletingId === s.id} />
              ))}
              {slots.used < slots.total && (
                <button onClick={() => setMode("add")}
                  className="border-2 border-dashed border-[#1e3045] rounded-2xl flex flex-col items-center justify-center gap-2 py-10 text-slate-600 hover:border-cyan-500/30 hover:text-cyan-500/60 transition-all min-h-[160px]">
                  <span className="text-3xl">+</span>
                  <span className="text-xs font-semibold">Add server</span>
                </button>
              )}
            </div>
          )
        )}

        <div className="bg-cyan-500/5 border border-cyan-500/15 rounded-2xl p-5 flex gap-4">
          <span className="text-xl shrink-0 mt-0.5">ℹ️</span>
          <div>
            <p className="text-sm font-semibold text-cyan-300 mb-1">How it works</p>
            <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li>Your servers appear in the <strong className="text-slate-300">Partner Servers</strong> section of the NetherLink app.</li>
              <li><strong className="text-slate-300">Featured</strong> status is managed by the NetherLink team — contact us to get featured.</li>
              <li>Use a square icon image (min 128×128px) for the best look in the app.</li>
            </ul>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} remove={removeToast} />
    </div>
  );
}

export default function PartnerDashboardPage() {
  const [user, setUser]         = useState(null);
  const [checking, setChecking] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (!auth) { setChecking(false); setShowLogin(true); return; }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u); setChecking(false);
      if (!u) setShowLogin(true);
    });
    return () => unsub();
  }, []);

  if (checking) return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-[#07111c]"><Spinner size={28} /></div>
    </Layout>
  );

  if (!user || showLogin) return (
    <Layout><LoginScreen onLogin={() => setShowLogin(false)} /></Layout>
  );

  return (
    <Layout><Dashboard user={user} /></Layout>
  );
}
