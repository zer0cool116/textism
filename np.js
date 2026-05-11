export const npEffects = [
  {
    name: "zalgo corruption",
    apply: (el, text) => {
      el._zalgo = true;
      return text;
    }
  },

  {
    name: "fade",
    apply: (el, text) => {
      el.style.opacity = "0.4";
      return text;
    }
  },

  {
    name: "rotate",
    apply: (el, text) => {
      el.style.transform = "rotate(-4deg)";
      return text;
    }
  }
];
