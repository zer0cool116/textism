import { applyEffects } from "./apply.js";

export function renderPreview(state) {
  const el = document.getElementById("preview-word");
  const text = document.getElementById("word-input").value || "your word";

  el._echo = false;
  el._zalgo = false;

  applyEffects(el, text);
}
