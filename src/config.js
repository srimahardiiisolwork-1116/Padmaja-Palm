// Centralized app configuration for environment-aware settings
// Note: CRA exposes only variables prefixed with REACT_APP_

// Backend base URL (no trailing slash). No hardcoded defaults; fully controlled via env.
// Set REACT_APP_API_BASE in your .env or hosting provider settings.
let _apiBase = process.env.REACT_APP_API_BASE;
if (!_apiBase) {
  const hint = "Set REACT_APP_API_BASE in your frontend .env (e.g., https://padmaja-palm-backend.onrender.com)";
  if (typeof window !== 'undefined' && /localhost|127\.0\.0\.1/.test(window.location.hostname)) {
    // Helpful message during local development
    // eslint-disable-next-line no-console
    console.warn(`[config] REACT_APP_API_BASE is not set. ${hint}`);
  }
  // Keep it undefined; callers will see bad URLs if used incorrectly, prompting setup.
}

export const API_BASE = (_apiBase || '').replace(/\/$/, "");
export const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";

// Admin panel controls
export const ADMIN_PANEL_ENABLED = String(process.env.REACT_APP_ADMIN_PANEL_ENABLED || "false").toLowerCase() === "true";
export const DEMO_ADMIN_ENABLED = String(process.env.REACT_APP_DEMO_ADMIN_ENABLED || "false").toLowerCase() === "true";
export const DEMO_ADMIN_USERNAME = process.env.REACT_APP_DEMO_ADMIN_USER || "";
export const DEMO_ADMIN_PASSWORD = process.env.REACT_APP_DEMO_ADMIN_PASS || "";


