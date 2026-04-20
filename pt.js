export const ptEffects = [
  {
    name: "TecHJuNKiE case",
    apply: (el, text) =>
      text.split('').map((c,i)=>
        i%3===0 ? c.toUpperCase() : c.toLowerCase()
      ).join('')
  },

  {
    name: "static noise",
    apply: (el) => {
      el.style.textShadow =
        "2px 0 #7ecfb3,-2px 0 #d4607a,0 0 10px rgba(255,255,255,0.2)";
    }
  },

  {
    name: "echo ripple",
    apply: (el) => {
      el._echo = true;
    }
  }
];
