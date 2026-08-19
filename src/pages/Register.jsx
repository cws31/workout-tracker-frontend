import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/authApi';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerUser(formData);
      alert('Registration successful! Please sign in.');
      navigate('/login');
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Failed to create account. Try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl">
        
        {/* Header Icon */}
        <div className="flex items-center justify-center gap-2.5 mb-4">
          <svg 
            className="h-7 w-7 sm:h-8 sm:w-8 text-blue-500 shrink-0" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            viewBox="0 0 24 24"
          >
            <path d="M14.4 14.4 9.6 9.6" />
            <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.767a2 2 0 1 1-2.829-2.828l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.829 2.828z" />
            <path d="m2.515 5.343 1.767-1.767a2 2 0 1 1 2.829 2.828L5.343 8.172a2 2 0 1 1-2.828-2.829z" />
            <path d="M6.5 6.5 17.5 17.5" />
          </svg>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
            Workout Tracker
          </h1>
        </div>

        <h2 className="text-sm sm:text-base font-semibold text-slate-300 text-center mb-6">
          Create a New Account
        </h2>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-950/60 border border-red-800/80 text-red-300 p-3.5 rounded-xl mb-4 text-xs sm:text-sm flex items-center gap-2 shadow-inner">
            <svg className="w-4 h-4 shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" />
              <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs sm:text-sm font-medium text-slate-300 block mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              minLength={4}
              maxLength={30}
              placeholder="John Doe"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition shadow-inner"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-xs sm:text-sm font-medium text-slate-300 block mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition shadow-inner"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-xs sm:text-sm font-medium text-slate-300 block mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              placeholder="Min. 8 characters"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition shadow-inner"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.99] disabled:opacity-50 text-white py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 mt-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating Account...</span>
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs sm:text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}