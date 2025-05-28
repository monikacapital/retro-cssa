// src/auth.js

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

/**
 * Rozpocznij logowanie przez Microsoft (przekierowanie do backendu)
 */
export function loginWithMicrosoft() {
  window.location.href = `${API_BASE}/auth/microsoft`;
}

/**
 * Wyloguj użytkownika (czyści sesję po stronie backendu)
 */
export async function logout() {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include"
    });
    window.location.href = "/";
  } catch (error) {
    console.error("Błąd wylogowania:", error);
    // Wymuś przekierowanie nawet przy błędzie
    window.location.href = "/";
  }
}

/**
 * Pobierz aktualnie zalogowanego użytkownika (z backendu)
 */
export async function getCurrentUser() {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
    if (!res.ok) return null;
    return await res.json(); // { id, name, email, role, ... }
  } catch (error) {
    console.error("Błąd pobierania użytkownika:", error);
    return null;
  }
}

/**
 * Sprawdź czy użytkownik jest zalogowany (np. do ochrony tras)
 */
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

/**
 * Sprawdź czy użytkownik ma określoną rolę
 */
export async function hasRole(requiredRole) {
  const user = await getCurrentUser();
  if (!user) return false;
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.role);
  }
  
  return user.role === requiredRole;
}

/**
 * Sprawdź czy użytkownik ma uprawnienia Project Managera
 */
export async function isPM() {
  return await hasRole('pm');
}

/**
 * Hook React do zarządzania stanem autoryzacji
 */
export function useAuth() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isPM: user?.role === 'pm',
    login: loginWithMicrosoft,
    logout
  };
}
