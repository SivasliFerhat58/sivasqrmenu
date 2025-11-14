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
- `BASE_DOMAIN`: Ana domain (örn: example.com veya localhost:3000)
- `STRIPE_SECRET_KEY`: Stripe gizli anahtarı (opsiyonel)
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook gizli anahtarı (opsiyonel)

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

## Subdomain Fonksiyonelliği

Uygulama, her restoran için özel subdomain desteği sağlar. Örneğin: `myrestaurant.example.com`

### DNS Yapılandırması

Subdomain fonksiyonelliğinin çalışması için DNS tarafında **wildcard** kayıt oluşturmanız gerekir:

#### Wildcard CNAME Kaydı (Önerilen)

```
Type: CNAME
Name: *
Value: your-hosting-provider.com
TTL: 3600 (veya önerilen değer)
```

**Örnek:**
- Domain: `example.com`
- Wildcard CNAME: `*.example.com` → `your-app.vercel.app` (veya hosting sağlayıcınız)

#### Wildcard A Kaydı (Alternatif)

Eğer CNAME kullanamıyorsanız, IP adresine direkt yönlendirme:

```
Type: A
Name: *
Value: YOUR_SERVER_IP
TTL: 3600
```

**Not:** CNAME kaydı genellikle daha esnektir ve önerilir.

### Subdomain Validasyonu

Subdomain'ler şu kurallara uymalıdır:
- **Format:** Sadece küçük harf, rakam ve tire (`-`) içerebilir
- **Regex:** `^[a-z0-9-]+$`
- **Uzunluk:** Minimum 3, maksimum 63 karakter
- **Başlangıç/Bitiş:** Tire ile başlayıp bitemez
- **Rezerve edilmiş:** `www`, `api`, `admin`, `dashboard`, `app`, `mail`, `ftp`, `localhost`, `test`, `staging`, `dev` gibi subdomain'ler kullanılamaz

### Subdomain Oluşturma

Restoran kaydı sırasında subdomain oluşturulur:

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

Subdomain otomatik olarak normalize edilir (küçük harfe çevrilir) ve validasyon yapılır.

### Subdomain Değişikliği

Admin panelden subdomain değiştirmek için:

```bash
curl -X PUT http://localhost:3000/api/restaurant/subdomain \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "newSubdomain": "newsubdomain"
  }'
```

**Not:** Production'da e-posta onayı gereklidir (şu an placeholder).

### Middleware ve Host Resolution

Next.js middleware, gelen isteklerin `Host` header'ını parse eder ve doğru restoranı bulur:

```typescript
// middleware.ts
// Host: "myrestaurant.example.com" -> subdomain: "myrestaurant"
// Restaurant bilgisi request headers'a eklenir:
// x-restaurant-id, x-restaurant-subdomain, x-restaurant-name
```

Sayfalarda restaurant bilgisine erişim:

```typescript
import { getRestaurantFromHeaders } from '@/lib/restaurant-context'

export default async function Page() {
  const restaurant = await getRestaurantFromHeaders()
  // restaurant bilgisi ile menü gösterimi
}
```

### Deploy Notları

#### Vercel

1. **Wildcard Domain Ekleme:**
   - Vercel Dashboard → Project Settings → Domains
   - `*.example.com` şeklinde wildcard domain ekleyin
   - DNS'de wildcard CNAME kaydı oluşturun: `*.example.com` → `cname.vercel-dns.com`

2. **Ortam Değişkenleri:**
   ```env
   BASE_DOMAIN=example.com
   NEXTAUTH_URL=https://example.com
   ```

3. **Not:** Vercel wildcard domain'leri destekler ✅

#### Cloudflare

1. **DNS Ayarları:**
   - Cloudflare Dashboard → DNS → Records
   - Type: `CNAME`, Name: `*`, Target: `your-app.com`, Proxy: Enabled/Disabled

2. **Page Rules (Opsiyonel):**
   - Wildcard subdomain'ler için özel kurallar eklenebilir

3. **Not:** Cloudflare wildcard domain'leri destekler ✅

#### Netlify

1. **Wildcard Domain:**
   - Netlify Dashboard → Site Settings → Domain Management
   - `*.example.com` şeklinde wildcard domain ekleyin
   - DNS'de wildcard CNAME: `*.example.com` → `your-site.netlify.app`

2. **Ortam Değişkenleri:**
   ```env
   BASE_DOMAIN=example.com
   ```

3. **Not:** Netlify wildcard domain'leri destekler ✅

#### Genel Notlar

- **Wildcard Destek Kontrolü:** Hosting sağlayıcınızın wildcard domain desteğini kontrol edin
- **SSL/TLS:** Wildcard SSL sertifikası gerekebilir (Let's Encrypt wildcard sertifikaları destekler)
- **CDN:** Cloudflare gibi CDN sağlayıcıları wildcard domain'leri destekler
- **Localhost Geliştirme:** Localhost'ta subdomain testi için `/etc/hosts` dosyasına ekleme yapabilirsiniz:
  ```
  127.0.0.1 myrestaurant.localhost
  127.0.0.1 testrestaurant.localhost
  ```

### Subdomain API Endpoints

#### GET `/api/restaurant/subdomain`
Mevcut subdomain bilgisini getirir.

**Response:**
```json
{
  "subdomain": "myrestaurant",
  "fullUrl": "myrestaurant.example.com"
}
```

#### PUT `/api/restaurant/subdomain`
Subdomain değiştirir (e-posta onayı gerekir - production'da).

**Request:**
```json
{
  "newSubdomain": "newsubdomain"
}
```

**Response:**
```json
{
  "message": "Subdomain updated successfully",
  "subdomain": "newsubdomain",
  "warning": "Email verification not implemented - subdomain changed directly"
}
```

