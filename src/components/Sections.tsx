import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Volume2,
  VolumeX,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Check,
  ArrowRight,
  X,
  Compass,
  Leaf,
  Droplet,
  Flower2,
  Phone,
  Mail,
  ShieldCheck,
  Flame,
  Activity,
  Award,
  DollarSign,
  Navigation,
  ExternalLink
} from "lucide-react";
import { TabType } from "../App";
import { services } from "../data/services";
import { Service, Testimonial, MembershipPlan } from "../types";
import { triggerBell } from "../utils/audioSynth";

interface SectionsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  activeSection: number;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
}

const testimonialsData: Testimonial[] = [
  {
    id: "t1",
    name: "Sandeep Nair",
    role: "Tech Lead & Fitness Enthusiast",
    text: "Pure Bliss is a masterclass in men's wellness. The 4 Hands massage was synchronized so perfectly, it felt like a wave of pure relief. Absolute privacy and pristine hygiene in JP Nagar."
  },
  {
    id: "t2",
    name: "Vikram Kamath",
    role: "Corporate Executive",
    text: "The Dry Massage is my ultimate office break cure. Quick, highly effective pressure, and no cleanup. It is a premium sanctuary. Highly recommended for busy professionals."
  },
  {
    id: "t3",
    name: "Dr. Alok Prasad",
    role: "Ayurvedic Practitioner",
    text: "They use authentic Kerala medicated oils for Abhyanga, and the steam bath finishes the detoxification beautifully. They genuinely honor classical healing principles."
  }
];

const membershipsData: MembershipPlan[] = [
  {
    id: "m1",
    name: "Sadhana Pass",
    price: "₹6,500",
    period: "Month",
    description: "A monthly ritual of rejuvenation to anchor your busy modern schedule.",
    features: [
      "1 Custom 75-Min Swedish or Deep Tissue Massage",
      "Unlimited access to the Forest Sandalwood Steam Facility",
      "10% off any additional specialized treatments"
    ]
  },
  {
    id: "m2",
    name: "Prana Circle",
    price: "₹18,500",
    period: "Quarter",
    description: "Align your physical elements with the seasonal rhythms.",
    features: [
      "3 Custom 90-Min Signature Ayurvedic or Hot Stone Rituals",
      "Private steam session & Ayurvedic herbal tea pairing",
      "Priority booking for prime holiday and weekend slots",
      "Complimentary head massage add-on with each visit"
    ]
  },
  {
    id: "m3",
    name: "Samadhi Circle",
    price: "₹65,000",
    period: "Year",
    description: "A complete annual commitment to pure vitality and structural renewal.",
    features: [
      "12 Custom 90-Min Master Full-Body Massage Treatments",
      "6 Private customized body polish or scrub services",
      "Unlimited guest day-passes (1 per month)",
      "Dedicated senior therapist assigned for your wellness journey"
    ]
  }
];

