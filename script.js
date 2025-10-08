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
