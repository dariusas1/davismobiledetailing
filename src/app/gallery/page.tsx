'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// This would typically come from your database or CMS
const galleryItems = [
  {
    id: 1,
    title: 'Luxury Sedan Transformation',
    description: 'Full exterior detail with ceramic coating',
    category: 'exterior',
    beforeImage: '/images/before1.jpg',
    afterImage: '/images/after1.jpg',
    tags: ['Ceramic Coating', 'Paint Correction', 'Exterior']
  },
  {
    id: 2,
    title: 'SUV Interior Restoration',
    description: 'Deep interior cleaning and leather conditioning',
    category: 'interior',
    beforeImage: '/images/before2.jpg',
    afterImage: '/images/after2.jpg',
    tags: ['Interior', 'Leather', 'Deep Clean']
  },
  // Add more gallery items here
];

const categories = [
  { id: 'all', name: 'All Projects' },
  { id: 'exterior', name: 'Exterior' },
  { id: 'interior', name: 'Interior' },
  { id: 'paint', name: 'Paint Correction' },
  { id: 'ceramic', name: 'Ceramic Coating' }
];

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<null | {
    beforeImage: string;
    afterImage: string;
    title: string;
    description: string;
  }>(null);
  const [showBefore, setShowBefore] = useState(false);

  const filteredItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">Our Work</h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Browse through our portfolio of completed projects and witness the transformations we achieve.
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded transition-colors ${
                selectedCategory === category.id
                  ? 'bg-gold text-black'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div
                className="relative aspect-video cursor-pointer overflow-hidden rounded-lg"
                onClick={() => setSelectedImage(item)}
                onMouseEnter={() => setShowBefore(true)}
                onMouseLeave={() => setShowBefore(false)}
              >
                <Image
                  src={item.afterImage}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                    <p className="text-sm text-white/80">{item.description}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {item.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs bg-white/10 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Image Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            >
              <div className="relative w-full max-w-6xl">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-12 right-0 text-2xl hover:text-gold transition-colors"
                >
                  <FaTimes />
                </button>
                <div className="relative aspect-video">
                  <Image
                    src={showBefore ? selectedImage.beforeImage : selectedImage.afterImage}
                    alt={selectedImage.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-black/70 p-4 rounded">
                    <h3 className="text-xl font-bold mb-1">{selectedImage.title}</h3>
                    <p className="text-white/80">{selectedImage.description}</p>
                  </div>
                  <div className="absolute top-4 left-4 bg-black/70 px-4 py-2 rounded">
                    {showBefore ? 'Before' : 'After'}
                  </div>
                  <button
                    onClick={() => setShowBefore(!showBefore)}
                    className="absolute top-4 right-4 bg-gold text-black px-4 py-2 rounded hover:bg-gold/90 transition-colors"
                  >
                    Show {showBefore ? 'After' : 'Before'}
                  </button>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full px-4">
                  <button className="text-3xl text-white/80 hover:text-gold transition-colors">
                    <FaChevronLeft />
                  </button>
                  <button className="text-3xl text-white/80 hover:text-gold transition-colors">
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-20"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Vehicle?</h2>
          <p className="text-white/60 mb-8">
            Let us bring out the best in your vehicle with our professional detailing services.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/booking"
              className="px-8 py-3 bg-gold text-black rounded hover:bg-gold/90 transition-colors"
            >
              Book Now
            </a>
            <a
              href="/contact"
              className="px-8 py-3 border border-white/10 rounded hover:border-gold transition-colors"
            >
              Contact Us
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GalleryPage; 