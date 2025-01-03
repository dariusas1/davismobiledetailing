'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaShieldAlt, FaAward, FaCar, FaUsers, FaHandshake, FaLeaf } from 'react-icons/fa';

const values = [
  {
    icon: FaShieldAlt,
    title: 'Quality First',
    description: 'We never compromise on quality, using only premium products and proven techniques.'
  },
  {
    icon: FaHandshake,
    title: 'Customer Service',
    description: 'Building lasting relationships through exceptional service and communication.'
  },
  {
    icon: FaAward,
    title: 'Expertise',
    description: 'Continuously updating our skills and knowledge in automotive detailing.'
  },
  {
    icon: FaCar,
    title: 'Vehicle Care',
    description: 'Treating every vehicle with the utmost care and attention to detail.'
  },
  {
    icon: FaUsers,
    title: 'Community',
    description: 'Proud to serve and be part of the Santa Cruz automotive community.'
  },
  {
    icon: FaLeaf,
    title: 'Eco-Friendly',
    description: 'Using environmentally conscious products and water-saving techniques.'
  }
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container-custom">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl font-bold mb-4">About Precision Detailing</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Delivering exceptional mobile detailing services to Santa Cruz and surrounding areas since 2020.
          </p>
        </motion.div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative aspect-[4/3] rounded-lg overflow-hidden"
          >
            <Image
              src="/images/about-hero.jpg"
              alt="Precision Detailing at work"
              fill
              className="object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold">Our Story</h2>
            <p className="text-white/60">
              Precision Detailing was founded with a simple mission: to provide exceptional mobile
              detailing services that exceed expectations. What started as a passion for automobiles
              has grown into a trusted name in the Santa Cruz community.
            </p>
            <p className="text-white/60">
              We understand that your vehicle is more than just transportation—it's an investment.
              That's why we bring our expertise directly to you, offering convenient mobile detailing
              services that fit your schedule while maintaining the highest standards of quality.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div>
                <p className="text-3xl font-bold text-gold">500+</p>
                <p className="text-white/60">Happy Customers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gold">4.9</p>
                <p className="text-white/60">Average Rating</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Our Values</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            These core values guide everything we do, from our service approach to our customer interactions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="bg-white/5 p-6 rounded-lg"
            >
              <value.icon className="text-4xl text-gold mb-4" />
              <h3 className="text-xl font-bold mb-2">{value.title}</h3>
              <p className="text-white/60">{value.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Service Area Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold">Service Area</h2>
            <p className="text-white/60">
              Based in Santa Cruz, we provide mobile detailing services throughout the area,
              including Scotts Valley, Capitola, Aptos, and surrounding communities. Our mobile
              service brings professional detailing right to your doorstep.
            </p>
            <ul className="space-y-2 text-white/60">
              <li>• Santa Cruz</li>
              <li>• Scotts Valley</li>
              <li>• Capitola</li>
              <li>• Aptos</li>
              <li>• Soquel</li>
              <li>• Live Oak</li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="relative aspect-[4/3] rounded-lg overflow-hidden"
          >
            <Image
              src="/images/service-area-map.jpg"
              alt="Service Area Map"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="text-center bg-gold/10 p-12 rounded-lg"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Experience the Difference?</h2>
          <p className="text-white/60 mb-8 max-w-2xl mx-auto">
            Let us bring our professional detailing services to you. Book your appointment today
            and see why we're Santa Cruz's trusted mobile detailing service.
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

export default AboutPage; 