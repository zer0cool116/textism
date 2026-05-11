import { applyEffects } from "./apply.js";

export function renderPreview() {
  const el   = document.getElementById("preview-word");
  const text = document.getElementById("word-input").value || "your word";

  // Cancel any running zalgo loop before re-render
  if (el._zalgoFrame) {
    cancelAnimationFrame(el._zalgoFrame);
    el._zalgoFrame = null;
  }

  applyEffects(el, text);
}
