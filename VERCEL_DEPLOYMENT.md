# Vercel Free Plan Deployment Rehberi

## ✅ Vercel Free Plan ile Tam Uyumlu

Proje artık Vercel Free Plan'da çalışacak şekilde yapılandırıldı!

## 📋 Gereksinimler

### 1. Cloudinary Hesabı (Ücretsiz)
1. [cloudinary.com](https://cloudinary.com) → Sign up (ücretsiz)
2. Dashboard'dan şu bilgileri al:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

**Ücretsiz Tier:**
- 25GB storage
- 25GB bandwidth/ay
- 25M transformation credits/ay

### 2. Supabase PostgreSQL (Ücretsiz)
1. [supabase.com](https://supabase.com) → New Project
2. Database URL'i kopyala: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`
3. Vercel'e environment variable olarak ekle: `DATABASE_URL`

**Ücretsiz Tier:**
- 500MB database
- 2GB bandwidth/ay
- 50K monthly active users

## 🚀 Deployment Adımları

### Adım 1: GitHub'a Push
```bash
git add .
git commit -m "Add Cloudinary support for Vercel deployment"
git push origin main
```

### Adım 2: Vercel'e Deploy
1. [vercel.com](https://vercel.com) → Import Project
2. GitHub repository'yi seç
3. **Environment Variables** ekle:
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
   NEXTAUTH_SECRET=[openssl rand -base64 32 ile oluştur]
   NEXTAUTH_URL=https://yourdomain.com
   BASE_DOMAIN=yourdomain.com
   CLOUDINARY_CLOUD_NAME=[cloudinary dashboard'dan]
   CLOUDINARY_API_KEY=[cloudinary dashboard'dan]
   CLOUDINARY_API_SECRET=[cloudinary dashboard'dan]
   NODE_ENV=production
   ```
4. **Build Command**: `npm run build` (otomatik)
5. **Deploy!**

### Adım 3: Database Migration
Vercel deploy'dan sonra, database migration'ı çalıştır:

**Seçenek 1: Vercel CLI ile**
```bash
npm i -g vercel
vercel login
vercel env pull .env.local
npx prisma migrate deploy
npx prisma generate
```

**Seçenek 2: Local'den (Supabase connection string ile)**
```bash
# .env dosyasına Supabase DATABASE_URL ekle
npx prisma migrate deploy
npx prisma generate
```

### Adım 4: DNS Wildcard Ayarları
1. Domain provider'da (Namecheap, GoDaddy, vb.)
2. CNAME kaydı ekle: `*` → `cname.vercel-dns.com`
3. Veya Vercel Dashboard'dan domain ekle ve wildcard'ı etkinleştir

### Adım 5: İlk ADMIN Kullanıcısı
Supabase PostgreSQL'de manuel olarak oluştur:

```sql
-- Password hash'i oluştur (bcryptjs ile)
-- Node.js'te: const bcrypt = require('bcryptjs'); bcrypt.hash('yourpassword', 12)

INSERT INTO users (id, email, "passwordHash", name, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'admin@example.com',
  '$2a$12$...', -- bcrypt hash
  'Admin User',
  'ADMIN',
  NOW(),
  NOW()
);
```

## 💰 Maliyet

**Toplam: $0/ay** 🎉

- Vercel Free Plan: $0
- Cloudinary Free Tier: $0
- Supabase Free Tier: $0

## ⚠️ Limitler

### Vercel Free Plan
- **Bandwidth**: 100GB/ay
- **Build Time**: 45 dakika limit
- **Function Execution**: 10 saniye limit

### Cloudinary Free Tier
- **Storage**: 25GB
- **Bandwidth**: 25GB/ay
- **Transformations**: 25M/ay

### Supabase Free Tier
- **Database Size**: 500MB
- **Bandwidth**: 2GB/ay
- **API Requests**: 50K/ay

## 🔄 Fallback Mekanizması

Proje akıllı bir fallback mekanizmasına sahip:

1. **Cloudinary yapılandırılmışsa**: Tüm görseller Cloudinary'e yüklenir
2. **Cloudinary yapılandırılmamışsa (local development)**: Görseller `public/uploads/` dizinine kaydedilir
3. **Serverless ortamda (Vercel) Cloudinary yoksa**: Hata döner (Cloudinary zorunlu)

## ✅ Test Checklist

Deploy sonrası test edin:

- [ ] Ana sayfa yükleniyor
- [ ] Admin panel girişi çalışıyor
- [ ] Görsel yükleme çalışıyor (Cloudinary'e kaydediliyor)
- [ ] Subdomain routing çalışıyor: `https://restaurant1.yourdomain.com`
- [ ] Public menü görüntüleniyor
- [ ] Analytics çalışıyor
- [ ] QR kod oluşturma çalışıyor

## 📝 Notlar

- Local development'ta Cloudinary opsiyoneldir (local storage kullanılır)
- Production'da (Vercel) Cloudinary zorunludur
- Database migration'ı unutmayın!
- İlk ADMIN kullanıcısını manuel oluşturmanız gerekir

