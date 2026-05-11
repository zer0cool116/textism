import { state } from "../state.js";

import { basicEffects } from "../effects/basic.js";
import { ptEffects }    from "../effects/pt.js";
import { npEffects }    from "../effects/np.js";

/* ── Zalgo character sets ── */
const zalgoUp   = ['\u030d','\u030e','\u0304','\u0305','\u033f','\u0311','\u0306','\u0310','\u0352','\u0357'];
const zalgoMid  = ['\u0334','\u0335','\u0336','\u034f','\u035c'];
const zalgoDown = ['\u0316','\u0317','\u0318','\u0319','\u0320'];

const pick = arr => arr[Math.floor(Math.random() * arr.length)];

function zalgoChar(c, intensity = 2) {
  let out = c;
  for (let j = 0; j < intensity; j++) out += pick(zalgoUp);
  for (let j = 0; j < intensity; j++) out += pick(zalgoMid);
  for (let j = 0; j < intensity; j++) out += pick(zalgoDown);
  return out;
}

function zalgoText(t) {
  return t.split("").map(c => c === " " ? c : zalgoChar(c)).join("");
}

/* ── Main apply function ── */
export function applyEffects(el, text) {
  let out = text;

  // Reset styles and flags
  el.style.cssText = "";
  el._zalgo = false;
  el._echo  = false;
  el.innerHTML = "";
  el.textContent = text;

  // FONT
  if (state.activeFont !== null) {
    el.style.fontFamily = state.fonts[state.activeFont].css;
  }

  // BASIC — style-only, no text transform
  state.activeBasic.forEach(i => {
    basicEffects[i]?.apply(el);
  });

  // PT — may return a transformed string
  state.activePT.forEach(i => {
    const e = ptEffects[i];
    if (!e) return;
    const result = e.apply(el, out);
    if (typeof result === "string") out = result;
  });

  // NP — may return a transformed string
  state.activeNP.forEach(i => {
    const e = npEffects[i];
    if (!e) return;
    const result = e.apply(el, out);
    if (typeof result === "string") out = result;
  });

  // Write final text (unless echo will handle it)
  if (!el._echo) {
    el.textContent = out;
  }

  // ── Post-processing: Zalgo ──
  if (el._zalgo) {
    // Cancel any previous animation loop
    if (el._zalgoFrame) cancelAnimationFrame(el._zalgoFrame);

    const base = out;
    const tick = () => {
      el.textContent = zalgoText(base);
      el._zalgoFrame = requestAnimationFrame(tick);
    };
    tick();
  }

  // ── Post-processing: Echo ripple ──
  if (el._echo) {
    el.innerHTML = "";
    [...out].forEach(c => {
      const span = document.createElement("span");
      span.textContent = c;
      span.style.display = "inline-block";
      span.onmouseenter = () => {
        span.animate(
          [{ transform: "scale(1)" }, { transform: "scale(1.6)" }, { transform: "scale(1)" }],
          { duration: 300, easing: "ease-out" }
        );
      };
      el.appendChild(span);
    });
  }

  return out;
}
