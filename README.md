<div align="center">

# 🎂 Happy Birthday, Cindy! 🎂

<img src="https://readme-typing-svg.demolab.com?font=Pacifico&size=28&pause=1000&color=CFA7B3&center=true&vCenter=true&width=600&lines=A+Birthday+Gift+Built+With+Love+%F0%9F%92%96;Happy+Birthday%2C+Cindy!+%F0%9F%8E%82;04+Juni+%E2%9C%A8" alt="Typing SVG" />

<br/>

[![Live Demo](https://img.shields.io/badge/🌸_Live_Demo-Visit_Website-CFA7B3?style=for-the-badge&labelColor=fdf4f6)](https://rfkyrhmnz.github.io/how-birthday/)
[![Made with Love](https://img.shields.io/badge/Made_with-💖_Love-e8b4c0?style=for-the-badge)](https://github.com/rfkyrhmnz)
[![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=white&labelColor=20232a)](https://vitejs.dev/)

<br/>

> *"Sebuah halaman kecil yang aku buat khusus untuk kamu.  
> Isinya sederhana, lembut, dan penuh rasa sayang untuk hari spesialmu."*

</div>

<br/>

## 🌸 &nbsp; What Is This?

A handcrafted, cinematic **birthday scrapbook website** built especially for **Cindy's birthday on 04 Juni** —
featuring a fully interactive experience with music, animations, polaroid photos, and a mini-game that you *have* to earn your way through. No skipping. (okay maybe a little 🐾)

<br/>

## 🎀 &nbsp; Features

### 🐈 &nbsp; Runner Mini-Game — *earn your way in*

> Before you get to see anything cute, you gotta work for it 😤

- Help a little cat jump over birthday gift boxes 🎁
- Difficulty **scales dynamically** — gets faster as score climbs
- **8-bit chiptune BGM** built from scratch using Web Audio API only
- SFX for everything: jump 🦘, hit 💥, win jingle 🎉, and a very dramatic **sad trombone** on 3 losses 📯😢
- After **3 losses** → surrender → answer a secret question to unlock the site 🔐
- Target: **10 gift boxes** to enter 🎊

<br/>

### 📰 &nbsp; Vintage Newspaper Landing Page — *first impressions*

> Feels like a handmade scrapbook someone left on your doorstep 📮

- **"The Morning Post Times"** aesthetic — sepia + pink hue filter
- Handwritten titles with **Pacifico** font
- Polaroid tape details 📎 & botanical branch doodles 🌿
- Fully responsive across mobile & desktop

<br/>

### 🎵 &nbsp; Lyric Sync Page — *the main act*

> Lyrics appear word-by-word, synced to the actual song timestamp 🎙️

- **5 polaroid photo cards** floating with organic per-card animations
- Cards **tilt naturally when idle**, then **straighten when you hover** 🖱️
- Cinematic camera panning between each photo — smooth S-curve easing 🎬
- Floating musical notes drift across the screen 🎶
- **Lightbox** on photo tap / click 🖼️
- Finale: full-screen photo slideshow fades in on the last lyric ✨

<br/>

### 🌸 &nbsp; Happy Birthday Finale — *the bloom*

> When the last lyric hits, things get dramatic (in a cute way)

- **16 flowers & hearts burst** from behind each polaroid card 💐
- Each decoration pops with a bouncy spring animation, then sways forever 🌊
- Full-screen cinematic background takes over

<br/>

### 💌 &nbsp; Closing Page — *the letter*

> The petals fall here. Literally.

- A heartfelt birthday wish / doa
- Personal animated photo (custom WebP)
- **16 rose petals** drift down the entire screen 🌹
- Back & Home navigation

<br/>

## 🛠️ &nbsp; Tech Stack

| | Tech | What it does |
|:--:|:--|:--|
| ⚛️ | React + Vite | Frontend framework & build tool |
| 🎨 | Vanilla CSS | All animations, layout, transitions |
| 🎵 | Web Audio API | Chiptune BGM & SFX — zero audio libraries |
| 📱 | dvh / safe-area-inset | iOS fullscreen & notch support |
| 🚀 | GitHub Pages | Deployment |

<br/>

## 🎨 &nbsp; Design at a Glance

```
 ✦  Vintage newspaper aesthetic — sepia + pink hue-rotate filter
 ✦  Pink & rose palette  →  #cfa7b3 · #f5d0dc · #8a747a
 ✦  Pacifico + Quicksand typography
 ✦  Polaroid photo cards with washi tape details
 ✦  Floating cards with per-card organic float animations
 ✦  Hover → card straightens; mouse leave → tilts back naturally
 ✦  mix-blend-mode: multiply for transparent GIF/WebP on any bg
 ✦  Compressed assets — ~6.8 MB total
 ✦  rel=preload + Promise.all loader → no visible asset rendering
```

<br/>

## 📁 &nbsp; Project Structure

```
how-birthday/
├── public/
│   ├── images/          # Photos, animated WebP, newspaper bg
│   └── music/           # Background track
├── src/
│   ├── App.jsx          # Main app — pages, game, audio, camera logic
│   ├── App.css          # All animations & styles (~1300 lines)
│   └── main.jsx
├── index.html           # Preload directives for all critical assets
└── vite.config.js
```

<br/>

## 🚀 &nbsp; Run Locally

```bash
git clone https://github.com/rfkyrhmnz/how-birthday.git
cd how-birthday
npm install
npm run dev
```

<br/>

---

<div align="center">

**Cindy** — on your birthday, 04 Juni 🎂

*Semoga kamu merasa tenang, bahagia, dan tahu kalau kamu sangat berarti.*

<br/>

**Happy Birthday! 💖**

<sub>Built with React, Vite & a lot of care 🌸</sub>

</div>
