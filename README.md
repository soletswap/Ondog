# Ondog

## Görsel Yönetimi (Doc tabanlı)

Tüm görseller depoda `Doc` klasörü altında tutulur.

Dizin yapısı:
```
Doc/
  images/
    logo/          # Marka/ürün logoları
    collections/   # Koleksiyon görselleri; her koleksiyon ayrı bir alt klasör
      space/
        space-01.jpg
        space-02.jpg
      city/
        city-01.png
```

Kullanım örnekleri:

- Kök README’den logo:
  ```markdown
  ![Ondog logo](./Doc/images/logo/ondog-logo.png)
  ```

- Kök HTML dosyasından:
  ```html
  <img src="Doc/images/logo/ondog-logo.png" alt="Ondog logo" />
  <img src="Doc/images/collections/space/space-01.jpg" alt="Space 01" />
  ```

Galeri otomasyonu:
- Web sitesi, `Doc/images/collections` dizinindeki tüm alt klasörleri otomatik olarak tarar ve bu klasörlerdeki `.jpg/.jpeg/.png/.gif/.webp` görselleri galeriye ekler.
- Aynı koleksiyona yeni görsel eklemek için ilgili koleksiyon klasörüne dosyayı atmanız yeterli (ör. `Doc/images/collections/space/space-03.jpg`).
- Öneri: Dosya adlarında koleksiyon adını önek olarak kullanın (örn. `space-01.jpg`), tutarlılık sağlar.

Kalite önerileri:
- Boyut: 200–400 KB hedefleyin
- Genişlik: 1600–2000 px çoğu kullanım için yeterli
- Format: JPG/PNG/WebP (şeffaflık için PNG/WebP)

Not: Issues tabanlı galeri akışı kaldırılmıştır.
