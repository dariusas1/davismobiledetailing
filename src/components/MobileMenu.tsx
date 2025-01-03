import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FaTimes } from 'react-icons/fa';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-64 bg-black border-l border-gold/20 z-50 p-6"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-2xl text-white/80 hover:text-white"
            >
              <FaTimes />
            </button>

            <nav className="mt-12 flex flex-col gap-6">
              <Link
                href="/services"
                className="text-white/80 hover:text-gold transition-colors"
                onClick={onClose}
              >
                Services
              </Link>
              <Link
                href="/gallery"
                className="text-white/80 hover:text-gold transition-colors"
                onClick={onClose}
              >
                Gallery
              </Link>
              <Link
                href="/about"
                className="text-white/80 hover:text-gold transition-colors"
                onClick={onClose}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-white/80 hover:text-gold transition-colors"
                onClick={onClose}
              >
                Contact
              </Link>

              <Link
                href="/emergency-booking"
                className="mt-4 flex items-center gap-2 bg-red-600/90 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                onClick={onClose}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Emergency Service
              </Link>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu; 