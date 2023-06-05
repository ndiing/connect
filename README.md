# Connect

Koleksi API Pihak Ketiga

## Persyaratan

-   [node-v18+](https://nodejs.org/dist/v18.16.0/node-v18.16.0-x64.msi)

Cek sistem apakah node dan npm sudah terpasang

```bash
npm -v && node -v
8.17.0
v18.16.0
```

## Instalasi

Klon / [Download](https://github.com/ndiing/connect/archive/refs/heads/main.zip)

```bash
git clone https://github.com/ndiing/connect.git
cd connect
```

## Penggunaan

Menjalankan app

```bash
node dist/index.js
```

Memperbarui app

```bash
git reset --hard
git pull
```

## REST

### OtomaX

-   [x] **[Auth(entication/orization)](./rest/auth.rest)**
-   [x] **[OtomaX](./rest/otomax.rest)**

### Internet Banking

-   [x] **[BNIDirect](./rest/bnidirect.rest)**
-   [x] **[KlikBCA Individu](./rest/ibank.rest)**
-   [x] **[Mandiri Cash Management](./rest/mcm2.rest)**
-   [x] **[IBBIZ BRIBisnis](./rest/newbiz.rest)**
-   [ ] **[KlikBCA Bisnis](./rest/klikbca.rest)**

### Center/Sender

-   [x] **[Telegram](./rest/telegram.rest)**
-   [x] **[WhatsApp](./rest/whatsapp.rest)**
-   [x] **[XMPP](./rest/xmpp.rest)**

### Provider

-   [x] **[SiDOMPUL Open API](./rest/sidompul.rest)**
-   [x] **[SiDOMPUL](./rest/tokoxl.rest)**
-   [ ] **[Linkita](./rest/linkita.rest)**
