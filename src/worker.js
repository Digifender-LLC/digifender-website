const securityHeaders = {
  'Content-Security-Policy': "default-src 'none'; style-src 'self'; img-src 'self'; font-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '0',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), browsing-topics=()',
};
const hsts = 'max-age=31536000; includeSubDomains';
const headersFor = (isHttps, extra = {}) => ({
  ...securityHeaders,
  ...(isHttps ? { 'Strict-Transport-Security': hsts } : {}),
  ...extra,
});

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const isHttps = url.protocol === 'https:';
    if (url.hostname === 'www.digifender.com' || (url.hostname === 'digifender.com' && url.protocol !== 'https:')) {
      url.hostname = 'digifender.com';
      url.protocol = 'https:';
      url.port = '';
      return new Response(null, { status: 308, headers: headersFor(isHttps, { Location: url.href }) });
    }
    if (!['GET', 'HEAD'].includes(request.method)) {
      return new Response('Method not allowed', { status: 405, headers: headersFor(isHttps, { Allow: 'GET, HEAD' }) });
    }
    const asset = await env.ASSETS.fetch(request);
    const response = new Response(asset.body, asset);
    for (const [name, value] of Object.entries(headersFor(isHttps))) response.headers.set(name, value);
    const printable = url.pathname.startsWith('/legal/') && url.pathname.endsWith('/print');
    const pdf = url.pathname.startsWith('/legal/') && url.pathname.endsWith('.pdf');
    if (printable) {
      response.headers.set('Content-Security-Policy', securityHeaders['Content-Security-Policy'] + "; script-src 'self'");
    }
    if (pdf && response.status === 200) {
      response.headers.set('Content-Type', 'application/pdf');
      const filename = 'digifender-' + url.pathname.slice(7).replaceAll('/', '-');
      response.headers.set('Content-Disposition', `attachment; filename="${filename}"`);
      response.headers.set('Link', `<https://digifender.com${url.pathname.slice(0, -4)}>; rel="canonical"`);
    }
    if (printable || pdf || /^\/legal\/(whumpo|chapelcloud|labthrift|openhost)\//.test(url.pathname) || url.pathname === '/legal/terms' || response.status === 404) {
      response.headers.set('X-Robots-Tag', 'noindex');
    }
    return response;
  },
};
