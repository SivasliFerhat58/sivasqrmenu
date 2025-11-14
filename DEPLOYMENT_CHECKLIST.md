# Deployment Checklist

## Pre-Deployment

### 1. Environment Variables
- [ ] `.env` dosyası oluşturuldu
- [ ] `DATABASE_URL` PostgreSQL bağlantı URL'i ayarlandı
- [ ] `NEXTAUTH_SECRET` oluşturuldu (`openssl rand -base64 32`)
- [ ] `NEXTAUTH_URL` production URL'i ayarlandı
- [ ] `BASE_DOMAIN` ana domain ayarlandı (örn: `example.com`)

### 2. Database Setup
- [ ] PostgreSQL veritabanı oluşturuldu
- [ ] `pnpm prisma migrate deploy` çalıştırıldı (production)
- [ ] `pnpm prisma generate` çalıştırıldı
- [ ] İlk ADMIN kullanıcısı oluşturuldu (manuel veya seed script)

### 3. DNS Configuration
- [ ] Wildcard CNAME kaydı oluşturuldu: `*.example.com` → hosting provider
- [ ] DNS propagasyonu tamamlandı (genellikle 24 saat)
- [ ] Wildcard SSL sertifikası yapılandırıldı (Let's Encrypt veya hosting provider)

### 4. File System Permissions
- [ ] `public/uploads/` dizini oluşturuldu
- [ ] Write izinleri verildi (`chmod 755 public/uploads`)
- [ ] Production'da dosya yükleme dizini kontrol edildi

## Deployment Steps

### Vercel
1. [ ] Proje Vercel'e bağlandı
2. [ ] Environment variables eklendi
3. [ ] Wildcard domain eklendi: `*.example.com`
4. [ ] Build komutu: `pnpm build` (otomatik)
5. [ ] Deploy edildi

### Cloudflare Pages
1. [ ] Proje Cloudflare Pages'e bağlandı
2. [ ] Environment variables eklendi
3. [ ] Build settings yapılandırıldı
4. [ ] Custom domain eklendi: `*.example.com`
5. [ ] Deploy edildi

### Netlify
1. [ ] Proje Netlify'e bağlandı
2. [ ] Environment variables eklendi
3. [ ] Build settings yapılandırıldı
4. [ ] Custom domain eklendi: `*.example.com`
5. [ ] Deploy edildi

## Post-Deployment Testing

### 1. DNS & Subdomain Routing
- [ ] Ana domain erişilebilir: `https://example.com`
- [ ] Wildcard subdomain çalışıyor: `https://test.example.com`
- [ ] Host header doğru parse ediliyor
- [ ] Middleware subdomain'i doğru algılıyor

### 2. Authentication
- [ ] Admin panel girişi çalışıyor: `/dashboard` veya `/admin`
- [ ] NextAuth signin sayfası erişilebilir: `/api/auth/signin`
- [ ] Session oluşturuluyor ve korunuyor
- [ ] Logout çalışıyor

### 3. Admin Panel
- [ ] Admin kullanıcı ile giriş yapılabiliyor
- [ ] Yeni restoran oluşturulabiliyor
- [ ] Yeni kullanıcı (OWNER) oluşturulabiliyor
- [ ] Dashboard sayfaları erişilebilir

### 4. Public Menu
- [ ] Subdomain ile menü görüntülenebiliyor: `https://restaurant.example.com`
- [ ] Menü kategorileri görüntüleniyor
- [ ] Ürünler görüntüleniyor
- [ ] Görseller yükleniyor
- [ ] ISR cache çalışıyor (60 saniye revalidate)

### 5. File Uploads
- [ ] Görsel yükleme çalışıyor: `/api/uploads`
- [ ] Dosyalar `public/uploads/<restaurantId>/products/` altına kaydediliyor
- [ ] Thumbnail'ler oluşturuluyor (small, medium, large)
- [ ] Yüklenen görseller erişilebilir

### 6. Analytics
- [ ] PageView tracking çalışıyor
- [ ] Analytics dashboard erişilebilir: `/dashboard/analytics`
- [ ] Grafikler görüntüleniyor
- [ ] Veriler doğru kaydediliyor

### 7. Performance
- [ ] ISR cache çalışıyor (60s revalidate)
- [ ] Static assets optimize edilmiş
- [ ] Image optimization çalışıyor
- [ ] Page load süreleri kabul edilebilir

## Security Checks

- [ ] `NEXTAUTH_SECRET` güvenli ve unique
- [ ] Database bağlantısı SSL üzerinden
- [ ] File upload validasyonu çalışıyor (type, size)
- [ ] Admin endpoints korumalı (requireAdmin)
- [ ] Owner endpoints korumalı (requireOwner)
- [ ] Rate limiting düşünüldü (production'da eklenmeli)

## Monitoring

- [ ] Error logging yapılandırıldı
- [ ] Database connection pool ayarlandı
- [ ] Performance monitoring aktif
- [ ] Uptime monitoring kuruldu

## Rollback Plan

- [ ] Önceki deployment versiyonu kaydedildi
- [ ] Database backup alındı
- [ ] Rollback prosedürü dokümante edildi

## Notes

- İlk ADMIN kullanıcısı oluşturma:
  ```sql
  INSERT INTO users (id, email, password_hash, role, created_at, updated_at)
  VALUES (
    'admin-id',
    'admin@example.com',
    '$2a$12$hashed_password_here',
    'ADMIN',
    NOW(),
    NOW()
  );
  ```

- Production'da `prisma migrate deploy` kullanın (dev değil)
- File uploads için S3/Cloudinary'e geçiş düşünülmeli (production için)
- Rate limiting eklenmeli (API endpoints için)

