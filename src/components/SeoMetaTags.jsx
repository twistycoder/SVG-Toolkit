import { useHead } from '@unhead/react';

const BASE_URL = "https://svg-toolkit.vercel.app";

const SeoMetaTags = ({ title, description, url, keywords = [], ogImage = `${BASE_URL}/og-image.png` }) => {
  useHead({
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { name: 'keywords', content: keywords.join(', ') },
      { property: 'og:url', content: url },
      { property: 'og:image', content: ogImage }, // 🛑 Added Open Graph Image
      { name: 'twitter:card', content: 'summary_large_image' }, // 🛑 Added Twitter Card Type
      { name: 'keywords', content: keywords.join(', ') },
    ],
    link: [
      { rel: 'canonical', href: url },
    ],
    key: 'page-meta-tags'
  });

  return null; // No DOM render
};

export default SeoMetaTags;
