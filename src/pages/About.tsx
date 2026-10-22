import React from 'react';
import { Shield, Users, Target, CheckCircle } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About AHK Real Estate</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            A growing real estate service built on the foundation of trust, transparency, and personalized customer care.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Journey</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                AHK Real Estate is a new and growing real estate service based on the belief that everyone deserves a clear and honest path to finding their next property. We started with a simple goal: to simplify the property search process and provide genuine assistance to our local community.
              </p>
              <p className="text-slate-600 mb-4 leading-relaxed">
                As a beginner business, we don't rely on huge marketing budgets or thousands of past transactions. Instead, we rely on our commitment to every single customer who reaches out to us. We treat your search for a home or land as if it were our own.
              </p>
              <p className="text-slate-600 leading-relaxed">
                We are constantly expanding our property listings and refining our services to better serve you. When you choose AHK Real Estate, you are choosing a partner who is dedicated to your satisfaction.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Modern Building"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-blue-700 text-white p-8 rounded-2xl hidden md:block">
                <p className="text-2xl font-bold">Growing Daily</p>
                <p className="text-blue-100">Serving our local community</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Values</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            These core principles guide everything we do at AHK Real Estate.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Shield className="text-blue-700" size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Absolute Honesty</h3>
              <p className="text-slate-600">
                We provide clear and accurate information about every property. No hidden details, just the facts you need to make a decision.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="text-blue-700" size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Customer Centric</h3>
              <p className="text-slate-600">
                Being a new business allows us to give you the personalized attention you won't find at larger firms. Your needs come first.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Target className="text-blue-700" size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Local Focus</h3>
              <p className="text-slate-600">
                We specialize in our local area, giving us unique insights into the best locations, prices, and upcoming opportunities for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Our Commitment to You</h2>
          <div className="space-y-4 text-left inline-block">
            {[
              "We will respond to your enquiries as quickly as possible.",
              "We will only show you properties that match your criteria.",
              "We will assist with all communication between buyers and sellers.",
              "We will keep you updated on new properties that fit your needs."
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-700">
                <CheckCircle className="text-green-600 shrink-0" size={20} />
                <span className="text-lg">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
