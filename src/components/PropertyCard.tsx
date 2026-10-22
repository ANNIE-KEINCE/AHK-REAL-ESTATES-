import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Home, MessageSquare, ChevronRight } from 'lucide-react';
import { Property } from '../types';
import { BUSINESS_DETAILS, WHATSAPP_MESSAGES } from '../constants';
import { motion } from 'framer-motion';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const whatsappUrl = `${BUSINESS_DETAILS.whatsappLink}?text=${encodeURIComponent(
    WHATSAPP_MESSAGES.propertyEnquiry(property.title, property.location, property.price)
  )}`;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            property.listingType === 'Sale' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
          }`}>
            For {property.listingType}
          </span>
          {property.status !== 'Available' && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white text-center">
              {property.status}
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{property.title}</h3>
          <span className="text-blue-700 font-bold">{property.price}</span>
        </div>
        
        <div className="flex items-center text-slate-500 text-sm mb-3">
          <MapPin size={14} className="mr-1" />
          <span className="line-clamp-1">{property.location}</span>
        </div>

        <div className="flex items-center gap-4 text-slate-600 text-sm mb-4">
          <div className="flex items-center gap-1">
            <Home size={14} />
            <span>{property.propertyType}</span>
          </div>
          <div className="text-slate-300">|</div>
          <span>{property.area}</span>
        </div>

        <p className="text-slate-600 text-sm line-clamp-2 mb-5 flex-grow">
          {property.description}
        </p>

        <div className="grid grid-cols-2 gap-3 mt-auto">
          <Link
            to={`/properties/${property.id}`}
            className="flex items-center justify-center gap-1 bg-slate-100 text-slate-700 py-2 rounded-lg font-semibold hover:bg-slate-200 transition-colors text-sm"
          >
            Details <ChevronRight size={16} />
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm"
          >
            <MessageSquare size={16} /> Enquiry
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
