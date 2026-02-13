(function initLandingStyle(global) {
  const body = global.document && global.document.body;
  if (!body || !body.classList.contains("landing-page")) return;

  const palette = [
    "47, 111, 204",   // blue
    "217, 71, 63",    // red
    "47, 143, 99",    // green
    "214, 133, 37",   // orange
    "33, 142, 156",   // teal
    "127, 94, 196",   // violet
  ];

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function pickDistinct(list, used) {
    const available = list.filter((item) => !used.includes(item));
    return pick(available.length ? available : list);
  }

  const root = global.document.documentElement;
  const used = [];
  const markerA = pickDistinct(palette, used);
  used.push(markerA);
  const markerB = pickDistinct(palette, used);
  used.push(markerB);
  const markerC = pickDistinct(palette, used);

  root.style.setProperty("--marker-a-rgb", markerA);
  root.style.setProperty("--marker-b-rgb", markerB);
  root.style.setProperty("--marker-c-rgb", markerC);

  global.document.querySelectorAll(".landing-page .module-card").forEach((card) => {
    card.style.setProperty("--card-marker-rgb", pick(palette));
    card.style.setProperty("--card-tape-rgb", pick(palette));
  });
})(window);
