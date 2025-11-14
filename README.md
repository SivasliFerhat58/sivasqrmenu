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
pnpm prisma migrate dev --name init
```

veya

```bash
npx prisma migrate dev --name init
```

Bu komut:
- Prisma Client'ı generate eder
- Veritabanı migrasyonlarını oluşturur ve uygular
- İlk migrasyon olarak "init" adıyla oluşturur

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

- **User**: Kullanıcılar (id, name, email, passwordHash, role: ADMIN/OWNER, createdAt, updatedAt)
- **Restaurant**: Restoranlar (id, ownerId, name, subdomain [unique], description, address, phone, logoUrl, isActive, createdAt, updatedAt)
- **MenuCategory**: Menü kategorileri (id, restaurantId, name, order)
- **MenuItem**: Menü öğeleri (id, categoryId, name, description, price [Decimal], imageUrl, isAvailable, createdAt, updatedAt)
- **Subscription**: Abonelikler (id, restaurantId, plan, stripeSubscriptionId, status, currentPeriodEnd)
- **Audit**: Denetim kayıtları (id, restaurantId, action, payload [JSON], createdAt)

## İlk Migrasyon

İlk veritabanı migrasyonunu oluşturmak için:

```bash
pnpm prisma migrate dev --name init
```

veya

```bash
npx prisma migrate dev --name init
```

**Not**: Bu komutu çalıştırmadan önce `.env` dosyasında `DATABASE_URL` değişkeninin doğru şekilde ayarlandığından emin olun.

