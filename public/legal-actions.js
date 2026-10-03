// A printable document also works without JavaScript through the browser's Print menu.
if (document.body.classList.contains('print-page') && typeof window.print === 'function') {
  const button = document.querySelector('button[data-print]');
  if (button) {
    button.hidden = false;
    button.addEventListener('click', () => window.print());
  }
}
