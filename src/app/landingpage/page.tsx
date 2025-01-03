'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useAnimation } from 'framer-motion';
import { 
  FaCheck, FaTimes, FaCar, FaShieldAlt, FaClock, FaStar, 
  FaMapMarkerAlt, FaPhone, FaChevronDown, FaTrophy, 
  FaUserFriends, FaCalendarCheck, FaCamera, FaCalendar, FaCreditCard, FaBars, FaChevronRight 
} from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';
import { TypeAnimation } from 'react-type-animation';
import CountUp from 'react-countup';
import { GoogleMap, LoadScript, Marker, Circle } from '@react-google-maps/api';
import MobileMenu from '../../components/MobileMenu';

interface ServiceArea {
  name: string;
  zipCodes: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  radius: number; // in meters
}

interface ComparisonItem {
  feature: string;
  automatic: string;
  detailing: string;
  description: string;
  icon: React.ElementType;
}

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedArea, setSelectedArea] = useState<ServiceArea | null>(null);
  const [showAreaDetails, setShowAreaDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicle: '',
    service: ''
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    phone: '',
    vehicle: '',
    service: ''
  });
  const [showGallery, setShowGallery] = useState(false);
  const [showTeamCredentials, setShowTeamCredentials] = useState(false);
  const [currentFormStep, setCurrentFormStep] = useState(1);
  const [formProgress, setFormProgress] = useState(0);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState('');
  const [preferredDateTime, setPreferredDateTime] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [address, setAddress] = useState('');
  const [priceEstimate, setPriceEstimate] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  const controls = useAnimation();

  useEffect(() => {
    setIsVisible(true);
    // Start the scroll indicator animation
    controls.start({
      y: [0, 10, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse"
      }
    });
  }, [controls]);

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.pageYOffset;
      const progress = (currentScroll / totalScroll) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC key closes modals
      if (e.key === 'Escape') {
        setShowAreaDetails(false);
        setShowGallery(false);
        setShowTeamCredentials(false);
      }

      // Tab key navigation for form steps
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        const focusableElements = document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (document.activeElement === lastElement) {
          firstElement.focus();
        } else {
          (document.activeElement?.nextElementSibling as HTMLElement)?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const serviceAreas: ServiceArea[] = [
    {
      name: 'Santa Cruz',
      zipCodes: ['95060', '95062', '95064'],
      coordinates: { lat: 36.9741, lng: -122.0308 },
      radius: 8000
    },
    {
      name: 'Scotts Valley',
      zipCodes: ['95066'],
      coordinates: { lat: 37.0511, lng: -122.0147 },
      radius: 5000
    },
    {
      name: 'Capitola',
      zipCodes: ['95010'],
      coordinates: { lat: 36.9752, lng: -121.9534 },
      radius: 4000
    },
    {
      name: 'Aptos',
      zipCodes: ['95003'],
      coordinates: { lat: 36.9771, lng: -121.9032 },
      radius: 6000
    },
    {
      name: 'Soquel',
      zipCodes: ['95073'],
      coordinates: { lat: 36.9880, lng: -121.9567 },
      radius: 4000
    }
  ];

  const handleAreaClick = useCallback((area: ServiceArea) => {
    if (area.name === '+ more') {
      // Handle showing more areas
      return;
    }
    setSelectedArea(area);
    setShowAreaDetails(true);
  }, []);

  const comparisonData: ComparisonItem[] = [
    {
      feature: 'Service Location',
      automatic: 'Fixed Location',
      detailing: 'At Your Home/Office',
      description: 'We bring our professional detailing service to your location',
      icon: FaMapMarkerAlt
    },
    {
      feature: 'Time Investment',
      automatic: '5-10 minutes',
      detailing: '2-4 hours',
      description: 'Thorough, meticulous attention to every detail',
      icon: FaClock
    },
    {
      feature: 'Paint Care',
      automatic: 'Scratches and damages car paint',
      detailing: 'Hand-wash & paint correction',
      description: 'Professional paint correction and swirl removal',
      icon: FaShieldAlt
    },
    {
      feature: 'Protection',
      automatic: 'Basic spray wax',
      detailing: 'Premium sealants & coatings',
      description: 'Long-lasting ceramic coating and paint protection',
      icon: FaShieldAlt
    },
    {
      feature: 'Interior Care',
      automatic: 'Basic vacuum',
      detailing: 'Deep cleaning & conditioning',
      description: 'Complete interior detailing and sanitization',
      icon: FaCar
    },
    {
      feature: 'Personal Attention',
      automatic: 'None',
      detailing: 'Dedicated professional',
      description: 'One-on-one attention to your vehicle\'s needs',
      icon: FaUserFriends
    },
    {
      feature: 'Quality Control',
      automatic: 'None',
      detailing: 'Meticulous hand-detailed',
      description: 'Every detail inspected and perfected',
      icon: FaCheck
    },
    {
      feature: 'Starting Price',
      automatic: '$15-25',
      detailing: 'From $150',
      description: 'Investment in your vehicle\'s appearance and value',
      icon: FaCreditCard
    }
  ];

  const validateForm = () => {
    const errors = {
      name: '',
      phone: '',
      vehicle: '',
      service: ''
    };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number: (XXX) XXX-XXXX';
      isValid = false;
    }

    if (!formData.vehicle.trim()) {
      errors.vehicle = 'Vehicle details are required';
      isValid = false;
    }

    if (!formData.service) {
      errors.service = 'Please select a service';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      // Format as (XXX) XXX-XXXX
      if (value.length > 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
      } else if (value.length > 3) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
      } else if (value.length > 0) {
        value = `(${value}`;
      }
    }
    setFormData(prev => ({
      ...prev,
      phone: value
    }));
    setFormErrors(prev => ({
      ...prev,
      phone: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      // Clear form after successful submission
      setFormData({
        name: '',
        phone: '',
        vehicle: '',
        service: ''
      });
      // Show success message or redirect
      alert('Thank you! We will contact you shortly.');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Sorry, there was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceFeatures = [
    {
      name: 'Exterior Wash & Wax',
      basic: true,
      premium: true,
      ultimate: true,
      description: 'Professional hand wash and wax service using premium products for a deep clean and lasting shine.',
      details: [
        'Two-bucket wash method',
        'Clay bar treatment (Premium & Ultimate)',
        'High-quality carnauba wax',
        'Wheel & tire cleaning',
        'Glass cleaning & treatment'
      ],
      duration: {
        basic: '1-2 hours',
        premium: '2-3 hours',
        ultimate: '3-4 hours'
      },
      image: 'wash-wax.jpg'
    },
    {
      name: 'Interior Detailing',
      basic: true,
      premium: true,
      ultimate: true,
      description: 'Thorough interior cleaning and conditioning to restore your vehicle\'s cabin to pristine condition.',
      details: [
        'Vacuum & steam cleaning',
        'Leather/upholstery conditioning',
        'Dashboard & trim cleaning',
        'Air vent sanitization',
        'Carpet shampooing (Premium & Ultimate)'
      ],
      duration: {
        basic: '1-2 hours',
        premium: '2-3 hours',
        ultimate: '3-4 hours'
      },
      image: 'interior-detail.jpg'
    },
    {
      name: 'Paint Correction',
      basic: false,
      premium: true,
      ultimate: true,
      description: 'Professional paint correction to remove swirl marks, scratches, and oxidation, restoring your vehicle\'s finish.',
      details: [
        'Multi-stage paint correction',
        'Swirl mark removal',
        'Light scratch removal',
        'Paint depth measurement',
        'Paint sealant application'
      ],
      duration: {
        premium: '4-6 hours',
        ultimate: '6-8 hours'
      },
      image: 'paint-correction.jpg'
    },
    {
      name: 'Ceramic Coating',
      basic: false,
      premium: false,
      ultimate: true,
      description: 'Professional-grade ceramic coating for ultimate paint protection and a long-lasting showroom finish.',
      details: [
        'Surface preparation',
        'Professional coating application',
        '9H hardness protection',
        'UV protection',
        '2-year warranty'
      ],
      duration: {
        ultimate: '8-10 hours'
      },
      image: 'ceramic-coating.jpg'
    },
    {
      name: 'Engine Bay Detailing',
      basic: false,
      premium: true,
      ultimate: true,
      description: 'Thorough cleaning and dressing of the engine bay for both aesthetic and maintenance purposes.',
      details: [
        'Safe degreasing process',
        'Detailed hand cleaning',
        'Plastic & rubber treatment',
        'Protective coating application',
        'Inspection for leaks'
      ],
      duration: {
        premium: '1-2 hours',
        ultimate: '2-3 hours'
      },
      image: 'engine-bay.jpg'
    },
    {
      name: 'Headlight Restoration',
      basic: false,
      premium: true,
      ultimate: true,
      description: 'Professional headlight restoration to improve visibility and vehicle appearance.',
      details: [
        'UV damage removal',
        'Multi-stage sanding',
        'Clarity restoration',
        'UV protective coating',
        '1-year warranty'
      ],
      duration: {
        premium: '1-2 hours',
        ultimate: '2-3 hours'
      },
      image: 'headlight-restoration.jpg'
    }
  ];

  return (
    <div className="bg-black text-white">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Precision Detailing",
            "@id": "https://precisiondetailing.com",
            "url": "https://precisiondetailing.com",
            "telephone": "408-634-9181",
            "priceRange": "$$$",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Santa Cruz",
              "addressRegion": "CA",
              "addressCountry": "US"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 36.9741,
              "longitude": -122.0308
            },
            "description": "Premium mobile car detailing service in Santa Cruz, specializing in luxury and high-performance vehicles.",
            "image": "https://precisiondetailing.com/images/logo.png",
            "sameAs": [
              "https://facebook.com/precisiondetailing",
              "https://instagram.com/precisiondetailing"
            ],
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
              ],
              "opens": "08:00",
              "closes": "18:00"
            },
            "areaServed": [
              {
                "@type": "City",
                "name": "Santa Cruz"
              },
              {
                "@type": "City",
                "name": "Scotts Valley"
              },
              {
                "@type": "City",
                "name": "Capitola"
              },
              {
                "@type": "City",
                "name": "Aptos"
              },
              {
                "@type": "City",
                "name": "Soquel"
              }
            ],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Car Detailing Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Basic Detail Package",
                    "description": "Complete exterior wash and interior cleaning",
                    "price": "149.00",
                    "priceCurrency": "USD"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Premium Detail Package",
                    "description": "Comprehensive interior & exterior detail with paint correction",
                    "price": "249.00",
                    "priceCurrency": "USD"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Ultimate Detail Package",
                    "description": "Complete detail with ceramic coating and paint correction",
                    "price": "399.00",
                    "priceCurrency": "USD"
                  }
                }
              ]
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "500"
            }
          })
        }}
      />

      {/* Floating Progress Bar */}
      <motion.div
        className="floating-progress"
        style={{ scaleX: scrollProgress / 100 }}
      />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-black/0">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="Precision Detailing"
                width={40}
                height={40}
                className="w-auto h-10"
              />
              <span className="font-bold text-xl">Precision Detailing</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/services" className="hover:text-gold transition-colors">Services</Link>
              <Link href="/gallery" className="hover:text-gold transition-colors">Gallery</Link>
              <Link href="/about" className="hover:text-gold transition-colors">About</Link>
              <Link href="/contact" className="hover:text-gold transition-colors">Contact</Link>
              
              <Link 
                href="/booking" 
                className="bg-gold text-black px-4 py-2 rounded hover:bg-gold/90 transition-colors"
              >
                Book Now
              </Link>
              <Link 
                href="/quote" 
                className="bg-white/10 text-white px-4 py-2 rounded hover:bg-white/20 transition-colors"
              >
                Get Quote
              </Link>
              <Link
                href="/emergency-booking"
                className="inline-flex items-center gap-2 bg-red-600/90 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Emergency Detail
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-2xl"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <FaBars />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
          >
            <source src="/videos/hero-video.mp4" type="video/mp4" />
          </video>
          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/70" />
        </div>
        
        <div className="container-custom relative z-10 pt-24">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-left">
                Premium Mobile Car Detailing in Santa Cruz
              </h1>
              <p className="text-xl mb-6 text-gold font-semibold">
                Specializing in Luxury & High-Performance Vehicles
              </p>

              {/* Simplified Statistics */}
              <div className="flex gap-12 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-left"
                >
                  <h3 className="text-2xl font-bold text-gold">
                    <CountUp end={4.9} decimals={1} duration={2} /> ⭐
                  </h3>
                  <p className="text-sm">Average Rating</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-left"
                >
                  <h3 className="text-2xl font-bold text-gold">
                    <CountUp end={500} duration={2.5} />+
                  </h3>
                  <p className="text-sm">Happy Customers</p>
                </motion.div>
              </div>

              {/* Primary CTAs */}
              <div className="flex gap-4 mb-12">
                <Link 
                  href="/booking" 
                  className="btn-primary flex items-center gap-2"
                >
                  <FaClock className="text-xl" />
                  Book Now
                </Link>
                <Link 
                  href="/quote" 
                  className="btn-secondary flex items-center gap-2"
                >
                  <FaShieldAlt className="text-xl" />
                  Get Quote
                </Link>
              </div>

              {/* Service Areas */}
              <div className="absolute bottom-8 left-0 right-0 text-center text-sm text-white/80">
                <div className="container-custom">
                  <div className="flex items-center justify-center gap-2">
                    <FaMapMarkerAlt className="text-gold" />
                    <span>Serving: </span>
                    {serviceAreas.map((area, index) => (
                      <button
                        key={area.name}
                        onClick={() => handleAreaClick(area)}
                        className="hover:text-gold transition-colors duration-300"
                      >
                        {area.name}{index < serviceAreas.length - 1 ? ',' : ''}&nbsp;
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-black">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Precision Detailing</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Experience the difference of professional detailing services tailored to your vehicle's needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white/5 p-6 rounded-lg hover:bg-white/10 transition-colors duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="bg-gold/10 p-3 rounded-lg">
                  <FaTrophy className="text-2xl text-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">5+ Years Experience</h3>
                  <p className="text-white/60">
                    Our team brings over 5 years of professional experience in luxury and high-performance vehicle detailing.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2 text-sm text-white/60">
                      <FaCheck className="text-gold" />
                      <span>Certified Detailers</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-white/60">
                      <FaCheck className="text-gold" />
                      <span>Ongoing Training</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 p-6 rounded-lg hover:bg-white/10 transition-colors duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="bg-gold/10 p-3 rounded-lg">
                  <FaShieldAlt className="text-2xl text-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Premium Products</h3>
                  <p className="text-white/60">
                    We use only the highest quality detailing products and ceramic coatings for lasting results.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2 text-sm text-white/60">
                      <FaCheck className="text-gold" />
                      <span>Professional-Grade Products</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-white/60">
                      <FaCheck className="text-gold" />
                      <span>Eco-Friendly Options</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/5 p-6 rounded-lg hover:bg-white/10 transition-colors duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="bg-gold/10 p-3 rounded-lg">
                  <FaUserFriends className="text-2xl text-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Customer Satisfaction</h3>
                  <p className="text-white/60">
                    Our commitment to excellence is reflected in our high customer satisfaction rate.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2 text-sm text-white/60">
                      <FaCheck className="text-gold" />
                      <span>100% Satisfaction Guarantee</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-white/60">
                      <FaCheck className="text-gold" />
                      <span>Free Touch-ups</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Service Comparison Section */}
      <section className="py-20 bg-black">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Detailing Packages</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Choose the perfect detailing package for your vehicle. Each service is customized to meet your specific needs.
            </p>
          </div>

          <div className="relative overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 text-lg font-bold">Service Features</th>
                  <th className="p-4 text-lg font-bold">
                    <div className="flex flex-col">
                      <span>Basic Detail</span>
                      <span className="text-sm font-normal text-white/60">Starting at $149</span>
                      <span className="text-xs text-white/40 mt-1">2-4 hours</span>
                    </div>
                  </th>
                  <th className="p-4 text-lg font-bold">
                    <div className="flex flex-col relative">
                      <span>Premium Detail</span>
                      <span className="text-sm font-normal text-white/60">Starting at $249</span>
                      <span className="text-xs text-white/40 mt-1">4-8 hours</span>
                      <div className="absolute -top-4 right-0 bg-gold text-black text-xs font-bold px-2 py-1 rounded">
                        Most Popular
                      </div>
                    </div>
                  </th>
                  <th className="p-4 text-lg font-bold">
                    <div className="flex flex-col">
                      <span>Ultimate Detail</span>
                      <span className="text-sm font-normal text-white/60">Starting at $399</span>
                      <span className="text-xs text-white/40 mt-1">8-12 hours</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {serviceFeatures.map((feature, index) => (
                  <motion.tr
                    key={feature.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`border-b border-white/10 hover:bg-white/5 transition-colors ${
                      expandedFeature === feature.name ? 'bg-white/5' : ''
                    }`}
                  >
                    <td className="p-4">
                      <button
                        onClick={() => setExpandedFeature(expandedFeature === feature.name ? null : feature.name)}
                        className="flex items-center gap-2 hover:text-gold transition-colors w-full"
                      >
                        <span>{feature.name}</span>
                        {feature.duration && (
                          <span className="text-xs text-white/40 ml-auto mr-2">
                            {feature.duration.basic || feature.duration.premium || feature.duration.ultimate}
                          </span>
                        )}
                        <FaChevronDown
                          className={`text-sm transition-transform ${
                            expandedFeature === feature.name ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </td>
                    <td className="p-4">
                      {feature.basic ? (
                        <div className="flex items-center gap-2">
                          <FaCheck className="text-green-500" />
                          {feature.duration?.basic && (
                            <span className="text-xs text-white/40">{feature.duration.basic}</span>
                          )}
                        </div>
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                    </td>
                    <td className="p-4">
                      {feature.premium ? (
                        <div className="flex items-center gap-2">
                          <FaCheck className="text-green-500" />
                          {feature.duration?.premium && (
                            <span className="text-xs text-white/40">{feature.duration.premium}</span>
                          )}
                        </div>
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                    </td>
                    <td className="p-4">
                      {feature.ultimate ? (
                        <div className="flex items-center gap-2">
                          <FaCheck className="text-green-500" />
                          {feature.duration?.ultimate && (
                            <span className="text-xs text-white/40">{feature.duration.ultimate}</span>
                          )}
                        </div>
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {/* Expanded Feature Details */}
            {expandedFeature && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white/5 p-6 rounded-lg mt-4"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-bold mb-4">{expandedFeature}</h4>
                    <p className="text-white/60 mb-4">
                      {serviceFeatures.find(f => f.name === expandedFeature)?.description}
                    </p>
                    <ul className="space-y-2">
                      {serviceFeatures
                        .find(f => f.name === expandedFeature)
                        ?.details.map((detail, index) => (
                          <li key={index} className="flex items-center gap-2 text-white/60">
                            <FaCheck className="text-gold" />
                            <span>{detail}</span>
                          </li>
                        ))}
                    </ul>
                    <div className="mt-6">
                      <h5 className="font-semibold mb-2">Service Duration:</h5>
                      <div className="grid grid-cols-3 gap-4">
                        {['basic', 'premium', 'ultimate'].map((tier) => {
                          const duration = serviceFeatures
                            .find(f => f.name === expandedFeature)
                            ?.duration?.[tier as keyof typeof serviceFeatures[0]['duration']];
                          if (!duration) return null;
                          return (
                            <div key={tier} className="bg-white/5 p-3 rounded">
                              <span className="text-sm font-medium capitalize">{tier}</span>
                              <p className="text-white/60 text-sm">{duration}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={`/images/${serviceFeatures.find(f => f.name === expandedFeature)?.image}`}
                      alt={expandedFeature}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Package CTAs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Link
                href="/booking?package=basic"
                className="bg-white/5 hover:bg-white/10 transition-colors p-6 rounded-lg text-center group"
              >
                <h4 className="text-xl font-bold mb-2">Basic Detail</h4>
                <p className="text-white/60 mb-4">Perfect for regular maintenance</p>
                <span className="text-2xl font-bold text-gold">$149</span>
                <button className="w-full mt-4 bg-white/10 group-hover:bg-white/20 transition-colors py-2 rounded">
                  Schedule Now
                </button>
              </Link>

              <Link
                href="/booking?package=premium"
                className="bg-gold/20 hover:bg-gold/30 transition-colors p-6 rounded-lg text-center relative group"
              >
                <div className="absolute -top-4 right-4 bg-gold text-black text-xs font-bold px-2 py-1 rounded">
                  Most Popular
                </div>
                <h4 className="text-xl font-bold mb-2">Premium Detail</h4>
                <p className="text-white/60 mb-4">Comprehensive interior & exterior detail</p>
                <span className="text-2xl font-bold text-gold">$249</span>
                <button className="w-full mt-4 bg-gold group-hover:bg-opacity-90 transition-colors py-2 rounded">
                  Schedule Now
                </button>
              </Link>

              <Link
                href="/booking?package=ultimate"
                className="bg-white/5 hover:bg-white/10 transition-colors p-6 rounded-lg text-center group"
              >
                <h4 className="text-xl font-bold mb-2">Ultimate Detail</h4>
                <p className="text-white/60 mb-4">The ultimate in paint correction & protection</p>
                <span className="text-2xl font-bold text-gold">$399</span>
                <button className="w-full mt-4 bg-white/10 group-hover:bg-white/20 transition-colors py-2 rounded">
                  Schedule Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Comparison Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Automatic vs Professional Detailing</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover why professional mobile detailing delivers superior results
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[768px] border-collapse">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="p-4 text-left">Feature</th>
                  <th className="p-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold mb-2">Automatic Car Wash</span>
                      <span className="text-sm text-gray-400">Quick & Basic</span>
                      <span className="text-gold mt-1">$15-25</span>
                    </div>
                  </th>
                  <th className="p-4 text-center bg-gradient-to-r from-gold/20 to-gold/10">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold mb-2 text-gold">Professional Detailing</span>
                      <span className="text-sm text-gray-400">Premium Service</span>
                      <span className="text-gold mt-1">From $150</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, index) => (
                  <tr 
                    key={item.feature}
                    className="border-b border-gray-800 hover:bg-white/5 transition-colors duration-200"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <item.icon className="text-gold" />
                        <div>
                          <span className="font-medium">{item.feature}</span>
                          <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-gray-400">{item.automatic}</span>
                    </td>
                    <td className="p-4 text-center bg-gradient-to-r from-gold/20 to-gold/10">
                      <span className="text-white font-medium">{item.detailing}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/quote"
              className="btn-primary inline-flex items-center gap-2 transform hover:scale-105 transition-all duration-300"
            >
              <FaShieldAlt className="text-xl" />
              Get Custom Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Bottom CTA Section */}
      <section className="py-20 bg-gradient-to-b from-[#B8860B]/90 to-[#8B6508]/90">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="heading-lg mb-6 text-white">Ready to Transform Your Vehicle?</h2>
                <p className="text-xl text-white/90 mb-8">
                  Experience the finest mobile detailing service in Santa Cruz. Book now and enjoy:
                </p>

                {/* Trust Indicators */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3 text-white">
                    <FaShieldAlt className="text-2xl text-white" />
                    <div>
                      <h4 className="font-bold">100% Satisfaction</h4>
                      <p className="text-sm">Guaranteed or money back</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <FaClock className="text-2xl text-white" />
                    <div>
                      <h4 className="font-bold">Flexible Scheduling</h4>
                      <p className="text-sm">7 days a week</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <FaCar className="text-2xl text-white" />
                    <div>
                      <h4 className="font-bold">Premium Products</h4>
                      <p className="text-sm">Professional grade only</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <FaStar className="text-2xl text-white" />
                    <div>
                      <h4 className="font-bold">5-Star Service</h4>
                      <p className="text-sm">Consistently rated 4.9+</p>
                    </div>
                  </div>
                </div>

                {/* Testimonial Snippet */}
                <div className="bg-white/10 p-6 rounded-lg mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex text-white">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                    <div className="text-white">
                      <h4 className="font-bold">John D.</h4>
                      <p className="text-sm">Verified Customer</p>
                    </div>
                  </div>
                  <p className="text-white/90 italic">
                    "Absolutely amazing service! They transformed my car to better than showroom condition. 
                    Highly recommend their premium detailing package."
                  </p>
                </div>
              </motion.div>
            </div>

            <div>
              {/* Multi-step Quote Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white rounded-lg p-8 shadow-xl relative"
              >
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
                  <motion.div
                    className="h-full bg-gold"
                    initial={{ width: 0 }}
                    animate={{ width: `${formProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <h3 className="text-2xl font-bold text-black mb-6">Get Your Quote</h3>
                
                {/* Auto-save Indicator */}
                {autoSaveStatus && (
                  <div className="absolute top-4 right-4 text-sm text-gray-500 saving-indicator">
                    {autoSaveStatus}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {currentFormStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 rounded border ${
                              formErrors.name ? 'border-red-500' : 'border-gray-300'
                            } focus:ring-2 focus:ring-gold focus:border-transparent`}
                            placeholder="Your name"
                          />
                          {formErrors.name && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            className={`w-full px-4 py-2 rounded border ${
                              formErrors.phone ? 'border-red-500' : 'border-gray-300'
                            } focus:ring-2 focus:ring-gold focus:border-transparent`}
                            placeholder="(408) XXX-XXXX"
                          />
                          {formErrors.phone && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentFormStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vehicle Type
                          </label>
                          <div className="grid grid-cols-2 gap-4">
                            {['Sedan', 'SUV', 'Truck', 'Sports Car', 'Luxury', 'Other'].map((type) => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => setSelectedVehicleType(type)}
                                className={`p-4 rounded-lg border ${
                                  selectedVehicleType === type
                                    ? 'border-gold bg-gold/10 text-gold'
                                    : 'border-gray-300 hover:border-gold'
                                } transition-all duration-300`}
                              >
                                <FaCar className="mx-auto mb-2" />
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700 mb-1">
                            Vehicle Details
                          </label>
                          <input
                            type="text"
                            id="vehicle"
                            name="vehicle"
                            value={formData.vehicle}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 rounded border ${
                              formErrors.vehicle ? 'border-red-500' : 'border-gray-300'
                            } focus:ring-2 focus:ring-gold focus:border-transparent`}
                            placeholder="Year, Make, Model"
                          />
                          {formErrors.vehicle && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.vehicle}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentFormStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                            Service Package
                          </label>
                          <select
                            id="service"
                            name="service"
                            value={formData.service}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 rounded border ${
                              formErrors.service ? 'border-red-500' : 'border-gray-300'
                            } focus:ring-2 focus:ring-gold focus:border-transparent`}
                          >
                            <option value="">Select a service</option>
                            <option value="basic">Basic Detail ($150+)</option>
                            <option value="premium">Premium Detail ($250+)</option>
                            <option value="custom">Custom Package (Quote)</option>
                          </select>
                          {formErrors.service && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.service}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="datetime" className="block text-sm font-medium text-gray-700 mb-1">
                            Preferred Date & Time
                          </label>
                          <input
                            type="datetime-local"
                            id="datetime"
                            value={preferredDateTime}
                            onChange={(e) => setPreferredDateTime(e.target.value)}
                            className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-gold focus:border-transparent"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentFormStep === 4 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                            Service Location
                          </label>
                          <input
                            type="text"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-gold focus:border-transparent"
                            placeholder="Enter your address"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Vehicle Photos (Optional)
                          </label>
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gold transition-colors duration-300">
                            <div className="space-y-1 text-center">
                              <FaCamera className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="flex text-sm text-gray-600">
                                <label
                                  htmlFor="photos"
                                  className="relative cursor-pointer bg-white rounded-md font-medium text-gold hover:text-opacity-90 focus-within:outline-none"
                                >
                                  <span>Upload photos</span>
                                  <input
                                    id="photos"
                                    name="photos"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={(e) => {
                                      if (e.target.files) {
                                        setUploadedPhotos(Array.from(e.target.files));
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                              <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                            </div>
                          </div>
                          {uploadedPhotos.length > 0 && (
                            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                              {uploadedPhotos.map((photo, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={URL.createObjectURL(photo)}
                                    alt={`Uploaded photo ${index + 1}`}
                                    className="h-20 w-20 object-cover rounded"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== index));
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex justify-between mt-8">
                    {currentFormStep > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentFormStep(prev => prev - 1);
                          setFormProgress(prev => prev - 25);
                        }}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-300"
                      >
                        Back
                      </button>
                    )}
                    {currentFormStep < 4 ? (
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentFormStep(prev => prev + 1);
                          setFormProgress(prev => prev + 25);
                          setAutoSaveStatus('Saving...');
                          setTimeout(() => setAutoSaveStatus(''), 1500);
                        }}
                        className="ml-auto bg-gold text-white px-6 py-2 rounded hover:bg-opacity-90 transition-all duration-300"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="ml-auto bg-gold text-white px-8 py-2 rounded hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {isSubmitting ? (
                          <>
                            <LoadingSpinner size={20} color="#FFFFFF" />
                            <span className="ml-2">Submitting...</span>
                          </>
                        ) : (
                          'Get Quote'
                        )}
                      </button>
                    )}
                  </div>

                  {/* Price Estimate */}
                  {formData.service && selectedVehicleType && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-bold text-gray-700 mb-2">Estimated Price Range:</h4>
                      <div className="text-2xl font-bold text-gold">
                        {formData.service === 'basic' ? '$150 - $200' :
                         formData.service === 'premium' ? '$250 - $350' :
                         'Custom Quote'}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Final price may vary based on vehicle condition and specific requirements
                      </p>
                    </div>
                  )}
                </form>
              </motion.div>
            </div>
          </div>

          {/* Before/After Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16"
          >
            <h3 className="text-2xl font-bold text-white text-center mb-8">
              Before & After Transformations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="relative group cursor-pointer">
                  <div className="relative h-64 overflow-hidden rounded-lg">
                    <Image
                      src={`/images/before-after-${item}.jpg`}
                      alt={`Before and After ${item}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white font-bold">View Details</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-black">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Recent Work</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Browse through our gallery of recently completed projects, showcasing our attention to detail and commitment to excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative aspect-square group cursor-pointer"
                onClick={() => setShowGallery(true)}
              >
                <Image
                  src={`/images/gallery-${item}.jpg`}
                  alt={`Gallery Image ${item}`}
                  fill
                  className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end p-4">
                  <p className="text-white font-medium">View Details</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-gold hover:text-white transition-colors"
            >
              View Full Gallery
              <FaChevronRight className="text-sm" />
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Modal */}
      {showGallery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowGallery(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white rounded-lg max-w-4xl w-full p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-black">Project Details</h3>
              <button
                onClick={() => setShowGallery(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative aspect-square">
                <Image
                  src="/images/gallery-1.jpg"
                  alt="Project Image"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="text-black">
                <h4 className="text-xl font-bold mb-4">Full Detail Package</h4>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Complete interior and exterior detailing with paint correction and ceramic coating application.
                  </p>
                  <div>
                    <h5 className="font-semibold mb-2">Services Performed:</h5>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Paint Correction</li>
                      <li>Ceramic Coating</li>
                      <li>Interior Deep Clean</li>
                      <li>Leather Treatment</li>
                      <li>Wheel & Tire Detail</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">Vehicle:</h5>
                    <p className="text-gray-600">2022 Porsche 911 GT3</p>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">Duration:</h5>
                    <p className="text-gray-600">2 Days</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setShowGallery(false)}
                className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <Link
                href="/booking"
                className="px-6 py-2 bg-gold text-white rounded hover:bg-opacity-90 transition-colors"
              >
                Book Similar Service
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="bg-black border-t border-gold/20 py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <FaPhone className="text-gold" />
                  <a href="tel:408-634-9181" className="hover:text-gold transition-colors">
                    (408) 634-9181
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gold" />
                  <span>Santa Cruz, CA</span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/services" className="block hover:text-gold transition-colors">Services</Link>
                <Link href="/gallery" className="block hover:text-gold transition-colors">Gallery</Link>
                <Link href="/about" className="block hover:text-gold transition-colors">About</Link>
                <Link href="/contact" className="block hover:text-gold transition-colors">Contact</Link>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Service Areas</h3>
              <div className="space-y-2">
                {serviceAreas.map((area) => (
                  <button
                    key={area.name}
                    onClick={() => handleAreaClick(area)}
                    className="block text-left hover:text-gold transition-colors"
                  >
                    {area.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Payment Methods</h3>
              <div className="flex gap-4 mb-4">
                <Image src="/images/visa.svg" alt="Visa" width={40} height={25} />
                <Image src="/images/mastercard.svg" alt="Mastercard" width={40} height={25} />
                <Image src="/images/amex.svg" alt="American Express" width={40} height={25} />
              </div>
              <p className="text-sm text-white/60">Secure payments powered by Square</p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-white/60">
            <p>© {new Date().getFullYear()} Precision Detailing. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Area Details Modal */}
      {showAreaDetails && selectedArea && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowAreaDetails(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white text-black p-6 rounded-lg max-w-4xl w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">{selectedArea.name} Coverage</h3>
              <button
                onClick={() => setShowAreaDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Zip Codes Served:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedArea.zipCodes.map(zip => (
                      <span key={zip} className="bg-gray-100 px-3 py-1 rounded">
                        {zip}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Service Details:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <FaClock className="text-gold" />
                      <span>Same-day service available</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCar className="text-gold" />
                      <span>Mobile service at your location</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-gold" />
                      <span>No travel fee within service area</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="h-[300px] rounded-lg overflow-hidden">
                <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={selectedArea.coordinates}
                    zoom={11}
                    options={{
                      styles: [
                        {
                          featureType: 'all',
                          elementType: 'all',
                          stylers: [{ saturation: -100 }]
                        }
                      ]
                    }}
                  >
                    <Marker position={selectedArea.coordinates} />
                    <Circle
                      center={selectedArea.coordinates}
                      radius={selectedArea.radius}
                      options={{
                        fillColor: '#D4AF37',
                        fillOpacity: 0.2,
                        strokeColor: '#D4AF37',
                        strokeOpacity: 0.8,
                        strokeWeight: 2
                      }}
                    />
                  </GoogleMap>
                </LoadScript>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowAreaDetails(false)}
                className="bg-gold text-white px-6 py-2 rounded hover:bg-opacity-90 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default LandingPage; 