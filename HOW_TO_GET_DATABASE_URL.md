# PostgreSQL DATABASE_URL Nasıl Alınır?

Bu rehber, PostgreSQL veritabanı için `DATABASE_URL` değerini nasıl alacağınızı gösterir.

## Seçenek 1: Supabase (Önerilen - Ücretsiz)

### Adım 1: Supabase Hesabı Oluşturun

1. [supabase.com](https://supabase.com) adresine gidin
2. **"Start your project"** veya **"Sign Up"** butonuna tıklayın
3. GitHub hesabınızla giriş yapın (veya email ile kaydolun)

### Adım 2: Yeni Proje Oluşturun

1. Dashboard'da **"New Project"** butonuna tıklayın
2. **Project Name**: Projenize bir isim verin (örn: `qrmenu-db`)
3. **Database Password**: Güçlü bir şifre oluşturun ve **MUTLAKA KAYDEDİN** (bir daha göremeyeceksiniz!)
4. **Region**: Size en yakın bölgeyi seçin (örn: `West US`, `Europe West`)
5. **"Create new project"** butonuna tıklayın
6. Proje oluşturulmasını bekleyin (1-2 dakika)

### Adım 3: Database URL'i Bulun (Güncel Yöntemler)

**Yöntem 1: Settings → Database (En Yaygın)**

1. Sol menüden **"Settings"** (⚙️) ikonuna tıklayın
2. **"Project Settings"** altında **"Database"** sekmesine tıklayın
3. Sayfayı aşağı kaydırın, şu bölümleri arayın:
   - **"Connection string"** veya
   - **"Connection info"** veya
   - **"Database URL"** veya
   - **"Connection pooling"**
4. Eğer görünmüyorsa, **"Connection string"** yazısına tıklayın veya genişletin
5. **"URI"** veya **"JDBC"** sekmesine tıklayın
6. Connection string'i göreceksiniz

**Yöntem 2: Connection Pooling Bölümü**

1. Settings → Database
2. Sayfayı aşağı kaydırın
3. **"Connection pooling"** bölümünü bulun
4. **"Connection string"** → **"URI"** sekmesine tıklayın
5. Bu string'i kullanın (Vercel için önerilen):
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

**Yöntem 3: Project Settings → API**

1. Settings → **"API"** sekmesine gidin
2. **"Project URL"** ve **"anon key"** göreceksiniz
3. Database URL'i burada olmayabilir, ama **"Database"** sekmesine geri dönün

**Yöntem 4: SQL Editor'dan Kontrol**

1. Sol menüden **"SQL Editor"** seçeneğine tıklayın
2. Yeni bir query oluşturun
3. Connection bilgileri burada görünebilir

**Yöntem 5: Manuel Oluşturma (Eğer Bulamazsanız)**

Eğer connection string'i bulamazsanız, manuel olarak oluşturabilirsiniz:

1. Settings → Database → **"Database settings"** bölümüne gidin
2. Şu bilgileri not edin:
   - **Host**: `db.[PROJECT-REF].supabase.co` (Settings → API'de Project URL'den alabilirsiniz)
   - **Database name**: Genellikle `postgres`
   - **Port**: `5432` (direct) veya `6543` (pooling)
   - **User**: `postgres`
   - **Password**: Proje oluştururken belirlediğiniz şifre

3. Connection string formatı:
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

**PROJECT-REF'i Nasıl Bulurum?**

1. Settings → **"General"** sekmesine gidin
2. **"Reference ID"** veya **"Project ID"** değerini kopyalayın
3. Veya URL'den alın: `https://app.supabase.com/project/[PROJECT-REF]`
   - URL'deki `[PROJECT-REF]` kısmını kopyalayın

### Adım 4: Connection String'i Hazırlayın

**Örnek format:**
```
postgresql://postgres:mypassword123@db.abcdefghijklmnop.supabase.co:5432/postgres
```

**Dikkat:**
- `[YOUR-PASSWORD]` yerine Adım 2'de oluşturduğunuz şifreyi yazın
- Şifrede özel karakterler varsa (örn: `@`, `#`, `%`), URL encoding yapmanız gerekebilir:
  - `@` → `%40`
  - `#` → `%23`
  - `%` → `%25`
  - `&` → `%26`
  - `=` → `%3D`

**Örnek:**
- Şifre: `MyP@ss#123`
- Encoded: `MyP%40ss%23123`
- Final URL: `postgresql://postgres:MyP%40ss%23123@db.xxxxx.supabase.co:5432/postgres`

### Adım 5: Connection Pooling (Önerilen - Vercel için)

Vercel gibi serverless ortamlar için connection pooling kullanmanız önerilir:

1. Supabase Dashboard → Settings → Database
2. **"Connection pooling"** bölümüne gidin
3. **"Connection string"** → **"URI"** sekmesine tıklayın
4. Bu string'i kullanın (port `6543` olacak):
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

**Örnek:**
```
postgresql://postgres.abcdefghijklmnop:mypassword123@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Adım 6: Vercel'e Ekleyin

1. Vercel Dashboard → Projeniz → Settings → Environment Variables
2. **Key**: `DATABASE_URL`
3. **Value**: Yukarıda hazırladığınız connection string'i yapıştırın
4. **Environment**: Production, Preview, Development (hepsini işaretleyin)
5. **"Add"** butonuna tıklayın

---

## Seçenek 2: Diğer PostgreSQL Sağlayıcıları

### Railway

1. [railway.app](https://railway.app) → Sign Up
2. New Project → PostgreSQL ekleyin
3. PostgreSQL servisinin üzerine tıklayın
4. **"Variables"** sekmesine gidin
5. `DATABASE_URL` değişkenini kopyalayın

### Neon

1. [neon.tech](https://neon.tech) → Sign Up
2. New Project oluşturun
3. Dashboard'da **"Connection Details"** bölümüne gidin
4. Connection string'i kopyalayın

### Render

1. [render.com](https://render.com) → Sign Up
2. New → PostgreSQL oluşturun
3. Dashboard'da **"Internal Database URL"** veya **"External Database URL"** kopyalayın

### Heroku Postgres

1. [heroku.com](https://heroku.com) → Sign Up
2. New App → Resources → Add-ons → Heroku Postgres
3. Postgres servisinin üzerine tıklayın
4. **"Settings"** → **"Database Credentials"** → Connection string'i kopyalayın

---

## Connection String Formatı

Genel format:
```
postgresql://[USERNAME]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
```

**Bileşenler:**
- `[USERNAME]`: Genellikle `postgres`
- `[PASSWORD]`: Veritabanı şifreniz
- `[HOST]`: Veritabanı sunucu adresi
- `[PORT]`: Genellikle `5432` (PostgreSQL default port)
- `[DATABASE]`: Veritabanı adı (genellikle `postgres`)

**Örnek:**
```
postgresql://postgres:mypassword123@db.example.com:5432/postgres
```

---

## Şifre Özel Karakterler URL Encoding

Eğer şifrenizde özel karakterler varsa, URL encoding yapmanız gerekir:

| Karakter | Encoded |
|----------|---------|
| `@` | `%40` |
| `#` | `%23` |
| `%` | `%25` |
| `&` | `%26` |
| `=` | `%3D` |
| `+` | `%2B` |
| ` ` (boşluk) | `%20` |
| `/` | `%2F` |
| `?` | `%3F` |

**Online URL Encoder:**
- [urlencoder.org](https://www.urlencoder.org)
- Sadece şifre kısmını encode edin, tüm URL'i değil

**Örnek:**
- Şifre: `MyP@ss#123`
- Encoded şifre: `MyP%40ss%23123`
- Final: `postgresql://postgres:MyP%40ss%23123@host:5432/db`

---

## Test Etme

Connection string'inizi test etmek için:

### Local'de Test

```bash
# psql ile test (eğer yüklüyse)
psql "postgresql://postgres:password@host:5432/postgres"

# veya Prisma ile test
npx prisma db pull
```

### Vercel'de Test

1. Environment variable'ı ekledikten sonra
2. Yeni bir deployment başlatın
3. Vercel Logs'u kontrol edin
4. Database connection hatası yoksa başarılı!

---

## Sorun Giderme

### "Connection refused" hatası

- Firewall ayarlarını kontrol edin
- Supabase'de "Allow connections from anywhere" seçeneğini açın
- IP whitelist kontrolü yapın

### "Password authentication failed"

- Şifrenin doğru olduğundan emin olun
- Özel karakterler varsa URL encoding yapın
- Şifreyi Supabase'de reset edebilirsiniz (Settings → Database → Reset database password)

### "Database does not exist"

- Database adının doğru olduğundan emin olun (genellikle `postgres`)
- Supabase'de default database `postgres`'tir

### Connection timeout

- Connection pooling kullanın (port 6543)
- Supabase'de connection pooling string'i kullanın

---

## Güvenlik İpuçları

1. ✅ **Şifreyi güvenli tutun** - Kimseyle paylaşmayın
2. ✅ **Environment variables'da saklayın** - Kodda hardcode etmeyin
3. ✅ **Connection pooling kullanın** - Serverless ortamlar için önemli
4. ✅ **IP restrictions ekleyin** - Mümkünse sadece Vercel IP'lerinden erişime izin verin
5. ✅ **Düzenli olarak şifre değiştirin** - Güvenlik için

---

## Özet: Supabase için Hızlı Adımlar

1. [supabase.com](https://supabase.com) → Sign Up
2. New Project → Şifre oluştur (kaydet!)
3. Settings → Database → Connection string → URI
4. Şifreyi connection string'e ekle
5. Vercel → Settings → Environment Variables → `DATABASE_URL` ekle
6. Connection pooling string'i kullan (port 6543)

**Key:** `DATABASE_URL`  
**Value:** `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true`

