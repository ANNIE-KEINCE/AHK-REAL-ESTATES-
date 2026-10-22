import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '../firebase/config';
import { LogIn, Shield, Lock, Mail, AlertCircle } from 'lucide-react';

const getLoginErrorMessage = (error: unknown): string => {
  if (!(error instanceof FirebaseError)) {
    return 'Sign-in failed unexpectedly. Please try again.';
  }

  switch (error.code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Email or password is incorrect. Use the email address on the Firebase user account, not its UID or username.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/user-disabled':
      return 'This Firebase user account is disabled. Enable it in Firebase Console → Authentication → Users.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is disabled for the Firebase project configured in this app.';
    case 'auth/configuration-not-found':
      return 'Firebase Authentication is not configured for this project. In Firebase Console, select ahk-real-estate, open Authentication, finish setup if prompted, then enable and save Email/Password under Sign-in method.';
    case 'auth/too-many-requests':
      return 'Too many sign-in attempts. Wait a while and try again.';
    case 'auth/network-request-failed':
      return 'Could not reach Firebase Authentication. Check your internet connection and try again.';
    case 'auth/api-key-not-valid':
      return 'The Firebase API key is invalid. Check the VITE_FIREBASE_* configuration and restart the dev server.';
    default:
      console.error('Firebase sign-in failed:', error.code);
      return `Firebase sign-in failed (${error.code}). Check the Firebase project and account settings.`;
  }
};

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard');
    } catch (error: unknown) {
      console.error('Login error:', error);
      setError(getLoginErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
            <Shield className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-blue-300">Sign in to manage your properties and updates</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2 mb-6 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>Signing in...</>
              ) : (
                <>
                  <LogIn size={20} /> Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-slate-500 text-sm">
          Protected area. Authorized personnel only.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
