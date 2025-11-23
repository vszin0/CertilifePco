import React, { useState, useEffect, useRef } from 'react';
import {
  Monitor, Smartphone, BarChart3, QrCode,
  CheckCircle2, ArrowRight, MessageCircle,
  ChevronRight, ChevronLeft, Menu, X, Award, MousePointer2,
  MapPin, Calendar, Users, Bot, Gift
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useInView, useSpring } from 'framer-motion';

// --- Components ---

// 숫자 카운팅 컴포넌트
const Counter = ({ from, to, duration = 2 }) => {
  const nodeRef = useRef();
  const inView = useInView(nodeRef, { once: true });

  useEffect(() => {
    if (!inView) return;
    const node = nodeRef.current;

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);

      // EaseOutQuart
      const ease = 1 - Math.pow(1 - progress, 4);

      node.textContent = Math.floor(from + (to - from) * ease);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        node.textContent = to;
      }
    };
    window.requestAnimationFrame(step);
  }, [inView, from, to, duration]);

  return <span ref={nodeRef}>{from}</span>;
};

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [activeCase, setActiveCase] = useState(0); // 성공 사례 슬라이더 상태
  const [scrolled, setScrolled] = useState(false);

  // 스크롤 프로그레스
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 탭 자동 전환 로직 (6개 기능으로 확장)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 6);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // 성공 사례 자동 전환 로직 (2개 사례)
  useEffect(() => {
    const caseTimer = setInterval(() => {
      setActiveCase((prev) => (prev + 1) % 2);
    }, 8000);
    return () => clearInterval(caseTimer);
  }, []);

  // 부드러운 스크롤 이동 핸들러 (공통)
  const smoothScrollTo = (e, id) => {
    e.preventDefault(); // 기본 앵커 이동 방지
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; // 헤더 높이만큼 보정
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setIsMenuOpen(false); // 모바일 메뉴 닫기
  };

  // 기능 클릭 핸들러 (스크롤 이동 및 탭 활성화)
  const handleFeatureClick = (index) => {
    setActiveTab(index);
    const element = document.getElementById('all-in-one-features');
    if (element) {
      // 네비게이션 바 높이 등을 고려하여 여유를 두고 스크롤
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const features = [
    {
      title: "학술대회 전용 홈페이지",
      description: "행사 소개부터 사전등록까지, 전문적인 공식 웹사이트를 빠르게 구축합니다.",
      icon: <Monitor className="w-6 h-6" />,
      detail: "반응형 웹, 연자 소개, 오시는 길, 실시간 사전등록 결제 시스템 연동"
    },
    {
      title: "모바일 초록집 (E-BOOK)",
      description: "무거운 인쇄물 대신 스마트폰 속 E-BOOK으로 비용과 편의성을 잡으세요.",
      icon: <Smartphone className="w-6 h-6" />,
      detail: "강연 일정, 연자 프로필, 초록(Abstract) 열람, 검색 기능 지원"
    },
    {
      title: "스마트 QR 등록",
      description: "복잡한 현장 등록 절차 없이 QR 태깅 한 번으로 빠르고 정확하게 입장하세요.",
      icon: <QrCode className="w-6 h-6" />,
      detail: "개인별 QR 발송, 태블릿 태깅 입장, 실시간 출석 현황 자동 집계"
    },
    {
      title: "카카오 알림톡",
      description: "행사 안내, 공지사항, 입장 QR까지 카카오톡으로 확실하게 전달합니다.",
      icon: <MessageCircle className="w-6 h-6" />,
      detail: "D-1 리마인드 알림톡, 미납/납부 안내 메시지 자동 발송"
    },
    {
      title: "행사 전용 AI 챗봇",
      description: "반복되는 문의 전화는 그만. AI가 24시간 실시간으로 응대하여 운영 효율을 높입니다.",
      icon: <Bot className="w-6 h-6" />,
      detail: "일정, 장소, 주차, 등록 확인 등 단순 반복 문의 자동 응답 설정"
    },
    {
      title: "스마트 경품 시스템",
      description: "종이접기, 쿠폰제출은 이제 그만, 행사장 참석자만을 대상으로 경품 추첨합니다.",
      icon: <Gift className="w-6 h-6" />,
      detail: "실시간 추첨, QR 입장객 대상 자동 응모, 현장 스크린 연동"
    }
  ];

  // E-BOOK 세션 데이터
  const sessionData = [
    { time: "09:30 - 10:10", title: "임플란트 수술의 최신 지견", speaker: "김철수 원장" },
    { time: "10:20 - 11:00", title: "상악동 거상술의 A to Z", speaker: "이영희 교수" },
    { time: "11:10 - 11:50", title: "디지털 가이드 수술의 실제", speaker: "박민수 원장" },
    { time: "13:00 - 13:40", title: "발치 즉시 식립의 성공 전략", speaker: "최지훈 박사" },
    { time: "13:50 - 14:30", title: "임플란트 주위염 처치법", speaker: "정다은 원장" }
  ];

  // 성공 사례 데이터
  const caseStudies = [
    {
      id: "dass",
      title: "2025 DASS CONFERENCE",
      titleSuffix: "",
      subtitle: "\"7 Masters, 7 Insights: Shaping the New Era of Dentistry\"",
      description: "DASS 2025 컨퍼런스는 서티라이프의 올인원 솔루션을 도입하여 사전 등록부터 현장 입장까지의 모든 과정을 디지털화했습니다. 모바일 초록집과 스마트 알림톡을 통해 참가자들의 만족도를 극대화했습니다.",
      stats: [
        { label: "등록자", val: 213, unit: "명" },
        { label: "출석자", val: 198, unit: "명" },
        { label: "참가자 출석률", val: 93, unit: "%" },
        { label: "비용 절감", val: 30, unit: "%" },
      ],
      badge: "DASS 2025",
      awardTitle: "디지털 운영 혁신!",
      awardDesc: "기존 아날로그 방식 대비 운영 효율이 획기적으로 개선되었습니다.",
      checkpoints: ["등록 데스크 대기열 최소화", "미납자 자동 필터링 및 안내", "스마트 경품 추첨"],
      buttonText: "관련 뉴스 보기",
      buttonLink: "https://dentalpress.kr/index/?idx=167906790&bmode=view"
    },
    {
      id: "dda",
      title: "DDA 2025",
      titleSuffix: "대전광역시치과의사회 학술대회",
      subtitle: "\"디지털 덴티스트리의 새로운 표준을 제시하다\"",
      description: "DDA 2025 학술대회는 대규모 인원이 참여하는 행사임에도 불구하고, 서티라이프의 스마트 QR 입장 시스템을 통해 혼잡 없이 쾌적한 입장을 실현했습니다. 자동화된 등록 시스템으로 운영 인력을 최소화하고 비용 효율을 높였습니다.",
      stats: [
        { label: "등록자", val: 483, unit: "명" },
        { label: "출석자", val: 452, unit: "명" },
        { label: "참가자 출석률", val: 93, unit: "%" },
        { label: "비용 절감", val: 35, unit: "%" },
      ],
      badge: "DDA 2025",
      awardTitle: "운영 효율 극대화",
      awardDesc: "대기 시간 없는 빠른 입장으로 참가자 만족도가 크게 상승했습니다.",
      checkpoints: ["대규모 인원 QR 동시 처리", "실시간 데이터 집계 시스템", "스마트 보수 교육 출석 처리"],
      buttonText: "관련 뉴스 보기",
      buttonLink: "https://www.dentalnews.or.kr/news/article.html?no=45724"
    }
  ];

  const nextCase = () => setActiveCase((prev) => (prev + 1) % caseStudies.length);
  const prevCase = () => setActiveCase((prev) => (prev - 1 + caseStudies.length) % caseStudies.length);

  // 경품 추첨 명단 (10명)
  const raffleNames = [
    "김철수 (23451)", "이영희 (19823)", "박민수 (30122)",
    "최지훈 (25671)", "정다은 (18992)", "강현우 (11523)",
    "윤서연 (44921)", "임재현 (33812)", "송민지 (55019)",
    "오준호 (66210)"
  ];

  // 무한 롤링을 위해 명단 3배 복사
  const infiniteRaffleNames = [...raffleNames, ...raffleNames, ...raffleNames];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-yellow-400 selection:text-slate-900">

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-yellow-400 origin-left z-[60]"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-2xl font-bold tracking-tight text-slate-900">CertiLife <span className="text-yellow-500 font-light">PCO</span></span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            {[
              { label: '주요 기능', id: 'features-grid' }, // id 사용
              { label: '성공 사례', id: 'section-1' }     // id 사용
            ].map((item, i) => (
              <motion.a
                key={i}
                href={`#${item.id}`}
                onClick={(e) => smoothScrollTo(e, item.id)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-gray-600 hover:text-slate-900 font-medium transition-colors relative group cursor-pointer"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full"></span>
              </motion.a>
            ))}
            <motion.a
              href="https://certi.life/#contact"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(250, 204, 21, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-400 text-slate-900 px-6 py-2.5 rounded-full font-bold transition-all cursor-pointer inline-block"
            >
              도입 문의하기
            </motion.a>
          </div>

          <button className="md:hidden text-gray-800" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-br from-slate-50 to-yellow-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white text-slate-800 px-4 py-2 rounded-full text-sm font-bold tracking-wide border border-yellow-200 shadow-sm"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                </span>
                2025 학술대회 디지털 전환 솔루션
              </motion.div>

              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900">
                성공적인 학술대회,<br />
                <span className="relative inline-block text-slate-900">
                  <span className="relative z-10">디지털 파트너</span>
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="absolute bottom-2 left-0 h-6 bg-yellow-400 -z-0 opacity-80"
                  ></motion.span>
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                홈페이지 구축부터 사전 등록, 카카오 알림톡, 현장 QR 입장까지.
                복잡한 행사 운영, 서티라이프가 스마트하게 해결해 드립니다.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <motion.a
                  href="https://certi.life/#contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-yellow-400 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-yellow-400/20 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  도입 문의하기
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.a>
              </div>

              <div className="flex items-center gap-6 pt-4 text-sm font-medium text-gray-500">
                {[
                  { text: "출석률 93% 달성", delay: 1.0 },
                  { text: "종이 없는 행사", delay: 1.1 },
                  { text: "실시간 데이터", delay: 1.2 }
                ].map((badge, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: badge.delay }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-yellow-500" />
                    <span>{badge.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Interactive Hero Visual */}
            <div className="relative hidden lg:block h-[600px] w-full">
              {/* Background Blobs */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                }}
                transition={{ duration: 20, repeat: Infinity }}
                className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-200/50 rounded-full blur-3xl"
              />

              {/* Main Card Container with Tilt Effect */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute top-10 right-10 w-full max-w-md"
              >
                {/* Floating Dashboard Card */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 relative z-20"
                >
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-1.5">
                      {[1, 2, 3].map(i => <div key={i} className="w-3 h-3 rounded-full bg-slate-200" />)}
                    </div>
                    <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">Live</div>
                  </div>

                  {/* Animated Charts */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="text-slate-500 text-xs font-bold mb-1">등록 인원</div>
                      <div className="text-3xl font-extrabold text-slate-900">
                        <Counter from={0} to={1231} />
                      </div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100">
                      <div className="text-yellow-700 text-xs font-bold mb-1">등록율</div>
                      <div className="text-3xl font-extrabold text-slate-900">
                        <Counter from={0} to={93} />%
                      </div>
                    </div>
                  </div>

                  {/* Animated Message Notification */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.5, type: "spring" }}
                    className="bg-[#FAE100] p-4 rounded-2xl shadow-lg relative cursor-pointer group"
                  >
                    <div className="flex gap-3">
                      <div className="bg-white/30 p-2 rounded-lg h-fit">
                        <MessageCircle className="w-5 h-5 text-slate-900" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-sm mb-1">[DASS 2025] 입장 안내</div>
                        <div className="text-xs text-slate-800 leading-snug">
                          홍길동님, QR코드가 도착했습니다.<br />
                          지금 확인하기
                        </div>
                      </div>
                    </div>
                    <motion.div
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >1</motion.div>
                  </motion.div>
                </motion.div>

                {/* Background Card Decoration */}
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, -2, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute top-12 -left-12 w-64 h-72 bg-slate-900 rounded-3xl p-6 shadow-xl z-10"
                >
                  <div className="w-12 h-12 bg-slate-800 rounded-full mb-4" />
                  <div className="w-full h-4 bg-slate-800 rounded mb-2" />
                  <div className="w-2/3 h-4 bg-slate-800 rounded" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Icons Section (Click to Scroll & Update Tab) */}
      <section id="features-grid" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">왜 서티라이프 PCO 솔루션인가요?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                onClick={() => handleFeatureClick(index)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, transition: { type: "spring", stiffness: 300 } }}
                className="group p-8 rounded-3xl bg-slate-50 hover:bg-white hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-yellow-300 cursor-pointer h-full flex flex-col items-center text-center active:scale-95"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-yellow-400 group-hover:text-slate-900 transition-colors text-yellow-500 group-hover:scale-110 duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-yellow-600 transition-colors">{feature.title}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Tabs Section */}
      <section id="all-in-one-features" className="py-20 bg-slate-900 text-white overflow-hidden relative">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#FEE500 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/3 space-y-2">
              <h2 className="text-3xl font-bold mb-8 text-yellow-400">All-in-One<br />이벤트 솔루션</h2>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="relative">
                    <button
                      onClick={() => setActiveTab(index)}
                      className={`w-full text-left p-6 rounded-2xl transition-all duration-300 flex items-center justify-between group relative overflow-hidden ${activeTab === index
                          ? 'bg-yellow-400 text-slate-900 shadow-[0_0_20px_rgba(250,204,21,0.3)]'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                    >
                      <span className="font-bold text-lg relative z-10">{feature.title}</span>
                      <ChevronRight className={`w-5 h-5 transition-transform z-10 ${activeTab === index ? 'translate-x-1' : 'opacity-0 group-hover:opacity-50'}`} />

                      {/* Progress Bar for Active Tab */}
                      {activeTab === index && (
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 6, ease: "linear" }}
                          className="absolute bottom-0 left-0 h-1 bg-slate-900/10 z-10"
                        />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-2/3 min-h-[500px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-800 rounded-3xl p-8 lg:p-12 border border-slate-700 shadow-2xl h-full flex flex-col justify-center"
                >
                  {activeTab === 0 && ( // 홈페이지
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="w-full max-w-lg bg-white rounded-t-xl overflow-hidden shadow-2xl">
                        {/* Browser Header */}
                        <div className="bg-slate-100 p-2 flex gap-1.5 border-b items-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                          <div className="flex-1 ml-2 bg-white h-5 rounded-full text-[10px] text-gray-400 flex items-center px-2">
                            www.dass2025.org
                          </div>
                        </div>

                        {/* Website Content (Auto Scrolling) */}
                        <div className="relative h-[300px] overflow-hidden bg-white">
                          <motion.div
                            animate={{ y: [0, -180, 0] }} // Scroll animation
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                            className="p-4 space-y-6"
                          >
                            {/* Hero Banner */}
                            <div className="bg-slate-900 rounded-xl p-6 text-white text-center">
                              <div className="text-xs font-bold text-yellow-400 mb-2">2025 DASS</div>
                              <div className="text-lg font-bold mb-2">의료계의 미래를 만나다</div>
                              <div className="inline-block px-3 py-1 bg-blue-600 rounded-full text-[10px]">사전등록 신청하기</div>
                            </div>

                            {/* Speakers Section */}
                            <div className="space-y-3">
                              <div className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                <Users className="w-4 h-4" /> 초청 연자
                              </div>
                              <div className="flex gap-3 overflow-hidden">
                                {[1, 2, 3].map(i => (
                                  <div key={i} className="flex-shrink-0 w-24 bg-gray-50 rounded-lg p-2 text-center border border-gray-100">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full mx-auto mb-2" />
                                    <div className="text-[10px] font-bold">Dr. Kim</div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Location Section */}
                            <div className="space-y-2">
                              <div className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> 오시는 길
                              </div>
                              <div className="w-full h-20 bg-blue-50 rounded-lg flex items-center justify-center text-blue-300 text-xs border border-blue-100">
                                MAP VIEW
                              </div>
                            </div>
                          </motion.div>

                          {/* Scroll Overlay Gradient */}
                          <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                        </div>
                      </div>
                      <div className="mt-6 text-center">
                        <h3 className="text-2xl font-bold mb-2">완벽한 정보 전달</h3>
                        <p className="text-slate-400 mb-4">연자 소개부터 오시는 길까지, 행사 정보를 한눈에.</p>
                        <a
                          href="http://dass.co.kr"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-full text-sm font-bold transition-colors"
                        >
                          사례 보기 <ArrowRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}

                  {activeTab === 1 && ( // E-Book (Auto Scrolling)
                    <div className="flex flex-col items-center">
                      <div className="relative w-56 h-[380px] bg-slate-900 rounded-[2.5rem] border-[6px] border-slate-700 shadow-xl overflow-hidden">
                        <motion.div
                          className="absolute top-0 w-full bg-white text-slate-900 pb-10"
                          animate={{ y: [0, -200, 0] }} // Scrolling animation
                          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <div className="bg-yellow-400 p-6 pt-10 rounded-b-3xl mb-4">
                            <div className="font-bold text-lg">학술 프로그램</div>
                            <div className="text-xs opacity-70">2025 DASS</div>
                          </div>
                          <div className="px-4 space-y-3">
                            {sessionData.map((session, i) => (
                              <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100 shadow-sm">
                                <div className="text-xs text-yellow-600 font-bold">{session.time}</div>
                                <div className="font-bold text-xs mb-1">{session.title}</div>
                                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                  <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                                  {session.speaker}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-slate-900 rounded-b-xl z-20" />
                      </div>
                      <div className="mt-8 text-center">
                        <h3 className="text-2xl font-bold mb-2">스마트 E-BOOK</h3>
                        <p className="text-slate-400 mb-4">자동 스크롤, 검색 기능이 포함된 모바일 자료집</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 2 && ( // Smart QR Registration
                    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
                      <div className="grid grid-cols-2 gap-4 w-full mb-6">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                          className="bg-slate-700/50 p-6 rounded-2xl border border-slate-600"
                        >
                          <div className="text-slate-400 text-xs mb-1">총 등록</div>
                          <div className="text-3xl font-bold text-yellow-400"><Counter from={0} to={1231} duration={1} />명</div>
                        </motion.div>
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
                          className="bg-slate-700/50 p-6 rounded-2xl border border-slate-600"
                        >
                          <div className="text-slate-400 text-xs mb-1">납부 완료</div>
                          <div className="text-3xl font-bold text-green-400"><Counter from={0} to={1145} duration={1} />명</div>
                        </motion.div>
                      </div>
                      <div className="w-full bg-slate-700/50 p-6 rounded-2xl border border-slate-600">
                        <div className="text-sm font-bold mb-4 flex items-center gap-2">
                          <QrCode className="w-4 h-4 text-yellow-400" />
                          실시간 QR 입장/등록 현황
                        </div>
                        <div className="flex items-end gap-2 h-32 w-full justify-between">
                          {[30, 45, 35, 60, 80, 70, 95].map((h, i) => (
                            <motion.div
                              key={i}
                              initial={{ height: 0 }}
                              animate={{ height: `${h}%` }}
                              transition={{ delay: i * 0.1, type: "spring" }}
                              className="w-full bg-yellow-400 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                            />
                          ))}
                        </div>
                      </div>
                      <div className="mt-6 text-center">
                        <h3 className="text-2xl font-bold mb-2">실시간 통합 관리</h3>
                        <p className="text-slate-400">QR 태깅으로 집계된 입장 현황을 실시간으로 확인하세요.</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 3 && ( // Kakao AlimTalk
                    <div className="flex flex-col items-center justify-center">
                      <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-[#FAE100] text-slate-900 p-6 rounded-3xl shadow-2xl max-w-sm w-full relative"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <MessageCircle className="w-6 h-6" />
                          <span className="font-bold">알림톡 도착</span>
                        </div>
                        <div className="bg-white p-4 rounded-xl text-sm shadow-inner">
                          <p className="font-bold mb-2">[등록 완료 안내]</p>
                          <p className="mb-4 text-xs text-gray-600">홍길동님, 등록이 완료되었습니다.<br />QR코드로 입장해주세요.</p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="w-full py-2 bg-slate-100 rounded-lg text-xs font-bold hover:bg-slate-200"
                          >
                            입장 QR코드 보기
                          </motion.button>
                        </div>
                        <motion.div
                          className="absolute -right-4 top-1/2 bg-white p-2 rounded-xl shadow-lg"
                          animate={{ x: [0, 10, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <QrCode className="w-12 h-12" />
                        </motion.div>
                      </motion.div>
                      <div className="mt-8 text-center">
                        <h3 className="text-2xl font-bold mb-2">카카오 알림톡 자동 발송</h3>
                        <p className="text-slate-400">등록 확인부터 QR 입장권까지 카카오톡으로 한 번에.</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 4 && ( // AI Chatbot
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="w-full max-w-sm bg-[#bacee0] rounded-3xl shadow-2xl overflow-hidden border-4 border-slate-700 h-[450px] relative">
                        <div className="bg-[#A9BDCE] p-3 flex items-center gap-2 text-slate-800 text-sm font-bold border-b border-black/5">
                          <Bot className="w-5 h-5" />
                          2025 DASS 챗봇
                        </div>
                        <div className="p-4 space-y-4 h-full overflow-y-auto pb-16">
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex justify-end"
                          >
                            <div className="bg-[#FEE500] text-slate-900 p-3 rounded-l-xl rounded-br-xl text-xs max-w-[80%] shadow-sm">
                              이번 학술대회 장소가 어디야?
                            </div>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1 }}
                            className="flex justify-start gap-2"
                          >
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                              <Bot className="w-5 h-5 text-slate-600" />
                            </div>
                            <div className="bg-white text-slate-900 p-3 rounded-r-xl rounded-bl-xl text-xs max-w-[80%] shadow-sm">
                              대전 신협중앙회 3층 대강당입니다.
                              <br />오시는 길 안내를 보내드릴까요?
                            </div>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 2.5 }}
                            className="flex justify-end"
                          >
                            <div className="bg-[#FEE500] text-slate-900 p-3 rounded-l-xl rounded-br-xl text-xs max-w-[80%] shadow-sm">
                              응, 보내줘.
                            </div>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 3.5 }}
                            className="flex justify-start gap-2"
                          >
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                              <Bot className="w-5 h-5 text-slate-600" />
                            </div>
                            <div className="bg-white p-2 rounded-r-xl rounded-bl-xl text-xs max-w-[80%] shadow-sm">
                              <div className="bg-slate-100 h-24 rounded-lg mb-2 flex items-center justify-center text-slate-400">
                                <MapPin className="w-6 h-6" />
                              </div>
                              <div className="font-bold">대전 신협중앙회</div>
                              <div className="text-gray-500 text-[10px] mb-2">대전광역시 서구 둔산동 123-4</div>
                              <button className="w-full bg-slate-100 py-1.5 rounded text-center text-[10px] font-bold hover:bg-slate-200">길찾기</button>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                      <div className="mt-6 text-center">
                        <h3 className="text-2xl font-bold mb-2">24시간 AI 응대</h3>
                        <p className="text-slate-400">장소, 일정, 주차 등 반복되는 문의는 AI가 즉시 해결합니다.</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 5 && ( // Smart Raffle
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="w-full max-w-lg bg-slate-900 rounded-3xl shadow-2xl border-4 border-yellow-400 p-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                        <div className="relative z-10 text-center">
                          <div className="text-yellow-400 font-bold text-xl mb-6 animate-pulse">2025 DASS 경품 추첨</div>
                          <div className="bg-white text-slate-900 rounded-xl p-6 mb-6 h-32 flex items-center justify-center overflow-hidden border-4 border-slate-700">
                            <motion.div
                              animate={{ y: ["0%", "-100%"] }}
                              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                              className="text-2xl font-bold space-y-4"
                            >
                              {infiniteRaffleNames.map((item, i) => (
                                <div key={i} className="h-8">{item}</div>
                              ))}
                            </motion.div>
                            {/* Winner Overlay Animation (Simulated) */}
                            <motion.div
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: [0, 0, 1], scale: [0.5, 0.5, 1.1] }}
                              transition={{ duration: 4, times: [0, 0.8, 1] }}
                              className="absolute inset-0 bg-yellow-400 flex flex-col items-center justify-center text-slate-900 shadow-lg border-4 border-slate-900"
                            >
                              <div className="text-lg font-bold mb-1">당첨을 축하합니다.</div>
                              <div className="text-3xl font-extrabold">홍길동</div>
                              <div className="text-sm font-normal mt-1">29552</div>
                            </motion.div>
                          </div>
                          <div className="flex gap-2 justify-center">
                            <button className="bg-red-500 text-white px-6 py-2 rounded-full font-bold shadow-lg border-b-4 border-red-700 active:border-b-0 active:translate-y-1">추첨 시작</button>
                            <button className="bg-blue-500 text-white px-6 py-2 rounded-full font-bold shadow-lg border-b-4 border-blue-700 active:border-b-0 active:translate-y-1">결과 저장</button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 text-center">
                        <h3 className="text-2xl font-bold mb-2">공정한 스마트 추첨</h3>
                        <p className="text-slate-400">QR 입장객 데이터와 연동되어 현장 참석자만을 대상으로 즉시 추첨합니다.</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Section with Parallax Cards Effect */}
      <section id="section-1" className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">검증된 성공 사례</h2>
              <p className="text-gray-600">서티라이프와 함께한 학술대회의 실제 성과를 확인하세요.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={prevCase}
                className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-slate-600" />
              </button>
              <button
                onClick={nextCase}
                className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-slate-600" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400/20 blur-3xl -z-10 rounded-full w-2/3 mx-auto" />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCase}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid lg:grid-cols-2 gap-12 items-center bg-white rounded-[3rem] p-8 lg:p-12 shadow-2xl border border-white/50 backdrop-blur-sm"
              >
                <div className="space-y-8">
                  <div className="inline-block bg-slate-900 text-yellow-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider">
                    CASE STUDY
                  </div>
                  <h3 className="text-4xl font-extrabold text-slate-900 leading-tight">
                    {caseStudies[activeCase].title}
                    {caseStudies[activeCase].titleSuffix && (
                      <span className="text-lg text-slate-500 font-normal ml-2 block md:inline mt-1 md:mt-0">
                        {caseStudies[activeCase].titleSuffix}
                      </span>
                    )}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500 text-2xl block mt-2">
                      {caseStudies[activeCase].subtitle}
                    </span>
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {caseStudies[activeCase].description}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {caseStudies[activeCase].stats.map((stat, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center"
                      >
                        <div className="text-3xl font-extrabold text-slate-900 mb-1">
                          <Counter from={0} to={stat.val} />{stat.unit}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="relative h-[400px] flex items-center justify-center">
                  {/* Animated Stacked Cards */}
                  <motion.div
                    animate={{ rotate: [3, 5, 3] }}
                    transition={{ repeat: Infinity, duration: 6 }}
                    className="absolute w-full h-full bg-yellow-100 rounded-3xl border border-yellow-200 z-0 top-4 right-4"
                  />
                  <div className="relative z-10 bg-slate-900 text-white p-8 rounded-3xl shadow-2xl w-full h-full flex flex-col justify-between overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500 rounded-full blur-[80px] opacity-20 pointer-events-none" />

                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <Award className="w-12 h-12 text-yellow-400 mb-4" />
                        <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs">{caseStudies[activeCase].badge}</div>
                      </div>
                      <h4 className="text-2xl font-bold mb-2">{caseStudies[activeCase].awardTitle}</h4>
                      <p className="text-slate-400 text-sm">{caseStudies[activeCase].awardDesc}</p>
                    </div>

                    <div className="space-y-3">
                      {caseStudies[activeCase].checkpoints.map((point, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <CheckCircle2 className="text-green-400 w-5 h-5" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>

                    <a
                      href={caseStudies[activeCase].buttonLink}
                      target={caseStudies[activeCase].buttonLink !== "#" ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className="w-full mt-6 bg-yellow-400 text-slate-900 py-3 rounded-xl font-bold text-sm hover:bg-yellow-300 transition-colors block text-center"
                    >
                      {caseStudies[activeCase].buttonText}
                    </a>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="section-2" className="py-24 bg-yellow-400 text-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" }}
          >
            <h2 className="text-4xl lg:text-6xl font-extrabold mb-6 tracking-tight">준비되셨나요?</h2>
            <p className="text-slate-800 text-xl mb-12 max-w-2xl mx-auto font-medium">
              서티라이프와 함께라면,<br />당신의 학술대회는 완벽해질 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="https://certi.life/#contact"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:bg-slate-800 transition-colors cursor-pointer inline-block"
              >
                무료 상담 신청하기
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Changed to Grid for absolute centering */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center md:text-left">
            <div className="text-2xl font-bold text-white">CertiLife</div>
            <div className="md:text-center">
              <a href="https://certi.life" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors text-sm font-medium">
                서티라이프 홈페이지
              </a>
            </div>
            <div className="text-xs text-slate-500 md:text-right">
              © 2025 CertiLife Inc. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;