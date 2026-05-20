import React, { useState, useRef, useEffect, useMemo } from "react";
import "./App.css";

function primaryButtonStyle(disabled = false) {
  return {
    padding: "12px 24px",
    borderRadius: "999px",
    border: "none",
    background: "#cfa7b3",
    color: "white",
    fontSize: "15px",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.55 : 1,
    transition: "0.2s ease",
  };
}

function secondaryButtonStyle(disabled = false) {
  return {
    padding: "12px 24px",
    borderRadius: "999px",
    border: "1px solid #e7d7dc",
    background: "white",
    color: "#7e6168",
    fontSize: "15px",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.55 : 1,
    transition: "0.2s ease",
  };
}



// Approximate lyrics timings for the short chorus snippet
const lyricsData = [
  { time: 0, text: "I'm lookin' back on things I've done" },
  { time: 5.7, text: "I never wanna play the same old part" },
  { time: 11.5, text: "I'll keep you in the dark" },
  { time: 14.5, text: "Now let me show you the shape of my heart" },
  { time: 19.0, text: "Happy Birthday! 💖" }
];

const photoData = [
  { time: 1, src: "/images/Untitled design (83).png" },
  { time: 5, src: "/images/Untitled design (85).png" },
  { time: 9, src: "/images/Untitled design (85).png" },
  { time: 13, src: "/images/Untitled design (84).png" },
  { time: 17, src: "/images/Untitled design (84).png" },
];

