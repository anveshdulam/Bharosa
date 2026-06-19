import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Lock, Clock, IndianRupee, Heart, Shield, Eye, Users, Brain,
  ChevronRight, ChevronLeft, Star, ArrowRight, CheckCircle, Phone,
  Calendar, MessageCircle, Stethoscope, TrendingUp, Leaf, Menu, X
} from 'lucide-react';

// ─────────────────────────────────────────────
//  UTILITY: Smooth scroll to section
// ─────────────────────────────────────────────
const smoothScrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// ─────────────────────────────────────────────
//  UTILITY: Animated Section Reveal
// ─────────────────────────────────────────────
const FadeInSection = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─────────────────────────────────────────────
//  UTILITY: Tactile Motion Button
// ─────────────────────────────────────────────
const TactileButton = ({
  as: Tag = 'button',
  children,
  glowColor = 'rgba(20,50,42,0.35)',
  className = '',
  onClick,
  href,
  style = {},
  ...rest
}) => {
  const [hovered, setHovered] = useState(false);

  const props = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { type: 'spring', stiffness: 400, damping: 22 },
    onHoverStart: () => setHovered(true),
    onHoverEnd: () => setHovered(false),
    onClick,
    className,
    style: {
      ...style,
      boxShadow: hovered ? `0 0 28px 4px ${glowColor}` : '0 0 0px 0px transparent',
      transition: 'box-shadow 0.3s ease',
    },
    ...rest,
  };

  if (Tag === 'a') {
    return <motion.a href={href} {...props}>{children}</motion.a>;
  }
  return <motion.button {...props}>{children}</motion.button>;
};

// ─────────────────────────────────────────────
//  COMPONENT: Background Blobs
// ─────────────────────────────────────────────
const BackgroundBlobs = ({ dark = false }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div className={`blob-1 absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl ${dark ? 'bg-green-900' : 'bg-[#C25B3D]/20'}`} />
    <div className={`blob-2 absolute top-1/2 -right-40 w-[400px] h-[400px] rounded-full opacity-25 blur-3xl ${dark ? 'bg-[#DE9F3D]/20' : 'bg-[#DE9F3D]/30'}`} />
    <div className={`blob-3 absolute -bottom-24 left-1/3 w-[350px] h-[350px] rounded-full opacity-20 blur-3xl ${dark ? 'bg-emerald-800' : 'bg-[#14322A]/20'}`} />
  </div>
);

// ─────────────────────────────────────────────
//  COMPONENT: 3D Tilt Card Wrapper
// ─────────────────────────────────────────────
const TiltCard = ({ children, className = '' }) => {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouse = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={cardRef}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─────────────────────────────────────────────
//  COMPONENT: Flip Card (Problem Section)
// ─────────────────────────────────────────────
const FlipCard = ({ icon: Icon, title, barrier, solution, color }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className="h-64 cursor-pointer"
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped(f => !f)}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 glass rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-white/20 shadow-lg"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: color + '22' }}>
            <Icon size={26} style={{ color }} />
          </div>
          <h3 className="section-heading text-[#14322A] text-xl font-semibold mb-2">{title}</h3>
          <p className="text-[#14322A]/60 text-sm">{barrier}</p>
          <span className="mt-4 text-xs text-[#14322A]/40 uppercase tracking-widest">Hover to see solution</span>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xl"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'linear-gradient(135deg, #14322A, #1a4035)' }}
        >
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
            <CheckCircle size={22} className="text-[#DE9F3D]" />
          </div>
          <h4 className="text-white font-bold text-lg section-heading mb-2">How Bharosa Helps</h4>
          <p className="text-white/80 text-sm leading-relaxed">{solution}</p>
        </div>
      </motion.div>
    </div>
  );
};

