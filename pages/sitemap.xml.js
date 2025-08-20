export async function getServerSideProps({ res }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wapifood.com';

  // Rutas principales públicas del sitio
  const staticPaths = [
    '/',                 // Home
    '/clientmenu',
    '/menu',
    '/puntodeventa',
    '/planesdeventa',
  ];

  // TODO: si necesitas incluir menús públicos por UUID:
  // const uuids = await fetch(...).then(r => r.json());
  // const dynamicPaths = uuids.map(u => `/webmenu/${u}`);

  const allPaths = staticPaths; // .concat(dynamicPaths)

  const lastmod = new Date().toISOString();
  const urls = allPaths
    .map(
      (path) => `
    <url>
      <loc>${baseUrl}${path}</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${path === '/' ? '1.0' : '0.8'}</priority>
    </url>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;

  // Headers más estrictos
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=600');
  res.setHeader('Content-Length', Buffer.byteLength(xml, 'utf8'));

  // Enviar en una sola llamada
  res.end(xml);

  return { props: {} };
}

export default function Sitemap() {
  return null;
}