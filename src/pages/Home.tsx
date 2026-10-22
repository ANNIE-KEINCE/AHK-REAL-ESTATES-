import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight, Shield, MapPin, UserCheck } from 'lucide-react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Property } from '../types';
import PropertyCard from '../components/PropertyCard';
import { BUSINESS_DETAILS, WHATSAPP_MESSAGES } from '../constants';

const Home: React.FC = () => {
  const [latestProperties, setLatestProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const q = query(
          collection(db, 'properties'),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
        setLatestProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const whatsappUrl = `${BUSINESS_DETAILS.whatsappLink}?text=${encodeURIComponent(WHATSAPP_MESSAGES.general)}`;

  const features = [
    {
      icon: <UserCheck className="text-blue-600" size={32} />,
      title: "Personal Support",
      description: "We provide one-on-one assistance to help you find the property that matches your needs perfectly."
    },
    {
      icon: <Shield className="text-blue-600" size={32} />,
      title: "Clear Information",
      description: "No hidden details. We ensure all property information is transparent and easy to understand."
    },
    {
      icon: <MessageSquare className="text-blue-600" size={32} />,
      title: "Quick Communication",
      description: "Reach us easily via WhatsApp or phone. We value your time and respond promptly."
    },
    {
      icon: <MapPin className="text-blue-600" size={32} />,
      title: "Local Assistance",
      description: "As a growing local business, we have deep knowledge of the areas we serve."
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            className="w-full h-full object-cover opacity-40"
          >
            <source
              src="https://res.cloudinary.com/dffdsahfv/video/upload/v1790853715/InShot_20261001_164748320_xik1qr.mp4"
              type="video/mp4"
            />
          </video>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Find Your Next Property with <span className="text-blue-400">AHK Real Estate</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto"
          >
            We are a growing real estate service dedicated to helping you find suitable properties with personalized support and clear information.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/properties"
              className="w-full sm:w-auto bg-blue-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
            >
              View Properties <ArrowRight size={20} />
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-green-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare size={20} /> Contact on WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      {/* Latest Properties */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">New Property Updates</h2>
              <p className="text-slate-600">Explore our latest listings and find your perfect match.</p>
            </div>
            <Link to="/properties" className="hidden sm:flex items-center text-blue-700 font-semibold hover:underline">
              View All Properties <ArrowRight size={18} className="ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-100 h-96 animate-pulse rounded-xl"></div>
              ))}
            </div>
          ) : latestProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <p className="text-slate-500 text-lg mb-4">No properties listed yet.</p>
              <Link to="/contact" className="text-blue-700 font-semibold">Contact us for enquiries</Link>
            </div>
          )}
          
          <div className="mt-10 text-center sm:hidden">
            <Link to="/properties" className="inline-flex items-center text-blue-700 font-semibold hover:underline">
              View All Properties <ArrowRight size={18} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose AHK Real Estate?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            We are building our reputation through honesty, transparency, and hard work. 
            Here is what you can expect from our growing service.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Looking for a specific property?</h2>
          <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
            Tell us what you are looking for, and we will help you find the most suitable option in your preferred location.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="w-full sm:w-auto bg-white text-blue-900 px-8 py-4 rounded-lg font-bold hover:bg-slate-100 transition-colors"
            >
              Get in Touch
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-green-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare size={20} /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
