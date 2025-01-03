'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaCar, FaCheck, FaClock, FaShieldAlt, FaStar } from 'react-icons/fa';

const services = [
  {
    id: 'basic',
    name: 'Basic Detail Package',
    price: 150,
    duration: '2-3 hours',
    description: 'A thorough exterior wash and interior cleaning to restore your vehicle\'s shine.',
    features: [
      'Hand wash & dry',
      'Wheel cleaning & tire shine', 
      'Interior vacuum & wipe down',
      'Window cleaning',
      'Dashboard & console cleaning',
      'Air freshener'
    ],
    bestFor: 'Regular maintenance and basic cleaning needs'
  },
  {
    id: 'premium',
    name: 'Premium Detail Package',
    price: 250,
    duration: '4-5 hours',
    description: 'Comprehensive detailing service with paint enhancement and deep interior cleaning.',
    features: [
      'Everything in Basic Package',
      'Clay bar treatment',
      'One-step paint correction',
      'Interior deep cleaning',
      'Leather conditioning',
      'Engine bay cleaning',
      'Paint sealant application'
    ],
    bestFor: 'Vehicles needing extra attention and paint enhancement',
    popular: true
  },
  {
    id: 'ultimate',
    name: 'Ultimate Detail Package',
    price: 350,
    duration: '6-7 hours',
    description: 'The most comprehensive detailing service with ceramic coating and paint correction.',
    features: [
      'Everything in Premium Package',
      'Two-step paint correction',
      'Ceramic coating',
      'Interior sanitization',
      'Headlight restoration',
      'Paint protection film',
      'Carpet shampooing',
      '6-month protection guarantee'
    ],
    bestFor: 'Show cars and luxury vehicles requiring the highest level of care'
  }
];

const additionalServices = [
  {
    id: 'ceramic',
    name: 'Ceramic Coating',
    price: 200,
    duration: '2-3 hours',
    description: 'Long-lasting protection against environmental damage and UV rays.',
    features: [
      'Superior gloss finish',
      'Hydrophobic properties',
      'UV protection',
      '12-month durability',
      'Easy maintenance'
    ]
  },
  {
    id: 'correction',
    name: 'Paint Correction',
    price: 150,
    duration: '3-4 hours',
    description: 'Remove swirl marks, scratches, and oxidation to restore paint clarity.',
    features: [
      'Swirl mark removal',
      'Light scratch repair',
      'Paint restoration',
      'High gloss finish',
      'Paint thickness measurement'
    ]
  },
  {
    id: 'interior',
    name: 'Deep Interior Clean',
    price: 100,
    duration: '2-3 hours',
    description: 'Thorough interior cleaning and sanitization for a fresh, clean cabin.',
    features: [
      'Steam cleaning',
      'Stain removal',
      'Leather treatment',
      'Odor elimination',
      'UV protection'
    ]
  }
];

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">Our Detailing Services</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Professional detailing services tailored to your vehicle's needs. From basic maintenance to
            premium treatments, we have the perfect package for you.
          </p>
        </motion.div>

        {/* Main Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-8 rounded-lg relative ${
                service.popular
                  ? 'bg-gold/10 border-2 border-gold'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              {service.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-black px-4 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{service.name}</h2>
                <p className="text-white/60">{service.description}</p>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div>
                  <p className="text-3xl font-bold text-gold">${service.price}</p>
                  <p className="text-sm text-white/60">Starting price</p>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <FaClock />
                  <span>{service.duration}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <FaCheck className="text-gold mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="space-y-4">
                <p className="text-sm text-white/60">
                  <FaCar className="inline-block mr-2" />
                  Best for: {service.bestFor}
                </p>
                <Link
                  href={`/booking?service=${service.id}`}
                  className={`block w-full py-3 rounded text-center transition-colors ${
                    service.popular
                      ? 'bg-gold text-black hover:bg-gold/90'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  Book Now
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Additional Services</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Enhance your detailing package with our specialized services for the ultimate finish.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {additionalServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="bg-white/5 border border-white/10 p-6 rounded-lg"
            >
              <h3 className="text-xl font-bold mb-2">{service.name}</h3>
              <div className="flex items-center gap-4 mb-4">
                <p className="text-2xl font-bold text-gold">+${service.price}</p>
                <div className="flex items-center gap-2 text-white/60">
                  <FaClock />
                  <span>{service.duration}</span>
                </div>
              </div>
              <p className="text-white/60 mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <FaCheck className="text-gold mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="p-6"
          >
            <FaShieldAlt className="text-4xl text-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Satisfaction Guaranteed</h3>
            <p className="text-white/60">
              We stand behind our work with a 100% satisfaction guarantee on all services.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="p-6"
          >
            <FaStar className="text-4xl text-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Premium Products</h3>
            <p className="text-white/60">
              We use only the highest quality detailing products and equipment for lasting results.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="p-6"
          >
            <FaCar className="text-4xl text-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Expert Care</h3>
            <p className="text-white/60">
              Our experienced team specializes in luxury and high-performance vehicles.
            </p>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-center mt-20"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Vehicle?</h2>
          <p className="text-white/60 mb-8">
            Book your appointment today and experience the Precision Detailing difference.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/booking"
              className="px-8 py-3 bg-gold text-black rounded hover:bg-gold/90 transition-colors"
            >
              Book Now
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border border-white/10 rounded hover:border-gold transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ServicesPage; 