import { state } from "./state.js";
import { fonts } from "./fonts.js";

import { buildEffects } from "./ui/buildEffects.js";
import { renderPreview } from "./engine/render.js";

import { basicEffects } from "./effects/basic.js";
import { ptEffects } from "./effects/pt.js";
import { npEffects } from "./effects/np.js";

state.fonts = fonts;

/* UI */
buildEffects(basicEffects, "basic-grid", state.activeBasic);
buildEffects(ptEffects, "pt-grid", state.activePT);
buildEffects(npEffects, "np-grid", state.activeNP);

/* input */
document.getElementById("word-input")
  .addEventListener("input", renderPreview);

renderPreview();
