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

// ─────────────────────────────────────────────────────────────────────
// 🎛️  LYRIC DATA — edit animasi per kalimat di sini
//
//  wordPop   : durasi pop-in tiap kata (ms). Kecil = cepat.
//  stagger   : jeda antar kata (ms). Kecil = lebih serempak.
//  floatCycles: berapa kali teks naik-turun. 0 = diam.
//  floatMs   : durasi 1 siklus naik-turun (ms).
// ─────────────────────────────────────────────────────────────────────
const lyricsData = [
  {
    time: 0,
    text: "I'm lookin' back on things I've done",
    wordPop: 900, stagger: 110, floatCycles: 2, floatMs: 4000,
  },
  {
    time: 5.7,
    text: "I never wanna play the same old part",
    wordPop: 750, stagger: 90, floatCycles: 2, floatMs: 4000,
  },
  {
    time: 11.5,
    text: "I'll keep you in the dark",
    wordPop: 1100, stagger: 150, floatCycles: 1, floatMs: 5000,
  },
  {
    time: 14.5,
    text: "Now let me show you the shape of my heart",
    wordPop: 700, stagger: 80, floatCycles: 2, floatMs: 3500,
  },
  {
    time: 19.0,
    text: "Happy Birthday! 💖",
    wordPop: 1200, stagger: 200, floatCycles: 0, floatMs: 4000,
  },
];

const photoData = [
  { time: 1, src: "/images/Untitled design (83).png" },
  { time: 5, src: "/images/Untitled design (85).png" },
  { time: 9, src: "/images/Untitled design (87).png" },
  { time: 13, src: "/images/Untitled design (86).png" },
  { time: 17, src: "/images/Untitled design (84).png" },
];

