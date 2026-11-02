# DOKUMENTASI TEKNIS SISTEM RESERVASI JASA KONSTRUKSI "MAXIMAL CONSTRUCTION"
**Kajian Penerapan Kontrol Keamanan Berbasis OWASP Top 10:2021**

---

### A. IDENTITAS SISTEM

1. **Tujuan Sistem (2-3 Kalimat):**  
   Sistem Informasi Reservasi Jasa Konstruksi "Maximal Construction" adalah platform berbasis web yang dirancang untuk memfasilitasi pemesanan, penjadwalan survei, dan pemantauan progres pengerjaan proyek konstruksi secara transparan antara klien dan kontraktor. Sistem ini mempublikasikan portofolio proyek dan katalog layanan sekaligus menyediakan portal interaktif bagi pelanggan untuk mengelola reservasi dan memberikan testimoni. Selain itu, sistem dilengkapi dengan panel administrator terpusat untuk memvalidasi transaksi, mengelola data master, serta mengaudit seluruh aktivitas operasional dan keamanan secara berkala.

2. **Fitur Utama Berdasarkan Kelompok Akses:**
   * **Pengguna Publik (Tanpa Autentikasi):**
     * Menjelajahi beranda profil perusahaan, nilai layanan, dan pencapaian proyek ([frontend/src/pages/public/Beranda.jsx:L55-L408](file:///d:/Data%20Bapak/maximal-construction/frontend/src/pages/public/Beranda.jsx#L55-L408)).
     * Melihat katalog layanan aktif beserta deskripsinya ([backend/routes/api.php:L28-L29](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L28-L29)).
     * Menjelajahi galeri portofolio proyek dengan penyaringan kategori ([backend/routes/api.php:L24-L25](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L24-L25)).
     * Membaca testimoni pelanggan yang telah disetujui/tidak ditandai ([backend/routes/api.php:L30](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L30)).
     * Melakukan pendaftaran akun pelanggan baru ([backend/routes/api.php:L18-L19](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L18-L19)).
     * Melakukan autentikasi masuk pelanggan ([backend/routes/api.php:L20-L21](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L20-L21)) atau login administrator via portal khusus ([backend/routes/api.php:L22-L23](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L22-L23)).
   * **Pengguna Terdaftar (Klien / User):**
     * Mengakses dasbor pribadi untuk melihat ringkasan status reservasi aktif ([frontend/src/App.jsx:L48](file:///d:/Data%20Bapak/maximal-construction/frontend/src/App.jsx#L48)).
     * Mengajukan reservasi jasa konstruksi baru dengan memilih jenis layanan, alamat lokasi, dan catatan khusus ([backend/routes/api.php:L41-L42](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L41-L42)).
     * Melihat riwayat seluruh reservasi miliknya ([backend/routes/api.php:L40](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L40)).
     * Memantau detail perkembangan status reservasi (tanggal survei, estimasi biaya, tanggal pengerjaan, alasan pembatalan) ([backend/routes/api.php:L43](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L43)).
     * Memberikan rating dan testimoni untuk proyek reservasi yang statusnya telah dinyatakan selesai ([backend/routes/api.php:L44](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L44)).
     * Mengubah data profil diri (nama, telepon, alamat) ([backend/routes/api.php:L36](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L36)) dan memperbarui kata sandi ([backend/routes/api.php:L37](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L37)).
     * Melakukan logout dan pembatalan token autentikasi ([backend/routes/api.php:L38](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L38)).
   * **Administrator (Admin):**
     * Mengakses dasbor analitik utama (ringkasan total reservasi, proyek, layanan, testimoni, dan log aktivitas terbaru) ([backend/routes/api.php:L66](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L66)).
     * Mengelola status reservasi (menetapkan tanggal survei, kalkulasi estimasi biaya, estimasi tanggal kerja, atau membatalkan reservasi) ([backend/routes/api.php:L51-L55](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L51-L55)).
     * Mengelola data portofolio proyek beserta galeri visual (tambah, perbarui gambar, hapus) ([backend/routes/api.php:L56-L59](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L56-L59)).
     * Mengelola katalog layanan jasa konstruksi (tambah, edit, aktifkan/nonaktifkan, hapus dengan proteksi integritas) ([backend/routes/api.php:L61-L65](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L61-L65)).
     * Mengelola moderasi testimoni klien (melihat testimoni berstatus normal maupun ditandai spam/kasar, membalas ulasan, menghapus testimoni) ([backend/routes/api.php:L72-L75](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L72-L75)).
     * Mengelola akun pengguna (melihat daftar user dan riwayat pemesanannya, menonaktifkan akun sekaligus membatalkan seluruh sesi/token, dan mengaktifkan kembali) ([backend/routes/api.php:L76-L80](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L76-L80)).
     * Memantau dan menganalisis audit trail sistem melalui log aktivitas keamanan secara berkala ([backend/routes/api.php:L81](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L81)).

---

### B. STACK TEKNOLOGI

| Komponen | Spesifikasi / Library | Versi Terkonfigurasi / Terpasang | Bukti File Path |
| :--- | :--- | :--- | :--- |
| **Bahasa Pemrograman (Backend)** | PHP | `^8.3` (platform target `8.3`) | [backend/composer.json:L9](file:///d:/Data%20Bapak/maximal-construction/backend/composer.json#L9), [backend/composer.lock:L8359](file:///d:/Data%20Bapak/maximal-construction/backend/composer.lock#L8359) |
| **Framework Backend** | Laravel Framework | `v13.23.0` (target `^13.8`) | [backend/composer.json:L10](file:///d:/Data%20Bapak/maximal-construction/backend/composer.json#L10), [backend/composer.lock:L1061-L1062](file:///d:/Data%20Bapak/maximal-construction/backend/composer.lock#L1061-L1062) |
| **Autentikasi API** | Laravel Sanctum | `v4.3.3` (target `^4.3`) | [backend/composer.json:L11](file:///d:/Data%20Bapak/maximal-construction/backend/composer.json#L11), [backend/composer.lock:L1347-L1348](file:///d:/Data%20Bapak/maximal-construction/backend/composer.lock#L1347-L1348) |
| **Sistem Basis Data** | MySQL / MariaDB | Driver `mysql`, port `3306`, versi server fisik: **PERLU DIKONFIRMASI** | [backend/config/database.php:L47-L65](file:///d:/Data%20Bapak/maximal-construction/backend/config/database.php#L47-L65), [backend/.env:L23-L25](file:///d:/Data%20Bapak/maximal-construction/backend/.env#L23-L25) |
| **Library UI (Frontend)** | React | `19.2.8` (target `^19.2.8`) | [frontend/package.json:L17](file:///d:/Data%20Bapak/maximal-construction/frontend/package.json#L17), [frontend/package-lock.json:L2894-L2895](file:///d:/Data%20Bapak/maximal-construction/frontend/package-lock.json#L2894-L2895) |
| **DOM Renderer** | React DOM | `19.2.8` (target `^19.2.8`) | [frontend/package.json:L18](file:///d:/Data%20Bapak/maximal-construction/frontend/package.json#L18), [frontend/package-lock.json:L2904-L2905](file:///d:/Data%20Bapak/maximal-construction/frontend/package-lock.json#L2904-L2905) |
| **Build Tool / Bundler** | Vite | `8.2.1` (target `^8.2.0`) | [frontend/package.json:L31](file:///d:/Data%20Bapak/maximal-construction/frontend/package.json#L31), [frontend/package-lock.json:L3136-L3137](file:///d:/Data%20Bapak/maximal-construction/frontend/package-lock.json#L3136-L3137) |
| **Routing Frontend** | React Router DOM | `7.18.2` (target `^7.18.2`) | [frontend/package.json:L19](file:///d:/Data%20Bapak/maximal-construction/frontend/package.json#L19), [frontend/package-lock.json:L2939-L2940](file:///d:/Data%20Bapak/maximal-construction/frontend/package-lock.json#L2939-L2940) |
| **HTTP Client Frontend** | Axios | `1.19.0` (target `^1.19.0`) | [frontend/package.json:L14](file:///d:/Data%20Bapak/maximal-construction/frontend/package.json#L14), [frontend/package-lock.json:L1384-L1385](file:///d:/Data%20Bapak/maximal-construction/frontend/package-lock.json#L1384-L1385) |
| **CSS Framework** | Tailwind CSS (v4) | `4.3.3` (target `^4.3.3`) | [frontend/package.json:L20](file:///d:/Data%20Bapak/maximal-construction/frontend/package.json#L20), [frontend/package-lock.json:L3041-L3042](file:///d:/Data%20Bapak/maximal-construction/frontend/package-lock.json#L3041-L3042) |
| **Vite Plugin Tailwind** | @tailwindcss/vite | `4.3.3` (target `^4.3.3`) | [frontend/package.json:L13](file:///d:/Data%20Bapak/maximal-construction/frontend/package.json#L13) |
| **Animasi UI** | Framer Motion | `13.1.1` (target `^13.1.1`) | [frontend/package.json:L15](file:///d:/Data%20Bapak/maximal-construction/frontend/package.json#L15), [frontend/package-lock.json:L2010-L2011](file:///d:/Data%20Bapak/maximal-construction/frontend/package-lock.json#L2010-L2011) |
| **Format Tanggal** | Moment.js | `2.30.1` (target `^2.30.1`) | [frontend/package.json:L16](file:///d:/Data%20Bapak/maximal-construction/frontend/package.json#L16), [frontend/package-lock.json:L2683-L2684](file:///d:/Data%20Bapak/maximal-construction/frontend/package-lock.json#L2683-L2684) |
| **Paket Pihak Ketiga Keamanan Tambahan** | Spatie Permission, Purifier, Guard khusus | **TIDAK DITEMUKAN** (Sistem hanya menggunakan `laravel/sanctum` bawaan; role guard dan sanitasi HTML diimplementasikan secara mandiri via custom middleware) | [backend/composer.json:L8-L13](file:///d:/Data%20Bapak/maximal-construction/backend/composer.json#L8-L13) |

---

### C. ARSITEKTUR

1. **Komunikasi Frontend dan Backend:**
   * **Pola Arsitektur:** Decoupled Client-Server SPA (Single Page Application). Frontend React dan Backend Laravel berjalan pada origin terpisah.
   * **Prefix Rute:** Seluruh layanan data backend diakses melalui REST API dengan prefix rute `/api` (dikonfigurasi pada [backend/bootstrap/app.php:L11](file:///d:/Data%20Bapak/maximal-construction/backend/bootstrap/app.php#L11)).
   * **Koneksi Endpoint:** Frontend mengonfigurasi instance Axios terpusat dengan `baseURL: 'http://127.0.0.1:8000/api'` ([frontend/src/api/axios.js:L3-L8](file:///d:/Data%20Bapak/maximal-construction/frontend/src/api/axios.js#L3-L8)).
   * **Format Pertukaran Data:** JSON dengan header standar `Accept: application/json`.
   * **Mekanisme Autentikasi:** Menggunakan Bearer Token (Laravel Sanctum). Token disimpan di sisi browser klien pada `localStorage` dengan kunci `token`. Request interceptor Axios menyisipkan token pada setiap HTTP request melalui header `Authorization: Bearer ${token}` ([frontend/src/api/axios.js:L10-L16](file:///d:/Data%20Bapak/maximal-construction/frontend/src/api/axios.js#L10-L16)).
   * **Penanganan Pemutusan Sesi (401 Interceptor):** Response interceptor Axios mendeteksi kode status HTTP `401 Unauthorized`. Jika token terdeteksi tidak valid, interceptor menghapus token dari `localStorage` dan memicu event global `auth:unauthorized` ([frontend/src/api/axios.js:L18-L27](file:///d:/Data%20Bapak/maximal-construction/frontend/src/api/axios.js#L18-L27)). Event ini ditangkap oleh `AuthContext` untuk menampilkan modal penonaktifan akun secara otomatis ([frontend/src/context/AuthContext.jsx:L26-L33](file:///d:/Data%20Bapak/maximal-construction/frontend/src/context/AuthContext.jsx#L26-L33)).

2. **Ringkasan Struktur Folder Utama:**
```text
maximal-construction/
├── backend/                      # Backend Service (Laravel 13 API)
│   ├── app/Http/Controllers/Api/ # REST API Controllers (Publik, User, Admin)
│   ├── app/Http/Middleware/     # Custom Middleware (CheckRole, SanitizeInput)
│   ├── app/Models/              # Eloquent Models (User, Reservation, Project, dll.)
│   ├── app/Providers/           # Service Providers & Rate Limiters (AppServiceProvider)
│   ├── bootstrap/               # Inisialisasi App, Middleware Stack, & Exception Handler
│   ├── config/                  # Konfigurasi aplikasi (auth, database, sanctum, dll.)
│   ├── database/migrations/     # Skema tabel basis data MySQL
│   └── routes/                  # Definisi rute sistem (api.php, web.php, console.php)
└── frontend/                     # Client Frontend (React 19 + Vite)
    ├── src/api/                 # Instance Axios & Interceptor HTTP
    ├── src/components/          # Komponen UI modular (admin, public, user, modal)
    ├── src/context/             # State Management Autentikasi (AuthContext)
    ├── src/layouts/             # Layout Guard Berbasis Peran (Public, User, Admin)
    └── src/pages/               # Tampilan Halaman (admin/, public/, user/)
```

---

### D. HAK AKSES DAN ENDPOINT

#### 1. Tabel Rute per Kelompok Akses

| Kelompok Akses | Middleware Penjaga | Method & Endpoint | Controller & Method | Deskripsi Fungsi | Bukti File Path |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Publik** | `throttle:register` | `POST /api/register` | `AuthController@register` | Pendaftaran akun baru klien | [backend/routes/api.php:L18-L19](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L18-L19) |
| **Publik** | `throttle:login` | `POST /api/login` | `AuthController@login` | Autentikasi login klien | [backend/routes/api.php:L20-L21](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L20-L21) |
| **Publik** | `throttle:admin-login` | `POST /api/admin/login` | `AuthController@adminLogin` | Autentikasi login administrator | [backend/routes/api.php:L22-L23](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L22-L23) |
| **Publik** | Tanpa Middleware | `GET /api/projects` | `ProjectController@index` | Menampilkan portofolio publik | [backend/routes/api.php:L24](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L24) |
| **Publik** | Tanpa Middleware | `GET /api/projects/{project}` | `ProjectController@show` | Menampilkan detail portofolio | [backend/routes/api.php:L25](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L25) |
| **Publik** | Tanpa Middleware | `GET /api/services` | `ServiceController@index` | Menampilkan katalog layanan aktif | [backend/routes/api.php:L28](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L28) |
| **Publik** | Tanpa Middleware | `GET /api/services/{service}` | `ServiceController@show` | Menampilkan detail layanan | [backend/routes/api.php:L29](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L29) |
| **Publik** | Tanpa Middleware | `GET /api/testimonials` | `TestimonialController@index` | Menampilkan testimoni terverifikasi | [backend/routes/api.php:L30](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L30) |
| **User Terdaftar** | `auth:sanctum` | `GET /api/user` | `Closure` | Mendapatkan data user login saat ini | [backend/routes/api.php:L33-L35](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L33-L35) |
| **User Terdaftar** | `auth:sanctum` | `PUT /api/profile` | `AuthController@updateProfile` | Memperbarui profil akun user | [backend/routes/api.php:L36](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L36) |
| **User Terdaftar** | `auth:sanctum` | `PUT /api/profile/password` | `AuthController@updatePassword` | Mengubah password akun user | [backend/routes/api.php:L37](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L37) |
| **User Terdaftar** | `auth:sanctum` | `POST /api/logout` | `AuthController@logout` | Mencabut token sesi pengguna | [backend/routes/api.php:L38](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L38) |
| **User Terdaftar** | `auth:sanctum` | `GET /api/reservations` | `ReservationController@index` | Melihat riwayat reservasi user | [backend/routes/api.php:L40](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L40) |
| **User Terdaftar** | `auth:sanctum`, `throttle:reservation-create` | `POST /api/reservations` | `ReservationController@store` | Membuat pengajuan reservasi baru | [backend/routes/api.php:L41-L42](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L41-L42) |
| **User Terdaftar** | `auth:sanctum` | `GET /api/reservations/{reservation}` | `ReservationController@show` | Melihat detail reservasi miliknya | [backend/routes/api.php:L43](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L43) |
| **User Terdaftar** | `auth:sanctum` | `POST /api/reservations/{reservation}/testimonial` | `TestimonialController@store` | Mengirim testimoni proyek selesai | [backend/routes/api.php:L44](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L44) |
| **Admin** | `auth:sanctum`, `role:admin` | `GET /api/admin/test` | `Closure` | Uji hak akses administrasi | [backend/routes/api.php:L47-L49](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L47-L49) |
| **Admin** | `auth:sanctum`, `role:admin` | `GET /api/admin/dashboard-summary` | `AdminReservationController@dashboardSummary` | Statistik ringkasan dasbor admin | [backend/routes/api.php:L66](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L66) |
| **Admin** | `auth:sanctum`, `role:admin` | `GET /api/admin/reservations` | `AdminReservationController@index` | Menampilkan seluruh data reservasi | [backend/routes/api.php:L51](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L51) |
| **Admin** | `auth:sanctum`, `role:admin` | `GET /api/admin/reservations/{reservation}` | `AdminReservationController@show` | Menampilkan detail satu reservasi | [backend/routes/api.php:L52](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L52) |
| **Admin** | `auth:sanctum`, `role:admin` | `PATCH /api/admin/reservations/{reservation}/status` | `AdminReservationController@updateStatus` | Memperbarui tahapan status reservasi | [backend/routes/api.php:L53](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L53) |
| **Admin** | `auth:sanctum`, `role:admin` | `PATCH /api/admin/reservations/{reservation}/cancel` | `AdminReservationController@cancel` | Membatalkan reservasi pelanggan | [backend/routes/api.php:L54](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L54) |
| **Admin** | `auth:sanctum`, `role:admin` | `GET /api/admin/projects` | `AdminProjectController@index` | Mengambil semua portofolio proyek | [backend/routes/api.php:L56](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L56) |
| **Admin** | `auth:sanctum`, `role:admin` | `POST /api/admin/projects` | `AdminProjectController@store` | Menambah proyek & unggah gambar | [backend/routes/api.php:L57](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L57) |
| **Admin** | `auth:sanctum`, `role:admin` | `POST /api/admin/projects/{project}` | `AdminProjectController@update` | Mengubah proyek & ganti gambar | [backend/routes/api.php:L58](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L58) |
| **Admin** | `auth:sanctum`, `role:admin` | `DELETE /api/admin/projects/{project}` | `AdminProjectController@destroy` | Menghapus proyek beserta gambarnya | [backend/routes/api.php:L59](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L59) |
| **Admin** | `auth:sanctum`, `role:admin` | `GET /api/admin/services` | `AdminServiceController@index` | Mengambil seluruh katalog layanan | [backend/routes/api.php:L61](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L61) |
| **Admin** | `auth:sanctum`, `role:admin` | `POST /api/admin/services` | `AdminServiceController@store` | Menambah katalog layanan baru | [backend/routes/api.php:L62](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L62) |
| **Admin** | `auth:sanctum`, `role:admin` | `POST /api/admin/services/{service}` | `AdminServiceController@update` | Memperbarui data katalog layanan | [backend/routes/api.php:L63](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L63) |
| **Admin** | `auth:sanctum`, `role:admin` | `DELETE /api/admin/services/{service}` | `AdminServiceController@destroy` | Menghapus layanan (dengan proteksi) | [backend/routes/api.php:L64](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L64) |
| **Admin** | `auth:sanctum`, `role:admin` | `GET /api/admin/testimonials` | `AdminTestimonialController@index` | Menampilkan seluruh testimoni | [backend/routes/api.php:L72](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L72) |
| **Admin** | `auth:sanctum`, `role:admin` | `POST /api/admin/testimonials/{testimonial}/reply` | `AdminTestimonialController@reply` | Mengirim tanggapan pada testimoni | [backend/routes/api.php:L73](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L73) |
| **Admin** | `auth:sanctum`, `role:admin` | `DELETE /api/admin/testimonials/{testimonial}` | `AdminTestimonialController@destroy` | Menghapus data testimoni klien | [backend/routes/api.php:L74](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L74) |
| **Admin** | `auth:sanctum`, `role:admin` | `GET /api/admin/users` | `AdminUserController@index` | Melihat seluruh akun klien/user | [backend/routes/api.php:L76](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L76) |
| **Admin** | `auth:sanctum`, `role:admin` | `GET /api/admin/users/{user}` | `AdminUserController@show` | Melihat profil lengkap & riwayat user | [backend/routes/api.php:L77](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L77) |
| **Admin** | `auth:sanctum`, `role:admin` | `PATCH /api/admin/users/{user}/deactivate` | `AdminUserController@deactivate` | Menonaktifkan akun & hapus token | [backend/routes/api.php:L78](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L78) |
| **Admin** | `auth:sanctum`, `role:admin` | `PATCH /api/admin/users/{user}/activate` | `AdminUserController@activate` | Mengaktifkan kembali akun user | [backend/routes/api.php:L79](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L79) |
| **Admin** | `auth:sanctum`, `role:admin` | `GET /api/admin/activity-logs` | `AdminActivityLogController@index` | Memantau log audit aktivitas sistem | [backend/routes/api.php:L81](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L81) |

*Jumlah Endpoint per Kelompok:*
* **Kelompok Publik:** 8 endpoint
* **Kelompok Pengguna Terdaftar (User):** 8 endpoint
* **Kelompok Administrator (Admin):** 22 endpoint fungsional unik *(tercatat 26 baris deklarasi route di file karena duplikasi 4 endpoint reservasi pada baris 67-70)*
* **Total Keseluruhan Endpoint API:** 38 endpoint unik.

#### 2. Mekanisme Pemisahan Login Admin dan User
Sistem mengimplementasikan pemisahan login secara ketat dengan **endpoint dan controller method terpisah**:
* **Login Pelanggan / User:** Mengakses `POST /api/login` yang ditangani oleh `AuthController@login` ([backend/app/Http/Controllers/Api/AuthController.php:L54-L129](file:///d:/Data%20Bapak/maximal-construction/backend/app/Http/Controllers/Api/AuthController.php#L54-L129)). Di dalam controller, terdapat validasi peran:
  ```php
  // Bukti: AuthController.php (baris 96-110)
  if ($user->role !== 'user') {
      ActivityLog::record([
          'user_id' => $user->id,
          'action' => 'LOGIN_REJECTED_WRONG_PORTAL',
          ...
      ]);
      throw ValidationException::withMessages(['email' => ['Email atau password salah.']]);
  }
  ```
* **Login Administrator:** Mengakses `POST /api/admin/login` yang ditangani oleh `AuthController@adminLogin` ([backend/app/Http/Controllers/Api/AuthController.php:L195-L270](file:///d:/Data%20Bapak/maximal-construction/backend/app/Http/Controllers/Api/AuthController.php#L195-L270)). Di dalamnya terdapat verifikasi peran administrator:
  ```php
  // Bukti: AuthController.php (baris 221-235)
  if ($user->role !== 'admin') {
      ActivityLog::record([
          'user_id' => $user->id,
          'action' => 'ADMIN_LOGIN_REJECTED_NOT_ADMIN',
          ...
      ]);
      throw ValidationException::withMessages(['email' => ['Email atau password salah.']]);
  }
  ```
Pemberitahuan error ke client sengaja disamarkan menjadi pesan generik (`Email atau password salah.`) untuk mencegah *User Enumeration*, meskipun pada audit log dicatat secara rinci alasan penolakannya.

#### 3. Masa Berlaku Token
* Pada konfigurasi Sanctum di file [backend/config/sanctum.php:L53](file:///d:/Data%20Bapak/maximal-construction/backend/config/sanctum.php#L53), nilai masa berlaku token terkonfigurasi:
  ```php
  'expiration' => null,
  ```
* **Analisis:** Masa berlaku token bernilai `null` (tidak memiliki batas kedaluwarsa waktu otomatis). Token personal access token tetap sah sampai pengguna melakukan logout eksplisit atau token dicabut secara paksa oleh administrator melalui fitur penonaktifan pengguna.

---

### E. BASIS DATA

#### 1. Tabel Utama dan Relasi

| Nama Tabel | Deskripsi Data | Relasi Utama | Integritas Kunci Asing (Foreign Key) | Bukti File Path |
| :--- | :--- | :--- | :--- | :--- |
| `users` | Entitas pengguna (klien & admin) | One-to-Many ke `reservations`, `testimonials`, `activity_logs` | - | [backend/database/migrations/0001_01_01_000000_create_users_table.php](file:///d:/Data%20Bapak/maximal-construction/backend/database/migrations/0001_01_01_000000_create_users_table.php), [backend/database/migrations/2026_08_01_072211_add_columns_to_users_table.php](file:///d:/Data%20Bapak/maximal-construction/backend/database/migrations/2026_08_01_072211_add_columns_to_users_table.php) |
| `services` | Master jenis jasa konstruksi | One-to-Many ke `reservations` | - | [backend/database/migrations/2026_08_01_072224_create_services_table.php:L14-L22](file:///d:/Data%20Bapak/maximal-construction/backend/database/migrations/2026_08_01_072224_create_services_table.php#L14-L22) |
| `projects` | Master portofolio proyek selesai | One-to-Many ke `project_galleries` | - | [backend/database/migrations/2026_08_01_072231_create_projects_table.php:L13-L22](file:///d:/Data%20Bapak/maximal-construction/backend/database/migrations/2026_08_01_072231_create_projects_table.php#L13-L22) |
| `project_galleries` | Dokumentasi foto proyek | Many-to-One ke `projects` | `project_id` -> `projects(id)` `ON DELETE CASCADE` | [backend/database/migrations/2026_08_01_072237_create_project_galleries_table.php:L14-L19](file:///d:/Data%20Bapak/maximal-construction/backend/database/migrations/2026_08_01_072237_create_project_galleries_table.php#L14-L19) |
| `reservations` | Transaksi pemesanan konstruksi | Many-to-One ke `users` & `services`, One-to-One ke `testimonials` | `user_id` -> `users(id)` `CASCADE`, `service_id` -> `services(id)` `RESTRICT` | [backend/database/migrations/2026_08_01_072244_create_reservations_table.php:L14-L30](file:///d:/Data%20Bapak/maximal-construction/backend/database/migrations/2026_08_01_072244_create_reservations_table.php#L14-L30) |
| `testimonials` | Ulasan & rating dari pelanggan | Many-to-One ke `users`, One-to-One ke `reservations` | `reservation_id` (UNIQUE) -> `reservations(id)` `CASCADE`, `user_id` -> `users(id)` `CASCADE` | [backend/database/migrations/2026_08_01_072252_create_testimonials_table.php:L14-L24](file:///d:/Data%20Bapak/maximal-construction/backend/database/migrations/2026_08_01_072252_create_testimonials_table.php#L14-L24) |
| `activity_logs` | Audit trail rekam aktivitas sistem | Many-to-One ke `users` | `user_id` -> `users(id)` `ON DELETE SET NULL` | [backend/database/migrations/2026_08_01_072258_create_activity_logs_table.php:L13-L24](file:///d:/Data%20Bapak/maximal-construction/backend/database/migrations/2026_08_01_072258_create_activity_logs_table.php#L13-L24) |
| `personal_access_tokens` | Token autentikasi API Sanctum | Polymorphic Many-to-One (`tokenable`) | Index pada `tokenable_type`, `tokenable_id` | [backend/database/migrations/2026_07_31_152931_create_personal_access_tokens_table.php:L14-L23](file:///d:/Data%20Bapak/maximal-construction/backend/database/migrations/2026_07_31_152931_create_personal_access_tokens_table.php#L14-L23) |

#### 2. Kolom yang Menyimpan Data Sensitif

| Nama Tabel | Nama Kolom Sensitif | Klasifikasi Sensitivitas | Mekanisme Proteksi Penyimpanan | Bukti File Path |
| :--- | :--- | :--- | :--- | :--- |
| `users` | `password` | Kredensial Autentikasi | Hash satu arah menggunakan algoritma Bcrypt (cost round: 12), disembunyikan via `#[Hidden]` attribute | [backend/app/Models/User.php:L14-L15, L30](file:///d:/Data%20Bapak/maximal-construction/backend/app/Models/User.php#L14-L15), [backend/database/migrations/0001_01_01_000000_create_users_table.php:L19](file:///d:/Data%20Bapak/maximal-construction/backend/database/migrations/0001_01_01_000000_create_users_table.php#L19) |
| `users` | `email`, `phone`, `address` | Data Pribadi (PII - Personally Identifiable Information) | Plaintext dalam database, akses read dibatasi hanya untuk user pemilik data dan admin | [backend/database/migrations/2026_08_01_072211_add_columns_to_users_table.php:L14-L15](file:///d:/Data%20Bapak/maximal-construction/backend/database/migrations/2026_08_01_072211_add_columns_to_users_table.php#L14-L15) |
| `reservations` | `address`, `notes` | PII & Informasi Properti Klien | Plaintext dalam database, dilindungi kontrol kepemilikan data (ownership check) | [backend/database/migrations/2026_08_01_072244_create_reservations_table.php:L18-L19](file:///d:/Data%20Bapak/maximal-construction/backend/database/migrations/2026_08_01_072244_create_reservations_table.php#L18-L19) |
| `personal_access_tokens` | `token` | Kredensial Sesi API | Hash SHA-256 (64 karakter) oleh internal Sanctum sebelum disimpan ke database | [backend/database/migrations/2026_07_31_152931_create_personal_access_tokens_table.php:L18](file:///d:/Data%20Bapak/maximal-construction/backend/database/migrations/2026_07_31_152931_create_personal_access_tokens_table.php#L18) |
| `activity_logs` | `ip_address`, `user_agent`, `payload` | Data Jejak Digital & Parameter Request | Disimpan dalam bentuk JSON string; parameter kata sandi (`password`) disaring ketat sehingga tidak pernah tercatat | [backend/database/migrations/2026_08_01_072258_create_activity_logs_table.php:L19-L21](file:///d:/Data%20Bapak/maximal-construction/backend/database/migrations/2026_08_01_072258_create_activity_logs_table.php#L19-L21), [backend/app/Http/Controllers/Api/AuthController.php:L71, L212](file:///d:/Data%20Bapak/maximal-construction/backend/app/Http/Controllers/Api/AuthController.php#L71) |

---

### F. KONTROL KEAMANAN, DIPETAKAN KE OWASP TOP 10:2021

| Kategori OWASP Top 10:2021 | Nama Kontrol Keamanan | File / Kelas Terkait | Cara Kerja Singkat (1-2 Kalimat) | Parameter Penting |
| :--- | :--- | :--- | :--- | :--- |
| **A01: Broken Access Control** | Role-Based Access Control (RBAC) Middleware | [backend/app/Http/Middleware/CheckRole.php:L10-L34](file:///d:/Data%20Bapak/maximal-construction/backend/app/Http/Middleware/CheckRole.php#L10-L34) | Memeriksa apakah atribut `role` pengguna yang terotentikasi cocok dengan peran yang diminta rute (`admin`). Jika tidak cocok, request langsung dibatalkan, dicatat dalam audit log (`UNAUTHORIZED_ACCESS_ATTEMPT`), dan menghasilkan response 403. | Parameter: string `$role` (misalnya `'admin'`). Response: HTTP `403 Forbidden`. |
| **A01: Broken Access Control** | Pengecekan Kepemilikan Data (Ownership Verification / Anti-IDOR) | [backend/app/Http/Controllers/Api/ReservationController.php:L56-L71](file:///d:/Data%20Bapak/maximal-construction/backend/app/Http/Controllers/Api/ReservationController.php#L56-L71) | Memvalidasi secara manual bahwa `user_id` pada entitas reservasi yang diminta sesuai dengan ID user pada token request (`$reservation->user_id !== $request->user()->id`). Jika terjadi pelanggaran akses data pihak lain, sistem mencatat log insiden dan memblokir respon. | Kondisi: `$reservation->user_id !== $request->user()->id`. Status code: `403`. |
| **A01: Broken Access Control** | Scoping Query Kepemilikan Data | [backend/app/Http/Controllers/Api/ReservationController.php:L15](file:///d:/Data%20Bapak/maximal-construction/backend/app/Http/Controllers/Api/ReservationController.php#L15) | Membatasi data yang ditarik saat melihat riwayat reservasi dengan klausul `where('user_id', $request->user()->id)`, sehingga user tidak dapat melihat daftar reservasi milik akun lain. | Klausul Eloquent: `where('user_id', $request->user()->id)`. |
| **A01: Broken Access Control** | Policy / Gate Bawaan Laravel | `app/Policies/` | **TIDAK DITEMUKAN**. Otorisasi sepenuhnya ditangani di level middleware kustom dan pemeriksaan kondisional if-else pada baris controller. | - |
| **A02: Cryptographic Failures** | Algoritma Hashing Kata Sandi | [backend/app/Models/User.php:L30](file:///d:/Data%20Bapak/maximal-construction/backend/app/Models/User.php#L30), [backend/.env:L16](file:///d:/Data%20Bapak/maximal-construction/backend/.env#L16) | Mengamankan seluruh password pengguna menggunakan fungsi hash adaptif Bcrypt (`Hash::make()` dan cast `'password' => 'hashed'`). | Algoritma: Bcrypt. Biaya komputasi: `BCRYPT_ROUNDS=12`. |
| **A02: Cryptographic Failures** | Hashing Personal Access Token | [backend/database/migrations/2026_07_31_152931_create_personal_access_tokens_table.php:L18](file:///d:/Data%20Bapak/maximal-construction/backend/database/migrations/2026_07_31_152931_create_personal_access_tokens_table.php#L18) | Laravel Sanctum secara internal membuat plain token yang diserahkan ke klien sekali saja saat login, lalu menyimpannya di kolom `token` basis data dalam bentuk hash SHA-256 sepanjang 64 karakter. | Algoritma: SHA-256 (panjang 64 char string). |
| **A02: Cryptographic Failures** | Penggunaan dan Pemaksaan HTTPS | `AppServiceProvider.php`, `.htaccess`, `.env` | **TIDAK DITEMUKAN**. Tidak ada fungsi `URL::forceScheme('https')`, konfigurasi HSTS, maupun modul mod_rewrite redirect HTTPS di lingkungan repositori. | `APP_URL=http://localhost`. |
| **A03: Injection** | Sanitasi Input Global (Anti-XSS & Tag Injection) | [backend/app/Http/Middleware/SanitizeInput.php:L11-L24](file:///d:/Data%20Bapak/maximal-construction/backend/app/Http/Middleware/SanitizeInput.php#L11-L24) | Memproses seluruh payload request yang masuk secara rekursif (`array_walk_recursive`) dan menghapus seluruh tag HTML dari nilai string menggunakan `strip_tags()` sebelum masuk ke controller. | Fungsi: `strip_tags($value)`. Didaftarkan di pipeline global API pada [backend/bootstrap/app.php:L18-L20](file:///d:/Data%20Bapak/maximal-construction/backend/bootstrap/app.php#L18-L20). |
| **A03: Injection** | Parameterized Query via Eloquent ORM (Anti-SQLi) | Seluruh Controller di `app/Http/Controllers/Api/` | Seluruh manipulasi dan query basis data dibangun menggunakan Eloquent ORM yang memanfaatkan PDO prepared statements secara otomatis. Penggunaan `DB::raw`, `whereRaw`, `selectRaw` dsb. adalah **TIDAK DITEMUKAN** di seluruh repositori. | 100% Eloquent Query Builder (Binding PDO native). |
| **A03: Injection** | Auto-Escaping Konteks Output Frontend | Kode JSX di `frontend/src/` | React secara default mengeksekusi html entity auto-escaping pada seluruh ekspresi kurung kurawal `{variable}`. Penggunaan `dangerouslySetInnerHTML` adalah **TIDAK DITEMUKAN**. | Native React JSX Context Escaping. |
| **A05: Security Misconfiguration** | Pengaturan Debug Mode (`APP_DEBUG`) | [backend/.env:L4](file:///d:/Data%20Bapak/maximal-construction/backend/.env#L4), [backend/config/app.php:L42](file:///d:/Data%20Bapak/maximal-construction/backend/config/app.php#L42) | Konfigurasi aplikasi di repo saat ini bernilai `APP_DEBUG=true`, yang berisiko mengekspos jejak galat kode server jika terjadi unhandled exception di lingkungan non-lokal. | Nilai variabel: `APP_DEBUG=true`. |
| **A05: Security Misconfiguration** | Penanganan Exception Rute API | [backend/bootstrap/app.php:L26-L30](file:///d:/Data%20Bapak/maximal-construction/backend/bootstrap/app.php#L26-L30) | Mengarahkan exception handler agar selalu menghasilkan output berformat JSON (`shouldRenderJsonWhen`) ketika endpoint yang mengalami error berada pada jalur `/api/*`. | Jalur filter: `$request->is('api/*')`. |
| **A05: Security Misconfiguration** | Konfigurasi CORS (Cross-Origin Resource Sharing) | `backend/config/cors.php` | File kustom `config/cors.php` **TIDAK DITEMUKAN** di repo aplikasi. Sistem bersandar pada konfigurasi fallback bawaan framework Laravel yang bersifat permisif (`*`). | Path default: `api/*`, `allowed_origins: ['*']`, `allowed_methods: ['*']`, `allowed_headers: ['*']`. |
| **A05: Security Misconfiguration** | Header Keamanan HTTP (CSP, HSTS, X-Frame-Options) | `app/Http/Middleware/`, `public/.htaccess` | **TIDAK DITEMUKAN**. Tidak ada middleware atau konfigurasi web server kustom yang menginjeksikan header keamanan modern. | Tidak terkonfigurasi. |
| **A05: Security Misconfiguration** | Penyembunyian Header Teknologi (`X-Powered-By`) | `backend/public/index.php`, `.htaccess` | **TIDAK DITEMUKAN**. Tidak ada konfigurasi di level aplikasi untuk menekan header `X-Powered-By: PHP/...`. | Bergantung pada konfigurasi `expose_php` di PHP runtime host. |
| **A07: Identification & Auth Failures** | Rate Limiting Login Pelanggan | [backend/app/Providers/AppServiceProvider.php:L20-L39](file:///d:/Data%20Bapak/maximal-construction/backend/app/Providers/AppServiceProvider.php#L20-L39) | Membatasi percobaan login user maksimal 5 kali per menit berdasarkan alamat IP. Jika terlampaui, request ditolak dengan status HTTP 429 dan insiden dicatat ke audit log (`LOGIN_RATE_LIMITED`). | Limiter: `login`. Batas: `5 request/menit` per `$request->ip()`. |
| **A07: Identification & Auth Failures** | Rate Limiting Login Administrator | [backend/app/Providers/AppServiceProvider.php:L41-L60](file:///d:/Data%20Bapak/maximal-construction/backend/app/Providers/AppServiceProvider.php#L41-L60) | Membatasi percobaan login portal admin maksimal 3 kali per menit berdasarkan IP untuk melindungi portal administrasi dari serangan *brute-force credential stuffing*. | Limiter: `admin-login`. Batas: `3 request/menit` per `$request->ip()`. |
| **A07: Identification & Auth Failures** | Rate Limiting Registrasi | [backend/app/Providers/AppServiceProvider.php:L62-L80](file:///d:/Data%20Bapak/maximal-construction/backend/app/Providers/AppServiceProvider.php#L62-L80) | Membatasi pendaftaran akun baru maksimal 3 kali per menit per alamat IP guna mencegah bot spamming pendaftaran massal. | Limiter: `register`. Batas: `3 request/menit` per `$request->ip()`. |
| **A07: Identification & Auth Failures** | Rate Limiting Pengajuan Reservasi | [backend/app/Providers/AppServiceProvider.php:L82-L100](file:///d:/Data%20Bapak/maximal-construction/backend/app/Providers/AppServiceProvider.php#L82-L100) | Membatasi transaksi pembuatan reservasi maksimal 10 kali per menit per user ID atau IP guna mencegah *denial of service* / spam reservasi palsu. | Limiter: `reservation-create`. Batas: `10 request/menit` per `$request->user()?->id ?: $request->ip()`. |
| **A07: Identification & Auth Failures** | Aturan Kompleksitas Password | [backend/app/Http/Controllers/Api/AuthController.php:L23, L152](file:///d:/Data%20Bapak/maximal-construction/backend/app/Http/Controllers/Api/AuthController.php#L23) | Menerapkan validasi ketat pada registrasi dan penggantian password dengan aturan wajib memiliki minimal 8 karakter, kombinasi huruf besar dan huruf kecil, angka, serta konfirmasi password yang cocok. | Aturan: `Password::min(8)->mixedCase()->numbers()`, `confirmed`. |
| **A07: Identification & Auth Failures** | Revokasi Sesi Paksa saat Akun Dinonaktifkan | [backend/app/Http/Controllers/Api/Admin/UserController.php:L45-L46](file:///d:/Data%20Bapak/maximal-construction/backend/app/Http/Controllers/Api/Admin/UserController.php#L45-L46), [frontend/src/context/AuthContext.jsx:L38-L44](file:///d:/Data%20Bapak/maximal-construction/frontend/src/context/AuthContext.jsx#L38-L44) | Ketika admin menonaktifkan akun klien, backend secara instan menghapus seluruh personal access token milik user tersebut (`$user->tokens()->delete()`). Frontend melakukan polling verifikasi tiap 10 detik dan memicu modal penutupan sesi. | Backend: `$user->tokens()->delete()`. Frontend: interval cek `/user` tiap 10.000 ms. |
| **A09: Security Logging & Monitoring** | Audit Trail Pencatatan Aktivitas Transaksi & Keamanan | [backend/app/Models/ActivityLog.php:L12-L31](file:///d:/Data%20Bapak/maximal-construction/backend/app/Models/ActivityLog.php#L12-L31), [backend/database/migrations/2026_08_01_072258_create_activity_logs_table.php:L13-L24](file:///d:/Data%20Bapak/maximal-construction/backend/database/migrations/2026_08_01_072258_create_activity_logs_table.php#L13-L24) | Mencatat setiap kejadian operasional dan insiden keamanan ke tabel `activity_logs`. Menyimpan `user_id`, `action`, `method`, `url`, `ip_address`, `user_agent`, `payload`, dan `status_code`. | Kolom: 8 kolom atribut. Disimpan langsung saat event controller dipanggil (`ActivityLog::record`). |
| **A09: Security Logging & Monitoring** | Sanitasi Payload Log (Anti-Pencatatan Password) | [backend/app/Http/Controllers/Api/AuthController.php:L71, L212](file:///d:/Data%20Bapak/maximal-construction/backend/app/Http/Controllers/Api/AuthController.php#L71) | Membatasi data request yang disimpan ke kolom `payload` saat insiden kegagalan login hanya berupa atribut email (`json_encode(['email' => $validated['email']])`), mencegah kata sandi tersimpan pada log audit. | Proteksi: `json_encode(['email' => ...])` (tanpa input password). |
| **A09: Security Logging & Monitoring** | Dasbor Pemantauan Log Keamanan | [backend/app/Http/Controllers/Api/Admin/ActivityLogController.php:L11-L82](file:///d:/Data%20Bapak/maximal-construction/backend/app/Http/Controllers/Api/Admin/ActivityLogController.php#L11-L82) | Menyajikan ringkasan statistik harian (total log hari ini, login gagal, login berhasil, aksi hapus), filter 10 kategori aktivitas, filter rentang tanggal berbasis zona waktu Asia/Jakarta, dan fitur pencarian IP / identitas user. | Pagination: 15 item/halaman. Konversi timezone: `Asia/Jakarta` ke UTC. |
| **Kontrol Lain (Integritas Konten)** | Deteksi Spam & Kata Kasar pada Testimoni Klien | [backend/app/Http/Controllers/Api/TestimonialController.php:L13-L38, L74-L82, L103-L122](file:///d:/Data%20Bapak/maximal-construction/backend/app/Http/Controllers/Api/TestimonialController.php#L13-L38) | Menguji konten pesan testimoni terhadap: (1) 25 kata kasar bahasa Indonesia/daerah menggunakan regex word-boundary (`\bword\b`), (2) spam perulangan karakter berulang 7 kali atau lebih (`(.)\1{6,}`), dan (3) tautan URL eksternal (`https?://`). Pesan yang melanggar ditandai `is_flagged=true` dan disembunyikan dari publik. | Input diflag: `is_flagged = true`. Log: `TESTIMONIAL_FLAGGED`. Query publik memfilter `where('is_flagged', false)`. |
| **Kontrol Lain (Integritas File)** | Validasi Ketat Unggah Berkas Gambar Proyek | [backend/app/Http/Controllers/Api/Admin/ProjectController.php:L27-L29, L77-L79](file:///d:/Data%20Bapak/maximal-construction/backend/app/Http/Controllers/Api/Admin/ProjectController.php#L27-L29) | Memvalidasi file cover dan galeri proyek agar berformat citra valid (`image`), memiliki ekstensi aman (`jpeg,jpg,png,webp`), serta berukuran maksimal 2048 KB (2 MB). File disimpan menggunakan hash acak di disk publik dan file lama dihapus saat update/destroy. | Parameter: `mimes:jpeg,jpg,png,webp`, `max:2048`, disk `public`. |
| **Kontrol Lain (Integritas Data)** | Pencegahan Hapus Layanan yang Terikat Riwayat | [backend/app/Http/Controllers/Api/Admin/ServiceController.php:L81-L96](file:///d:/Data%20Bapak/maximal-construction/backend/app/Http/Controllers/Api/Admin/ServiceController.php#L81-L96) | Mencegah penghapusan layanan jasa konstruksi yang memiliki relasi aktif dengan riwayat reservasi pelanggan (`$service->reservations()->exists()`). Menghasilkan respon 409 Conflict dan mencatat log `SERVICE_DELETE_BLOCKED`. | Status code: `409 Conflict`. Log: `SERVICE_DELETE_BLOCKED`. |

---

### G. LINGKUNGAN

1. **Cara Menjalankan di Lingkungan Lokal:**
   * **Backend (Laravel):**
     * Alamat URL/Port Default: `http://127.0.0.1:8000` (atau `http://localhost:8000`).
     * Perintah Eksekusi: `php artisan serve` (atau melalui perintah komposit dev: `npm run dev` / `composer dev`).
     * Konfigurasi `.env`:
       * `APP_NAME=Laravel`
       * `APP_ENV=local`
       * `APP_KEY=[disamarkan]`
       * `APP_DEBUG=true`
       * `APP_URL=http://localhost`
       * `DB_CONNECTION=mysql`
       * `DB_HOST=127.0.0.1`
       * `DB_PORT=3306`
       * `DB_DATABASE=db_maximal_construction`
       * `DB_USERNAME=root`
       * `DB_PASSWORD=[disamarkan]`
   * **Frontend (Vite + React):**
     * Alamat URL/Port Default: `http://localhost:5173`.
     * Perintah Eksekusi: Masuk ke direktori `frontend`, lalu jalankan `npm run dev`.
     * Target Endpoint Backend: Didefinisikan secara statis pada [frontend/src/api/axios.js:L4](file:///d:/Data%20Bapak/maximal-construction/frontend/src/api/axios.js#L4) mengarah ke `http://127.0.0.1:8000/api`.

2. **Alat Bantu Pengujian yang Terlihat di Repositori:**
   * **Backend:**
     * Framework PHPUnit terpasang ([backend/phpunit.xml](file:///d:/Data%20Bapak/maximal-construction/backend/phpunit.xml), [backend/tests/TestCase.php](file:///d:/Data%20Bapak/maximal-construction/backend/tests/TestCase.php)).
     * Skrip runner: Perintah `composer test` yang mengeksekusi `@php artisan config:clear` dan `@php artisan test` ([backend/composer.json:L48-L51](file:///d:/Data%20Bapak/maximal-construction/backend/composer.json#L48-L51)).
     * Berkas pengujian yang tersedia: Hanya berkas contoh default framework ([backend/tests/Feature/ExampleTest.php](file:///d:/Data%20Bapak/maximal-construction/backend/tests/Feature/ExampleTest.php) dan [backend/tests/Unit/ExampleTest.php](file:///d:/Data%20Bapak/maximal-construction/backend/tests/Unit/ExampleTest.php)). Tidak ditemukan berkas unit/feature test kustom untuk menguji alur bisnis maupun kontrol keamanan.
   * **Frontend:**
     * Linter ESLint terpasang ([frontend/eslint.config.js](file:///d:/Data%20Bapak/maximal-construction/frontend/eslint.config.js), skrip `npm run lint`).
     * Framework automated testing di lingkungan frontend (seperti Vitest, Jest, atau Cypress): **TIDAK DITEMUKAN**.

---

### H. DOKUMEN DI DALAM REPO

* **Hasil Pencarian Kode FK-01 sampai FK-06:** **TIDAK DITEMUKAN**. Pencarian di seluruh folder proyek terhadap string `FK-` hanya menghasilkan variabel internal schema builder Laravel framework (`BlueprintState.php`). Tidak ditemukan dokumen pengujian fungsional bernomor FK-01 s/d FK-06 di dalam repositori.
* **Hasil Pencarian Pemindaian OWASP ZAP:** **TIDAK DITEMUKAN**. Tidak ada berkas laporan pemindaian (PDF/HTML/XML/JSON), catatan pengujian kerentanan, maupun skrip otomatisasi yang merujuk pada OWASP ZAP di dalam repositori.
* **Status Berkas README:**
  * Berkas [backend/README.md](file:///d:/Data%20Bapak/maximal-construction/backend/README.md) (59 baris) memuat teks dokumentasi standar resmi bawaan template kerangka kerja Laravel framework.
  * Berkas [frontend/README.md](file:///d:/Data%20Bapak/maximal-construction/frontend/README.md) (17 baris) memuat teks dokumentasi default bawaan template Vite React.

---

### I. TEMUAN TIDAK KONSISTEN

1. **Duplikasi Deklarasi Rute Reservasi Admin:**  
   Pada [backend/routes/api.php:L51-L54](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L51-L54) dan [backend/routes/api.php:L67-L70](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L67-L70), rute `GET /admin/reservations`, `GET /admin/reservations/{reservation}`, `PATCH /admin/reservations/{reservation}/status`, dan `PATCH /admin/reservations/{reservation}/cancel` dideklarasikan ulang secara identik di dalam grup middleware yang sama.
2. **Perbedaan Konfigurasi Basis Data antara File Contoh dan File Aktif:**  
   Pada file contoh [backend/.env.example:L23](file:///d:/Data%20Bapak/maximal-construction/backend/.env.example#L23), koneksi database default ditetapkan menggunakan SQLite (`DB_CONNECTION=sqlite`), sedangkan pada file aktif [backend/.env:L23-L28](file:///d:/Data%20Bapak/maximal-construction/backend/.env#L23-L28) koneksi menggunakan MySQL (`DB_CONNECTION=mysql`, `DB_DATABASE=db_maximal_construction`). Di direktori `backend/database/` juga tersimpan berkas `database.sqlite` berukuran 0 byte yang tidak digunakan.
3. **Inkonsistensi Metode HTTP Mutasi Data (RESTful POST vs PUT/PATCH):**  
   Pembaruan data portofolio proyek (`/api/admin/projects/{project}`) dan katalog layanan (`/api/admin/services/{service}`) menggunakan metode HTTP `POST` ([backend/routes/api.php:L58, L63](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php#L58)), berbeda dengan pembaruan profil user (`PUT /api/profile`) dan pembaruan status reservasi (`PATCH /admin/reservations/{reservation}/status`). Penggunaan `POST` untuk update biasanya merupakan *workaround* keterbatasan PHP dalam mengurai upload berkas `multipart/form-data` pada metode `PUT`, namun secara arsitektur RESTful hal ini tidak konsisten.
4. **Token Autentikasi Sanctum Tidak Memiliki Masa Kedaluwarsa Otomatis:**  
   Pada file [backend/config/sanctum.php:L53](file:///d:/Data%20Bapak/maximal-construction/backend/config/sanctum.php#L53), masa berlaku token disetel `'expiration' => null`. Hal ini menyebabkan token personal access token tetap aktif selamanya di `localStorage` klien selama pengguna tidak menekan tombol logout atau akun tidak dinonaktifkan admin, yang bertentangan dengan prinsip pembatasan umur sesi (session lifetime) pada OWASP A07.
5. **Konfigurasi Kebijakan CORS Tidak Diterbitkan (Overly Permissive):**  
   File konfigurasi CORS kustom (`backend/config/cors.php`) tidak diterbitkan di proyek. Akibatnya aplikasi menjalankan konfigurasi default internal framework Laravel (`vendor/laravel/framework/config/cors.php`) yang memberikan izin kepada semua origin (`allowed_origins => ['*']`) untuk mengakses endpoint API tanpa restriksi domain frontend spesifik.
6. **Nilai `APP_DEBUG=true` Aktif di File Lingkungan:**  
   Pada [backend/.env:L4](file:///d:/Data%20Bapak/maximal-construction/backend/.env#L4), variabel `APP_DEBUG` bernilai `true`. Kendati `bootstrap/app.php` memaksa format respon JSON, jika terjadi galat tak terduga, detail exception, stack trace, nama direktori server, dan query basis data tetap dapat terbaca oleh klien pemanggil API.
7. **Ketiadaan Validasi Keunikan Slug pada Penambahan Layanan:**  
   Pada [backend/app/Http/Controllers/Api/Admin/ServiceController.php:L27](file:///d:/Data%20Bapak/maximal-construction/backend/app/Http/Controllers/Api/Admin/ServiceController.php#L27), slug layanan dibentuk secara otomatis melalui `Str::slug($validated['name'])`. Namun validasi request pada baris 21 tidak menyertakan aturan `unique:services,name` maupun pengecekan duplikasi slug. Jika admin menginput nama layanan yang sudah ada, database akan melemparkan unhandled `QueryException (Integrity constraint violation: 1062 Duplicate entry)` karena kolom `slug` berstatus UNIQUE pada skema migrasi.
8. **Validasi Berkas Hanya Terjadi di Sisi Backend:**  
   Pada form penambahan portofolio proyek di frontend (`FormProyek.jsx`), pemilihan berkas cover image dan galeri foto tidak menyertakan validasi awal di sisi klien terhadap batas ukuran (< 2MB) maupun tipe MIME, sehingga sepenuhnya bergantung pada respon penolakan dari server backend.
9. **Tautan Fitur "Forgot Password" Tidak Memiliki Backend Endpoint:**  
   Pada antarmuka login klien ([frontend/src/pages/public/Login.jsx:L139](file:///d:/Data%20Bapak/maximal-construction/frontend/src/pages/public/Login.jsx#L139)), terdapat elemen UI tautan *Forgot Password?* dengan atribut `href="#"`. Namun pada backend [backend/routes/api.php](file:///d:/Data%20Bapak/maximal-construction/backend/routes/api.php) tidak ditemukan rute API maupun logika pengiriman token pemulihan kata sandi melalui email.

---

### DAFTAR SEMUA ITEM "TIDAK DITEMUKAN" ATAU "PERLU DIKONFIRMASI"

1. **TIDAK DITEMUKAN:**
   * Paket pihak ketiga khusus keamanan selain Sanctum (seperti `spatie/laravel-permission`, `mews/purifier`, dan sejenisnya).
   * File Policy bawaan Laravel di direktori `backend/app/Policies/` dan pendefinisian `Gate::define()`.
   * Pemakaian raw SQL query (`DB::raw`, `whereRaw`, `selectRaw`, `DB::statement`, dsb.) pada seluruh kode aplikasi backend (semua query murni Eloquent ORM).
   * Penggunaan `dangerouslySetInnerHTML` pada seluruh kode komponen frontend React.
   * File konfigurasi CORS kustom di direktori `backend/config/cors.php`.
   * Konfigurasi pemaksaan HTTPS (`URL::forceScheme('https')`, HSTS, atau redirect SSL di `.htaccess`).
   * Konfigurasi injeksi header keamanan HTTP (CSP, X-Frame-Options, X-Content-Type-Options) di level backend maupun `.htaccess`.
   * Konfigurasi penyembunyian header pengenal teknologi (`X-Powered-By`).
   * Berkas pengujian unit/feature kustom untuk logika bisnis dan kontrol keamanan di `backend/tests/` (hanya ada berkas contoh default `ExampleTest.php`).
   * Framework automated testing di lingkungan frontend (seperti Vitest, Jest, atau Cypress).
   * Dokumen matriks atau berkas pengujian fungsional dengan kode identifikasi **FK-01 sampai FK-06**.
   * Catatan, laporan, maupun skrip integrasi pemindaian keamanan menggunakan **OWASP ZAP**.
   * Endpoint dan fungsionalitas backend untuk fitur *Forgot Password*.

2. **PERLU DIKONFIRMASI:**
   * **Versi Rinci Server DBMS MySQL / MariaDB:** Konfigurasi `.env` dan `config/database.php` mengonfigurasi driver `mysql` pada port 3306, namun versi binary server basis data (misalnya MySQL 8.0.x atau MariaDB 10.4.x) berada pada host sistem operasi/server lokal pengguna dan tidak dinyatakan secara eksplisit di dalam repositori.
