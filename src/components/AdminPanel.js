import React, { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE } from "../config";
import "../styles/AdminPanel.css";

// Utility to get CSRF token from cookie
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Fetch CSRF cookie from backend
async function fetchCsrfToken() {
  await fetch(`${API_BASE}/events/get-csrf-token/`, {
    credentials: "include",
  });
}

const EVENTS_URL = `${API_BASE}/events/`;
const IMAGES_URL = `${EVENTS_URL}images/`;
const VIDEOS_URL = `${EVENTS_URL}videos/`;
const LOGIN_URL = `${EVENTS_URL}login/`;
const LOGOUT_URL = `${EVENTS_URL}logout/`;
const USER_CHECK_URL = `${EVENTS_URL}check-user/`;
const STORAGE_ANALYTICS_URL = `${EVENTS_URL}storage/analytics/`;
const DOWNLOAD_IMAGE_URL = (eventId, imageId) => `${EVENTS_URL}download/image/${eventId}/${imageId}/`;
const DOWNLOAD_VIDEO_URL = (eventId, videoId) => `${EVENTS_URL}download/video/${eventId}/${videoId}/`;

function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState({ name: "", date: "", description: "" });
  const [showForm, setShowForm] = useState(false);
  const [newEventImages, setNewEventImages] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [previewImage, setPreviewImage] = useState(null);
  const [showStorageModal, setShowStorageModal] = useState(false);
  const [storageData, setStorageData] = useState(null);
  const [userForm, setUserForm] = useState({ user_name: "", email: "" });
  const [userCheckResult, setUserCheckResult] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ images: {}, videos: {} });
  const [uploadError, setUploadError] = useState({ images: {}, videos: {} });
  const [processing, setProcessing] = useState({ images: {}, videos: {} });
  const clearUploadError = (type, eventId) => {
    setUploadError((prev) => ({ ...prev, [type]: { ...prev[type], [eventId]: null } }));
  };

  // Admin-only download via signed Cloudinary URL
  const handleAdminDownloadImage = async (eventId, imageId) => {
    try {
      const res = await fetch(DOWNLOAD_IMAGE_URL(eventId, imageId), { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to get download link');
      window.open(data.url, '_blank');
    } catch (e) {
      alert(e.message || 'Failed to download image');
    }
  };

  const handleAdminDownloadVideo = async (eventId, videoId) => {
    try {
      const res = await fetch(DOWNLOAD_VIDEO_URL(eventId, videoId), { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to get download link');
      window.open(data.url, '_blank');
    } catch (e) {
      alert(e.message || 'Failed to download video');
    }
  };

  // Upload size limits
  const MAX_IMAGE_MB = 10;
  const MAX_VIDEO_MB = 100;
  const toMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2);

  // Helpers for analytics UI
  const bytesToGB = (b) => (typeof b === 'number' ? (b / (1024 * 1024 * 1024)).toFixed(2) : null);
  const percent = (used, limit) => {
    if (typeof used !== 'number' || typeof limit !== 'number' || limit <= 0) return null;
    return Math.min(100, Math.max(0, (used / limit) * 100));
  };
  const barColor = (p) => {
    if (p == null) return '#4a90e2';
    if (p >= 95) return '#d9534f'; // red
    if (p >= 80) return '#f0ad4e'; // orange
    return '#5cb85c'; // green
  };

  const imageInputRef = useRef({});
  const videoInputRef = useRef({});

  // Fetch events (stabilized with useCallback for hook deps)
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(EVENTS_URL, {
        credentials: "include",
      });
      if (res.status === 401) {
        setIsAuthenticated(false);
        setEvents([]);
      } else {
        const data = await res.json();
        setEvents(Array.isArray(data.events) ? data.events : []);
        setIsAuthenticated(true);
      }
    } catch {
      setEvents([]);
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  // Check authentication status helper (stabilized with useCallback and depends on fetchEvents)
  const checkAuthStatus = useCallback(async () => {
    try {
      // Ensure CSRF cookie exists for this POST
      await fetchCsrfToken();
      const csrfToken = getCookie('csrftoken');
      const response = await fetch(USER_CHECK_URL, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken || '',
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (data.authenticated && data.is_staff) {
        setIsAuthenticated(true);
        fetchEvents();
      } else {
        setIsAuthenticated(false);
        setEvents([]);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setEvents([]);
    }
  }, [fetchEvents]);

  // Run auth check on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // fetchEvents defined above using useCallback

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    
    try {
      console.log("1. Starting login process");
      
      // First get CSRF token
      console.log("2. Fetching CSRF token...");
      await fetchCsrfToken();
      const csrfToken = getCookie("csrftoken");
      console.log("3. Got CSRF token:", csrfToken ? "[token exists]" : "[no token]");
      
      console.log("4. Preparing login request with data:", loginData);
      
      // Then authenticate with Django admin
      const res = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken || "",
        },
        credentials: "include",
        body: JSON.stringify(loginData),
      });
      
      console.log("5. Login response status:", res.status);
      console.log("6. Response headers:", Object.fromEntries(res.headers.entries()));
      
      // Safely parse JSON; if backend returned HTML (e.g., 404),
      // use a cloned response to read text to avoid 'body stream already read'.
      let data;
      try {
        const clone = res.clone();
        try {
          data = await res.json();
          console.log("7. Response data:", data);
        } catch (jsonError) {
          console.error("Failed to parse JSON response:", jsonError);
          const text = await clone.text();
          console.error("Raw response:", text);
          throw new Error(`Invalid response from server: ${text}`);
        }
      } catch (e) {
        throw e;
      }
      
      if (data.success) {
        console.log("7. Login successful");
        // Optimistically set authenticated and load events immediately
        setIsAuthenticated(true);
        await fetchEvents();
        // Also trigger background confirmation (does not block UI)
        checkAuthStatus();
      } else {
        console.log("8. Login failed:", data.error || "Unknown error");
        setLoginError(data.error || `Login failed with status ${res.status}. Please check your credentials.`);
      }
    } catch (error) {
      console.error("9. Login error:", error);
      setLoginError(`An error occurred during login: ${error.message}`);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    const csrfToken = getCookie("csrftoken");
    await fetch(LOGOUT_URL, {
      method: "POST",
      headers: {
        "X-CSRFToken": csrfToken,
      },
      credentials: "include",
    });
    setIsAuthenticated(false);
    setEvents([]);
  };

  // Save (add/edit) event
  const handleSave = async (e) => {
    e.preventDefault();
    const csrfToken = getCookie("csrftoken");
    // Create: enforce at least one image and use multipart
    if (!editingEvent) {
      if (!newEventImages || newEventImages.length === 0) {
        alert("Please select at least one image to create an event.");
        return;
      }
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("date", form.date);
      fd.append("description", form.description);
      for (const f of newEventImages) fd.append("images", f);
      await fetch(EVENTS_URL, {
        method: "POST",
        headers: { "X-CSRFToken": csrfToken },
        credentials: "include",
        body: fd,
      });
    } else {
      // Edit: simple JSON update
      const payload = { ...form };
      await fetch(`${EVENTS_URL}${editingEvent.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
    }
    setShowForm(false);
    fetchEvents();
  };

  // Delete event
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    const csrfToken = getCookie("csrftoken");
    await fetch(`${EVENTS_URL}${id}/`, {
      method: "DELETE",
      headers: { "X-CSRFToken": csrfToken },
      credentials: "include",
    });
    fetchEvents();
  };

  // Image upload
  const handleImageUpload = async (eventId, files) => {
    if (!files || files.length === 0) return;
    // Enforce max 5 images per event on client-side
    const eventObj = events.find((e) => e.id === eventId);
    const currentCount = eventObj?.images?.length || 0;
    const toAdd = files.length;
    if (currentCount + toAdd > 5) {
      const remaining = Math.max(5 - currentCount, 0);
      const msg = `You can upload up to 5 images per event. Currently you have ${currentCount}. You can add ${remaining} more.`;
      setUploadError((prev) => ({ ...prev, images: { ...prev.images, [eventId]: msg } }));
      return;
    }
    // Client-side per-file size validation (10MB)
    for (let f of files) {
      if (f && typeof f.size === 'number' && f.size > MAX_IMAGE_MB * 1024 * 1024) {
        const msg = `Image file too large. Got ${toMB(f.size)} MB. Maximum is ${MAX_IMAGE_MB} MB.`;
        setUploadError((prev) => ({ ...prev, images: { ...prev.images, [eventId]: msg } }));
        return;
      }
    }

    const formData = new FormData();
    for (let file of files) {
      formData.append("images", file);
    }
    const csrfToken = getCookie("csrftoken");

    // Reset error, set progress to 0
    setUploadError((prev) => ({ ...prev, images: { ...prev.images, [eventId]: null } }));
    setUploadProgress((prev) => ({ ...prev, images: { ...prev.images, [eventId]: 0 } }));

    try {
      await uploadWithProgress(
        `${IMAGES_URL}${eventId}/`,
        formData,
        csrfToken,
        (pct) => setUploadProgress((prev) => ({ ...prev, images: { ...prev.images, [eventId]: pct } }))
      );
      setUploadProgress((prev) => ({ ...prev, images: { ...prev.images, [eventId]: 100 } }));
      await fetchEvents();
      // Clear progress shortly after completion
      setTimeout(() => setUploadProgress((prev) => ({ ...prev, images: { ...prev.images, [eventId]: 0 } })), 1000);
    } catch (e) {
      const msg = formatSizeError(e?.message || "Upload failed");
      setUploadError((prev) => ({ ...prev, images: { ...prev.images, [eventId]: msg } }));
      setUploadProgress((prev) => ({ ...prev, images: { ...prev.images, [eventId]: 0 } }));
      alert(msg);
    }
  };

  // Poll a URL until it returns HTTP 200 OK (or timeout)
  const waitForResource = async (url, timeoutMs = 60000, intervalMs = 3000) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try {
        const res = await fetch(url, { method: 'HEAD' });
        if (res.ok) return true;
      } catch (e) {
        // ignore and retry
      }
      await new Promise((r) => setTimeout(r, intervalMs));
    }
    return false;
  };

  // Image delete
  const handleImageDelete = async (eventId, imageId) => {
    if (!window.confirm("Delete this image?")) return;
    const csrfToken = getCookie("csrftoken");
    const res = await fetch(`${IMAGES_URL}${eventId}/${imageId}/`, {
      method: "DELETE",
      headers: { "X-CSRFToken": csrfToken },
      credentials: "include",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Failed to delete image");
    }
    fetchEvents();
  };

  const handleSetProfileImage = async (eventId, imageId) => {
    try {
      const csrfToken = getCookie("csrftoken");
      const res = await fetch(`${IMAGES_URL}${eventId}/${imageId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ is_profile: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to set profile image");
      fetchEvents();
    } catch (e) {
      alert(e.message);
    }
  };

  // Video upload
  const handleVideoUpload = async (eventId, file) => {
    if (!file) return;
    // Enforce max 1 video per event on client-side
    const eventObj = events.find((e) => e.id === eventId);
    if (eventObj?.video) {
      const msg = "This event already has a video. Please delete it before uploading a new one.";
      setUploadError((prev) => ({ ...prev, videos: { ...prev.videos, [eventId]: msg } }));
      return;
    }
    // Client-side file size validation (100MB)
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      const msg = `Video file too large. Got ${toMB(file.size)} MB. Maximum is ${MAX_VIDEO_MB} MB.`;
      setUploadError((prev) => ({ ...prev, videos: { ...prev.videos, [eventId]: msg } }));
      return;
    }
    const formData = new FormData();
    formData.append("video", file);
    const csrfToken = getCookie("csrftoken");

    // Reset error, set progress to 0
    setUploadError((prev) => ({ ...prev, videos: { ...prev.videos, [eventId]: null } }));
    setUploadProgress((prev) => ({ ...prev, videos: { ...prev.videos, [eventId]: 0 } }));
    setProcessing((prev) => ({ ...prev, videos: { ...prev.videos, [eventId]: false } }));

    try {
      await uploadWithProgress(
        `${VIDEOS_URL}${eventId}/`,
        formData,
        csrfToken,
        (pct) => setUploadProgress((prev) => ({ ...prev, videos: { ...prev.videos, [eventId]: pct } }))
      );
      setUploadProgress((prev) => ({ ...prev, videos: { ...prev.videos, [eventId]: 100 } }));
      // Start processing indicator and poll until the video URL becomes available
      setProcessing((prev) => ({ ...prev, videos: { ...prev.videos, [eventId]: true } }));
      // Refresh event to get the latest URL
      await fetchEvents();
      // Find the uploaded video's URL
      const ev = events.find((e) => e.id === eventId);
      const videoUrl = ev?.video?.url ? getFullUrl(ev.video.url) : null;
      if (videoUrl) {
        await waitForResource(videoUrl, 90000, 4000);
      } else {
        // Fallback: wait a bit then refetch a couple of times
        for (let i = 0; i < 5; i++) {
          await new Promise((r) => setTimeout(r, 3000));
          await fetchEvents();
          const ev2 = events.find((e) => e.id === eventId);
          const v2 = ev2?.video?.url ? getFullUrl(ev2.video.url) : null;
          if (v2) break;
        }
      }
      // Final refresh and clear indicators
      await fetchEvents();
      setProcessing((prev) => ({ ...prev, videos: { ...prev.videos, [eventId]: false } }));
      // Clear progress after a short delay
      setTimeout(() => setUploadProgress((prev) => ({ ...prev, videos: { ...prev.videos, [eventId]: 0 } })), 1000);
    } catch (e) {
      const msg = formatSizeError(e?.message || "Upload failed");
      setUploadError((prev) => ({ ...prev, videos: { ...prev.videos, [eventId]: msg } }));
      setUploadProgress((prev) => ({ ...prev, videos: { ...prev.videos, [eventId]: 0 } }));
      alert(msg);
    }
  };

  // XHR upload with progress and JSON error parsing
  const uploadWithProgress = (url, formData, csrfToken, onProgress) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.withCredentials = true;
      if (csrfToken) xhr.setRequestHeader("X-CSRFToken", csrfToken);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && typeof onProgress === "function") {
          const pct = Math.round((e.loaded / e.total) * 100);
          onProgress(pct);
        }
      };

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          try {
            const json = JSON.parse(xhr.responseText || "{}");
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(json);
            } else {
              const errMsg = formatSizeError(json?.error || `Upload failed with status ${xhr.status}`);
              reject(new Error(errMsg));
            }
          } catch (err) {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve({});
            } else {
              reject(new Error(formatSizeError(`Upload failed with status ${xhr.status}`)));
            }
          }
        }
      };

      xhr.onerror = () => reject(new Error("Network error during upload"));
      xhr.send(formData);
    });
  };

  // Convert Cloudinary byte-based size errors to MB for readability
  const formatSizeError = (message) => {
    try {
      // Example: "File size too large. Got 88923513. Maximum is 10485760."
      const gotMatch = message.match(/Got\s(\d+)/i);
      const maxMatch = message.match(/Maximum\sis\s(\d+)/i);
      if (gotMatch || maxMatch) {
        const got = gotMatch ? parseInt(gotMatch[1], 10) : null;
        const max = maxMatch ? parseInt(maxMatch[1], 10) : null;
        const toMB = (b) => (b / (1024 * 1024)).toFixed(2);
        let formatted = message;
        if (got !== null) formatted = formatted.replace(gotMatch[1], `${toMB(got)} MB`);
        if (max !== null) formatted = formatted.replace(maxMatch[1], `${toMB(max)} MB`);
        return formatted;
      }
      return message;
    } catch {
      return message;
    }
  };

  // Video delete
  const handleVideoDelete = async (eventId, videoId) => {
    if (!window.confirm("Delete this video?")) return;
    const csrfToken = getCookie("csrftoken");
    await fetch(`${VIDEOS_URL}${eventId}/${videoId}/`, {
      method: "DELETE",
      headers: { "X-CSRFToken": csrfToken },
      credentials: "include",
    });
    fetchEvents();
  };

  // Download helper removed: Admin downloads now use signed endpoints (handleAdminDownloadImage/Video)

  // Open form for add/edit
  const openForm = (event = null) => {
    setEditingEvent(event);
    setForm(
      event
        ? {
            name: event.name || "",
            date: event.date || "",
            description: event.description || "",
          }
        : { name: "", date: "", description: "" }
    );
    setShowForm(true);
    setNewEventImages([]);
  };

  const paginatedEvents = events.slice((page - 1) * pageSize, page * pageSize);
  const getFullUrl = (url) => (url?.startsWith("/") ? API_BASE + url : url);

  // Fetch storage analytics
  const handleCheckStorage = async () => {
    try {
      const res = await fetch(STORAGE_ANALYTICS_URL, { credentials: "include" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || `Failed to fetch storage analytics (status ${res.status})`);
        return;
      }
      const data = await res.json();
      setStorageData(data);
      setShowStorageModal(true);
    } catch (e) {
      alert("Error fetching storage analytics");
    }
  };

  // Check if user exists
  const handleUserCheck = async (e) => {
    e.preventDefault();
    setUserCheckResult(null);
    await fetchCsrfToken();
    const csrfToken = getCookie("csrftoken");
    try {
      const res = await fetch(USER_CHECK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(userForm),
      });
      const data = await res.json();
      setUserCheckResult(data);
    } catch (error) {
      setUserCheckResult({ error: "Failed to check user" });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="login-page">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Admin Login</h2>
          {loginError && <div className="error-text">{loginError}</div>}
          <input
            type="text"
            placeholder="Username"
            value={loginData.username}
            onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
            required
          />
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <div>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={() => openForm()}>+ Add Event</button>
          <button onClick={() => setShowUserForm(true)}>Check User</button>
          <button onClick={handleCheckStorage}>Check Storage</button>
        </div>
      </div>

      <label className="entries-label">
        Entries per page:
        <select
          value={pageSize}
          onChange={(e) => {
            setPage(1);
            setPageSize(Number(e.target.value));
          }}
        >
          {[2, 5, 10, 20].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {paginatedEvents.map((event) => (
            <div key={event.id} className="event-section">
              {/* Row 1: Event Details + Images */}
              <div className="event-card details-row">
                <div className="event-info">
                  <h3>{event.name}</h3>
                  <p>{event.date}</p>
                  <p>{event.description}</p>
                  <div style={{ marginTop: "10px" }}>
                    <button onClick={() => openForm(event)}>Edit Event</button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(event.id)}
                      style={{ marginLeft: "10px" }}
                    >
                      Delete Event
                    </button>
                  </div>
                </div>
                <div className="event-images">
                  {event.images && event.images.map((img) => (
                    <div key={img.id} className="thumb-wrap">
                      <img
                        src={getFullUrl(img.url)}
                        alt="event"
                        className="image-thumbnail"
                        onClick={() => setPreviewImage(getFullUrl(img.url))}
                      />
                      <button
                        className={`set-profile-btn ${img.is_profile ? 'active' : ''}`}
                        onClick={() => handleSetProfileImage(event.id, img.id)}
                        title={img.is_profile ? "Profile image" : "Set as profile"}
                        disabled={img.is_profile}
                      >
                        ★
                      </button>
                      <div className="image-controls">
                        <button onClick={() => handleImageDelete(event.id, img.id)}>
                          Delete
                        </button>
                        <button onClick={() => handleAdminDownloadImage(event.id, img.id)}>
                          Download
                        </button>
                      </div>
                      {img.is_profile && (
                        <div className="profile-badge">Profile</div>
                      )}
                    </div>
                  ))}
                  <button onClick={() => imageInputRef.current[event.id]?.click()}>
                    + Add Image
                  </button>
                  {typeof uploadProgress.images[event.id] === 'number' && uploadProgress.images[event.id] > 0 && (
                    <div style={{ marginTop: 6 }}>
                      <div className="progress-wrap">
                        <div className="progress-bar" style={{ width: `${Math.min(100, uploadProgress.images[event.id])}%` }} />
                      </div>
                      <div style={{ fontSize: 12, marginTop: 4 }}>Uploading images: {Math.min(100, uploadProgress.images[event.id])}%</div>
                    </div>
                  )}
                  {uploadError.images[event.id] && (
                    <div style={{ fontSize: 12, marginTop: 6 }}>
                      <span className="error-text">{uploadError.images[event.id]}</span>
                      <button style={{ marginLeft: 8 }} onClick={() => clearUploadError('images', event.id)}>Clear</button>
                    </div>
                  )}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={(el) => (imageInputRef.current[event.id] = el)}
                    onChange={(e) => handleImageUpload(event.id, e.target.files)}
                    style={{ display: "none" }}
                  />
                </div>
              </div>

              {/* Row 2: Video */}
              <div className="event-card video-row">
                {event.video ? (
                  <>
                    <video controls>
                      <source src={getFullUrl(event.video.url)} type="video/mp4" />
                    </video>
                    <div className="video-controls">
                      <button onClick={() => handleAdminDownloadVideo(event.id, event.video.id)}>
                        Download Video
                      </button>
                      <button onClick={() => handleVideoDelete(event.id, event.video.id)}>
                        Delete Video
                      </button>
                    </div>
                  </>
                ) : (
                  <p>No video uploaded yet.</p>
                )}
                <button onClick={() => videoInputRef.current[event.id]?.click()}>
                  + Add Video
                </button>
                {typeof uploadProgress.videos[event.id] === 'number' && uploadProgress.videos[event.id] > 0 && (
                  <div style={{ marginTop: 6 }}>
                    <div className="progress-wrap">
                      <div className="progress-bar" style={{ width: `${Math.min(100, uploadProgress.videos[event.id])}%` }} />
                    </div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>Uploading video: {Math.min(100, uploadProgress.videos[event.id])}%</div>
                  </div>
                )}
                {processing.videos[event.id] && (
                  <div style={{ marginTop: 6 }}>
                    <div className="progress-wrap">
                      <div className="progress-bar indeterminate" />
                    </div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>Processing video on server...</div>
                  </div>
                )}
                {uploadError.videos[event.id] && (
                  <div style={{ fontSize: 12, marginTop: 6 }}>
                    <span className="error-text">{uploadError.videos[event.id]}</span>
                    <button style={{ marginLeft: 8 }} onClick={() => clearUploadError('videos', event.id)}>Clear</button>
                  </div>
                )}
                <input
                  type="file"
                  accept="video/*"
                  ref={(el) => (videoInputRef.current[event.id] = el)}
                  onChange={(e) => handleVideoUpload(event.id, e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>
              <hr className="event-divider" />
            </div>
          ))}
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Prev
            </button>
            <span> Page {page} </span>
            <button
              disabled={page * pageSize >= events.length}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <form onSubmit={handleSave} className="form-modal">
            <h2>{editingEvent ? "Edit Event" : "Add Event"}</h2>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Event Name"
              required
            />
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description"
              required
            />
            {!editingEvent && (
              <div>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>Images (at least 1 required)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setNewEventImages(Array.from(e.target.files || []))}
                  required
                />
                {newEventImages && newEventImages.length > 0 && (
                  <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {newEventImages.slice(0, 5).map((f, idx) => (
                      <img
                        key={idx}
                        src={URL.createObjectURL(f)}
                        alt="preview"
                        style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}
                        onLoad={(ev) => URL.revokeObjectURL(ev.target.src)}
                      />
                    ))}
                    {newEventImages.length > 5 && (
                      <span style={{ alignSelf: 'center', color: '#666' }}>+{newEventImages.length - 5} more</span>
                    )}
                  </div>
                )}
              </div>
            )}
            <button type="submit">Save</button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {showUserForm && (
        <div className="modal-overlay">
          <form onSubmit={handleUserCheck} className="form-modal">
            <h2>Check User</h2>
            <input
              value={userForm.user_name}
              onChange={(e) => setUserForm({ ...userForm, user_name: e.target.value })}
              placeholder="Username"
              required
            />
            <input
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              placeholder="Email"
              required
            />
            <button type="submit">Check User</button>
            <button type="button" onClick={() => {
              setShowUserForm(false);
              setUserCheckResult(null);
              setUserForm({ user_name: "", email: "" });
            }}>
              Cancel
            </button>
            {userCheckResult && (
              <div className="user-check-result">
                {userCheckResult.exists ? (
                  <div className="user-found">
                    <p style={{color: 'green'}}> User found!</p>
                    <p><strong>Name:</strong> {userCheckResult.user.user_name}</p>
                    <p><strong>Email:</strong> {userCheckResult.user.email}</p>
                  </div>
                ) : (
                  <p style={{color: 'red'}}> User not found</p>
                )}
                {userCheckResult.error && (
                  <p style={{color: 'red'}}>Error: {userCheckResult.error}</p>
                )}
              </div>
            )}
          </form>
        </div>
      )}

      {previewImage && (
        <div onClick={() => setPreviewImage(null)} className="image-preview-modal">
          <img src={previewImage} alt="preview" />
        </div>
      )}

      {showStorageModal && (
        <div className="modal-overlay">
          <div className="form-modal" style={{ maxWidth: 800 }}>
            <h2>Storage Analytics</h2>
            {!storageData ? (
              <p>Loading...</p>
            ) : (
              <div className="storage-analytics">
                {/* Summary bars */}
                {(() => {
                  const s = storageData.overall_storage || {};
                  const b = storageData.overall_bandwidth || {};
                  const t = storageData.overall_transformations || {};
                  const sPct = percent(s.usage_bytes, s.limit_bytes);
                  const bPct = percent(b.usage_bytes, b.limit_bytes);
                  const tPct = percent(t.usage, t.limit);

                  const rowStyle = { marginBottom: 12 };
                  const labelStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 };
                  const infoStyle = { fontSize: 12, color: '#666', marginLeft: 6 };
                  const barWrap = { width: '100%', height: 10, background: '#eee', borderRadius: 6, overflow: 'hidden' };
                  const mkBar = (p) => ({ width: `${p ?? 0}%`, height: '100%', background: barColor(p) });

                  return (
                    <>
                      <div style={rowStyle}>
                        <div style={labelStyle}>
                          <strong>Storage Used / Limit</strong>
                          <span title="Total size of all images and videos stored on Cloudinary." style={infoStyle}>i</span>
                        </div>
                        <div style={{ fontSize: 12, marginBottom: 6 }}>
                          Used: {bytesToGB(s.usage_bytes) ? `${bytesToGB(s.usage_bytes)} GB` : '-'} | Limit: {bytesToGB(s.limit_bytes) ? `${bytesToGB(s.limit_bytes)} GB` : '-'} {sPct != null ? `(${sPct.toFixed(1)}%)` : ''}
                        </div>
                        <div style={barWrap}><div style={mkBar(sPct)} /></div>
                      </div>

                      <div style={rowStyle}>
                        <div style={labelStyle}>
                          <strong>Delivery Bandwidth / Limit</strong>
                          <span title="Amount of data downloaded by your visitors." style={infoStyle}>i</span>
                        </div>
                        <div style={{ fontSize: 12, marginBottom: 6 }}>
                          Used: {bytesToGB(b.usage_bytes) ? `${bytesToGB(b.usage_bytes)} GB` : '-'} | Limit: {bytesToGB(b.limit_bytes) ? `${bytesToGB(b.limit_bytes)} GB` : '-'} {bPct != null ? `(${bPct.toFixed(1)}%)` : ''}
                        </div>
                        <div style={barWrap}><div style={mkBar(bPct)} /></div>
                      </div>

                      <div style={rowStyle}>
                        <div style={labelStyle}>
                          <strong>Transformations / Limit</strong>
                          <span title="Number of unique resized or converted versions created." style={infoStyle}>i</span>
                        </div>
                        <div style={{ fontSize: 12, marginBottom: 6 }}>
                          Used: {typeof t.usage === 'number' ? t.usage : '-'} | Limit: {typeof t.limit === 'number' ? t.limit : '-'} {tPct != null ? `(${tPct.toFixed(1)}%)` : ''}
                        </div>
                        <div style={barWrap}><div style={mkBar(tPct)} /></div>
                      </div>
                    </>
                  );
                })()}
                <div style={{ marginBottom: 12 }}>
                  <strong>Total (computed across events):</strong>{" "}
                  {((storageData.computed_total_bytes || 0) / (1024 * 1024)).toFixed(2)} MB
                </div>
                <div style={{ marginBottom: 12 }}>
                  <strong>Cloudinary Account Usage (from API):</strong>
                  <div style={{ fontSize: 14 }}>
                    Plan: {(storageData.overall && storageData.overall.plan) || "-"}
                  </div>
                  {storageData.overall_storage && (
                    <div style={{ fontSize: 14 }}>
                      {(() => {
                        const { usage_bytes, limit_bytes, available_bytes } = storageData.overall_storage;
                        const toMB = (b) => (b / (1024 * 1024)).toFixed(2) + ' MB';
                        const usedStr = typeof usage_bytes === 'number' ? toMB(usage_bytes) : '-';
                        const limitStr = typeof limit_bytes === 'number' ? toMB(limit_bytes) : '-';
                        const availStr = typeof available_bytes === 'number' ? toMB(available_bytes) : '-';
                        return (
                          <>
                            Used: {usedStr}
                            {" | "}
                            Limit: {limitStr}
                            {" | "}
                            Available: {availStr}
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
                <div>
                  <strong>Per Event:</strong>
                  <ul style={{ maxHeight: 300, overflow: "auto" }}>
                    {(storageData.events || []).map((ev) => (
                      <li key={ev.event_id} style={{ margin: "8px 0" }}>
                        <div><strong>{ev.event_name}</strong></div>
                        <div style={{ fontSize: 14 }}>
                          {(() => {
                            const imgGB = bytesToGB(ev.images?.bytes || 0);
                            const vidGB = bytesToGB(ev.videos?.bytes || 0);
                            const totalGB = bytesToGB(ev.total_bytes || 0);
                            return (
                              <>
                                Images: {imgGB ? `${imgGB} GB` : '0.00 GB'} ({ev.images?.count || 0} files)
                                {" | "}
                                Videos: {vidGB ? `${vidGB} GB` : '0.00 GB'} ({ev.videos?.count || 0} files)
                                {" | "}
                                Total: {totalGB ? `${totalGB} GB` : '0.00 GB'}
                              </>
                            );
                          })()}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            <div style={{ marginTop: 16, textAlign: "right" }}>
              <button onClick={() => setShowStorageModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;