import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = 'Precision Detailing - Professional Car Detailing Services',
  description = 'Premium mobile car detailing services in Santa Cruz, California. Professional, convenient, and exceptional results every time.',
  keywords = 'car detailing, mobile detailing, auto detailing, car wash, Santa Cruz, California, professional detailing',
  image = '/logo.png',
  url = 'https://www.precisiondetailing.com'
}) => {
  const canonicalUrl = url.endsWith('/') ? url.slice(0, -1) : url;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Precision Detailing" />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#000000" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Business Information */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "http://schema.org",
          "@type": "LocalBusiness",
          "name": "Precision Detailing",
          "image": image,
          "telephone": "408-634-9181",
          "email": "contact@precisiondetailing.com",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Santa Cruz",
            "addressRegion": "CA",
            "addressCountry": "US"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "36.9741",
            "longitude": "-122.0308"
          },
          "url": canonicalUrl,
          "description": description,
          "priceRange": "$$",
          "areaServed": "Santa Cruz, California",
          "serviceType": "Mobile Car Detailing"
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
