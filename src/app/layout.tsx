import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CookieConsent from '../components/CookieConsent'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Precision Detailing - Premium Mobile Car Detailing in Santa Cruz',
  description: 'Professional mobile car detailing service in Santa Cruz. Specializing in luxury vehicles with premium detailing packages. Book your appointment today!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Schema markup for local business
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AutoDetailing',
    name: 'Precision Detailing',
    image: 'https://precisiondetailing.com/logo.png',
    '@id': 'https://precisiondetailing.com',
    url: 'https://precisiondetailing.com',
    telephone: '408-634-9181',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Mobile Service',
      addressLocality: 'Santa Cruz',
      addressRegion: 'CA',
      postalCode: '95060',
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 36.9741,
      longitude: -122.0308
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      opens: '08:00',
      closes: '18:00'
    },
    sameAs: [
      'https://www.facebook.com/precisiondetailing',
      'https://www.instagram.com/precisiondetailing'
    ],
    areaServed: [
      'Santa Cruz',
      'Scotts Valley',
      'Capitola',
      'Aptos',
      'Soquel'
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}
