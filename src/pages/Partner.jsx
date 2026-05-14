import React, { useEffect, useState, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseClient";
import { fetchIdToken } from "../firebaseAuthHelpers";
import Layout from "@theme/Layout";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import { FaFileInvoiceDollar } from "react-icons/fa";

const REGION_BASES = {
  EU: "https://eubackend.netherlink.net",
  US: "https://usbackend.netherlink.net",
};
async function apiFetch(path, options = {}) {
  const token = await fetchIdToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };
  try {
    const res = await fetch(`${REGION_BASES.EU}${path}`, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (res.ok) return data;
    if (res.status < 500)
      throw Object.assign(new Error(data.message || res.statusText), { data, status: res.status });
  } catch (e) {}
  const res = await fetch(`${REGION_BASES.US}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (res.ok) return data;
  throw Object.assign(new Error(data.message || res.statusText), { data, status: res.status });
}

function Spinner({ size = 16 }) {
  return (
    <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3V0a12 12 0 100 24v-4l-3 3 3 3v4a12 12 0 01-12-12z" />
    </svg>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled,
  className = "",
  type = "button"
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/40";
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm"
  };
  const variants = {
    primary:
      "bg-gradient-to-r from-cyan-400 to-blue-500 text-[#07111c] hover:opacity-90",
    secondary:
      "bg-white/6 text-slate-300 hover:bg-white/10 border border-white/8",
    danger: "bg-rose-600/90 text-white hover:bg-rose-500",
    ghost:
      "bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/6 border border-white/8"
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${
        disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}
function Tag({ children, color = "cyan" }) {
  const colors = {
    cyan: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
    amber: "bg-amber-500/15 text-amber-400 border-amber-500/25"
  };
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${colors[color] || colors.cyan}`}>
      {children}
    </span>
  );
}
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  }, []);
  const remove = useCallback(
    (id) => setToasts((p) => p.filter((t) => t.id !== id)),
    []
  );
  return { toasts, add, remove };
}
function ToastContainer({ toasts, remove }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl pointer-events-auto min-w-[240px] max-w-[340px] bg-[#0c1a27] ${
            t.type === "error"
              ? "border-rose-500/30"
              : "border-emerald-500/30"
          }`}
          style={{ animation: "slideIn 0.2s ease" }}
        >
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              t.type === "error" ? "bg-rose-400" : "bg-emerald-400"
            }`}
          />
          <span className="text-sm text-slate-200 flex-1">{t.message}</span>
          <button
            onClick={() => remove(t.id)}
            className="text-slate-600 hover:text-slate-400 transition shrink-0 text-xs"
          >
            ✕
          </button>
        </div>
      ))}
      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }`}</style>
    </div>
  );
}

function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiFetch("/api/partner/invoices")
      .then(data => {
        if (cancelled) return;
        setInvoices(data.invoices || []);
        setErr(null);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setErr("Failed to load invoices.");
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  function formatAmount(amt, currency = "usd") {
    if (amt == null) return "-";
    let curr = (currency || "usd").toUpperCase();
    if (curr === "USD") return "$" + (amt / 100).toFixed(2);
    if (curr === "EUR") return "€" + (amt / 100).toFixed(2);
    return (amt / 100).toFixed(2) + " " + curr;
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 flex flex-col gap-4">
      <div className="flex items-center gap-2.5 mb-2">
        <span className="p-2 rounded-xl text-cyan-400 text-lg">
          <FaFileInvoiceDollar />
        </span>
        <span className="font-bold text-slate-100 text-lg drop-shadow">Invoices</span>
        <span className="text-xs text-slate-400 ml-2">Your NetherLink purchases</span>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-8 justify-center text-slate-400">
          <svg className="animate-spin" width={16} height={16} viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          </svg>
          Loading invoices...
        </div>
      ) : err ? (
        <div className="text-center text-rose-400 text-sm py-8">{err}</div>
      ) : invoices.length === 0 ? (
        <div className="text-center text-slate-500 py-6">No invoices found.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="flex flex-col gap-2 rounded-2xl p-4"
              style={{
                boxShadow: '0 2px 18px 0 rgba(29, 35, 57, 0.11)',
                background: "var(--nl-card-bg, #171b24)",
              }}
            >
              <div className="flex flex-row flex-wrap gap-y-1 gap-x-4 justify-between items-start">
                <div>
                  <div className="text-base font-extrabold text-slate-200">{formatAmount(inv.amount_paid, inv.currency)}</div>
                  <div className="text-xs text-slate-500">{new Date(inv.created * 1000).toLocaleDateString("en-GB")}</div>
                </div>
                <div>
                  <span className={
                    "inline-block font-bold px-2 py-1 rounded text-xs shadow-sm " +
                    (inv.status === "paid"
                      ? "bg-emerald-900 text-emerald-300"
                      : inv.status === "open"
                      ? "bg-amber-900 text-amber-300"
                      : "bg-rose-900 text-rose-300"
                    )
                  }>{inv.status?.toUpperCase()}</span>
                </div>
              </div>
              <div className="text-xs text-slate-400 leading-normal mb-1">
                {inv.lines && inv.lines.data && inv.lines.data.length
                  ? inv.lines.data.map(l => (
                    <span key={l.id} className="block">{l.description}</span>
                  ))
                  : (inv.description || "-")}
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xs text-slate-500">
                  Invoice ID: <span className="text-slate-600">{inv.number || inv.id}</span>
                </div>
                <div>
                  {inv.hosted_invoice_url && (
                    <a
                      href={inv.hosted_invoice_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-cyan-200 font-semibold text-xs px-3 py-1 rounded-lg shadow-sm bg-[#152030] hover:bg-cyan-950 transition"
                      style={{ textDecoration: "none", border: "none" }}
                    >
                      Download PDF
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const EMPTY = {
  name: "", address: "", port: "19132", description: "", iconUrl: "", websiteUrl: ""
};
function ServerForm({ initial = EMPTY, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(initial);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  useEffect(() => { setForm(initial); }, [initial]);
  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-[#1e3045] bg-[#0a1520] text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/40 transition";
  const fields = [
    { key: "name", label: "SERVER NAME", placeholder: "My Awesome Server", type: "text", required: true },
    { key: "address", label: "ADDRESS", placeholder: "play.myserver.net", type: "text", required: true },
    { key: "port", label: "PORT", placeholder: "19132", type: "number", required: false },
    { key: "iconUrl", label: "ICON URL", placeholder: "https://example.com/icon.png", type: "url", required: false },
    { key: "websiteUrl", label: "WEBSITE URL", placeholder: "https://myserver.net", type: "url", required: false }
  ];
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit({ ...form, port: Number(form.port) || 19132 });
      }}
      className="flex flex-col gap-4"
    >
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
        <textarea value={form.description} onChange={set("description")} rows={3} placeholder="Describe your server..." className={`${inputCls} resize-none`} />
      </div>
      {form.iconUrl && (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-[#1e3045] bg-[#0a1520]">
          <img src={form.iconUrl} alt="preview" className="w-10 h-10 rounded-lg object-cover" onError={e => (e.currentTarget.style.display = "none")} />
          <span className="text-xs text-slate-500">Icon preview</span>
        </div>
      )}
      <div className="flex gap-3 pt-1">
        <Button type="button" onClick={onCancel} variant="ghost" className="flex-1">Cancel</Button>
        <Button type="submit" disabled={submitting} className="flex-[2]">
          {submitting ? (<><Spinner size={14} /> Saving…</>) : initial.name ? "Save changes" : "Add server"}
        </Button>
      </div>
    </form>
  );
}

function ServerCard({ server, onEdit, onDelete, deleting }) {
  return (
    <div className="bg-[#0c1a27] border border-[#1e3045] rounded-2xl px-4 pt-4 pb-2 flex flex-col gap-2 w-full shadow-lg">
      <div className="flex gap-3 items-center mb-1">
        <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#1e3045] bg-[#0e1723] flex-shrink-0">
          {server.iconUrl ? (
            <img src={server.iconUrl} alt={server.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl flex items-center justify-center h-full">🖥</span>
          )}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-bold text-white">{server.name}</span>
            {server.featured && <Tag color="amber">FEATURED</Tag>}
          </div>
          <span className="text-xs text-slate-500 font-mono">{server.address}:{server.port}</span>
        </div>
      </div>
      {server.description && (
        <p className="text-xs text-slate-400 leading-relaxed mt-1">
          {server.description.slice(0, 100)}
          {server.description.length > 100 && "..."}
        </p>
      )}
      <StatsBar stats={server.stats || {}} />
      <ServerLineChart data={server.stats?.daily || []} />
      {server.websiteUrl && (
        <a href={server.websiteUrl} target="_blank" rel="noopener noreferrer"
          className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 mt-1 w-fit">
          🌐{" "}{server.websiteUrl.replace(/^https?:\/\//, "").split("/")[0]}
        </a>
      )}
      <div className="flex gap-2 mt-2">
        <Button onClick={() => onEdit(server)} variant="secondary" size="sm" className="flex-1">Edit</Button>
        <Button onClick={() => onDelete(server.id)} variant="danger" size="sm" className="flex-1" disabled={deleting}>
          {deleting ? <Spinner size={12} /> : "Delete"}
        </Button>
      </div>
    </div>
  );
}

function StatsBar({ stats }) {
  const items = [
    { label: "Total", value: stats.total },
    { label: "This week", value: stats.thisWeek },
    { label: "This month", value: stats.thisMonth }
  ];
  return (
    <div className="flex w-full justify-between gap-2 py-1">
      {items.map((i) => (
        <div key={i.label} className="flex flex-col items-center w-full rounded bg-[#151f2c] py-2 px-1">
          <div className="text-lg font-extrabold text-cyan-300 tabular-nums">{(i.value ?? 0).toLocaleString()}</div>
          <span className="text-[11px] text-slate-400">{i.label}</span>
        </div>
      ))}
    </div>
  );
}

function ServerLineChart({ data }) {
  let graphData = [{ name: "", count: 0 }, { name: "", count: 0 }];
  if (data && data.length > 0) {
    graphData = data.slice(-14).map((d) => ({
      name: d.day?.slice(5) ?? "",
      count: d.count
    }));
    if (graphData.length === 1) graphData.push({ ...graphData[0] });
  }
  return (
    <div className="h-20 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={graphData}>
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <YAxis hide domain={["auto", "auto"]} />
          <Tooltip wrapperClassName="!rounded-xl !bg-[#1b2635] !border-0 !px-2 !py-1" contentStyle={{ background: "#192736", border: 0, fontSize: 13 }} labelStyle={{ color: "#94a3b8" }} />
          <Line type="monotone" dataKey="count" stroke="#22d3ee" strokeWidth={2.5} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
      {( !data || data.length < 2 ) && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-600 pointer-events-none bg-none">No data yet</div>
      )}
    </div>
  );
}

function Dashboard({ user }) {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("list");
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
      const statsMap = Object.fromEntries((data.stats ?? []).map((s) => [s.id, s.stats]));
      setServers((prev) =>
        prev.map((s) => ({
          ...s,
          stats: statsMap[s.id] ?? s.stats
        }))
      );
    } catch (_) {}
  }, []);
  useEffect(() => { loadServers(); }, [loadServers]);
  useEffect(() => {
    const interval = setInterval(refreshStats, 60_000);
    return () => clearInterval(interval);
  }, [refreshStats]);

  async function handleAdd(formData) {
    setSubmitting(true);
    try {
      await apiFetch("/api/partner/servers", {
        method: "POST",
        body: JSON.stringify(formData)
      });
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
      await apiFetch(`/api/partner/servers/${editTarget.id}`, {
        method: "PATCH",
        body: JSON.stringify(formData)
      });
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
    if (!window.confirm("Delete this server? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await apiFetch(`/api/partner/servers/${id}`, { method: "DELETE" });
      toast("Server deleted");
      setServers((p) => p.filter((s) => s.id !== id));
    } catch (err) {
      toast(err.message || "Failed to delete", "error");
    } finally {
      setDeletingId(null);
    }
  }
  function startEdit(server) { setEditTarget(server); setMode("edit"); }
  function cancelForm() { setMode("list"); setEditTarget(null); }

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-3 sm:px-6 py-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Your Servers</h1>
            <p className="text-sm text-slate-500 mt-1">
              Servers you add here will be visible in the NetherLink app for all players.
            </p>
          </div>
          {mode === "list" && slots.used < slots.total && (
            <Button onClick={() => setMode("add")}>+ Add server</Button>
          )}
        </div>
        {mode === "list" && (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="bg-[#0c1a27] border border-[#1e3045] rounded-xl py-3 px-4 flex flex-col items-center w-full">
                <p className="text-xs text-slate-500">Featured</p>
                <p className="text-xl font-bold text-white mt-0.5">
                  {servers.filter((s) => s.featured).length}
                </p>
              </div>
              <div className="bg-[#0c1a27] border border-[#1e3045] rounded-xl py-3 px-4 flex flex-col w-full">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-slate-500">Server slots</p>
                  <p className="text-xs font-bold text-slate-300">{slots.used} / {slots.total}</p>
                </div>
                <div className="h-1.5 rounded-full bg-[#1e3045] overflow-hidden mb-1">
                  <div className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (slots.used / Math.max(slots.total, 1)) * 100)}%`,
                      background:
                        slots.used >= slots.total
                          ? "#f87171"
                          : "linear-gradient(90deg, #22d3ee, #3b82f6)"
                    }} />
                </div>
                {slots.used >= slots.total && (
                  <p className="text-xs text-rose-400 mt-1.5">
                    Slot limit reached — contact NetherLink for more.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        {mode !== "list" && (
          <div className="bg-[#0c1a27] border border-[#1e3045] rounded-2xl p-4 shadow-lg">
            <div className="mb-4"><h2 className="text-lg font-bold text-white mb-1">
              {mode === "add" ? "Add a new server" : `Edit — ${editTarget?.name}`}
            </h2></div>
            <ServerForm
              initial={mode === "edit"
                ? {
                    name: editTarget.name,
                    address: editTarget.address,
                    port: String(editTarget.port),
                    description: editTarget.description ?? "",
                    iconUrl: editTarget.iconUrl ?? "",
                    websiteUrl: editTarget.websiteUrl ?? ""
                  } : EMPTY}
              onSubmit={mode === "add" ? handleAdd : handleEdit}
              onCancel={cancelForm}
              submitting={submitting}
            />
          </div>
        )}
        {mode === "list" &&
          (loading ? (
            <div className="flex items-center justify-center gap-3 py-24 text-slate-500">
              <Spinner size={20} />
              <span className="text-sm">Loading your servers...</span>
            </div>
          ) : servers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#0c1a27] border border-[#1e3045] flex items-center justify-center text-2xl">
                🖥
              </div>
              <div>
                <p className="text-base font-bold text-slate-200">No servers yet</p>
                <p className="text-sm text-slate-500 mt-1 max-w-xs">
                  Add your first server to get listed in the NetherLink app for PlayStation, Xbox and Nintendo players.
                </p>
              </div>
              <Button onClick={() => setMode("add")}>+ Add your first server</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {servers.map((s) => (
                <ServerCard
                  key={s.id}
                  server={s}
                  onEdit={startEdit}
                  onDelete={handleDelete}
                  deleting={deletingId === s.id}
                />
              ))}
              {slots.used < slots.total && (
                <button
                  onClick={() => setMode("add")}
                  className="border-2 border-dashed border-[#1e3045] rounded-2xl flex flex-col items-center justify-center gap-2 py-10 text-slate-600 hover:border-cyan-500/30 hover:text-cyan-500/60 transition-all min-h-[160px]"
                >
                  <span className="text-3xl">+</span>
                  <span className="text-xs font-semibold">Add server</span>
                </button>
              )}
            </div>
          ))}
        {mode === "list" && <InvoiceList />}
        <div className="bg-cyan-500/5 border border-cyan-500/15 rounded-2xl p-5 flex gap-4 mt-3">
          <span className="text-xl shrink-0 mt-0.5">ℹ️</span>
          <div>
            <p className="text-sm font-semibold text-cyan-300 mb-1">How it works</p>
            <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li>
                Your servers appear in the{" "}
                <strong className="text-slate-300">Partner Servers</strong> section of the NetherLink app.
              </li>
              <li>
                <strong className="text-slate-300">Featured</strong> status is managed by the NetherLink team — contact us to get featured.
              </li>
              <li>
                Use a square icon image (min 128×128px) for the best look in the app.
              </li>
            </ul>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} remove={removeToast} />
    </div>
  );
}

export default function PartnerDashboardPage() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    if (!auth) {
      window.location.replace("/login");
      return;
    }
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        window.location.replace("/login");
        return;
      }
      try {
        const token = await u.getIdToken();
        const res = await fetch(
          "https://eubackend.netherlink.net/api/admin/members",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.status === 200) {
          window.location.replace("/dashboard");
          return;
        }
      } catch (_) {}
      setUser(u);
      setChecking(false);
    });
    return () => unsub();
  }, []);
  if (checking)
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-[#07111c]">
          <Spinner size={28} />
        </div>
      </Layout>
    );
  return (
    <Layout>
      <Dashboard user={user} />
    </Layout>
  );
}