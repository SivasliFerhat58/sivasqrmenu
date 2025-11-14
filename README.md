# QR Menu

QR Menu uygulaması - Next.js, TypeScript, TailwindCSS, Prisma ve NextAuth ile geliştirilmiştir.

## Teknolojiler

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Prisma** (PostgreSQL)
- **NextAuth**

## Kurulum

### 1. Bağımlılıkları yükle

```bash
pnpm install
```

### 2. Ortam değişkenlerini ayarla

`.env.example` dosyasını `.env` olarak kopyalayın ve değerleri doldurun:

```bash
cp .env.example .env
```

Gerekli ortam değişkenleri:
- `DATABASE_URL`: PostgreSQL veritabanı bağlantı URL'i
- `NEXTAUTH_SECRET`: NextAuth için gizli anahtar
- `NEXTAUTH_URL`: Uygulamanın URL'i (örn: http://localhost:3000)
- `STRIPE_SECRET_KEY`: Stripe gizli anahtarı
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook gizli anahtarı

### 3. Veritabanı migrasyonlarını çalıştır

```bash
pnpm prisma migrate dev
```

Bu komut:
- Prisma Client'ı generate eder
- Veritabanı migrasyonlarını oluşturur ve uygular

### 4. Geliştirme sunucusunu başlat

```bash
pnpm dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## Prisma Komutları

- `pnpm prisma:generate` - Prisma Client'ı generate eder
- `pnpm prisma:migrate` - Veritabanı migrasyonlarını çalıştırır
- `pnpm prisma:studio` - Prisma Studio'yu açar (veritabanı görselleştirme aracı)

## Proje Yapısı

```
QrMenu/
├── app/              # Next.js App Router dizini
├── prisma/           # Prisma schema ve migrasyonlar
├── public/           # Statik dosyalar
└── ...
```

## Veritabanı Modelleri

- **User**: Kullanıcılar (müşteri, restoran sahibi, admin)
- **Restaurant**: Restoranlar
- **MenuItem**: Menü öğeleri
- **Subscription**: Abonelikler

