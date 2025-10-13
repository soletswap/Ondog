// Collections: Doc/ klasöründen (alt klasör yok) görselleri çek ve sadece görselleri göster.
// "Collections" başlığı haricinde metin yok.
(function () {
  const OWNER = 'soletswap';
  const REPO = 'Ondog';
  const PATH = 'Doc';
  const REF = 'main';
  const API_URL = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}?ref=${REF}`;
  const IMAGE_RE = /\.(jpe?g|png|gif|webp)$/i;

  const container = document.getElementById('collections');

  async function load() {
    try {
      const res = await fetch(`${API_URL}&_=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const files = (Array.isArray(data) ? data : [])
        .filter(e => e && e.type === 'file' && IMAGE_RE.test(e.name))
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

      const frag = document.createDocumentFragment();
      files.forEach(file => {
        const fig = document.createElement('figure');
        const img = document.createElement('img');
        img.loading = 'lazy';
        img.decoding = 'async';
        img.src = `Doc/${file.name}`;
        img.alt = '';
        img.addEventListener('error', () => fig.remove());
        fig.appendChild(img);
        frag.appendChild(fig);
      });

      container.innerHTML = '';
      container.appendChild(frag);
    } catch {
      // Sessizce geç; diğer bölümler görünsün
      container.innerHTML = '';
    }
  }

  load();
})();
