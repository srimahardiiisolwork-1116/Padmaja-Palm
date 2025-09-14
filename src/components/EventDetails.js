import React, { useState, useEffect, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';
import axios from 'axios';
import { API_BASE } from '../config';
import '../styles/EventDetails.css';

// Removed unused constant to fix lint warning

const formatDate = (dateStr) => {
  if (!dateStr) return "Date not available";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch (e) {
    console.error('Error formatting date:', e);
    return "Invalid date";
  }
};

const resolveUrl = (url) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_BASE}${url}`;
};

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('photos');
  const [previewImg, setPreviewImg] = useState(null);
  const videoRef = useRef(null);
  // Embla (mobile/tablet) state for dots
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      dragFree: false,
      skipSnaps: false,
    },
    [Autoplay({ delay: 3500, stopOnInteraction: true })]
  );

  useEffect(() => {
    if (!document.getElementById("eventdetails-anim")) {
      const style = document.createElement("style");
      style.id = "eventdetails-anim";
      style.innerHTML = `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Setup Embla dots & selection when API ready
  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const fetchEvent = useCallback(async () => {
    if (!id) {
      setError('No event ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log(`Fetching event with ID: ${id}`);
      const response = await axios.get(`${API_BASE}/events/${id}/`);
      console.log('Event data received:', response.data);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      console.log('Event data:', response.data);
      
      // Make sure we have the expected data structure
      const eventData = response.data;
      
      // Ensure images and videos are arrays
      const images = Array.isArray(eventData.images) ? eventData.images : [];
      const videos = Array.isArray(eventData.videos) ? eventData.videos : [];
      
      // Ensure video is properly formatted as an array if it exists
      const videoData = eventData.video ? [eventData.video] : [];
      
      const eventWithMedia = {
        ...eventData,
        images: Array.isArray(images) ? images : [],
        videos: Array.isArray(videos) ? videos : videoData,
        // Add default values for required fields if they're missing
        name: eventData.name || 'Untitled Event',
        description: eventData.description || '',
        date: eventData.date || new Date().toISOString()
      };
      
      // Debug: Log video URL
      console.log('Video URL:', eventWithMedia.video?.url);
      console.log('Videos array:', eventWithMedia.videos);
      
      setEvent(eventWithMedia);
      
      setError('');
    } catch (err) {
      console.error('Error fetching event:', err);
      setError('Failed to load event details. Please try again later.');
      // Set event to null to trigger the not found UI
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // Only fetch if we have a valid ID
    if (id) {
      fetchEvent();
    } else {
      console.error('No event ID found in URL');
      setError('No event ID found in URL');
      setLoading(false);
    }
  }, [id, fetchEvent]);

  if (loading) {
    return (
      <div className="eventdetails-loading">
        <div className="eventdetails-loading-spinner"></div>
        <p>Loading event details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="eventdetails-error">
        <div className="eventdetails-error-icon">⚠️</div>
        <h3>Couldn't load event</h3>
        <p>{error}</p>
        <button 
          className="eventdetails-retry-button"
          onClick={fetchEvent}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="eventdetails-not-found">
        <h2>Event Not Found</h2>
        <p>The event you're looking for doesn't exist or has been removed.</p>
        <button 
          className="eventdetails-back-button"
          onClick={() => navigate('/events')}
        >
          <FaChevronLeft /> Back to Events
        </button>
      </div>
    );
  }

  const hasPhotos = Array.isArray(event.images) && event.images.length > 0;
  // Check for video in both video and videos properties
  const video = event?.video?.url ? event.video : 
               (Array.isArray(event.videos) && event.videos.length > 0) ? event.videos[0] : null;
  const hasVideo = !!(video?.url || video);
  
  // Debug logs
  console.log('Video object:', video);
  console.log('Has video:', hasVideo);
  if (hasVideo) {
    console.log('Video URL:', resolveUrl(video.url || video));
  }

  // Split photos: always first 3 in first row, second row only if > 3
  const photoRows = [];
  if (hasPhotos) {
    photoRows.push(event.images.slice(0, 3));
    if (event.images.length > 3) {
      photoRows.push(event.images.slice(3, 5));
    }
  }

  return (
    <main className="eventdetails-main">
      <button 
        className="back-button" 
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        <FaChevronLeft /> Back
      </button>
      
      {/* Event Info Section */}
      <section className="eventdetails-info">
        <div className="eventdetails-cover">
          {hasPhotos ? (
            <img
              src={resolveUrl((event.profile_image && event.profile_image.url) || event.images[0].url)}
              alt={event.name}
              className="eventdetails-cover-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
              }}
            />
          ) : (
            <div className="eventdetails-noimg">
              <span>No Image Available</span>
            </div>
          )}
        </div>

        <div className="eventdetails-text">
          <h1 className="event-title">{event.name}</h1>
          <div className="event-date">
            <span>📅</span>
            <span>{formatDate(event.date)}</span>
          </div>
          {event.description && (
            <p className="event-desc">{event.description}</p>
          )}
        </div>
      </section>

      {/* Tabs */}
      <div className="eventdetails-tabs">
        <button
          onClick={() => setActiveTab("photos")}
          className={`eventdetails-tab-btn ${activeTab === "photos" ? "active" : ""}`}
        >
          Photos
        </button>
        <button
          onClick={() => setActiveTab("videos")}
          className={`eventdetails-tab-btn ${activeTab === "videos" ? "active" : ""}`}
        >
          Video
        </button>
      </div>

      {/* Content */}
      <div className="eventdetails-content">
        {activeTab === "photos" && (
          <div className="eventdetails-photos">
            {hasPhotos ? (
              <>
                {/* Mobile: Carousel */}
                <div className="eventdetails-carousel mobile-only">
                  <div className="embla" ref={emblaRef}>
                    <div className="embla__container">
                      {event.images.map((img, index) => (
                        <div className="embla__slide" key={img.id || index}>
                          <img
                            src={resolveUrl(img.url)}
                            alt={event.name}
                            className="embla__slide__img"
                            draggable={false}
                            onClick={() => setPreviewImg(resolveUrl(img.url))}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="embla__dots">
                      {scrollSnaps.map((_, idx) => (
                        <button
                          key={idx}
                          className={`embla__dot ${idx === selectedIndex ? 'is-selected' : ''}`}
                          onClick={() => emblaApi && emblaApi.scrollTo(idx)}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Desktop/Tablet: existing grid */}
                <div className="desktop-only">
                  {photoRows.map((row, rowIdx) => (
                    <div key={rowIdx} className="eventdetails-photo-row">
                      {row.map((img, index) => (
                        <img
                          key={img.id || index}
                          src={resolveUrl(img.url)}
                          alt={event.name}
                          className="eventdetails-photo"
                          onClick={() => setPreviewImg(resolveUrl(img.url))}
                          onContextMenu={(e) => e.preventDefault()}
                          draggable={false}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="eventdetails-empty">No photos available</div>
            )}
          </div>
        )}

        {activeTab === "videos" && (
          <div className="eventdetails-video-card">
            <h2 className="video-section-heading">
              <span style={{
                position: 'relative',
                display: 'inline-block'
              }}>
                Event Highlights
                <span style={{
                  content: '""',
                  position: 'absolute',
                  bottom: '-8px',
                  left: '0',
                  width: '60px',
                  height: '3px',
                  background: '#c5a47e',
                  borderRadius: '3px'
                }}></span>
              </span>
            </h2>
            {hasVideo ? (
              <div className="video-container">
                <video
                  ref={videoRef}
                  src={resolveUrl(video.url || video)}
                  controls
                  controlsList="nodownload noplaybackrate"
                  disablePictureInPicture
                  onContextMenu={(e) => e.preventDefault()}
                  className="eventdetails-video"
                  playsInline
                  onError={(e) => {
                    const videoSrc = resolveUrl(video.url || video);
                    console.error('Error loading video:', e);
                    e.target.parentNode.innerHTML = `
                      <div class="video-error" style="padding: 20px; color: #721c24; background: #f8d7da; border-radius: 8px;">
                        <p>Error loading video. <a href="${videoSrc}" target="_blank" rel="noopener noreferrer" style="color: #0c5460; text-decoration: underline;">
                          Try opening in new tab
                        </a></p>
                        <p style="word-break: break-all; font-family: monospace; margin-top: 10px;">Video URL: ${videoSrc}</p>
                      </div>
                    `;
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#000',
                    outline: 'none'
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div className="eventdetails-empty">No video available for this event.</div>
            )}
          </div>
        )}
      </div>

      {/* Modal for image preview */}
      {previewImg && (
        <div
          className="eventdetails-modal-backdrop"
          onClick={() => setPreviewImg(null)}
        >
          <img src={previewImg} alt="Preview" className="eventdetails-modal-img" />
        </div>
      )}
    </main>
  );
};

export default EventDetails;
