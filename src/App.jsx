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
    borderRadius: "999px",
    border: "none",
    background: "#cfa7b3",
    color: "white",
    fontSize: isMobile ? "14px" : "15px",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.55 : 1,
    transition: "0.2s ease",
    width: isMobile ? "100%" : "auto",
  };
}

function secondaryButtonStyle(disabled = false, isMobile = false) {
  return {
    padding: isMobile ? "12px 20px" : "12px 24px",
    borderRadius: "999px",
    border: "1px solid #e7d7dc",
    background: "white",
    color: "#7e6168",
    fontSize: isMobile ? "14px" : "15px",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.55 : 1,
    transition: "0.2s ease",
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
                04 Juni 2005
              </p>

              <h1
                style={{
                  marginTop: "18px",
                  marginBottom: 0,
                  fontSize: isMobile ? "38px" : "clamp(42px, 7vw, 72px)",
                  lineHeight: isMobile ? 1.15 : 1.08,
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
                  fontSize: isMobile ? "15px" : "17px",
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
                  style={primaryButtonStyle(false, isMobile)}
                >
                  Buka
                </button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  width: "100%",
                  maxWidth: isMobile ? "100%" : "390px",
                  background: "#faf4f6",
                  border: "1px solid #efe3e7",
                  borderRadius: isMobile ? "22px" : "28px",
                  padding: isMobile ? "16px" : "22px",
                }}
              >
                <div
                  style={{
                    background: "white",
                    border: "1px solid #eadde1",
                    borderRadius: isMobile ? "18px" : "22px",
                    padding: isMobile ? "20px" : "28px",
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
                      fontSize: isMobile ? "24px" : "30px",
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
                      fontSize: isMobile ? "15px" : "16px",
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
                  }}
                >
                  <img
                    src={photo.src}
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
                </div>
              ))}
            </div>

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
                  fontSize: isMobile ? "32px" : "clamp(30px, 5vw, 52px)",
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
                04 Juni 2005
              </p>
            </div>

            <div
              style={{
                marginTop: "36px",
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                flexWrap: "wrap",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <button
                onClick={() => setPage(2)}
                style={secondaryButtonStyle(false, isMobile)}
              >
                Sebelumnya
              </button>

              <button
                onClick={() => setPage(0)}
                style={primaryButtonStyle(false, isMobile)}
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