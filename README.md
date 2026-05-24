<div align="center">

# Happy Birthday, Cindy.

<img src="https://readme-typing-svg.demolab.com?font=Pacifico&size=26&pause=1200&color=CFA7B3&center=true&vCenter=true&width=500&lines=04+Juni;for+Cindy" alt="Typing SVG" />

<br/>

[![Live](https://img.shields.io/badge/Open_Website-rfkyrhmnz.github.io-CFA7B3?style=for-the-badge&labelColor=fdf4f6)](https://rfkyrhmnz.github.io/how-birthday/)
&nbsp;
[![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=white&labelColor=20232a)](https://vitejs.dev/)

<br/>

*Dibuat pelan-pelan, untuk seseorang yang layak mendapatkannya.*

</div>

---

## Tentang

Website interaktif berbentuk scrapbook digital — dibuat sebagai hadiah ulang tahun untuk Cindy, 04 Juni. Berisi foto-foto, lirik lagu, dan beberapa kata yang rasanya pas untuk disampaikan.

---

## Alur

**Mini Game** — Kucing kecil yang harus melompati hadiah-hadiah sebelum masuk ke scrapbook. Skor target 10. Musik 8-bit dibuat dari Web Audio API.

**Halaman Welcome** — Desain koran vintage. Musik piano mengalir pelan di latar belakang.

**Halaman Lirik** — Lagu berjalan. Lirik muncul baris per baris, foto-foto polaroid menyebar perlahan di layar. Di akhir lirik, bunga-bunga kecil muncul dari belakang bingkai foto.

**Halaman Penutup** — Doa dan harapan. Itu saja.

---

## Tech Stack

| | |
|---|---|
| Framework | React + Vite |
| Styling | Vanilla CSS |
| Audio | Web Audio API (tanpa library eksternal) |
| Deployment | GitHub Pages |
| Assets | Compressed PNG + Animated WebP (~6.8 MB) |

---

## Beberapa Catatan Teknis

Background koran menggunakan filter `sepia(45%) hue-rotate(292deg)` — menggeser warna kertas dari kuning-coklat ke nuansa pink tanpa kehilangan tekstur kertas.

Foto di halaman lirik menggunakan `mix-blend-mode: multiply` dalam mode sinematik, sehingga menyatu dengan background koran daripada mengambang di atasnya.

Dekorasi bunga (*birthday blooms*) masing-masing memiliki CSS custom property `--px/--py` (titik asal dari center foto) dan `--ex/--ey` (posisi akhir di luar bingkai polaroid), sehingga animasinya terasa seperti muncul dari balik foto.

BGM halaman welcome di-generate via Web Audio API — chord C–Am–F–G, 76 BPM, loop setiap ~25 detik.

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

**04 Juni — Happy Birthday, Cindy.**

<br/>

</div>
