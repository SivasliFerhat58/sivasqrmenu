# PWA (Progressive Web App) Kurulumu

Bu proje PWA desteği ile yapılandırılmıştır. Kullanıcılar uygulamayı cihazlarına yükleyebilir ve offline kullanabilirler.

## Kurulum Adımları

### 1. Icon Dosyalarını Oluşturma

PWA için icon dosyaları gereklidir. Aşağıdaki dosyaları oluşturun:

- `/public/icon-192.png` - 192x192 piksel
- `/public/icon-512.png` - 512x512 piksel

**Önerilen Yöntemler:**

1. **Online Araçlar:**
   - [RealFaviconGenerator](https://realfavicongenerator.net/)
   - [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator)

2. **Manuel Oluşturma:**
   - Mevcut `icon.svg` dosyasını kullanarak PNG'ye dönüştürün
   - İkonlar maskable olmalıdır (kenarlarda padding olmalı)

3. **Sharp ile (Node.js):**
   ```bash
   npm install sharp
   node scripts/generate-icons.js
   ```

### 2. Manifest Dosyası

Manifest dosyası `/public/manifest.json` konumunda mevcuttur. Gerekirse özelleştirebilirsiniz:

- `name`: Uygulama adı
- `short_name`: Kısa ad
- `theme_color`: Tema rengi
- `background_color`: Arka plan rengi

### 3. Service Worker

Service Worker `/public/sw.js` konumunda mevcuttur. Offline desteği ve cache yönetimi için kullanılır.

**Özellikler:**
- Sayfaları cache'ler
- Offline durumunda offline sayfası gösterir
- Network-first stratejisi kullanır

### 4. Test Etme

1. **Development:**
   ```bash
   npm run dev
   ```
   - Service Worker sadece production modunda çalışır

2. **Production Build:**
   ```bash
   npm run build
   npm start
   ```

3. **Tarayıcıda Test:**
   - Chrome DevTools > Application > Service Workers
   - Chrome DevTools > Application > Manifest
   - Network tab'ında "Offline" modunu test edin

### 5. Yükleme

Kullanıcılar uygulamayı şu şekilde yükleyebilir:

**Mobil:**
- Chrome/Edge: Menü > "Ana ekrana ekle"
- Safari (iOS): Paylaş > "Ana Ekrana Ekle"

**Desktop:**
- Chrome/Edge: Adres çubuğundaki yükleme ikonuna tıklayın

## Özellikler

✅ Offline desteği
✅ Ana ekrana ekleme
✅ Standalone mod (tam ekran)
✅ Cache yönetimi
✅ Responsive tasarım
✅ Apple Touch Icon desteği

## Notlar

- Service Worker sadece HTTPS veya localhost'ta çalışır
- Production build'de Service Worker otomatik olarak kaydedilir
- Icon dosyaları eksikse PWA özellikleri tam çalışmayabilir
- Manifest dosyasındaki icon yollarını kontrol edin

## Sorun Giderme

**Service Worker kaydedilmiyor:**
- Production modunda çalıştığınızdan emin olun
- HTTPS kullanıyorsanız sertifika geçerli olmalı

**Icon görünmüyor:**
- Icon dosyalarının `/public` klasöründe olduğundan emin olun
- Dosya isimlerinin doğru olduğunu kontrol edin

**Offline çalışmıyor:**
- Service Worker'ın kaydedildiğini kontrol edin
- Cache'in dolu olduğundan emin olun

