import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowRight, 
  TrendingUp, 
  BookOpen, 
  Compass, 
  Target, 
  MessageSquare, 
  Sun, 
  Moon, 
  Flame, 
  Award, 
  DollarSign, 
  ChevronDown, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  Calculator,
  Percent,
  Calendar,
  Layers,
  Star,
  Quote,
  CheckCircle2,
  X,
  Lock,
  Check
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import confetti from 'canvas-confetti';
import use3DTilt from '../../hooks/use3DTilt';

// Reusable Tilt Card helper component
function TiltCard({ children, className = '', options = {}, onClick, ...props }) {
  const [ref, style] = use3DTilt({ max: 8, scale: 1.01, speed: 400, ...options });
  return (
    <div 
      ref={ref} 
      style={style} 
      className={`${className} cursor-pointer`} 
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

// Reusable CountUp component for statistical visual loading
function CountUp({ end, duration = 1.2, suffix = '' }) {
  const [count, setCount] = useState(0);
  React.useEffect(() => {
    let start = 0;
    const endNum = parseFloat(end);
    if (isNaN(endNum)) {
      setCount(end);
      return;
    }
    const totalFrames = Math.max(10, duration * 60);
    const increment = endNum / totalFrames;
    let currentFrame = 0;
    
    const timer = setInterval(() => {
      currentFrame++;
      start += increment;
      if (currentFrame >= totalFrames) {
        setCount(endNum);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16.7); // ~60fps

    return () => clearInterval(timer);
  }, [end, duration]);

  const decimals = end.toString().includes('.') ? end.toString().split('.')[1].length : 0;
  return <span>{count.toFixed(decimals)}{suffix}</span>;
}


// Onboarding Steps Data
const stepsData = [
  {
    step: "01",
    title: "Khởi Tạo Tài Khoản",
    desc: "Đăng ký nhanh chóng trong 30 giây. Xác định thói quen chi tiêu và lập kế hoạch cá nhân hóa để bắt đầu hành trình.",
    color: "from-brand-teal to-brand-teallight",
    icon: () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  },
  {
    step: "02",
    title: "Hoạch Định Ngân Sách",
    desc: "Thiết lập ngân sách hàng tháng theo các quy tắc 50/30/20 hoặc 6 chiếc hũ để tối ưu hóa chi tiêu thực tế.",
    color: "from-brand-green to-emerald-500",
    icon: () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
  },
  {
    step: "03",
    title: "Đặt Mục Tiêu Tích Lũy",
    desc: "Tạo các quỹ tiết kiệm cho từng mục tiêu cụ thể như mua sắm học tập, du lịch hè hay quỹ khẩn cấp của riêng bạn.",
    color: "from-brand-gold to-orange-500",
    icon: () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
  },
  {
    step: "04",
    title: "Đạt Tự Do Tài Chính",
    desc: "Duy trì kỷ luật tích lũy định kỳ dài hạn, theo dõi biểu đồ tăng trưởng dòng tiền và làm chủ tương lai.",
    color: "from-brand-teal to-brand-green",
    icon: () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
  }
];

// Subscription Plans Data
const plansData = [
  {
    name: "Gói Học Viên (Free)",
    price: "0đ",
    period: "mãi mãi",
    desc: "Dành cho người mới bắt đầu làm quen với kiến thức quản lý tài chính và lập ngân sách cơ bản.",
    features: [
      "Lộ trình quản lý ngân sách cơ bản",
      "Lập tối đa 3 mục tiêu tích lũy cá nhân",
      "Báo cáo phân tích ngân sách hàng tháng cơ bản",
      "Theo dõi lãi kép trực quan",
      "Hỗ trợ qua kênh cộng đồng học tập"
    ],
    cta: "Bắt đầu ngay",
    popular: false,
    color: "slate"
  },
  {
    name: "Gói Chuyên Nghiệp (Pro)",
    price: "99.000đ",
    period: "tháng",
    desc: "Mở khóa toàn diện tính năng lập ngân sách nâng cao, phân tích dòng tiền chuyên sâu định kỳ.",
    features: [
      "Công cụ quản lý dòng tiền nâng cao",
      "Không giới hạn số lượng mục tiêu tích lũy",
      "Xuất báo cáo tài chính định dạng Excel/PDF",
      "Tự động phân loại giao dịch thu chi cá nhân",
      "Tham gia nhóm cộng đồng VIP",
      "Tham gia các thử thách tích lũy nhận quà thật"
    ],
    cta: "Nâng cấp Pro",
    popular: true,
    color: "brand-teal"
  },
  {
    name: "Gói Cao Cấp (Premium)",
    price: "249.000đ",
    period: "tháng",
    desc: "Giải pháp tối ưu cho cá nhân và gia đình muốn hoạch định và tối ưu tài sản dài hạn bài bản.",
    features: [
      "Mọi quyền lợi của gói Pro",
      "Báo cáo phân tích thị trường kinh tế độc quyền mỗi tuần",
      "Đọc tạp chí tài chính và kinh tế vĩ mô chuẩn quốc tế",
      "Công cụ tự động hóa dòng tiền đa kênh",
      "Hỗ trợ tư vấn 1-1 từ chuyên gia tài chính thực tế",
      "Chứng nhận lộ trình hoàn thành kế hoạch tài chính"
    ],
    cta: "Sở hữu ngay",
    popular: false,
    color: "brand-green"
  }
];

const partnerLogos = [
  { name: "Bloomberg Financial", tag: "BLOOMBERG" },
  { name: "CafeF Kinh tế", tag: "CAFEF" },
  { name: "VnExpress Kinh doanh", tag: "VNEXPRESS" },
  { name: "Vietstock Tài chính", tag: "VIETSTOCK" }
];

export default function Landing() {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();
  const { user } = useAuth();

  // Rotating Text loop in Hero
  const [textIndex, setTextIndex] = useState(0);
  const rotatingTexts = useMemo(() => [
    "Quản lý dòng tiền",
    "Tích lũy thông minh",
    "Hoạch định mục tiêu",
    "Tự do tài chính"
  ], []);
  useEffect(() => {
    const timer = setInterval(() => {
      setTextIndex(prev => (prev + 1) % rotatingTexts.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [rotatingTexts]);

  // If user is already logged in, redirect them to home page (which renders Layout & Dashboard)
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };
  // Compound Interest Calculator State
  const [initialCapital, setInitialCapital] = useState(5000000); // 5 million VND default
  const [monthlyContribution, setMonthlyContribution] = useState(1500000); // 1.5 million VND default
  const [interestRate, setInterestRate] = useState(12); // 12% default (typical stock market average long term)
  const [years, setYears] = useState(15); // 15 years default
  // Interactive Sandbox state
  const [sandboxTab, setSandboxTab] = useState('budget'); // 'budget' | 'savings'

  // Budget Sandbox state
  const [budgetIncome, setBudgetIncome] = useState(10000000); // 10M VND default
  const [budgetRule, setBudgetRule] = useState('50/30/20'); // '50/30/20' | '6jars' | 'custom'
  const [customNeedsPct, setCustomNeedsPct] = useState(50);
  const [customWantsPct, setCustomWantsPct] = useState(30);
  const [customSavingsPct, setCustomSavingsPct] = useState(20);

  // Savings Sandbox state
  const [savingsGoal, setSavingsGoal] = useState('laptop'); // 'laptop' | 'emergency' | 'travel'
  const [monthlySavingAmt, setMonthlySavingAmt] = useState(1500000); // 1.5M default
  const [accumulatedAmt, setAccumulatedAmt] = useState(0);
  const [isGoalCompleted, setIsGoalCompleted] = useState(false);

  const goalPresets = {
    laptop: { name: 'Mua Laptop Học Tập', target: 15000000, desc: 'Laptop phục vụ học tập, tra cứu và thiết kế.' },
    emergency: { name: 'Quỹ Dự Phòng Khẩn Cấp', target: 10000000, desc: 'Khoản đệm an toàn đề phòng các trường hợp khẩn cấp trong cuộc sống.' },
    travel: { name: 'Du Lịch Hè Cùng Gia Đình', target: 6000000, desc: 'Chuyến đi nghỉ mát ý nghĩa cùng người thân thương.' }
  };

  const activeGoal = goalPresets[savingsGoal];
  const goalProgress = Math.min(100, (accumulatedAmt / activeGoal.target) * 100);

  // Smooth scroll helper
  const handleScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddSavings = () => {
    if (isGoalCompleted) return;
    
    setAccumulatedAmt(prev => {
      const next = prev + Number(monthlySavingAmt);
      if (next >= activeGoal.target) {
        setIsGoalCompleted(true);
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
        return activeGoal.target;
      }
      return next;
    });
  };

  const handleResetSavings = () => {
    setAccumulatedAmt(0);
    setIsGoalCompleted(false);
  };

  // Calculate compound interest data points for chart
  const calculatorData = useMemo(() => {
    const data = [];
    let totalSavings = initialCapital;
    let totalInvested = initialCapital;
    let r = interestRate / 100 / 12; // monthly rate

    // Push initial state
    data.push({
      year: 'Bắt đầu',
      'Không đầu tư': Math.round(totalSavings),
      'Đầu tư (SAVE+)': Math.round(totalInvested),
    });

    for (let year = 1; year <= years; year++) {
      for (let month = 1; month <= 12; month++) {
        totalSavings += monthlyContribution;
        totalInvested = (totalInvested + monthlyContribution) * (1 + r);
      }
      data.push({
        year: `Năm ${year}`,
        'Không đầu tư': Math.round(totalSavings),
        'Đầu tư (SAVE+)': Math.round(totalInvested),
      });
    }
    return data;
  }, [initialCapital, monthlyContribution, interestRate, years]);

  const finalInvestmentValue = calculatorData[calculatorData.length - 1]['Đầu tư (SAVE+)'];
  const finalSavingsValue = calculatorData[calculatorData.length - 1]['Không đầu tư'];
  const interestEarned = finalInvestmentValue - finalSavingsValue;
  const timesBetter = (finalInvestmentValue / finalSavingsValue).toFixed(1);

  // Format currency helpers
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);
  };

  const formatShortCurrency = (value) => {
    if (value >= 1e9) {
      return (value / 1e9).toFixed(2) + ' tỷ';
    }
    if (value >= 1e6) {
      return (value / 1e6).toFixed(0) + ' triệu';
    }
    return formatCurrency(value);
  };

  const faqData = [
    {
      q: "Tôi là người mới, chưa có kinh nghiệm quản lý chi tiêu thì có sử dụng SAVE+ được không?",
      a: "Hoàn toàn được! SAVE+ được thiết kế thân thiện cho người mới bắt đầu. Chúng tôi cung cấp các lộ trình và quy tắc lập ngân sách trực quan, dễ thực hiện (như 50/30/20, 6 chiếc hũ) giúp bạn từng bước làm quen với thói quen tài chính tích cực."
    },
    {
      q: "Các quy tắc ngân sách như 50/30/20 hay 6 chiếc hũ hoạt động như thế nào trên SAVE+?",
      a: "Khi bạn nhập thu nhập, hệ thống sẽ tự động đề xuất phân bổ dòng tiền vào các hũ (Thiết yếu, Hưởng thụ, Tích lũy) theo tỷ lệ khoa học. Bạn cũng có thể tùy chỉnh tỷ lệ riêng phù hợp với nhu cầu thực tế của mình."
    },
    {
      q: "Lãi kép hoạt động như thế nào trong kế hoạch tích lũy dài hạn?",
      a: "Lãi kép (Compound Interest) là khi tiền tích lũy định kỳ của bạn sinh lãi và phần lãi đó tiếp tục được gộp vào vốn để sinh lời cho kỳ tiếp theo. Tích lũy càng sớm, vòng quay lãi kép càng phát huy sức mạnh vượt trội giúp bạn nhanh chóng đạt mục tiêu tài chính."
    },
    {
      q: "Làm thế nào để nâng cấp tài khoản lên gói Premium và nhận hỗ trợ 1-1?",
      a: "Sau khi đăng ký tài khoản miễn phí, bạn có thể truy cập Hồ sơ cá nhân của mình để nâng cấp lên Premium. Gói Premium sẽ mở khóa thư viện tạp chí tài chính vĩ mô chuyên sâu và quyền lợi kết nối tư vấn 1-1 với chuyên gia tài chính thực tế."
    }
  ];

  return (
    <div className={`min-h-screen bg-white text-slate-800 dark:bg-[#090D16] dark:text-slate-100 transition-colors duration-300 antialiased font-sans`}>
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-brand-teal/5 to-brand-green/5 dark:from-brand-teal/10 dark:to-brand-green/5 pointer-events-none z-0" />
      <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-brand-teal/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-96 h-96 bg-brand-green/8 rounded-full blur-[140px] pointer-events-none" />

      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#090D16]/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/40 px-6 py-4 flex items-center justify-between shadow-sm transition-all duration-300">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-teal to-brand-green flex items-center justify-center text-white font-extrabold text-2xl shadow-md shadow-brand-teal/20">
            S+
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-green">SAVE+</span>
            <span className="block text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-widest">Kiến Thức Là Tài Sản</span>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <a href="#why-invest" onClick={(e) => handleScroll(e, 'why-invest')} className="hover:text-brand-teal transition-colors">Lời mời đầu tư</a>
          <a href="#calculator" onClick={(e) => handleScroll(e, 'calculator')} className="hover:text-brand-teal transition-colors">Tính lãi kép</a>
          <a href="#features" onClick={(e) => handleScroll(e, 'features')} className="hover:text-brand-teal transition-colors">Các chủ đề cốt lõi</a>
          <a href="#faq" onClick={(e) => handleScroll(e, 'faq')} className="hover:text-brand-teal transition-colors">Hỏi đáp</a>
        </div>

        {/* CTA Actions */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-teal dark:hover:text-brand-teallight transition-colors"
          >
            Đăng nhập
          </button>
          
          <button 
            onClick={() => navigate('/register')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-teal to-brand-green text-white text-sm font-bold shadow-lg shadow-brand-teal/20 hover:opacity-90 transition-all cursor-pointer"
          >
            Bắt đầu miễn phí
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 md:pt-24 md:pb-32 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Core pitch */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left fade-in">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-brand-teal/10 dark:bg-brand-teal/25 border border-brand-teal/20 text-brand-teal dark:text-brand-teallight text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={14} className="animate-spin-slow" />
              <span>Nền Tảng Hoạch Định Tài Chính & Lập Ngân Sách Cá Nhân</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Kiến thức là tài sản.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-green transition-all duration-500 inline-block min-w-[280px]">
                {rotatingTexts[textIndex]}
              </span> ngay hôm nay.
            </h1>
            
            <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
              <strong>Dự án SAVE+</strong> là nền tảng số hóa hỗ trợ giáo dục tài chính cá nhân toàn diện, tích hợp cổng tra cứu, phân tích tạp chí tài khóa quốc tế, hoạch định mục tiêu tích lũy thông minh và quản lý ngân sách hiệu quả.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-4 flex-wrap">
              <button 
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-teal to-brand-green text-white font-bold shadow-lg shadow-brand-teal/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer text-sm btn-shine animate-bounce-slow"
              >
                <span>Bắt đầu ngay (Get Started)</span>
                <ArrowRight size={16} />
              </button>
              
              <button 
                onClick={() => {
                  const el = document.getElementById('core-features');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200 text-center transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm text-sm hover:border-brand-teal"
              >
                <BookOpen size={16} className="text-brand-teal" />
                <span>Explore Journals (Khám phá Tạp chí)</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-100 dark:border-slate-800/60 max-w-md mx-auto lg:mx-0">
              <div>
                <span className="block text-2xl md:text-3xl font-extrabold text-brand-teal dark:text-brand-teallight">
                  <CountUp end={100} />%
                </span>
                <span className="text-xs text-slate-400 font-semibold">Miễn phí học tập</span>
              </div>
              <div>
                <span className="block text-2xl md:text-3xl font-extrabold text-brand-teal dark:text-brand-teallight">
                  24/7
                </span>
                <span className="text-xs text-slate-400 font-semibold">Cập nhật tiến độ</span>
              </div>
              <div>
                <span className="block text-2xl md:text-3xl font-extrabold text-brand-teal dark:text-brand-teallight">
                  <CountUp end={5} />+
                </span>
                <span className="text-xs text-slate-400 font-semibold">Quy tắc quản lý</span>
              </div>
            </div>
          </div>

          {/* Right Column: Platform Preview (Glassmorphic Mockup + Interactive SVG) */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Visual background decorations */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-brand-teal/20 via-brand-teallight/10 to-brand-green/20 blur-2xl pointer-events-none animate-pulse duration-5000" />
            
            {/* Interactive SVG Orbit rings */}
            <div className="absolute -top-12 -right-10 w-44 h-44 z-20 pointer-events-none select-none drop-shadow-[0_4px_15px_rgba(13,148,136,0.2)]">
              <svg viewBox="0 0 100 100" className="w-full h-full text-brand-teal/40 dark:text-brand-teallight/35">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="4 8" className="animate-spin-slow" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="12 6" className="animate-spin-counter" />
                <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" className="animate-pulse" />
                <path d="M 50,10 A 40,40 0 0,1 90,50" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>

            {/* Glowing background mesh */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-brand-teal/20 rounded-full blur-xl pointer-events-none animate-pulse" />
            
            {/* Glass dashboard preview card with 3D Tilt */}
            <TiltCard 
              options={{ max: 12, scale: 1.02 }}
              className="w-full max-w-sm glass-panel border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-2xl relative bg-white/90 dark:bg-[#0F172A]/90 animate-glow"
            >
              {/* Mock App Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800/40">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-teal flex items-center justify-center text-white font-bold text-lg">S</div>
                  <span className="font-extrabold text-sm tracking-wide bg-gradient-to-r from-brand-teal to-brand-green bg-clip-text text-transparent">SAVE+ Ngân Sách</span>
                </div>
                <div className="flex items-center space-x-1 bg-amber-500/10 dark:bg-amber-500/5 px-2 py-0.5 rounded text-[10px] text-amber-500 font-bold">
                  <Flame size={12} className="fill-amber-500" />
                  <span>Định kỳ tốt</span>
                </div>
              </div>

              {/* Mock Budget Goal Card */}
              <div className="p-4 bg-gradient-to-tr from-brand-teal to-brand-green rounded-2xl text-white shadow-md mb-6 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 w-24 h-24 bg-white/10 rounded-full blur-lg" />
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-85">Mục tiêu: Mua Laptop Học Tập</span>
                    <span className="block text-2xl font-black tracking-tight mt-1">{formatCurrency(15000000)}</span>
                  </div>
                  <span className="bg-white/20 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">68%</span>
                </div>
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-white rounded-full" style={{ width: '68%' }} />
                </div>
                <div className="flex justify-between items-center mt-2.5 text-[10px] opacity-90">
                  <span>Đã tích lũy: {formatCurrency(10200000)}</span>
                  <span>Còn lại: 4.8M</span>
                </div>
              </div>

              {/* Mini Savings Growth Chart */}
              <div className="mb-4">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tăng trưởng quỹ tích lũy 5 tháng qua</span>
                <div className="h-20 w-full overflow-hidden rounded-xl bg-slate-50/50 dark:bg-slate-900/40 p-2 border border-slate-100 dark:border-slate-800/30">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { name: 'T1', val: 3000000 },
                      { name: 'T2', val: 6000000 },
                      { name: 'T3', val: 8500000 },
                      { name: 'T4', val: 10200000 },
                      { name: 'T5', val: 12000000 }
                    ]}>
                      <defs>
                        <linearGradient id="colorMini" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="val" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorMini)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Cashflow tips floating in preview */}
              <div className="mt-5 p-3 rounded-xl bg-teal-500/5 dark:bg-teal-500/5 border border-teal-500/15 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-teal-600 dark:text-teal-400">
                  <Sparkles size={16} className="text-brand-teal" />
                  <span className="font-semibold">Tích lũy đều đặn giúp đạt mục tiêu nhanh hơn!</span>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>



      {/* How It Works Section */}
      <section className="py-20 bg-slate-50/30 dark:bg-[#070B13]/35 border-t border-slate-100 dark:border-slate-800/40 relative overflow-hidden">
        {/* Background blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-teal/5 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-sm font-bold text-brand-teal dark:text-brand-teallight tracking-widest uppercase">LỘ TRÌNH 4 BƯỚC BẮT ĐẦU</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Hành Trình Làm Chủ Tài Chính Cá Nhân</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Đến với SAVE+, bạn sẽ đi qua một lộ trình được cá nhân hóa cao, kết hợp chặt chẽ giữa Lý thuyết và Thực hành để xây dựng nền tảng vững chắc nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting line on desktop */}
            <div className="hidden lg:block absolute top-[44px] left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-brand-teal/20 via-brand-green/20 to-brand-gold/20 z-0" />

            {stepsData.map((item, index) => {
              return (
                <div 
                  key={index}
                  className="relative bg-white dark:bg-[#0F172A] p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-lg transition-all z-10 hover:-translate-y-1 group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
                      {item.icon()}
                    </div>
                    <span className="text-2xl font-black text-slate-200 dark:text-slate-800/60 tracking-tight">
                      {item.step}
                    </span>
                  </div>
                  
                  <h3 className="text-base font-extrabold text-slate-800 dark:text-white mb-2 group-hover:text-brand-teal transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Features & YouTube User Manual Section */}
      <section id="core-features" className="py-20 bg-white dark:bg-[#090D16] border-t border-slate-100 dark:border-slate-800/40 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Core features details */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-4">
                <span className="text-sm font-bold text-brand-teal dark:text-brand-teallight tracking-widest uppercase text-center lg:text-left block">TÍNH NĂNG CỐT LÕI DỰ ÁN</span>
                <h2 className="text-3xl font-extrabold tracking-tight text-center lg:text-left">Cổng Học Tập & Phân Tích Ấn Phẩm Tài Chính</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed text-center lg:text-left">
                  Để cung cấp đầy đủ công cụ học tập và quản lý thực tiễn cho học viên, dự án SAVE+ phát triển hệ thống quản lý chi tiêu thông minh tích hợp cổng tra cứu, phân tích tạp chí tài chính quốc tế và nội địa chuẩn xác.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Feature 1: Search Journal */}
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-teal/10 dark:bg-brand-teal/20 text-brand-teal flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Search Journal</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal font-medium">
                      Tìm kiếm và tra cứu nhanh hàng ngàn báo cáo kinh tế vĩ mô, tạp chí học thuật tài chính chính thống từ các viện nghiên cứu và ngân hàng đối tác.
                    </p>
                  </div>
                </div>

                {/* Feature 2: Expense Tracking */}
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-green/10 dark:bg-brand-green/20 text-brand-green flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Expense Tracking</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal font-medium">
                      Theo dõi dòng tiền thu chi cá nhân, phân chia nguồn thu nhập tự động để tối ưu hóa ngân sách và giảm thiểu chi tiêu lãng phí.
                    </p>
                  </div>
                </div>

                {/* Feature 3: Goal Dashboard */}
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-gold/10 dark:bg-brand-gold/20 text-brand-gold flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Goal Dashboard</h3>
                    <p className="text-[11px] text-slate-550 dark:text-slate-400 mt-1 leading-normal font-medium">
                      Bảng điều khiển trực quan hiển thị tỷ lệ phần trăm hoàn thành của các mục tiêu tích lũy và đề xuất tối ưu hóa dòng tiền tiết kiệm hàng tháng.
                    </p>
                  </div>
                </div>

                {/* Feature 4: Smart Journal */}
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-teallight/10 dark:bg-brand-teallight/20 text-brand-teallight flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Spending Journal</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal font-medium">
                      Ghi chép và theo dõi thói quen chi tiêu hàng ngày một cách trực quan, giúp định hình phong cách sống tài chính bền vững.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Mockup Dashboard Preview */}
            <div className="lg:col-span-6 relative flex justify-center items-center">
              <div className="w-full max-w-lg p-6 bg-slate-50 dark:bg-[#0F172A]/80 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-4 relative overflow-hidden">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">saveplus.vn/dashboard</span>
                </div>
                
                {/* Simulated Content */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Tổng tài sản tích lũy</span>
                      <span className="text-xl font-black text-brand-teal">45,200,000đ</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">+12.5% tháng này</span>
                  </div>

                  {/* Tiny simulated chart */}
                  <div className="h-32 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-3 flex items-end gap-2.5">
                    <div className="flex-1 bg-brand-teal/20 dark:bg-brand-teal/10 rounded-t-lg h-[20%]" />
                    <div className="flex-1 bg-brand-teal/30 dark:bg-brand-teal/15 rounded-t-lg h-[40%]" />
                    <div className="flex-1 bg-brand-teal/40 dark:bg-brand-teal/20 rounded-t-lg h-[35%]" />
                    <div className="flex-1 bg-brand-teal/60 dark:bg-brand-teal/30 rounded-t-lg h-[65%]" />
                    <div className="flex-1 bg-brand-teal/80 dark:bg-brand-teal/40 rounded-t-lg h-[55%]" />
                    <div className="flex-1 bg-gradient-to-t from-brand-teal to-brand-green rounded-t-lg h-[90%]" />
                  </div>

                  {/* Goal items */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-1.5">
                      <span className="text-[9px] text-slate-400 font-bold block">💻 Quỹ Mua Laptop</span>
                      <div className="flex justify-between text-xs font-black">
                        <span>80%</span>
                        <span className="text-slate-400 font-normal">12M/15M</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-teal rounded-full" style={{ width: '80%' }} />
                      </div>
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-1.5">
                      <span className="text-[9px] text-slate-400 font-bold block">✈️ Quỹ Du Lịch Hè</span>
                      <div className="flex justify-between text-xs font-black">
                        <span>50%</span>
                        <span className="text-slate-400 font-normal">3M/6M</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-green rounded-full" style={{ width: '50%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Sandbox Section (Học thử - Trải nghiệm thật) */}
      <section className="py-16 max-w-7xl mx-auto px-6 relative z-10 border-t border-slate-100 dark:border-slate-800/40">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <span className="text-sm font-bold text-brand-teal dark:text-brand-teallight tracking-widest uppercase">TRỰC QUAN TÍNH NĂNG</span>
          <h2 className="text-3xl font-extrabold tracking-tight">Học Thử - Trải Nghiệm Thật Cùng SAVE+</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Trải nghiệm thử 2 công cụ hoạch định cốt lõi của SAVE+ ngay tại đây để bắt đầu làm quen với thói quen tài chính tích cực!
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center space-x-2 md:space-x-4 mb-8">
          <button 
            onClick={() => setSandboxTab('budget')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              sandboxTab === 'budget' 
                ? 'bg-brand-teal text-white shadow-md shadow-brand-teal/25' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Calculator size={16} />
            <span>Phân Bổ Ngân Sách</span>
          </button>
          <button 
            onClick={() => setSandboxTab('savings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              sandboxTab === 'savings' 
                ? 'bg-brand-teal text-white shadow-md shadow-brand-teal/25' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Target size={16} />
            <span>Mục Tiêu Tích Lũy</span>
          </button>
        </div>

        {/* Sandbox Content Body */}
        <div className="glass-panel border border-slate-250 dark:border-slate-800 bg-white/95 dark:bg-[#0F172A]/90 p-6 md:p-8 rounded-3xl shadow-xl min-h-[400px] flex flex-col justify-between">
          {sandboxTab === 'budget' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between animate-fadeIn">
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 dark:border-slate-800/40 pb-4 mb-4 gap-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-brand-teal/10 dark:bg-brand-teal/20 text-brand-teal px-2.5 py-1.5 rounded-lg text-xs font-black">
                      BUDGET PLANNER
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white">Bộ mô phỏng chia hũ thu nhập</h3>
                      <span className="block text-[9px] text-slate-400 mt-0.5">Giúp tự động hóa dòng tiền chi tiêu tối ưu</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block">Tổng thu nhập hàng tháng</span>
                    <span className="text-lg font-black text-slate-800 dark:text-white">{formatCurrency(budgetIncome)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Form Settings */}
                  <div className="lg:col-span-5 space-y-5">
                    {/* Income Input */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500">Nhập thu nhập của bạn (VND):</label>
                      <input 
                        type="number"
                        min="1000000"
                        max="200000000"
                        step="500000"
                        value={budgetIncome}
                        onChange={(e) => setBudgetIncome(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 transition-all"
                      />
                    </div>

                    {/* Rule Selection */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500">Chọn quy tắc phân bổ ngân sách:</label>
                      <select 
                        value={budgetRule}
                        onChange={(e) => {
                          const rule = e.target.value;
                          setBudgetRule(rule);
                          if (rule === '50/30/20') {
                            setCustomNeedsPct(50);
                            setCustomWantsPct(30);
                            setCustomSavingsPct(20);
                          } else if (rule === '6jars') {
                            setCustomNeedsPct(55);
                            setCustomWantsPct(10); // long term savings
                            setCustomSavingsPct(10); // investing
                          }
                        }}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-brand-teal transition-all"
                      >
                        <option value="50/30/20">Quy tắc 50/30/20 (Phổ biến nhất)</option>
                        <option value="6jars">Quy tắc 6 chiếc hũ tài chính</option>
                        <option value="custom">Tự chọn tỷ lệ của riêng bạn</option>
                      </select>
                    </div>

                    {/* Custom Sliders if custom chosen */}
                    {budgetRule === 'custom' && (
                      <div className="space-y-4 pt-2 p-4 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-850">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Cấu hình tỷ lệ hũ</span>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-500">Thiết yếu (Needs): {customNeedsPct}%</span>
                          </div>
                          <input 
                            type="range" min="10" max="80" value={customNeedsPct}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setCustomNeedsPct(val);
                              // Simple auto adjustment for others
                              const rem = 100 - val;
                              setCustomWantsPct(Math.round(rem * 0.6));
                              setCustomSavingsPct(Math.round(rem * 0.4));
                            }}
                            className="w-full accent-brand-teal cursor-pointer h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-500">Hưởng thụ (Wants): {customWantsPct}%</span>
                          </div>
                          <input 
                            type="range" min="10" max="60" value={customWantsPct}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setCustomWantsPct(val);
                              const rem = 100 - customNeedsPct - val;
                              setCustomSavingsPct(Math.max(0, rem));
                            }}
                            className="w-full accent-brand-teal cursor-pointer h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-550">Tích lũy (Savings): {100 - customNeedsPct - customWantsPct}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-teal" style={{ width: `${Math.max(0, 100 - customNeedsPct - customWantsPct)}%` }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Visual Result Jars */}
                  <div className="lg:col-span-7 space-y-4">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cơ cấu phân bổ chi tiết</span>
                    
                    {budgetRule !== '6jars' ? (
                      // 50/30/20 layout
                      <div className="space-y-3">
                        {/* Needs */}
                        <div className="p-4 bg-blue-500/5 dark:bg-blue-500/5 border border-blue-500/10 rounded-2xl flex justify-between items-center">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                              <span className="text-xs font-bold text-slate-800 dark:text-white">Thiết yếu (Needs)</span>
                              <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded">{customNeedsPct}%</span>
                            </div>
                            <p className="text-[10px] text-slate-400">Tiền nhà, ăn uống, đi lại, hóa đơn cơ bản...</p>
                          </div>
                          <span className="text-sm font-black text-blue-600 dark:text-blue-400">{formatCurrency((budgetIncome * customNeedsPct) / 100)}</span>
                        </div>

                        {/* Wants */}
                        <div className="p-4 bg-amber-500/5 dark:bg-amber-500/5 border border-amber-500/10 rounded-2xl flex justify-between items-center">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
                              <span className="text-xs font-bold text-slate-800 dark:text-white">Hưởng thụ (Wants)</span>
                              <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">{customWantsPct}%</span>
                            </div>
                            <p className="text-[10px] text-slate-400">Xem phim, tụ tập bạn bè, mua sắm giải trí...</p>
                          </div>
                          <span className="text-sm font-black text-amber-600 dark:text-amber-400">{formatCurrency((budgetIncome * customWantsPct) / 100)}</span>
                        </div>

                        {/* Savings */}
                        <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex justify-between items-center">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                              <span className="text-xs font-bold text-slate-800 dark:text-white">Tích lũy (Savings)</span>
                              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">{Math.max(0, 100 - customNeedsPct - customWantsPct)}%</span>
                            </div>
                            <p className="text-[10px] text-slate-400">Tiết kiệm mục tiêu, quỹ dự phòng, đầu tư thụ động...</p>
                          </div>
                          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{formatCurrency((budgetIncome * Math.max(0, 100 - customNeedsPct - customWantsPct)) / 100)}</span>
                        </div>
                      </div>
                    ) : (
                      // 6 Jars Layout
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Jar 1: Needs (55%) */}
                        <div className="p-3 bg-blue-500/5 dark:bg-blue-500/5 border border-blue-500/10 rounded-2xl flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold block text-slate-800 dark:text-white">Hũ Thiết Yếu (55%)</span>
                            <span className="text-[9px] text-slate-400">Sinh hoạt phí hàng ngày</span>
                          </div>
                          <span className="font-extrabold text-blue-500">{formatCurrency(budgetIncome * 0.55)}</span>
                        </div>

                        {/* Jar 2: Long term savings (10%) */}
                        <div className="p-3 bg-teal-500/5 dark:bg-teal-500/5 border border-teal-500/10 rounded-2xl flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold block text-slate-800 dark:text-white">Hũ Tiết Kiệm (10%)</span>
                            <span className="text-[9px] text-slate-400">Mua sắm mục tiêu lớn</span>
                          </div>
                          <span className="font-extrabold text-teal-500">{formatCurrency(budgetIncome * 0.10)}</span>
                        </div>

                        {/* Jar 3: Education (10%) */}
                        <div className="p-3 bg-purple-500/5 dark:bg-purple-500/5 border border-purple-500/10 rounded-2xl flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold block text-slate-800 dark:text-white">Hũ Giáo Dục (10%)</span>
                            <span className="text-[9px] text-slate-400">Học tập, mua sách vở</span>
                          </div>
                          <span className="font-extrabold text-purple-500">{formatCurrency(budgetIncome * 0.10)}</span>
                        </div>

                        {/* Jar 4: Financial Freedom (10%) */}
                        <div className="p-3 bg-emerald-500/5 dark:bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold block text-slate-800 dark:text-white">Hũ Đầu Tư (10%)</span>
                            <span className="text-[9px] text-slate-400">Tích lũy tài sản sinh lời</span>
                          </div>
                          <span className="font-extrabold text-emerald-500">{formatCurrency(budgetIncome * 0.10)}</span>
                        </div>

                        {/* Jar 5: Play (10%) */}
                        <div className="p-3 bg-amber-500/5 dark:bg-amber-500/5 border border-amber-500/10 rounded-2xl flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold block text-slate-800 dark:text-white">Hũ Hưởng Thụ (10%)</span>
                            <span className="text-[9px] text-slate-400">Vui chơi, ăn uống bạn bè</span>
                          </div>
                          <span className="font-extrabold text-amber-500">{formatCurrency(budgetIncome * 0.10)}</span>
                        </div>

                        {/* Jar 6: Give (5%) */}
                        <div className="p-3 bg-pink-500/5 dark:bg-pink-500/5 border border-pink-500/10 rounded-2xl flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold block text-slate-800 dark:text-white">Hũ Từ Thiện (5%)</span>
                            <span className="text-[9px] text-slate-400">Ủng hộ, tặng quà, sẻ chia</span>
                          </div>
                          <span className="font-extrabold text-pink-500">{formatCurrency(budgetIncome * 0.05)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-150 dark:border-slate-800/40 text-center">
                <p className="text-[10px] text-slate-400 font-medium">
                  *Bộ công cụ trên mô phỏng cơ chế chia dòng tiền cơ bản. Đăng ký tài khoản SAVE+ để kết nối nhật ký chi tiêu thực tế của bạn, tự động hóa chia hũ và nhận cảnh báo vượt ngân sách!
                </p>
              </div>
            </div>
          )}

          {sandboxTab === 'savings' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between animate-fadeIn">
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 dark:border-slate-800/40 pb-4 mb-4 gap-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 px-2.5 py-1.5 rounded-lg text-xs font-black">
                      SAVINGS TRACKER
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white">Trình mô phỏng mục tiêu tích lũy</h3>
                      <span className="block text-[9px] text-slate-400 mt-0.5">Đặt mục tiêu và tích lũy định kỳ để hoàn thành</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block">Ngân sách tích lũy dự kiến</span>
                    <span className="text-lg font-black text-brand-teal">{formatCurrency(monthlySavingAmt)}/tháng</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  {/* Left Column: Form settings */}
                  <div className="space-y-4">
                    {/* Goal Selection */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500">Chọn mục tiêu bạn muốn lập kế hoạch:</label>
                      <select 
                        value={savingsGoal}
                        onChange={(e) => {
                          setSavingsGoal(e.target.value);
                          setAccumulatedAmt(0);
                          setIsGoalCompleted(false);
                        }}
                        className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs font-bold text-slate-800 dark:text-white focus:outline-none"
                      >
                        <option value="laptop">Mua Laptop Học Tập (Mục tiêu 15,000,000đ)</option>
                        <option value="emergency">Quỹ Dự Phòng Khẩn Cấp (Mục tiêu 10,000,000đ)</option>
                        <option value="travel">Du Lịch Cùng Gia Đình (Mục tiêu 6,000,000đ)</option>
                      </select>
                    </div>

                    {/* Description Preset */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
                      <strong>Mô tả:</strong> {activeGoal.desc}
                    </div>

                    {/* Saving Amount Selection Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-[11px] font-bold text-slate-500">
                        <span>Số tiền gửi vào quỹ hàng tháng:</span>
                        <span className="text-brand-teal font-extrabold">{formatShortCurrency(monthlySavingAmt)}</span>
                      </div>
                      <input 
                        type="range"
                        min="500000"
                        max="5000000"
                        step="250000"
                        value={monthlySavingAmt}
                        onChange={(e) => setMonthlySavingAmt(Number(e.target.value))}
                        className="w-full accent-brand-teal cursor-pointer h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none"
                      />
                      <div className="flex justify-between text-[9px] text-slate-400">
                        <span>500K</span>
                        <span>5 triệu / tháng</span>
                      </div>
                    </div>

                    {/* Sim Button */}
                    <div className="pt-2 flex gap-3">
                      <button 
                        onClick={handleAddSavings}
                        disabled={isGoalCompleted}
                        className={`flex-1 py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          isGoalCompleted 
                            ? 'bg-slate-100 dark:bg-slate-850 text-slate-400 border border-transparent cursor-not-allowed shadow-none' 
                            : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/15'
                        }`}
                      >
                        <Sparkles size={14} />
                        <span>Tích lũy tháng này</span>
                      </button>
                      <button 
                        onClick={handleResetSavings}
                        className="px-4 py-3 rounded-xl border border-slate-250 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 font-bold text-xs transition-all cursor-pointer"
                      >
                        Làm lại
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Visual Goal Card Progress */}
                  <div className="space-y-5">
                    {/* Goal Progress Ring/Card */}
                    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-[#0F172A] dark:to-[#090d16] text-slate-800 dark:text-white rounded-3xl border border-slate-200 dark:border-white/5 shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                      {/* Abstract background shape */}
                      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-brand-teal/10 dark:bg-brand-teal/20 rounded-full blur-xl pointer-events-none" />
                      
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-450 font-bold uppercase tracking-wider block">Quỹ tích lũy mục tiêu</span>
                          <h4 className="text-base font-black tracking-tight text-slate-800 dark:text-white mt-1">{activeGoal.name}</h4>
                        </div>
                        <span className="text-2xl font-black text-brand-teal dark:text-brand-teallight">{goalProgress.toFixed(0)}%</span>
                      </div>

                      <div className="space-y-3 pt-4">
                        <div className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-brand-teal to-brand-green rounded-full transition-all duration-300" style={{ width: `${goalProgress}%` }} />
                        </div>
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-500 dark:text-slate-350">Đã tích lũy: {formatCurrency(accumulatedAmt)}</span>
                          <span className="text-slate-500 dark:text-slate-350">Mục tiêu: {formatShortCurrency(activeGoal.target)}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400">
                        {isGoalCompleted ? (
                          <span className="text-emerald-500 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                            <CheckCircle2 size={12} />
                            Đã hoàn thành xuất sắc mục tiêu!
                          </span>
                        ) : (
                          <span>Cần khoảng {Math.ceil((activeGoal.target - accumulatedAmt) / monthlySavingAmt)} tháng tích lũy để hoàn thành</span>
                        )}
                      </div>
                    </div>

                    {isGoalCompleted && (
                      <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-xs text-emerald-600 leading-relaxed font-semibold flex items-start gap-2.5 animate-fadeIn">
                        <Sparkles size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <strong>Hoàn thành xuất sắc!</strong> Bạn đã đạt được {formatCurrency(activeGoal.target)} cho mục tiêu "{activeGoal.name}". Lập thói quen tích lũy đều đặn chính là nền móng của sự tự do tài chính.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-150 dark:border-slate-800/40 text-center">
                <p className="text-[10px] text-slate-400 font-medium">
                  * SAVE+ giúp bạn tự động trích quỹ từ tài khoản định kỳ mỗi tháng, đầu tư sinh lời lãi kép an toàn và gửi thông báo nhắc nhở để bạn không bỏ quên mục tiêu tài chính của mình!
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Why Invest Section (Lời mời đầu tư) */}
      <section id="why-invest" className="py-20 bg-slate-50 dark:bg-[#0B101E] border-y border-slate-100 dark:border-slate-800/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-sm font-bold text-brand-teal dark:text-brand-teallight tracking-widest uppercase">TẠI SAO BẠN NÊN ĐẦU TƯ SỚM?</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Đừng để lạm phát làm hao mòn tài sản của bạn
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
              Nhiều bạn trẻ cho rằng chỉ khi có thật nhiều tiền mới nghĩ đến đầu tư. Tuy nhiên, yếu tố quan trọng nhất để tạo nên sự giàu có trong đầu tư không phải số tiền lớn, mà là <strong>Thời gian</strong> và <strong>Lãi kép</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 flex items-center justify-center">
                <Flame size={24} />
              </div>
              <h3 className="text-lg font-bold">Thách thức Lạm Phát</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Nếu chỉ cất tiền mặt hoặc để trong tài khoản ngân hàng thông thường với lãi suất cực thấp, tài sản của bạn sẽ bị mất giá trị mua hàng theo từng năm do lạm phát. Đầu tư giúp tiền của bạn sinh lời vượt trội hơn lạm phát.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center">
                <Percent size={24} />
              </div>
              <h3 className="text-lg font-bold">Kỳ quan Lãi Kép</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Lãi kép là khi tiền lời sinh ra từ khoản đầu tư ban đầu của bạn được cộng gộp vào vốn để tiếp tục sinh lời cao hơn ở các kỳ tiếp theo. Đầu tư càng sớm, vòng quay lãi kép diễn ra càng nhiều lần, tích lũy tài sản càng khổng lồ.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-lg font-bold">Hình thành Tư Duy Tài Chính</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Tự học đầu tư sớm giúp bạn làm quen với biến động thị trường, hiểu cấu trúc của nền kinh tế, quản lý rủi ro tốt hơn và nhanh chóng đạt mục tiêu tự do tài chính trước khi bước sang tuổi trung niên.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Evaluation Section */}
      <section id="experts" className="py-20 max-w-7xl mx-auto px-6 relative z-10 border-t border-slate-100 dark:border-slate-800/40">
        <div className="absolute top-[30%] left-[20%] w-80 h-80 bg-brand-teal/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-brand-green/5 rounded-full blur-[160px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/25 border border-blue-500/20 text-brand-teal dark:text-brand-teallight text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck size={14} className="text-brand-green" />
              <span>Được Kiểm Định Bởi Chuyên Gia Tài Chính</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Hội Đồng Chuyên Gia<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-green">Đánh Giá & Bảo Chứng</span>
            </h2>
            
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-2xl">
              SAVE+ vinh dự được kiểm định chất lượng nội dung và cơ chế giả lập bởi các chuyên gia đầu ngành trong lĩnh vực giáo dục, tài chính và công nghệ tài chính (fintech) tại Việt Nam. Chúng tôi cam kết mang lại kiến thức chuẩn xác, khách quan và an toàn nhất.
            </p>

            {/* Score progress meters */}
            <div className="space-y-4 pt-4 max-w-xl">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-600 dark:text-slate-300">Chất Lượng Sư Phạm & Lộ Trình Bài Giảng</span>
                  <span className="text-brand-teal dark:text-brand-teallight">9.8 / 10</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800/60 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-teal to-brand-green rounded-full" style={{ width: '98%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-600 dark:text-slate-300">Độ Thực Tế Quy Tắc Ngân Sách</span>
                  <span className="text-brand-teal dark:text-brand-teallight">9.6 / 10</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800/60 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-teal to-brand-green rounded-full" style={{ width: '96%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-600 dark:text-slate-300">Tính Tiện Ích Theo Dõi Mục Tiêu</span>
                  <span className="text-brand-teal dark:text-brand-teallight">9.7 / 10</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800/60 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-teal to-brand-green rounded-full" style={{ width: '97%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Accreditation certificate / shield badge */}
            <div className="w-full max-w-sm p-6 rounded-3xl bg-slate-50/50 dark:bg-[#0F172A]/40 border border-slate-200/50 dark:border-slate-800/50 flex flex-col items-center text-center gap-5 shadow-lg relative overflow-hidden">
              <div className="absolute -right-12 -top-12 w-28 h-28 bg-brand-teal/10 rounded-full blur-xl pointer-events-none" />
              
              {/* Custom SVG Trust Shield */}
              <div className="w-28 h-28 flex items-center justify-center text-brand-teal dark:text-brand-teallight shrink-0 animate-float-slow">
                <svg viewBox="0 0 120 120" className="w-full h-full">
                  <polygon points="60,10 100,25 100,65 60,110 20,65 20,25" fill="none" stroke="currentColor" strokeWidth="4" />
                  <path d="M45,60 l10,10 l20,-20" fill="none" stroke="#0EA5E9" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="60" cy="60" r="42" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" className="animate-spin-slow opacity-60" />
                </svg>
              </div>
              
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                  <CheckCircle2 size={12} />
                  <span>Đạt chuẩn kiểm định tài chính</span>
                </div>
                <h3 className="text-base font-bold">Chỉ Số Đánh Giá Toàn Diện</h3>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-green">
                    <CountUp end={9.7} duration={1.5} />
                  </span>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">/ 10.0 Điểm</span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed font-medium">
                  SAVE+ tự hào đạt chứng nhận xuất sắc về chất lượng phương pháp quản lý dòng tiền thực tiễn và tính trung thực của các thuật toán phân bổ quỹ tích lũy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Expert Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Expert 1 */}
          <TiltCard 
            options={{ max: 10, scale: 1.01 }}
            className="p-6 bg-white dark:bg-[#0F172A] border border-slate-100 dark:border-slate-800/80 rounded-3xl shadow-sm hover:shadow-xl hover:border-brand-teal/20 transition-all flex flex-col justify-between min-h-[260px]"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-amber-500" />)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed relative">
                <Quote size={20} className="absolute -top-3 -left-2 text-slate-200 dark:text-slate-800 opacity-60 z-0 pointer-events-none" />
                <span className="relative z-10 pl-4 block">
                  "SAVE+ đã giải quyết rất tốt bài toán học đi đôi với hành. Các công cụ lập ngân sách và mục tiêu tích lũy được thiết kế sinh động giúp học viên hiểu sâu bản chất lãi kép, lạm phát một cách thực tế nhất."
                </span>
              </p>
            </div>
            
            <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/40">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-teal to-blue-600 flex items-center justify-center font-extrabold text-xs text-white shrink-0 shadow-md">
                NT
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-white">PGS. TS. Nguyễn Văn Thuận</h4>
                <p className="text-[9px] text-slate-400 mt-0.5 font-medium leading-tight">Nguyên Trưởng khoa Tài chính - Ngân hàng, Đại học Mở TP.HCM</p>
              </div>
            </div>
          </TiltCard>

          {/* Expert 2 */}
          <TiltCard 
            options={{ max: 10, scale: 1.01 }}
            className="p-6 bg-white dark:bg-[#0F172A] border border-slate-100 dark:border-slate-800/80 rounded-3xl shadow-sm hover:shadow-xl hover:border-brand-teal/20 transition-all flex flex-col justify-between min-h-[260px]"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-amber-500" />)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed relative">
                <Quote size={20} className="absolute -top-3 -left-2 text-slate-200 dark:text-slate-800 opacity-60 z-0 pointer-events-none" />
                <span className="relative z-10 pl-4 block">
                  "Tôi rất ấn tượng với tính thực tế của hệ thống mô phỏng tích lũy. Mô hình chia hũ thu nhập khoa học kết hợp theo dõi mục tiêu trực quan là bước đệm tuyệt vời để các bạn trẻ hình thành thói quen quản lý tài chính cá nhân bền vững."
                </span>
              </p>
            </div>
            
            <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/40">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-green to-brand-teal flex items-center justify-center font-extrabold text-xs text-white shrink-0 shadow-md">
                HH
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-white">Nguyễn Thị Hồng Hạnh, CFA</h4>
                <p className="text-[9px] text-slate-400 mt-0.5 font-medium leading-tight">Chuyên gia Hoạch định Tài chính Cá nhân tại Dragon Capital</p>
              </div>
            </div>
          </TiltCard>

          {/* Expert 3 */}
          <TiltCard 
            options={{ max: 10, scale: 1.01 }}
            className="p-6 bg-white dark:bg-[#0F172A] border border-slate-100 dark:border-slate-800/80 rounded-3xl shadow-sm hover:shadow-xl hover:border-brand-teal/20 transition-all flex flex-col justify-between min-h-[260px]"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-amber-500" />)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed relative">
                <Quote size={20} className="absolute -top-3 -left-2 text-slate-200 dark:text-slate-800 opacity-60 z-0 pointer-events-none" />
                <span className="relative z-10 pl-4 block">
                  "Về công nghệ, việc tích hợp bảng điều khiển thông minh giúp người dùng theo dõi và tự động hóa dòng tiền, cùng thư viện tạp chí tài chính được cập nhật liên tục là điểm sáng công nghệ rất lớn. Tôi đánh giá cao tính thực tiễn này."
                </span>
              </p>
            </div>
            
            <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/40">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-brand-green flex items-center justify-center font-extrabold text-xs text-white shrink-0 shadow-md">
                TN
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-white">Trần Nam Trung</h4>
                <p className="text-[9px] text-slate-400 mt-0.5 font-medium leading-tight">Cố vấn Chiến lược Công nghệ Tài chính (Fintech Partner)</p>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* Interactive Compound Interest Calculator Section (Tính lãi kép) */}
      <section id="calculator" className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Sliders Control Block */}
          <div className="lg:col-span-5 space-y-6 bg-slate-50/50 dark:bg-[#0F172A]/40 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="p-2.5 rounded-xl bg-brand-teal/10 text-brand-teal dark:text-brand-teallight">
                <Calculator size={20} />
              </div>
              <h2 className="text-xl font-bold">Công Cụ Tính Lãi Kép</h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Kéo các thanh trượt bên dưới để ước tính số tài sản tích lũy của bạn khi đầu tư định kỳ dài hạn so với việc tiết kiệm không đầu tư.
            </p>

            <div className="space-y-5 pt-3">
              {/* Initial Capital Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Số vốn ban đầu (VND)</span>
                  <input 
                    type="number"
                    value={initialCapital}
                    onChange={(e) => setInitialCapital(Math.max(0, Number(e.target.value)))}
                    className="w-32 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-right text-brand-teal dark:text-brand-teallight font-bold focus:outline-none focus:ring-1 focus:ring-brand-teal"
                  />
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100000000"
                  step="1000000"
                  value={Math.min(100000000, initialCapital)}
                  onChange={(e) => setInitialCapital(Number(e.target.value))}
                  className="w-full accent-brand-teal cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0đ</span>
                  <span>100 triệu</span>
                </div>
              </div>

              {/* Monthly Contribution Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Tích lũy hàng tháng (VND)</span>
                  <div className="flex items-center gap-1">
                    <input 
                      type="number"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value)))}
                      className="w-28 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-right text-brand-teal dark:text-brand-teallight font-bold focus:outline-none focus:ring-1 focus:ring-brand-teal"
                    />
                    <span className="text-slate-400 font-normal">/tháng</span>
                  </div>
                </div>
                <input 
                  type="range"
                  min="100000"
                  max="20000000"
                  step="100000"
                  value={Math.min(20000000, monthlyContribution)}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="w-full accent-brand-teal cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>100K</span>
                  <span>20 triệu</span>
                </div>
              </div>

              {/* Interest Rate Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Lãi suất kì vọng (%/năm)</span>
                  <div className="flex items-center gap-1">
                    <input 
                      type="number"
                      step="0.5"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))}
                      className="w-20 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-right text-brand-teal dark:text-brand-teallight font-bold focus:outline-none focus:ring-1 focus:ring-brand-teal"
                    />
                    <span className="text-slate-400 font-normal">% / năm</span>
                  </div>
                </div>
                <input 
                  type="range"
                  min="3"
                  max="30"
                  step="0.5"
                  value={Math.min(30, interestRate)}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-brand-teal cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>3% (Lãi gửi tiết kiệm cực thấp)</span>
                  <span>30% (Hiệu quả xuất sắc)</span>
                </div>
              </div>

              {/* Years Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Thời gian đầu tư (Năm)</span>
                  <div className="flex items-center gap-1">
                    <input 
                      type="number"
                      value={years}
                      onChange={(e) => setYears(Math.max(1, Number(e.target.value)))}
                      className="w-20 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-right text-brand-teal dark:text-brand-teallight font-bold focus:outline-none focus:ring-1 focus:ring-brand-teal"
                    />
                    <span className="text-slate-400 font-normal">năm</span>
                  </div>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="40"
                  step="1"
                  value={Math.min(40, years)}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full accent-brand-teal cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>1 năm</span>
                  <span>40 năm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calculator Chart & Results Display Block */}
          <div className="lg:col-span-7 space-y-6">
            {/* Visual Results Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-brand-teal/5 dark:bg-brand-teal/5 border border-brand-teal/15 rounded-2xl text-center">
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">Tổng tài sản nhận được</span>
                <span className="text-lg md:text-xl font-extrabold text-brand-teal dark:text-brand-teallight">{formatShortCurrency(finalInvestmentValue)}</span>
              </div>
              <div className="p-4 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/40 dark:border-slate-800/30 rounded-2xl text-center">
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">Tiền gốc tích lũy</span>
                <span className="text-lg md:text-xl font-extrabold text-slate-600 dark:text-slate-300">{formatShortCurrency(finalSavingsValue)}</span>
              </div>
              <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/5 border border-emerald-500/15 rounded-2xl text-center">
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">Tiền lãi từ lãi kép</span>
                <span className="text-lg md:text-xl font-extrabold text-emerald-500">{formatShortCurrency(interestEarned)}</span>
              </div>
            </div>

            {/* Recharts Area Chart container */}
            <div className="p-6 bg-white dark:bg-[#0F172A]/70 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm">
              <span className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 text-center">
                Biểu Đồ So Sánh Tăng Trưởng Tài Sản
              </span>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={calculatorData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorInvest" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSave" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#64748B" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#64748B" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"} />
                    <XAxis 
                      dataKey="year" 
                      tickLine={false} 
                      axisLine={false} 
                      style={{ fontSize: 10, fill: darkMode ? '#64748B' : '#94A3B8', fontWeight: 600 }}
                    />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => formatShortCurrency(value)}
                      style={{ fontSize: 10, fill: darkMode ? '#64748B' : '#94A3B8', fontWeight: 600 }}
                    />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value), '']}
                      contentStyle={{ 
                        backgroundColor: darkMode ? '#0F172A' : '#FFFFFF', 
                        borderColor: darkMode ? '#1E293B' : '#E2E8F0',
                        borderRadius: 12,
                        fontSize: 12,
                        color: darkMode ? '#F1F5F9' : '#0F172A',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area type="monotone" dataKey="Đầu tư (SAVE+)" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorInvest)" />
                    <Area type="monotone" dataKey="Không đầu tư" stroke="#64748B" strokeWidth={1.5} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorSave)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Hook callout message */}
            <div className="p-5 rounded-2xl bg-gradient-to-tr from-brand-teal/5 to-brand-green/5 border border-brand-teal/15 text-sm space-y-2">
              <div className="flex items-center space-x-2 text-brand-teal dark:text-brand-teallight font-bold">
                <Sparkles size={16} />
                <span>Nhận Xét Kết Quả:</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Bằng cách tích lũy và đầu tư có lộ trình với mức lãi suất trung bình <strong className="text-slate-800 dark:text-slate-200">{interestRate}%/năm</strong>, tài sản của bạn thu về sau <strong className="text-slate-800 dark:text-slate-200">{years} năm</strong> nhiều gấp <strong className="text-emerald-500 font-bold">{timesBetter} lần</strong> số tiền tích lũy thông thường. Phần chênh lệch <strong className="text-emerald-500 font-bold">{formatCurrency(interestEarned)}</strong> chính là sức mạnh kỳ diệu của lãi kép.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Subjects / Core Themes Section (Các chủ đề liên quan đến đầu tư) */}
      <section id="features" className="py-20 bg-slate-50 dark:bg-[#0B101E] border-y border-slate-100 dark:border-slate-800/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-sm font-bold text-brand-teal dark:text-brand-teallight tracking-widest uppercase">DANH MỤC TRẢI NGHIỆM</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Các Chủ Đề Lĩnh Vực Cốt Lõi Trên SAVE+
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
              Chúng tôi cung cấp hệ sinh thái tài chính khép kín giúp bạn vừa tích lũy kiến thức lý thuyết vừa rèn luyện kỹ năng thực tế một cách toàn diện.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Card 1: Automatic Income Allocation */}
            <TiltCard 
              options={{ max: 10, scale: 1.02 }}
              className="p-6 bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-105 dark:border-slate-800/60 shadow-sm space-y-4 hover:shadow-lg transition-all" 
              onClick={() => navigate('/login', { state: { from: '/budget' } })}
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-brand-teal flex items-center justify-center">
                  <Calculator size={24} />
                </div>
                <div className="w-12 h-12 -mt-2 -mr-2 text-brand-green animate-pulse">
                  <svg viewBox="0 0 64 64" className="w-full h-full">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="3" />
                    <line x1="32" y1="12" x2="32" y2="52" stroke="currentColor" strokeWidth="3" />
                    <line x1="12" y1="32" x2="52" y2="32" stroke="currentColor" strokeWidth="3" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-bold">Phân Bổ Thu Nhập Tự Động</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Tự động hóa phân bổ dòng tiền hàng tháng theo quy tắc 50/30/20 hoặc 6 chiếc hũ tài chính. Quản lý thu chi thông minh và tối ưu hóa ngân sách cá nhân dễ dàng.
              </p>
              <div className="flex items-center space-x-1 text-xs font-bold text-brand-teal dark:text-brand-teallight">
                <span>Bắt đầu lập ngân sách</span>
                <ChevronRight size={14} />
              </div>
            </TiltCard>

            {/* Card 2: Knowledge & Journal Library */}
            <TiltCard 
              options={{ max: 10, scale: 1.02 }}
              className="p-6 bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-105 dark:border-slate-800/60 shadow-sm space-y-4 hover:shadow-lg transition-all" 
              onClick={() => navigate('/login', { state: { from: '/learning' } })}
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 flex items-center justify-center">
                <BookOpen size={24} />
              </div>
              <h3 className="text-lg font-bold">Thư Viện Kiến Thức & Tạp Chí</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Tra cứu các bài viết, nghiên cứu học thuật và tạp chí tài chính chính thống từ các ngân hàng và viện nghiên cứu đối tác hàng đầu Việt Nam để nâng cao tư duy tiền tệ.
              </p>
              <div className="flex items-center space-x-1 text-xs font-bold text-indigo-500">
                <span>Khám phá thư viện</span>
                <ChevronRight size={14} />
              </div>
            </TiltCard>

            {/* Card 3: Visual Cash Flow Analytics */}
            <TiltCard 
              options={{ max: 10, scale: 1.02 }}
              className="p-6 bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-105 dark:border-slate-800/60 shadow-sm space-y-4 hover:shadow-lg transition-all" 
              onClick={() => navigate('/login', { state: { from: '/analytics' } })}
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <TrendingUp size={24} />
                </div>
                <div className="w-12 h-12 -mt-2 -mr-2 text-brand-teal animate-pulse">
                  <svg viewBox="0 0 64 64" className="w-full h-full">
                    <path d="M6 52h52 M12 42 l12-16 12 10 18-24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="54" cy="12" r="4" fill="currentColor" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-bold">Phân Tích Dòng Tiền Trực Quan</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Báo cáo biểu đồ thu chi trực quan sinh động, phân loại các khoản chi tiêu chi tiết giúp bạn dễ dàng nắm bắt bức tranh tài chính tổng quan của bản thân.
              </p>
              <div className="flex items-center space-x-1 text-xs font-bold text-teal-500">
                <span>Xem phân tích dòng tiền</span>
                <ChevronRight size={14} />
              </div>
            </TiltCard>

            {/* Card 4: Financial Goals */}
            <TiltCard 
              options={{ max: 10, scale: 1.02 }}
              className="p-6 bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-105 dark:border-slate-800/60 shadow-sm space-y-4 hover:shadow-lg transition-all" 
              onClick={() => navigate('/login', { state: { from: '/goals' } })}
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center">
                <Target size={24} />
              </div>
              <h3 className="text-lg font-bold">Kế Hoạch & Mục Tiêu Tài Chính</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Đặt mục tiêu cụ thể như Quỹ khẩn cấp, mua sắm thiết bị học tập, hoặc du lịch tự túc. Hệ thống tự động thiết kế lộ trình phân bổ dòng tiền hàng tháng và theo dõi tiến trình hoàn thành.
              </p>
              <div className="flex items-center space-x-1 text-xs font-bold text-amber-500">
                <span>Quản lý mục tiêu</span>
                <ChevronRight size={14} />
              </div>
            </TiltCard>

            {/* Card 5: Community */}
            <TiltCard 
              options={{ max: 10, scale: 1.02 }}
              className="p-6 bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-105 dark:border-slate-800/60 shadow-sm space-y-4 hover:shadow-lg transition-all" 
              onClick={() => navigate('/login', { state: { from: '/community' } })}
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-lg font-bold">Cộng Đồng Chia Sẻ Bí Quyết</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Nơi giao lưu, thảo luận và chia sẻ các mẹo chi tiêu thông minh, phương pháp tiết kiệm tối ưu và các câu chuyện quản lý tài chính thực tế từ cộng đồng giới trẻ năng động.
              </p>
              <div className="flex items-center space-x-1 text-xs font-bold text-emerald-500">
                <span>Tham gia cộng đồng</span>
                <ChevronRight size={14} />
              </div>
            </TiltCard>

            {/* Card 6: Smart Spending Journal */}
            <TiltCard 
              options={{ max: 10, scale: 1.02 }}
              className="p-6 bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-105 dark:border-slate-800/60 shadow-sm space-y-4 hover:shadow-lg transition-all" 
              onClick={() => navigate('/login', { state: { from: '/journal' } })}
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-500 flex items-center justify-center">
                <Layers size={24} />
              </div>
              <h3 className="text-lg font-bold">Nhật Ký Chi Tiêu Khoa Học</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Ghi chép và theo dõi thói quen chi tiêu hàng ngày một cách trực quan, giúp định hình phong cách sống tài chính bền vững và kiểm soát dòng tiền hiệu quả.
              </p>
              <div className="flex items-center space-x-1 text-xs font-bold text-rose-500">
                <span>Khám phá nhật ký</span>
                <ChevronRight size={14} />
              </div>
            </TiltCard>

          </div>
        </div>
      </section>

      {/* Pricing / Subscriptions Section */}
      <section id="pricing" className="py-20 bg-slate-50/50 dark:bg-[#080D17]/40 border-t border-slate-200 dark:border-slate-800/40 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-sm font-bold text-brand-teal dark:text-brand-teallight tracking-widest uppercase">GÓI HỌC TẬP VÀ TRẢI NGHIỆM</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Được Thiết Kế Phù Hợp Với Nhu Cầu Của Bạn</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Đăng ký tài khoản miễn phí trọn đời để lập ngân sách cơ bản, hoặc nâng cấp lên gói Pro/Premium để mở khóa các tính năng quản lý dòng tiền nâng cao.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {plansData.map((plan, idx) => (
              <div 
                key={idx}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  plan.popular 
                    ? 'bg-gradient-to-b from-slate-50 to-slate-100/80 border-2 border-brand-teal shadow-xl shadow-brand-teal/10 scale-105 z-10 dark:from-[#0F172A] dark:to-[#090E1A] dark:border-brand-teal'
                    : 'bg-white dark:bg-[#0F172A]/50 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand-teal to-brand-green text-white font-extrabold text-[10px] uppercase tracking-wider shadow-md">
                    Khuyên dùng
                  </span>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">
                      {plan.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      {plan.desc}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1 pt-2 border-t border-slate-200 dark:border-slate-800/40">
                    <span className="text-4xl font-black tracking-tight text-brand-teal dark:text-brand-teallight">
                      {plan.price}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">/ {plan.period}</span>
                  </div>

                  <ul className="space-y-3.5 pt-4">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs">
                        <Check className="text-emerald-500 shrink-0 mt-0.5" size={15} />
                        <span className="text-slate-600 dark:text-slate-300 font-medium">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8 mt-8 border-t border-slate-200 dark:border-slate-800/40">
                  <button 
                    onClick={() => navigate('/register')}
                    className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer shadow-md hover:scale-103 active:scale-97 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-brand-teal to-brand-green text-white hover:shadow-lg hover:shadow-brand-teal/20' 
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <span className="text-sm font-bold text-brand-teal dark:text-brand-teallight tracking-widest uppercase">HỎI ĐÁP PHỔ BIẾN</span>
          <h2 className="text-3xl font-extrabold tracking-tight">Giải Đáp Thắc Mắc Cho Người Mới</h2>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-slate-50 dark:bg-[#0F172A]/40 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-5 text-left flex justify-between items-center font-bold text-slate-800 dark:text-slate-100 hover:text-brand-teal transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown 
                  size={18} 
                  className={`text-slate-400 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-brand-teal' : ''}`}
                />
              </button>
              
              {openFaq === idx && (
                <div className="px-6 pb-5 pt-1 text-slate-500 dark:text-slate-400 text-xs leading-relaxed border-t border-slate-100 dark:border-slate-800/40">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer Invitation */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 text-center relative z-10">
        <div className="p-8 md:p-16 rounded-3xl bg-gradient-to-tr from-brand-teal via-blue-600 to-brand-green text-white relative overflow-hidden shadow-xl">
          {/* Decorative blur elements inside CTA */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-xl translate-x-20 -translate-y-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-green/20 rounded-full blur-2xl -translate-x-20 translate-y-20 pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Bắt đầu lập kế hoạch tài chính cá nhân hoàn toàn miễn phí
            </h2>
            <p className="opacity-90 text-sm font-medium">
              Chỉ mất 1 phút để khởi tạo tài khoản. Bắt đầu quản lý ngân sách khoa học, lập mục tiêu tích lũy và theo dõi dòng tiền thông minh ngay hôm nay cùng hàng nghìn người dùng khác.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-brand-teal font-bold hover:bg-slate-50 transition-all cursor-pointer shadow-lg text-base"
              >
                Đăng ký tài khoản mới
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/30 text-white font-bold hover:bg-white/10 transition-all cursor-pointer text-base"
              >
                Đăng nhập ngay
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Partners & Security Certifications */}
      <section className="py-12 bg-white dark:bg-[#090D16] border-t border-slate-100 dark:border-slate-800/40 z-10 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left: Security badges */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 shrink-0">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0F172A]/40 border border-slate-150 dark:border-slate-800 text-[11px] font-bold text-slate-450 dark:text-slate-400">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span>Mã Hóa SSL 256-bit</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0F172A]/40 border border-slate-150 dark:border-slate-800 text-[11px] font-bold text-slate-455 dark:text-slate-400">
                <CheckCircle2 size={16} className="text-brand-teal" />
                <span>Bảo Mật Cơ Sở Dữ Liệu</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0F172A]/40 border border-slate-150 dark:border-slate-800 text-[11px] font-bold text-slate-455 dark:text-slate-400">
                <Lock size={16} className="text-amber-500" />
                <span>Đáp Ứng PCI-DSS</span>
              </div>
            </div>

            {/* Right: Partner text & logos grid */}
            <div className="flex flex-col items-center lg:items-end gap-3 text-center lg:text-right">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">ĐỐI TÁC DỮ LIỆU & ĐỒNG HÀNH CHIẾN LƯỢC</span>
              <div className="flex flex-wrap justify-center lg:justify-end items-center gap-4 opacity-40 hover:opacity-85 transition-opacity duration-300">
                {partnerLogos.map((p, idx) => (
                  <span 
                    key={idx} 
                    className="text-[10px] font-extrabold tracking-wider text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800/80 px-2.5 py-1.5 rounded hover:text-brand-teal dark:hover:text-brand-teallight transition-colors"
                    title={p.name}
                  >
                    {p.tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-[#060A10] border-t border-slate-200/40 dark:border-slate-800/35 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-brand-teal flex items-center justify-center text-white font-extrabold text-lg">S+</div>
              <span className="font-extrabold text-lg tracking-wider text-slate-800 dark:text-white">SAVE+</span>
            </div>
            <p className="text-slate-400 text-xs">
              SAVE+ - Nền tảng lập ngân sách khoa học, tích lũy bài bản và quản lý mục tiêu dòng tiền an toàn cho người trẻ Việt Nam.
            </p>
            <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
              <ShieldCheck size={12} className="text-brand-green" />
              <span>Kết nối mã hóa SSL 256-bit bảo mật</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Các tính năng</h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li><a href="#features" className="hover:underline">Phân bổ ngân sách</a></li>
              <li><a href="#features" className="hover:underline">Thư viện kiến thức</a></li>
              <li><a href="#features" className="hover:underline">Nhật ký chi tiêu</a></li>
              <li><a href="#features" className="hover:underline">Mục tiêu tích lũy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Đối tác liên kết</h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>Viện nghiên cứu tài chính vĩ mô</li>
              <li>Các ngân hàng đối tác liên kết</li>
              <li>Thư viện học thuật chính thống</li>
              <li>Cộng đồng tích lũy Việt Nam</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Liên hệ & Hỗ trợ</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Email: support@saveplus.vn<br />
              Hotline: 1900 88xx (24/7)<br />
              Địa chỉ: Quận 1, Thành phố Hồ Chí Minh, Việt Nam
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-200/20 dark:border-slate-800/20 text-center text-[10px] text-slate-400">
          <span>&copy; {new Date().getFullYear()} SAVE+. Tất cả quyền được bảo lưu. Nền tảng giả lập giáo dục tài chính số.</span>
        </div>
      </footer>

    </div>
  );
}
