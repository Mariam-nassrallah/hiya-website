// Stops the page from scrolling behind a full-screen menu, modal or drawer.
//
// The lock goes on <html>, not <body>: because <html> has overflow-x: clip,
// an overflow: hidden on <body> alone would not stop the page from scrolling.
// A counter makes nested overlays safe (e.g. a modal opened while the menu is open).
//
// On computers with a classic scrollbar, hiding it would make the page and the
// fixed navbar jump sideways. So we measure the scrollbar first and keep that
// space as padding (--scrollbar-w, used in global.css and navbar.css) while
// locked. On phones the scrollbar takes no space, so this is 0.
let locks = 0;

export function lockScroll() {
  locks += 1;
  if (locks !== 1) return;
  const root = document.documentElement;
  root.style.setProperty('--scrollbar-w', `${window.innerWidth - root.clientWidth}px`);
  root.classList.add('scroll-locked');
}

export function unlockScroll() {
  if (locks === 0) return;
  locks -= 1;
  if (locks !== 0) return;
  const root = document.documentElement;
  root.classList.remove('scroll-locked');
  root.style.removeProperty('--scrollbar-w');
}
