// Centralized app configuration for environment-aware settings
// Note: CRA exposes only variables prefixed with REACT_APP_

const inferDefaultApiBase = () => {
  const isLocalhost = /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);
  if (isLocalhost) return "http://localhost:8000";
  const protocol = window.location.protocol === "http:" ? "https:" : window.location.protocol;
  return `${protocol}//${window.location.hostname}`;
};

// Compute at runtime to avoid embedding environment value in the bundle
export const API_BASE = inferDefaultApiBase();
export const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";

// Admin panel controls
export const ADMIN_PANEL_ENABLED = String(process.env.REACT_APP_ADMIN_PANEL_ENABLED || "false").toLowerCase() === "true";
export const DEMO_ADMIN_ENABLED = String(process.env.REACT_APP_DEMO_ADMIN_ENABLED || "false").toLowerCase() === "true";
export const DEMO_ADMIN_USERNAME = process.env.REACT_APP_DEMO_ADMIN_USER || "";
export const DEMO_ADMIN_PASSWORD = process.env.REACT_APP_DEMO_ADMIN_PASS || "";


