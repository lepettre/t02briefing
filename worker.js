// Cloudflare Worker: reicht RSS-Feeds mit CORS-Header durch, damit die Seite sie abrufen kann.
// Nur freigegebene Hosts, nur GET. Im Cloudflare-Dashboard: Workers > Create > Code einfügen > Deploy.
// Aufruf: https://<dein-worker>.workers.dev/?url=https%3A%2F%2Fwww.spiegel.de%2Fschlagzeilen%2Findex.rss
const ALLOW = ['tagesschau.de', 'spiegel.de', 'zeit.de', 'sueddeutsche.de', 'deutschlandfunk.de', 'yle.fi', 'thelocal.se', 'thelocal.dk', 'thelocal.com'];

export default {
  async fetch(request) {
    const cors = { 'access-control-allow-origin': '*' };
    if (request.method === 'OPTIONS') return new Response(null, { headers: { ...cors, 'access-control-allow-methods': 'GET' } });
    const target = new URL(request.url).searchParams.get('url');
    if (!target) return new Response('url fehlt', { status: 400, headers: cors });
    let host;
    try { host = new URL(target).hostname; } catch (e) { return new Response('ungültige url', { status: 400, headers: cors }); }
    if (!ALLOW.some(a => host === a || host.endsWith('.' + a))) return new Response('Host nicht freigegeben', { status: 403, headers: cors });
    const r = await fetch(target, { headers: { 'user-agent': 'Mozilla/5.0 (Das Nötigste)' }, cf: { cacheTtl: 300, cacheEverything: true } });
    return new Response(r.body, { status: r.status, headers: { ...cors, 'content-type': r.headers.get('content-type') || 'application/xml', 'cache-control': 'public, max-age=300' } });
  }
};
