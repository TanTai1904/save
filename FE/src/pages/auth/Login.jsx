import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Mail, Lock, LogIn, Sparkles, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin đăng nhập.');
      return;
    }

    setLoading(true);
    try {
      const assignedRole = await login(email, password);
      if (assignedRole === 'admin' || assignedRole === 'staff') {
        navigate('/admin');
      } else {
        const from = location.state?.from?.pathname || location.state?.from || '/';
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Lỗi đăng nhập. Vui lòng kiểm tra lại tài khoản và mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-teal/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-green/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-xl bg-white/95 backdrop-blur-md p-10 rounded-3xl border border-slate-200/80 shadow-2xl relative z-10 text-slate-800 fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-teal to-brand-green items-center justify-center text-white font-black text-3xl shadow-lg shadow-teal-500/20 mb-4">
            S+
          </div>
          <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-teal to-brand-green">
            Chào mừng đến với SAVE+
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">Nền tảng giáo dục tài chính số 1 cho nhà đầu tư trẻ Việt Nam</p>
        </div>

        {/* Regular Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-650 text-sm rounded-xl font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">Email tài khoản</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                <Mail size={18} />
              </span>
              <input 
                type="email"
                placeholder="email@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/35 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-slate-600">Mật khẩu</label>
              <Link to="/forgot-password" className="text-sm text-brand-teal hover:underline font-semibold">Quên mật khẩu?</Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                <Lock size={18} />
              </span>
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-12 text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/35 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-655 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* End Role Choice */}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-teal to-brand-green text-white font-black text-base shadow-lg shadow-teal-500/10 hover:opacity-90 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={18} />
                <span>Đăng nhập</span>
              </>
            )}
          </button>
        </form>

        {/* Register Redirect */}
        <p className="text-center text-sm text-slate-600 mt-8">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-brand-teal hover:underline font-bold">Đăng ký ngay</Link>
        </p>

        {/* Security / Trust Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center space-x-1.5 text-xs text-slate-400">
          <ShieldCheck size={14} className="text-brand-green" />
          <span>Dữ liệu được mã hóa an toàn 256-bit SSL</span>
        </div>
      </div>
    </div>
  );
}
