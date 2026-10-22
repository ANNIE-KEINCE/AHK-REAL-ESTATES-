import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Update } from '../../types';
import { Plus, Edit2, Trash2, X, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { uploadImageToSupabase } from '../../utils/supabaseStorage';

const AdminUpdates: React.FC = () => {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState('');
  
  const { register, handleSubmit, reset, setValue } = useForm<Partial<Update>>();

  const fetchUpdates = async () => {
    setLoading(true);
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

  useEffect(() => {
    fetchUpdates();
  }, []);

  const openModal = (update: Update | null = null) => {
    setEditingUpdate(update);
    if (update) {
      setValue('title', update.title);
      setValue('description', update.description);
    } else {
      reset();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUpdate(null);
    setImageFile(null);
    reset();
  };

  const handleImageUpload = async (file: File) => {
    return uploadImageToSupabase(file, 'updates', 5 * 1024 * 1024);
  };

  const onSubmit = async (data: Partial<Update>) => {
    setFormError('');
    setUploading(true);
    try {
      let imageUrl = editingUpdate?.imageUrl || '';
      
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
      }

      const updateData = {
        ...data,
        imageUrl,
        updatedAt: serverTimestamp(),
      };

      if (editingUpdate) {
        await updateDoc(doc(db, 'updates', editingUpdate.id), updateData);
      } else {
        await addDoc(collection(db, 'updates'), {
          ...updateData,
          createdAt: serverTimestamp(),
        });
      }
      
      fetchUpdates();
      closeModal();
    } catch (error) {
      console.error("Error saving update:", error);
      setFormError(error instanceof Error ? error.message : "Failed to save update.");
    } finally {
      setUploading(false);
    }
  };

  const submitForm = handleSubmit(onSubmit, () => {
    setFormError('Enter a title and description before posting the update.');
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this update?")) {
      try {
        await deleteDoc(doc(db, 'updates', id));
        fetchUpdates();
      } catch (error) {
        console.error("Error deleting update:", error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Updates</h1>
          <p className="text-slate-500">Post news and property announcements</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-blue-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-800 transition-colors flex items-center gap-2"
        >
          <Plus size={20} /> Add Update
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-700" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {updates.map((update) => (
            <div key={update.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="h-40 overflow-hidden relative">
                <img 
                  src={update.imageUrl || 'https://via.placeholder.com/400x200'} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => openModal(update)}
                    className="p-2 bg-white/90 text-slate-700 rounded-lg hover:text-blue-600 shadow-sm"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(update.id)}
                    className="p-2 bg-white/90 text-slate-700 rounded-lg hover:text-red-600 shadow-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-5 flex-grow">
                <p className="text-xs text-slate-500 mb-2">
                  {update.createdAt?.seconds ? format(new Date(update.createdAt.seconds * 1000), 'MMM dd, yyyy') : 'Recently'}
                </p>
                <h3 className="font-bold text-slate-900 mb-2 line-clamp-1">{update.title}</h3>
                <p className="text-sm text-slate-600 line-clamp-3">{update.description}</p>
              </div>
            </div>
          ))}
          {updates.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
              No updates posted yet.
            </div>
          )}
        </div>
      )}

      {/* Update Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-slate-900">
                {editingUpdate ? 'Edit Update' : 'Add New Update'}
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
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Title *</label>
                <input
                  {...register('title', { required: true })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Update title..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description *</label>
                <textarea
                  {...register('description', { required: true })}
                  rows={5}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Write your update content here..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Cover Image</label>
                <div className="mt-1 rounded-lg border-2 border-slate-300 border-dashed p-5">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
                    <ImageIcon className="h-5 w-5 text-slate-400" />
                    <span>Select an image</span>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                    aria-label="Choose update image"
                    className="block w-full cursor-pointer text-sm text-slate-600 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                  <p className="mt-2 text-xs text-slate-500">PNG, JPG, WebP, GIF, or AVIF up to 5MB. Upload starts when you post the update.</p>
                </div>
                {(imageFile || (editingUpdate && editingUpdate.imageUrl)) && (
                  <p className="mt-2 text-sm text-blue-600 font-semibold">
                    {imageFile ? imageFile.name : 'Current image kept'}
                  </p>
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
                  {editingUpdate ? 'Update Post' : 'Post Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUpdates;
