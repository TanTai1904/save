import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Shield, 
  TrendingUp, 
  Award, 
  AlertOctagon, 
  Clock, 
  Percent,
  Download,
  Filter,
  AlertTriangle,
  Flame,
  Search,
  MessageSquare,
  CreditCard,
  Target,
  FileText,
  ShieldCheck,
  Cpu,
  Calendar,
  Layers,
  ChevronRight,
  HelpCircle,
  TrendingDown
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function AdminDashboard() {
  const { 
    users, 
    blockUser, 
    deleteUser, 
    approveKYC, 
    updateUserDetails, 
    paymentRequests, 
    getPaymentRequests, 
    approvePaymentRequest, 
    rejectPaymentRequest 
  } = useAuth();
  const { darkMode } = useTheme();
  const location = useLocation();
  
  // Tab states: 'overview' | 'finance' | 'users'
  const [adminTab, setAdminTab] = useState('overview');
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [exporting, setExporting] = useState(false);

  // Date filters for Finance
  const [filterDay, setFilterDay] = useState(''); // YYYY-MM-DD
  const [filterMonth, setFilterMonth] = useState('all'); // 'all', '1', '2', ..., '12'
  const [filterYear, setFilterYear] = useState('all'); // 'all', '2026', '2025'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'Approved', 'Pending', 'Rejected'

  // User management search/filter state
  const [userSearch, setUserSearch] = useState('');
  const [filterUserSub, setFilterUserSub] = useState('all');
  const [filterUserStatus, setFilterUserStatus] = useState('all');
  const [filterUserRisk, setFilterUserRisk] = useState('all');

  // Edit user state
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editSub, setEditSub] = useState('Free');
  const [editRisk, setEditRisk] = useState('None');

  // Stateful reports mapping to actual user IDs (U004, U002, U001)
  const [reports, setReports] = useState([
    { id: 1, userId: 'U004', user: 'Nguyễn Bích Vy', time: '10 phút trước', issue: 'Đăng link lừa đảo đầu tư cam kết lãi suất 200%/tháng.', action: 'Ban User' },
    { id: 2, userId: 'U002', user: 'Lê Thị Mai', time: '30 phút trước', issue: 'Spam bán khoá học ngoài chủ đề an toàn tài chính.', action: 'Reviewing' },
    { id: 3, userId: 'U001', user: 'Trần Minh Quân', time: '2 giờ trước', issue: 'Ngôn từ xúc phạm, đả kích cá nhân khác trong group thảo luận.', action: 'Approved Content' }
  ]);

  // Sync tab active state with location pathname
  useEffect(() => {
    if (location.pathname.includes('subscriptions')) {
      setAdminTab('finance');
    } else if (location.pathname.includes('analytics')) {
      setAdminTab('overview');
    }
  }, [location.pathname]);

  useEffect(() => {
    getPaymentRequests();
  }, [adminTab]);

  // Format currency
  const formatVND = (num) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(num);
  };

  // --- OVERVIEW DATA COMPUTATIONS ---
  const activeCount = users.filter(u => u.status === 'Active').length;
  const avgProgressPercent = users.length ? Math.round(users.reduce((acc, u) => acc + (u.learningProgress || 0), 0) / users.length) : 0;
  const totalXP = users.reduce((acc, u) => acc + (u.xp || 0), 0);
  const aiQueriesCount = Math.floor(totalXP / 15);

  const metrics = [
    { name: 'Tổng người dùng', value: users.length, change: `${activeCount} thành viên hoạt động`, icon: Users, color: 'text-blue-500 bg-blue-500/10 dark:text-blue-400 dark:bg-blue-500/10' },
    { name: 'Học viên active', value: activeCount, change: '100% người dùng thực tế', icon: Clock, color: 'text-purple-500 bg-purple-500/10 dark:text-purple-400 dark:bg-purple-500/10' },
    { name: 'Hoàn thành Quiz', value: `${avgProgressPercent}%`, change: 'Tiến độ trung bình học tập', icon: Percent, color: 'text-emerald-500 bg-emerald-500/10 dark:text-emerald-400 dark:bg-emerald-500/10' },
    { name: 'Lượt hỏi AI Mentor', value: aiQueriesCount.toLocaleString(), change: 'Tính toán dựa trên XP tích lũy', icon: MessageSquare, color: 'text-amber-500 bg-amber-500/10 dark:text-amber-400 dark:bg-amber-500/10' }
  ];

  // User Traffic data
  const getTrafficData = () => {
    const data = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = `T${targetDate.getMonth() + 1}`;
      const year = targetDate.getFullYear();
      
      const signups = users.filter(u => {
        if (!u.createdAt) return false;
        const date = new Date(u.createdAt);
        return date.getMonth() === targetDate.getMonth() && date.getFullYear() === year;
      }).length;
      
      const active = users.filter(u => {
        if (!u.createdAt) return false;
        const date = new Date(u.createdAt);
        return date <= new Date(year, targetDate.getMonth() + 1, 0) && u.status === 'Active';
      }).length;
      
      data.push({
        name: monthLabel,
        'Đăng ký mới': signups,
        'Hoạt động': active
      });
    }
    return data;
  };
  const trafficData = getTrafficData();

  // Funnel onboarding conversion
  const total = users.length || 1;
  const kycCount = users.filter(u => u.status === 'Active' || u.status === 'Blocked').length;
  const riskCount = users.filter(u => u.riskProfile !== null).length;
  const learnCount = users.filter(u => (u.learningProgress || 0) > 0).length;
  const premCount = users.filter(u => u.subscription && u.subscription !== 'Free').length;

  const funnelData = [
    { stage: '1. Đăng ký tài khoản', 'Tỷ lệ %': 100 },
    { stage: '2. Hoàn thành KYC', 'Tỷ lệ %': Math.round((kycCount / total) * 100) },
    { stage: '3. Khảo sát rủi ro', 'Tỷ lệ %': Math.round((riskCount / total) * 100) },
    { stage: '4. Đã bắt đầu học', 'Tỷ lệ %': Math.round((learnCount / total) * 100) },
    { stage: '5. Nâng cấp Gói VIP', 'Tỷ lệ %': Math.round((premCount / total) * 100) }
  ];

  // Financial Personality
  const getPersonalityDistribution = () => {
    const cons = users.filter(u => u.riskProfile === 'Conservative').length;
    const bal = users.filter(u => u.riskProfile === 'Balanced').length;
    const agg = users.filter(u => u.riskProfile === 'Aggressive').length;
    const none = users.filter(u => !u.riskProfile).length;

    const consPct = Math.round((cons / total) * 100) || 0;
    const balPct = Math.round((bal / total) * 100) || 0;
    const aggPct = Math.round((agg / total) * 100) || 0;
    const nonePct = 100 - consPct - balPct - aggPct;

    return [
      { name: `Tăng trưởng (${aggPct}%)`, value: aggPct || 1 },
      { name: `Cân bằng (${balPct}%)`, value: balPct || 1 },
      { name: `An toàn (${consPct}%)`, value: consPct || 1 },
      { name: `Chưa khảo sát (${nonePct}%)`, value: nonePct || 1 }
    ];
  };
  const personalityDistribution = getPersonalityDistribution();
  const COLORS = ['#7C3AED', '#2563EB', '#06B6D4', '#F43F5E'];

  const blockchainInterest = [
    { topic: 'Bảo mật ví điện tử', views: 450 },
    { topic: 'Phòng ngừa scams', views: 380 },
    { topic: 'Cơ bản Blockchain', views: 240 },
    { topic: 'Giả lập đào block', views: 180 }
  ];

  const failedQuizzes = [
    { category: 'Bẫy bảo mật private key', rate: 42, count: '124 lượt', level: 'Cao' },
    { category: 'Cơ chế đào block PoW', rate: 35, count: '94 lượt', level: 'Trung bình' },
    { category: 'Nguyên lý bảo mật ví nóng', rate: 22, count: '54 lượt', level: 'Thấp' }
  ];

  // User Management Handlers
  const handleSaveUserEdit = async () => {
    if (!editingUser) return;
    const success = await updateUserDetails(editingUser.id, {
      name: editName.trim(),
      subscription: editSub,
      riskProfile: editRisk === 'None' ? null : editRisk
    });
    if (success) {
      alert("Đã cập nhật thông tin học viên thành công!");
      setEditingUser(null);
    }
  };

  const handleToggleBlock = async (id, currentStatus) => {
    const actionWord = currentStatus === 'Blocked' ? 'mở khóa' : 'khóa';
    if (window.confirm(`Bạn có chắc chắn muốn ${actionWord} tài khoản này không?`)) {
      await blockUser(id);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("CẢNH BÁO: Bạn có chắc chắn muốn xóa học viên này vĩnh viễn không? Thao tác này không thể hoàn tác!")) {
      await deleteUser(id);
    }
  };

  const handleApproveKYC = async (id, isApproved) => {
    const actionWord = isApproved ? 'duyệt' : 'từ chối';
    if (window.confirm(`Bạn có chắc muốn ${actionWord} hồ sơ KYC của học viên này không?`)) {
      await approveKYC(id, isApproved);
    }
  };

  // Payment Handlers
  const handleApprovePayment = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn duyệt yêu cầu thanh toán nâng cấp này không?")) {
      const success = await approvePaymentRequest(id);
      if (success) {
        alert("Đã duyệt nâng cấp gói thành công!");
      }
    }
  };

  const handleRejectPayment = async (id) => {
    const reason = window.prompt("Nhập lý do từ chối yêu cầu nâng cấp này:");
    if (reason === null) return;
    const success = await rejectPaymentRequest(id, reason.trim());
    if (success) {
      alert("Đã từ chối yêu cầu nâng cấp!");
    }
  };

  const handleReportAction = async (report) => {
    if (report.action === 'Ban User') {
      if (window.confirm(`Bạn có chắc muốn KHÓA tài khoản của ${report.user} không?`)) {
        await blockUser(report.userId);
        setReports(prev => prev.filter(r => r.id !== report.id));
        alert(`Đã khóa tài khoản của ${report.user} và gỡ báo cáo.`);
      }
    } else {
      setReports(prev => prev.filter(r => r.id !== report.id));
      alert(`Đã duyệt báo cáo vi phạm.`);
    }
  };

  // Filtered Users List
  const filteredUsers = users.filter(u => {
    if (userSearch) {
      const query = userSearch.toLowerCase();
      const nameMatch = u.name?.toLowerCase().includes(query);
      const emailMatch = u.email?.toLowerCase().includes(query);
      if (!nameMatch && !emailMatch) return false;
    }
    if (filterUserSub !== 'all' && u.subscription !== filterUserSub) return false;
    if (filterUserStatus !== 'all' && u.status !== filterUserStatus) return false;
    if (filterUserRisk !== 'all') {
      if (filterUserRisk === 'none') {
        if (u.riskProfile !== null && u.riskProfile !== undefined && u.riskProfile !== 'None') return false;
      } else if (u.riskProfile !== filterUserRisk) {
        return false;
      }
    }
    return true;
  });

  // --- FINANCE DATA COMPUTATIONS ---
  const approvedRequests = paymentRequests.filter(r => r.status === 'Approved');
  const pendingRequests = paymentRequests.filter(r => r.status === 'Pending');
  
  // Total Revenue
  const totalRevenue = approvedRequests.reduce((sum, r) => sum + r.amount, 0);

  // Monthly Revenue (Current Month)
  const currentMonthNum = new Date().getMonth() + 1;
  const currentYearNum = new Date().getFullYear();
  const currentMonthApproved = approvedRequests.filter(r => {
    const d = new Date(r.resolvedAt || r.createdAt);
    return d.getMonth() + 1 === currentMonthNum && d.getFullYear() === currentYearNum;
  });
  const monthlyRevenue = currentMonthApproved.reduce((sum, r) => sum + r.amount, 0);

  // Paid users count
  const paidUsersCount = users.filter(u => u.subscription && u.subscription !== 'Free').length;

  // Conversion rate (VIP package)
  const conversionRate = Math.round((paidUsersCount / (users.length || 1)) * 100);

  // Recharts: Monthly Revenue Bar chart generator
  const getMonthlyRevenueData = () => {
    const data = [];
    const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    const currentYear = new Date().getFullYear();
    
    for (let m = 0; m < 12; m++) {
      const monthApproved = approvedRequests.filter(r => {
        const d = new Date(r.resolvedAt || r.createdAt);
        return d.getMonth() === m && d.getFullYear() === currentYear;
      });
      const rev = monthApproved.reduce((sum, r) => sum + r.amount, 0);
      data.push({
        name: months[m],
        'Doanh thu': rev
      });
    }
    return data;
  };
  const monthlyRevenueData = getMonthlyRevenueData();

  // Filtering Payment Requests for log list
  const filteredTransactions = paymentRequests.filter(r => {
    // 1. Status Filter
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;

    const d = new Date(r.resolvedAt || r.createdAt);
    const yearStr = d.getFullYear().toString();
    const monthStr = (d.getMonth() + 1).toString();

    // 2. Day Filter
    if (filterDay) {
      const dateStr = d.toISOString().split('T')[0];
      if (dateStr !== filterDay) return false;
    }

    // 3. Month Filter
    if (filterMonth !== 'all' && monthStr !== filterMonth) return false;

    // 4. Year Filter
    if (filterYear !== 'all' && yearStr !== filterYear) return false;

    return true;
  });

  // Export CSV
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      alert("Không có giao dịch nào phù hợp với bộ lọc hiện tại để xuất file!");
      return;
    }
    setExporting(true);
    setTimeout(() => {
      // Create CSV structure
      let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // UTF-8 BOM
      csvContent += "Mã Giao Dịch,Học Viên,Email,Số Tiền,Gói Nâng Cấp,Trạng Thái,Mã Banking,Ngày Duyệt/Tạo\n";
      
      filteredTransactions.forEach(r => {
        const dateStr = new Date(r.resolvedAt || r.createdAt).toLocaleString('vi-VN');
        const row = `"${r.id}","${r.userName}","${r.userEmail}","${r.amount}","${r.targetTier}","${r.status}","${r.paymentCode}","${dateStr}"`;
        csvContent += row + "\n";
      });
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `SAVE+_Bao_cao_tai_chinh_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setExporting(false);
    }, 800);
  };

  const financeMetrics = [
    { name: 'Tổng doanh thu (Approved)', value: formatVND(totalRevenue), description: 'Tất cả các giao dịch đã duyệt thành công', icon: CreditCard, color: 'text-emerald-500 bg-emerald-500/10 dark:text-emerald-400 dark:bg-emerald-500/10' },
    { name: 'Doanh thu tháng này', value: formatVND(monthlyRevenue), description: `Tổng thu tháng ${currentMonthNum}/${currentYearNum}`, icon: TrendingUp, color: 'text-blue-500 bg-blue-500/10 dark:text-blue-400 dark:bg-blue-500/10' },
    { name: 'Người dùng trả phí', value: `${paidUsersCount} học viên`, description: `Đã nâng cấp lên gói Premium/Mentor+`, icon: Award, color: 'text-purple-500 bg-purple-500/10 dark:text-purple-400 dark:bg-purple-500/10' },
    { name: 'Tỷ lệ chuyển đổi VIP', value: `${conversionRate}%`, description: 'Tỷ lệ thành viên trả phí / Tổng số học viên', icon: Percent, color: 'text-amber-500 bg-amber-500/10 dark:text-amber-400 dark:bg-amber-500/10' }
  ];

  return (
    <div className="space-y-6 fade-in text-slate-800 dark:text-white font-sans pb-10">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-200 dark:border-white/10 pb-5">
        <div>
          <h1 className="text-xl font-extrabold flex items-center space-x-2">
            <Shield size={24} className="text-purple-500 dark:text-purple-400" />
            <span>Master Admin Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Giám sát hoạt động học tập của học viên, phân tích tỷ lệ chuyển đổi và quản lý doanh thu tài chính tích hợp.</p>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => {
              setAdminTab('overview');
              setTimeout(() => {
                const el = document.getElementById('reported-box');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="py-2 px-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-350 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <MessageSquare size={14} />
            <span>Xem báo cáo vi phạm ({reports.length})</span>
          </button>
        </div>
      </div>

      {/* Tabs Menu Navigation */}
      <div className="flex border-b border-slate-200 dark:border-white/10">
        <button
          onClick={() => setAdminTab('overview')}
          className={`px-4 py-2 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
            adminTab === 'overview'
              ? 'border-brand-teal text-brand-teal dark:text-brand-teallight'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          Tổng Quan Học Tập
        </button>
        <button
          onClick={() => setAdminTab('users')}
          className={`px-4 py-2 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
            adminTab === 'users'
              ? 'border-brand-teal text-brand-teal dark:text-brand-teallight'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          Quản Lý Thành Viên
        </button>
        <button
          onClick={() => setAdminTab('finance')}
          className={`px-4 py-2 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
            adminTab === 'finance'
              ? 'border-brand-teal text-brand-teal dark:text-brand-teallight'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          Quản Lý Tài Chính & Doanh Thu
        </button>
      </div>

      {/* CONDITIONAL TAB CONTENT RENDERING */}
      {adminTab === 'overview' ? (
        <div className="space-y-6 animate-fadeIn">
          
          {/* KPI grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((m, idx) => {
              const Icon = m.icon;
              return (
                <div key={idx} className="glass-panel p-4 rounded-2xl flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${m.color}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 font-semibold">{m.name}</span>
                    <span className="block text-xl font-bold mt-0.5">{m.value}</span>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-1">{m.change}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Traffic chart */}
            <div className="glass-panel p-5 rounded-2xl">
              <h3 className="text-sm font-bold mb-4 flex items-center space-x-2">
                <TrendingUp size={16} className="text-blue-500" />
                <span>Lưu Lượng Hoạt Động & Đăng Ký Mới</span>
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trafficData}>
                    <defs>
                      <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                    <XAxis dataKey="name" stroke={darkMode ? "#94a3b8" : "#64748b"} fontSize={10} />
                    <YAxis stroke={darkMode ? "#94a3b8" : "#64748b"} fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#ffffff', borderColor: darkMode ? '#1e293b' : '#e2e8f0', borderRadius: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Area type="monotone" dataKey="Hoạt động" stroke="#2563EB" fillOpacity={1} fill="url(#colorActive)" strokeWidth={2} />
                    <Area type="monotone" dataKey="Đăng ký mới" stroke="#0EA5E9" fillOpacity={1} fill="url(#colorNew)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Funnel conversion chart */}
            <div className="glass-panel p-5 rounded-2xl">
              <h3 className="text-sm font-bold mb-4 flex items-center space-x-2">
                <Target size={16} className="text-emerald-500" />
                <span>Phễu Đăng Ký & Chuyển Đổi (Onboarding Funnel)</span>
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                    <XAxis type="number" stroke={darkMode ? "#94a3b8" : "#64748b"} fontSize={10} domain={[0, 100]} unit="%" />
                    <YAxis dataKey="stage" type="category" stroke={darkMode ? "#94a3b8" : "#64748b"} fontSize={10} width={130} />
                    <Tooltip contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#ffffff', borderColor: darkMode ? '#1e293b' : '#e2e8f0', borderRadius: '12px' }} />
                    <Bar dataKey="Tỷ lệ %" fill="#0EA5E9" radius={[0, 4, 4, 0]}>
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 4 ? '#7C3AED' : '#0EA5E9'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Bottom Grid: Personality, Blockchain Interests, Failed Quizzes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Personality pie chart */}
            <div className="glass-panel p-5 rounded-2xl lg:col-span-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold mb-4 flex items-center space-x-2">
                  <Layers size={16} className="text-purple-500" />
                  <span>Khẩu Vị Rủi Ro Học Viên</span>
                </h3>
                <div className="h-52 flex items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={personalityDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {personalityDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#ffffff', borderColor: darkMode ? '#1e293b' : '#e2e8f0', borderRadius: '12px', fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text inside Donut */}
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Đã Khảo Sát</span>
                    <span className="text-base font-extrabold text-brand-teal dark:text-brand-teallight">
                      {Math.round(((users.filter(u => u.riskProfile).length) / total) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 mt-4">
                {personalityDistribution.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                      <span className="text-slate-500 dark:text-slate-400 font-medium">{item.name.split(' ')[0]}</span>
                    </div>
                    <span className="font-mono font-bold">{item.name.match(/\(([^)]+)\)/)?.[1] || '0%'}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Blockchain interest and failed quizzes details */}
            <div className="glass-panel p-5 rounded-2xl lg:col-span-2 space-y-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 mb-3 flex items-center space-x-2">
                  <Cpu size={16} className="text-teal-500" />
                  <span>Chủ Đề Blockchain & Bảo Mật Được Quan Tâm Nhất</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 font-bold">
                        <th className="py-2 pb-1">Chủ đề học tập</th>
                        <th className="py-2 pb-1 text-right">Lượt tra cứu / Tương tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {blockchainInterest.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-100/10 dark:hover:bg-white/2 transition-colors">
                          <td className="py-2.5 font-semibold text-slate-700 dark:text-slate-200">{item.topic}</td>
                          <td className="py-2.5 text-right font-mono font-bold text-brand-teal dark:text-brand-teallight">{item.views} lượt</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-white/5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-3 flex items-center space-x-2">
                  <AlertTriangle size={16} />
                  <span>Các Bài Quiz Có Tỷ Lệ Trả Lời Sai Cao Nhất</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 font-bold">
                        <th className="py-2 pb-1">Nội dung Quiz</th>
                        <th className="py-2 pb-1 text-center">Tỷ lệ sai</th>
                        <th className="py-2 pb-1 text-center">Số lượt làm</th>
                        <th className="py-2 pb-1 text-right">Mức độ cảnh báo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {failedQuizzes.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-100/10 dark:hover:bg-white/2 transition-colors">
                          <td className="py-2.5 font-semibold text-slate-700 dark:text-slate-200">{item.category}</td>
                          <td className="py-2.5 text-center font-mono font-bold text-red-500">{item.rate}%</td>
                          <td className="py-2.5 text-center text-slate-400">{item.count}</td>
                          <td className="py-2.5 text-right">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.level === 'Cao' ? 'bg-red-500/10 text-red-500' : item.level === 'Trung bình' ? 'bg-amber-500/10 text-amber-600' : 'bg-blue-500/10 text-brand-teal'}`}>
                              {item.level}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>

          {/* Reported Content Box */}
          <div id="reported-box" className="glass-panel p-5 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-500 mb-4 flex items-center space-x-2">
              <AlertOctagon size={16} />
              <span>Bài đăng vi phạm cộng đồng được báo cáo ({reports.length})</span>
            </h3>
            {reports.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-xs italic">Không có bài viết vi phạm nào đang chờ xử lý.</div>
            ) : (
              <div className="space-y-3">
                {reports.map((post) => (
                  <div key={post.id} className="flex justify-between items-center p-3.5 bg-slate-100/50 dark:bg-slate-900/40 rounded-xl border border-slate-200/50 dark:border-white/5">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white">{post.user}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{post.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{post.issue}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleReportAction(post)}
                        className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        {post.action}
                      </button>
                      <button 
                        onClick={() => {
                          setReports(prev => prev.filter(r => r.id !== post.id));
                          alert("Đã bỏ qua báo cáo này.");
                        }}
                        className="px-3 py-1.5 bg-slate-250 dark:bg-slate-800 hover:bg-slate-350 dark:hover:bg-slate-750 text-slate-650 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Bỏ qua
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      ) : adminTab === 'users' ? (
        <div className="space-y-6 animate-fadeIn">
          {/* USER MANAGEMENT TAB CONTENT */}
          
          {/* Editing form panel if editingUser is not null */}
          {editingUser && (
            <div className="glass-panel p-5 rounded-2xl border border-brand-teal/20 bg-slate-50/60 dark:bg-slate-900/60 relative animate-fadeIn">
              <h3 className="text-sm font-bold mb-4 flex items-center space-x-2 text-brand-teal">
                <Settings size={16} />
                <span>Chỉnh sửa thông tin học viên: {editingUser.name}</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Họ và Tên</label>
                  <input 
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-1.5 px-3 text-xs focus:outline-none focus:border-brand-teal text-slate-850 dark:text-white"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Gói Hội Viên</label>
                  <select 
                    value={editSub}
                    onChange={(e) => setEditSub(e.target.value)}
                    className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl py-1.5 px-3 text-xs focus:outline-none focus:border-brand-teal text-slate-850 dark:text-white"
                  >
                    <option value="Free">Free</option>
                    <option value="Pro">Pro</option>
                    <option value="Premium">Premium</option>
                    <option value="Mentor+">Mentor+</option>
                  </select>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Khẩu vị rủi ro</label>
                  <select 
                    value={editRisk || 'None'}
                    onChange={(e) => setEditRisk(e.target.value)}
                    className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl py-1.5 px-3 text-xs focus:outline-none focus:border-brand-teal text-slate-850 dark:text-white"
                  >
                    <option value="None">Chưa khảo sát (None)</option>
                    <option value="Conservative">An toàn (Conservative)</option>
                    <option value="Balanced">Cân bằng (Balanced)</option>
                    <option value="Aggressive">Tăng trưởng (Aggressive)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 mt-4">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-3.5 py-1.5 bg-slate-200 dark:bg-slate-850 hover:bg-slate-300 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleSaveUserEdit}
                  className="px-3.5 py-1.5 bg-brand-teal hover:bg-brand-teal/90 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          )}

          {/* Search & Filters */}
          <div className="bg-slate-100/50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <Filter size={14} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase">Bộ lọc quản lý học viên</span>
              </div>
              <button
                onClick={() => {
                  setUserSearch('');
                  setFilterUserSub('all');
                  setFilterUserStatus('all');
                  setFilterUserRisk('all');
                }}
                className="text-[11px] text-brand-teal hover:underline cursor-pointer font-bold"
              >
                Xóa bộ lọc
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
              {/* Search text */}
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Tìm kiếm</label>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Tên hoặc email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:border-brand-teal text-slate-850 dark:text-white"
                  />
                  <Search className="absolute left-2.5 top-2.5 text-slate-400" size={12} />
                </div>
              </div>

              {/* Filter Sub */}
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Gói thành viên</label>
                <select 
                  value={filterUserSub}
                  onChange={(e) => setFilterUserSub(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-1.5 px-3 text-xs focus:outline-none text-slate-800 dark:text-white"
                >
                  <option value="all">Tất cả gói</option>
                  <option value="Free">Gói Học Viên (Free)</option>
                  <option value="Pro">Gói Chuyên Nghiệp (Pro)</option>
                  <option value="Premium">Gói Cao Cấp (Premium)</option>
                  <option value="Mentor+">Gói Mentor+</option>
                </select>
              </div>

              {/* Filter Status */}
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Trạng thái</label>
                <select 
                  value={filterUserStatus}
                  onChange={(e) => setFilterUserStatus(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-1.5 px-3 text-xs focus:outline-none text-slate-800 dark:text-white"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="Active">Hoạt động (Active)</option>
                  <option value="Blocked">Bị khóa (Blocked)</option>
                  <option value="Pending KYC">Chờ duyệt KYC</option>
                  <option value="Rejected KYC">Từ chối KYC</option>
                </select>
              </div>

              {/* Filter Risk */}
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Khẩu vị rủi ro</label>
                <select 
                  value={filterUserRisk}
                  onChange={(e) => setFilterUserRisk(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-1.5 px-3 text-xs focus:outline-none text-slate-800 dark:text-white"
                >
                  <option value="all">Tất cả khẩu vị</option>
                  <option value="none">Chưa khảo sát (None)</option>
                  <option value="Conservative">An toàn (Conservative)</option>
                  <option value="Balanced">Cân bằng (Balanced)</option>
                  <option value="Aggressive">Tăng trưởng (Aggressive)</option>
                </select>
              </div>
            </div>
          </div>

          {/* User management list table */}
          <div className="glass-panel border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-250 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-900/30">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Danh sách học viên ({filteredUsers.length})</h4>
            </div>
            <div className="overflow-x-auto">
              {filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs italic">
                  Không tìm thấy thành viên nào khớp với bộ lọc hiện tại.
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/50 dark:bg-slate-900/30 text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                      <th className="p-3">Học viên</th>
                      <th className="p-3">Khẩu vị rủi ro</th>
                      <th className="p-3">Gói hội viên</th>
                      <th className="p-3">Tiến độ học tập</th>
                      <th className="p-3">Trạng thái</th>
                      <th className="p-3 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30">
                    {filteredUsers.map((u) => {
                      const subBadgeColor = 
                        u.subscription === 'Mentor+' 
                          ? 'bg-amber-550/15 text-amber-500 border border-amber-500/30 streak-active'
                          : u.subscription === 'Premium'
                            ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                            : u.subscription === 'Pro'
                              ? 'bg-blue-500/15 text-blue-650 dark:text-blue-450 border border-blue-500/20'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500';

                      const riskColor = 
                        u.riskProfile === 'Aggressive' 
                          ? 'text-red-500 bg-red-500/10'
                          : u.riskProfile === 'Balanced'
                            ? 'text-blue-500 bg-blue-500/10'
                            : u.riskProfile === 'Conservative'
                              ? 'text-emerald-500 bg-emerald-500/10'
                              : 'text-slate-400 bg-slate-100/50 dark:bg-slate-800/50';

                      const statusColor = 
                        u.status === 'Active' 
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' 
                          : u.status === 'Blocked' 
                            ? 'bg-red-500/15 text-red-600 dark:text-red-400'
                            : u.status === 'Pending KYC'
                              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                              : 'bg-slate-500/15 text-slate-500';

                      return (
                        <tr key={u.id} className="hover:bg-slate-100/30 dark:hover:bg-slate-900/10 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-9 h-9 rounded-full bg-brand-teal/10 text-brand-teal dark:text-brand-teallight flex items-center justify-center font-bold text-sm uppercase">
                                {u.name?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <span className="block font-bold text-slate-900 dark:text-slate-200">{u.name}</span>
                                <span className="block text-[10px] text-slate-400 font-mono">ID: {u.id} | {u.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${riskColor}`}>
                              {u.riskProfile === 'Aggressive' ? 'Tăng trưởng (Aggressive)' :
                               u.riskProfile === 'Balanced' ? 'Cân bằng (Balanced)' :
                               u.riskProfile === 'Conservative' ? 'An toàn (Conservative)' :
                               'Chưa khảo sát'}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${subBadgeColor}`}>
                              {u.subscription}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="w-28">
                              <div className="flex justify-between items-center text-[9px] text-slate-400 mb-0.5">
                                <span className="font-semibold">{u.learningProgress || 0}% hoàn thành</span>
                              </div>
                              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                                <div className="bg-brand-teal h-full rounded-full transition-all duration-500" style={{ width: `${u.learningProgress || 0}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusColor}`}>
                              {u.status === 'Active' ? 'Hoạt động' : 
                               u.status === 'Blocked' ? 'Bị khóa' :
                               u.status === 'Pending KYC' ? 'Chờ duyệt KYC' :
                               u.status === 'Rejected KYC' ? 'CCCD bị từ chối' : u.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex justify-end gap-1.5 flex-wrap items-center">
                              {/* Edit details */}
                              <button
                                onClick={() => {
                                  setEditingUser(u);
                                  setEditName(u.name || '');
                                  setEditSub(u.subscription || 'Free');
                                  setEditRisk(u.riskProfile || 'None');
                                  // Scroll edit form into view
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="px-2 py-1 bg-brand-teal/10 hover:bg-brand-teal hover:text-white text-brand-teal rounded text-[10px] font-bold transition-all cursor-pointer flex items-center space-x-1"
                                title="Chỉnh sửa thông tin nhanh"
                              >
                                <span>Sửa</span>
                              </button>

                              {/* Toggle block status */}
                              <button
                                onClick={() => handleToggleBlock(u.id, u.status)}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                                  u.status === 'Blocked' 
                                    ? 'bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white' 
                                    : 'bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white'
                                }`}
                              >
                                {u.status === 'Blocked' ? 'Mở khóa' : 'Khóa'}
                              </button>

                              {/* Delete account */}
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded text-[10px] font-bold transition-all cursor-pointer"
                                title="Xóa tài khoản vĩnh viễn"
                              >
                                Xóa
                              </button>

                              {/* KYC Quick verification */}
                              {u.status === 'Pending KYC' && (
                                <div className="flex gap-1 border-l border-slate-200 dark:border-slate-800 pl-1.5 ml-0.5">
                                  <button
                                    onClick={() => handleApproveKYC(u.id, true)}
                                    className="px-1.5 py-1 bg-emerald-500 text-white hover:bg-emerald-600 rounded text-[9px] font-bold transition-all cursor-pointer"
                                    title="Chấp nhận hồ sơ KYC"
                                  >
                                    Duyệt KYC
                                  </button>
                                  <button
                                    onClick={() => handleApproveKYC(u.id, false)}
                                    className="px-1.5 py-1 bg-rose-500 text-white hover:bg-rose-600 rounded text-[9px] font-bold transition-all cursor-pointer"
                                    title="Từ chối hồ sơ KYC"
                                  >
                                    Từ chối
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Finance KPIs */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {financeMetrics.map((m, idx) => {
              const Icon = m.icon;
              return (
                <div key={idx} className="glass-panel p-4 rounded-2xl flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${m.color}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 font-semibold">{m.name}</span>
                    <span className="block text-lg font-extrabold mt-0.5">{m.value}</span>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-1">{m.description}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Revenue Monthly Chart */}
          <div className="glass-panel p-5 rounded-2xl">
            <h3 className="text-sm font-bold mb-4 flex items-center space-x-2">
              <BarChart3 size={16} className="text-brand-teal" />
              <span>Biểu Đồ Cột Doanh Thu Theo Tháng Năm {currentYearNum}</span>
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                  <XAxis dataKey="name" stroke={darkMode ? "#94a3b8" : "#64748b"} fontSize={10} />
                  <YAxis stroke={darkMode ? "#94a3b8" : "#64748b"} fontSize={10} tickFormatter={(val) => `${val/1000000}M`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#ffffff', borderColor: darkMode ? '#1e293b' : '#e2e8f0', borderRadius: '12px' }} 
                    formatter={(value) => [formatVND(value), 'Doanh thu']}
                  />
                  <Bar dataKey="Doanh thu" fill="#2563EB" radius={[4, 4, 0, 0]}>
                    {monthlyRevenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === `T${currentMonthNum}` ? '#0ea5e9' : '#2563EB'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Filters Control Center */}
          <div className="bg-slate-100/50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <Filter size={14} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase">Bộ lọc giao dịch & Báo cáo</span>
              </div>
              <button
                onClick={() => {
                  setFilterDay('');
                  setFilterMonth('all');
                  setFilterYear('all');
                  setFilterStatus('all');
                }}
                className="text-[11px] text-brand-teal hover:underline cursor-pointer font-bold"
              >
                Xóa bộ lọc
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
              {/* Filter Status */}
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Trạng thái</label>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-1.5 px-3 text-xs focus:outline-none"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="Approved">Thành công (Approved)</option>
                  <option value="Pending">Đang chờ (Pending)</option>
                  <option value="Rejected">Đã từ chối (Rejected)</option>
                </select>
              </div>

              {/* Filter Day */}
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Lọc theo Ngày</label>
                <input 
                  type="date"
                  value={filterDay}
                  onChange={(e) => setFilterDay(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-1.5 px-3 text-xs focus:outline-none"
                />
              </div>

              {/* Filter Month */}
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Lọc theo Tháng</label>
                <select 
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-1.5 px-3 text-xs focus:outline-none"
                >
                  <option value="all">Tất cả tháng</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m.toString()}>Tháng {m}</option>
                  ))}
                </select>
              </div>

              {/* Filter Year */}
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Lọc theo Năm</label>
                <select 
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-1.5 px-3 text-xs focus:outline-none"
                >
                  <option value="all">Tất cả năm</option>
                  <option value="2025">Năm 2025</option>
                  <option value="2026">Năm 2026</option>
                </select>
              </div>

              {/* Export Button */}
              <div className="flex items-end">
                <button
                  onClick={handleExportCSV}
                  disabled={exporting}
                  className="w-full py-1.5 bg-brand-teal hover:bg-brand-teal/90 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Download size={14} className={exporting ? "animate-bounce" : ""} />
                  <span>{exporting ? "Đang xuất..." : "Xuất Báo Cáo CSV"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Transactions list table */}
          <div className="glass-panel border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-250 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-900/30 flex justify-between items-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Danh sách lịch sử giao dịch ({filteredTransactions.length})</h4>
            </div>
            <div className="overflow-x-auto">
              {filteredTransactions.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs italic">
                  Không tìm thấy giao dịch nào khớp với bộ lọc hiện tại.
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/50 dark:bg-slate-900/30 text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                      <th className="p-3">Mã GD</th>
                      <th className="p-3">Học viên</th>
                      <th className="p-3">Số tiền</th>
                      <th className="p-3">Gói nâng cấp</th>
                      <th className="p-3">Mã Banking</th>
                      <th className="p-3">Ngày duyệt/tạo</th>
                      <th className="p-3">Trạng thái</th>
                      <th className="p-3 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30">
                    {filteredTransactions.map((r) => {
                      const statusColor = 
                        r.status === 'Approved' 
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' 
                          : r.status === 'Rejected' 
                            ? 'bg-red-500/15 text-red-600 dark:text-red-400' 
                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400';
                      return (
                        <tr key={r.id} className="hover:bg-slate-100/30 dark:hover:bg-slate-900/10 transition-colors">
                          <td className="p-3 font-mono font-bold text-slate-400">#{r.id}</td>
                          <td className="p-3">
                            <div>
                              <span className="block font-bold text-slate-900 dark:text-slate-200">{r.userName}</span>
                              <span className="block text-[10px] text-slate-400">{r.userEmail}</span>
                            </div>
                          </td>
                          <td className="p-3 font-semibold font-mono">{formatVND(r.amount)}</td>
                          <td className="p-3 font-semibold">{r.targetTier}</td>
                          <td className="p-3"><span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800/60 rounded font-mono text-[10px]">{r.paymentCode}</span></td>
                          <td className="p-3 text-slate-400 text-[11px]">{new Date(r.resolvedAt || r.createdAt).toLocaleString('vi-VN')}</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusColor}`}>
                              {r.status === 'Approved' ? 'Thành công' : r.status === 'Rejected' ? 'Bị từ chối' : 'Chờ duyệt'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {r.status === 'Pending' ? (
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => handleApprovePayment(r.id)}
                                  className="px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-[10px] font-bold transition-all cursor-pointer shadow-xs"
                                >
                                  Duyệt
                                </button>
                                <button
                                  onClick={() => handleRejectPayment(r.id)}
                                  className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-[10px] font-bold transition-all cursor-pointer shadow-xs"
                                >
                                  Từ chối
                                </button>
                              </div>
                            ) : r.status === 'Rejected' && r.note ? (
                              <span className="text-[10px] text-slate-400 italic block max-w-[150px] truncate ml-auto" title={r.note}>Lý do: {r.note}</span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
