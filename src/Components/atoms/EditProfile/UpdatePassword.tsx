import React, { useState } from 'react';
import axios from 'axios';
import { FaLock, FaKey, FaShieldAlt } from 'react-icons/fa';

const UpdatePassword: React.FC = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New Password and Confirm Password must match!');
      setLoading(false);
      return;
    }

    try {
      await axios.put(
        `${backendUrl}/api/users/password`,
        {
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          repeatPassword: formData.confirmPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      setMessage('Password updated successfully!');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-platinum-200 overflow-hidden relative max-w-2xl mx-auto">
      <div className="bg-alabaster-grey-50 px-8 py-6 border-b border-platinum-200 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-platinum-200 shadow-sm text-gunmetal-900">
                <FaShieldAlt size={28} />
            </div>
            <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">Security Settings</h2>
            <p className="text-sm text-slate-grey-500 mt-1">Update your account password to stay secure</p>
        </div>

      <div className="p-8 sm:p-12">
        <form onSubmit={handleSubmit} className="space-y-6">
            {message && <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-lg text-sm font-semibold border border-emerald-100 flex items-center gap-2"><FaShieldAlt /> {message}</div>}
            {error && <div className="bg-rose-50 text-rose-700 px-4 py-3 rounded-lg text-sm font-semibold border border-rose-100 flex items-center gap-2"><FaShieldAlt /> {error}</div>}

            <div>
                 <label className="block text-xs font-bold text-slate-grey-500 uppercase tracking-wide mb-2 ml-1">Current Password</label>
                 <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-grey-400">
                        <FaLock />
                    </span>
                    <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-4 py-3 bg-white border border-platinum-300 rounded-xl text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 shadow-sm transition-all"
                        required
                    />
                 </div>
            </div>

            <div>
                 <label className="block text-xs font-bold text-slate-grey-500 uppercase tracking-wide mb-2 ml-1">New Password</label>
                 <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-grey-400">
                        <FaKey />
                    </span>
                    <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-4 py-3 bg-white border border-platinum-300 rounded-xl text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 shadow-sm transition-all"
                        required
                    />
                 </div>
            </div>

            <div>
                 <label className="block text-xs font-bold text-slate-grey-500 uppercase tracking-wide mb-2 ml-1">Confirm New Password</label>
                 <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-grey-400">
                        <FaKey />
                    </span>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-4 py-3 bg-white border border-platinum-300 rounded-xl text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 shadow-sm transition-all"
                        required
                    />
                 </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gunmetal-900 text-white rounded-xl font-bold text-sm tracking-wide hover:bg-gunmetal-800 transition-all shadow-lg shadow-gunmetal-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>Updating...</>
                    ) : (
                        <>Update Password</>
                    )}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;