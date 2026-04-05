# dream to move

`dream to move`, tasima talep toplama ve talep durum yonetimi icin hazirlanmis calisan bir MVP'dir.

## MVP Kapsami

- Musteri talep formu (ana sayfa)
- Talep kaydi (SQLite + Prisma)
- Son talepler listesi (public, kisitli alanlar)
- Admin paneli (`/admin`) ile durum/teklif/not guncelleme
- Zod ile request validation

## Teknoloji

- TypeScript
- Next.js (App Router)
- Node.js runtime API route'lari
- Prisma ORM
- SQLite

## Proje Yapisi

- `src/app/page.tsx`: Ana sayfa + form + son talepler
- `src/app/admin/page.tsx`: Admin paneli
- `src/app/api/move-requests/route.ts`: `GET` / `POST` endpoint
- `src/app/api/move-requests/[id]/status/route.ts`: `PATCH` endpoint
- `src/lib/move-request.ts`: domain sabitleri + Zod schema
- `prisma/schema.prisma`: veri modeli
- `prisma/migrations/*`: migration dosyalari
- `prisma/seed.mjs`: ornek veri

## Kurulum

1. Bagimliliklari yukle:

```bash
npm install
```

2. Ortam degiskenlerini hazirla:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Migration uygula:

```bash
npm run db:migrate
```

4. (Opsiyonel) Ornek veri ekle:

```bash
npm run db:seed
```

5. Uygulamayi baslat:

```bash
npm run dev
```

## Ortam Degiskenleri

`.env.example`:

```env
DATABASE_URL="file:./dev.db"
ADMIN_KEY="dream-admin-2026"
```

## Komutlar

- `npm run dev`: gelistirme sunucusu
- `npm run build`: production build
- `npm run start`: production calistirma
- `npm run lint`: ESLint
- `npm run db:migrate`: Prisma migration
- `npm run db:push`: schema push
- `npm run db:seed`: ornek veri ekleme

## Notlar

- Admin endpointleri `x-admin-key` header'i ile korunur.
- Public endpoint, tum talepleri degil sadece son 6 talebi sinirli alanlarla dondurur.
- `prisma/dev.db` dosyasi `.gitignore` ile dislanmistir.
