import { createContext, useContext, useEffect, useState } from 'react';
import admins from '../data/admins.json';

const AuthContext = createContext(null);
const STORAGE_KEY = 'hiyaAdminUser';

/** Reads the saved user from localStorage or sessionStorage (or null). */
function readSavedUser() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    const user = saved ? JSON.parse(saved) : null;
    return user && user.email && user.name ? user : null;
  } catch {
    return null; // storage blocked or broken JSON
  }
}

function clearSavedUser() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage blocked: nothing to clear */
  }
}

/**
 * Demo login for the training (frontend only).
 * Gives every component the logged-in user plus login() and logout().
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false); // false until we have checked the storage

  // On page load: restore a saved login
  useEffect(() => {
    setUser(readSavedUser());
    setReady(true);
  }, []);

  /**
   * Checks the details against admins.json.
   * Returns true when they are correct, false otherwise.
   */
  function login(email, password, remember) {
    const match = admins.find(
      (admin) => admin.email.toLowerCase() === email.trim().toLowerCase() && admin.password === password,
    );
    if (!match) return false;

    // Never keep the password in state or storage
    const loggedInUser = { id: match.id, name: match.name, email: match.email, role: match.role };
    setUser(loggedInUser);

    clearSavedUser();
    try {
      // "Remember me": localStorage survives closing the browser, sessionStorage does not
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser));
    } catch {
      /* storage blocked: stay logged in for this visit only */
    }
    return true;
  }

  function logout() {
    setUser(null);
    clearSavedUser();
  }

  return <AuthContext.Provider value={{ user, ready, login, logout }}>{children}</AuthContext.Provider>;
}

/** Use this in any component: const { user, login, logout } = useAuth(); */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}
