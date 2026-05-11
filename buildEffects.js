import { state }         from "../state.js";
import { renderPreview } from "../engine/render.js";

/**
 * @param {Array}  list        — effect definitions [{name, apply}, ...]
 * @param {string} containerId — id of the grid element
 * @param {Set}    set         — the active-index set from state
 * @param {string} [type]      — optional CSS class to add ("pt" | "np")
 */
export function buildEffects(list, containerId, set, type = "") {
  const container = document.getElementById(containerId);
  if (!container) return;

  list.forEach((eff, i) => {
    const btn = document.createElement("button");
    btn.className = "eff-btn" + (type ? ` ${type}` : "");
    btn.textContent = eff.name;

    btn.onclick = () => {
      if (set.has(i)) {
        set.delete(i);
        btn.classList.remove("active");
      } else {
        set.add(i);
        btn.classList.add("active");
      }
      renderPreview();
    };

    container.appendChild(btn);
  });
}
