/**
 * typewriter.js — Textism Typewriter Effect
 *
 * CUSTOMISATION — edit the config object below.
 */

(function () {
  /* ── CONFIG ───────────────────────────────────────────────── */
  const config = {
    // Strings to cycle through. Uses the current word-input value
    // as the first entry if it's non-empty, then falls back to these.
    strings: [
      'a writing effects playground',
      'type something beautiful',
      'glitch it. stretch it. break it.',
      'words are just shapes with feelings',
    ],

    typeSpeed:  65,   // ms per character while typing
    deleteSpeed: 32,  // ms per character while deleting
    pauseAfter: 2000, // ms to pause after a string is fully typed
    loop:       true, // cycle forever

    // If true, uses the active Textism font + effects on the typed text
    mirrorActiveFont: true,

    // Mount point — matches the id you put in your HTML
    mountId: 'tw-section',
  };

  /* ── INJECT STYLES ────────────────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
    #tw-section {
      margin-bottom: 2rem;
    }

    .tw-preview-wrap {
      min-height: 72px;
      border: 0.5px solid var(--border);
      border-radius: 8px;
      background: var(--bg2);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.25rem 1.5rem;
      overflow: hidden;
      position: relative;
    }

    .tw-preview-wrap::before {
      content: 'typewriter';
      position: absolute;
      top: 8px;
      right: 12px;
      font-family: var(--f-elec);
      font-size: 0.55rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--text3);
      pointer-events: none;
    }

    #tw-text {
      font-size: 1.6rem;
      font-family: var(--f-rock);
      color: var(--text);
      display: inline-block;
      max-width: 100%;
      word-break: break-all;
      text-align: center;
      transition: font-family 0.3s ease;
    }

    #tw-cursor {
      display: inline-block;
      width: 2px;
      height: 1.2em;
      background: var(--text2);
      margin-left: 3px;
      vertical-align: text-bottom;
      animation: tw-blink 1s step-end infinite;
      border-radius: 1px;
    }

    @keyframes tw-blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0; }
    }

    .tw-controls-row {
      display: flex;
      gap: 6px;
      margin-top: 6px;
      flex-wrap: wrap;
    }

    .tw-ctrl-btn {
      background: transparent;
      border: 0.5px solid var(--border-hover);
      color: var(--text2);
      font-family: var(--f-elec);
      font-size: 0.6rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
    }
    .tw-ctrl-btn:hover  { background: var(--bg3); color: var(--text); }
    .tw-ctrl-btn.active { background: var(--bg3); color: var(--text); border-color: rgba(255,255,255,0.3); }
  `;
  document.head.appendChild(style);

  /* ── BUILD DOM ────────────────────────────────────────────── */
  const mount = document.getElementById(config.mountId);
  if (!mount) return; // bail silently if mount point missing

  mount.innerHTML = `
    <div class="tw-preview-wrap">
      <span id="tw-text"></span><span id="tw-cursor"></span>
    </div>
    <div class="tw-controls-row">
      <button class="tw-ctrl-btn active" id="tw-btn-loop">loop: on</button>
      <button class="tw-ctrl-btn" id="tw-btn-pause">pause</button>
      <button class="tw-ctrl-btn" id="tw-btn-restart">restart</button>
    </div>
  `;

  /* ── STATE ────────────────────────────────────────────────── */
  const textEl   = document.getElementById('tw-text');
  const loopBtn  = document.getElementById('tw-btn-loop');
  const pauseBtn = document.getElementById('tw-btn-pause');
  const restBtn  = document.getElementById('tw-btn-restart');

  let strings     = [...config.strings];
  let si          = 0;      // string index
  let ci          = 0;      // char index
  let deleting    = false;
  let paused      = false;
  let looping     = config.loop;
  let timer       = null;

  /* ── SYNC FONT WITH ACTIVE TEXTISM SELECTION ──────────────── */
  function syncFont() {
    if (!config.mirrorActiveFont) return;
    // Reads the globally-scoped activeFont variable from textism's main script
    try {
      const af = window._twGetActiveFont ? window._twGetActiveFont() : null;
      if (af && typeof af === 'object') {
        textEl.style.fontFamily = af.css;
      } else if (af !== null && af !== undefined && typeof window._twFonts !== 'undefined') {
        textEl.style.fontFamily = window._twFonts[af]?.css || '';
      } else {
        textEl.style.fontFamily = '';
      }
    } catch (_) {}
  }

  /* ── TICK ─────────────────────────────────────────────────── */
  function tick() {
    if (paused) return;

    // Prepend the current word-input value as the first string
    const wordInput = document.getElementById('word-input');
    if (wordInput && wordInput.value.trim()) {
      strings = [wordInput.value.trim(), ...config.strings];
    } else {
      strings = [...config.strings];
    }

    const s = strings[si] || '';
    syncFont();

    if (!deleting) {
      textEl.textContent = s.slice(0, ci + 1);
      ci++;
      if (ci > s.length) {
        // Finished typing — pause then delete
        if (!looping && si === strings.length - 1) return; // stop at last
        deleting = true;
        timer = setTimeout(tick, config.pauseAfter);
        return;
      }
    } else {
      textEl.textContent = s.slice(0, ci - 1);
      ci--;
      if (ci <= 0) {
        deleting = false;
        si = (si + 1) % strings.length;
        ci = 0;
      }
    }

    timer = setTimeout(tick, deleting ? config.deleteSpeed : config.typeSpeed);
  }

  /* ── CONTROLS ─────────────────────────────────────────────── */
  function restart() {
    clearTimeout(timer);
    si = 0; ci = 0; deleting = false;
    textEl.textContent = '';
    tick();
  }

  loopBtn.addEventListener('click', () => {
    looping = !looping;
    loopBtn.textContent = `loop: ${looping ? 'on' : 'off'}`;
    loopBtn.classList.toggle('active', looping);
  });

  pauseBtn.addEventListener('click', () => {
    paused = !paused;
    pauseBtn.textContent = paused ? 'resume' : 'pause';
    pauseBtn.classList.toggle('active', paused);
    if (!paused) tick();
  });

  restBtn.addEventListener('click', restart);

  /* ── EXPOSE HELPERS for textism main script ───────────────── */

  window._twRestart = restart;

  /* ── KICK OFF ─────────────────────────────────────────────── */
  tick();
})();
