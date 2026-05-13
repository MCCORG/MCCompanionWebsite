import { useState, useEffect, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseClient";
import { fetchIdToken } from "./firebaseAuthHelpers";

const API_BASE = "https://eubackend.netherlink.net";

async function resolveRole(user) {
  if (!user) return "none";
  try {
    const token = await user.getIdToken();

    const adminRes = await fetch(`${API_BASE}/api/admin/members`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (adminRes.status === 200) return "admin";

    const memberRes = await fetch(`${API_BASE}/api/partner/servers`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (memberRes.status === 200) return "member";

    return "none";
  } catch {
    return "none";
  }
}

export function useAuth() {
  const [user,     setUser]     = useState(null);
  const [role,     setRole]     = useState(null);
  const [checking, setChecking] = useState(true);
  const [idToken,  setIdToken]  = useState(null);

  useEffect(() => {
    if (!auth) { setChecking(false); setRole("none"); return; }

    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setRole("none");
        setIdToken(null);
        setChecking(false);
        return;
      }
      try {
        const [resolvedRole, token] = await Promise.all([
          resolveRole(u),
          fetchIdToken(),
        ]);
        setRole(resolvedRole);
        setIdToken(token);
      } catch {
        setRole("none");
      } finally {
        setChecking(false);
      }
    });

    return () => unsub();
  }, []);

  const reset = useCallback(() => {
    setUser(null);
    setRole("none");
    setIdToken(null);
  }, []);

  return { user, role, checking, idToken, reset };
}