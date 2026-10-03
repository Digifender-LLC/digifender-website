import originalWorker from '../src/worker.js';
export default {
  async fetch(request,env) {
    const response = await originalWorker.fetch(request,env);
    const url = new URL(request.url);
    if (url.pathname==='/' || url.pathname==='/index.html') {
      response.headers.set('Content-Security-Policy',response.headers.get('Content-Security-Policy')+"; script-src 'self'");
      response.headers.set('Cache-Control','no-cache');
    }
    if (/^\/assets\/(site\.[a-f\d]{12}\.(css|js)|manrope\.ttf)$/.test(url.pathname)) {
      response.headers.set('Cache-Control','public, max-age=31536000, immutable');
    }
    return response;
  }
};