export const Sections: React.FC<SectionsProps> = ({
  activeTab,
  setActiveTab,
  activeSection,
  isMuted,
  setIsMuted
}) => {
  // Service filter tab state
  const [therapyCategory, setTherapyCategory] = useState<string>("All");

  // Track user-selected pricing option per service id
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    serviceId: "dry-massage",
    optionIdx: 0,
    date: "2026-07-22",
    time: "10:00",
    notes: ""
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Auto-scrolling indicator for Home Page Sections
  const handleScrollToHomeSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    if (!isMuted) triggerBell();
  };

  // Select a service, option and route to booking page
  const handleSelectServiceForBooking = (serviceId: string, optionIdx: number = 0) => {
    setBookingForm((prev) => ({
      ...prev,
      serviceId,
      optionIdx
    }));
    setActiveTab("contact");
    window.scrollTo({ top: 0, behavior: "instant" });
    if (!isMuted) triggerBell();
  };

  // Handle pricing option selection on a therapy card
  const handleOptionChange = (serviceId: string, idx: number) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [serviceId]: idx
    }));
    if (!isMuted) triggerBell();
  };

  // Form submission handler
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    triggerBell();
  };

  // Reset booking form
  const handleResetBooking = () => {
    setBookingSuccess(false);
    setBookingForm({
      name: "",
      email: "",
      phone: "",
      serviceId: "dry-massage",
      optionIdx: 0,
      date: "2026-07-22",
      time: "10:00",
      notes: ""
    });
  };

  // Calculate booking details dynamically
  const getSelectedBookingDetails = () => {
    const s = services.find((srv) => srv.id === bookingForm.serviceId) || services[0];
    let price = s.price || "₹ 0";
    let duration = s.duration || "N/A";
    let optionName = "";

    if (s.options && s.options[bookingForm.optionIdx]) {
      const opt = s.options[bookingForm.optionIdx];
      price = opt.price;
      duration = opt.duration;
      optionName = opt.name;
    }

    return {
      serviceName: s.name,
      optionName,
      price,
      duration
    };
  };

  const bookingDetails = getSelectedBookingDetails();

  return (
    <div className="relative w-full text-lotus select-none pt-24 sm:pt-28">
      
      {/* =========================================================================
          TAB 1: HOME (5 VERTICAL SCROLLABLE PAGES / SECTIONS)
          ========================================================================= */}
      {activeTab === "home" && (
        <div id="home-page-container" className="w-full">
          
          {/* HOME SECTION 1: HERO / THE SANCTUARY */}
          <section
            id="section-hero"
            className="relative w-full min-h-screen h-auto flex flex-col justify-between px-4 py-10 sm:px-8 sm:py-16 md:px-16 overflow-hidden"
          >
            {/* Background image overlay */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80"
                alt="Spa Sanctuary"
                className="w-full h-full object-cover opacity-35 scale-105 filter blur-[1px]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0c0f0e]/95 via-[#0c0f0e]/85 to-[#0c0f0e]/95" />
              {/* Radial glow overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(185,150,75,0.15)_0%,transparent_70%)]" />
            </div>

            {/* Top Empty Space to offset sticky header */}
            <div className="h-6" />

            {/* Central Typography and Visual Hook */}
            <div className="z-10 my-auto max-w-4xl text-left md:pl-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-brass/10 border border-brass/20 text-brass text-xs md:text-sm tracking-[0.2em] uppercase font-black">
                  <MapPin size={14} />
                  <span>Located in JP Nagar, Bangalore</span>
                </div>
                
                <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[1.08] text-lotus font-light">
                  A Meditative Men's <br />
                  <span className="italic text-brass font-normal">Wellness Sanctuary</span>
                </h1>
                
                <p className="font-sans text-base md:text-lg lg:text-xl text-lotus/90 leading-relaxed max-w-2xl tracking-wide font-light">
                  Reclaim absolute stillness. Nestled in prime JP Nagar, we offer premium male-to-male massage rituals, specialized scrubs, and authentic Ayurvedic therapies designed to restore urban fatigue.
                </p>

                {/* Direct Action Navigation Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 max-w-md sm:max-w-xl">
                  <button
                    onClick={() => {
                      setActiveTab("therapies");
                      window.scrollTo({ top: 0, behavior: "instant" });
                      if (!isMuted) triggerBell();
                    }}
                    className="px-8 py-4 bg-brass hover:bg-lotus text-[#0c0f0e] hover:text-[#0c0f0e] font-sans font-black text-sm tracking-[0.2em] uppercase rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center gap-2.5 group"
                    id="explore-therapies-hero-btn"
                  >
                    <span>🌿 EXPLORE THERAPIES</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("contact");
                      window.scrollTo({ top: 0, behavior: "instant" });
                      if (!isMuted) triggerBell();
                    }}
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 text-lotus border border-white/20 hover:border-brass/50 font-sans font-black text-sm tracking-[0.2em] uppercase rounded-full transition-all duration-300 flex items-center justify-center gap-2.5"
                    id="reserve-session-hero-btn"
                  >
                    <span>📅 RESERVE SESSION</span>
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Bottom Guidance Area */}
            <div className="z-10 flex justify-between items-end w-full border-t border-white/5 pt-4">
              <button
                onClick={() => handleScrollToHomeSection("section-elements")}
                className="flex gap-2 items-center text-xs font-bold font-sans text-stone/80 hover:text-brass transition-colors tracking-widest uppercase cursor-pointer focus:outline-none"
              >
                <Compass size={16} className="animate-spin-slow text-brass" />
                <span>Scroll down downstream</span>
              </button>
              <div className="text-right">
                <span className="font-serif text-xl italic text-brass font-light leading-none block">
                  The Sanctuary of Prana (प्राण)
                </span>
                <span className="font-sans text-xs tracking-[0.25em] text-stone uppercase font-bold">
                  Chapter I
                </span>
              </div>
            </div>
          </section>

          {/* HOME SECTION 2: CORE ELEMENTS (STACKED INDIVIDUAL COLORED CARDS BELOW EACH OTHER) */}
          <section
            id="section-elements"
            className="relative w-full min-h-screen h-auto flex flex-col justify-between px-4 py-12 sm:px-8 md:px-16 bg-gradient-to-b from-[#0c0f0e] via-[#101513] to-[#0c0f0e] overflow-hidden"
          >
            <div className="z-10 max-w-4xl mx-auto w-full my-auto flex flex-col justify-center">
              
              {/* Header */}
              <div className="text-center mb-10">
                <span className="font-sans text-sm tracking-[0.3em] text-brass uppercase font-bold block mb-2">
                  The Path of Alignment
                </span>
                <h2 className="font-serif text-4xl md:text-5xl text-lotus font-light">
                  The Elements of <span className="italic text-brass font-normal">Rejuvenation</span>
                </h2>
              </div>

              {/* STACKED VERTICALLY BELOW EACH OTHER WITH INDIVIDUAL COLORS */}
              <div className="space-y-6 max-w-3xl mx-auto w-full">
                
                {/* Element 1: Relax - Light Warm Amber / Gold */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="flex flex-col md:flex-row gap-4 p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 to-stone-900/30 border border-amber-900/25 hover:border-brass/30 transition-all duration-300"
                  id="home-element-relax"
                >
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-brass shrink-0">
                    <Leaf size={22} />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-brass font-semibold mb-1">
                      🌿 1. Relax (The Forest Grounding)
                    </h3>
                    <p className="font-sans text-sm md:text-base text-lotus/90 leading-relaxed font-light">
                      Unclench your mind and relax your nervous system. Our custom sanctuary spaces are pre-warmed, dimly lit with pure oil lamps, and naturally scented with sandalwood incense to dissolve mental speed immediately.
                    </p>
                  </div>
                </motion.div>

                {/* Element 2: Restore - Rich Terracotta / Copper */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex flex-col md:flex-row gap-4 p-6 rounded-2xl bg-gradient-to-r from-orange-950/40 to-stone-900/30 border border-orange-950/30 hover:border-orange-500/30 transition-all duration-300"
                  id="home-element-restore"
                >
                  <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                    <Droplet size={22} />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-orange-400 font-semibold mb-1">
                      🔥 2. Restore (Deep Tissue Realignment)
                    </h3>
                    <p className="font-sans text-sm md:text-base text-lotus/90 leading-relaxed font-light">
                      Physical recovery from chronic stiffness. Experienced therapists target neck, shoulder knots, posture strains, and lower back aches, utilizing slow, deliberate deep tissue pressure and premium cold-pressed medicated oils.
                    </p>
                  </div>
                </motion.div>

                {/* Element 3: Renew - Deep Serene Indigo / Teal */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex flex-col md:flex-row gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-stone-900/30 border border-emerald-950/30 hover:border-emerald-500/30 transition-all duration-300"
                  id="home-element-renew"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <Flower2 size={22} />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-emerald-400 font-semibold mb-1">
                      🪷 3. Renew (The Lotus Awakening)
                    </h3>
                    <p className="font-sans text-sm md:text-base text-lotus/90 leading-relaxed font-light">
                      Emerge with full somatic restoration. Clear pores, smooth scrub-polished skin, and a completely refreshed spirit. Our therapeutic steam sessions ensure toxins are purged, leaving you fully re-energized.
                    </p>
                  </div>
                </motion.div>

              </div>
            </div>

            {/* Bottom Guidance Area */}
            <div className="z-10 flex justify-between items-end w-full border-t border-white/5 pt-4">
              <button
                onClick={() => handleScrollToHomeSection("section-signature")}
                className="flex gap-2 items-center text-xs font-bold font-sans text-stone/80 hover:text-brass transition-colors tracking-widest uppercase cursor-pointer"
              >
                <span>Descend Downstream</span>
              </button>
              <div className="text-right">
                <span className="font-serif text-xl italic text-brass font-light leading-none block">
                  The Balance of Gunas (गुण)
                </span>
                <span className="font-sans text-xs tracking-[0.25em] text-stone uppercase font-bold">
                  Chapter II
                </span>
              </div>
            </div>
          </section>

          {/* HOME SECTION 3: SIGNATURE CHIME (AYURVEDIC SHIRODHARA & EXQUISITE HOT STONE) */}
          <section
            id="section-signature"
            className="relative w-full min-h-screen h-auto flex flex-col justify-between px-4 py-12 sm:px-8 md:px-16 overflow-hidden"
          >
            {/* Background image overlay */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1600&q=80"
                alt="Ayurvedic Treatment"
                className="w-full h-full object-cover opacity-20 scale-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0c0f0e] via-[#0c0f0e]/90 to-[#0c0f0e]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(185,150,75,0.12)_0%,transparent_60%)]" />
            </div>

            <div className="h-4" />

            <div className="z-10 max-w-5xl mx-auto w-full my-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Traditional Jali Ornament */}
              <div className="lg:col-span-5 hidden lg:block text-center">
                <div className="relative w-72 h-72 mx-auto flex items-center justify-center">
                  <svg viewBox="0 0 400 400" className="w-full h-full object-contain animate-spin-slow">
                    <circle cx="200" cy="200" r="180" fill="none" stroke="#B9964B" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="4 6" />
                    <circle cx="200" cy="200" r="140" fill="none" stroke="#B9964B" strokeWidth="0.75" strokeOpacity="0.4" />
                    <circle cx="200" cy="200" r="100" fill="none" stroke="#B9964B" strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="8 8" />
                    
                    {/* Concentric Petals */}
                    {Array.from({ length: 8 }).map((_, i) => {
                      const angle = (i * Math.PI) / 4;
                      const x1 = 200 + Math.cos(angle) * 100;
                      const y1 = 200 + Math.sin(angle) * 100;
                      const x2 = 200 + Math.cos(angle) * 140;
                      const y2 = 200 + Math.sin(angle) * 140;
                      return (
                        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#B9964B" strokeWidth="0.75" strokeOpacity="0.5" />
                      );
                    })}
                    <path
                      d="M 200,80 C 120,160 120,240 200,320 C 280,240 280,160 200,80 Z"
                      fill="none"
                      stroke="#B9964B"
                      strokeWidth="1.2"
                      strokeOpacity="0.5"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Flower2 className="text-brass animate-pulse" size={32} />
                  </div>
                </div>
              </div>

              {/* Right Column: Narrative */}
              <div className="lg:col-span-7 text-left space-y-6">
                <span className="font-sans text-sm tracking-[0.3em] text-brass uppercase font-bold block">
                  The Authentic Touch
                </span>
                <h2 className="font-serif text-4xl md:text-6xl text-lotus font-light leading-tight">
                  Medicated <br className="hidden md:inline" />
                  <span className="italic text-brass font-normal">Kerala Ayurvedic</span> Rituals
                </h2>
                
                <p className="font-sans text-sm md:text-base lg:text-lg text-lotus/90 leading-relaxed font-light">
                  Experience full body Ayurvedic massages performed with warm, organic medicated oils sourced directly from Kerala. This ancient therapy detoxifies deep muscle layers, improves blood flow, and restores elements of health, concluding with physical steam detoxification.
                </p>

                <div className="space-y-3.5 pt-2">
                  <div className="flex gap-3 items-center text-sm md:text-base text-lotus/95 font-sans">
                    <div className="w-6 h-6 rounded-full bg-brass/10 flex items-center justify-center text-brass shrink-0">
                      <Check size={14} />
                    </div>
                    <span>Done with Medicated Kerala Ayurvedic Oils</span>
                  </div>
                  <div className="flex gap-3 items-center text-sm md:text-base text-lotus/95 font-sans">
                    <div className="w-6 h-6 rounded-full bg-brass/10 flex items-center justify-center text-brass shrink-0">
                      <Check size={14} />
                    </div>
                    <span>Soothing combination of hot steam and custom herbs</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => handleSelectServiceForBooking("ayurvedic-combo-steam")}
                    className="px-8 py-4 bg-brass hover:bg-lotus text-[#0c0f0e] font-sans font-bold text-sm tracking-widest uppercase rounded-full transition-all duration-300 flex items-center gap-2.5"
                    id="ayurvedic-details-btn"
                  >
                    <span>EXPLORE AYURVEDIC SERVICES</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Guidance Area */}
            <div className="z-10 flex justify-between items-end w-full border-t border-white/5 pt-4">
              <button
                onClick={() => handleScrollToHomeSection("section-reflections")}
                className="flex gap-2 items-center text-xs font-bold font-sans text-stone/80 hover:text-brass transition-colors tracking-widest uppercase cursor-pointer"
              >
                <span>Deep Pools of Silence</span>
              </button>
              <div className="text-right">
                <span className="font-serif text-xl italic text-brass font-light leading-none block">
                  The Flow of Rasa (रस)
                </span>
                <span className="font-sans text-xs tracking-[0.25em] text-stone uppercase font-bold">
                  Chapter III
                </span>
              </div>
            </div>
          </section>

          {/* HOME SECTION 4: THE REFLECTION POOL (MIRROR TESTIMONIALS) */}
          <section
            id="section-reflections"
            className="relative w-full min-h-screen h-auto flex flex-col justify-between px-4 py-12 sm:px-8 md:px-16 bg-[#090b0a] overflow-hidden"
          >
            <div className="z-10 max-w-4xl mx-auto w-full my-auto text-center space-y-12">
              <div>
                <span className="font-sans text-sm tracking-[0.3em] text-brass uppercase font-bold block mb-2">
                  Mirror Stillness
                </span>
                <h2 className="font-serif text-4xl md:text-5xl text-lotus font-light">
                  The <span className="italic text-brass font-normal">Reflection</span> Pool
                </h2>
                <p className="font-sans text-sm md:text-base text-stone max-w-xl mx-auto mt-2 tracking-wide font-light">
                  A sanctuary built on trust. Here are the honest voices of gentlemen who found their restoration at Pure Bliss.
                </p>
              </div>

              {/* Testimonials stacked with subtle transitions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
                {testimonialsData.map((t) => (
                  <div
                    key={t.id}
                    className="p-6 rounded-2xl border border-white/5 bg-stone-900/10 frosted-glass flex flex-col justify-between text-left group hover:border-brass/25 transition-all duration-300"
                    id={`home-testi-${t.id}`}
                  >
                    <div className="space-y-4">
                      <div className="flex gap-1 text-brass">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Sparkles key={i} size={13} className="fill-brass" />
                        ))}
                      </div>
                      <p className="font-sans text-sm md:text-base text-lotus/95 leading-relaxed font-light italic">
                        "{t.text}"
                      </p>
                    </div>
                    <div className="border-t border-white/5 pt-4 mt-6">
                      <h4 className="font-serif text-base text-brass font-bold">{t.name}</h4>
                      <p className="font-sans text-xs text-stone tracking-wider uppercase font-semibold">{t.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Guidance Area */}
            <div className="z-10 flex justify-between items-end w-full border-t border-white/5 pt-4">
              <button
                onClick={() => handleScrollToHomeSection("section-sanctuary")}
                className="flex gap-2 items-center text-xs font-bold font-sans text-stone/80 hover:text-brass transition-colors tracking-widest uppercase cursor-pointer"
              >
                <span>Arrive at Sanctuary</span>
              </button>
              <div className="text-right">
                <span className="font-serif text-xl italic text-brass font-light leading-none block">
                  The Mirror of Dhyana (ध्यान)
                </span>
                <span className="font-sans text-xs tracking-[0.25em] text-stone uppercase font-bold">
                  Chapter IV
                </span>
              </div>
            </div>
          </section>

          {/* HOME SECTION 5: SANCTUARY OVERVIEW (JP NAGAR LOCATION DETAIL & CONTACT ROUTE) */}
          <section
            id="section-sanctuary"
            className="relative w-full min-h-screen h-auto flex flex-col justify-between px-4 py-12 sm:px-8 md:px-16 bg-gradient-to-b from-[#0c0f0e] to-[#080a09] overflow-hidden"
          >
            <div className="z-10 max-w-5xl mx-auto w-full my-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              
              {/* Left Column: Sanctuary Pitch */}
              <div className="text-left space-y-6">
                <span className="font-sans text-sm tracking-[0.3em] text-brass uppercase font-bold block">
                  The Ultimate Destination
                </span>
                <h2 className="font-serif text-4xl md:text-6xl text-lotus font-light leading-tight">
                  Located in the <br />
                  <span className="italic text-brass font-normal">Heart of JP Nagar</span>
                </h2>
                
                <p className="font-sans text-sm md:text-base lg:text-lg text-lotus/90 leading-relaxed font-light">
                  A premium, ultra-discreet space tailored specifically for men's wellness. Situated in a highly residential, elegant area of JP Nagar 2nd Phase, Bangalore, our private hygienic suites offer safe, certified professional care.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-brass text-xs md:text-sm tracking-wider font-bold block uppercase">Metro Proximity</span>
                    <span className="text-xs md:text-sm text-stone">Opposite JP Nagar Metro Station (1 Min walk)</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-brass text-xs md:text-sm tracking-wider font-bold block uppercase">Pristine Hygiene</span>
                    <span className="text-xs md:text-sm text-stone">Individual private suites with private showers</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => {
                      setActiveTab("contact");
                      window.scrollTo({ top: 0, behavior: "instant" });
                      if (!isMuted) triggerBell();
                    }}
                    className="px-6 py-3.5 bg-brass hover:bg-lotus text-[#0c0f0e] font-sans font-bold text-xs md:text-sm tracking-widest uppercase rounded-full transition-all duration-300"
                    id="home-book-final-btn"
                  >
                    📅 BOOK APPOINTMENT
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("about");
                      window.scrollTo({ top: 0, behavior: "instant" });
                      if (!isMuted) triggerBell();
                    }}
                    className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-lotus border border-white/15 hover:border-brass/40 font-sans font-bold text-xs md:text-sm tracking-widest uppercase rounded-full transition-all duration-300"
                    id="home-about-final-btn"
                  >
                    🌿 ABOUT THE SPA
                  </button>
                </div>
              </div>

              {/* Right Column: Location Box Widget */}
              <div className="p-8 rounded-3xl border border-white/5 bg-stone-900/15 frosted-glass space-y-6 text-left">
                <h3 className="font-serif text-3xl text-lotus font-light">Sanctuary Details</h3>
                
                <div className="space-y-5">
                  <div className="flex gap-3 items-start text-sm md:text-base font-sans">
                    <MapPin className="text-brass shrink-0 mt-0.5" size={18} />
                    <div>
                      <strong className="text-brass font-bold block">JP Nagar Address</strong>
                      <span className="text-lotus/90 font-light block mb-2">
                        Pure Bliss Wellness, 34/A, 15th Cross Rd, Outer Ring Rd, JP Nagar 2nd Phase, Bangalore - 560078
                      </span>
                      <a
                        href="https://maps.app.goo.gl/e5pfzqbjtzHXpE9WA?g_st=awb"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brass/15 hover:bg-brass/25 border border-brass/30 text-brass text-xs font-bold tracking-wider uppercase transition-all duration-300"
                        id="home-gmaps-link"
                      >
                        <Navigation size={13} />
                        <span>View on Google Maps</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start text-sm md:text-base font-sans">
                    <Phone className="text-brass shrink-0 mt-0.5" size={18} />
                    <div>
                      <strong className="text-brass font-bold block">Reserve Over Call</strong>
                      <span className="text-lotus/90 font-light">+91 98860 12345 / +91 80 4567 8910</span>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start text-sm md:text-base font-sans">
                    <Clock className="text-brass shrink-0 mt-0.5" size={18} />
                    <div>
                      <strong className="text-brass font-bold block">Working Hours</strong>
                      <span className="text-lotus/90 font-light">10:00 AM - 9:00 PM (Everyday)</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 text-xs font-sans text-stone tracking-wider uppercase font-bold text-center">
                  ✨ MEN'S PRIVACY & DISCRETION GUARANTEED
                </div>
              </div>

            </div>

            {/* Bottom Area */}
            <div className="z-10 flex justify-between items-end w-full border-t border-white/5 pt-4">
              <span className="text-xs font-bold font-sans text-stone/60 tracking-widest uppercase">
                © 2026 PURE BLISS WELLNESS
              </span>
              <div className="text-right">
                <span className="font-serif text-xl italic text-brass font-light leading-none block">
                  The Arriving of Samadhi (समाधि)
                </span>
                <span className="font-sans text-xs tracking-[0.25em] text-stone uppercase font-bold">
                  Chapter V
                </span>
              </div>
            </div>
          </section>

        </div>
      )}

      {/* =========================================================================
          TAB 2: THERAPIES & PRICING
          ========================================================================= */}
      {activeTab === "therapies" && (
        <section id="therapies-section" className="max-w-7xl mx-auto px-6 py-12 md:px-12 text-center">
          
          <div className="max-w-3xl mx-auto space-y-4 mb-12">
            <span className="font-sans text-sm tracking-[0.3em] text-brass uppercase font-black block">
              The Sacred Healing Menu
            </span>
            <h1 className="font-serif text-5xl md:text-6xl text-lotus font-light leading-tight">
              Therapeutic Core <span className="italic text-brass font-normal">Services</span>
            </h1>
            <p className="font-sans text-base md:text-lg text-lotus/85 max-w-2xl mx-auto font-light leading-relaxed">
              Fully optimized, professional therapies catalog. Explore our diverse array of dry treatments, customized oil massages, body scrubs, combinations, and authentic 4-hand luxury.
            </p>
          </div>

          {/* Filtering Category Tabs */}
          <div className="flex flex-wrap gap-2.5 justify-center mb-10 max-w-3xl mx-auto">
            {["All", "Classic", "Ayurvedic", "Combos", "Four Hands", "Add-Ons"].map((cat) => {
              const isActive = therapyCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setTherapyCategory(cat);
                    if (!isMuted) triggerBell();
                  }}
                  className={`px-5 py-2.5 rounded-full font-sans font-bold text-xs md:text-sm tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-brass text-[#0c0f0e] shadow-xl font-black scale-105"
                      : "bg-white/5 text-lotus hover:bg-white/10 border border-white/5"
                  }`}
                  id={`cat-filter-tab-${cat.replace(" ", "-").toLowerCase()}`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Core Services Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services
              .filter((srv) => therapyCategory === "All" || srv.category === therapyCategory)
              .map((srv) => {
                // Get chosen option index, fallback to 0
                const selectedOptIdx = selectedOptions[srv.id] || 0;
                
                // Determine display price and duration
                let displayPrice = srv.price || "";
                let displayDuration = srv.duration || "";
                let displayOptionName = "";

                if (srv.options && srv.options[selectedOptIdx]) {
                  const opt = srv.options[selectedOptIdx];
                  displayPrice = opt.price;
                  displayDuration = opt.duration;
                  displayOptionName = opt.name;
                }

                // Match specific backgrounds per categories for visual premium richness
                const categoryColorGradients: Record<string, string> = {
                  Classic: "from-amber-950/20 via-stone-900/10 to-[#0c0f0e]",
                  Ayurvedic: "from-emerald-950/25 via-stone-900/10 to-[#0c0f0e]",
                  Combos: "from-orange-950/25 via-stone-900/10 to-[#0c0f0e]",
                  "Four Hands": "from-red-950/25 via-stone-900/10 to-[#0c0f0e]",
                  "Add-Ons": "from-stone-800/20 via-stone-900/10 to-[#0c0f0e]"
                };

                const cardGradient = categoryColorGradients[srv.category] || "from-stone-900/40 to-stone-900/10";

                return (
                  <motion.div
                    key={srv.id}
                    layout
                    whileHover={{ y: -6 }}
                    className={`p-6 rounded-3xl border border-white/5 bg-gradient-to-b ${cardGradient} frosted-glass flex flex-col justify-between text-left shadow-xl hover:border-brass/20 transition-all duration-300 relative overflow-hidden`}
                    id={`service-card-${srv.id}`}
                  >
                    <div>
                      {/* Top Meta info badges */}
                      <div className="flex justify-between items-center mb-4">
                        <span className="px-3 py-1 rounded-md bg-white/5 text-stone text-xs tracking-wider font-bold uppercase border border-white/5">
                          {srv.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-brass">
                          <Clock size={14} />
                          <span className="font-sans text-xs md:text-sm font-bold uppercase tracking-wider">
                            {displayDuration}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-serif text-3xl text-lotus font-bold mb-2 group-hover:text-brass transition-colors">
                        {srv.name}
                      </h3>
                      
                      <p className="font-sans text-sm md:text-base text-lotus/85 leading-relaxed font-light mb-6">
                        {srv.description}
                      </p>

                      {/* MULTI-TIER PRICING pill options if available */}
                      {srv.options && srv.options.length > 0 && (
                        <div className="space-y-2 mb-6">
                          <span className="text-xs tracking-wider text-brass uppercase font-bold block">
                            Select Session Tier:
                          </span>
                          <div className="flex flex-col gap-1.5">
                            {srv.options.map((opt, oIdx) => {
                              const isSelected = selectedOptIdx === oIdx;
                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => handleOptionChange(srv.id, oIdx)}
                                  className={`px-3.5 py-2.5 rounded-lg text-left font-sans text-xs md:text-sm font-semibold tracking-wide transition-all border flex justify-between items-center cursor-pointer ${
                                    isSelected
                                      ? "bg-brass/10 border-brass/50 text-brass font-black"
                                      : "bg-white/5 border-white/5 hover:bg-white/10 text-lotus/80"
                                  }`}
                                  id={`opt-btn-${srv.id}-${oIdx}`}
                                >
                                  <span>{opt.name}</span>
                                  <span className="text-xs md:text-sm font-bold">{opt.price}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Benefits checklist */}
                      <div className="space-y-2.5 border-t border-white/5 pt-4 mb-6">
                        <span className="text-xs tracking-wider text-stone uppercase font-bold block">
                          Key Benefits:
                        </span>
                        {srv.benefits.map((benefit, bIdx) => (
                          <div key={bIdx} className="flex gap-2.5 items-start text-xs md:text-sm font-sans text-lotus/90">
                            <div className="w-4 h-4 rounded-full bg-brass/10 border border-brass/15 flex items-center justify-center text-brass shrink-0 mt-0.5">
                              <Check size={11} />
                            </div>
                            <span className="font-light">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing Display and Action */}
                    <div className="border-t border-white/5 pt-4 flex items-center justify-between mt-auto">
                      <div className="space-y-0.5">
                        <span className="text-xs text-stone tracking-wider uppercase font-bold block">Total Price</span>
                        <span className="font-serif text-3xl text-brass font-black tracking-tight">{displayPrice}</span>
                      </div>
                      
                      <button
                        onClick={() => handleSelectServiceForBooking(srv.id, selectedOptIdx)}
                        className="px-5 py-3 bg-brass hover:bg-lotus text-[#0c0f0e] font-sans font-black text-xs md:text-sm tracking-wider uppercase rounded-full transition-all duration-300 flex items-center gap-1.5"
                        id={`card-book-btn-${srv.id}`}
                      >
                        <span>BOOK NOW</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 3: MEMBERSHIPS & COMBOS
          ========================================================================= */}
      {activeTab === "memberships" && (
        <section id="memberships-section" className="max-w-7xl mx-auto px-6 py-12 md:px-12 text-center">
          
          <div className="max-w-3xl mx-auto space-y-4 mb-16">
            <span className="font-sans text-sm tracking-[0.3em] text-brass uppercase font-black block">
              Elevate Your Routine
            </span>
            <h1 className="font-serif text-5xl md:text-6xl text-lotus font-light leading-tight">
              Wellness Memberships & <span className="italic text-brass font-normal">Combos</span>
            </h1>
            <p className="font-sans text-base md:text-lg text-lotus/85 max-w-2xl mx-auto font-light leading-relaxed">
              We understand that physical restoration is best maintained. Step onto our wood deck memberships or enjoy synchronized multithermic scrub combinations.
            </p>
          </div>

          {/* Memberships Cards Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch mb-16">
            {membershipsData.map((m) => {
              const planBorders: Record<string, string> = {
                "Sadhana Pass": "border-white/10 bg-gradient-to-b from-[#111] to-[#0c0f0e]",
                "Prana Circle": "border-brass/35 bg-gradient-to-b from-amber-950/20 to-[#0c0f0e] shadow-2xl",
                "Samadhi Circle": "border-[#9d174d]/30 bg-gradient-to-b from-purple-950/25 to-[#0c0f0e]"
              };

              const planBadgeColor: Record<string, string> = {
                "Sadhana Pass": "bg-white/5 text-lotus",
                "Prana Circle": "bg-brass/20 text-brass border border-brass/30",
                "Samadhi Circle": "bg-purple-500/15 text-purple-400 border border-purple-500/25"
              };

              const borderTheme = planBorders[m.name] || "border-white/5 bg-stone-950";
              const badgeTheme = planBadgeColor[m.name] || "bg-white/5 text-stone";

              return (
                <div
                  key={m.id}
                  className={`p-8 rounded-3xl border ${borderTheme} flex flex-col justify-between text-left group transition-all duration-300 relative overflow-hidden`}
                  id={`membership-${m.id}`}
                >
                  {/* Highlight for Prana Circle */}
                  {m.name === "Prana Circle" && (
                    <div className="absolute top-0 right-0 px-3.5 py-1.5 bg-brass text-[#0c0f0e] text-xs tracking-widest uppercase font-black rounded-bl-xl">
                      POPULAR CHOICE
                    </div>
                  )}

                  <div>
                    <div className="mb-6">
                      <span className={`px-3 py-1.5 rounded-md text-xs tracking-wider uppercase font-bold ${badgeTheme}`}>
                        {m.name}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span className="font-serif text-5xl text-brass font-black tracking-tight">{m.price}</span>
                      <span className="text-sm text-stone tracking-wide">/ {m.period}</span>
                    </div>

                    <p className="font-sans text-sm md:text-base text-lotus/85 leading-relaxed font-light mb-6">
                      {m.description}
                    </p>

                    <div className="space-y-3.5 border-t border-white/5 pt-5 mb-8">
                      {m.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex gap-3 items-start text-sm md:text-base font-sans text-lotus/90">
                          <div className="w-5 h-5 rounded-full bg-brass/10 flex items-center justify-center text-brass shrink-0 mt-0.5">
                            <Check size={13} />
                          </div>
                          <span className="font-light">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setBookingForm((prev) => ({
                        ...prev,
                        notes: `Enquiring for membership: ${m.name}`
                      }));
                      setActiveTab("contact");
                      window.scrollTo({ top: 0, behavior: "instant" });
                      if (!isMuted) triggerBell();
                    }}
                    className="w-full py-3.5 bg-brass hover:bg-lotus text-[#0c0f0e] font-sans font-black text-xs md:text-sm tracking-widest uppercase rounded-full transition-all duration-300 text-center"
                    id={`member-btn-${m.id}`}
                  >
                    ACTIVATE MEMBERSHIP
                  </button>
                </div>
              );
            })}
          </div>

          {/* Combos Spotlight Area */}
          <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-gradient-to-r from-orange-950/30 to-stone-900/20 border border-orange-950/40 text-left space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400">
                <Flame size={24} />
              </div>
              <div>
                <span className="text-xs tracking-widest text-orange-400 uppercase font-black block">EXQUISITE SCRUB PACKAGES</span>
                <h3 className="font-serif text-3xl text-lotus font-bold">The Dual-Therapist Combo Experience</h3>
              </div>
            </div>
            <p className="font-sans text-sm md:text-base text-lotus/90 leading-relaxed font-light">
              We offer ultimate physical luxury with two therapists working simultaneously in perfect physical choreographies. Combining customized scrub body-polishing with deep-tissue muscle relaxation, this is the finest treatment to purge dead skin cells and fully re-energize structural muscles.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setTherapyCategory("Combos");
                  setActiveTab("therapies");
                  window.scrollTo({ top: 0, behavior: "instant" });
                  if (!isMuted) triggerBell();
                }}
                className="px-7 py-3.5 bg-orange-600 hover:bg-orange-500 text-lotus font-sans font-bold text-xs md:text-sm tracking-widest uppercase rounded-full transition-all duration-300"
                id="explore-combos-btn"
              >
                VIEW COMBOS & DUAL-THERAPIST RATES
              </button>
            </div>
          </div>

        </section>
      )}

      {/* =========================================================================
          TAB 4: ABOUT SANCTUARY
          ========================================================================= */}
      {activeTab === "about" && (
        <section id="about-section" className="max-w-6xl mx-auto px-6 py-12 md:px-12 text-left space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Description */}
            <div className="space-y-6">
              <span className="font-sans text-sm tracking-[0.3em] text-brass uppercase font-black block">
                Men's Premier Spa
              </span>
              <h1 className="font-serif text-5xl md:text-6xl text-lotus font-light leading-tight">
                About Pure Bliss Wellness <br />
                <span className="italic text-brass font-normal">Sanctuary</span>
              </h1>
              <p className="font-sans text-base md:text-lg text-lotus/85 leading-relaxed font-light">
                Pure Bliss Wellness is JP Nagar’s premier male-to-male spa, dedicated to providing professional, discreet, and tailored massage therapies. We offer a modern sanctuary where men can genuinely unwind and recharge.
              </p>
              <p className="font-sans text-base md:text-lg text-lotus/85 leading-relaxed font-light">
                Our facilities are engineered to provide absolute safety, pristine physical hygiene, and deep thermal purification. We believe in providing personalized care, adjusting pressure, oil properties, and heat levels to your exact lifestyle strains.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <div className="flex gap-2.5 items-center text-sm md:text-base font-sans text-brass">
                  <ShieldCheck size={18} />
                  <span>100% Certified Professionals</span>
                </div>
                <div className="flex gap-2.5 items-center text-sm md:text-base font-sans text-brass">
                  <ShieldCheck size={18} />
                  <span>Discreet residential locality</span>
                </div>
              </div>
            </div>

            {/* Visual Lounge Frame */}
            <div className="relative rounded-3xl overflow-hidden border border-white/5 shadow-2xl h-96">
              <img
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80"
                alt="Spa Sanctuary Reception"
                className="w-full h-full object-cover filter brightness-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f0e]/95 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#0c0f0e]/80 border border-white/5 text-center">
                <span className="font-serif text-sm italic text-brass">A pristine environment designed specifically for gentlemen's relaxation</span>
              </div>
            </div>

          </div>

          {/* Pillars of Sanctuary Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
              <div className="w-12 h-12 rounded-full bg-brass/15 flex items-center justify-center text-brass">
                <Award size={22} />
              </div>
              <h3 className="font-serif text-2xl text-lotus">Expert Male Therapists</h3>
              <p className="font-sans text-sm md:text-base text-lotus/80 leading-relaxed font-light">
                Our certified professionals are skilled in a wide range of techniques, from Swedish and Deep Tissue to authentic Ayurveda, ensuring the perfect treatment for your needs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
              <div className="w-12 h-12 rounded-full bg-brass/15 flex items-center justify-center text-brass">
                <ShieldCheck size={22} />
              </div>
              <h3 className="font-serif text-2xl text-lotus">Premium & Discreet</h3>
              <p className="font-sans text-sm md:text-base text-lotus/80 leading-relaxed font-light">
                Experience tranquility in our hygienic, private spaces designed specifically for men, using only high-quality oils and products for your comfort and well-being.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
              <div className="w-12 h-12 rounded-full bg-brass/15 flex items-center justify-center text-brass">
                <Activity size={22} />
              </div>
              <h3 className="font-serif text-2xl text-lotus">Tailored For Men</h3>
              <p className="font-sans text-sm md:text-base text-lotus/80 leading-relaxed font-light">
                We understand the male physique. Every service, from quick relief to full-body wellness, is customized to address your specific stress points and recovery goals.
              </p>
            </div>

          </div>

        </section>
      )}

      {/* =========================================================================
          TAB 5: BOOKING & LOCATION (RESERVE & FIND US)
          ========================================================================= */}
      {activeTab === "contact" && (
        <section id="contact-section" className="max-w-7xl mx-auto px-6 py-12 md:px-12 text-left">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="font-sans text-sm tracking-[0.3em] text-brass uppercase font-black block">
              Direct Reservation
            </span>
            <h1 className="font-serif text-5xl md:text-6xl text-lotus font-light">
              Reserve Your <span className="italic text-brass font-normal">Session</span>
            </h1>
            <p className="font-sans text-sm md:text-base text-stone font-light">
              Submit your preferred details below. Our reservation officer will coordinate with you over call within 10 minutes to lock your suite.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Interactive Form */}
            <div className="lg:col-span-7 bg-stone-900/10 border border-white/5 rounded-3xl p-6 md:p-8 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {!bookingSuccess ? (
                  <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleBookingSubmit}
                    className="space-y-6"
                    id="booking-form-element"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs tracking-wider text-brass uppercase font-bold block">Your Name</label>
                        <input
                          type="text"
                          required
                          value={bookingForm.name}
                          onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                          placeholder="e.g. Narasimha Bhat"
                          className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-lotus text-sm font-sans font-medium focus:border-brass/50 focus:outline-none focus:ring-0 transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs tracking-wider text-brass uppercase font-bold block">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={bookingForm.phone}
                          onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                          placeholder="e.g. +91 98860 12345"
                          className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-lotus text-sm font-sans font-medium focus:border-brass/50 focus:outline-none focus:ring-0 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs tracking-wider text-brass uppercase font-bold block">Email Address</label>
                      <input
                        type="email"
                        required
                        value={bookingForm.email}
                        onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                        placeholder="e.g. client@domain.com"
                        className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-lotus text-sm font-sans font-medium focus:border-brass/50 focus:outline-none focus:ring-0 transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs tracking-wider text-brass uppercase font-bold block">Select Therapy</label>
                        <select
                          value={bookingForm.serviceId}
                          onChange={(e) => {
                            setBookingForm({
                              ...bookingForm,
                              serviceId: e.target.value,
                              optionIdx: 0 // Reset option tier index when service shifts
                            });
                          }}
                          className="w-full px-4 py-3.5 rounded-xl bg-stone-900/90 border border-white/10 text-lotus text-sm font-sans font-medium focus:border-brass/50 focus:outline-none focus:ring-0 transition-colors"
                        >
                          {services.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Dropdown for custom tiers if available */}
                      <div className="space-y-1.5">
                        <label className="text-xs tracking-wider text-brass uppercase font-bold block">Session Tier</label>
                        {(() => {
                          const activeSrv = services.find((s) => s.id === bookingForm.serviceId) || services[0];
                          if (activeSrv.options && activeSrv.options.length > 0) {
                            return (
                              <select
                                value={bookingForm.optionIdx}
                                onChange={(e) => setBookingForm({ ...bookingForm, optionIdx: parseInt(e.target.value, 10) })}
                                className="w-full px-4 py-3.5 rounded-xl bg-stone-900/90 border border-white/10 text-lotus text-sm font-sans font-medium focus:border-brass/50 focus:outline-none focus:ring-0 transition-colors"
                              >
                                {activeSrv.options.map((opt, oIdx) => (
                                  <option key={oIdx} value={oIdx}>
                                    {opt.name} ({opt.price})
                                  </option>
                                ))}
                              </select>
                            );
                          } else {
                            return (
                              <div className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-stone text-sm font-sans font-medium">
                                Standard Session ({activeSrv.duration || "N/A"})
                              </div>
                            );
                          }
                        })()}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs tracking-wider text-brass uppercase font-bold block">Appointment Date</label>
                        <input
                          type="date"
                          required
                          value={bookingForm.date}
                          onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl bg-[#0c0f0e] border border-white/10 text-lotus text-sm font-sans font-medium focus:border-brass/50 focus:outline-none focus:ring-0 transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs tracking-wider text-brass uppercase font-bold block">Preferred Time</label>
                        <input
                          type="time"
                          required
                          value={bookingForm.time}
                          onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl bg-[#0c0f0e] border border-white/10 text-lotus text-sm font-sans font-medium focus:border-brass/50 focus:outline-none focus:ring-0 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs tracking-wider text-brass uppercase font-bold block">Special Strains / Preferences (Optional)</label>
                      <textarea
                        rows={3}
                        value={bookingForm.notes}
                        onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                        placeholder="Detail any back strain, neck stiffness, specific massage pressure request..."
                        className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-lotus text-sm font-sans font-medium focus:border-brass/50 focus:outline-none focus:ring-0 transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-brass hover:bg-lotus text-[#0c0f0e] font-sans font-black text-xs md:text-sm tracking-widest uppercase rounded-full transition-all duration-300 shadow-xl flex items-center justify-center gap-2.5"
                      id="submit-booking-form-btn"
                    >
                      <span>RESERVE SANCTUARY SUITE</span>
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 text-center space-y-6"
                    id="booking-success-message"
                  >
                    <div className="w-20 h-20 rounded-full bg-brass/10 border border-brass/35 flex items-center justify-center text-brass mx-auto animate-bounce">
                      <Flower2 size={36} />
                    </div>
                    
                    <div className="space-y-2">
                      <h2 className="font-serif text-3xl text-lotus font-bold">Reserving Flow Locked</h2>
                      <p className="font-sans text-sm text-stone max-w-sm mx-auto leading-relaxed">
                        Thank you, <strong className="text-brass font-bold">{bookingForm.name}</strong>. Your wellness reservation request has been registered in our JP Nagar branch database.
                      </p>
                    </div>

                    {/* Booking summary ticket */}
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 max-w-md mx-auto text-left space-y-3 font-sans text-sm">
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-stone font-bold uppercase">Sanctuary Branch</span>
                        <span className="text-brass font-bold">JP Nagar 2nd Phase</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone">Session Selected</span>
                        <span className="text-lotus font-semibold">{bookingDetails.serviceName}</span>
                      </div>
                      {bookingDetails.optionName && (
                        <div className="flex justify-between">
                          <span className="text-stone">Selected Tier</span>
                          <span className="text-lotus font-semibold">{bookingDetails.optionName}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-stone">Session Duration</span>
                        <span className="text-brass font-bold">{bookingDetails.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone">Session Cost</span>
                        <span className="text-brass font-black">{bookingDetails.price}</span>
                      </div>
                      <div className="flex justify-between border-t border-white/5 pt-2">
                        <span className="text-stone">Scheduled Date</span>
                        <span className="text-lotus font-semibold">{bookingForm.date} @ {bookingForm.time}</span>
                      </div>
                    </div>

                    <p className="text-xs font-sans text-brass tracking-wider uppercase font-semibold">
                      ⚡ GENTLEMEN: EXPECT OUR CHIME CALL IN 10 MINUTES
                    </p>

                    <button
                      onClick={handleResetBooking}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 text-lotus border border-white/10 rounded-full font-sans font-bold text-xs md:text-sm tracking-wider uppercase"
                    >
                      Book Another Therapy
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: Real-Time Price Calculator Widget & Location */}
            <div className="lg:col-span-5 space-y-8 text-left">
              
              {/* Dynamic Price Calculator Card */}
              {!bookingSuccess && (
                <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/20 to-stone-900/10 border border-brass/20 frosted-glass space-y-4">
                  <span className="text-xs tracking-widest text-brass uppercase font-black block">LIVE PRICING RECKONER</span>
                  <h3 className="font-serif text-3xl text-lotus font-bold">Session Cost Summary</h3>
                  
                  <div className="space-y-3 font-sans text-sm">
                    <div className="flex justify-between">
                      <span className="text-stone">Therapy Selection</span>
                      <span className="text-lotus font-semibold">{bookingDetails.serviceName}</span>
                    </div>
                    {bookingDetails.optionName && (
                      <div className="flex justify-between">
                        <span className="text-stone">Selected Option</span>
                        <span className="text-lotus font-semibold">{bookingDetails.optionName}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-stone">Session Duration</span>
                      <span className="text-brass font-bold">{bookingDetails.duration}</span>
                    </div>
                    <div className="h-[1px] bg-white/5 my-2" />
                    <div className="flex justify-between items-baseline">
                      <span className="text-stone font-bold uppercase">Estimated Bill</span>
                      <span className="font-serif text-4xl text-brass font-black tracking-tight">{bookingDetails.price}</span>
                    </div>
                  </div>
                  <p className="text-xs font-sans text-stone/75 leading-relaxed font-light">
                    * No oils or creams used in Dry massage. For Swedish/Aroma/Deep tissue, custom cold-pressed premium oils are infused. Steam bath adds are fully private.
                  </p>
                </div>
              )}

              {/* Geographic Coordinates & Contacts */}
              <div className="p-6 rounded-3xl border border-white/5 bg-[#0c0f0e] space-y-5">
                <div className="flex items-center gap-2.5">
                  <MapPin size={20} className="text-brass" />
                  <h3 className="font-serif text-2xl text-lotus">Pure Bliss JP Nagar</h3>
                </div>

                <div className="space-y-4 font-sans text-sm">
                  <div className="space-y-1">
                    <strong className="text-brass font-bold uppercase block text-xs">Prime Location</strong>
                    <p className="text-lotus/90 font-light leading-relaxed mb-2">
                      Pure Bliss Wellness, 34/A, 15th Cross Rd, Outer Ring Rd, JP Nagar 2nd Phase, Bangalore - 560078
                    </p>
                    <a
                      href="https://maps.app.goo.gl/e5pfzqbjtzHXpE9WA?g_st=awb"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brass/15 hover:bg-brass/25 border border-brass/30 text-brass text-xs font-bold tracking-wider uppercase transition-all duration-300"
                      id="contact-gmaps-direct-btn"
                    >
                      <Navigation size={13} />
                      <span>Get Directions on Google Maps</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>

                  <div className="space-y-1">
                    <strong className="text-brass font-bold uppercase block text-xs">Landmark Guidance</strong>
                    <p className="text-stone font-light leading-relaxed">
                      Conveniently situated right opposite the JP Nagar Metro Station. 1-minute walking distance. Discreet residential luxury building with private rear-end parking.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <strong className="text-brass font-bold uppercase block text-xs">Direct Hotlines</strong>
                    <p className="text-lotus/90 font-light">
                      📞 +91 98860 12345 <br />
                      📞 +91 80 4567 8910
                    </p>
                  </div>

                  <div className="space-y-1">
                    <strong className="text-brass font-bold uppercase block text-xs">Email Queries</strong>
                    <p className="text-stone font-light">bookings@pureblisswellness.in</p>
                  </div>
                </div>

                {/* Interactive Map Link Container */}
                <a
                  href="https://maps.app.goo.gl/e5pfzqbjtzHXpE9WA?g_st=awb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-full h-48 rounded-2xl overflow-hidden border border-brass/20 group cursor-pointer block"
                  id="contact-map-widget-link"
                >
                  <div className="absolute inset-0 bg-[#161a19] group-hover:bg-[#1f2623] transition-colors flex flex-col justify-center items-center text-center p-4 space-y-2.5">
                    {/* SVG Vector Map Motif */}
                    <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-brass/40 stroke-[0.5] fill-none group-hover:scale-110 transition-transform">
                      <rect x="10" y="10" width="80" height="80" rx="4" />
                      <line x1="10" y1="50" x2="90" y2="50" />
                      <line x1="50" y1="10" x2="50" y2="90" />
                      <circle cx="50" cy="50" r="10" stroke="#B9964B" strokeOpacity="0.8" fill="#B9964B" fillOpacity="0.2" className="animate-pulse" />
                      <circle cx="50" cy="50" r="2.5" fill="#B9964B" />
                    </svg>
                    <span className="font-serif text-base text-brass italic">GPS Coordinates & Direct Navigation</span>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brass text-[#0c0f0e] font-sans text-xs tracking-wider uppercase font-black group-hover:scale-105 transition-all shadow-lg">
                      <Navigation size={13} />
                      <span>Open Google Maps</span>
                      <ExternalLink size={12} />
                    </div>
                  </div>
                </a>
              </div>

            </div>

          </div>

        </section>
      )}

    </div>
  );
};
