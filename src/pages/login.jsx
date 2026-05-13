import React, { useState, useEffect } from "react";
import { useHistory } from "@docusaurus/router";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseClient";
import Layout from "@theme/Layout";

function Spinner({ size = 16 }) {
    return (
        <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3V0a12 12 0 100 24v-4l-3 3 3 3v4a12 12 0 01-12-12z" />
        </svg>
    );
}

export default function LoginPage() {
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!auth) { setChecking(false); return; }
        const unsub = onAuthStateChanged(auth, async (u) => {
            if (u) {
                await redirectForUser(u);
            } else {
                setChecking(false);
            }
        });
        return () => unsub();
    }, []);

    async function redirectForUser(u) {
        try {
            const token = await u.getIdToken();
            const res = await fetch(
                `${process.env.REACT_APP_API_BASE || "https://eubackend.netherlink.net"}/api/admin/members`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.status === 200) {
                history.replace("/dashboard");
            } else {
                history.replace("/partner");
            }
        } catch {
            history.replace("/partner");
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(""); setLoading(true);
        try {
            if (!auth) throw new Error("Firebase not initialised");
            const cred = await signInWithEmailAndPassword(auth, email, password);
            await redirectForUser(cred.user);
        } catch (err) {
            setError(
                err.code === "auth/invalid-credential" || err.code === "auth/wrong-password"
                    ? "Invalid email or password."
                    : err.message
            );
        } finally {
            setLoading(false);
        }
    }

    if (checking) return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center bg-[#07111c]">
                <Spinner size={28} />
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center bg-[#07111c] px-4">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🔗</span>
                        </div>
                        <h1 className="text-xl font-bold text-white">NetherLink</h1>
                        <p className="text-sm text-slate-500 mt-1">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit}
                        className="bg-[#0c1220] border border-white/8 rounded-2xl p-6 flex flex-col gap-4 shadow-2xl">
                        {[
                            { label: "EMAIL", type: "email", val: email, set: setEmail, ac: "email" },
                            { label: "PASSWORD", type: "password", val: password, set: setPassword, ac: "current-password" },
                        ].map(({ label, type, val, set, ac }) => (
                            <div key={label}>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 tracking-widest">{label}</label>
                                <input
                                    type={type} value={val} onChange={(e) => set(e.target.value)}
                                    required autoComplete={ac}
                                    className="w-full px-3 py-2.5 rounded-xl border border-white/8 bg-white/3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/40 transition placeholder:text-slate-600"
                                />
                            </div>
                        ))}

                        {error && (
                            <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit" disabled={loading}
                            className="w-full mt-1 py-2.5 rounded-xl font-semibold text-sm transition-all bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            {loading ? <><Spinner size={14} /> Signing in…</> : "Sign in"}
                        </button>
                    </form>

                    <p className="text-xs text-slate-600 text-center mt-4">
                        You'll be redirected to the right dashboard automatically.
                    </p>
                </div>
            </div>
        </Layout>
    );
}