# Vercel Environment Variables Checklist

Deploy sonrası hataları önlemek için aşağıdaki environment variables'ların Vercel'de ayarlandığından emin olun:

## Zorunlu Environment Variables

### 1. Database
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
```
- Supabase veya başka bir PostgreSQL veritabanı URL'i
- Format: `postgresql://user:password@host:port/database`

### 2. NextAuth
```
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://yourdomain.vercel.app
```
- `NEXTAUTH_SECRET`: `openssl rand -base64 32` ile oluşturulabilir
- `NEXTAUTH_URL`: Vercel deployment URL'iniz (örn: `https://yourproject.vercel.app`)

### 3. Domain Configuration
```
BASE_DOMAIN=yourdomain.com
```
- Ana domain adınız (subdomain routing için)

### 4. Cloudinary (Serverless için zorunlu)
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```
- Vercel gibi serverless ortamlarda dosya yükleme için zorunlu
- [cloudinary.com](https://cloudinary.com) üzerinden ücretsiz hesap oluşturabilirsiniz

### 5. Node Environment
```
NODE_ENV=production
```

## Vercel'de Environment Variables Ekleme

1. Vercel Dashboard → Projeniz → Settings → Environment Variables
2. Her bir variable'ı ekleyin (Production, Preview, Development için)
3. Deploy'u yeniden başlatın

## Sorun Giderme

### "Application error" hatası alıyorsanız:

1. **Environment Variables Kontrolü:**
   - Vercel Dashboard'da tüm environment variables'ların doğru ayarlandığını kontrol edin
   - Özellikle `DATABASE_URL` ve `NEXTAUTH_SECRET` zorunludur

2. **Database Migration:**
   ```bash
   npx prisma migrate deploy
   ```
   - Migration'ların çalıştırıldığından emin olun

3. **Database Connection:**
   - `DATABASE_URL` formatının doğru olduğunu kontrol edin
   - Supabase kullanıyorsanız, connection pooling URL'i kullanın:
     ```
     postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?pgbouncer=true
     ```

4. **NextAuth Secret:**
   - `NEXTAUTH_SECRET` boş veya yanlışsa giriş yapılamaz
   - Yeni bir secret oluşturun: `openssl rand -base64 32`

5. **Vercel Logs:**
   - Vercel Dashboard → Deployments → Son deployment → Logs
   - Hata mesajlarını kontrol edin

## Test

Deploy sonrası test etmek için:

1. `/auth/signin` sayfasına gidin
2. Geçerli bir kullanıcı ile giriş yapmayı deneyin
3. `/dashboard` sayfasına erişmeyi deneyin

Eğer hala sorun varsa, Vercel logs'larını kontrol edin.

