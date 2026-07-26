'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Syne, Inter } from 'next/font/google';
import {
  ArrowRight,
  ExternalLink,
  Menu,
  X,
  Monitor,
  ImageIcon,
  Film,
  Palette,
  Smartphone,
  Quote,
  Mail,
  Send,
  Check,
  ChevronRight,
  Star,
  Award,
  Layers,
  Zap,
  ScrollText,
  Sparkles,
  Heart,
  Users,
  Target,
  MapPin,
  Clock,
  Phone,
} from 'lucide-react';

/* ─── Fonts ─────────────────────────────────────────────── */
const syne = Syne({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] });
const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });

/* ─── Data ──────────────────────────────────────────────── */

const services = [
  {
    icon: Monitor,
    title: 'Web Design & Development',
    description:
      'Custom websites and web apps that are fast, accessible, and built to convert. From landing pages to full platforms.',
    color: '#E85D3A',
  },
  {
    icon: ImageIcon,
    title: 'Poster / Flyer / Menu Design',
    description:
      'Print-ready designs that command attention. Events, restaurants, brands — we make your message visual.',
    color: '#2D6B5E',
  },
  {
    icon: Film,
    title: 'Video Editing',
    description:
      'Polished edits for social, commercial, or cinematic projects. Pacing, color, sound — every frame considered.',
    color: '#5B4A7A',
  },
  {
    icon: Palette,
    title: 'Branding & Identity',
    description:
      'Brand strategy, visual identity, logo design, and guidelines. We build the visual language your brand deserves.',
    color: '#C97B3A',
  },
  {
    icon: Smartphone,
    title: 'Mobile App Design',
    description:
      'UI/UX for iOS and Android apps. Intuitive flows, pixel-perfect interfaces, and delightful micro-interactions.',
    color: '#3A6B9F',
  },
];

const portfolioItems = [
  {
    id: 1,
    title: 'VELA — Fashion E-Commerce',
    category: 'web',
    description: 'Minimalist webstore for a premium streetwear label. Focus on product-first layout and smooth checkout.',
    image: null,
    color: '#1A1A18',
  },
  {
    id: 2,
    title: 'NOIR — Event Posters',
    category: 'print',
    description: 'Series of 12 posters for an underground music festival. High-contrast, typography-driven, screen-printed.',
    image: null,
    color: '#2D2D2A',
  },
  {
    id: 3,
    title: 'SOLACE — Brand Identity',
    category: 'branding',
    description: 'Complete rebrand for a wellness studio. Logo, stationery, packaging, and digital presence.',
    image: null,
    color: '#3D3D3A',
  },
  {
    id: 4,
    title: 'AURO — Mobile Banking App',
    category: 'mobile',
    description: 'UX/UI redesign for a neobank. Reduced onboarding friction by 40% through gesture-driven flows.',
    image: null,
    color: '#2A2A28',
  },
  {
    id: 5,
    title: 'MUSE — Restaurant Menu',
    category: 'print',
    description: 'Editorial-style menu for a fine-dining experience. Letterpress feel with modern typographic hierarchy.',
    image: null,
    color: '#3A2A1A',
  },
  {
    id: 6,
    title: 'DRIFT — Travel Brand',
    category: 'branding',
    description: 'Visual identity for a sustainable travel platform. Logo, icon set, and social media templates.',
    image: null,
    color: '#1A2A3A',
  },
  {
    id: 7,
    title: 'PULSE — Fitness Platform',
    category: 'web',
    description: 'Dashboard and landing pages for a connected fitness startup. Data-rich yet calming interface.',
    image: null,
    color: '#2A1A2A',
  },
  {
    id: 8,
    title: 'I/O — Event Reel',
    category: 'video',
    description: 'Aftermovie for a tech conference. Fast-paced storytelling with kinetic typography and cinematic color.',
    image: null,
    color: '#1A2A2A',
  },
  {
    id: 9,
    title: 'TERRA — Plant App',
    category: 'mobile',
    description: 'Plant care companion app with AR plant identification and community features. Awarded Best UX 2025.',
    image: null,
    color: '#2A3A2A',
  },
];

