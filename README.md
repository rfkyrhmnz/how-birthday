<div align="center">

<br/>

```
H A P P Y   B I R T H D A Y
```

**04 Juni — for Cindy**

<br/>

[![Live](https://img.shields.io/badge/Live-rfkyrhmnz.github.io%2Fhow--birthday-c9a0b0?style=flat-square)](https://rfkyrhmnz.github.io/how-birthday/)
&nbsp;
[![React](https://img.shields.io/badge/React-Vite-61DAFB?style=flat-square&logo=react&logoColor=white&labelColor=20232a)](https://vitejs.dev/)
&nbsp;
[![GitHub Pages](https://img.shields.io/badge/Deployed-GitHub%20Pages-222?style=flat-square&logo=github)](https://pages.github.com/)

</div>

---

A small website, built quietly, for someone's birthday.

Nothing too grand — just a scrapbook of moments, a song, and a few words that felt right to say.

---

## Pages

**Runner Game** — A short mini-game before entering. Jump over the obstacles to unlock the scrapbook. The cat faces right, as it should.

**Welcome** — Newspaper aesthetic. The date. A button that opens everything.

**Lyrics** — A song plays. Words appear line by line. Photos surface slowly. When it ends, small flowers bloom around the frames.

**Closing** — A few honest words. Nothing more.

---

## Stack

| | |
|---|---|
| Framework | React + Vite |
| Styling | Vanilla CSS, custom animations |
| Audio | Web Audio API — no libraries |
| Deployment | GitHub Pages |
| Images | Compressed PNG + WebP (~6.8 MB total) |

---

## Design Notes

The background is a crumpled newspaper image filtered with `sepia → hue-rotate(292deg)` to give it a warm pink tone without losing the paper texture.

Photos use `mix-blend-mode: multiply` when in cinematic background mode — so they blend into the paper rather than float above it.

Bloom decorations animate from each photo's center outward, landing just outside the polaroid frame. Sixteen in total.

The romantic piano BGM on the welcome page is generated entirely via Web Audio API — C–Am–F–G, 76 BPM, looped every ~25 seconds.

---

## Run Locally

```bash
git clone https://github.com/rfkyrhmnz/how-birthday.git
cd how-birthday
npm install
npm run dev
```

---

<div align="center">

<br/>

*Made for 04 Juni.*

<br/>

</div>
