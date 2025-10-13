// Doc/ dizinini GitHub API'den okuyup yalnızca görselleri (alt klasör yok) gride basar.
// Metin, açıklama veya caption yok; sadece "Collections" başlığı ve görseller.
(function () {
  const OWNER = 'soletswap';
  const REPO = 'Ondog';
  const PATH = 'Doc';
  const REF = 'main';
  const API_URL = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}?ref=${REF}`;
  const IMAGE_RE = /\.(jpe?g|png|gif|webp)$/i;

  const gallery = document.getElementById('gallery');

  async function loadImages() {
    try {
      const res = await fetch(`${API_URL}&_=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const files = (Array.isArray(data) ? data : [])
        .filter(e => e && e.type === 'file' && IMAGE_RE.test(e.name))
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

      const frag = document.createDocumentFragment();
      files.forEach(file => {
        const img = document.createElement('img');
        img.loading = 'lazy';
        img.decoding = 'async';
        img.src = `Doc/${file.name}`;
        img.alt = '';
        img.addEventListener('error', () => img.remove());
        frag.appendChild(img);
      });

      gallery.innerHTML = '';
      gallery.appendChild(frag);
    } catch (e) {
      // Hata durumda metin göstermiyoruz; sayfa boş kalır (sadece başlık görünür).
      console.error('Gallery load error:', e);
      gallery.innerHTML = '';
    }
  }

  loadImages();
})();
