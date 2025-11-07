import { useMemo } from 'react';

const BASE_URL = "https://svg-toolkit.vercel.app";

const SeoJsonLd = ({ pageName, pageUrl, breadcrumbs = [] }) => {
    const jsonLd = useMemo(() => {
        const itemListElements = breadcrumbs.map((crumb, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": crumb.name,
            "item": crumb.url
        }));

        return {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "WebSite",
                    "name": "SVG Toolkit",
                    "url": BASE_URL,
                    "description": "A comprehensive suite of SVG tools for developers and designers",
                    "publisher": {
                        "@type": "Organization",
                        "name": "SVG Toolkit",
                        "url": BASE_URL
                    }
                },
                {
                    "@type": "WebPage",
                    "name": pageName,
                    "url": pageUrl,
                    "description": "A comprehensive suite of SVG tools for developers and designers. Create, edit, optimize, and convert SVG graphics with ease.",
                    "breadcrumb": {
                        "@type": "BreadcrumbList",
                        "itemListElement": itemListElements
                    }
                }
            ]
        };
    }, [pageName, pageUrl, breadcrumbs]);

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
};

export default SeoJsonLd;