function RunnerGame({ onComplete, onSurrender }) {
  const [isJumping, setIsJumping] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [obstaclePos, setObstaclePos] = useState(100);
  const [loseCount, setLoseCount] = useState(0);
  const [showSurrenderModal, setShowSurrenderModal] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [isShaking, setIsShaking] = useState(false); // B
  const [trailParticles, setTrailParticles] = useState([]); // E

  const gameLoopRef = useRef(null);
  const audioCtxRef = useRef(null);
  const prevScoreRef = useRef(0);
  const trailTimerRef = useRef(null); // E

  // Game difficulty (speed increases as score gets higher)
  const currentSpeed = 1.6 + (score * 0.3);
  const maxScore = 10;

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  const playJumpSound = () => {
    if (!audioCtxRef.current) return;
    const osc = audioCtxRef.current.createOscillator();
    const gainNode = audioCtxRef.current.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(400, audioCtxRef.current.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtxRef.current.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.1, audioCtxRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtxRef.current.currentTime + 0.1);
    osc.connect(gainNode);
    gainNode.connect(audioCtxRef.current.destination);
    osc.start();
    osc.stop(audioCtxRef.current.currentTime + 0.1);
  };

  const playHitSound = () => {
    if (!audioCtxRef.current) return;
    const osc = audioCtxRef.current.createOscillator();
    const gainNode = audioCtxRef.current.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, audioCtxRef.current.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, audioCtxRef.current.currentTime + 0.2);
    gainNode.gain.setValueAtTime(0.1, audioCtxRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtxRef.current.currentTime + 0.2);
    osc.connect(gainNode);
    gainNode.connect(audioCtxRef.current.destination);
    osc.start();
    osc.stop(audioCtxRef.current.currentTime + 0.2);
  };

  const playWinSound = () => {
    if (!audioCtxRef.current) return;
    const osc = audioCtxRef.current.createOscillator();
    const gainNode = audioCtxRef.current.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, audioCtxRef.current.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, audioCtxRef.current.currentTime + 0.1); // E5
    osc.frequency.setValueAtTime(783.99, audioCtxRef.current.currentTime + 0.2); // G5
    gainNode.gain.setValueAtTime(0.1, audioCtxRef.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.5);
    osc.connect(gainNode);
    gainNode.connect(audioCtxRef.current.destination);
    osc.start();
    osc.stop(audioCtxRef.current.currentTime + 0.5);
  };

  // 😢 Dramatic defeat music — classic sad trombone "wah wah wah wahhhh"
  const playDefeatSound = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    // Sad trombone descending notes: Bb4 → A4 → Ab4 → F3 (the classic loser sequence)
    const notes = [
      { freq: 466.16, t: 0.0,  dur: 0.42 },  // Bb4  "wah"
      { freq: 440.00, t: 0.40, dur: 0.42 },  // A4   "wah"
      { freq: 415.30, t: 0.78, dur: 0.42 },  // Ab4  "wah"
      { freq: 174.61, t: 1.15, dur: 1.60 },  // F3   "wahhhhhh" (long, low, defeated)
    ];

    notes.forEach(({ freq, t, dur }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // Vibrato LFO — gives the "trombone wobble"
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = "sine";
      lfo.frequency.value = 5.5;
      lfoGain.gain.value = freq * 0.018; // ~1.8% pitch wobble
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      // Sawtooth = brassy trombone timbre
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, now + t);
      // Slight portamento downward at end of each note (sad slide)
      osc.frequency.linearRampToValueAtTime(freq * 0.97, now + t + dur);

      // Envelope: quick attack, held, soft release
      gainNode.gain.setValueAtTime(0, now + t);
      gainNode.gain.linearRampToValueAtTime(0.18, now + t + 0.06);
      gainNode.gain.setValueAtTime(0.16, now + t + dur - 0.12);
      gainNode.gain.linearRampToValueAtTime(0, now + t + dur);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(now + t);
      osc.stop(now + t + dur + 0.05);
      lfo.start(now + t);
      lfo.stop(now + t + dur + 0.05);
    });

    // Bass drum hit at the start — emphasizes the moment of defeat
    const noise = ctx.createOscillator();
    const noiseGain = ctx.createGain();
    noise.type = "sine";
    noise.frequency.setValueAtTime(120, now);
    noise.frequency.exponentialRampToValueAtTime(30, now + 0.25);
    noiseGain.gain.setValueAtTime(0.5, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.35);

    // Low reverb swell underneath the melody — dramatic depth
    const swell = ctx.createOscillator();
    const swellGain = ctx.createGain();
    swell.type = "sine";
    swell.frequency.value = 87; // low E — ominous
    swellGain.gain.setValueAtTime(0, now);
    swellGain.gain.linearRampToValueAtTime(0.12, now + 0.8);
    swellGain.gain.linearRampToValueAtTime(0.08, now + 2.0);
    swellGain.gain.linearRampToValueAtTime(0, now + 3.0);
    swell.connect(swellGain);
    swellGain.connect(ctx.destination);
    swell.start(now);
    swell.stop(now + 3.1);
  };

  const bgmRef = useRef(null);

  // Chiptune melody: a cheerful looping 8-bit tune using Web Audio API
  const startBgm = () => {
    if (!audioCtxRef.current) return;
    if (bgmRef.current) return; // already playing

    const ctx = audioCtxRef.current;
    // Notes in Hz: a simple happy loop (C D E G A pattern)
    const melody = [
      523.25, 587.33, 659.25, 783.99, 880,
      783.99, 659.25, 587.33, 523.25, 523.25,
      659.25, 783.99, 880, 1046.5, 880,
      783.99, 659.25, 523.25
    ];
    const noteDuration = 0.13; // seconds per note
    let noteIndex = 0;
    let startTime = ctx.currentTime;

    const scheduleNote = () => {
      if (!bgmRef.current) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      const freq = melody[noteIndex % melody.length];
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.04, startTime);
      gain.gain.setValueAtTime(0.04, startTime + noteDuration * 0.7);
      gain.gain.linearRampToValueAtTime(0, startTime + noteDuration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + noteDuration);
      noteIndex++;
      startTime += noteDuration;
      bgmRef.current = setTimeout(scheduleNote, (startTime - ctx.currentTime) * 1000 - 20);
    };

    bgmRef.current = setTimeout(scheduleNote, 0);
  };

  const stopBgm = () => {
    if (bgmRef.current) {
      clearTimeout(bgmRef.current);
      bgmRef.current = null;
    }
  };

  const jump = () => {
    initAudio();
    if (!gameStarted) {
      setGameStarted(true);
      setGameOver(false);
      setScore(0);
      setObstaclePos(100);
      startBgm();
      return;
    }
    if (isJumping || gameOver) return;

    setIsJumping(true);
    playJumpSound();

    setTimeout(() => {
      setIsJumping(false);
    }, 450); // Shorter jump, requires better timing
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault(); // Prevent scrolling
        jump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isJumping, gameOver, gameStarted]);

  useEffect(() => {
    if (gameStarted && !gameOver && score < maxScore) {
      gameLoopRef.current = setInterval(() => {
        setObstaclePos((prev) => {
          if (prev <= -10) {
            setScore(s => {
              const newScore = s + 1;
              if (newScore >= maxScore) {
                stopBgm();
                playWinSound();
                setTimeout(() => onComplete(), 1500);
              }
              return newScore;
            });
            return 100;
          }
          return prev - currentSpeed;
        });
      }, 20);
    }
    return () => clearInterval(gameLoopRef.current);
  }, [gameStarted, gameOver, score, currentSpeed]);

  // Collision detection
  useEffect(() => {
    if (obstaclePos > 8 && obstaclePos < 28 && !isJumping) {
      stopBgm();
      setGameOver(true);
      setGameStarted(false);
      playHitSound();
      
      // Vibrate device on hit (for mobile users)
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([150, 80, 250]); // short buzz, pause, long buzz
      }
      
      // B: screen shake on hit
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 420);
      setLoseCount(prev => {
        const next = prev + 1;
        if (next >= 3) {
          setShowSurrenderModal(true);
          setTimeout(() => playDefeatSound(), 300);
        }
        return next;
      });
    }
  }, [obstaclePos, isJumping]);

  // E: cat trail particles while running
  useEffect(() => {
    const colors = ['#ffb3c6','#ffd6e0','#f9c6d4','#e8d5f0','#cfa7b3'];
    if (gameStarted && !gameOver && score < maxScore) {
      trailTimerRef.current = setInterval(() => {
        setTrailParticles(prev => [
          ...prev.slice(-7),
          { id: Date.now(), size: 4 + Math.random() * 5, color: colors[Math.floor(Math.random() * colors.length)] },
        ]);
        setTimeout(() => setTrailParticles(p => p.slice(1)), 420);
      }, 65);
    } else {
      clearInterval(trailTimerRef.current);
      setTrailParticles([]);
    }
    return () => clearInterval(trailTimerRef.current);
  }, [gameStarted, gameOver, score]);

  // Cleanup bgm on unmount
  useEffect(() => {
    return () => stopBgm();
  }, []);

  // A: Confetti burst on each successful jump (score increase)
  useEffect(() => {
    if (score > prevScoreRef.current && score > 0) {
      const colors = ['#ff9eb5','#ffd6e0','#ffb3c6','#f9c6d4','#ffe0b3','#d4b8e0'];
      const particles = Array.from({ length: 10 }, (_, i) => ({
        id: `${Date.now()}-${i}`,
        angle: i * 36,
        color: colors[i % colors.length],
        size: 6 + (i % 3) * 3,
      }));
      setConfetti(particles);
      setTimeout(() => setConfetti([]), 900);
    }
    prevScoreRef.current = score;
  }, [score]);

  return (
    <div
      className="page-card-enter scrapbook-card"
      style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto", padding: "40px", cursor: "pointer", userSelect: "none", position: "relative" }}
      onClick={showSurrenderModal ? undefined : jump}
    >
      <div className="scrapbook-tape-tl"></div>
      <div className="scrapbook-tape-br"></div>

      <p style={{ margin: 0, fontSize: "12px", letterSpacing: "0.28em", textTransform: "uppercase", color: "#b38c97" }}>
        Mini Game
      </p>
      <h2 style={{ fontFamily: "'Pacifico', cursive", fontSize: "32px", color: "#cfa7b3", margin: "10px 0 15px" }}>
        Bantu Kucing Berlari! 🐈
      </h2>
      <p style={{ color: "#8a747a", marginBottom: "30px", fontSize: "15px" }}>
        {score >= maxScore ? "Yeay berhasil! Tunggu sebentar... 🎉" : `Makin lama makin cepat lho! Lewati ${maxScore} kado!`}
      </p>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <div style={{ background: "#ffeaef", padding: "8px 24px", borderRadius: "20px", fontWeight: "bold", color: "#cfa7b3", fontSize: "18px" }}>
          Score: {score} / {maxScore}
          {loseCount > 0 && (
            <span style={{ marginLeft: "12px", fontSize: "13px", color: "#e07a8f" }}>
              💔 {loseCount}/3
            </span>
          )}
        </div>
      </div>

      <div
        className={`runner-container ${isShaking ? 'runner-shaking' : ''}`}
        style={{ position: "relative", width: "100%", height: "clamp(130px, 28vw, 200px)", borderBottom: "4px solid #f0e1e5", overflow: "hidden", borderRadius: "8px", background: "linear-gradient(to bottom, #fdf9fa 0%, #fff 100%)" }}
      >
        {/* D: Animated moving clouds */}
        <div className="runner-cloud-layer">
          <span className="runner-cloud-item">☁️</span>
          <span className="runner-cloud-item">☁️</span>
          <span className="runner-cloud-item">☁️</span>
        </div>

        {/* E: Cat trail dots */}
        {trailParticles.map((p, i) => (
          <div
            key={p.id}
            className="cat-trail-dot"
            style={{
              width: p.size,
              height: p.size,
              background: p.color,
              bottom: isJumping ? `${20 + (trailParticles.length - i) * 4}px` : '8px',
              left: `calc(15% - ${(trailParticles.length - i) * 9}px)`,
              transition: 'bottom 0.08s ease',
            }}
          />
        ))}

        {/* Cat */}
        <div
          className={`runner-cat ${isJumping ? 'jumping' : ''} ${gameOver ? 'hit' : ''}`}
          style={{
            position: "absolute",
            bottom: "0px",
            left: "15%",
            fontSize: "60px",
            lineHeight: 1,
            zIndex: 10
          }}
        >
          {gameOver ? "\uD83D\uDE40" : (score >= maxScore ? "\uD83D\uDE3B" : "\uD83D\uDC08")}
        </div>

        {/* A: Confetti burst at cat position */}
        {confetti.map(p => (
          <div
            key={p.id}
            className="game-confetti"
            style={{
              '--angle': `${p.angle}deg`,
              '--bg': p.color,
              width: `${p.size}px`,
              height: `${p.size}px`,
              position: 'absolute',
              bottom: '38px',
              left: '20%',
              zIndex: 25,
            }}
          />
        ))}

        {/* Obstacle Gift */}
        {gameStarted && !gameOver && score < maxScore && (
          <div
            style={{
              position: "absolute",
              bottom: "0px",
              left: `${obstaclePos}%`,
              fontSize: "50px",
              lineHeight: 1,
              zIndex: 5
            }}
          >
            🎁
          </div>
        )}

        {/* Status Overlay */}
        {(!gameStarted || gameOver) && score < maxScore && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.7)", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", zIndex: 20 }}>
            <h3 style={{ margin: 0, color: gameOver ? "#e74c3c" : "#cfa7b3", fontSize: "24px" }}>
              {gameOver ? "Aduh Nabrak Kado! 💥" : "Siap?"}
            </h3>
            <p style={{ margin: "10px 0 0", color: "#8a747a", fontWeight: "bold" }}>Tap untuk mulai berlari</p>
          </div>
        )}
      </div>

      {/* ── Surrender Modal ── */}
      {showSurrenderModal && (
        <div
          style={{
            position: "absolute", inset: 0,
            background: "rgba(253, 240, 244, 0.96)",
            backdropFilter: "blur(6px)",
            borderRadius: "inherit",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: "16px", zIndex: 50, padding: "32px",
          }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ fontSize: "48px" }}>😿</div>
          <h3 style={{ fontFamily: "'Pacifico', cursive", color: "#cfa7b3", margin: 0, fontSize: "22px" }}>
            Sudah 3 kali kalah...
          </h3>
          <p style={{ color: "#8a747a", margin: 0, fontSize: "14px", lineHeight: 1.6, textAlign: "center" }}>
            Masih mau coba lagi, atau menyerah aja?
          </p>
          <div style={{ display: "flex", gap: "12px", marginTop: "8px", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={() => {
                setShowSurrenderModal(false);
                setGameOver(false);
                setGameStarted(false);
                setScore(0);
                setObstaclePos(100);
                setLoseCount(0);
              }}
              style={secondaryButtonStyle()}
            >
              Tidak, coba lagi! 💪
            </button>
            <button
              onClick={() => onSurrender()}
              style={{ ...primaryButtonStyle(), background: "#e07a8f" }}
            >
              Menyerah 🏳️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Question Page — unlocks main content with correct answer ──
function QuestionPage({ onCorrect }) {
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("idle"); // idle | wrong | shake
  const [attempts, setAttempts] = useState(0);

  const hints = [
    "Petunjuk: ada di judul halaman utama. 😉",
    "Petunjuk: namanya ada 5 huruf, diawali C. 🌸",
    "Petunjuk: nama lengkapnya Cindy... (hampir ketauan 😅)",
  ];

  const handleSubmit = () => {
    const clean = answer.trim().toLowerCase();
    // Accept: cindy, 4 juni, 04 juni
    const correct = ["cindy", "4 juni", "04 juni", "4juni", "04juni"].includes(clean);
    if (correct) {
      setStatus("correct");
      setTimeout(() => onCorrect(), 1200);
    } else {
      setStatus("shake");
      setAttempts(a => a + 1);
      setTimeout(() => setStatus("wrong"), 400);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div
      className="page-card-enter scrapbook-card"
      style={{
        textAlign: "center", maxWidth: "560px", margin: "0 auto",
        padding: "clamp(28px, 6vw, 52px) clamp(24px, 6vw, 52px)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "20px",
      }}
    >
      <div className="scrapbook-tape-tl"></div>
      <div className="scrapbook-tape-br"></div>

      <div style={{ fontSize: "40px" }}>🔐</div>

      <p style={{ margin: 0, fontSize: "11px", letterSpacing: "0.26em", textTransform: "uppercase", color: "#b38c97" }}>
        Satu pertanyaan terakhir
      </p>

      <h2 style={{
        fontFamily: "'Pacifico', cursive", color: "#cfa7b3",
        margin: 0, fontSize: "clamp(20px, 5vw, 28px)", lineHeight: 1.3,
      }}>
        Siapa nama yang berulang tahun di website ini?
      </h2>

      <p style={{ margin: 0, fontSize: "13px", color: "#a88a92", lineHeight: 1.6 }}>
        Jawab dengan benar untuk membuka website-nya. 🌸
      </p>

      <div style={{ width: "100%", maxWidth: "320px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <input
          type="text"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Tulis jawabanmu..."
          style={{
            padding: "12px 18px",
            borderRadius: "12px",
            border: `2px solid ${status === "wrong" || status === "shake" ? "#e07a8f" : status === "correct" ? "#7ec8a0" : "#f0dde3"}`,
            fontSize: "15px",
            fontFamily: "'Quicksand', sans-serif",
            outline: "none",
            textAlign: "center",
            background: "#fff",
            color: "#5a4248",
            transition: "border-color 0.3s ease",
            animation: status === "shake" ? "shakeInput 0.35s ease" : "none",
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            ...primaryButtonStyle(status === "correct"),
            background: status === "correct" ? "#7ec8a0" : "linear-gradient(135deg, #d4a0b0, #cfa7b3)",
          }}
        >
          {status === "correct" ? "Benar! ✓ Membuka..." : "Jawab →"}
        </button>
      </div>

      {/* Wrong answer feedback */}
      {status === "wrong" && (
        <p style={{ margin: 0, color: "#e07a8f", fontSize: "13px" }}>
          Hmm, bukan itu... {attempts < hints.length ? hints[attempts - 1] : "Coba lagi ya! 💪"}
        </p>
      )}
    </div>
  );
}

const fadeAudio = (audioElement, targetVolume, durationMs) => {
  if (!audioElement) return;
  const startVolume = audioElement.volume;
  const startTime = performance.now();

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / durationMs, 1);
    audioElement.volume = startVolume + (targetVolume - startVolume) * progress;
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else if (targetVolume === 0) {
      audioElement.pause();
    }
  };
  requestAnimationFrame(animate);
};

export default function App() {
  const [page, setPage] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [maxTime, setMaxTime] = useState(0);
  const [lyricsFinished, setLyricsFinished] = useState(false);
  const audioRef = useRef(null);
  const introAudioRef = useRef(null);
  const parallaxBgRef = useRef(null);

  // Precise, fluid parallax based on mouse / device orientation
  useEffect(() => {
    if (page !== 1) return;

    let rafId;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      targetX = -x * 25; // max 25px offset
      targetY = -y * 25;
    };

    const handleDeviceOrientation = (e) => {
      if (e.gamma === null || e.beta === null) return;
      const gamma = Math.max(-45, Math.min(45, e.gamma));
      const beta = Math.max(-45, Math.min(45, e.beta - 45)); // Assumed 45deg base tilt
      targetX = -(gamma / 45) * 15;
      targetY = -(beta / 45) * 15;
    };

    const animate = () => {
      // Lerp for buttery smooth fluid movement
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      
      if (parallaxBgRef.current) {
        parallaxBgRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("deviceorientation", handleDeviceOrientation);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
      cancelAnimationFrame(rafId);
    };
  }, [page]);

  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [fadeTransition, setFadeTransition] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false); // G
  const [audioDuration, setAudioDuration] = useState(30);  // I
  const [audioBlocked, setAudioBlocked] = useState(false); // iOS autoplay block workaround


  // Remove HTML loader only after ALL images are loaded — no visible rendering
  useEffect(() => {
    const loader = document.getElementById('html-loader');
    if (!loader) return;

    let tid;
    let cancelled = false;

    const srcs = [
      ...photoData.map(p => `${import.meta.env.BASE_URL}${p.src.replace(/^\//, '')}`),
      `${import.meta.env.BASE_URL}images/cute_cloud.png`,
      `${import.meta.env.BASE_URL}images/Untitled design.webp`,
      `${import.meta.env.BASE_URL}images/crumpled_pink_newspaper.png`,
    ];

    const promises = srcs.map(src => new Promise(resolve => {
      const img = new Image();
      img.onload = img.onerror = resolve; // resolve on both — never hang on broken image
      img.src = src;
    }));

    // Safety timeout: hide loader after 6s max even if some images fail
    const maxWait = setTimeout(() => {
      if (!cancelled) { loader.style.opacity = '0'; tid = setTimeout(() => loader.remove(), 650); }
    }, 6000);

    Promise.all(promises).then(() => {
      if (cancelled) return;
      clearTimeout(maxWait);
      loader.style.opacity = '0';
      tid = setTimeout(() => loader.remove(), 650);
    });

    return () => {
      cancelled = true;
      clearTimeout(tid);
      clearTimeout(maxWait);
    };
  }, []);

  // Preload all images (secondary pass — ensures browser cache is warm)
  useEffect(() => {
    const imagesToPreload = [
      ...photoData.map(p => p.src),
      '/images/cute_cloud.png',
    ];
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = `${import.meta.env.BASE_URL}${src.replace(/^\//, '')}`;
    });
  }, []);


  // Handle audio crossfades
  useEffect(() => {
    if (page === 0) {
      if (introAudioRef.current) {
        introAudioRef.current.volume = 0;
        introAudioRef.current.currentTime = 0;
        introAudioRef.current.play().then(() => {
          fadeAudio(introAudioRef.current, 1.0, 2000); // 2s fade in
        }).catch(e => console.error("Intro auto-play failed:", e));
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setCurrentTime(0);
      setMaxTime(0);
      setLyricsFinished(false);
      setAudioBlocked(false);
    } else if (page === 1) {
      if (introAudioRef.current && !introAudioRef.current.paused && introAudioRef.current.volume > 0) {
        // Fallback if they jump directly to page 1 somehow
        introAudioRef.current.pause();
      }
      
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.currentTime = 0;
        audioRef.current.volume = 1.0;
        audioRef.current.play().catch(e => {
          console.error("Auto-play failed:", e);
          setAudioBlocked(true); // Tampilkan tombol play manual
        });
      }
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

  const currentLyricData =
    currentLyricIndex !== -1 ? lyricsData[currentLyricIndex] : null;
  const currentLyric = currentLyricData?.text ?? "";

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

  // ── 3D Card Tilt — CSS-var approach (no inline transform, no conflict) ────
  // JS updates --tilt-x/--tilt-y via setProperty directly on the DOM element.
  // CSS hover rules include these vars, so position+tilt are one unified transform.
  const handleCardPointerMove = (e) => {
    if (e.pointerType !== 'mouse') return; // ignore touch/stylus — no glitch on mobile
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const rx = -(((e.clientY - rect.top)  / rect.height) - 0.5) * 24; // ±12°
    const ry =  (((e.clientX - rect.left) / rect.width)  - 0.5) * 24; // ±12°
    el.style.setProperty('--tilt-x', `${rx}deg`);
    el.style.setProperty('--tilt-y', `${ry}deg`);
  };

  const handleCardPointerLeave = (e) => {
    if (e.pointerType !== 'mouse') return;
    e.currentTarget.style.removeProperty('--tilt-x');
    e.currentTarget.style.removeProperty('--tilt-y');
  };

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
      return { transform: "scale(1) translate3d(0px, 0px, 0)" };
    }

    const isMobile = typeof window !== "undefined" && window.innerWidth <= 600;

    // Only translate + scale — NO rotation (rotation in transform chain causes
    // non-linear interpolation path which looks janky).
    // Variety via scale: each shot feels slightly closer/farther.
    const shots = isMobile ? [
      { x:  70, y:  40, scale: 1.55 },
      { x: -65, y:  48, scale: 1.50 },
      { x:  55, y: -56, scale: 1.60 },
      { x: -60, y: -62, scale: 1.52 },
      { x:   0, y: -10, scale: 1.45 },
    ] : [
      { x:  240, y:  70, scale: 1.22 },
      { x: -220, y:  90, scale: 1.17 },
      { x:  200, y: -110, scale: 1.26 },
      { x: -210, y: -130, scale: 1.19 },
      { x:    0, y:  -20, scale: 1.13 },
    ];

    const s = shots[focusIndex] || { x: 0, y: 0, scale: 1.15 };
    return {
      transform: `scale(${s.scale}) translate3d(${s.x}px, ${s.y}px, 0)`
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
      {/* Parallax outer: TRANSFORM only (GPU layer, no filter = no repaint) */}
      <div 
        ref={parallaxBgRef}
        className="parallax-bg"
      >
        {/* Inner: FILTER only (static, never animated) */}
        <div
          className="parallax-bg-inner"
          style={{
            backgroundImage: `url(${import.meta.env.BASE_URL}images/crumpled_pink_newspaper.png)`,
          }}
        />
      </div>
      {/* Audio Element */}
      <audio
        ref={introAudioRef}
        src={`${import.meta.env.BASE_URL}music/intro.MP3`}
        preload="auto"
        loop
      />
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}music/shape-of-my-heart.mp3`}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setAudioDuration(audioRef.current?.duration || 30)}
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

      {/* Faded Background Photos during Happy Birthday */}
      {page === 1 && currentLyricIndex === lyricsData.length - 1 && (
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

      <div className="content-scaler">
        {page === -1 && (
          <RunnerGame
            onComplete={() => setPage(0)}
            onSurrender={() => setPage(-2)}
          />
        )}

        {page === -2 && (
          <QuestionPage onCorrect={() => setPage(0)} />
        )}

        {page === 0 && (
          <div
            className="page-card-enter scrapbook-card"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              width: "100%",
              padding: "clamp(24px, 5vw, 52px) clamp(20px, 6vw, 56px)",
              position: "relative",
            }}
          >
            {/* Scrapbook Tapes */}
            <div className="scrapbook-tape-tl"></div>
            <div className="scrapbook-tape-br"></div>

            {/* H: Postal stamp badge replaced with square animated GIF/Webp */}
            <div title="04 Juni" className="polaroid-stamp">
              <img 
                src={`${import.meta.env.BASE_URL}Untitled design (3).gif`} 
                alt="Stamp GIF"
              />
            </div>

            {/* Corner star decorations */}
            <svg className="doodle-star" width="36" height="36" viewBox="0 0 40 40" fill="none" stroke="#d1b1bb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ top: '22px', right: '28px', transform: 'rotate(20deg)' }}>
              <path d="M20 5 L20 35 M5 20 L35 20 M10 10 L30 30 M10 30 L30 10" />
            </svg>
            <svg className="doodle-star" width="28" height="28" viewBox="0 0 40 40" fill="none" stroke="#e4c8d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ top: '22px', left: '28px', transform: 'rotate(-12deg)', opacity: 0.7 }}>
              <path d="M20 5 L20 35 M5 20 L35 20 M10 10 L30 30 M10 30 L30 10" />
            </svg>

            {/* Botanical branch bottom-left */}
            <svg className="botanical-branch" width="70" height="110" viewBox="0 0 60 100" fill="none" stroke="#d1b1bb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ bottom: '16px', left: '16px', transform: 'rotate(10deg)', opacity: 0.6 }}>
              <path d="M30 100 Q 30 50, 45 0" />
              <path d="M30 80 Q 15 70, 10 50 Q 20 50, 30 70" />
              <path d="M32 60 Q 50 50, 55 30 Q 40 30, 35 50" />
              <path d="M35 40 Q 20 30, 15 10 Q 30 15, 38 30" />
            </svg>

            {/* Date badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
              <div style={{ width: "36px", height: "1px", background: "linear-gradient(to right, transparent, #d4b8c0)" }} />
              <p style={{ margin: 0, fontSize: "11px", letterSpacing: "0.32em", textTransform: "uppercase", color: "#b38c97", fontWeight: 500 }}>
                04 Juni
              </p>
              <div style={{ width: "36px", height: "1px", background: "linear-gradient(to left, transparent, #d4b8c0)" }} />
            </div>

            {/* Main title — font unchanged */}
            <h1
              className="welcome-title"
              style={{
                margin: 0,
                fontSize: "clamp(32px, 7vw, 72px)",
                lineHeight: 1.3,
                fontWeight: 600,
              }}
            >
              <span style={{ fontFamily: "'Pacifico', cursive" }}>
                Happy Birthday,
              </span>
              <span
                className="welcome-name shimmer-cindy"
                style={{
                  display: "block",
                  marginTop: "8px",
                  fontFamily: "'Pacifico', cursive",
                  fontSize: "clamp(40px, 12vw, 82px)",
                  fontWeight: 400,
                  lineHeight: 1.4,
                  letterSpacing: "2px",
                  paddingBottom: "0.2em", // Prevent descender clipping on 'y'
                }}
              >
                Cindy
              </span>
            </h1>

            {/* Ornamental divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", margin: "22px 0 18px", width: "100%", maxWidth: "340px" }}>
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, #e4c8d0)" }} />
              <span style={{ color: "#cfa7b3", fontSize: "16px", lineHeight: 1 }}>♡</span>
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, #e4c8d0)" }} />
            </div>

            {/* Description */}
            <p style={{
              maxWidth: "360px",
              fontSize: "clamp(13px, 3.5vw, 15px)",
              lineHeight: 1.95,
              color: "#8a747a",
              fontStyle: "italic",
              margin: "0 0 28px",
            }}>
              Hadiah kecil khusus buat kamu. Semoga suka ya! ✨
            </p>

            {/* Open button — G: animate envelope before navigating */}
            <button
              className="open-btn-glow"
              onClick={() => {
                // Crossfade: Fade out Intro, Fade in Main
                if (introAudioRef.current) {
                  fadeAudio(introAudioRef.current, 0, 1300);
                }
                
                if (audioRef.current) {
                  audioRef.current.volume = 0;
                  audioRef.current.currentTime = 0; // Sync to beginning
                  audioRef.current.play().catch(() => {});
                  fadeAudio(audioRef.current, 1.0, 1300);
                }

                setEnvelopeOpen(true);
                setTimeout(() => {
                  setEnvelopeOpen(false);
                  setPage(1);
                  setCurrentTime(0);
                  setMaxTime(0);
                  setLyricsFinished(false);
                  // audioRef already crossfaded and playing!
                }, 1300);
              }}
              style={{
                padding: "13px 40px",
                borderRadius: "999px",
                border: "none",
                background: "linear-gradient(135deg, #d4a0b0, #cfa7b3)",
                color: "white",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "0.08em",
                boxShadow: "0 6px 24px rgba(207,167,179,0.35)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 10px 30px rgba(207,167,179,0.45)"; }}
              onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = "0 6px 24px rgba(207,167,179,0.35)"; }}
            >
              Open ✉
            </button>

            {/* For you card — horizontal strip at bottom, hidden on mobile */}
            <div className="for-you-card mobile-visible" style={{ width: "100%", marginTop: "16px" }}>
              <div style={{
                background: "linear-gradient(135deg, #fdf6f8 0%, #fff 100%)",
                border: "1px solid #f0e1e5",
                borderRadius: "14px",
                padding: "clamp(10px, 2vw, 20px) clamp(12px, 3vw, 28px)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                textAlign: "left",
              }}>
                <div style={{ fontSize: "22px", flexShrink: 0 }}>🌸</div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#b38c97" }}>For you</p>
                  <p style={{ margin: "3px 0 0", fontSize: "clamp(11px, 2.8vw, 15px)", lineHeight: 1.55, color: "#6d5a60" }}>
                    on your <span style={{ fontFamily: "'Pacifico', cursive", color: "#cfa7b3", fontWeight: 400 }}>special</span> day —{" "}
                    Wishing you the absolute best! May this year be filled with good health, growth, and everything you deserve.
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

            {/* Fallback overlay if browser blocks autoplay (especially iOS) */}
            {audioBlocked && (
              <div style={{
                position: "absolute", zIndex: 9999, inset: 0,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                background: "rgba(253, 240, 244, 0.8)",
                backdropFilter: "blur(4px)",
                padding: "20px"
              }}>
                <p style={{ fontFamily: "'Quicksand', sans-serif", color: "#b38c97", marginBottom: "20px", textAlign: "center", fontSize: "16px", fontWeight: "500" }}>
                  Browser kamu membutuhkan izin untuk memutar lagu 🌸
                </p>
                <button
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.play().then(() => setAudioBlocked(false)).catch(e => console.error("Play failed", e));
                    }
                  }}
                  style={{
                    padding: "14px 28px",
                    borderRadius: "999px",
                    border: "none",
                    background: "linear-gradient(135deg, #d4a0b0, #cfa7b3)",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 6px 24px rgba(207,167,179,0.35)",
                  }}
                >
                  Mulai Putar Lagu 🎵
                </button>
              </div>
            )}

            <div className="main-content" style={{ padding: 0, justifyContent: "center", position: "relative" }}>
              {/* Lyrics Layer (On top of photos) */}
              <div className="lyrics-overlay" style={getLyricStyle()}>
                <h2
                  className="lyric-text"
                  key={currentLyricIndex}
                  style={currentLyricData?.floatCycles > 0 ? {
                    animation: `floatLyrics ${currentLyricData.floatMs}ms ease-in-out ${currentLyricData.floatCycles} forwards`
                  } : {}}
                >
                  {currentLyric ? (
                    currentLyric.split(" ").map((word, i) => (
                      <span
                        key={i}
                        className="word-span"
                        style={{
                          animationDelay: `${i * (currentLyricData?.stagger ?? 110)}ms`,
                          animationDuration: `${currentLyricData?.wordPop ?? 900}ms`,
                        }}
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
                      style={{ animationDelay: `${(index % 5) * 0.1}s` }}
                      onPointerMove={handleCardPointerMove}
                      onPointerLeave={handleCardPointerLeave}
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

                {/* Birthday Bloom Decorations — placed AFTER photos, nth-child intact.
                    --px/--py = photo center (burst start), --ex/--ey = final pos outside frame */}
                {lyricsFinished && (
                  <div className="birthday-blooms">
                    {/* Photo 1 center(-240,-70) → blooms to left/top-left/above */}
                    <span className="bloom bloom-1" style={{ "--px": "-240px", "--py": "-70px", "--ex": "-385px", "--ey": "-70px", "--delay": "0s" }}>🌸</span>
                    <span className="bloom bloom-2" style={{ "--px": "-240px", "--py": "-70px", "--ex": "-348px", "--ey": "-210px", "--delay": "0.08s" }}>🌿</span>
                    <span className="bloom bloom-3" style={{ "--px": "-240px", "--py": "-70px", "--ex": "-238px", "--ey": "-215px", "--delay": "0.16s" }}>💖</span>

                    {/* Photo 2 center(220,-90) → blooms to right/top-right/above */}
                    <span className="bloom bloom-4" style={{ "--px": "220px", "--py": "-90px", "--ex": "360px", "--ey": "-90px", "--delay": "0.05s" }}>🌷</span>
                    <span className="bloom bloom-5" style={{ "--px": "220px", "--py": "-90px", "--ex": "325px", "--ey": "-225px", "--delay": "0.12s" }}>🍃</span>
                    <span className="bloom bloom-6" style={{ "--px": "220px", "--py": "-90px", "--ex": "218px", "--ey": "-232px", "--delay": "0.20s" }}>💫</span>

                    {/* Photo 3 center(-200,110) → blooms to left/bottom-left/below */}
                    <span className="bloom bloom-7" style={{ "--px": "-200px", "--py": "110px", "--ex": "-338px", "--ey": "110px", "--delay": "0.10s" }}>🌺</span>
                    <span className="bloom bloom-8" style={{ "--px": "-200px", "--py": "110px", "--ex": "-308px", "--ey": "252px", "--delay": "0.18s" }}>💐</span>
                    <span className="bloom bloom-9" style={{ "--px": "-200px", "--py": "110px", "--ex": "-198px", "--ey": "262px", "--delay": "0.26s" }}>🌸</span>

                    {/* Photo 4 center(210,130) → blooms to right/bottom-right/below */}
                    <span className="bloom bloom-10" style={{ "--px": "210px", "--py": "130px", "--ex": "348px", "--ey": "130px", "--delay": "0.07s" }}>🌼</span>
                    <span className="bloom bloom-11" style={{ "--px": "210px", "--py": "130px", "--ex": "318px", "--ey": "270px", "--delay": "0.15s" }}>💕</span>
                    <span className="bloom bloom-12" style={{ "--px": "210px", "--py": "130px", "--ex": "208px", "--ey": "278px", "--delay": "0.23s" }}>🌿</span>

                    {/* Photo 5 center(0,-20) → blooms in gaps between photos */}
                    <span className="bloom bloom-13" style={{ "--px": "0px", "--py": "-20px", "--ex": "0px", "--ey": "-168px", "--delay": "0.30s" }}>✨</span>
                    <span className="bloom bloom-14" style={{ "--px": "0px", "--py": "-20px", "--ex": "0px", "--ey": "152px", "--delay": "0.36s" }}>🌸</span>
                    <span className="bloom bloom-15" style={{ "--px": "0px", "--py": "-20px", "--ex": "-150px", "--ey": "-20px", "--delay": "0.42s" }}>💖</span>
                    <span className="bloom bloom-16" style={{ "--px": "0px", "--py": "-20px", "--ex": "158px", "--ey": "-20px", "--delay": "0.48s" }}>🌷</span>
                  </div>
                )}
              </div>


              {/* I: Song progress bar */}
              <div className="lyric-progress-bar">
                <div
                  className="lyric-progress-fill"
                  style={{ width: `${Math.min((currentTime / audioDuration) * 100, 100)}%` }}
                />
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
          <div className="page-card-enter scrapbook-card closing-page" style={{ textAlign: "center" }}>
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
                Selamat ulang tahun, Cindy.<br /><br />
                Semoga tahun ini lebih ringan dari sebelumnya — bukan berarti tanpa tantangan, tapi karena kamu sudah lebih tahu cara menghadapinya.<br /><br />
                Semoga apa yang sedang kamu perjuangkan di Solo perlahan menemukan jalannya. Dan di sela-sela itu semua, semoga kamu masih punya waktu untuk beristirahat dan merasa cukup.<br /><br />
                Kamu layak untuk semua hal baik yang sedang menuju ke arahmu.
              </p>

              <p style={{ marginTop: "14px", fontSize: "20px", fontWeight: 600 }}>
                Happy Birthday.
              </p>
              <img
                className="closing-gif"
                src={`${import.meta.env.BASE_URL}images/Untitled design.webp`}
                alt="gif"
                style={{
                  width: "180px",
                  marginTop: "20px",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                  mixBlendMode: "multiply",   /* white areas → transparent */
                  background: "transparent",
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

      {/* Falling petals — only on closing page */}
      {page === 2 && (
        <div className="closing-petals-bg" aria-hidden="true">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="closing-petal" />
          ))}
        </div>
      )}

      {/* H: Floating sakura — only on landing page */}
      {page === 0 && (
        <div className="landing-sakura-bg" aria-hidden="true">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="landing-petal" />
          ))}
        </div>
      )}

      {/* G: Envelope open animation overlay */}
      {envelopeOpen && (
        <div className="envelope-overlay" aria-hidden="true">
          <span className="envelope-icon">✉️</span>
        </div>
      )}
    </div>
  );
}
