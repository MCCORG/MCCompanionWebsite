import React, { useState, useEffect } from "react";
import { useHistory } from "@docusaurus/router";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseClient";

export default function LoginPage() {
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!auth) return;
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
        });
        return () => unsub();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setError(err.message || "Login failed");
        }
    }

    function handleCancel() {
        history.push("/");
    }

    const cardClass =
        "max-w-md mx-auto mt-24 p-6 rounded-xl text-slate-100 border border-white/8 backdrop-blur-md";
    const cardStyle = {
        background: "rgba(8,6,10,0.5)",
        boxShadow: "0 6px 24px rgba(8,12,18,0.35)",
    };

    const inputClass =
        "w-full p-2 rounded bg-[rgba(255,255,255,0.02)] border border-white/6 text-slate-100";

    if (user) {
        return (
            <div className={cardClass} style={cardStyle}>
                <h1 className="text-2xl font-semibold mb-4">Admin login</h1>
                <p className="text-green-400">You are signed in as {user.email}.</p>
                <div className="flex gap-2 mt-4">
                    <button
                        className="px-4 py-2 rounded bg-violet-600 text-white hover:bg-violet-500"
                        onClick={() => history.push("/")}
                    >
                        Go to site
                    </button>
                    <button
                        className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600"
                        onClick={() => history.push("/")}
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={cardClass} style={cardStyle}>
            <h1 className="text-2xl font-semibold mb-4">Admin login</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                    className={inputClass}
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    aria-label="Email"
                />
                <input
                    className={inputClass}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    required
                    aria-label="Password"
                />
                {error && <div className="text-red-400 text-sm">{error}</div>}
                <div className="flex gap-2 mt-2">
                    <button
                        disabled={loading}
                        type="submit"
                        className="flex-1 px-4 py-2 bg-violet-600 rounded text-white hover:bg-violet-500 disabled:opacity-60"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-700 rounded text-white hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </form>
            <p className="text-xs text-slate-400 mt-3">This page is unlinked — only for admins.</p>
        </div>
    );
}