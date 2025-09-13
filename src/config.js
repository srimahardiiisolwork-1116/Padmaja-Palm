// Centralized app configuration for environment-aware settings
// Note: CRA exposes only variables prefixed with REACT_APP_

// Use the backend URL directly
export const API_BASE = "/api"; // This will be proxied to https://padmaja-palm-backend.onrender.com
export const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";

// Admin panel controls
export const ADMIN_PANEL_ENABLED = String(process.env.REACT_APP_ADMIN_PANEL_ENABLED || "false").toLowerCase() === "true";
export const DEMO_ADMIN_ENABLED = String(process.env.REACT_APP_DEMO_ADMIN_ENABLED || "false").toLowerCase() === "true";
export const DEMO_ADMIN_USERNAME = process.env.REACT_APP_DEMO_ADMIN_USER || "";
export const DEMO_ADMIN_PASSWORD = process.env.REACT_APP_DEMO_ADMIN_PASS || "";


