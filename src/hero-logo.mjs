import { readFileSync } from 'node:fs';

// Build-time inline copy: the approved SVG remains the geometry source of truth.
// Only this copy exposes its ridges to the hero's CSS animation.
export const heroLogo = readFileSync(new URL('../public/brand/digifender-symbol-glacier.svg', import.meta.url), 'utf8')
  .replace(/<\?xml[^>]*\?>\s*/, '')
  .replace('<svg ', '<svg class="hero-symbol" aria-hidden="true" focusable="false" ')
  .replace(/<title>[\s\S]*?<\/title>/, '')
  .replace(/<linearGradient id="signature"[\s\S]*?<\/linearGradient>/, '')
  .replaceAll('id="glacier"', 'id="hero-glacier"')
  .replaceAll('url(#glacier)', 'url(#hero-glacier)')
  .replace('</defs>', '</defs><g class="hero-logo-motion">')
  .replace('</svg>', '</g></svg>')
  .replaceAll('<path data-ridge=', '<path class="hero-ridge" pathLength="100" data-ridge=');
