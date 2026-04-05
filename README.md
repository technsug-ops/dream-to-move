# dream to move

`dream to move`, tasima talebi toplayan ve admin tarafinda takip eden bir Next.js + Prisma MVP uygulamasidir.

## MVP Kapsami

- Musteri talep formu (ana sayfa)
- Talep kaydi (Prisma + PostgreSQL)
- Son talepler listesi (public, kisitli alan)
- Admin paneli (`/admin`) ile durum/teklif/not guncelleme
- Zod ile API validation

## Teknoloji

- TypeScript
- Next.js (App Router)
- Node.js runtime API route'lari
- Prisma ORM
- PostgreSQL

## Proje Yapisi

- `src/app/page.tsx`: Ana sayfa + form + son talepler
- `src/app/admin/page.tsx`: Admin paneli
- `src/app/api/move-requests/route.ts`: `GET` / `POST`
- `src/app/api/move-requests/[id]/status/route.ts`: `PATCH`
- `src/lib/move-request.ts`: domain sabitleri + Zod schema
- `prisma/schema.prisma`: veri modeli
- `prisma/migrations/*`: migration dosyalari
- `prisma/seed.mjs`: ornek veri

## Local Kurulum

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

3. `.env` icine calisan bir PostgreSQL baglanti string'i gir.

4. Migration uygula:

```bash
npm run db:migrate
```

5. (Opsiyonel) Seed verisi:

```bash
npm run db:seed
```

6. Calistir:

```bash
npm run dev
```

## Vercel Deploy

1. Vercel'de PostgreSQL/Neon/Supabase gibi dis bir Postgres DB bagla.
2. Project Environment Variables:
   - `DATABASE_URL`
   - `ADMIN_KEY`
3. Vercel Build Command'i su yap:

```bash
npm run vercel-build
```

Bu komut deploy sirasinda migration'lari uygular ve sonra Next build alir.

## Ortam Degiskenleri

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?sslmode=require"
ADMIN_KEY="dream-admin-2026"
```

## Komutlar

- `npm run dev`: gelistirme sunucusu
- `npm run build`: production build
- `npm run vercel-build`: Vercel build + migrate deploy
- `npm run start`: production calistirma
- `npm run lint`: ESLint
- `npm run db:migrate`: development migration
- `npm run db:deploy`: production migration deploy
- `npm run db:seed`: ornek veri

## Notlar

- SQLite, Vercel serverless ortaminda kalici ve guvenli cozum degildir.
- Admin endpointleri `x-admin-key` header'i ile korunur.
- Public endpoint, son 6 talebi sinirli alanlarla dondurur.