export default function App() {
  const [page, setPage] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [maxTime, setMaxTime] = useState(0);
  const [lyricsFinished, setLyricsFinished] = useState(false);
  const audioRef = useRef(null);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [fadeTransition, setFadeTransition] = useState(false);

  // Preload all images so they appear instantly during the animation
  useEffect(() => {
    const imagesToPreload = [
      ...photoData.map(p => p.src),
      "/images/cute_cloud.png"
    ];
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = `${import.meta.env.BASE_URL}${src.replace(/^\//, '')}`;
    });
  }, []);

  // Play music when entering page 1
  useEffect(() => {
    if (page === 1 && audioRef.current && audioRef.current.paused) {
      // Start from 0 since the audio file itself starts at the chorus
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.error("Auto-play failed:", e));
    } else if (page === 0 && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setMaxTime(0);
      setLyricsFinished(false);
    }
  }, [page]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      setCurrentTime(time);
      if (time > maxTime) {
        setMaxTime(time);
      }
      if (time >= 19.0 || maxTime >= 19.0) {
        setLyricsFinished(true);
      }
    }
  };

  // Find the current lyric based on time
  const currentLyricIndex = lyricsFinished
    ? lyricsData.length - 1
    : lyricsData.findIndex((lyric, index) => {
      const nextLyricTime = lyricsData[index + 1]?.time || Infinity;
      return currentTime >= lyric.time && currentTime < nextLyricTime;
    });

  const currentLyric =
    currentLyricIndex !== -1 ? lyricsData[currentLyricIndex].text : "";

  // Generate floating notes that only change when the current lyric changes
  const currentNotes = useMemo(() => {
    if (!currentLyric) return [];
    return [...Array(6)].map((_, i) => ({
      id: `note-${currentLyricIndex}-${i}`,
      left: Math.random() * 100, // 0 to 100%
      top: 30 + Math.random() * 70, // 30% to 100%
      duration: 1.5 + Math.random() * 1.5,
      delay: Math.random() * 0.4,
      size: 16 + Math.random() * 14,
      emoji: ["🎵", "🎶", "✨", "💖", "💫"][Math.floor(Math.random() * 5)]
    }));
  }, [currentLyricIndex, currentLyric]);

  // Find photos that should be visible up to the current time
  const visiblePhotos = lyricsFinished
    ? photoData
    : photoData.filter((photo) => currentTime >= photo.time || maxTime >= photo.time);

  // Determine camera focus state dynamically based on playback time
  let focusIndex = -1;
  if (page === 1) {
    if (lyricsFinished) {
      focusIndex = -1; // Center and frame all photos
    } else if (currentTime >= 17.0) {
      focusIndex = 4;
    } else if (currentTime >= 13.0) {
      focusIndex = 3;
    } else if (currentTime >= 9.0) {
      focusIndex = 2;
    } else if (currentTime >= 5.0) {
      focusIndex = 1;
    } else if (currentTime >= 1.0) {
      focusIndex = 0;
    }
  }

  const getCameraStyle = () => {
    if (focusIndex === -1) {
      return {
        transform: "scale(1) translate(0, 0)"
      };
    }

    const isMobile = typeof window !== "undefined" && window.innerWidth <= 600;

    // Negative offset coordinate of each card's transform to focus it perfectly in the viewport center
    const offsets = isMobile ? [
      { x: 90, y: 50 },   // Card 1: translate(-90px, -50px)
      { x: -80, y: 60 },  // Card 2: translate(80px, -60px)
      { x: 70, y: -70 },  // Card 3: translate(-70px, 70px)
      { x: -85, y: -80 }, // Card 4: translate(85px, 80px)
      { x: 0, y: -15 }    // Card 5: translate(0px, 15px)
    ] : [
      { x: 240, y: 70 },   // Card 1: translate(-240px, -70px)
      { x: -220, y: 90 },  // Card 2: translate(220px, -90px)
      { x: 200, y: -110 }, // Card 3: translate(-200px, 110px)
      { x: -210, y: -130 },// Card 4: translate(210px, 130px)
      { x: 0, y: -20 }     // Card 5: translate(0px, 20px)
    ];

    const offset = offsets[focusIndex] || { x: 0, y: 0 };
    const scale = isMobile ? 1.4 : 1.45;

    return {
      transform: `scale(${scale}) translate(${offset.x}px, ${offset.y}px)`
    };
  };

  const getLyricStyle = () => {
    // Stably centered at the top: no erratic left-right movement. Completely structured and smooth!
    return {
      transform: "translate(-50%, -50%)"
    };
  };

  return (
    <div className="app-container">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}music/shape-of-my-heart.mp3`}
        onTimeUpdate={handleTimeUpdate}
        preload="auto"
        loop
      />

      {/* Floating Background Hearts */}
      <div className="floating-hearts">
        <div className="heart"></div>
        <div className="heart"></div>
        <div className="heart"></div>
        <div className="heart"></div>
        <div className="heart"></div>
      </div>

      {page === 1 && <div className="page-fade-out" />}
      
      <div className="content-scaler">
        {page === 0 && (
          <div
            className="page-card-enter scrapbook-card"
            style={{
              minHeight: "82vh",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "36px",
              alignItems: "center",
            }}
          >
            {/* Scrapbook Background Dots & Tapes */}
            <div className="scrapbook-tape-tl"></div>
            <div className="scrapbook-tape-br"></div>

            {/* Decorative Doodle Star (Top Left) */}
            <svg className="doodle-star" width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#d1b1bb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ top: '30px', left: '40px', transform: 'rotate(15deg)' }}>
              <path d="M20 5 L20 35 M5 20 L35 20 M10 10 L30 30 M10 30 L30 10" />
            </svg>

            {/* Decorative Botanical Branch (Bottom Left) */}
            <svg className="botanical-branch" width="80" height="120" viewBox="0 0 60 100" fill="none" stroke="#d1b1bb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ bottom: '20px', left: '20px', transform: 'rotate(15deg)' }}>
              <path d="M30 100 Q 30 50, 45 0" />
              <path d="M30 80 Q 15 70, 10 50 Q 20 50, 30 70" />
              <path d="M32 60 Q 50 50, 55 30 Q 40 30, 35 50" />
              <path d="M35 40 Q 20 30, 15 10 Q 30 15, 38 30" />
            </svg>

            <div style={{ position: "relative", zIndex: 10 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "#b38c97",
                }}
              >
                04 Juni
              </p>

              <h1
                style={{
                  marginTop: "18px",
                  marginBottom: 0,
                  fontSize: "clamp(42px, 7vw, 72px)",
                  lineHeight: 1.08,
                  fontWeight: 600,
                }}
              >
                <span style={{ fontFamily: "'Pacifico', cursive" }}>
                  Happy Birthday,
                </span>
                <span
                  style={{
                    display: "block",
                    marginTop: "5px",
                    color: "#cfa7b3",
                    fontFamily: "'Pacifico', cursive",
                    fontSize: "clamp(54px, 12vw, 82px)",
                    fontWeight: 400,
                    letterSpacing: "2px",
                  }}
                >
                  Cindy.
                </span>
              </h1>

              <p
                style={{
                  marginTop: "30px",
                  maxWidth: "480px",
                  fontSize: "clamp(14px, 4vw, 16px)",
                  lineHeight: 2.1,
                  color: "#8a747a",
                  fontWeight: 500,
                }}
              >
                Sebuah halaman kecil yang aku buat khusus untuk kamu. Isinya sederhana, lembut, dan penuh rasa sayang untuk hari spesialmu.
              </p>

              <div style={{ marginTop: "32px" }}>
                <button
                  onClick={() => {
                    setPage(1);
                    setCurrentTime(0);
                    setMaxTime(0);
                    setLyricsFinished(false);
                    if (audioRef.current) {
                      audioRef.current.currentTime = 0;
                      audioRef.current.play().catch(e => console.error("Play failed:", e));
                    }
                  }}
                  style={primaryButtonStyle(false)}
                >
                  Open
                </button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  background: "rgba(250, 244, 246, 0.6)",
                  border: "1px solid #f5eaed",
                  borderRadius: "28px",
                  padding: "16px",
                  boxShadow: "0 15px 40px rgba(200, 150, 160, 0.08)",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg, #ffffff 0%, #fdf9fa 100%)",
                    border: "1px solid #f0e1e5",
                    borderRadius: "20px",
                    padding: "36px 30px",
                    position: "relative",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "clamp(10px, 3vw, 12px)",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "#b38c97",
                    }}
                  >
                    For you
                  </p>

                  <h2
                    style={{
                      marginTop: "16px",
                      marginBottom: 0,
                      fontSize: "clamp(24px, 6vw, 32px)",
                      fontWeight: 600,
                      color: "#6d5a60",
                    }}
                  >
                    on your <span style={{ fontFamily: "'Pacifico', cursive", color: "#cfa7b3", fontWeight: 400, letterSpacing: "1px" }}>special</span> day
                  </h2>

                  <p
                    style={{
                      marginTop: "18px",
                      lineHeight: 1.9,
                      color: "#6d5a60",
                    }}
                  >
                    Semoga saat kamu membuka website ini, kamu merasa tenang,
                    bahagia, dan tahu kalau kamu sangat berarti buat aku.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {page === 1 && (
          <>
            {/* Side Clouds Overlay */}
            <div className={`side-clouds ${currentLyricIndex === lyricsData.length - 1 ? 'hidden' : ''}`}>
              <svg className="cloud-corner tl-cloud" viewBox="0 0 24 24" fill="#ffffff" opacity="0.6">
                <path d="M17.5 19c2.485 0 4.5-2.015 4.5-4.5 0-2.435-1.92-4.417-4.331-4.495.361-3.69-2.585-6.903-6.27-7.005-3.32-.092-6.19 2.21-6.837 5.438-2.616.48-4.562 2.766-4.562 5.562 0 3.037 2.463 5.5 5.5 5.5h12z" />
              </svg>
              <svg className="cloud-corner tr-cloud" viewBox="0 0 24 24" fill="#ffffff" opacity="0.4">
                <path d="M17.5 19c2.485 0 4.5-2.015 4.5-4.5 0-2.435-1.92-4.417-4.331-4.495.361-3.69-2.585-6.903-6.27-7.005-3.32-.092-6.19 2.21-6.837 5.438-2.616.48-4.562 2.766-4.562 5.562 0 3.037 2.463 5.5 5.5 5.5h12z" />
              </svg>
              <svg className="cloud-corner bl-cloud" viewBox="0 0 24 24" fill="#fcf0f3" opacity="0.7">
                <path d="M17.5 19c2.485 0 4.5-2.015 4.5-4.5 0-2.435-1.92-4.417-4.331-4.495.361-3.69-2.585-6.903-6.27-7.005-3.32-.092-6.19 2.21-6.837 5.438-2.616.48-4.562 2.766-4.562 5.562 0 3.037 2.463 5.5 5.5 5.5h12z" />
              </svg>
              <svg className="cloud-corner br-cloud" viewBox="0 0 24 24" fill="#ffffff" opacity="0.5">
                <path d="M17.5 19c2.485 0 4.5-2.015 4.5-4.5 0-2.435-1.92-4.417-4.331-4.495.361-3.69-2.585-6.903-6.27-7.005-3.32-.092-6.19 2.21-6.837 5.438-2.616.48-4.562 2.766-4.562 5.562 0 3.037 2.463 5.5 5.5 5.5h12z" />
              </svg>
            </div>

            {/* Faded Background Photos during Happy Birthday */}
            {currentLyricIndex === lyricsData.length - 1 && (
              <div className="cinematic-bg">
                {[...photoData, photoData[0]].map((photo, i) => (
                  <div key={`bg-${i}`} className="bg-photo-wrapper">
                    <img
                      src={`${import.meta.env.BASE_URL}${photo.src.replace(/^\//, '')}`}
                      className="bg-photo"
                      style={{ animationDelay: `${i * 0.12}s` }}
                      alt=""
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="main-content" style={{ padding: 0, justifyContent: "center", position: "relative" }}>
              {/* Lyrics Layer (On top of photos) */}
              <div className="lyrics-overlay" style={getLyricStyle()}>
                <h2 className="lyric-text" key={currentLyricIndex}>
                  {currentLyric ? (
                    currentLyric.split(" ").map((word, i) => (
                      <span
                        key={i}
                        className="word-span"
                        style={{ animationDelay: `${i * 0.12}s` }}
                      >
                        {word}
                      </span>
                    ))
                  ) : (
                    ""
                  )}
                </h2>

                {/* Floating Notes/Sparkles */}
                {page === 1 && currentNotes.map(note => (
                  <div
                    key={note.id}
                    className="music-note"
                    style={{
                      left: `${note.left}%`,
                      top: `${note.top}%`,
                      animationDuration: `${note.duration}s`,
                      animationDelay: `${note.delay}s`,
                      fontSize: `${note.size}px`
                    }}
                  >
                    {note.emoji}
                  </div>
                ))}
              </div>

              {/* Photo Gallery Layer (Under lyrics) */}
              <div className="photo-gallery" style={getCameraStyle()}>
                {visiblePhotos.map((photo, index) => {
                  const isActive = focusIndex === index;
                  const isBlur = focusIndex !== -1 && !isActive;
                  const cardClass = `photo-card ${isActive ? "active-focus" : ""} ${isBlur ? "blurred-out" : ""}`;
                  return (
                    <div
                      key={index}
                      className={cardClass}
                      style={{
                        animationDelay: `${(index % 5) * 0.1}s`,
                      }}
                    >
                      <div className="photo-card-tape"></div>
                      <img
                        src={`${import.meta.env.BASE_URL}${photo.src.replace(/^\//, '')}`}
                        alt={`Memory ${index + 1}`}
                        onClick={() => { setLightboxSrc(`${import.meta.env.BASE_URL}${photo.src.replace(/^\//, '')}`); setLightboxIndex(index); }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML = `
                          <div class="photo-placeholder">
                            <span class="emoji">📸</span>
                            <p>Photo ${index + 1}</p>
                          </div>
                        `;
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {lightboxSrc && (
                <div className="lightbox" onClick={() => { setLightboxSrc(null); setLightboxIndex(null); }}>
                  <img src={lightboxSrc} alt="Enlarged" onClick={(e) => e.stopPropagation()} />
                  <button className="lightbox-close" onClick={() => { setLightboxSrc(null); setLightboxIndex(null); }} aria-label="Close">×</button>
                </div>
              )}

              {/* Button to go to the final page */}
              <div style={{ display: "flex", justifyContent: "center", marginTop: "40px", marginBottom: "20px", minHeight: "50px", position: "relative", zIndex: 20 }}>
                {currentLyricIndex === lyricsData.length - 1 && (
                  <button
                    onClick={() => setPage(2)}
                    style={primaryButtonStyle(false)}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {page === 2 && (
          <div className="page-card-enter scrapbook-card" style={{ textAlign: "center" }}>
            <div className="scrapbook-tape-tl"></div>
            <div className="scrapbook-tape-br"></div>

            {/* Decorative Elements for Page 2 */}
            <svg className="doodle-star" width="50" height="50" viewBox="0 0 40 40" fill="none" stroke="#d1b1bb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ top: '40px', right: '50px', transform: 'rotate(-10deg)' }}>
              <path d="M20 5 L20 35 M5 20 L35 20 M10 10 L30 30 M10 30 L30 10" />
            </svg>
            <svg className="botanical-branch" width="100" height="150" viewBox="0 0 60 100" fill="none" stroke="#d1b1bb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ top: '50px', left: '20px', transform: 'rotate(165deg)' }}>
              <path d="M30 100 Q 30 50, 45 0" />
              <path d="M30 80 Q 15 70, 10 50 Q 20 50, 30 70" />
              <path d="M32 60 Q 50 50, 55 30 Q 40 30, 35 50" />
              <path d="M35 40 Q 20 30, 15 10 Q 30 15, 38 30" />
            </svg>

            <div style={{ maxWidth: "680px", margin: "0 auto", position: "relative", zIndex: 10 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "#b38c97",
                }}
              >
                Best wishes
              </p>

              <h2
                style={{
                  marginTop: "18px",
                  marginBottom: 0,
                  fontSize: "clamp(30px, 5vw, 52px)",
                  fontWeight: 600,
                }}
              >
                <span style={{ fontFamily: "'Pacifico', cursive" }}>
                  Doa untukmu
                </span>
              </h2>

              <p
                style={{
                  marginTop: "28px",
                  fontSize: "clamp(14px, 4vw, 16px)",
                  lineHeight: 1.9,
                  color: "#6d5a60",
                }}
              >
                Semoga di setiap langkahmu, kamu selalu diberi kekuatan, kesabaran, dan ketenangan dalam menjalani hari-harimu.<br /><br />
                Semoga semua yang sedang kamu perjuangkan di Solo dipermudah, dilancarkan, dan membawa hasil yang membanggakan untukmu.<br /><br />
                Aku akan selalu mendoakan yang terbaik untukmu, di mana pun kamu berada.
              </p>

              <p style={{ marginTop: "14px", fontSize: "20px", fontWeight: 600 }}>
                Happy Birthday.
              </p>
              <img
                src={`${import.meta.env.BASE_URL}images/Untitled design.gif`}
                alt="gif"
                style={{
                  width: "180px",
                  marginTop: "20px",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
                onError={(e) => {
                  console.error("GIF failed to load", e);
                  e.target.style.display = 'none';
                }}
              />

              <div
                style={{
                  marginTop: "22px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: "90px", height: "1px", background: "#e7d7dc" }} />
              </div>

              <p style={{ marginTop: "16px", color: "#8a747a", fontSize: "14px" }}>
                04 Juni
              </p>
            </div>

            <div
              style={{
                marginTop: "36px",
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => setPage(1)}
                style={secondaryButtonStyle(false)}
              >
                Back
              </button>

              <button
                onClick={() => setPage(0)}
                style={primaryButtonStyle(false)}
              >
                Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}