// ─────────────────────────────────────────────
//  COMPONENT: Check-In Inner Widget
// ─────────────────────────────────────────────
const CheckInInner = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState(null);

  const options = [
    {
      id: 'fear', icon: '😰', label: 'Fear of the result',
      response: "That fear is valid — and incredibly common. The thing is, knowing is almost always less scary than not knowing. Start with a simple, no-commitment check-in. Just two minutes. No diagnosis, just a conversation.",
      actions: [{ label: 'Read real stories', href: '#stories' }, { label: 'Start anonymous chat', href: '#solutions' }],
    },
    {
      id: 'judgment', icon: '👁️', label: 'Fear of judgment',
      response: "You deserve care without an audience. Bharosa's Faceless Booking means no waiting rooms where someone might recognise you. Your name stays hidden until you choose to share it.",
      actions: [{ label: 'See Faceless Booking', href: '#solutions' }, { label: 'Check anonymous options', href: '#checkin' }],
    },
    {
      id: 'time', icon: '⏰', label: "I don't have time",
      response: "We built this for you. The whole check-in takes under 2 minutes. We'll give you one small step — not a week-long health plan. Healthcare doesn't have to be a project.",
      actions: [{ label: 'Take 2-min check-in', href: '#checkin' }, { label: 'Schedule a 5-min call', href: '#solutions' }],
    },
    {
      id: 'cost', icon: '💸', label: 'Cost worries',
      response: "Healthcare doesn't have to drain you. We'll show you government schemes (PMJAY, ESI, Jan Aushadhi) that you likely qualify for — often making your visit ₹0. Knowing the cost upfront means no nasty surprises.",
      actions: [{ label: 'Check subsidized prices', href: '#solutions' }, { label: 'See free schemes', href: '#solutions' }],
    },
  ];

  const progress = step === 1 ? 40 : 100;
  const currentOption = options.find(o => o.id === selected);

  return (
    <>
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-white/40 mb-2">
          <span>Your progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full shimmer"
            initial={{ width: '10%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="section-heading text-2xl font-bold text-white mb-2">What's holding you back?</h3>
            <p className="text-white/50 text-sm mb-8">Choose what resonates most. There's no wrong answer.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {options.map((opt) => (
                <TactileButton
                  key={opt.id}
                  glowColor="rgba(222,159,61,0.25)"
                  className="flex items-center gap-3 rounded-xl px-4 py-4 text-left w-full"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onClick={() => { setSelected(opt.id); setStep(2); }}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <span className="text-white/80 text-sm font-medium leading-snug">{opt.label}</span>
                </TactileButton>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && currentOption && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">{currentOption.icon}</span>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest">You selected</p>
                <p className="text-white font-semibold">{currentOption.label}</p>
              </div>
            </div>
            <div className="rounded-2xl p-5 mb-6" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="text-white/85 text-base leading-relaxed">{currentOption.response}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              {currentOption.actions.map((action, i) => (
                <TactileButton
                  key={i}
                  as="a"
                  href={action.href}
                  glowColor={i === 0 ? 'rgba(222,159,61,0.5)' : 'rgba(255,255,255,0.2)'}
                  className={`flex-1 text-center px-5 py-3 rounded-full font-medium text-sm ${
                    i === 0 ? 'bg-[#DE9F3D] text-[#14322A]' : 'text-white'
                  }`}
                  style={i !== 0 ? { border: '1px solid rgba(255,255,255,0.2)' } : {}}
                  onClick={onClose}
                >
                  {action.label}
                </TactileButton>
              ))}
            </div>
            <TactileButton
              className="text-white/30 text-xs underline underline-offset-2 hover:text-white/60 transition-colors"
              glowColor="transparent"
              onClick={() => { setStep(1); setSelected(null); }}
            >
              ← Start over
            </TactileButton>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ─────────────────────────────────────────────
//  COMPONENT: Glassmorphic Check-In Modal
// ─────────────────────────────────────────────
const CheckInModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed inset-0 z-[100] cursor-pointer"
            style={{
              background: 'rgba(9,24,16,0.72)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            onClick={onClose}
          />

          {/* Modal Panel */}
          <motion.div
            key="modal-panel"
            role="dialog"
            aria-modal="true"
            aria-label="2-Minute Check-In"
            initial={{ opacity: 0, scale: 0.82, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22, bounce: 0.4 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto pointer-events-auto rounded-3xl p-8 md:p-10 shadow-2xl"
              style={{
                background: 'rgba(14, 42, 34, 0.82)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-[#DE9F3D] uppercase tracking-widest text-xs font-semibold mb-1">The First Step</p>
                  <h2 className="section-heading text-3xl font-bold text-white">2-Minute Check-In</h2>
                  <p className="text-white/45 text-sm mt-1">No sign-up. No judgment. Just one honest question.</p>
                </div>
                <TactileButton
                  glowColor="rgba(255,255,255,0.15)"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white/50 hover:text-white ml-4 flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                  onClick={onClose}
                  aria-label="Close"
                >
                  <X size={18} />
                </TactileButton>
              </div>
              <CheckInInner onClose={onClose} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ─────────────────────────────────────────────
//  COMPONENT: Navbar
// ─────────────────────────────────────────────
const Navbar = ({ onOpenModal }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { id: 'problem', label: 'The Problem' },
    { id: 'solutions', label: 'Solutions' },
    { id: 'checkin', label: 'Check-In' },
    { id: 'stories', label: 'Stories' },
    { id: 'howitworks', label: 'How it Works' },
  ];

  const handleNavClick = (id) => {
    setMenuOpen(false);
    if (id === 'checkin') {
      onOpenModal();
    } else {
      smoothScrollTo(id);
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={scrolled ? {
        background: 'rgba(247,240,228,0.78)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.3)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.06)',
      } : {}}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => smoothScrollTo('hero')}
          className="section-heading text-2xl font-bold text-[#14322A] flex items-center gap-2 cursor-pointer"
        >
          <span className="w-8 h-8 bg-[#14322A] rounded-lg flex items-center justify-center">
            <Heart size={16} className="text-[#DE9F3D]" fill="#DE9F3D" />
          </span>
          Bharosa
        </button>

        <ul className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <li key={l.id}>
              <TactileButton
                glowColor="rgba(194,91,61,0.2)"
                className="text-[#14322A]/70 hover:text-[#C25B3D] text-sm font-medium transition-colors duration-200 bg-transparent border-0 cursor-pointer px-2 py-1 rounded-lg"
                onClick={() => handleNavClick(l.id)}
              >
                {l.label}
              </TactileButton>
            </li>
          ))}
        </ul>

        <TactileButton
          glowColor="rgba(20,50,42,0.35)"
          className="hidden md:inline-flex items-center gap-2 bg-[#14322A] text-[#F7F0E4] px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#1a4035] transition-colors duration-200"
          onClick={onOpenModal}
        >
          Start Anonymously <ArrowRight size={14} />
        </TactileButton>

        <TactileButton
          glowColor="transparent"
          className="md:hidden text-[#14322A]"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </TactileButton>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden px-6 py-4 border-t border-[#14322A]/10"
            style={{ background: 'rgba(247,240,228,0.96)', backdropFilter: 'blur(20px)' }}
          >
            {links.map(l => (
              <TactileButton
                key={l.id}
                glowColor="rgba(194,91,61,0.2)"
                className="block w-full text-left py-2.5 text-[#14322A] font-medium hover:text-[#C25B3D] transition-colors"
                onClick={() => handleNavClick(l.id)}
              >
                {l.label}
              </TactileButton>
            ))}
            <TactileButton
              glowColor="rgba(20,50,42,0.35)"
              className="mt-3 inline-block bg-[#14322A] text-[#F7F0E4] px-5 py-2.5 rounded-full text-sm font-medium"
              onClick={() => { setMenuOpen(false); onOpenModal(); }}
            >
              Start Anonymously
            </TactileButton>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// ─────────────────────────────────────────────
//  SECTION 1: Hero
// ─────────────────────────────────────────────
const HeroSection = ({ onOpenModal }) => {
  const chips = [
    { icon: '🔒', text: '100% Anonymous', pos: 'top-36 left-4 md:left-20', rot: '-3deg', delay: 0 },
    { icon: '₹', text: '₹0 to Start', pos: 'top-28 right-4 md:right-24', rot: '2deg', delay: 1.5 },
    { icon: '⏱', text: '2 Min Check-In', pos: 'bottom-40 left-1/2 -translate-x-1/2', rot: '-1.5deg', delay: 3 },
  ];

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#F7F0E4] pt-24 pb-16">
      <BackgroundBlobs />
      {chips.map((c, i) => (
        <motion.div
          key={i}
          className={`absolute z-10 ${c.pos}`}
          style={{ rotate: c.rot }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5 + i, repeat: Infinity, delay: c.delay, ease: 'easeInOut' }}
        >
          <div
            className="rounded-full px-4 py-2 flex items-center gap-2 shadow-md text-sm font-medium text-[#14322A]"
            style={{ background: 'rgba(247,240,228,0.75)', backdropFilter: 'blur(20px)', border: '1px solid rgba(247,240,228,0.6)' }}
          >
            <span className="text-base">{c.icon}</span>
            <span>{c.text}</span>
          </div>
        </motion.div>
      ))}

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 text-xs font-medium text-[#14322A]/70 uppercase tracking-widest"
          style={{ background: 'rgba(20,50,42,0.06)', border: '1px solid rgba(20,50,42,0.12)' }}
        >
          <span className="w-2 h-2 rounded-full bg-[#C25B3D] animate-pulse" />
          DesignVerse 2026 — Healthcare for All
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="section-heading text-5xl md:text-7xl font-bold text-[#14322A] leading-tight mb-6"
        >
          Your health can't wait<br />
          <em className="text-[#C25B3D] not-italic">for you to feel brave.</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-[#14322A]/65 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12"
        >
          Bharosa is a judgment-free first step toward healthcare — anonymous, affordable,
          and paced to how you actually feel.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <TactileButton
            glowColor="rgba(20,50,42,0.4)"
            className="group flex items-center gap-2 bg-[#14322A] text-[#F7F0E4] px-8 py-4 rounded-full font-medium text-base hover:bg-[#1a4035] transition-colors duration-200"
            onClick={onOpenModal}
          >
            Take the 2-Minute Check-In
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </TactileButton>

          <TactileButton
            glowColor="rgba(194,91,61,0.2)"
            className="flex items-center gap-2 text-[#14322A] px-8 py-4 rounded-full font-medium text-base hover:bg-[#14322A]/5 transition-all duration-200"
            style={{ border: '1px solid rgba(20,50,42,0.25)' }}
            onClick={() => smoothScrollTo('problem')}
          >
            See the real problem
          </TactileButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-20 flex flex-col items-center gap-1 text-[#14322A]/40"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
            className="w-0.5 h-8 bg-[#14322A]/20 rounded-full"
          />
        </motion.div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
//  SECTION 2: Stats Band
// ─────────────────────────────────────────────
const StatsBand = () => {
  const stats = [
    { value: '72%', label: 'avoid care due to fear' },
    { value: '3×', label: 'more likely to delay due to stigma' },
    { value: '< 2 min', label: 'to get your first step' },
    { value: '₹0', label: 'to start' },
  ];
  return (
    <section className="bg-[#14322A] py-14 overflow-hidden relative">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      <FadeInSection>
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="section-heading text-4xl md:text-5xl font-bold text-[#DE9F3D] mb-2">{s.value}</p>
              <p className="text-white/60 text-sm leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
      </FadeInSection>
    </section>
  );
};

// ─────────────────────────────────────────────
//  SECTION 3: The Problem
// ─────────────────────────────────────────────
const ProblemSection = () => {
  const barriers = [
    { icon: Brain, title: 'Fear of Diagnosis', barrier: '"What if the news is bad? I\'d rather not know."', solution: 'We start with compassionate check-ins, not tests. Small, low-stakes steps that let you decide how far to go.', color: '#C25B3D' },
    { icon: Eye, title: 'Social Stigma', barrier: '"What will people think if they see me at a clinic?"', solution: 'Faceless Booking hides your identity. Only the doctor sees what matters. No waiting-room judgment.', color: '#14322A' },
    { icon: Users, title: 'Masculinity Norms', barrier: '"Men shouldn\'t complain about their bodies."', solution: 'Seeking care is strength. Our language reframes vulnerability as courage — no shame, only action.', color: '#DE9F3D' },
    { icon: IndianRupee, title: 'Cost Concerns', barrier: '"I can\'t afford consultations or tests."', solution: 'Upfront Cost Clarity shows all prices before you commit, plus free government schemes you qualify for.', color: '#C25B3D' },
    { icon: Clock, title: 'Lack of Time', barrier: '"Clinics take half a day. I just can\'t manage it."', solution: '2-minute check-ins and micro-step plans designed around your schedule, not a clinic\'s.', color: '#14322A' },
    { icon: Shield, title: 'Denial & Uncertainty', barrier: '"It\'s probably nothing. I\'ll deal with it later."', solution: 'Non-alarmist nudges and progress tracking gently guide you from denial to action at your own pace.', color: '#DE9F3D' },
  ];

  return (
    <section id="problem" className="py-24 relative bg-[#F7F0E4] overflow-hidden">
      <BackgroundBlobs />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <FadeInSection className="text-center mb-16">
          <p className="text-[#C25B3D] uppercase tracking-widest text-xs font-semibold mb-3">The Real Barrier</p>
          <h2 className="section-heading text-4xl md:text-6xl font-bold text-[#14322A] mb-5">
            It was never about<br />the hospitals.
          </h2>
          <p className="text-[#14322A]/60 max-w-xl mx-auto text-lg">
            India has hospitals. India has doctors. What's missing is the first step — and Bharosa exists to make it possible.
          </p>
          <p className="mt-3 text-sm text-[#14322A]/40 italic">Hover a card to see how we solve it.</p>
        </FadeInSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {barriers.map((b, i) => (
            <FadeInSection key={i} delay={i * 0.07}><FlipCard {...b} /></FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
//  SECTION 4: Solutions
// ─────────────────────────────────────────────
const ChatMockup = () => (
  <div className="rounded-2xl p-5 max-w-sm mx-auto shadow-xl" style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.3)' }}>
    <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
      <div className="w-9 h-9 rounded-full bg-[#14322A] flex items-center justify-center flex-shrink-0"><Heart size={14} className="text-[#DE9F3D]" fill="#DE9F3D" /></div>
      <div><p className="text-[#14322A] font-semibold text-sm">Bharosa Support</p><p className="text-[#14322A]/50 text-xs">● Anonymous · Confidential</p></div>
    </div>
    {[
      { from: 'bot', text: 'Hi there. You\'re safe here. What\'s been on your mind about your health lately?' },
      { from: 'user', text: 'I\'ve had chest tightness for a week but I\'m scared of what it might be.' },
      { from: 'bot', text: 'That takes real courage to share. Let\'s take it one small step at a time. No scary tests yet.' },
    ].map((m, i) => (
      <motion.div key={i} initial={{ opacity: 0, x: m.from === 'user' ? 15 : -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} className={`flex mb-3 ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-snug ${m.from === 'user' ? 'bg-[#14322A] text-white rounded-br-sm' : 'bg-white/80 text-[#14322A] rounded-bl-sm'}`}>{m.text}</div>
      </motion.div>
    ))}
  </div>
);

const BookingMockup = () => (
  <div className="rounded-2xl p-5 max-w-sm mx-auto shadow-xl" style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.3)' }}>
    <div className="flex items-center justify-between mb-4">
      <span className="text-[#14322A] font-semibold text-sm section-heading">Appointment Confirmed</span>
      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ Booked</span>
    </div>
    <div className="rounded-xl p-4 space-y-3 bg-white/50">
      {[
        { Icon: Stethoscope, label: 'Doctor', value: 'Dr. Priya Sharma, MBBS' },
        { Icon: Calendar, label: 'Date & Time', value: 'Tomorrow · 10:30 AM' },
        { Icon: Lock, label: 'Your Identity', value: 'Anonymous User #7482 🔒', gold: true },
      ].map(({ Icon, label, value, gold }, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${gold ? 'bg-[#DE9F3D]/20' : 'bg-[#14322A]/10'}`}><Icon size={16} className={gold ? 'text-[#DE9F3D]' : 'text-[#14322A]'} /></div>
          <div><p className="text-xs text-[#14322A]/50">{label}</p><p className="font-medium text-[#14322A] text-sm">{value}</p></div>
        </div>
      ))}
    </div>
    <p className="mt-3 text-xs text-[#14322A]/40 text-center">Your name is never shared until you choose to reveal it.</p>
  </div>
);

const CostMockup = () => (
  <div className="rounded-2xl p-5 max-w-sm mx-auto shadow-xl" style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.3)' }}>
    <p className="text-[#14322A] font-semibold text-sm section-heading mb-4">Upfront Cost Breakdown</p>
    <div className="space-y-2.5 mb-4">
      {[
        { label: 'General Consultation', price: '₹300', tag: null, positive: false },
        { label: 'Blood Pressure Check', price: '₹0', tag: 'Free', positive: false },
        { label: 'Basic Blood Panel', price: '₹480', tag: null, positive: false },
        { label: 'PMJAY Scheme Subsidy', price: '-₹400', tag: 'Gov Scheme', positive: true },
      ].map((item, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="flex items-center justify-between bg-white/50 rounded-lg px-3 py-2">
          <span className="text-[#14322A] text-sm">{item.label}</span>
          <div className="flex items-center gap-2">
            {item.tag && <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.positive ? 'bg-green-100 text-green-700' : 'bg-[#DE9F3D]/20 text-[#b87e28]'}`}>{item.tag}</span>}
            <span className={`font-semibold text-sm ${item.positive ? 'text-green-600' : 'text-[#14322A]'}`}>{item.price}</span>
          </div>
        </motion.div>
      ))}
    </div>
    <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(20,50,42,0.1)' }}>
      <span className="font-semibold text-[#14322A]">Your Total</span>
      <span className="text-2xl font-bold text-[#14322A] section-heading">₹380</span>
    </div>
  </div>
);

const SolutionsSection = ({ onOpenModal }) => {
  const features = [
    { tag: 'No Judgment', title: 'Anonymous\nPre-Consult', desc: 'Talk about what\'s worrying you — no name, no face, no record attached. Our compassionate chat meets you where you are, not where you think you should be.', visual: <ChatMockup />, reverse: false },
    { tag: 'Stay Invisible', title: 'Faceless\nBooking', desc: 'Book real appointments with verified doctors without revealing your identity until you feel ready. Your privacy is the default — transparency is your choice.', visual: <BookingMockup />, reverse: true },
    { tag: 'No Surprise Bills', title: 'Upfront\nCost Clarity', desc: 'See every rupee before you commit. We auto-detect government schemes you qualify for — so cost is never the reason you walk away from your health.', visual: <CostMockup />, reverse: false },
  ];

  return (
    <section id="solutions" className="py-24 bg-[#F7F0E4] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <FadeInSection className="text-center mb-20">
          <p className="text-[#C25B3D] uppercase tracking-widest text-xs font-semibold mb-3">How We Help</p>
          <h2 className="section-heading text-4xl md:text-5xl font-bold text-[#14322A]">Solutions built around<br />real hesitation.</h2>
        </FadeInSection>
        <div className="space-y-28">
          {features.map((f, i) => (
            <FadeInSection key={i} delay={0.1}>
              <div className={`flex flex-col ${f.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-20`}>
                <div className="flex-1 text-center md:text-left">
                  <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#C25B3D] bg-[#C25B3D]/10 px-3 py-1 rounded-full mb-4">{f.tag}</span>
                  <h3 className="section-heading text-3xl md:text-5xl font-bold text-[#14322A] whitespace-pre-line mb-5 leading-tight">{f.title}</h3>
                  <p className="text-[#14322A]/65 text-lg leading-relaxed max-w-md">{f.desc}</p>
                  <TactileButton
                    glowColor="rgba(194,91,61,0.2)"
                    className="mt-6 inline-flex items-center gap-2 text-[#14322A] font-medium text-sm hover:text-[#C25B3D] transition-colors group bg-transparent border-0"
                    onClick={onOpenModal}
                  >
                    Try it now <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </TactileButton>
                </div>
                <div className="flex-1 w-full"><TiltCard>{f.visual}</TiltCard></div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
//  SECTION 5: Check-In anchor section
// ─────────────────────────────────────────────
const CheckInSection = ({ onOpenModal }) => (
  <section id="checkin" className="py-24 bg-[#14322A] relative overflow-hidden">
    <BackgroundBlobs dark />
    <div className="max-w-2xl mx-auto px-6 relative z-10">
      <FadeInSection className="text-center mb-12">
        <p className="text-[#DE9F3D] uppercase tracking-widest text-xs font-semibold mb-3">The First Step</p>
        <h2 className="section-heading text-4xl md:text-5xl font-bold text-white mb-4">The 2-Minute Check-In</h2>
        <p className="text-white/55 text-base">No sign-up. No judgment. Just one honest question.</p>
      </FadeInSection>

      <TiltCard>
        <div className="rounded-3xl p-10 shadow-2xl text-center" style={{ background: 'rgba(20,50,42,0.55)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(222,159,61,0.15)', border: '1px solid rgba(222,159,61,0.3)' }}>
            <Heart size={32} className="text-[#DE9F3D]" />
          </div>
          <h3 className="section-heading text-2xl font-bold text-white mb-3">What's holding you back?</h3>
          <p className="text-white/55 text-base mb-8 max-w-xs mx-auto">A 2-minute, judgment-free check-in. We'll meet you exactly where you are.</p>
          <TactileButton
            glowColor="rgba(222,159,61,0.5)"
            className="inline-flex items-center gap-2 bg-[#DE9F3D] text-[#14322A] px-8 py-4 rounded-full font-semibold text-base hover:bg-[#f0b85a] transition-colors duration-200"
            onClick={onOpenModal}
          >
            Begin Check-In <ChevronRight size={18} />
          </TactileButton>
          <p className="text-white/25 text-xs mt-5">Your answers are never stored or shared. Ever.</p>
        </div>
      </TiltCard>
    </div>
  </section>
);

// ─────────────────────────────────────────────
//  SECTION 6: Stories
// ─────────────────────────────────────────────
const StoriesSection = () => {
  const stories = [
    { quote: "I thought men weren't supposed to worry about this stuff. Bharosa was the first place that didn't make me feel weak for caring about my health.", name: "Anonymous, Male, 34", city: "Pune", tag: "Masculinity Norms" },
    { quote: "The cost clarity feature showed me I'd actually pay ₹0 for my checkup under a government scheme I didn't even know existed. That changed everything.", name: "Anonymous, Female, 29", city: "Kolkata", tag: "Cost Concerns" },
    { quote: "I'd been ignoring a lump for 6 months. The 2-minute check-in made it feel small enough to actually do. Three weeks later, caught early. Treatment was simple.", name: "Anonymous, Male, 47", city: "Chennai", tag: "Fear of Diagnosis" },
    { quote: "With faceless booking, no one in my family even needed to know. It was my health, my choice.", name: "Anonymous, Female, 38", city: "Lucknow", tag: "Social Stigma" },
    { quote: "I'm a daily wage worker. I can't afford a half-day off. The 2-minute check-in told me which clinic had morning slots and what I'd actually pay.", name: "Anonymous, Male, 26", city: "Jaipur", tag: "Lack of Time" },
  ];

  const [current, setCurrent] = useState(0);
  const total = stories.length;

  return (
    <section id="stories" className="py-24 bg-[#0d2219] relative overflow-hidden">
      <BackgroundBlobs dark />
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <FadeInSection className="text-center mb-16">
          <p className="text-[#DE9F3D] uppercase tracking-widest text-xs font-semibold mb-3">Real Voices</p>
          <h2 className="section-heading text-4xl md:text-5xl font-bold text-white mb-4">Stories that started<br />with one small step.</h2>
          <p className="text-white/40 text-base">All names and details are anonymous by consent.</p>
        </FadeInSection>

        <div className="flex justify-center gap-1 mb-8">
          {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#DE9F3D" className="text-[#DE9F3D]" />)}
        </div>

        <div className="overflow-hidden min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <span className="inline-block mb-6 text-xs font-semibold uppercase tracking-widest text-[#DE9F3D] px-3 py-1 rounded-full" style={{ background: 'rgba(222,159,61,0.15)' }}>
                {stories[current].tag}
              </span>
              <blockquote className="section-heading text-2xl md:text-3xl text-white font-medium italic leading-snug mb-8 max-w-3xl mx-auto">
                "{stories[current].quote}"
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><Shield size={18} className="text-white/40" /></div>
                <div className="text-left">
                  <p className="text-white/80 text-sm font-medium">{stories[current].name}</p>
                  <p className="text-white/35 text-xs">{stories[current].city}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-6 mt-12">
          <TactileButton
            glowColor="rgba(255,255,255,0.15)"
            className="w-12 h-12 rounded-full flex items-center justify-center text-white"
            style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
            onClick={() => setCurrent(c => (c - 1 + total) % total)}
          >
            <ChevronLeft size={20} />
          </TactileButton>

          <div className="flex gap-2 items-center">
            {stories.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setCurrent(i)}
                className="rounded-full"
                animate={{ width: i === current ? 28 : 8, background: i === current ? '#DE9F3D' : 'rgba(255,255,255,0.25)' }}
                style={{ height: 8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                aria-label={`Story ${i + 1}`}
              />
            ))}
          </div>

          <TactileButton
            glowColor="rgba(255,255,255,0.15)"
            className="w-12 h-12 rounded-full flex items-center justify-center text-white"
            style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
            onClick={() => setCurrent(c => (c + 1) % total)}
          >
            <ChevronRight size={20} />
          </TactileButton>
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
//  SECTION 7: How It Works + Impact
// ─────────────────────────────────────────────
const HowItWorksSection = () => {
  const steps = [
    { num: '01', icon: Lock, title: 'Check in anonymously', desc: 'No account, no name, no phone number. Just open the app and begin.' },
    { num: '02', icon: MessageCircle, title: "Tell us what's stopping you", desc: 'Select your barrier. Our system personalises the next step just for you.' },
    { num: '03', icon: ArrowRight, title: 'Get a step sized to you', desc: 'Not a 10-point plan — just one actionable, low-effort next move.' },
    { num: '04', icon: Heart, title: 'Move at your own pace', desc: "No reminders you didn't ask for. Come back when you're ready. We'll be here." },
  ];

  const impact = [
    { icon: TrendingUp, title: 'Early Detection', desc: 'Catch conditions before they become crises. Our check-ins flag risk factors and guide timely consultations.', bg: 'linear-gradient(135deg, #C25B3D, #a04830)' },
    { icon: Leaf, title: 'Preventive Care', desc: 'Shift from reactive to proactive health. Small, consistent nudges build long-term habits that prevent disease.', bg: 'linear-gradient(135deg, #14322A, #1a4035)' },
    { icon: Brain, title: 'Mental Wellbeing', desc: 'Stigma around mental health is the highest barrier. Our non-judgmental platform creates a safe first conversation.', bg: 'linear-gradient(135deg, #DE9F3D, #b87e28)' },
    { icon: Users, title: 'Community Health', desc: 'One person helped becomes a family protected. Bharosa scales trust across communities, not just individuals.', bg: 'linear-gradient(135deg, #C25B3D, #DE9F3D)' },
  ];

  return (
    <section id="howitworks" className="py-24 bg-[#F7F0E4] relative overflow-hidden">
      <BackgroundBlobs />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <FadeInSection className="text-center mb-16">
          <p className="text-[#C25B3D] uppercase tracking-widest text-xs font-semibold mb-3">The Journey</p>
          <h2 className="section-heading text-4xl md:text-5xl font-bold text-[#14322A]">How it works.</h2>
        </FadeInSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-28">
          {steps.map((s, i) => (
            <FadeInSection key={i} delay={i * 0.1}>
              <TiltCard>
                <div className="rounded-2xl p-6 h-full relative overflow-hidden transition-shadow duration-300 hover:shadow-xl" style={{ background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.6)' }}>
                  <div className="absolute -top-4 -right-3 text-7xl font-bold text-[#14322A]/5 section-heading select-none">{s.num}</div>
                  <div className="w-12 h-12 rounded-xl bg-[#14322A] flex items-center justify-center mb-5"><s.icon size={20} className="text-[#DE9F3D]" /></div>
                  <h3 className="section-heading text-[#14322A] text-lg font-bold mb-2">{s.title}</h3>
                  <p className="text-[#14322A]/60 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </TiltCard>
            </FadeInSection>
          ))}
        </div>

        <FadeInSection className="text-center mb-16">
          <p className="text-[#C25B3D] uppercase tracking-widest text-xs font-semibold mb-3">Why it Matters</p>
          <h2 className="section-heading text-4xl md:text-5xl font-bold text-[#14322A]">Areas of Impact.</h2>
        </FadeInSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {impact.map((item, i) => (
            <FadeInSection key={i} delay={i * 0.1}>
              <TiltCard>
                <div className="rounded-2xl p-6 h-full text-white relative overflow-hidden" style={{ background: item.bg }}>
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-5"><item.icon size={22} className="text-white" /></div>
                    <h3 className="section-heading text-white text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-white/75 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </TiltCard>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
//  SECTION 8: CTA Banner
// ─────────────────────────────────────────────
const CTABanner = ({ onOpenModal }) => (
  <section className="py-24 bg-[#14322A] relative overflow-hidden">
    <BackgroundBlobs dark />
    <FadeInSection className="max-w-4xl mx-auto px-6 text-center relative z-10">
      <p className="text-[#DE9F3D] uppercase tracking-widest text-xs font-semibold mb-6">Join the Movement</p>
      <h2 className="section-heading text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
        Be the reason someone<br />
        <span className="text-[#DE9F3D]">chooses their health today.</span>
      </h2>
      <p className="text-white/55 text-lg mb-12 max-w-xl mx-auto">
        Share Bharosa with someone you care about. It takes two minutes to start, and it could change everything.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <TactileButton
          glowColor="rgba(222,159,61,0.5)"
          className="group flex items-center gap-2 bg-[#DE9F3D] text-[#14322A] px-8 py-4 rounded-full font-semibold text-base hover:bg-[#f0b85a] transition-colors duration-200"
          onClick={onOpenModal}
        >
          Start Your Check-In
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </TactileButton>
        <TactileButton
          glowColor="rgba(255,255,255,0.15)"
          className="flex items-center gap-2 text-white px-8 py-4 rounded-full font-medium text-base hover:bg-white/10 transition-all duration-200"
          style={{ border: '1px solid rgba(255,255,255,0.25)' }}
          onClick={() => smoothScrollTo('stories')}
        >
          Read Real Stories
        </TactileButton>
      </div>
    </FadeInSection>
  </section>
);

// ─────────────────────────────────────────────
//  SECTION 9: Footer
// ─────────────────────────────────────────────
const Footer = () => (
  <footer className="bg-[#0d2219] pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 bg-[#DE9F3D] rounded-lg flex items-center justify-center"><Heart size={16} className="text-[#14322A]" fill="#14322A" /></span>
            <span className="section-heading text-2xl font-bold text-white">Bharosa</span>
          </div>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">A judgment-free first step toward healthcare. Anonymous. Affordable. Human.</p>
          <div className="mt-5 flex gap-3">
            {['Twitter', 'LinkedIn', 'Instagram'].map(s => (
              <TactileButton key={s} as="a" href="#" glowColor="rgba(255,255,255,0.1)" className="text-xs text-white/30 hover:text-white/70 transition-colors rounded-full px-3 py-1.5" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>{s}</TactileButton>
            ))}
          </div>
        </div>
        {[
          { heading: 'Features', links: ['Anonymous Check-In', 'Faceless Booking', 'Cost Clarity', 'Government Schemes'] },
          { heading: 'Learn', links: ['The Problem', 'Our Approach', 'Impact Report', 'Research'] },
        ].map(col => (
          <div key={col.heading}>
            <h4 className="text-white font-semibold text-sm mb-4">{col.heading}</h4>
            <ul className="space-y-2.5">
              {col.links.map(l => <li key={l}><a href="#" className="text-white/35 text-sm hover:text-white/70 transition-colors">{l}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="text-white/20 text-xs text-center md:text-left">© 2026 Bharosa. Built for <span className="text-[#DE9F3D]/60">DesignVerse 2026</span>.</p>
        <p className="text-white/20 text-xs text-center max-w-sm">⚠️ This is a prototype, not medical advice. Always consult a qualified healthcare professional for medical decisions.</p>
      </div>
    </div>
  </footer>
);

// ─────────────────────────────────────────────
//  APP ROOT
// ─────────────────────────────────────────────
export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <div className="min-h-screen font-sans">
      <CheckInModal isOpen={modalOpen} onClose={closeModal} />
      <Navbar onOpenModal={openModal} />
      <main>
        <HeroSection onOpenModal={openModal} />
        <StatsBand />
        <ProblemSection />
        <SolutionsSection onOpenModal={openModal} />
        <CheckInSection onOpenModal={openModal} />
        <StoriesSection />
        <HowItWorksSection />
        <CTABanner onOpenModal={openModal} />
      </main>
      <Footer />
    </div>
  );
}
