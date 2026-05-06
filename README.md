# Zen Board

Zen Board adalah aplikasi web produktivitas berbasis React yang dirancang untuk membantu pengguna tetap fokus, tenang, dan terorganisir dalam menjalankan aktivitas sehari-hari. Aplikasi ini menggabungkan manajemen tugas, Pomodoro timer, dan statistik harian dalam satu tampilan yang sederhana dan elegan.

---

## 🎯 Tujuan Aplikasi

Zen Board dikembangkan untuk:

* Membantu pengguna mengelola tugas secara efektif
* Meningkatkan fokus menggunakan teknik Pomodoro
* Melacak progres harian melalui statistik sederhana
* Memberikan pengalaman penggunaan yang nyaman dan tidak berisik secara visual

---

## 🧩 Fitur Utama

### 1. Landing Page & Login

* Landing page sebagai halaman awal aplikasi
* Login sederhana untuk menyimpan sesi pengguna
* Data pengguna disimpan secara lokal menggunakan localStorage
* Tidak menggunakan sistem autentikasi kompleks (simulasi)

---

### 2. Dashboard (Zen Workspace)

Setelah login, pengguna masuk ke halaman utama yang terdiri dari:

* Tampilan sapaan dinamis (Good morning / evening)
* Informasi tanggal saat ini
* Ringkasan tugas harian

---

### 3. Manajemen Tugas (Tasks)

#### Fitur:

* Menambahkan tugas baru dengan:

  * Judul
  * Tanggal
  * Kategori (Work, Study, Personal)
  * Prioritas (High, Medium, Low)
* Mengedit tugas secara langsung (inline edit)
* Menandai tugas sebagai selesai
* Menghapus tugas
* Pencarian tugas secara real-time
* Filter berdasarkan:

  * Kategori
  * Status (All, Active, Completed)

#### Tampilan:

* Desain berbasis card dengan sudut membulat
* Indikator warna berdasarkan prioritas
* Badge kategori
* Tugas selesai ditampilkan dengan efek fade dan strikethrough

---

### 4. Pomodoro Timer

#### Fitur:

* Mode fokus (25 menit)
* Mode istirahat (5 menit)
* Tombol:

  * Mulai
  * Pause
  * Reset
* Perpindahan otomatis antara fokus dan istirahat
* Indikator sesi Pomodoro harian
* Animasi halus selama timer berjalan
* Notifikasi suara menggunakan Web Audio API

---

### 5. Daily Statistics

Menampilkan statistik dalam bentuk grid:

* ✅ Selesai Hari Ini
* 📋 Sisa Tugas
* 🍅 Pomodoro Hari Ini
* 🔥 Hari Beruntun (Streak)

#### Fitur tambahan:

* Perhitungan streak berdasarkan aktivitas harian
* Statistik diperbarui secara real-time
* Tampilan minimal tanpa grafik kompleks

---

### 6. Halaman Statistics

Menampilkan ringkasan produktivitas secara keseluruhan:

* Total tugas dibuat
* Total tugas selesai
* Total Pomodoro
* Best streak
* Distribusi tugas berdasarkan kategori
* Distribusi tugas berdasarkan prioritas

---

### 7. Dark Mode & Light Mode

* Toggle tema gelap dan terang
* Disimpan di localStorage (`zenboard-darkmode`)
* Transisi warna halus (smooth transition)
* Menggunakan palet warna “Zen” (soft, tidak kontras tinggi)

---

## 🎨 Desain & UI

Zen Board menggunakan pendekatan desain:

* Minimalis dan profesional
* Warna lembut (sage green, dusty tones, neutral)
* Layout terstruktur:

  * Sidebar navigasi
  * Main content
* Card-based UI dengan spacing luas
* Animasi ringan dan tidak mengganggu

---

## 💾 Penyimpanan Data

Semua data disimpan menggunakan **localStorage**, termasuk:

* `zenboard-user` → data pengguna aktif
* `zenboard-tasks` → daftar tugas
* `zenboard-darkmode` → preferensi tema
* `zenboard-streak` → data streak harian
* `zenboard-pomodoros` → jumlah sesi Pomodoro per hari

### Karakteristik:

* Data persisten selama tidak dihapus browser
* Tidak membutuhkan backend
* Bekerja secara offline

---

## ⚙️ Arsitektur Aplikasi

Aplikasi menggunakan struktur modular:

### Components:

* Header
* TaskPanel
* TaskForm
* TaskItem
* TaskFilters
* PomodoroTimer
* DailyStats

### Hooks:

* useTasks → manajemen CRUD tugas
* usePomodoro → logika timer dan sesi fokus
* useStats → perhitungan statistik dan streak

---

## ⚠️ Keterbatasan

Karena berbasis frontend-only:

* Tidak ada sinkronisasi antar perangkat
* Data hanya tersimpan di browser pengguna
* Tidak ada sistem autentikasi yang aman
* Tidak mendukung kolaborasi multi-user

---

## 🚀 Kesimpulan

Zen Board adalah aplikasi produktivitas yang mengutamakan:

* Kesederhanaan
* Fokus
* Kenyamanan visual
* Kemudahan penggunaan

Dengan menggabungkan task management, Pomodoro timer, dan statistik dalam satu workspace, Zen Board memberikan pengalaman kerja yang lebih terarah tanpa kompleksitas yang berlebihan.

Aplikasi ini juga menjadi fondasi yang baik untuk pengembangan lebih lanjut ke arah backend, real-time sync, atau fitur kolaborasi di masa depan.
