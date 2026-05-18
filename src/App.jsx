import React, { useState, useRef, useEffect } from "react";
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

function pageCardStyle() {
  return {
    background: "rgba(255,255,255,0.96)",
    border: "1px solid #efe3e7",
    borderRadius: "32px",
    boxShadow: "0 12px 35px rgba(0,0,0,0.04)",
    padding: "40px",
    position: "relative",
    zIndex: 10,
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

  // Find photos that should be visible up to the current time
  const visiblePhotos = lyricsFinished
    ? photoData
    : photoData.filter((photo) => currentTime >= photo.time || maxTime >= photo.time);

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

      <div style={{ maxWidth: "1100px", width: "100%", margin: "0 auto", padding: "24px", position: "relative", zIndex: 10 }}>
        {page === 0 && (
          <div
            style={{
              ...pageCardStyle(),
              minHeight: "82vh",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "36px",
              alignItems: "center",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "#b38c97",
                }}
              >
                04 April
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
                    marginTop: "10px",
                    color: "#c69ca8",
                  }}
                >
                  Cindy.
                </span>
              </h1>

              <p
                style={{
                  marginTop: "24px",
                  maxWidth: "530px",
                  fontSize: "17px",
                  lineHeight: 1.9,
                  color: "#6d5a60",
                }}
              >
                Sebuah halaman kecil yang aku buat khusus untuk kamu. Isinya
                sederhana, lembut, dan penuh rasa sayang untuk hari spesialmu.
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
                  Buka
                </button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  width: "100%",
                  maxWidth: "390px",
                  background: "#faf4f6",
                  border: "1px solid #efe3e7",
                  borderRadius: "28px",
                  padding: "22px",
                }}
              >
                <div
                  style={{
                    background: "white",
                    border: "1px solid #eadde1",
                    borderRadius: "22px",
                    padding: "28px",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "#b38c97",
                    }}
                  >
                    For you
                  </p>

                  <h2
                    style={{
                      marginTop: "14px",
                      marginBottom: 0,
                      fontSize: "30px",
                      fontWeight: 500,
                    }}
                  >
                    on your special day
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
            {/* Faded Background Photos during Happy Birthday */}
            {currentLyricIndex === lyricsData.length - 1 && (
              <div className="cinematic-bg">
                {photoData.map((photo, i) => {
                  const bgStyles = [
                    { top: "-50px", left: "-100px", width: "40vw", minWidth: "300px", height: "40vw", minHeight: "300px" },
                    { top: "20px", right: "-120px", width: "35vw", minWidth: "250px", height: "35vw", minHeight: "250px" },
                    { bottom: "-80px", left: "10px", width: "45vw", minWidth: "350px", height: "45vw", minHeight: "350px" },
                    { bottom: "40px", right: "-60px", width: "38vw", minWidth: "280px", height: "38vw", minHeight: "280px" },
                    { top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "50vw", minWidth: "400px", height: "50vw", minHeight: "400px" },
                  ];
                  return (
                    <img 
                      key={`bg-${i}`} 
                      src={`${import.meta.env.BASE_URL}${photo.src.replace(/^\//, '')}`} 
                      className="bg-photo" 
                      style={{ ...bgStyles[i], animationDelay: `${i * 0.15}s` }} 
                      alt="" 
                    />
                  );
                })}
              </div>
            )}

            <div className="main-content" style={{ padding: 0, justifyContent: "center", position: "relative" }}>
            
            {/* Lyrics Layer (On top of photos) */}
            <div className="lyrics-overlay">
              <h2 className="lyric-text" key={currentLyricIndex}>
                {currentLyric}
              </h2>
            </div>

            {/* Photo Gallery Layer (Under lyrics) */}
            <div className="photo-gallery">
              {visiblePhotos.map((photo, index) => (
                <div
                  key={index}
                  className="photo-card"
                  style={{
                    animationDelay: `${(index % 5) * 0.1}s`,
                  }}
                >
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
              ))}
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
                  Halaman Selanjutnya
                </button>
              )}
            </div>
          </div>
          </>
        )}

        {page === 2 && (
          <div style={{ ...pageCardStyle(), textAlign: "center" }}>
            <div style={{ maxWidth: "680px", margin: "0 auto" }}>
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
                  fontSize: "17px",
                  lineHeight: 1.9,
                  color: "#6d5a60",
                }}
              >
                Semoga di setiap langkahmu, kamu selalu diberi kekuatan, kesabaran, dan ketenangan dalam menjalani hari-harimu.

                Semoga semua yang sedang kamu perjuangkan di Solo dipermudah, dilancarkan, dan membawa hasil yang membanggakan untukmu.

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
                04 April
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
                Kembali ke Lagu
              </button>

              <button
                onClick={() => setPage(0)}
                style={primaryButtonStyle(false)}
              >
                Kembali ke awal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}