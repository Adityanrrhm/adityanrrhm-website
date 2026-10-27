# Design System: Neo-Brutalisme (Monochrome Minimalist) - Tailwind CSS Edition

Dokumen ini berisi panduan refactoring & gaya visual untuk merombak desain website portofolio yang sudah ada menggunakan **Tailwind CSS**. Mengusung tema **Neo-brutalisme Monochrome Minimalist (Sleek & Clean)**, sistem ini menggabungkan batas geometris yang tegas khas brutalme dengan warna monokrom profesional dan aksen **Electric Blue**.

---

## 1. Konfigurasi Tailwind (`tailwind.config.js`)

Tambahkan warna, bayangan (*shadow*), dan font kustom ke dalam berkas `tailwind.config.js` Anda agar kelas Neo-Brutalisme dapat digunakan dengan ringkas:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        canvas: '#F8F8F6',      // Background utama
        surface: '#FFFFFF',     // Card / Box background
        'neutral-soft': '#E5E5E1', // Gray background / Badge
        stroke: '#000000',      // Border & Text utama
        accent: '#0052FF',      // Electric Blue (CTA & Highlight)
        muted: '#4A4A4A',       // Teks deskripsi / tanggal
      },
      boxShadow: {
        // Hard solid shadows (tanpa blur)
        'neo-sm': '2px 2px 0px #000000',
        'neo': '4px 4px 0px #000000',
        'neo-lg': '6px 6px 0px #000000',
        'neo-xl': '8px 8px 0px #000000',
      },
      borderWidth: {
        '3': '3px',
      },
      fontFamily: {
        heading: ['Space Grotesk', 'Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

---

## 2. Peta Perubahan / Refactoring Guide

Gunakan tabel ini sebagai panduan cepat saat merombak komponen UI yang sudah ada:

| Elemen UI | Gaya Lama (Standar) | Gaya Neo-Brutalisme (Tailwind) |
| --- | --- | --- |
| **Canvas/Body** | `bg-gray-50 text-gray-800` | `bg-canvas text-stroke font-body` |
| **Kartu/Box** | `rounded-lg shadow-md border` | `border-3 border-stroke bg-surface shadow-neo-lg rounded-none` |
| **Tombol Utama** | `rounded-md bg-blue-600 hover:bg-blue-700` | `border-3 border-stroke bg-accent text-white font-bold uppercase shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-xl active:translate-x-1 active:translate-y-1 active:shadow-none rounded-none` |
| **Badge Skill** | `rounded-full bg-blue-100 text-blue-800` | `border-2 border-stroke bg-neutral-soft text-stroke font-bold uppercase rounded-none` |
| **Input Form** | `rounded-md border-gray-300 focus:ring` | `border-3 border-stroke bg-surface shadow-neo focus:bg-amber-50 focus:outline-none rounded-none` |

---

## 3. Komponen Tailwind siap pakai (`@layer components`)

Anda bisa memasukkan utilitas kustom berikut ke berkas CSS utama Anda (`globals.css` atau `main.css`) agar tidak perlu menulis ulang kelas Tailwind yang panjang di HTML/JSX:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  /* Tombol Utama (Electric Blue CTA) */
  .btn-neo-primary {
    @apply inline-block bg-accent text-white font-heading font-bold uppercase tracking-wider
           border-3 border-stroke shadow-neo transition-all duration-100
           hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg
           active:translate-x-1 active:translate-y-1 active:shadow-none
           px-6 py-3 cursor-pointer select-none;
  }

  /* Tombol Sekunder (Monochrome) */
  .btn-neo-secondary {
    @apply inline-block bg-surface text-stroke font-heading font-bold uppercase tracking-wider
           border-3 border-stroke shadow-neo transition-all duration-100
           hover:bg-neutral-soft hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg
           active:translate-x-1 active:translate-y-1 active:shadow-none
           px-6 py-3 cursor-pointer select-none;
  }

  /* Kartu Portofolio */
  .card-neo {
    @apply bg-surface border-3 border-stroke shadow-neo-lg p-6
           transition-all duration-150
           hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-xl;
  }

  /* Badge Skill / Tag */
  .badge-neo {
    @apply inline-block bg-neutral-soft text-stroke font-heading font-bold uppercase text-xs
           border-2 border-stroke px-3 py-1.5 mr-2 mb-2 select-none;
  }

  .badge-neo-active {
    @apply bg-accent text-white;
  }
}
```

---

## 4. Contoh Struktur HTML / JSX (Tailwind)

### Header & Navigation
```html
<header class="border-b-3 border-stroke bg-surface sticky top-0 z-50">
  <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
    <a href="#" class="font-heading font-black text-2xl tracking-tighter uppercase text-stroke">
      PORTFOLIO<span class="text-accent">.</span>
    </a>
    <nav class="flex gap-4">
      <a href="#projects" class="font-heading font-bold uppercase hover:underline py-2">Proyek</a>
      <a href="#contact" class="btn-neo-primary text-sm px-4 py-2">Kontak</a>
    </nav>
  </div>
</header>
```

### Hero Section
```html
<section class="max-w-6xl mx-auto px-4 py-16">
  <div class="border-3 border-stroke bg-surface p-8 md:p-12 shadow-neo-xl">
    <span class="badge-neo badge-neo-active mb-4">Available for Hire</span>
    <h1 class="font-heading font-black text-4xl md:text-6xl uppercase leading-tight mb-4">
      Halo, Saya <span class="bg-accent text-white px-2">Developer</span> & UI Designer
    </h1>
    <p class="text-muted text-lg max-w-2xl mb-8">
      Membangun aplikasi web berperforma tinggi dengan tampilan yang berani, bersih, dan fungsional.
    </p>
    <div class="flex flex-wrap gap-4">
      <a href="#projects" class="btn-neo-primary">Lihat Karya</a>
      <a href="#cv" class="btn-neo-secondary">Unduh CV</a>
    </div>
  </div>
</section>
```

### Project Card Grid
```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
  <!-- Card Proyek -->
  <div class="card-neo flex flex-col">
    <!-- Image Box -->
    <div class="w-full h-48 bg-neutral-soft border-3 border-stroke mb-4 overflow-hidden">
      <img src="/project-preview.jpg" alt="Project" class="w-full h-full object-cover">
    </div>
    <!-- Card Info -->
    <h3 class="font-heading font-bold text-xl uppercase mb-2">Aplikasi E-Commerce</h3>
    <p class="text-muted text-sm mb-4 flex-grow">
      Platform jual beli online dengan performa tinggi dan sistem pembayaran terintegrasi.
    </p>
    <!-- Badges -->
    <div class="mb-6">
      <span class="badge-neo">Next.js</span>
      <span class="badge-neo">Tailwind</span>
      <span class="badge-neo">TypeScript</span>
    </div>
    <!-- Action -->
    <a href="#" class="btn-neo-secondary text-center text-sm py-2">Detail Proyek →</a>
  </div>
</div>
```