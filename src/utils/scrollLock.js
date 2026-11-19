// Stops the page from scrolling behind a full-screen menu, modal or drawer.
//
// The lock goes on <html>, not <body>: because <html> has overflow-x: clip,
// an overflow: hidden on <body> alone would not stop the page from scrolling.
// A counter makes nested overlays safe (e.g. a modal opened while the menu is open).
let locks = 0;

export function lockScroll() {
  locks += 1;
  if (locks === 1) document.documentElement.classList.add('scroll-locked');
}

export function unlockScroll() {
  if (locks === 0) return;
  locks -= 1;
  if (locks === 0) document.documentElement.classList.remove('scroll-locked');
}
