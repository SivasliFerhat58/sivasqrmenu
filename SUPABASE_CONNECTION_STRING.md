# Supabase Connection String Bulamıyorsanız - Adım Adım Çözüm

Eğer Supabase'de Settings → Database'de connection string göremiyorsanız, bu rehber size yardımcı olacak.

## 🎯 Hızlı Çözüm: Manuel Oluşturma

Connection string'i bulamazsanız, manuel olarak oluşturabilirsiniz. İhtiyacınız olan bilgiler:

### Adım 1: PROJECT-REF'i Bulun

**Yöntem A: URL'den**
1. Supabase Dashboard'da projenizin URL'ine bakın
2. URL şu formatta olacak: `https://app.supabase.com/project/[PROJECT-REF]`
3. `[PROJECT-REF]` kısmını kopyalayın (örn: `abcdefghijklmnop`)

**Yöntem B: Settings → General**
1. Settings → **"General"** sekmesine gidin
2. **"Reference ID"** veya **"Project ID"** değerini kopyalayın

**Yöntem C: API Settings**
1. Settings → **"API"** sekmesine gidin
2. **"Project URL"** değerine bakın
3. URL'den project reference'ı çıkarın

### Adım 2: Database Şifrenizi Hatırlayın

- Proje oluştururken belirlediğiniz şifreyi kullanın
- Eğer unuttuysanız: Settings → Database → **"Reset database password"** ile yeni şifre oluşturun

### Adım 3: Connection String'i Oluşturun

**Format 1: Direct Connection (Port 5432)**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**Format 2: Connection Pooling (Port 6543) - Vercel için ÖNERİLEN**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Adım 4: Değerleri Yerleştirin

**Örnek:**
- PROJECT-REF: `abcdefghijklmnop`
- Password: `MyPassword123`
- Region: `us-west-1` (Settings → General'de görebilirsiniz)

**Direct Connection:**
```
postgresql://postgres:MyPassword123@db.abcdefghijklmnop.supabase.co:5432/postgres
```

**Connection Pooling (Önerilen):**
```
postgresql://postgres.abcdefghijklmnop:MyPassword123@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

---

## 📍 Connection String'i Nerede Bulabilirim? (Güncel Arayüz)

Supabase arayüzü zaman zaman değişebilir. İşte farklı yerler:

### Yer 1: Settings → Database → Connection Info

1. Sol menü → **Settings** (⚙️)
2. **"Database"** sekmesi
3. Sayfayı **aşağı kaydırın**
4. **"Connection info"** veya **"Connection parameters"** bölümünü arayın
5. **"Connection string"** butonuna tıklayın
6. **"URI"** sekmesine tıklayın

### Yer 2: Settings → Database → Connection Pooling

1. Settings → Database
2. Sayfayı **en aşağı kaydırın**
3. **"Connection pooling"** bölümünü bulun
4. **"Connection string"** → **"URI"** sekmesine tıklayın
5. Bu string'i kullanın (Vercel için en iyisi)

### Yer 3: Database → Connection Pooler

1. Sol menüden **"Database"** seçeneğine tıklayın
2. **"Connection Pooler"** sekmesine bakın
3. Connection string burada olabilir

### Yer 4: Table Editor → Connection Info

1. Sol menü → **"Table Editor"**
2. Sağ üstte **"..."** (üç nokta) menüsüne tıklayın
3. **"Connection info"** veya benzer bir seçenek arayın

---

## 🔍 Region Bilgisini Nasıl Bulurum?

Connection pooling string'inde region bilgisine ihtiyacınız var:

1. Settings → **"General"** sekmesine gidin
2. **"Region"** bilgisini bulun (örn: `West US (us-west-1)`)
3. Region kodunu not edin:
   - `West US` → `us-west-1`
   - `East US` → `us-east-1`
   - `Europe West` → `eu-west-1`
   - `Europe Central` → `eu-central-1`
   - `Asia Pacific` → `ap-southeast-1`

---

## ⚠️ Şifrede Özel Karakterler Varsa

Eğer şifrenizde özel karakterler varsa (`@`, `#`, `%`, vb.), URL encoding yapmanız gerekir:

| Karakter | Encoded |
|----------|---------|
| `@` | `%40` |
| `#` | `%23` |
| `%` | `%25` |
| `&` | `%26` |
| `=` | `%3D` |
| `+` | `%2B` |
| ` ` (boşluk) | `%20` |

**Örnek:**
- Şifre: `MyP@ss#123`
- Encoded: `MyP%40ss%23123`
- Final: `postgresql://postgres:MyP%40ss%23123@db.xxxxx.supabase.co:5432/postgres`

**Online Encoder:** [urlencoder.org](https://www.urlencoder.org)

---

## ✅ Test Etme

Connection string'inizi test etmek için:

### Local Test (Prisma ile)

1. `.env` dosyasına ekleyin:
   ```
   DATABASE_URL="postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres"
   ```

2. Test edin:
   ```bash
   npx prisma db pull
   ```

### Vercel'de Test

1. Vercel → Settings → Environment Variables
2. `DATABASE_URL` ekleyin
3. Yeni deployment başlatın
4. Logs'u kontrol edin

---

## 🆘 Hala Bulamıyorsanız

### Seçenek 1: Supabase Support

1. Supabase Dashboard → Sağ alt köşede **"Help"** butonuna tıklayın
2. **"Contact Support"** seçeneğini kullanın

### Seçenek 2: Supabase Discord

1. [discord.supabase.com](https://discord.supabase.com) → Join
2. #help kanalında sorun

### Seçenek 3: Manuel Oluşturma (Yukarıdaki Adım 1-4)

Manuel oluşturma yöntemi her zaman çalışır!

---

## 📝 Özet: Hızlı Manuel Oluşturma

1. **PROJECT-REF bul:** Settings → General → Reference ID (veya URL'den)
2. **Password hazırla:** Proje oluştururken belirlediğiniz şifre
3. **Region bul:** Settings → General → Region
4. **String oluştur:**
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
   ```
5. **Vercel'e ekle:** Settings → Environment Variables → `DATABASE_URL`

**Örnek Tam String:**
```
postgresql://postgres.abcdefghijklmnop:MyPassword123@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

---

## 💡 İpuçları

- ✅ Connection pooling kullanın (port 6543) - Vercel için daha iyi
- ✅ Şifreyi güvenli tutun - kimseyle paylaşmayın
- ✅ Region bilgisini doğru yazın
- ✅ Özel karakterler varsa URL encoding yapın
- ✅ Test etmeyi unutmayın

