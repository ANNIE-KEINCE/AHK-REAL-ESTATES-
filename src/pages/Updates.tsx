import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Update } from '../types';
import { Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const Updates: React.FC = () => {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const q = query(collection(db, 'updates'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Update));
        setUpdates(data);
      } catch (error) {
        console.error("Error fetching updates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUpdates();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">News & Updates</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Stay informed about our newest property listings, business milestones, and local real estate news.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-200 h-64 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : updates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {updates.map((update) => (
              <div key={update.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 flex flex-col md:flex-row">
                <div className="md:w-2/5 h-48 md:h-auto overflow-hidden">
                  <img
                    src={update.imageUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    alt={update.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="md:w-3/5 p-6 flex flex-col">
                  <div className="flex items-center gap-4 text-slate-500 text-xs mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{update.createdAt?.seconds ? format(new Date(update.createdAt.seconds * 1000), 'MMM dd, yyyy') : 'Recently'}</span>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">{update.title}</h2>
                  <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-grow">
                    {update.description}
                  </p>
                  <div className="mt-auto">
                    <span className="inline-flex items-center text-blue-700 font-semibold text-sm">
                      New Property Update <ArrowRight size={16} className="ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">No updates yet</h3>
            <p className="text-slate-600">Check back soon for latest news and property announcements.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Updates;