const categories = [
  { value: 'all', label: 'All Work' },
  { value: 'web', label: 'Web' },
  { value: 'print', label: 'Print' },
  { value: 'branding', label: 'Branding' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'video', label: 'Video' },
];

const processSteps = [
  {
    number: '01',
    title: 'Discover',
    description:
      'We learn your brand, audience, and goals. Research, strategy, and a clear creative brief before any design begins.',
    icon: ScrollText,
  },
  {
    number: '02',
    title: 'Design',
    description:
      'Concepts, iterations, and refinements. We present options, gather feedback, and push every pixel until it\'s right.',
    icon: Layers,
  },
  {
    number: '03',
    title: 'Build',
    description:
      'Development, production, or print prep. Every detail is crafted with precision and tested thoroughly.',
    icon: Zap,
  },
  {
    number: '04',
    title: 'Deliver',
    description:
      'Handoff with full documentation. Assets, guidelines, source files — everything you need to move forward.',
    icon: Award,
  },
];

const testimonials = [
  {
    quote:
      'LIMM didn\'t just design our website — they redefined how we present ourselves. Every interaction feels intentional.',
    author: 'Maya Chen',
    role: 'Founder, VELA',
    rating: 5,
  },
  {
    quote:
      'The branding package exceeded every expectation. Our customers consistently comment on how cohesive and professional everything looks.',
    author: 'James Okonkwo',
    role: 'CEO, SOLACE Wellness',
    rating: 5,
  },
  {
    quote:
      'We\'ve worked with several design studios. LIMM is the first that truly listened, then delivered something better than we imagined.',
    author: 'Sofia Lindgren',
    role: 'Creative Director, DRIFT',
    rating: 5,
  },
];

const socialLinks = [
  { icon: 'instagram', label: 'Instagram', href: '#' },
  { icon: 'x', label: 'X (Twitter)', href: '#' },
  { icon: 'linkedin', label: 'LinkedIn', href: '#' },
  { icon: 'github', label: 'GitHub', href: '#' },
];

/* ─── Portfolio Modal ──────────────────────────────────── */

