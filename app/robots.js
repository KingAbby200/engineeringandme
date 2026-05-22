export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://engineeringtutorials.com';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/dashboard', '/profile'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
