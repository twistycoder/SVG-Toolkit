// Utility to generate sitemap (for future use)
export const generateSitemap = () => {
  const baseUrl = 'https://svg-toolkit.vercel.app';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const pages = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/text-to-svg', priority: '0.9', changefreq: 'monthly' },
    { path: '/svg-to-code', priority: '0.9', changefreq: 'monthly' },
    { path: '/svg-editor', priority: '0.9', changefreq: 'monthly' },
    { path: '/svg-optimizer', priority: '0.9', changefreq: 'monthly' },
    { path: '/svg-to-react', priority: '0.9', changefreq: 'monthly' },
    { path: '/background-generator', priority: '0.8', changefreq: 'monthly' },
    { path: '/animation-creator', priority: '0.8', changefreq: 'monthly' },
    { path: '/path-editor', priority: '0.8', changefreq: 'monthly' },
    { path: '/svg-to-image', priority: '0.9', changefreq: 'monthly' },
    { path: '/icon-customizer', priority: '0.8', changefreq: 'monthly' },
    { path: '/code-formatter', priority: '0.8', changefreq: 'monthly' },
    { path: '/metadata-editor', priority: '0.8', changefreq: 'monthly' },
    { path: '/gradient-generator', priority: '0.8', changefreq: 'monthly' },
    { path: '/filter-effects', priority: '0.8', changefreq: 'monthly' },
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
</urlset>`;
};