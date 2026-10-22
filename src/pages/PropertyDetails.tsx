import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Property } from '../types';
import { MapPin, Home, Maximize, MessageSquare, Phone, Calendar, CheckCircle, ArrowLeft } from 'lucide-react';
import { BUSINESS_DETAILS, WHATSAPP_MESSAGES } from '../constants';
// import { motion } from 'framer-motion';

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'properties', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProperty({ id: docSnap.id, ...docSnap.data() } as Property);
        }
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <div className="w-12 h-12 border-4 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
        <Link to="/properties" className="text-blue-700 font-semibold hover:underline flex items-center justify-center gap-1">
          <ArrowLeft size={18} /> Back to Properties
        </Link>
      </div>
    );
  }

  const whatsappUrl = `${BUSINESS_DETAILS.whatsappLink}?text=${encodeURIComponent(
    WHATSAPP_MESSAGES.propertyEnquiry(property.title, property.location, property.price)
  )}`;

  const images = property.images.length > 0 ? property.images : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'];

  return (
    <div className="bg-slate-50 min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/properties" className="inline-flex items-center text-slate-600 hover:text-blue-700 mb-6 transition-colors font-medium">
          <ArrowLeft size={20} className="mr-2" /> Back to all properties
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 mb-8">
              <div className="relative h-[400px] md:h-[500px]">
                <img
                  src={images[activeImage]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-md ${
                    property.listingType === 'Sale' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                  }`}>
                    For {property.listingType}
                  </span>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-md ${
                    property.status === 'Available' ? 'bg-white text-blue-900' : 'bg-red-600 text-white'
                  }`}>
                    {property.status}
                  </span>
                </div>
              </div>
              
              {images.length > 1 && (
                <div className="p-4 flex gap-4 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative w-24 h-24 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        activeImage === idx ? 'border-blue-600' : 'border-transparent opacity-70'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{property.title}</h1>
                  <div className="flex items-center text-slate-500">
                    <MapPin size={18} className="mr-1" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-blue-700">
                  {property.price}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 border-y border-slate-100 py-6">
                <div className="flex flex-col items-center p-4 bg-slate-50 rounded-xl">
                  <Home className="text-blue-600 mb-2" size={24} />
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Type</span>
                  <span className="font-bold text-slate-900">{property.propertyType}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-slate-50 rounded-xl">
                  <Maximize className="text-blue-600 mb-2" size={24} />
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Area</span>
                  <span className="font-bold text-slate-900">{property.area}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-slate-50 rounded-xl">
                  <CheckCircle className="text-blue-600 mb-2" size={24} />
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Status</span>
                  <span className="font-bold text-slate-900">{property.status}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-slate-50 rounded-xl">
                  <Calendar className="text-blue-600 mb-2" size={24} />
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Listed</span>
                  <span className="font-bold text-slate-900">Recently</span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Description</h3>
                <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {property.description}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Contact */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 sticky top-28">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Interested in this property?</h3>
              
              <div className="space-y-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare size={20} /> Enquiry on WhatsApp
                </a>
                
                <Link
                  to="/contact"
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Phone size={20} /> Contact for Details
                </Link>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4">Why work with us?</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle size={16} className="text-green-600 mt-0.5" />
                    <span>Personalized property tours and walkthroughs.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle size={16} className="text-green-600 mt-0.5" />
                    <span>Transparent pricing and legal documentation assistance.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle size={16} className="text-green-600 mt-0.5" />
                    <span>Dedicated local support every step of the way.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
