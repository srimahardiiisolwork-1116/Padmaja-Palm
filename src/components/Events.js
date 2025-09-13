import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import '../styles/Events.css';
import { API_BASE } from "../config";

// API endpoint
const API_URL = `${API_BASE}/events/`;

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalEvents, setTotalEvents] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}?page=${page}&page_size=${pageSize}`);
        const list = Array.isArray(res.data.events) ? res.data.events : [];
        setEvents(list);
        setTotalEvents(typeof res.data.count === 'number' ? res.data.count : list.length);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError("Failed to load events");
      }
    };
    fetchEvents();
  }, [page, pageSize]);

  const handleCardClick = (eventId) => {
    if (!eventId) {
      console.error('Event ID is undefined');
      return;
    }
    navigate(`/events/${eventId}`);
  };

  const getImageUrl = (imgObj) => {
    if (!imgObj) return "";
    if (typeof imgObj === "string") {
      return imgObj.startsWith("/") ? API_BASE + imgObj : imgObj;
    }
    if (typeof imgObj === "object" && imgObj.url) {
      return imgObj.url.startsWith("/") ? API_BASE + imgObj.url : imgObj.url;
    }
    return "";
  };

  // Format date with time
  const formatEventDate = (dateString) => {
    if (!dateString) return '';
    const options = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get a short description with proper truncation
  const getShortDescription = (description) => {
    if (!description) return '';
    const maxLength = 160;
    if (description.length <= maxLength) return description;
    return `${description.substring(0, maxLength).trim()}...`;
  };

  // Handle image loading errors with a fallback
  const handleImageError = (e) => {
    if (e.target.src !== 'https://via.placeholder.com/400x300?text=Event+Image') {
      e.target.onerror = null;
      e.target.src = 'https://via.placeholder.com/400x300?text=Event+Image';
    }
  };

  // With server-side pagination, use events directly from API
  const paginatedEvents = events;

  if (loading) {
    return (
      <div className="loading-state">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }


  // Render loading state

  // Render error state
  if (error) {
    return (
      <div className="error-message text-center py-12">
        <p className="text-xl mb-4">We're sorry, but we couldn't load the events.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-gold-500 text-white rounded-md hover:bg-gold-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Main render
  return (
    <div className="events-page">
      <div className="events-header">
        <h1 className="events-title">EVENTS</h1>
      </div>

      {/* Always-visible page size selector */}
      <div className="events-controls" style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px 0' }}>
        <label htmlFor="page-size-select" style={{ marginRight: 8 }}>Entries per page:</label>
        <select
          id="page-size-select"
          value={pageSize}
          onChange={(e) => {
            setPage(1);
            setPageSize(Number(e.target.value));
          }}
        >
          {[5, 10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <div className="events-container">
        {totalEvents === 0 && !loading ? (
          <div className="coming-soon">
            <div className="glow-circle" />
            <h2>Events coming soon</h2>
            <p>We’re curating beautiful memories. Please check back shortly.</p>
          </div>
        ) : paginatedEvents.map((event) => (
          <div 
            key={event.id} 
            className="event-card"
            onClick={() => handleCardClick(event.id)}
            aria-label={`View details for ${event.name}`}
          >
            <div className="event-image-container">
              <img 
                src={getImageUrl(event.profile_image) || getImageUrl(event.images?.[0]) || 'https://via.placeholder.com/1200x600?text=Event+Image'} 
                alt={event.name}
                className="event-image"
                loading="lazy"
                onError={handleImageError}
              />
            </div>
            <div className="event-card-content">
              <div className="event-date">
                <CalendarIcon className="calendar-icon" />
                <span>{formatEventDate(event.date)}</span>
              </div>
              <h2 className="event-title">{event.name}</h2>
              <p className="event-description">
                {getShortDescription(event.description)}
              </p>
              <button 
                className="event-details-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(event.id);
                }}
                aria-label={`Learn more about ${event.name}`}
              >
                VIEW DETAILS
                <ChevronRightIcon className="button-arrow" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalEvents > pageSize && (
        <div className="pagination">
          <button 
            className="pagination-button"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          
          <div className="pagination-pages">
            {Array.from({ length: Math.ceil(totalEvents / pageSize) }, (_, i) => (
              <button
                key={i + 1}
                className={`page-number ${page === i + 1 ? 'active' : ''}`}
                onClick={() => setPage(i + 1)}
                aria-label={`Go to page ${i + 1}`}
                aria-current={page === i + 1 ? 'page' : undefined}
              >
                {i + 1}
              </button>
            ))}
          </div>
          
          <button 
            className="pagination-button"
            onClick={() => setPage(p => Math.min(Math.ceil(totalEvents / pageSize), p + 1))}
            disabled={page >= Math.ceil(totalEvents / pageSize)}
            aria-label="Next page"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Events;
