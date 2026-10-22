import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { BUSINESS_DETAILS } from '../constants';
import ahkLogo from '../ahk-logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <img src={ahkLogo} alt="AHK Real Estates" className="h-16 w-auto object-contain" />
            </Link>
            <p className="text-sm text-blue-300">
              A growing real estate service committed to helping you find the perfect property with clarity and honesty.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/properties" className="hover:text-white transition-colors">Properties</Link></li>
              <li><Link to="/updates" className="hover:text-white transition-colors">Updates</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/admin/login" className="hover:text-white transition-colors">Admin Login</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Contact Us</h3>
            <ul className="space-y-3 text-sm text-blue-300">
              <li className="flex items-start space-x-3">
                <Phone size={18} className="text-blue-300 mt-1 shrink-0" />
                <span>{BUSINESS_DETAILS.whatsapp}</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={18} className="text-blue-300 mt-1 shrink-0" />
                <span>{BUSINESS_DETAILS.email}</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-blue-300 mt-1 shrink-0" />
                <a
                  href={BUSINESS_DETAILS.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {BUSINESS_DETAILS.address} · View on Google Maps
                </a>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Working Hours</h3>
            <p className="text-sm text-blue-300 mb-4">{BUSINESS_DETAILS.workingHours}</p>
            <div className="flex space-x-4">
              <a
                href={BUSINESS_DETAILS.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-white text-sm"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 mt-8 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} AHK Real Estate. All rights reserved.</p>
          <p className="mt-2">Personalized real estate services you can trust.</p>
          <p className="mt-2">
            Designed by{' '}
            <a
              href="https://shift-pattern-studio-jtcn.vercel.app/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAcGRvZgJzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAacwXJ4asQEC03St1t8-Y4MW6BEmTm4zeCMMiP2QeBSGdzHQEnYrCIvipzLkLw_aem_pOajTqUguZB22G7QXIWjpg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:text-white transition-colors"
            >
              Shift Pattern Studio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
