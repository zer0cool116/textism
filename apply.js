import { state } from "../state.js";

import { basicEffects } from "../effects/basic.js";
import { ptEffects } from "../effects/pt.js";
import { npEffects } from "../effects/np.js";

export function applyEffects(el, text) {
  let out = text;

  // FONT
  if (state.activeFont !== null) {
    el.style.fontFamily = state.fonts[state.activeFont].css;
  }

  el.textContent = text;

  // BASIC
  state.activeBasic.forEach(i => {
    basicEffects[i]?.apply(el);
  });

  // PT
  state.activePT.forEach(i => {
    const e = ptEffects[i];
    if (!e) return;
    out = e.apply?.(el, out) ?? out;
  });

  // NP
  state.activeNP.forEach(i => {
    npEffects[i]?.apply(el, out);
  });

  return out;
}
