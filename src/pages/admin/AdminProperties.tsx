import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Property } from '../../types';
import { Plus, Edit2, Trash2, X, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { uploadImageToSupabase } from '../../utils/supabaseStorage';

const AdminProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState('');
  
  const { register, handleSubmit, reset, setValue } = useForm<Partial<Property>>();

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
      setProperties(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const openModal = (property: Property | null = null) => {
    setEditingProperty(property);
    if (property) {
      Object.entries(property).forEach(([key, value]) => {
        setValue(key as keyof Property, value);
      });
    } else {
      reset({
        status: 'Available',
        propertyType: 'House',
        listingType: 'Sale',
        featured: false
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProperty(null);
    setImageFiles(null);
    reset();
  };

  const handleImageUpload = async (files: FileList) => {
    return Promise.all(
      Array.from(files, (file) => uploadImageToSupabase(file, 'properties', 10 * 1024 * 1024))
    );
  };

  const onSubmit = async (data: Partial<Property>) => {
    setFormError('');
    setUploading(true);
    try {
      let imageUrls = editingProperty?.images || [];
      
      if (imageFiles && imageFiles.length > 0) {
        const newUrls = await handleImageUpload(imageFiles);
        imageUrls = [...imageUrls, ...newUrls];
      }

      const propertyData = {
        ...data,
        images: imageUrls,
        updatedAt: serverTimestamp(),
      };

      if (editingProperty) {
        await updateDoc(doc(db, 'properties', editingProperty.id), propertyData);
      } else {
        await addDoc(collection(db, 'properties'), {
          ...propertyData,
          createdAt: serverTimestamp(),
        });
      }
      
      fetchProperties();
      closeModal();
    } catch (error) {
      console.error("Error saving property:", error);
      setFormError(error instanceof Error ? error.message : "Failed to save property. Check console for errors.");
    } finally {
      setUploading(false);
    }
  };

  const submitForm = handleSubmit(onSubmit, () => {
    setFormError('Complete all required fields before saving the property.');
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteDoc(doc(db, 'properties', id));
        fetchProperties();
      } catch (error) {
        console.error("Error deleting property:", error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Properties</h1>
          <p className="text-slate-500">Add, edit or remove property listings</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-blue-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-800 transition-colors flex items-center gap-2"
        >
          <Plus size={20} /> Add Property
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-700" size={40} />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">Property</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">Location</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">Price</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={property.images[0] || 'https://via.placeholder.com/50'} 
                          alt="" 
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{property.title}</p>
                          <p className="text-xs text-slate-500">{property.propertyType} • {property.listingType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{property.location}</td>
                    <td className="px-6 py-4 text-sm font-bold text-blue-700">{property.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        property.status === 'Available' ? 'bg-green-100 text-green-700' : 
                        property.status === 'Sold' ? 'bg-red-100 text-red-700' : 
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openModal(property)}
                          className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {properties.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              No properties found. Add your first listing!
            </div>
          )}
        </div>
      )}

      {/* Property Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-slate-900">
                {editingProperty ? 'Edit Property' : 'Add New Property'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={submitForm} className="p-6 space-y-4">
              {formError && (
                <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formError}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Title *</label>
                  <input
                    {...register('title', { required: true })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Modern 3BHK Apartment"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Price *</label>
                  <input
                    {...register('price', { required: true })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. ₹ 45,00,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Location *</label>
                  <input
                    {...register('location', { required: true })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Anna Nagar, Chennai"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Property Type</label>
                  <select
                    {...register('propertyType')}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="House">House</option>
                    <option value="Land">Land</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Listing Type</label>
                  <select
                    {...register('listingType')}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Sale">Sale</option>
                    <option value="Rent">Rent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Area / Size</label>
                  <input
                    {...register('area')}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. 1200 sq.ft"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    {...register('status')}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Available">Available</option>
                    <option value="Sold">Sold</option>
                    <option value="Rented">Rented</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description *</label>
                <textarea
                  {...register('description', { required: true })}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Describe the property details..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Property Images</label>
                <div className="mt-1 rounded-lg border-2 border-slate-300 border-dashed p-5">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
                    <ImageIcon className="h-5 w-5 text-slate-400" />
                    <span>Select one or more images</span>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                    aria-label="Choose property images"
                    className="block w-full cursor-pointer text-sm text-slate-600 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                    onChange={(e) => setImageFiles(e.target.files?.length ? e.target.files : null)}
                  />
                  <p className="mt-2 text-xs text-slate-500">PNG, JPG, WebP, GIF, or AVIF up to 10MB each. Upload starts when you save the property.</p>
                </div>
                {imageFiles && (
                  <p className="mt-2 text-sm text-blue-600 font-semibold">
                    {imageFiles.length} file(s) selected
                  </p>
                )}
                {editingProperty && editingProperty.images.length > 0 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto py-2">
                    {editingProperty.images.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded overflow-hidden border shrink-0">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-3 bg-blue-700 text-white rounded-xl font-bold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {uploading ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                  {editingProperty ? 'Update Property' : 'Save Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProperties;
