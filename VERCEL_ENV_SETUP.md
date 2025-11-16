# Vercel Environment Variables Ekleme Rehberi

Bu rehber, Vercel'de environment variables'ları nasıl ekleyeceğinizi adım adım anlatır.

## Adım 1: Vercel Dashboard'a Giriş

1. Tarayıcınızda [vercel.com](https://vercel.com) adresine gidin
2. "Log In" butonuna tıklayın
3. GitHub hesabınızla giriş yapın (veya mevcut hesabınızla)

## Adım 2: Projenizi Bulun

1. Vercel Dashboard'da üst menüden "Dashboard" seçeneğine tıklayın
2. Deploy ettiğiniz projeyi listeden bulun ve üzerine tıklayın
3. Proje sayfasına yönlendirileceksiniz

## Adım 3: Settings Sayfasına Gidin

1. Proje sayfasında üst menüden **"Settings"** sekmesine tıklayın
2. Sol menüden **"Environment Variables"** seçeneğine tıklayın

## Adım 4: Environment Variables Ekleme

Her bir environment variable için aşağıdaki adımları tekrarlayın:

### 4.1. DATABASE_URL Ekleme

1. **"Key"** alanına: `DATABASE_URL` yazın
2. **"Value"** alanına PostgreSQL connection string'inizi yazın:
   ```
   postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
   ```
   - `[PASSWORD]`: Supabase veya veritabanı şifreniz
   - `[HOST]`: Veritabanı host adresi (örn: `db.xxxxx.supabase.co`)
   - Örnek: `postgresql://postgres:mypassword123@db.abcdefgh.supabase.co:5432/postgres`

3. **Environment** seçeneklerinden:
   - ✅ **Production** (işaretleyin)
   - ✅ **Preview** (işaretleyin)
   - ✅ **Development** (işaretleyin - opsiyonel)

4. **"Add"** butonuna tıklayın

### 4.2. NEXTAUTH_SECRET Ekleme

**Önce secret oluşturun:**

**Windows için:**
```powershell
# PowerShell'de çalıştırın
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Mac/Linux için:**
```bash
openssl rand -base64 32
```

**Online tool kullanarak:**
- [randomkeygen.com](https://randomkeygen.com) → "CodeIgniter Encryption Keys" bölümünden bir key alın

**Vercel'de ekleme:**
1. **"Key"** alanına: `NEXTAUTH_SECRET` yazın
2. **"Value"** alanına oluşturduğunuz secret'ı yapıştırın (örn: `aBc123XyZ456...`)
3. **Environment** seçeneklerinden:
   - ✅ **Production**
   - ✅ **Preview**
   - ✅ **Development** (opsiyonel)
4. **"Add"** butonuna tıklayın

### 4.3. NEXTAUTH_URL Ekleme

1. **"Key"** alanına: `NEXTAUTH_URL` yazın
2. **"Value"** alanına Vercel deployment URL'inizi yazın:
   - İlk deploy sonrası Vercel size bir URL verir (örn: `https://yourproject.vercel.app`)
   - Özel domain kullanıyorsanız: `https://yourdomain.com`
   - Örnek: `https://qrmenu-app.vercel.app`

3. **Environment** seçeneklerinden:
   - ✅ **Production**
   - ✅ **Preview**
   - ✅ **Development** (opsiyonel)

4. **"Add"** butonuna tıklayın

### 4.4. BASE_DOMAIN Ekleme

1. **"Key"** alanına: `BASE_DOMAIN` yazın
2. **"Value"** alanına ana domain adınızı yazın:
   - Özel domain varsa: `yourdomain.com`
   - Vercel domain kullanıyorsanız: `yourproject.vercel.app`
   - Örnek: `qrmenu-app.vercel.app` veya `mydomain.com`

3. **Environment** seçeneklerinden:
   - ✅ **Production**
   - ✅ **Preview**
   - ✅ **Development** (opsiyonel)

4. **"Add"** butonuna tıklayın

### 4.5. CLOUDINARY_CLOUD_NAME Ekleme

**Önce Cloudinary hesabı oluşturun:**
1. [cloudinary.com](https://cloudinary.com) → "Sign Up" (ücretsiz)
2. Dashboard'a giriş yapın
3. Dashboard'da "Account Details" bölümünden `Cloud name` değerini kopyalayın

**Vercel'de ekleme:**
1. **"Key"** alanına: `CLOUDINARY_CLOUD_NAME` yazın
2. **"Value"** alanına Cloudinary cloud name'inizi yazın (örn: `dxyz123abc`)
3. **Environment** seçeneklerinden:
   - ✅ **Production**
   - ✅ **Preview**
   - ✅ **Development** (opsiyonel)
4. **"Add"** butonuna tıklayın

### 4.6. CLOUDINARY_API_KEY Ekleme

1. Cloudinary Dashboard → "Account Details" bölümünden `API Key` değerini kopyalayın
2. **"Key"** alanına: `CLOUDINARY_API_KEY` yazın
3. **"Value"** alanına API key'i yapıştırın (örn: `123456789012345`)
4. **Environment** seçeneklerinden:
   - ✅ **Production**
   - ✅ **Preview**
   - ✅ **Development** (opsiyonel)
5. **"Add"** butonuna tıklayın

### 4.7. CLOUDINARY_API_SECRET Ekleme

1. Cloudinary Dashboard → "Account Details" bölümünden `API Secret` değerini kopyalayın
   - ⚠️ **Dikkat:** "Reveal" butonuna tıklamanız gerekebilir
2. **"Key"** alanına: `CLOUDINARY_API_SECRET` yazın
3. **"Value"** alanına API secret'ı yapıştırın (örn: `abcdefghijklmnopqrstuvwxyz123456`)
4. **Environment** seçeneklerinden:
   - ✅ **Production**
   - ✅ **Preview**
   - ✅ **Development** (opsiyonel)
5. **"Add"** butonuna tıklayın

### 4.8. NODE_ENV Ekleme (Opsiyonel)

1. **"Key"** alanına: `NODE_ENV` yazın
2. **"Value"** alanına: `production` yazın
3. **Environment** seçeneklerinden:
   - ✅ **Production**
   - ⬜ **Preview** (gerekli değil)
   - ⬜ **Development** (gerekli değil)
4. **"Add"** butonuna tıklayın

## Adım 5: Değişiklikleri Kaydetme ve Deploy

1. Tüm environment variables'ları ekledikten sonra, sayfanın altına kaydırın
2. **"Save"** butonuna tıklayın (eğer görünüyorsa)
3. Üst menüden **"Deployments"** sekmesine gidin
4. En üstteki deployment'ın yanındaki **"..."** (üç nokta) menüsüne tıklayın
5. **"Redeploy"** seçeneğine tıklayın
6. Onaylayın

**Alternatif:** Yeni bir commit push ederseniz otomatik olarak yeni bir deployment başlar.

## Adım 6: Kontrol

1. Deployment tamamlandıktan sonra (genellikle 1-2 dakika)
2. Projenizin URL'ine gidin
3. `/auth/signin` sayfasına gidin
4. Giriş yapmayı deneyin

## Sorun Giderme

### Environment Variable Görünmüyor

- Deploy'u yeniden başlatın (Redeploy)
- Tarayıcıyı yenileyin
- Environment variable'ın doğru environment'larda işaretlendiğinden emin olun

### Hala Hata Alıyorum

1. Vercel Dashboard → Deployments → Son deployment → **"Logs"** sekmesine gidin
2. Hata mesajlarını kontrol edin
3. Özellikle şu hatalara dikkat edin:
   - `DATABASE_URL is not set` → DATABASE_URL eklenmemiş
   - `NEXTAUTH_SECRET is missing` → NEXTAUTH_SECRET eklenmemiş
   - `Failed to connect to database` → DATABASE_URL yanlış veya veritabanı erişilemiyor

### Supabase Connection String Formatı

Supabase kullanıyorsanız, connection string formatı:
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

Veya direct connection:
```
postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
```

Supabase Dashboard → Settings → Database → Connection string'den kopyalayabilirsiniz.

## Özet: Eklenmesi Gereken Variables

| Key | Örnek Value | Zorunlu |
|-----|------------|---------|
| `DATABASE_URL` | `postgresql://postgres:pass@host:5432/db` | ✅ |
| `NEXTAUTH_SECRET` | `aBc123XyZ456...` | ✅ |
| `NEXTAUTH_URL` | `https://yourproject.vercel.app` | ✅ |
| `BASE_DOMAIN` | `yourproject.vercel.app` | ✅ |
| `CLOUDINARY_CLOUD_NAME` | `dxyz123abc` | ✅ |
| `CLOUDINARY_API_KEY` | `123456789012345` | ✅ |
| `CLOUDINARY_API_SECRET` | `abcdefghijklmnop...` | ✅ |
| `NODE_ENV` | `production` | ⬜ |

## İpuçları

- ✅ Her variable'ı ekledikten sonra "Add" butonuna tıklamayı unutmayın
- ✅ Production, Preview ve Development için aynı değerleri kullanabilirsiniz
- ✅ Secret değerleri (NEXTAUTH_SECRET, CLOUDINARY_API_SECRET) güvenli tutun
- ✅ Deploy sonrası mutlaka test edin
- ✅ Vercel logs'larını kontrol etmeyi unutmayın