function PortfolioModal({
  project,
  onClose,
}: {
  project: (typeof portfolioItems)[0] | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [project, onClose]);

  if (!project) return null;

  const categoryLabel = categories.find((c) => c.value === project.category)?.label || project.category;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Project: ${project.title}`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]" />

      {/* Modal content */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#F7F5F0] rounded-2xl overflow-hidden shadow-2xl animate-[scaleIn_0.35s_cubic-bezier(0.16,1,0.3,1)]"
      >
        {/* Project visual */}
        <div
          className="aspect-[16/9] flex items-center justify-center relative"
          style={{ backgroundColor: project.color }}
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-6 left-6 w-20 h-20 rounded-full border border-white/20" />
            <div className="absolute bottom-6 right-6 w-32 h-32 rounded-full border border-white/15" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-white/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
          <span className="relative z-10 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-xs uppercase tracking-[0.15em] font-medium">
            {categoryLabel}
          </span>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/50 transition-all duration-300"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Project details */}
        <div className="p-8 sm:p-10">
          <h3 className={`${syne.className} text-2xl sm:text-3xl font-bold text-[#1A1A18] mb-4`}>{project.title}</h3>
          <p className={`${inter.className} text-[#8A8A86] leading-relaxed mb-6`}>{project.description}</p>

          <div className="flex flex-wrap gap-3 mb-8">
            <span className="px-3 py-1.5 rounded-lg bg-[#1A1A18]/5 text-[#1A1A18] text-xs font-medium">
              {categoryLabel}
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-[#1A1A18]/5 text-[#1A1A18] text-xs font-medium">
              UI/UX Design
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-[#1A1A18]/5 text-[#1A1A18] text-xs font-medium">
              Brand Identity
            </span>
          </div>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              onClose();
              setTimeout(() => {
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 300);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A1A18] text-[#F7F5F0] rounded-xl hover:bg-[#E85D3A] transition-all duration-300 text-sm font-medium"
          >
            Start a Similar Project
            <ArrowRight size={16} />
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92) translateY(16px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ─── Social icon SVG components ────────────────────────── */

function SocialIcon({ type, size = 16 }: { type: string; size?: number }) {
  const s = size;
  switch (type) {
    case 'instagram':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      );
    case 'x':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
          <path d="M4 20l6.768 -6.768M17.532 7.532L20 4" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case 'github':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      );
    default:
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
  }
}

/* ─── Utility ────────────────────────────────────────────── */

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/* ─── Section: Hero ─────────────────────────────────────── */

function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);

  const textReveal = useCallback(
    (index: number) =>
      ({
        transition: `opacity 0.8s ease-out ${0.3 + index * 0.15}s, transform 0.8s ease-out ${0.3 + index * 0.15}s`,
        opacity: loaded ? 1 : 0,
        transform: loaded ? 'translateY(0)' : 'translateY(24px)',
      } as React.CSSProperties),
    [loaded]
  );

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#F7F5F0]">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-[10%] w-96 h-96 rounded-full bg-[#E85D3A]/3 blur-3xl" />
        <div className="absolute bottom-1/4 left-[5%] w-80 h-80 rounded-full bg-[#2D6B5E]/3 blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-24 w-full">
        <div className="max-w-4xl">
          {/* Badge */}
          <div
            style={textReveal(0)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#1A1A18]/10 bg-white/60 backdrop-blur-sm mb-8"
          >
            <Sparkles size={14} className="text-[#E85D3A]" />
            <span className={`${inter.className} text-xs uppercase tracking-[0.15em] text-[#8A8A86] font-medium`}>
              Creative Studio Est. 2020
            </span>
          </div>

          {/* Main heading */}
          <h1
            style={textReveal(1)}
            className={`${syne.className} text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold leading-[0.9] tracking-[-0.04em] text-[#1A1A18] mb-6`}
          >
            LIMM
            <br />
            <span className="text-[#E85D3A]">Studio</span>
          </h1>

          {/* Tagline */}
          <p
            style={textReveal(2)}
            className={`${inter.className} text-lg sm:text-xl md:text-2xl text-[#8A8A86] max-w-xl leading-relaxed mb-10 font-light`}
          >
            We craft digital experiences, visual identities, and brand stories that don't just look good — they resonate.
          </p>

          {/* CTAs */}
          <div
            style={textReveal(3)}
            className="flex flex-wrap gap-4 items-center"
          >
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#1A1A18] text-[#F7F5F0] rounded-xl hover:bg-[#E85D3A] transition-all duration-300 font-medium"
            >
              <span className={`${inter.className} text-sm tracking-wider uppercase`}>Start a Project</span>
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
            <a
              href="#work"
              className="group inline-flex items-center gap-3 px-8 py-4 border-2 border-[#1A1A18]/10 text-[#1A1A18] rounded-xl hover:border-[#1A1A18]/30 transition-all duration-300 font-medium"
            >
              <span className={`${inter.className} text-sm tracking-wider uppercase`}>View Work</span>
              <ChevronRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </div>

          {/* Stats */}
          <div
            style={textReveal(4)}
            className="flex flex-wrap gap-8 sm:gap-12 mt-16 pt-12 border-t border-[#1A1A18]/6"
          >
            {[
              { number: '120+', label: 'Projects Delivered' },
              { number: '8+', label: 'Years in Business' },
              { number: '40+', label: 'Repeat Clients' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className={`${syne.className} text-3xl font-bold text-[#1A1A18]`}>{stat.number}</p>
                <p className={`${inter.className} text-sm text-[#8A8A86] mt-1`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#8A8A86]">
        <span className={`${inter.className} text-[10px] uppercase tracking-[0.2em]`}>Scroll</span>
        <div className="w-5 h-8 rounded-full border border-[#8A8A86]/30 flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-[#8A8A86]/50 animate-bounce" />
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Services ─────────────────────────────────── */

function ServicesSection() {
  const { ref, visible } = useScrollReveal();

  return (
    <section id="services" className="relative py-28 sm:py-36 bg-white scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div ref={ref} className="mb-16">
          <span className={`${inter.className} text-xs uppercase tracking-[0.2em] text-[#E85D3A] font-medium`}>
            What We Do
          </span>
          <h2
            className={`${syne.className} text-4xl sm:text-5xl md:text-6xl font-bold text-[#1A1A18] mt-4 max-w-2xl leading-tight`}
          >
            Services crafted for the bold.
          </h2>
          <p className={`${inter.className} text-lg text-[#8A8A86] mt-4 max-w-lg font-light`}>
            Every project is approached with strategy, intention, and an obsessive attention to detail.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.title}
                className="group relative p-8 rounded-2xl border border-[#E5E3DE] bg-white hover:bg-[#F7F5F0] transition-all duration-500 cursor-default"
                style={{
                  transitionDelay: `${i * 80}ms`,
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 80}ms`,
                }}
              >
                {/* Icon circle */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110"
                  style={{ backgroundColor: `${service.color}12` }}
                >
                  <IconComponent size={24} style={{ color: service.color }} />
                </div>

                <h3 className={`${syne.className} text-xl font-bold text-[#1A1A18] mb-3`}>{service.title}</h3>
                <p className={`${inter.className} text-[#8A8A86] leading-relaxed text-sm`}>{service.description}</p>

                {/* Hover underline */}
                <div
                  className="absolute bottom-0 left-0 h-0.5 rounded-full transition-all duration-500 group-hover:w-full"
                  style={{ width: 0, backgroundColor: service.color }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Portfolio / Selected Work ────────────────── */

function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<(typeof portfolioItems)[0] | null>(null);
  const { ref, visible } = useScrollReveal();

  const filtered =
    activeFilter === 'all'
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeFilter);

  return (
    <section id="work" className="relative py-28 sm:py-36 bg-[#F7F5F0] scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div ref={ref} className="mb-16">
          <span className={`${inter.className} text-xs uppercase tracking-[0.2em] text-[#E85D3A] font-medium`}>
            Selected Work
          </span>
          <h2
            className={`${syne.className} text-4xl sm:text-5xl md:text-6xl font-bold text-[#1A1A18] mt-4 max-w-2xl leading-tight`}
          >
            Projects we're proud of.
          </h2>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveFilter(cat.value)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${inter.className} ${
                activeFilter === cat.value
                  ? 'bg-[#1A1A18] text-[#F7F5F0]'
                  : 'bg-white text-[#8A8A86] border border-[#E5E3DE] hover:border-[#1A1A18]/20 hover:text-[#1A1A18]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden bg-white border border-[#E5E3DE] hover:border-[#1A1A18]/20 transition-all duration-500"
              style={{
                animation: visible ? `fadeSlideIn 0.6s ease-out ${i * 80}ms both` : 'none',
              }}
            >
              {/* Project placeholder visual */}
              <div
                className="aspect-[4/3] flex items-center justify-center relative overflow-hidden"
                style={{ backgroundColor: item.color }}
              >
                {/* Abstract geometric pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div
                    className="absolute top-4 left-4 w-16 h-16 rounded-full border border-white/20"
                  />
                  <div
                    className="absolute bottom-4 right-4 w-24 h-24 rounded-full border border-white/15"
                  />
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-white/10"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                {/* Category badge */}
                <span className="relative z-10 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] uppercase tracking-[0.15em] font-medium">
                  {categories.find((c) => c.value === item.category)?.label || item.category}
                </span>

                {/* Hover overlay */}
                <button
                  onClick={() => setSelectedProject(item)}
                  className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center cursor-pointer"
                  aria-label={`View project: ${item.title}`}
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 text-[#1A1A18] text-sm font-medium">
                      <ExternalLink size={14} />
                      View Project
                    </span>
                  </div>
                </button>
              </div>

              {/* Project info */}
              <div className="p-6">
                <h3 className={`${syne.className} text-lg font-bold text-[#1A1A18] mb-2`}>{item.title}</h3>
                <p className={`${inter.className} text-sm text-[#8A8A86] leading-relaxed`}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className={`${inter.className} text-[#8A8A86]`}>No projects in this category yet. Check back soon.</p>
          </div>
        )}
      </div>

      {/* Project Modal */}
      <PortfolioModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <style jsx>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

/* ─── Section: Process ──────────────────────────────────── */

function ProcessSection() {
  const { ref, visible } = useScrollReveal();

  return (
    <section id="process" className="relative py-28 sm:py-36 bg-white overflow-hidden scroll-mt-24">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#E85D3A]/3 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div ref={ref} className="mb-20">
          <span className={`${inter.className} text-xs uppercase tracking-[0.2em] text-[#E85D3A] font-medium`}>
            Our Process
          </span>
          <h2
            className={`${syne.className} text-4xl sm:text-5xl md:text-6xl font-bold text-[#1A1A18] mt-4 max-w-2xl leading-tight`}
          >
            How we bring ideas to life.
          </h2>
        </div>

        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-[#E5E3DE] hidden md:block" />

          <div className="space-y-16 md:space-y-0">
            {processSteps.map((step, i) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={step.number}
                  className="relative md:flex gap-12 group"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateX(0)' : 'translateX(-20px)',
                    transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 150}ms`,
                  }}
                >
                  {/* Step number + icon */}
                  <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-2 md:w-48 shrink-0 mb-6 md:mb-0">
                    <div className="relative z-10 w-12 h-12 rounded-full bg-[#F7F5F0] border-2 border-[#E5E3DE] flex items-center justify-center group-hover:border-[#E85D3A] transition-all duration-500">
                      <IconComponent size={18} className="text-[#1A1A18] group-hover:text-[#E85D3A] transition-colors duration-500" />
                    </div>
                    <span
                      className={`${syne.className} text-5xl font-bold text-[#E5E3DE] leading-none md:ml-0 transition-colors duration-500 group-hover:text-[#E85D3A]/20`}
                    >
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="md:pt-0 flex-1">
                    <h3 className={`${syne.className} text-2xl font-bold text-[#1A1A18] mb-3`}>{step.title}</h3>
                    <p className={`${inter.className} text-[#8A8A86] leading-relaxed max-w-lg font-light`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Section: About ────────────────────────────────────── */

function AboutSection() {
  const { ref, visible } = useScrollReveal();

  return (
    <section id="about" className="relative py-28 sm:py-36 bg-[#1A1A18] text-[#F7F5F0] overflow-hidden scroll-mt-24">
      {/* Texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.2) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div ref={ref}>
          <span className={`${inter.className} text-xs uppercase tracking-[0.2em] text-[#E85D3A] font-medium`}>
            About
          </span>

          <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 mt-8">
            <div className="lg:col-span-3">
              <h2 className={`${syne.className} text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-8`}>
                Design isn't what we do.
                <br />
                <span className="text-[#E85D3A]">It's how we think.</span>
              </h2>
            </div>
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <p className={`${inter.className} text-base leading-relaxed text-[#C5C5C0] font-light`}>
                  LIMM Studio started in a small apartment with a laptop, a vision, and a stubborn belief that design
                  should be honest. No fluff. No unnecessary ornament. Just clear, intentional work that solves real
                  problems.
                </p>
                <p className={`${inter.className} text-base leading-relaxed text-[#C5C5C0] font-light`}>
                  Today, we're a small team of designers, developers, and storytellers who work with founders and
                  brands that care about craft as much as we do. We've built everything from tiny brand identities to
                  full-scale digital platforms — and we treat every project with the same obsessive attention to detail.
                </p>
                <p className={`${inter.className} text-base leading-relaxed text-[#F7F5F0] font-medium`}>
                  We believe the best work comes from collaboration, curiosity, and a willingness to challenge the
                  brief. If that sounds like your kind of project, we should talk.
                </p>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="grid sm:grid-cols-3 gap-8 mt-20 pt-16 border-t border-white/10">
            {[
              { icon: Heart, title: 'Craft Over Speed', desc: 'We don\'t rush. Every project gets the time it deserves.' },
              { icon: Users, title: 'Partnership, Not Vendor', desc: 'We work with you, not for you. Your vision, our expertise.' },
              { icon: Target, title: 'Results That Matter', desc: 'Beautiful design is meaningless without measurable impact.' },
            ].map((value) => {
              const IconComponent = value.icon;
              return (
                <div key={value.title} className="group">
                  <IconComponent
                    size={20}
                    className="text-[#E85D3A] mb-4 transition-transform duration-300 group-hover:scale-110"
                  />
                  <h3 className={`${syne.className} text-lg font-bold text-[#F7F5F0] mb-2`}>{value.title}</h3>
                  <p className={`${inter.className} text-sm text-[#8A8A86] leading-relaxed`}>{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Testimonials ─────────────────────────────── */

function TestimonialsSection() {
  const { ref, visible } = useScrollReveal();

  return (
    <section id="testimonials" className="relative py-28 sm:py-36 bg-[#F7F5F0] scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div ref={ref} className="mb-16">
          <span className={`${inter.className} text-xs uppercase tracking-[0.2em] text-[#E85D3A] font-medium`}>
            Testimonials
          </span>
          <h2
            className={`${syne.className} text-4xl sm:text-5xl md:text-6xl font-bold text-[#1A1A18] mt-4 max-w-2xl leading-tight`}
          >
            Kind words from people we've worked with.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.author}
              className="relative p-8 rounded-2xl bg-white border border-[#E5E3DE] hover:border-[#1A1A18]/10 transition-all duration-500"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 120}ms`,
              }}
            >
              {/* Quote mark */}
              <Quote size={28} className="text-[#E85D3A]/20 mb-4" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} className="fill-[#E85D3A] text-[#E85D3A]" />
                ))}
              </div>

              <p className={`${inter.className} text-[#1A1A18] leading-relaxed mb-6 font-light text-sm`}>
                "{t.quote}"
              </p>

              <div className="border-t border-[#E5E3DE] pt-4 mt-auto">
                <p className={`${syne.className} text-sm font-bold text-[#1A1A18]`}>{t.author}</p>
                <p className={`${inter.className} text-xs text-[#8A8A86] mt-0.5`}>{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Contact ──────────────────────────────────── */

function ContactSection() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    projectType: '',
    budget: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const { ref, visible } = useScrollReveal();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const budgetRanges = [
    'Under $2k',
    '$2k – $5k',
    '$5k – $10k',
    '$10k – $25k',
    '$25k+',
    'Prefer not to say',
  ];

  const projectTypes = [
    'Website Design',
    'Branding / Identity',
    'Poster / Flyer / Menu',
    'Video Editing',
    'Mobile App Design',
    'Multiple Services',
    'Other',
  ];

  return (
    <section id="contact" className="relative py-28 sm:py-36 bg-white scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div ref={ref}>
          <span className={`${inter.className} text-xs uppercase tracking-[0.2em] text-[#E85D3A] font-medium`}>
            Start a Project
          </span>
          <h2
            className={`${syne.className} text-4xl sm:text-5xl md:text-6xl font-bold text-[#1A1A18] mt-4 max-w-2xl leading-tight mb-16`}
          >
            Have an idea?
            <br />
            <span className="text-[#E85D3A]">Let's make it real.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-20">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-3 space-y-6"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s`,
            }}
          >
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className={`${inter.className} block text-sm font-medium text-[#1A1A18] mb-2`}
                >
                  Name <span className="text-[#E85D3A]">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full px-4 py-3.5 rounded-xl border border-[#E5E3DE] bg-[#F7F5F0] text-[#1A1A18] placeholder:text-[#8A8A86]/50 focus:outline-none focus:ring-2 focus:ring-[#E85D3A]/20 focus:border-[#E85D3A] transition-all duration-300 text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className={`${inter.className} block text-sm font-medium text-[#1A1A18] mb-2`}
                >
                  Email <span className="text-[#E85D3A]">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3.5 rounded-xl border border-[#E5E3DE] bg-[#F7F5F0] text-[#1A1A18] placeholder:text-[#8A8A86]/50 focus:outline-none focus:ring-2 focus:ring-[#E85D3A]/20 focus:border-[#E85D3A] transition-all duration-300 text-sm"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="projectType"
                  className={`${inter.className} block text-sm font-medium text-[#1A1A18] mb-2`}
                >
                  Project Type
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formState.projectType}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl border border-[#E5E3DE] bg-[#F7F5F0] text-[#1A1A18] focus:outline-none focus:ring-2 focus:ring-[#E85D3A]/20 focus:border-[#E85D3A] transition-all duration-300 text-sm appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238A8A86' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 16px center',
                  }}
                >
                  <option value="">Select a service</option>
                  {projectTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="budget"
                  className={`${inter.className} block text-sm font-medium text-[#1A1A18] mb-2`}
                >
                  Budget Range
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formState.budget}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl border border-[#E5E3DE] bg-[#F7F5F0] text-[#1A1A18] focus:outline-none focus:ring-2 focus:ring-[#E85D3A]/20 focus:border-[#E85D3A] transition-all duration-300 text-sm appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238A8A86' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 16px center',
                  }}
                >
                  <option value="">Select range</option>
                  {budgetRanges.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="message"
                className={`${inter.className} block text-sm font-medium text-[#1A1A18] mb-2`}
              >
                Tell us about your project <span className="text-[#E85D3A]">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formState.message}
                onChange={handleChange}
                placeholder="Describe your project, goals, timeline, and any relevant details..."
                className="w-full px-4 py-3.5 rounded-xl border border-[#E5E3DE] bg-[#F7F5F0] text-[#1A1A18] placeholder:text-[#8A8A86]/50 focus:outline-none focus:ring-2 focus:ring-[#E85D3A]/20 focus:border-[#E85D3A] transition-all duration-300 text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#1A1A18] text-[#F7F5F0] rounded-xl hover:bg-[#E85D3A] transition-all duration-300 font-medium"
            >
              {submitted ? (
                <>
                  <Check size={18} />
                  <span className={`${inter.className} text-sm tracking-wider uppercase`}>Sent!</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span className={`${inter.className} text-sm tracking-wider uppercase`}>Send Message</span>
                </>
              )}
            </button>
          </form>

          {/* Contact Info */}
          <div
            className="lg:col-span-2 space-y-8"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s`,
            }}
          >
            <div>
              <h3 className={`${syne.className} text-lg font-bold text-[#1A1A18] mb-4`}>Get in touch</h3>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: 'Email', value: 'hello@limmstudio.com' },
                  { icon: Phone, label: 'Phone', value: '+1 (555) 000-0000' },
                  { icon: MapPin, label: 'Studio', value: 'London, UK — Available Worldwide' },
                  { icon: Clock, label: 'Response Time', value: 'Usually within 24 hours' },
                ].map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-3">
                      <IconComponent size={16} className="text-[#E85D3A] mt-0.5 shrink-0" />
                      <div>
                        <p className={`${inter.className} text-xs text-[#8A8A86] uppercase tracking-wider`}>
                          {item.label}
                        </p>
                        <p className={`${inter.className} text-sm text-[#1A1A18] font-medium`}>{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-[#E5E3DE] pt-8">
              <h3 className={`${syne.className} text-lg font-bold text-[#1A1A18] mb-4`}>Follow us</h3>
              <div className="flex gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    aria-label={link.label}
                    className="w-10 h-10 rounded-xl border border-[#E5E3DE] flex items-center justify-center text-[#8A8A86] hover:text-[#1A1A18] hover:border-[#1A1A18]/20 transition-all duration-300"
                  >
                    <SocialIcon type={link.icon} size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Navigation ────────────────────────────────────────── */

function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#work' },
    { label: 'Process', href: '#process' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#F7F5F0]/90 backdrop-blur-xl shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="#"
            className={`${syne.className} text-2xl font-bold text-[#1A1A18] tracking-tight`}
          >
            LIMM
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`${inter.className} text-sm text-[#8A8A86] hover:text-[#1A1A18] transition-colors duration-300`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="px-5 py-2.5 bg-[#1A1A18] text-[#F7F5F0] rounded-xl hover:bg-[#E85D3A] transition-all duration-300 text-sm font-medium"
            >
              Start a Project
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl border border-[#E5E3DE] text-[#1A1A18]"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6 pt-2 space-y-4 bg-[#F7F5F0]/95 backdrop-blur-xl border-t border-[#E5E3DE]">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block ${inter.className} text-sm text-[#8A8A86] hover:text-[#1A1A18] transition-colors duration-300 py-2`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className={`block text-center px-5 py-3 bg-[#1A1A18] text-[#F7F5F0] rounded-xl hover:bg-[#E85D3A] transition-all duration-300 text-sm font-medium ${inter.className}`}
          >
            Start a Project
          </a>
        </div>
      </div>
    </header>
  );
}

/* ─── Footer ────────────────────────────────────────────── */

function FooterSection() {
  return (
    <footer className="relative bg-[#1A1A18] text-[#F7F5F0] py-16 sm:py-20 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className={`${syne.className} text-2xl font-bold tracking-tight`}>
              LIMM<span className="text-[#E85D3A]">.</span>
            </a>
            <p className={`${inter.className} text-sm text-[#8A8A86] max-w-sm mt-4 leading-relaxed font-light`}>
              Crafting digital experiences and visual identities for brands that refuse to blend in.
            </p>
            <div className="flex gap-3 mt-6">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  aria-label={link.label}
                  className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-[#8A8A86] hover:text-[#F7F5F0] hover:border-white/20 transition-all duration-300"
                >
                  <SocialIcon type={link.icon} size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`${syne.className} text-sm font-bold text-[#F7F5F0] mb-4`}>Navigate</h4>
            <ul className="space-y-3">
              {['Services', 'Work', 'Process', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className={`${inter.className} text-sm text-[#8A8A86] hover:text-[#F7F5F0] transition-colors duration-300`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={`${syne.className} text-sm font-bold text-[#F7F5F0] mb-4`}>Contact</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@limmstudio.com"
                  className={`${inter.className} text-sm text-[#8A8A86] hover:text-[#F7F5F0] transition-colors duration-300`}
                >
                  hello@limmstudio.com
                </a>
              </li>
              <li>
                <p className={`${inter.className} text-sm text-[#8A8A86]`}>+1 (555) 000-0000</p>
              </li>
              <li>
                <p className={`${inter.className} text-sm text-[#8A8A86]`}>London, UK · Worldwide</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className={`${inter.className} text-xs text-[#8A8A86] font-light`}>
            &copy; {new Date().getFullYear()} LIMM Studio. All rights reserved.
          </p>
          <p className={`${inter.className} text-xs text-[#8A8A86] font-light`}>
            Design with intention. Built with care.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Main Page ─────────────────────────────────────────── */

export default function LimmStudioPage() {
  useEffect(() => {
    // Set page title
    document.title = 'LIMM Studio — Creative Studio';

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const href = (anchor as HTMLAnchorElement).getAttribute('href');
        if (!href) return;
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }, []);

  return (
    <>
      {/* Full-bleed wrapper — breaks out of parent container */}
      <div className="relative left-1/2 -ml-[50vw]" style={{ width: '100vw' }}>
        <Navigation />
        <HeroSection />
        <ServicesSection />
        <PortfolioSection />
        <ProcessSection />
        <AboutSection />
        <TestimonialsSection />
        <ContactSection />
        <FooterSection />
      </div>
    </>
  );
}
