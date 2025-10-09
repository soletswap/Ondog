# Doc Klasörü

Bu klasör, Ondog projesi için görselleri barındırır.

## Yapı

```
images/
  logo/          # Marka/ürün logoları
  collections/   # Her koleksiyon ayrı alt klasör
    <koleksiyon-adi>/
      <koleksiyon-adi>-01.jpg
      <koleksiyon-adi>-02.jpg
```

## Kurallar

- Aynı koleksiyona daha fazla görsel eklemek için aynı koleksiyon klasörünü kullanın (ör. `collections/space/`).
- Tutarlılık için dosya adlarında koleksiyon adını önek olarak kullanın (ör. `space-01.jpg`, `space-02.jpg`).
- Desteklenen uzantılar: `.jpg/.jpeg/.png/.gif/.webp`

## Örnek Kullanım

- Kök README:
  ```markdown
  ![Ondog logo](./Doc/images/logo/ondog-logo.png)
  ![Space 01](./Doc/images/collections/space/space-01.jpg)
  ```

- Kök HTML (index.html vb.):
  ```html
  <img src="Doc/images/logo/ondog-logo.png" alt="Ondog logo" />
  <img src="Doc/images/collections/space/space-01.jpg" alt="Space 01" />
  ```
