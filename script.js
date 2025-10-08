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

// Auto-gallery from GitHub Issues
(async function loadGalleryFromIssues() {
  const CACHE_KEY = 'ondog-gallery-cache';
  const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
  const REPO_OWNER = 'soletswap';
  const REPO_NAME = 'Ondog';
  
  // Check cache first
  const cached = localStorage.getItem(CACHE_KEY);
  let imageUrls = [];
  
  if (cached) {
    try {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        imageUrls = data;
      }
    } catch (e) {
      // Invalid cache, will fetch fresh
    }
  }
  
  // Fetch fresh data if no valid cache
  if (imageUrls.length === 0) {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?labels=gallery&state=open&per_page=100`
      );
      
      if (response.ok) {
        const issues = await response.json();
        
        // Extract image URLs from issue bodies
        for (const issue of issues) {
          if (!issue.body) continue;
          
          // Match <img> tags with src attribute
          const imgTagPattern = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
          let match;
          while ((match = imgTagPattern.exec(issue.body)) !== null) {
            const url = match[1];
            if (isValidImageUrl(url)) {
              imageUrls.push(url);
            }
          }
          
          // Match markdown image syntax ![alt](url)
          const mdImagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
          while ((match = mdImagePattern.exec(issue.body)) !== null) {
            const url = match[2];
            if (isValidImageUrl(url)) {
              imageUrls.push(url);
            }
          }
        }
        
        // Cache the results
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: imageUrls,
          timestamp: Date.now()
        }));
      }
    } catch (error) {
      console.warn('Failed to load gallery images from Issues:', error);
    }
  }
  
  // Build gallery
  const gallery = document.getElementById('dynamic-gallery');
  if (gallery && imageUrls.length > 0) {
    // Clear existing content (except noscript)
    const noscript = gallery.querySelector('noscript');
    gallery.innerHTML = '';
    if (noscript) gallery.appendChild(noscript);
    
    // Add images to gallery
    imageUrls.forEach(url => {
      const a = document.createElement('a');
      a.href = url;
      a.className = 'shot';
      
      const img = document.createElement('img');
      img.src = url;
      img.alt = 'Ondog gallery image';
      img.loading = 'lazy';
      
      a.appendChild(img);
      gallery.appendChild(a);
      
      // Add lightbox handler
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;z-index:50';
        overlay.innerHTML = `<img src="${url}" style="max-width:90vw;max-height:90vh;border-radius:12px;border:1px solid rgba(255,255,255,.2)"/>`;
        overlay.addEventListener('click', () => overlay.remove());
        document.body.appendChild(overlay);
      });
    });
    
    // Set hero fallback if hero image fails to load
    setupHeroFallback(imageUrls[0]);
  }
  
  function isValidImageUrl(url) {
    // Accept user-images.githubusercontent.com and standard http(s) URLs
    return url && (
      url.startsWith('https://user-images.githubusercontent.com/') ||
      url.startsWith('http://') ||
      url.startsWith('https://')
    ) && /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(url);
  }
  
  function setupHeroFallback(fallbackUrl) {
    if (!fallbackUrl) return;
    
    const heroImg = document.getElementById('hero-img');
    if (!heroImg) return;
    
    heroImg.addEventListener('error', function() {
      if (this.src !== fallbackUrl) {
        this.src = fallbackUrl;
      }
    }, { once: true });
  }
})();
