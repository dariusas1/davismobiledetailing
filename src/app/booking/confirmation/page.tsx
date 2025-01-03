'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaCheckCircle, FaCalendar, FaCar, FaMapMarkerAlt } from 'react-icons/fa';

const BookingConfirmation = () => {
  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="mb-8">
            <FaCheckCircle className="text-6xl text-gold mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Booking Confirmed!</h1>
            <p className="text-xl text-white/60">
              Thank you for choosing Precision Detailing. We've received your booking and will be in touch shortly.
            </p>
          </div>

          <div className="bg-white/5 p-8 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-6">Booking Details</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <FaCalendar className="text-gold" />
                <span>Your appointment is scheduled for [Date] at [Time]</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <FaCar className="text-gold" />
                <span>[Service Package] for [Vehicle Type]</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <FaMapMarkerAlt className="text-gold" />
                <span>[Service Location]</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-8 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
            <ul className="space-y-4 text-left max-w-md mx-auto">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gold text-black flex items-center justify-center flex-shrink-0 mt-1">
                  1
                </div>
                <div>
                  <h3 className="font-bold">Confirmation Email</h3>
                  <p className="text-white/60">
                    Check your inbox for a detailed confirmation email with your booking reference.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gold text-black flex items-center justify-center flex-shrink-0 mt-1">
                  2
                </div>
                <div>
                  <h3 className="font-bold">Pre-Service Call</h3>
                  <p className="text-white/60">
                    We'll call you 24 hours before your appointment to confirm details.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gold text-black flex items-center justify-center flex-shrink-0 mt-1">
                  3
                </div>
                <div>
                  <h3 className="font-bold">Service Day</h3>
                  <p className="text-white/60">
                    Have your vehicle ready at the specified location. We'll arrive within the scheduled time window.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <Link
              href="/dashboard"
              className="inline-block px-8 py-3 bg-gold text-black rounded hover:bg-gold/90 transition-colors"
            >
              View Booking Details
            </Link>
            <p className="text-white/60">
              Questions? Contact us at (408) 634-9181
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingConfirmation; 