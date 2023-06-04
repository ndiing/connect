# Connect (1.3.1)

[![Connect](./connect.png)](https://github.com/ndiing/connect.git)

## Prasyarat

Proyek ini membutuhkan **[Node](https://nodejs.org/dist/v18.16.0/node-v18.16.0-x64.msi)** (versi **18** atau lebih baru) dan **NPM**.
**[Node](https://nodejs.org/dist/v18.16.0/node-v18.16.0-x64.msi)** dan **NPM** sangat mudah dipasang.Untuk memastikan Anda memilikinya tersedia di mesin Anda,
Coba jalankan perintah berikut.

```bash
npm -v && node -v
8.17.0
v18.16.0
```

## Instalasi

**SEBELUM ANDA MENGINSTAL**: silakan baca **[Prasyarat](#prasyarat)**

Mulailah dengan mengkloning repo ini di mesin lokal Anda:

```bash
git clone https://github.com/ndiing/connect.git
cd connect
```

<!--
Untuk menginstal, jalankan:

```bash
npm install
``` -->

## Penggunaan

### Memulai aplikasi

```bash
node dist/index.js
```

### Memperbarui aplikasi

```bash
git pull
```

## Folder

### Data
```
%LOCALAPPDATA%/connect-data
```

### Konfigurasi
```
%LOCALAPPDATA%/connect-data/config/config.json
```

### Akses
```
%LOCALAPPDATA%/connect-data/auth/permission.json
```

## REST

[Dokumentasi](https://ndiing.gitbook.io/connect/) API

### OtomaX

-   [x] **[auth.rest](./rest/auth.rest)**
-   [x] **[otomax.rest](./rest/otomax.rest)**

### Bank

-   [x] **[bnidirect.rest](./rest/bnidirect.rest)**
-   [x] **[ibank.rest](./rest/ibank.rest)**
-   [x] **[newbiz.rest](./rest/newbiz.rest)**
-   [x] **[mcm2.rest](./rest/mcm2.rest)**
-   [ ] **[klikbca.rest](./rest/klikbca.rest)**

### Messenger

-   [x] **[whatsapp.rest](./rest/whatsapp.rest)**
-   [x] **[telegram.rest](./rest/telegram.rest)**
-   [x] **[xmpp.rest](./rest/xmpp.rest)**

### Provider

-   [x] **[sidompul.rest](./rest/sidompul.rest)**
-   [x] **[tokoxl.rest](./rest/tokoxl.rest)**
-   [ ] **[linkita.rest](./rest/linkita.rest)**

## Catatan

-   `connect.exe` kompatibilitas terbatas, dihentikan sejak `v1.0.37`
