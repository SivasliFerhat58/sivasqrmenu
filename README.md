# QR Menu

QR Menu uygulaması - Next.js, TypeScript, TailwindCSS, Prisma ve NextAuth ile geliştirilmiştir.

## Teknolojiler

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Prisma** (PostgreSQL)
- **NextAuth** (Credentials Provider)
- **bcryptjs** (Password hashing)

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

## Authentication (NextAuth)

Proje NextAuth ile email+password kimlik doğrulama kullanmaktadır.

### API Endpoints

#### 1. Register - `/api/auth/register`

Yeni kullanıcı kaydı oluşturur (role: OWNER).

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@example.com",
    "password": "password123",
    "name": "John Doe",
    "restaurantName": "My Restaurant",
    "subdomain": "myrestaurant"
  }'
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "clx...",
    "email": "owner@example.com",
    "name": "John Doe",
    "role": "OWNER",
    "restaurantId": "clx..." // null if restaurant not created
  }
}
```

**Notlar:**
- `restaurantName` ve `subdomain` opsiyoneldir
- Password minimum 8 karakter olmalıdır
- Subdomain unique olmalıdır

#### 2. Sign In - NextAuth Endpoint

NextAuth giriş endpoint'i: `/api/auth/signin`

**Request (Form Data):**
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=owner@example.com&password=password123"
```

**Session Bilgileri:**
Giriş sonrası session içinde şu bilgiler bulunur:
- `userId`: Kullanıcı ID'si
- `role`: Kullanıcı rolü (ADMIN veya OWNER)
- `restaurantId`: Eğer OWNER ise, restoran ID'si (varsa)

### Güvenlik

- **Password Hashing**: bcryptjs ile hashlenir (12 rounds)
- **Password Validation**: Minimum 8 karakter zorunludur
- **Rate Limiting**: Register endpoint'ine rate limiting eklenmesi önerilir (TODO olarak işaretlenmiştir)
  - Önerilen: `next-rate-limit`, `@upstash/ratelimit` veya benzeri
  - Önerilen limit: 5 istek / 15 dakika / IP

### Ortam Değişkenleri (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/qrmenu?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (optional)
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
```

**NEXTAUTH_SECRET oluşturma:**
```bash
openssl rand -base64 32
```

### Test Komutları

#### 1. Kullanıcı Kaydı (Restoran ile)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "name": "Test User",
    "restaurantName": "Test Restaurant",
    "subdomain": "testrestaurant"
  }'
```

#### 2. Kullanıcı Kaydı (Sadece Kullanıcı)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@example.com",
    "password": "password123",
    "name": "Owner Name"
  }'
```

#### 3. Giriş Testi (NextAuth)
```bash
# Browser'da: http://localhost:3000/api/auth/signin
# veya curl ile:
curl -X POST http://localhost:3000/api/auth/callback/credentials \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=test@example.com&password=testpass123&redirect=false&json=true"
```

#### 4. Session Kontrolü
```bash
# NextAuth session endpoint
curl http://localhost:3000/api/auth/session
```

### TypeScript Tipleri

NextAuth session tipleri `types/next-auth.d.ts` dosyasında genişletilmiştir:

```typescript
session.user = {
  id: string
  email: string
  name?: string | null
  role: 'ADMIN' | 'OWNER'
  restaurantId?: string | null
}
```

