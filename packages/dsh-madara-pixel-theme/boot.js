const PIXEL_MADARA_ART = /* MADARA_FOREGROUND_VALUE */;
/* Local, silent intro. The progress is decorative, not backend readiness. */
function mountPixelBoot({ onClose = () => {} } = {}) {
  const ART = PIXEL_MADARA_ART;
  const previousFocus = document.activeElement;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const dialog = document.createElement('dialog');
  const timers = new Set();
  let closed = false;
  let closeTimer = null;
  dialog.className = 'madara-pixel-boot' + (motion.matches ? ' is-reduced' : '');
  dialog.setAttribute('aria-label', 'Harness 宇智波斑像素开机动画');
  dialog.setAttribute('aria-describedby', 'madara-pixel-boot-description');
  const blocks = '<i></i>'.repeat(24);
  // The iris is an independent vector layer behind the opaque character art.
  const texture = [];
  for (let y = -300; y <= 300; y += 10) for (let x = -300; x <= 300; x += 10) {
    const hash = ((x + 311) * 73 + (y + 317) * 151) % 29;
    if (Math.hypot(x,y) > 305 || hash > 9) continue;
    texture.push(`<rect x="${x}" y="${y}" width="${hash%3===0?10:5}" height="${hash%2===0?10:5}" fill="${['#b92f41','#eb4441','#c63843','#f34c41'][hash%4]}"/>`);
  }
  const tomoe = '<path d="M0-115C-49-115-67-139-64-180C-61-224-10-255 75-273C34-241 50-226 57-203C64-178 54-138 28-120C18-116 8-114 0-115Z"/>';
  const sharingan = `<svg class="madara-pixel-boot-sharingan" viewBox="0 0 1254 1254" shape-rendering="crispEdges" aria-hidden="true">
    <path fill="#091322" d="M0 0H1254V1254H0Z"/>
    <g transform="translate(956 310)">
      <circle r="343" fill="#080e1d"/><circle r="333" fill="#a62c3f"/><circle r="323" fill="#141628"/>
      <circle r="310" fill="#d73540"/><circle r="290" fill="#df373c"/>
      ${texture.join('')}
      <circle r="248" fill="none" stroke="#a32d3d" stroke-width="7"/>
      <circle r="124" fill="none" stroke="#ad3040" stroke-width="8"/>
      <circle r="64" fill="#070f20"/>
      <g class="madara-pixel-boot-sharingan-spin" fill="#070f20">${tomoe}<g transform="rotate(120)">${tomoe}</g><g transform="rotate(240)">${tomoe}</g></g>
    </g>
  </svg>`;
  dialog.innerHTML = `
    <div class="madara-pixel-boot-scene">
      <div class="madara-pixel-boot-horizon" aria-hidden="true"></div>
      <div class="madara-pixel-boot-card">
        <header class="madara-pixel-boot-top" aria-hidden="true">
          <span><i class="madara-pixel-boot-led"></i> DEEPSEEK / HARNESS</span><span>MADARA EDITION</span>
        </header>
        <div class="madara-pixel-boot-screen">
          <div class="madara-pixel-boot-art" aria-hidden="true">
            <div class="madara-pixel-boot-portrait-stack">
              ${sharingan}
              <img class="madara-pixel-boot-madara" src="${ART}" alt="" decoding="sync" draggable="false">
              <div class="madara-pixel-boot-eye-signal"></div>
            </div>
            <div class="madara-pixel-boot-art-shade"></div>
            <div class="madara-pixel-boot-scan"></div>
            <span class="madara-pixel-boot-art-label">UCHIHA / MADARA<span>うちは マダラ</span></span>
            <i class="madara-pixel-boot-corner madara-pixel-boot-corner-a"></i><i class="madara-pixel-boot-corner madara-pixel-boot-corner-b"></i>
          </div>
          <div class="madara-pixel-boot-console">
            <div class="madara-pixel-boot-edition" aria-hidden="true"><span class="madara-pixel-boot-emblem">◉</span> SHARINGAN / 03</div>
            <div class="madara-pixel-boot-wordmark" aria-hidden="true">HARNESS<span class="madara-pixel-boot-cursor">_</span></div>
            <p class="madara-pixel-boot-character">宇智波斑 <span>/ 写轮眼</span></p>
            <div class="madara-pixel-boot-rule" aria-hidden="true"><i></i><i></i><i></i></div>
            <p class="madara-pixel-boot-tagline">洞见想法，开启创造。</p>
            <div class="madara-pixel-boot-sequence" aria-hidden="true">
              <div class="madara-pixel-boot-status"><span class="madara-pixel-boot-stage">查克拉 · 汇聚</span><span class="madara-pixel-boot-count">01 / 03</span></div>
              <div class="madara-pixel-boot-meter"><div class="madara-pixel-boot-meter-empty">${blocks}</div><div class="madara-pixel-boot-meter-track">${blocks}</div></div>
            </div>
            <div class="madara-pixel-boot-console-note" aria-hidden="true"><span>PLAYER 01</span><span>READY TO CREATE</span></div>
          </div>
          <p id="madara-pixel-boot-description" class="madara-pixel-boot-sr-only">宇智波斑与写轮眼主题开场，约三秒后自动进入 Harness。按 Escape 或选择跳过，可立即结束动画。</p>
        </div>
        <footer class="madara-pixel-boot-bottom" aria-hidden="true">
          <span>PIXEL SYSTEM / 02</span><span class="madara-pixel-boot-footer-pips"><i></i><i></i><i></i></span><span>IDEAS INTO REALITY</span>
        </footer>
      </div>
      <button type="button" class="madara-pixel-boot-skip"><kbd>ESC</kbd><span>跳过动画</span><span aria-hidden="true">↗</span></button>
    </div>`;

  function after(fn, ms) {
    const timer = setTimeout(() => { timers.delete(timer); if (!closed) fn(); }, ms);
    timers.add(timer);
    return timer;
  }
  function dispose() {
    if (closed) return;
    closed = true;
    for (const timer of timers) clearTimeout(timer);
    timers.clear();
    motion.removeEventListener('change', onMotionChange);
    dialog.removeEventListener('cancel', onCancel);
    dialog.removeEventListener('close', dispose);
    dialog.remove();
    if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    onClose();
  }
  function finish() {
    if (closed || closeTimer !== null) return;
    if (motion.matches) { dispose(); return; }
    dialog.classList.add('is-leaving');
    closeTimer = after(dispose, 240);
  }
  function onCancel(event) { event.preventDefault(); dispose(); }
  function onMotionChange(event) { if (event.matches) dispose(); }
  dialog.querySelector('.madara-pixel-boot-skip').addEventListener('click', dispose);
  dialog.addEventListener('cancel', onCancel);
  dialog.addEventListener('close', dispose);
  motion.addEventListener('change', onMotionChange);
  document.body.appendChild(dialog);
  try { dialog.showModal(); } catch { dispose(); return () => {}; }
  after(() => {
    dialog.querySelector('.madara-pixel-boot-stage').textContent = '写轮眼 · 觉醒';
    dialog.querySelector('.madara-pixel-boot-count').textContent = '02 / 03';
    dialog.classList.add('is-awakened');
  }, 1050);
  after(() => {
    dialog.querySelector('.madara-pixel-boot-stage').textContent = 'HARNESS · 就绪';
    dialog.querySelector('.madara-pixel-boot-count').textContent = 'READY';
    dialog.classList.add('is-ready');
  }, 2250);
  after(finish, motion.matches ? 350 : 2800);
  // Independent hard stop: an intro must never trap the application.
  after(dispose, 4200);
  return dispose;
}
