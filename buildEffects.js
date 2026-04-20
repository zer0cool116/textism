import { state } from "../state.js";
import { renderPreview } from "../engine/render.js";

export function buildEffects(list, containerId, set) {
  const container = document.getElementById(containerId);

  list.forEach((eff, i) => {
    const btn = document.createElement("button");
    btn.className = "eff-btn";
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
