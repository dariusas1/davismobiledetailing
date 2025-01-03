'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowConsent(false);
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-black/95 text-white p-4 z-50"
        >
          <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm">
              <p>
                We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.{' '}
                <a href="/privacy" className="text-gold hover:underline">
                  Learn more
                </a>
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleAccept}
                className="bg-gold text-white px-6 py-2 rounded hover:bg-opacity-90 transition-all duration-300"
              >
                Accept
              </button>
              <button
                onClick={() => setShowConsent(false)}
                className="bg-white/10 text-white px-6 py-2 rounded hover:bg-opacity-20 transition-all duration-300"
              >
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 