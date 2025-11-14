# 🚀 Projeyi Çalıştırma Rehberi

## Hızlı Başlangıç

### 1. Terminali Açın
```bash
cd /home/sivasli_58/Documents/Projects/QrMenu
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Ortam Değişkenlerini Kontrol Edin
`.env` dosyasının var olduğundan emin olun. Yoksa:
```bash
cp .env.example .env
```
Sonra `.env` dosyasını düzenleyip değerleri doldurun.

### 4. PostgreSQL'i Başlatın
```bash
sudo systemctl start postgresql
```

### 5. Veritabanı Migrasyonlarını Çalıştırın
```bash
npx prisma migrate dev --name init
```

### 6. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```

### 7. Tarayıcıda Açın
- **Ana Sayfa**: http://localhost:3000
- **Giriş Sayfası**: http://localhost:3000/auth/signin

## Giriş Bilgileri

**Admin Kullanıcı:**
- Email: `admin@qrmenu.com`
- Şifre: `admin123`

## Önemli Notlar

- Sunucuyu durdurmak için terminalde `Ctrl + C` tuşlarına basın
- Kod değişikliklerinde Next.js otomatik olarak sayfayı yeniler
- Hata alırsanız terminal çıktısını kontrol edin

## Sorun Giderme

### PostgreSQL bağlantı hatası
```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
```

### Port 3000 kullanımda
Farklı bir port kullanmak için:
```bash
PORT=3001 npm run dev
```

### Prisma hatası
```bash
npx prisma generate
npx prisma migrate dev
```

