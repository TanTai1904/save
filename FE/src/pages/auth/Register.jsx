import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User, UserPlus, Send, X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const BASE_URL = import.meta.env.VITE_API_URL || (window.location.origin.includes('localhost') ? 'http://localhost:5000/api' : 'https://save-production-55af.up.railway.app/api');

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailAvailable, setEmailAvailable] = useState(null); // null, true, false
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [modalTab, setModalTab] = useState('terms'); // 'terms' | 'privacy'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const checkEmailDuplication = async (emailVal) => {
    if (!emailVal) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) {
      setEmailError('Định dạng email không hợp lệ.');
      setEmailAvailable(null);
      return;
    }
    
    setEmailChecking(true);
    setEmailError('');
    try {
      const res = await fetch(`${BASE_URL}/auth/check-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailVal })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.exists) {
          setEmailAvailable(false);
          setEmailError('Email này đã được đăng ký trên hệ thống.');
        } else {
          setEmailAvailable(true);
          setEmailError('');
        }
      } else {
        setEmailError(data.message || 'Lỗi kiểm tra email.');
        setEmailAvailable(null);
      }
    } catch (err) {
      setEmailError('Không thể kết nối server.');
      setEmailAvailable(null);
    } finally {
      setEmailChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin đăng ký.');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải chứa ít nhất 6 ký tự.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }
    if (emailAvailable === false) {
      setError('Email này đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.');
      return;
    }
    if (!agree) {
      setError('Bạn cần đồng ý với Điều khoản Sử dụng để tiếp tục.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || 'Không thể gửi mã OTP. Vui lòng thử lại.');
        setLoading(false);
        return;
      }
      
      navigate('/otp-verify', { state: { name, email, password, idNumber: null, testOtp: data.otp } });
    } catch (err) {
      setError('Lỗi kết nối server. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-teal/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-green/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-xl bg-white/95 backdrop-blur-md p-10 rounded-3xl border border-slate-200/80 shadow-2xl relative z-10 text-slate-800 fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-teal to-brand-green items-center justify-center text-white font-black text-3xl shadow-lg shadow-teal-500/20 mb-4">
            S+
          </div>
          <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-teal to-brand-green">
            Tạo tài khoản mới
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">Bắt đầu hành trình làm chủ tài chính cá nhân miễn phí</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-650 text-sm rounded-xl font-medium">{error}</div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">Họ và tên của bạn</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400"><User size={18} /></span>
              <input type="text" placeholder="Họ và tên" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/35 transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">Địa chỉ Email</label>
            <div className="flex space-x-3">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400"><Mail size={18} /></span>
                <input type="email" placeholder="email@gmail.com" value={email} 
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailAvailable(null);
                    setEmailError('');
                  }}
                  onBlur={(e) => checkEmailDuplication(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/35 transition-all" />
              </div>
              <button
                type="button"
                onClick={() => checkEmailDuplication(email)}
                disabled={emailChecking || !email}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all border border-slate-200 disabled:opacity-50 cursor-pointer">
                {emailChecking ? 'Đang check...' : 'Kiểm tra'}
              </button>
            </div>
            {emailError && (
              <p className="text-xs text-red-500 mt-1.5">{emailError}</p>
            )}
            {emailAvailable && (
              <p className="text-xs text-emerald-600 mt-1.5">✓ Email hợp lệ và có thể đăng ký.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">Mật khẩu bảo mật</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400"><Lock size={18} /></span>
              <input type={showPassword ? "text" : "password"} placeholder="Tối thiểu 6 ký tự" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-12 text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/35 transition-all" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-650 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">Xác nhận mật khẩu</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400"><Lock size={18} /></span>
              <input type={showConfirmPassword ? "text" : "password"} placeholder="Nhập lại mật khẩu" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-12 text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/35 transition-all" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-650 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-start space-x-3 py-1.5">
            <input type="checkbox" id="agree_terms" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 accent-brand-teal rounded w-4 h-4 cursor-pointer" />
            <label htmlFor="agree_terms" className="text-xs text-slate-500 leading-normal cursor-pointer">
              Tôi đồng ý với{' '}
              <button
                type="button"
                onClick={() => {
                  setModalTab('terms');
                  setShowTermsModal(true);
                }}
                className="text-brand-teal hover:underline font-bold bg-transparent border-none p-0 cursor-pointer inline"
              >
                Điều khoản Dịch vụ
              </button>{' '}
              và{' '}
              <button
                type="button"
                onClick={() => {
                  setModalTab('privacy');
                  setShowTermsModal(true);
                }}
                className="text-brand-teal hover:underline font-bold bg-transparent border-none p-0 cursor-pointer inline"
              >
                Chính sách Bảo mật
              </button>{' '}
              của SAVE+.
            </label>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-teal to-brand-green text-white font-black text-base shadow-lg shadow-teal-500/10 hover:opacity-90 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50">
            {loading ? <span className="block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><UserPlus size={18} /><span>Đăng ký tài khoản</span></>}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-8">
          Đã có tài khoản?{' '}<Link to="/login" className="text-brand-teal hover:underline font-bold">Đăng nhập</Link>
        </p>
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center space-x-1.5 text-xs text-slate-400">
          <ShieldCheck size={14} className="text-brand-green" />
          <span>Thông tin cá nhân được bảo mật an toàn</span>
        </div>
      </div>

      {/* Terms & Privacy Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col transform transition-all duration-300">
            {/* Modal Header */}
            <div className="px-8 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-850">
              <div>
                <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">Điều khoản & Chính sách SAVE+</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Vui lòng đọc kỹ trước khi đăng ký sử dụng</p>
              </div>
              <button 
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => setModalTab('terms')}
                className={`flex-1 py-4 text-center text-base font-bold transition-all border-b-2 cursor-pointer ${
                  modalTab === 'terms'
                    ? 'border-brand-teal text-brand-teal bg-white dark:bg-slate-850/50'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-850/30'
                }`}
              >
                Điều khoản Dịch vụ
              </button>
              <button
                type="button"
                onClick={() => setModalTab('privacy')}
                className={`flex-1 py-4 text-center text-base font-bold transition-all border-b-2 cursor-pointer ${
                  modalTab === 'privacy'
                    ? 'border-brand-teal text-brand-teal bg-white dark:bg-slate-850/50'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-850/30'
                }`}
              >
                Chính sách Bảo mật
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-8 overflow-y-auto space-y-6 text-lg text-slate-650 dark:text-slate-305 leading-relaxed max-h-[65vh]">
              {modalTab === 'terms' ? (
                <div className="space-y-6 animate-fadeIn text-slate-700 dark:text-slate-305">
                  <div className="p-4 bg-teal-500/5 dark:bg-teal-500/5 rounded-xl border border-teal-500/15 text-base text-teal-700 dark:text-teal-400 font-semibold">
                    Để nâng cao dân trí tài chính cho người trẻ Việt Nam, dự án SAVE+ cung cấp nền tảng quản lý ngân sách và giả lập tích lũy. Vui lòng nắm rõ tuyên bố miễn trừ trách nhiệm dưới đây.
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-base">1. Mô Tả Dịch Vụ</h4>
                    <p>SAVE+ cung cấp các công cụ trực quan bao gồm quản lý chi tiêu (6 hũ tài chính, quy tắc 50/30/20), tính toán lãi kép, thử thách tích lũy học tập, AI Mentor trợ giúp giải đáp tài chính, và các tạp chí tài khóa chính thống.</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-extrabold text-rose-600 uppercase tracking-wider text-base">⚠️ 2. Tuyên Bố Miễn Trừ Trách Nhiệm (Disclaimer)</h4>
                    <p className="font-bold text-slate-900 dark:text-white">Dự án SAVE+ hoàn toàn phục vụ mục tiêu giáo dục, mô phỏng và học tập. Chúng tôi KHÔNG cung cấp các dịch vụ tư vấn đầu tư tài chính chuyên nghiệp có tính pháp lý hoặc cam kết sinh lời thực tế.</p>
                    <p>Mọi thông tin, phản hồi và câu trả lời từ AI Mentor chỉ mang tính tham khảo định hướng. Người dùng tự chịu trách nhiệm hoàn toàn đối với mọi giao dịch, đầu tư tài chính thực tế ngoài đời thực của mình.</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-base">3. Quyền Sở Hữu Trí Tuệ</h4>
                    <p>Toàn bộ tài liệu, giáo trình, và các bài viết phân tích kinh tế vĩ mô hiển thị trên hệ thống thuộc sở hữu độc quyền của SAVE+ hoặc các nguồn uy tín đối tác được trích dẫn rõ ràng. Người dùng không được sao chép thương mại hóa trái phép.</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-base">4. Quy Định Sử Dụng Tài Khoản</h4>
                    <p>Người dùng có trách nhiệm bảo mật thông tin đăng nhập cá nhân. Tuyệt đối cấm sử dụng các công cụ can thiệp phá hoại hệ thống hoặc cố ý giả mạo thông tin định danh (KYC) trong quá trình nâng cấp hội viên.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5 animate-fadeIn text-slate-700 dark:text-slate-305">
                  <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/5 rounded-xl border border-teal-500/15 text-base text-emerald-700 dark:text-emerald-400 font-semibold">
                    Cam kết bảo mật dữ liệu an toàn tối đa. SAVE+ cam kết không bán, không chuyển giao thông tin cá nhân và số liệu tài chính giả lập của bạn cho bất cứ bên thứ ba nào.
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-base">1. Dữ Liệu Thu Thập</h4>
                    <p>Chúng tôi thu thập các thông tin bao gồm Họ tên và Email để khởi tạo tài khoản và gửi mã xác thực OTP phục vụ an toàn đăng ký.</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-base">2. Dữ Liệu Khảo Sát & Giả Lập</h4>
                    <p>Để tối ưu lộ trình học tập riêng biệt cho mỗi cá nhân, hệ thống ghi nhận câu trả lời khảo sát khẩu vị rủi ro và các mục tiêu tài chính tự lập của bạn.</p>
                    <p className="font-bold text-slate-900 dark:text-white">Lưu ý: Mọi dòng tiền, số dư tài khoản thử nghiệm trên hệ thống đều là giả lập và không liên kết với thông tin tài khoản ngân hàng thật của bạn.</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-base">3. Lưu Trữ Cookie & LocalStorage</h4>
                    <p>Ứng dụng sử dụng LocalStorage của trình duyệt nhằm duy trì trạng thái đăng nhập thuận tiện, lưu giữ điểm kinh nghiệm (XP), chuỗi học tập (Streak) và tùy chỉnh chế độ sáng tối giao diện (Dark/Light mode).</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-base">4. Cam Kết Bảo Mật</h4>
                    <p>Toàn bộ đường truyền dữ liệu được bảo vệ an toàn bằng giao thức mã hóa SSL. Chúng tôi luôn cải tiến công nghệ bảo mật để chống truy cập trái phép và bảo vệ an toàn tối đa cho trải nghiệm người dùng.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/50 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-base font-bold rounded-xl transition-all cursor-pointer border border-slate-200 dark:border-slate-750"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  setAgree(true);
                  setShowTermsModal(false);
                }}
                className="px-6 py-3 bg-gradient-to-r from-brand-teal to-brand-green text-white text-base font-bold rounded-xl shadow-md shadow-teal-500/10 hover:opacity-90 transition-all cursor-pointer"
              >
                Đồng ý và Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
