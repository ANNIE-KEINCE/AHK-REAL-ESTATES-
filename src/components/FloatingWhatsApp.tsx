import React from 'react';
import { MessageCircle } from 'lucide-react';
import { BUSINESS_DETAILS, WHATSAPP_MESSAGES } from '../constants';

const FloatingWhatsApp: React.FC = () => {
  const whatsappUrl = `${BUSINESS_DETAILS.whatsappLink}?text=${encodeURIComponent(WHATSAPP_MESSAGES.general)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 flex items-center justify-center group"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle size={28} />
      <span className="absolute right-full mr-3 bg-white text-green-600 font-semibold py-1 px-3 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Chat with us!
      </span>
    </a>
  );
};

export default FloatingWhatsApp;
