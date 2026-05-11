import { state }         from "./state.js";
import { fonts }         from "./fonts.js";
import { buildEffects }  from "./ui/buildEffects.js";
import { renderPreview } from "./engine/render.js";

import { basicEffects }  from "./effects/basic.js";
import { ptEffects }     from "./effects/pt.js";
import { npEffects }     from "./effects/np.js";

// ── Seed fonts into shared state ──
state.fonts = fonts;

// ── Build font buttons ──
function buildFonts() {
  const container = document.getElementById("font-grid");
  if (!container) return;

  fonts.forEach((f, i) => {
    const btn = document.createElement("button");
    btn.className = "font-btn";
    btn.style.fontFamily = f.css;   // preview each font in its own face
    btn.textContent = f.name;

    btn.onclick = () => {
      container.querySelectorAll(".font-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.activeFont = i;
      renderPreview();
    };

    container.appendChild(btn);
  });
}

// ── Build effect grids ──
buildFonts();
buildEffects(basicEffects, "basic-grid", state.activeBasic);
buildEffects(ptEffects,    "pt-grid",    state.activePT,   "pt");
buildEffects(npEffects,    "np-grid",    state.activeNP,   "np");

// ── Clear button — resets everything ──
document.getElementById("btn-clear")?.addEventListener("click", () => {
  document.getElementById("word-input").value = "";
  state.activeFont = null;
  state.activeBasic.clear();
  state.activePT.clear();
  state.activeNP.clear();
  document.querySelectorAll(".font-btn, .eff-btn").forEach(b => b.classList.remove("active"));
  renderPreview();
});

// ── Input listener ──
document.getElementById("word-input")
  .addEventListener("input", renderPreview);

// ── Initial render ──
renderPreview();
