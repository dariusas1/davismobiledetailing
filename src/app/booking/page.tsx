'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FaCar, FaCalendarAlt, FaMapMarkerAlt, FaInfoCircle, FaCheck } from 'react-icons/fa';

const BookingPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    vehicleType: '',
    additionalServices: [],
    bookingDate: '',
    bookingTime: '',
    location: '',
    vehicleInfo: '',
    specialRequests: '',
    totalPrice: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const services = [
    { id: 'basic', name: 'Basic Detail', price: 150, duration: '2-3 hours' },
    { id: 'premium', name: 'Premium Detail', price: 250, duration: '4-5 hours' },
    { id: 'ultimate', name: 'Ultimate Detail', price: 350, duration: '6-7 hours' }
  ];

  const additionalServices = [
    { id: 'ceramic', name: 'Ceramic Coating', price: 200 },
    { id: 'polish', name: 'Paint Correction', price: 150 },
    { id: 'interior', name: 'Deep Interior Clean', price: 100 }
  ];

  const vehicleTypes = [
    { id: 'sedan', name: 'Sedan', icon: '🚗' },
    { id: 'suv', name: 'SUV', icon: '🚙' },
    { id: 'truck', name: 'Truck', icon: '🛻' },
    { id: 'luxury', name: 'Luxury', icon: '🏎️' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceSelect = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setFormData(prev => ({
        ...prev,
        serviceType: serviceId,
        totalPrice: service.price + prev.additionalServices.reduce((acc, curr) => {
          const addon = additionalServices.find(a => a.id === curr);
          return acc + (addon?.price || 0);
        }, 0)
      }));
    }
  };

  const handleAdditionalServiceToggle = (serviceId: string) => {
    setFormData(prev => {
      const updatedServices = prev.additionalServices.includes(serviceId)
        ? prev.additionalServices.filter(id => id !== serviceId)
        : [...prev.additionalServices, serviceId];

      const basePrice = services.find(s => s.id === prev.serviceType)?.price || 0;
      const addonsPrice = updatedServices.reduce((acc, curr) => {
        const addon = additionalServices.find(a => a.id === curr);
        return acc + (addon?.price || 0);
      }, 0);

      return {
        ...prev,
        additionalServices: updatedServices,
        totalPrice: basePrice + addonsPrice
      };
    });
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.serviceType) {
          setError('Please select a service package');
          return false;
        }
        break;
      case 2:
        if (!formData.vehicleType) {
          setError('Please select a vehicle type');
          return false;
        }
        break;
      case 3:
        if (!formData.bookingDate || !formData.bookingTime || !formData.location) {
          setError('Please fill in all scheduling details');
          return false;
        }
        break;
      case 4:
        if (!formData.name || !formData.email || !formData.phone) {
          setError('Please fill in all contact details');
          return false;
        }
        if (!formData.email.includes('@')) {
          setError('Please enter a valid email address');
          return false;
        }
        break;
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process booking');
      }

      router.push('/booking/confirmation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process booking');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Select Your Service Package</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {services.map(service => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    formData.serviceType === service.id
                      ? 'border-gold bg-gold/10'
                      : 'border-white/10 hover:border-gold/50'
                  }`}
                >
                  <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                  <p className="text-2xl font-bold text-gold mb-2">${service.price}</p>
                  <p className="text-white/60">{service.duration}</p>
                  {formData.serviceType === service.id && (
                    <FaCheck className="text-gold mt-2" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Additional Services</h3>
              <div className="grid gap-4 md:grid-cols-3">
                {additionalServices.map(service => (
                  <button
                    key={service.id}
                    onClick={() => handleAdditionalServiceToggle(service.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.additionalServices.includes(service.id)
                        ? 'border-gold bg-gold/10'
                        : 'border-white/10 hover:border-gold/50'
                    }`}
                  >
                    <h4 className="font-bold">{service.name}</h4>
                    <p className="text-gold">+${service.price}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Vehicle Information</h2>
            <div className="grid gap-4 md:grid-cols-4">
              {vehicleTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setFormData(prev => ({ ...prev, vehicleType: type.id }))}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    formData.vehicleType === type.id
                      ? 'border-gold bg-gold/10'
                      : 'border-white/10 hover:border-gold/50'
                  }`}
                >
                  <span className="text-4xl mb-2 block">{type.icon}</span>
                  <h3 className="font-bold">{type.name}</h3>
                </button>
              ))}
            </div>

            <div className="mt-6">
              <label className="block mb-2">Additional Vehicle Details</label>
              <textarea
                name="vehicleInfo"
                value={formData.vehicleInfo}
                onChange={handleInputChange}
                placeholder="Year, Make, Model, Color, etc."
                className="w-full p-3 rounded bg-white/5 border border-white/10 focus:border-gold outline-none"
                rows={4}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Schedule Your Service</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block mb-2">Preferred Date</label>
                <input
                  type="date"
                  name="bookingDate"
                  value={formData.bookingDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 rounded bg-white/5 border border-white/10 focus:border-gold outline-none"
                />
              </div>
              <div>
                <label className="block mb-2">Preferred Time</label>
                <select
                  name="bookingTime"
                  value={formData.bookingTime}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded bg-white/5 border border-white/10 focus:border-gold outline-none"
                >
                  <option value="">Select a time</option>
                  <option value="morning">Morning (8am - 12pm)</option>
                  <option value="afternoon">Afternoon (12pm - 4pm)</option>
                  <option value="evening">Evening (4pm - 8pm)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-2">Service Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter your address"
                className="w-full p-3 rounded bg-white/5 border border-white/10 focus:border-gold outline-none"
              />
            </div>

            <div>
              <label className="block mb-2">Special Requests</label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                placeholder="Any special instructions or requests?"
                className="w-full p-3 rounded bg-white/5 border border-white/10 focus:border-gold outline-none"
                rows={4}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full p-3 rounded bg-white/5 border border-white/10 focus:border-gold outline-none"
                />
              </div>
              <div>
                <label className="block mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(408) 634-9181"
                  className="w-full p-3 rounded bg-white/5 border border-white/10 focus:border-gold outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full p-3 rounded bg-white/5 border border-white/10 focus:border-gold outline-none"
              />
            </div>

            <div className="bg-white/5 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
              <div className="space-y-2">
                <p>Service: {services.find(s => s.id === formData.serviceType)?.name}</p>
                <p>Vehicle: {vehicleTypes.find(v => v.id === formData.vehicleType)?.name}</p>
                <p>Date: {formData.bookingDate}</p>
                <p>Time: {formData.bookingTime}</p>
                <p>Location: {formData.location}</p>
                {formData.additionalServices.length > 0 && (
                  <div>
                    <p className="font-bold mt-4">Additional Services:</p>
                    <ul className="list-disc list-inside">
                      {formData.additionalServices.map(id => (
                        <li key={id}>
                          {additionalServices.find(s => s.id === id)?.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="text-xl font-bold text-gold mt-4">
                  Total: ${formData.totalPrice}
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Book Your Detail</h1>
            <div className="flex items-center gap-2">
              <span className="text-gold font-bold">${formData.totalPrice}</span>
              <span className="text-white/60">Total</span>
            </div>
          </div>

          <div className="flex justify-between mb-8">
            {[
              { step: 1, icon: FaCar, label: 'Service' },
              { step: 2, icon: FaInfoCircle, label: 'Vehicle' },
              { step: 3, icon: FaCalendarAlt, label: 'Schedule' },
              { step: 4, icon: FaMapMarkerAlt, label: 'Contact' }
            ].map(({ step, icon: Icon, label }) => (
              <div
                key={step}
                className={`flex flex-col items-center ${
                  step === currentStep
                    ? 'text-gold'
                    : step < currentStep
                    ? 'text-white'
                    : 'text-white/40'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    step === currentStep
                      ? 'bg-gold text-black'
                      : step < currentStep
                      ? 'bg-white/20'
                      : 'bg-white/5'
                  }`}
                >
                  <Icon />
                </div>
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded text-red-500">
              {error}
            </div>
          )}

          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-2 border border-white/10 rounded hover:border-gold transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={currentStep < 4 ? handleNext : handleSubmit}
              disabled={loading}
              className={`px-6 py-2 bg-gold text-black rounded hover:bg-gold/90 transition-colors ml-auto ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Processing...' : currentStep < 4 ? 'Continue' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage; 