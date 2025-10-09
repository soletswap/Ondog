// Basit yıldız alanı animasyonu
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let W, H, stars;
function resize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  stars = Array.from({length: Math.min(400, Math.floor(W*H/6000))}, () => ({
    x: Math.random()*W,
    y: Math.random()*H,
    z: Math.random()*1 + .2,
    a: Math.random()*.5 + .3
  }));
}
function draw(){
  ctx.clearRect(0,0,W,H);
  for(const s of stars){
    ctx.fillStyle = `rgba(255,255,255,${s.a})`;
    ctx.fillRect(s.x, s.y, s.z*2, s.z*2);
    s.y += s.z * .35;
    if(s.y>H){ s.y = -2; s.x = Math.random()*W; }
  }
  requestAnimationFrame(draw);
}
window.addEventListener('resize', resize);
resize(); draw();

// Yapışkan başlık için küçük efekt
let lastY = 0;
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.style.boxShadow = y>10 ? '0 10px 30px rgba(0,0,0,.25)' : 'none';
  lastY = y;
});

// Koalisyon filtreleri
const pills = document.querySelectorAll('.pill');
const partnerCards = document.querySelectorAll('.partner-card');
pills.forEach(p => p.addEventListener('click', () => {
  pills.forEach(x => x.classList.remove('active'));
  p.classList.add('active');
  const f = p.dataset.filter;
  partnerCards.forEach(card => {
    const keep = f==='all' || card.dataset.tags.includes(f);
    card.style.display = keep ? '' : 'none';
  });
}));

// Koalisyon başvuru formu (demo önizleme)
const form = document.getElementById('joinForm');
const preview = document.getElementById('preview');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  preview.hidden = false;
  preview.innerHTML = `
    <strong>Başvuru Önizleme</strong>
    <div style="margin-top:8px">
      <div><b>Ad:</b> ${data.name}</div>
      <div><b>Kategori:</b> ${data.category}</div>
      <div><b>Açıklama:</b> ${data.desc}</div>
    </div>`;
  form.reset();
});

// Basit lightbox
document.querySelectorAll('.gallery .shot').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const src = a.getAttribute('href');
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;z-index:50';
    overlay.innerHTML = `<img src="${src}" style="max-width:90vw;max-height:90vh;border-radius:12px;border:1px solid rgba(255,255,255,.2)"/>`;
    overlay.addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);
  });
});

// Doc tabanlı otomatik galeri
(async function loadGalleryFromDoc() {
  const REPO_OWNER = 'soletswap';
  const REPO_NAME = 'Ondog';
  const REF = 'main';
  const BASE_PATH = 'Doc/images/collections';

  const gallery = document.getElementById('dynamic-gallery');
  if (!gallery) return;

  try {
    // Koleksiyon klasörlerini listele
    const collections = await listDir(BASE_PATH).catch(() => []);
    const dirs = (collections || []).filter(x => x.type === 'dir');

    // Her koleksiyon klasöründeki görselleri topla
    let items = [];
    for (const dir of dirs) {
      const files = await listDir(`${BASE_PATH}/${dir.name}`).catch(() => []);
      const imgs = (files || []).filter(f => isImage(f.name));
      for (const f of imgs) {
        items.push({
          url: f.download_url || toRawUrl(f.path),
          collection: dir.name,
          name: f.name
        });
      }
    }

    // Galeriyi inşa et
    if (items.length > 0) {
      const noscript = gallery.querySelector('noscript');
      gallery.innerHTML = '';
      if (noscript) gallery.appendChild(noscript);

      // Koleksiyona ve dosya adına göre sırala
      items.sort((a,b) => a.collection.localeCompare(b.collection) || a.name.localeCompare(b.name));

      for (const it of items) {
        const a = document.createElement('a');
        a.href = it.url;
        a.className = 'shot';
        a.dataset.collection = it.collection;

        const img = document.createElement('img');
        img.src = it.url;
        img.alt = `${it.collection} - ${it.name}`;
        img.loading = 'lazy';

        a.appendChild(img);
        gallery.appendChild(a);

        a.addEventListener('click', (e) => {
          e.preventDefault();
          const overlay = document.createElement('div');
          overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;z-index:50';
          overlay.innerHTML = `<img src="${it.url}" style="max-width:90vw;max-height:90vh;border-radius:12px;border:1px solid rgba(255,255,255,.2)"/>`;
          overlay.addEventListener('click', () => overlay.remove());
          document.body.appendChild(overlay);
        });
      }
    }
  } catch (err) {
    console.warn('Doc tabanlı galeriyi yükleme hatası:', err);
  }

  function isImage(name) {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(name);
  }

  async function listDir(path) {
    // Her segmenti encode edin, slash'ları koruyun
    const encodedPath = path.split('/').map(encodeURIComponent).join('/');
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${encodedPath}?ref=${REF}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`GitHub contents API hata: ${res.status}`);
    return res.json();
  }

  function toRawUrl(path) {
    return `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${REF}/${path}`;
  }
})();
