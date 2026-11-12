const $ = id => document.getElementById(id);

function safeText(s) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function linkItem([name, url]) {
  const a = document.createElement("a");
  a.className = "item";
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.innerHTML = `<span>${safeText(name)}</span><span class="arrow">↗</span>`;
  return a;
}

function copyItem(value) {
  const b = document.createElement("button");
  b.className = "item";
  b.type = "button";
  b.innerHTML = `<span>${safeText(value)}</span><span class="copy">COPY</span>`;
  b.addEventListener("click", () => copy(value));
  return b;
}

links.forEach(x => $("links").appendChild(linkItem(x)));
emails.forEach(x => $("emails").appendChild(copyItem(x)));
phrases.forEach(x => $("phrases").appendChild(copyItem(x)));

async function copy(value) {
  try {
    await navigator.clipboard.writeText(value);
  } catch (e) {
    const t = document.createElement("textarea");
    t.value = value;
    document.body.appendChild(t);
    t.select();
    document.execCommand("copy");
    t.remove();
  }

  const toast = $("toast");
  toast.textContent = "COPIED  •  " + value;
  toast.classList.add("show");

  clearTimeout(window._toast);
  window._toast = setTimeout(
    () => toast.classList.remove("show"),
    1800
  );
}

// Animated starfield with subtle connecting lines
const c = $("stars");
const g = c.getContext("2d");

let W, H, stars = [];

function resize() {
  W = c.width = innerWidth;
  H = c.height = innerHeight;

  stars = Array.from({
    length: Math.min(105, Math.floor(W / 9))
  }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.35 + .25,
    vx: (Math.random() - .5) * .22,
    vy: Math.random() * .22 + .035,
    a: Math.random() * .55 + .12,
    tw: Math.random() * 6.28
  }));
}

function frame() {
  g.clearRect(0, 0, W, H);

  for (let i = 0; i < stars.length; i++) {
    let p = stars[i];

    p.x += p.vx;
    p.y += p.vy;
    p.tw += .018;

    if (p.y > H + 3) {
      p.y = -3;
      p.x = Math.random() * W;
    }

    if (p.x < 0) p.x = W;
    if (p.x > W) p.x = 0;

    let alpha = p.a * (.7 + .3 * Math.sin(p.tw));

    g.beginPath();
    g.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    g.fillStyle = `rgba(157,194,255,${alpha})`;
    g.shadowBlur = 8;
    g.shadowColor = "#609cff";
    g.fill();

    for (let j = i + 1; j < stars.length; j++) {
      let q = stars[j];
      let dx = p.x - q.x;
      let dy = p.y - q.y;
      let dist = Math.hypot(dx, dy);

      if (dist < 105) {
        g.beginPath();
        g.moveTo(p.x, p.y);
        g.lineTo(q.x, q.y);
        g.strokeStyle =
          `rgba(100,150,255,${(1 - dist / 105) * .075})`;
        g.lineWidth = .6;
        g.stroke();
      }
    }
  }

  requestAnimationFrame(frame);
}

addEventListener("resize", resize);
resize();
frame();

// Pointer glow and short-lived click ripples
const glow = $("cursorGlow");

addEventListener("pointermove", e => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

addEventListener("pointerdown", e => {
  const r = document.createElement("span");

  r.style.cssText = `
    position:fixed;
    left:${e.clientX}px;
    top:${e.clientY}px;
    width:8px;
    height:8px;
    border:1px solid rgba(143,194,255,.8);
    border-radius:50%;
    transform:translate(-50%,-50%);
    pointer-events:none;
    z-index:30;
    animation:ripple .65s ease-out forwards
  `;

  document.body.appendChild(r);
  setTimeout(() => r.remove(), 700);
});

const style = document.createElement("style");
style.textContent = `
  @keyframes ripple {
    to {
      width:75px;
      height:75px;
      opacity:0;
      border-color:rgba(143,194,255,0)
    }
  }
`;

document.head.appendChild(style);
