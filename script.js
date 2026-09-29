const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// pause the video for people who prefer reduced motion
const bg = document.getElementById('bg');
if (reduce && bg) { bg.removeAttribute('autoplay'); bg.pause(); }
else if (bg) bg.play().catch(() => {});

// title: split into letters for the one-time reveal
const title = document.getElementById('title');
if (title) {
  const text = title.textContent;
  title.setAttribute('aria-label', text);
  title.textContent = '';
  [...text].forEach((ch, i) => {
    const s = document.createElement('span');
    s.textContent = ch;
    s.setAttribute('aria-hidden', 'true');
    s.style.animationDelay = `${0.15 + i * 0.07}s`;
    title.appendChild(s);
  });
}

// icon tilts toward the cursor
const icon = document.getElementById('icon');
if (icon && !reduce) {
  addEventListener('pointermove', e => {
    const x = (e.clientX / innerWidth - 0.5) * 2;
    const y = (e.clientY / innerHeight - 0.5) * 2;
    icon.style.transform = `perspective(600px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
  });
}

// snowfall
const canvas = document.getElementById('snow');
const ctx = canvas.getContext('2d');
let flakes = [], w, h, mx = 0;

function resize() {
  const dpr = devicePixelRatio || 1;
  w = innerWidth; h = innerHeight;
  canvas.width = w * dpr; canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = Math.min(160, Math.floor(w * h / 9000));
  flakes = Array.from({ length: count }, () => ({
    x: Math.random() * w, y: Math.random() * h,
    r: Math.random() * 2.6 + 0.6, v: Math.random() * 0.9 + 0.3,
    d: Math.random() * Math.PI * 2
  }));
}

function tick() {
  ctx.clearRect(0, 0, w, h);
  for (const f of flakes) {
    f.d += 0.01;
    f.y += f.v;
    f.x += Math.sin(f.d) * 0.5 + mx * f.r * 0.15;
    if (f.y > h + 5) { f.y = -5; f.x = Math.random() * w; }
    if (f.x > w + 5) f.x = -5;
    if (f.x < -5) f.x = w + 5;
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(228,242,255,${0.35 + f.r / 5})`;
    ctx.fill();
  }
  requestAnimationFrame(tick);
}

addEventListener('resize', resize);
addEventListener('pointermove', e => { mx = (e.clientX / innerWidth - 0.5) * 2; });
resize();
if (!reduce) tick();
