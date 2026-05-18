<<<<<<< HEAD
import React, { useState, useRef, useEffect } from "react";
import "./App.css";

function primaryButtonStyle(disabled = false) {
  return {
    padding: "12px 24px",
=======
import React, { useEffect, useState } from "react";

const photos = [
  {
    src: `${import.meta.env.BASE_URL}images/😔.png`,
    caption: " ",
  },
  {
    src: `${import.meta.env.BASE_URL}images/😔 (1).png`,
    caption: " ",
  },
  {
    src: `${import.meta.env.BASE_URL}images/=.png`,
    caption: " ",
  },
];

function primaryButtonStyle(disabled = false, isMobile = false) {
  return {
    padding: isMobile ? "12px 20px" : "12px 24px",
>>>>>>> 9c1918e7236927e5a40b6bbd8e233596eda8babc
    borderRadius: "999px",
    border: "none",
    background: "#cfa7b3",
    color: "white",
<<<<<<< HEAD
    fontSize: "15px",
=======
    fontSize: isMobile ? "14px" : "15px",
>>>>>>> 9c1918e7236927e5a40b6bbd8e233596eda8babc
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.55 : 1,
    transition: "0.2s ease",
<<<<<<< HEAD
  };
}

function secondaryButtonStyle(disabled = false) {
  return {
    padding: "12px 24px",
=======
    width: isMobile ? "100%" : "auto",
  };
}

function secondaryButtonStyle(disabled = false, isMobile = false) {
  return {
    padding: isMobile ? "12px 20px" : "12px 24px",
>>>>>>> 9c1918e7236927e5a40b6bbd8e233596eda8babc
    borderRadius: "999px",
    border: "1px solid #e7d7dc",
    background: "white",
    color: "#7e6168",
<<<<<<< HEAD
    fontSize: "15px",
=======
    fontSize: isMobile ? "14px" : "15px",
>>>>>>> 9c1918e7236927e5a40b6bbd8e233596eda8babc
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.55 : 1,
    transition: "0.2s ease",
<<<<<<< HEAD
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
    }
  }, [page]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Find the current lyric based on time
  const currentLyricIndex = lyricsData.findIndex((lyric, index) => {
    const nextLyricTime = lyricsData[index + 1]?.time || Infinity;
    return currentTime >= lyric.time && currentTime < nextLyricTime;
  });

  const currentLyric =
    currentLyricIndex !== -1 ? lyricsData[currentLyricIndex].text : "";

  // Find photos that should be visible up to the current time
  const visiblePhotos = photoData.filter((photo) => currentTime >= photo.time);

  return (
    <div className="app-container">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src="/music/shape-of-my-heart.mp3"
        onTimeUpdate={handleTimeUpdate}
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
=======
    width: isMobile ? "100%" : "auto",
  };
}

function pageCardStyle(isMobile) {
  return {
    background: "rgba(255,255,255,0.96)",
    border: "1px solid #efe3e7",
    borderRadius: isMobile ? "22px" : "32px",
    boxShadow: "0 12px 35px rgba(0,0,0,0.04)",
    padding: isMobile ? "22px" : "40px",
  };
}

function indicator(page, currentPage) {
  return {
    height: "8px",
    width: currentPage === page ? "28px" : "8px",
    borderRadius: "999px",
    background: currentPage === page ? "#cfa7b3" : "#ead8de",
    transition: "0.2s ease",
  };
}

function Navigation({ page, totalPages, onPrev, onNext, isMobile }) {
  return (
    <div
      style={{
        marginTop: "40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "14px",
        flexWrap: "wrap",
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      <button
        onClick={onPrev}
        disabled={page === 0}
        style={secondaryButtonStyle(page === 0, isMobile)}
      >
        Sebelumnya
      </button>

      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {Array.from({ length: totalPages }).map((_, i) => (
          <div key={i} style={indicator(i, page)} />
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={page === totalPages - 1}
        style={primaryButtonStyle(page === totalPages - 1, isMobile)}
      >
        Selanjutnya
      </button>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState(0);
  const totalPages = 4;
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #fcf8f9 0%, #faf4f6 100%)",
        padding: isMobile ? "14px" : "24px",
        boxSizing: "border-box",
        fontFamily: "'Quicksand', sans-serif",
        color: "#4f3d42",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {page === 0 && (
          <div
            style={{
              ...pageCardStyle(isMobile),
              minHeight: isMobile ? "auto" : "82vh",
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(auto-fit, minmax(300px, 1fr))",
              gap: isMobile ? "24px" : "36px",
>>>>>>> 9c1918e7236927e5a40b6bbd8e233596eda8babc
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
<<<<<<< HEAD
                04 Juni
=======
                04 Juni 2005
>>>>>>> 9c1918e7236927e5a40b6bbd8e233596eda8babc
              </p>

              <h1
                style={{
                  marginTop: "18px",
                  marginBottom: 0,
<<<<<<< HEAD
                  fontSize: "clamp(42px, 7vw, 72px)",
                  lineHeight: 1.08,
=======
                  fontSize: isMobile ? "38px" : "clamp(42px, 7vw, 72px)",
                  lineHeight: isMobile ? 1.15 : 1.08,
>>>>>>> 9c1918e7236927e5a40b6bbd8e233596eda8babc
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
<<<<<<< HEAD
                  fontSize: "17px",
=======
                  fontSize: isMobile ? "15px" : "17px",
>>>>>>> 9c1918e7236927e5a40b6bbd8e233596eda8babc
                  lineHeight: 1.9,
                  color: "#6d5a60",
                }}
              >
                Sebuah halaman kecil yang aku buat khusus untuk kamu. Isinya
                sederhana, lembut, dan penuh rasa sayang untuk hari spesialmu.
              </p>

              <div style={{ marginTop: "32px" }}>
                <button
                  onClick={() => setPage(1)}
<<<<<<< HEAD
                  style={primaryButtonStyle(false)}
=======
                  style={primaryButtonStyle(false, isMobile)}
>>>>>>> 9c1918e7236927e5a40b6bbd8e233596eda8babc
                >
                  Buka
                </button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  width: "100%",
<<<<<<< HEAD
                  maxWidth: "390px",
                  background: "#faf4f6",
                  border: "1px solid #efe3e7",
                  borderRadius: "28px",
                  padding: "22px",
=======
                  maxWidth: isMobile ? "100%" : "390px",
                  background: "#faf4f6",
                  border: "1px solid #efe3e7",
                  borderRadius: isMobile ? "22px" : "28px",
                  padding: isMobile ? "16px" : "22px",
>>>>>>> 9c1918e7236927e5a40b6bbd8e233596eda8babc
                }}
              >
                <div
                  style={{
                    background: "white",
                    border: "1px solid #eadde1",
<<<<<<< HEAD
                    borderRadius: "22px",
                    padding: "28px",
=======
                    borderRadius: isMobile ? "18px" : "22px",
                    padding: isMobile ? "20px" : "28px",
>>>>>>> 9c1918e7236927e5a40b6bbd8e233596eda8babc
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
<<<<<<< HEAD
                      fontSize: "30px",
=======
                      fontSize: isMobile ? "24px" : "30px",
>>>>>>> 9c1918e7236927e5a40b6bbd8e233596eda8babc
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
<<<<<<< HEAD
=======
                      fontSize: isMobile ? "15px" : "16px",
>>>>>>> 9c1918e7236927e5a40b6bbd8e233596eda8babc
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
<<<<<<< HEAD
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
                      src={photo.src} 
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
=======
          <div style={pageCardStyle(isMobile)}>
            <div style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "#b38c97",
                }}
              >
                A little note
              </p>

              <h2
                style={{
                  marginTop: "18px",
                  marginBottom: 0,
                  fontSize: isMobile ? "32px" : "clamp(30px, 5vw, 52px)",
                  fontWeight: 600,
                }}
              >
                <span style={{ fontFamily: "'Pacifico', cursive" }}>
                  Untuk kamu
                </span>
              </h2>

              <p
                style={{
                  marginTop: "24px",
                  fontSize: isMobile ? "15px" : "17px",
                  lineHeight: 1.9,
                  color: "#6d5a60",
                }}
              >
                Selamat ulang tahun. Terima kasih sudah hadir di hidupku dan
                menjadi salah satu bagian paling indah di dalamnya. Aku
                bersyukur bisa punya banyak cerita, tawa, dan kenangan bareng
                kamu.
              </p>

              <p
                style={{
                  marginTop: "16px",
                  fontSize: isMobile ? "15px" : "17px",
                  lineHeight: 1.9,
                  color: "#6d5a60",
                }}
              >
                Di umurmu yang baru, aku berharap kamu selalu sehat, tenang,
                dan dikelilingi banyak hal baik. Aku bangga sama semua usaha
                dan perjuanganmu, dan aku akan selalu mendukung kamu.
              </p>
            </div>

            <div
              style={{
                marginTop: "42px",
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "20px",
              }}
            >
              {photos.map((photo, index) => (
                <div
                  key={index}
                  style={{
                    background: "#faf7f8",
                    border: "1px solid #efe3e7",
                    borderRadius: "24px",
                    padding: "12px",
>>>>>>> 9c1918e7236927e5a40b6bbd8e233596eda8babc
                  }}
                >
                  <img
                    src={photo.src}
<<<<<<< HEAD
                    alt={`Memory ${index + 1}`}
                    onClick={() => { setLightboxSrc(photo.src); setLightboxIndex(index); }}
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
=======
                    alt={photo.caption}
                    style={{
                      width: "100%",
                      height: isMobile ? "220px" : "280px",
                      objectFit: "cover",
                      borderRadius: "18px",
                      display: "block",
                    }}
                  />
                  <p
                    style={{
                      marginTop: "14px",
                      marginBottom: "4px",
                      textAlign: "center",
                      color: "#7a666d",
                    }}
                  >
                    {photo.caption}
                  </p>
>>>>>>> 9c1918e7236927e5a40b6bbd8e233596eda8babc
                </div>
              ))}
            </div>

<<<<<<< HEAD
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
=======
            <Navigation
              page={page}
              totalPages={totalPages}
              onPrev={() => setPage(0)}
              onNext={() => setPage(2)}
              isMobile={isMobile}
            />
          </div>
        )}

        {page === 2 && (
          <div style={pageCardStyle(isMobile)}>
            <div style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "#b38c97",
                }}
              >
                Our video
              </p>

              <h2
                style={{
                  marginTop: "18px",
                  marginBottom: 0,
                  fontSize: isMobile ? "32px" : "clamp(30px, 5vw, 52px)",
                  fontWeight: 600,
                }}
              >
                <span style={{ fontFamily: "'Pacifico', cursive" }}>
                  Our Moment
                </span>
              </h2>

              <p
                style={{
                  marginTop: "24px",
                  fontSize: isMobile ? "15px" : "17px",
                  lineHeight: 1.9,
                  color: "#6d5a60",
                }}
              >
                21 - 03 - 2026, Murakabe 🍜😋
              </p>
            </div>

            <div
              style={{
                marginTop: "36px",
                maxWidth: isMobile ? "100%" : "360px",
                marginLeft: "auto",
                marginRight: "auto",
                background: "#faf7f8",
                border: "1px solid #efe3e7",
                borderRadius: isMobile ? "22px" : "28px",
                padding: isMobile ? "10px" : "14px",
              }}
            >
              <video
                controls
                style={{
                  width: "100%",
                  aspectRatio: "9 / 16",
                  objectFit: "cover",
                  borderRadius: isMobile ? "16px" : "20px",
                  background: "#000",
                  display: "block",
                }}
              >
                <source
                  src={`${import.meta.env.BASE_URL}videos/IMG_7966 (1).mp4`}
                  type="video/mp4"
                />
                Browser kamu tidak mendukung video.
              </video>
            </div>

            <Navigation
              page={page}
              totalPages={totalPages}
              onPrev={() => setPage(1)}
              onNext={() => setPage(3)}
              isMobile={isMobile}
            />
          </div>
        )}

        {page === 3 && (
          <div style={{ ...pageCardStyle(isMobile), textAlign: "center" }}>
>>>>>>> 9c1918e7236927e5a40b6bbd8e233596eda8babc
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
<<<<<<< HEAD
                  fontSize: "clamp(30px, 5vw, 52px)",
=======
                  fontSize: isMobile ? "32px" : "clamp(30px, 5vw, 52px)",
>>>>>>> 9c1918e7236927e5a40b6bbd8e233596eda8babc
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
<<<<<<< HEAD
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
                src="/images/Untitled design.gif"
                alt="gif"
                style={{
                  width: "180px",
                  marginTop: "20px",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
                onError={(e) => e.target.style.display = 'none'}
=======
                  fontSize: isMobile ? "15px" : "17px",
                  lineHeight: 1.9,
                  color: "#6d5a60",
                  whiteSpace: "pre-line",
                }}
              >
                {`Semoga di setiap langkahmu, kamu selalu diberi kekuatan, kesabaran, dan ketenangan dalam menjalani hari-harimu.

Semoga semua yang sedang kamu perjuangkan di Solo dipermudah, dilancarkan, dan membawa hasil yang membanggakan untukmu.

Aku akan selalu mendoakan yang terbaik untukmu, di mana pun kamu berada.`}
              </p>

              <p style={{ marginTop: "14px", fontSize: isMobile ? "18px" : "20px", fontWeight: 600 }}>
                Happy Birthday.
              </p>

              <img
                src={`${import.meta.env.BASE_URL}images/Untitled design.gif`}
                alt="gif"
                style={{
                  width: isMobile ? "130px" : "180px",
                  marginTop: "20px",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
>>>>>>> 9c1918e7236927e5a40b6bbd8e233596eda8babc
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
<<<<<<< HEAD
                04 Juni
=======
                04 Juni 2005
>>>>>>> 9c1918e7236927e5a40b6bbd8e233596eda8babc
              </p>
            </div>

            <div
              style={{
                marginTop: "36px",
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                flexWrap: "wrap",
<<<<<<< HEAD
              }}
            >
              <button
                onClick={() => setPage(1)}
                style={secondaryButtonStyle(false)}
              >
                Kembali ke Lagu
=======
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <button
                onClick={() => setPage(2)}
                style={secondaryButtonStyle(false, isMobile)}
              >
                Sebelumnya
>>>>>>> 9c1918e7236927e5a40b6bbd8e233596eda8babc
              </button>

              <button
                onClick={() => setPage(0)}
<<<<<<< HEAD
                style={primaryButtonStyle(false)}
=======
                style={primaryButtonStyle(false, isMobile)}
>>>>>>> 9c1918e7236927e5a40b6bbd8e233596eda8babc
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