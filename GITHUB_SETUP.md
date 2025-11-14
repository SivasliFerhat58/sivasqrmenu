# GitHub Repository Kurulumu

## Adım 1: GitHub'da Repository Oluştur

1. [GitHub.com](https://github.com) → Giriş yap
2. Sağ üst köşede **"+"** → **"New repository"**
3. Repository bilgileri:
   - **Repository name**: `qrmenu` (veya istediğiniz isim)
   - **Description**: "QR Menu - Next.js based restaurant menu system with subdomain support"
   - **Visibility**: Public veya Private (tercihinize göre)
   - **Initialize repository**: ❌ **BOŞLUK BIRAKMAYIN** (zaten kod var)
4. **"Create repository"** butonuna tıklayın

## Adım 2: Local Repository'yi GitHub'a Bağla

GitHub'da repository oluşturduktan sonra, size verilen komutları çalıştırın:

```bash
cd /home/sivasli_58/Documents/Projects/QrMenu

# GitHub'dan aldığınız URL'i kullanın (örnek):
git remote add origin https://github.com/KULLANICI_ADI/qrmenu.git

# Veya SSH kullanıyorsanız:
# git remote add origin git@github.com:KULLANICI_ADI/qrmenu.git

# Branch'i main olarak değiştir (GitHub default)
git branch -M main

# GitHub'a push yap
git push -u origin main
```

## Adım 3: Alternatif - Tek Komutla

Eğer GitHub CLI kuruluysa:

```bash
cd /home/sivasli_58/Documents/Projects/QrMenu
gh repo create qrmenu --public --source=. --remote=origin --push
```

## ✅ Kontrol

Push işleminden sonra GitHub'da repository'nizi açın ve tüm dosyaların yüklendiğini kontrol edin.

## 🔒 Güvenlik Notları

- `.env` dosyası `.gitignore`'da olduğu için yüklenmeyecek ✅
- `public/uploads/` dizini yüklenmeyecek ✅
- Hassas bilgiler (API keys, secrets) GitHub'a yüklenmeyecek ✅

## 📝 Sonraki Adımlar

1. GitHub repository oluştur
2. Remote ekle ve push yap
3. Vercel'e deploy için `VERCEL_DEPLOYMENT.md` dosyasına bakın


