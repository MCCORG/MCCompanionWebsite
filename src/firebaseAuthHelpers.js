import { getIdToken } from "firebase/auth";
import { auth } from "./firebaseClient";

export async function fetchIdToken(forceRefresh = false) {
  if (!auth) return null;
  if (!auth.currentUser) return null;
  return getIdToken(auth.currentUser, forceRefresh);
}