import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Enquiry } from '../../types';
import { Trash2, CheckCircle, Mail, Phone, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const AdminEnquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Enquiry));
      setEnquiries(data);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'New' ? 'Handled' : 'New';
    try {
      await updateDoc(doc(db, 'enquiries', id), {
        enquiryStatus: newStatus
      });
      fetchEnquiries();
    } catch (error) {
      console.error("Error updating enquiry:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this enquiry?")) {
      try {
        await deleteDoc(doc(db, 'enquiries', id));
        fetchEnquiries();
      } catch (error) {
        console.error("Error deleting enquiry:", error);
      }
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Customer Enquiries</h1>
        <p className="text-slate-500">View and manage messages from your customers</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-700" size={40} />
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enquiry) => (
            <div 
              key={enquiry.id} 
              className={`bg-white rounded-xl shadow-sm border p-6 transition-all ${
                enquiry.enquiryStatus === 'New' ? 'border-l-4 border-l-blue-600 border-slate-200' : 'border-slate-200 opacity-80'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-slate-900 text-lg">{enquiry.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      enquiry.enquiryStatus === 'New' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {enquiry.enquiryStatus}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Phone size={14} />
                      <span>{enquiry.phone}</span>
                    </div>
                    {enquiry.email && (
                      <div className="flex items-center gap-1">
                        <Mail size={14} />
                        <span>{enquiry.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{enquiry.createdAt?.seconds ? format(new Date(enquiry.createdAt.seconds * 1000), 'MMM dd, yyyy HH:mm') : 'Recently'}</span>
                    </div>
                  </div>

                  {enquiry.propertyTitle && (
                    <div className="bg-slate-50 px-3 py-2 rounded text-sm mb-4 border border-slate-100 inline-block">
                      <span className="font-semibold text-slate-700">Property: </span>
                      <span className="text-blue-700">{enquiry.propertyTitle}</span>
                    </div>
                  )}

                  <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-4 rounded-lg">
                    {enquiry.message}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-2 shrink-0 md:justify-start">
                  <button
                    onClick={() => handleStatusChange(enquiry.id, enquiry.enquiryStatus)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                      enquiry.enquiryStatus === 'New' 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <CheckCircle size={16} />
                    {enquiry.enquiryStatus === 'New' ? 'Mark Handled' : 'Re-open'}
                  </button>
                  <button
                    onClick={() => handleDelete(enquiry.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold text-sm hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {enquiries.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
              <Mail className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-500">No enquiries yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminEnquiries;
