(function () {
  // Doc/ içeriğini GitHub API'den okuyup sadece görselleri listele (alt klasör YOK)
  const OWNER = 'soletswap';
  const REPO = 'Ondog';
  const PATH = 'Doc';
  const REF = 'main';
  const API_URL = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}?ref=${REF}`;

  const container = document.getElementById('collections');
  const IMAGE_RE = /\.(jpe?g|png|gif|webp)$/i;
  const EXCLUDE = ['README.md']; // Gerekirse buraya hariç tutulacak dosyaları ekleyin

  function createEl(tag, cls) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    return el;
  }

  function render(images) {
    if (!images.length) {
      container.innerHTML = '<p class="muted">Doc/ içinde henüz görsel yok. Görselleri doğrudan Doc/ klasörüne yükleyin.</p>';
      return;
    }

    const section = createEl('div', 'collection');
    const h3 = createEl('h3'); h3.textContent = 'Gallery';
    const grid = createEl('div', 'grid');

    images.forEach(file => {
      const fig = document.createElement('figure');
      const img = document.createElement('img');
      const cap = document.createElement('figcaption');

      img.loading = 'lazy';
      img.decoding = 'async';
      img.src = `Doc/${file.name}`;
      img.alt = file.name;

      // Kırık görseli gizle
      img.addEventListener('error', () => { fig.remove(); });

      cap.textContent = file.name;

      fig.appendChild(img);
      fig.appendChild(cap);
      grid.appendChild(fig);
    });

    section.appendChild(h3);
    section.appendChild(grid);
    container.innerHTML = '';
    container.appendChild(section);
  }

  async function load() {
    try {
      const res = await fetch(`${API_URL}&_=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // data: [{name, path, type, download_url, ...}, ...]
      const images = (Array.isArray(data) ? data : [])
        .filter(e => e && e.type === 'file')
        .filter(e => IMAGE_RE.test(e.name))
        .filter(e => !EXCLUDE.includes(e.name))
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

      render(images);
    } catch (err) {
      container.innerHTML = '<p class="muted">Doc/ içeriklerini yükleyemedim. Lütfen sayfayı yenileyin (Ctrl/Cmd+Shift+R).</p>';
    }
  }

  load();
})();
