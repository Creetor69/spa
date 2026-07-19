import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, VolumeX, Sparkles, MapPin, Calendar, Clock, Check, ArrowRight, X, Compass, Leaf, Droplet, Flower2 } from "lucide-react";
import { Service, Testimonial, MembershipPlan } from "../types";
import { initAudio, setWaterVolume, triggerBell } from "../utils/audioSynth";

interface SectionsProps {
  activeSection: number;
  setActiveSection: (idx: number) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
}

// Solid, realistic, gorgeous details for Pure Bliss
const servicesData: Service[] = [
  {
    id: "sig-bliss",
    name: "Abhyanga Shirodhara Ritual",
    duration: "90 Minutes",
    price: "₹7,500",
    benefits: [
      "Synchronized four-hand warm herbalized sesame oil massage",
      "Continuous, rhythmic streaming of medicated tailam onto the Ajna Chakra",
      "Soothes the central nervous system and clears mental fog",
      "Concludes with a resonant brass singing bowl sound alignment"
    ],
    description: "Our signature ancient ceremony. Two synchronized therapists utilize warm, therapeutic herbalized oils pressed into marma points, followed by a steady, hypnotic flow of warm oil over the third eye to induce deep meditative sleep."
  },
  {
    id: "aroma-flow",
    name: "Marma Chikitsa & Kansa Massage",
    duration: "75 Minutes",
    price: "₹6,200",
    benefits: [
      "Detoxifies cells using pure bronze Kansa wand massage",
      "Infused with wild Himalayan cedarwood, Kashmiri saffron & blue lotus oils",
      "Re-establishes flow along 107 vital energy points",
      "Includes dry ginger and sand compress to relieve joint stiffness"
    ],
    description: "A highly restorative sensory therapy. Utilizing the sacred 'healing metal' Kansa dome alongside cold-pressed rare botanicals, this ritual balances your body's three doshas, promoting absolute stillness."
  },
  {
    id: "abhyanga-cleanse",
    name: "Pinda Sweda Poultice Therapy",
    duration: "90 Minutes",
    price: "₹8,200",
    benefits: [
      "Rhythmic massage with warm herbal poultices (Shastika Shali rice & milk)",
      "Infused with organic ashwagandha, bala, and fresh turmeric roots",
      "Eases chronic muscular aches and nourishes deep tissues",
      "Includes an aromatic forest sandalwood facial compress"
    ],
    description: "An authentic, deeply nourishing physical renewal. We bind medicinal red rice and raw Ayurvedic herbs in unbleached organic linen poultices, steep them in hot medicated milk, and rhythmically pat and massage them into the body."
  }
];

const testimonialsData: Testimonial[] = [
  {
    id: "t1",
    name: "Priyamvada Sharma",
    role: "Vipassana Retreat Facilitator",
    text: "Pure Bliss is an authentic sanctuary. The synchronized Abhyanga flow followed by the warm Shirodhara stream on my forehead felt like a cellular wash. It is the finest Ayurvedic care outside of Kerala."
  },
  {
    id: "t2",
    name: "Devendra Rathore",
    role: "Classical Musician",
    text: "The sheer attention to design, the slow-flowing water, and the copper bell resonance put me in an immediate state of raga-like calm. It is a masterpiece of sacred wellness."
  },
  {
    id: "t3",
    name: "Dr. Arundhati Sen",
    role: "Integrative Wellness Scholar",
    text: "The combination of classical Shastras, authentic organic oils, and absolute silence of the environment makes this the ultimate antidote to urban exhaustion. They honor the wisdom of the Vedas."
  }
];

const membershipsData: MembershipPlan[] = [
  {
    id: "m1",
    name: "Sadhana Pass",
    price: "₹6,500",
    period: "Month",
    description: "A monthly ritual of rest to anchor your busy modern schedule.",
    features: [
      "1 Custom 75-Min Marma Therapy per month",
      "Unlimited access to the Forest Sandalwood Steam Room",
      "Traditional Kansa face-massage oil bottle",
      "10% off any additional specialized treatments"
    ]
  },
  {
    id: "m2",
    name: "Prana Circle",
    price: "₹18,500",
    period: "Quarter",
    description: "Align your internal elements with the rhythm of the seasons.",
    features: [
      "3 Custom 90-Min Signature Ayurvedic Rituals",
      "Private Meditation Deck session with custom Vedic tea pairing",
      "Priority booking for auspicious solar dates",
      "Complimentary Shirodhara forehead oil flow once"
    ]
  },
  {
    id: "m3",
    name: "Samadhi Circle",
    price: "₹68,000",
    period: "Year",
    description: "A complete annual commitment to pure vitality and inner light.",
    features: [
      "12 Custom 90-Min Signature Master Rituals",
      "4 Private Sound-Healing & Pranayama breathwork sessions",
      "Unlimited guest day-passes (1 per month)",
      "Exclusive invitation to our annual Himalayan retreat"
    ]
  }
];

export const Sections: React.FC<SectionsProps> = ({ activeSection, setActiveSection, isMuted, setIsMuted }) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    serviceId: "sig-bliss",
    date: "2026-07-20",
    time: "10:00",
    notes: ""
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingRipple, setBookingRipple] = useState(false);

  // Unmute and start audio synthesis
  const handleToggleMute = () => {
    if (isMuted) {
      initAudio();
      setWaterVolume(0.8, 1.5);
      triggerBell();
      setIsMuted(false);
    } else {
      setWaterVolume(0, 1.0);
      setIsMuted(true);
    }
  };

  const handleBeginJourney = () => {
    // Scroll down to the first section
    const nextSection = document.getElementById("section-stream");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
    // Initialize audio automatically on click if muted
    if (isMuted) {
      initAudio();
      setWaterVolume(0.8, 2.0);
      triggerBell();
      setIsMuted(false);
    }
  };

  const triggerFormRipple = () => {
    setBookingRipple(true);
    triggerBell(); // play bell chime on service pick
    setTimeout(() => setBookingRipple(false), 2000);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    triggerBell();
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingForm({
        name: "",
        email: "",
        serviceId: "sig-bliss",
        date: "2026-07-20",
        time: "10:00",
        notes: ""
      });
    }, 5000);
  };

  return (
    <div className="relative w-full text-lotus select-none">
      
      {/* Floating Audio Toggle - Exquisite Minimalist Button with Frosted Glass */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={handleToggleMute}
          className="flex items-center gap-3 px-4 py-2.5 rounded-full frosted-glass hover:bg-white/10 text-brass hover:text-lotus border border-white/20 hover:border-brass/55 shadow-lg transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-brass/50 group"
          id="audio-toggle-btn"
        >
          <span className="text-xs font-sans tracking-widest uppercase opacity-75 group-hover:opacity-100 transition-opacity">
            {isMuted ? "Muted" : "Stream Sound"}
          </span>
          <div className="relative flex items-center justify-center w-6 h-6">
            {isMuted ? (
              <VolumeX size={16} className="text-stone animate-pulse" />
            ) : (
              <Volume2 size={16} className="text-brass animate-pulse" />
            )}
          </div>
        </button>
      </div>

      {/* =======================================
          CHAPTER 1: HERO (THE SOURCE)
          ======================================= */}
      <section
        id="section-hero"
        className="relative w-full h-[100vh] flex flex-col justify-between px-8 py-12 md:px-16 overflow-hidden rainforest-glow"
      >
        {/* Dynamic Rainforest Background Imagery / CSS layers */}
        <div className="absolute inset-0 z-0">
          {/* Rainforest Green-to-Dark background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#061F17] via-[#0B3D2E] to-[#0A3326]" />
          
          {/* Light rays shifting overhead */}
          <div className="absolute inset-0 opacity-25 mix-blend-overlay">
            <div className="absolute -top-1/2 left-1/4 w-[600px] h-[1000px] bg-gradient-to-b from-[#B9964B]/30 to-transparent rotate-12 blur-3xl animate-pulse" style={{ animationDuration: "12s" }} />
            <div className="absolute -top-1/2 right-1/4 w-[500px] h-[900px] bg-gradient-to-b from-[#5B7F4F]/20 to-transparent -rotate-12 blur-3xl animate-pulse" style={{ animationDuration: "16s" }} />
          </div>

          {/* Luxury Sacred Geometry Mandala & Traditional Jali Lattice */}
          <div className="absolute bottom-0 right-0 w-full md:w-[50%] h-[75%] opacity-20 md:opacity-40 pointer-events-none mix-blend-screen select-none flex items-center justify-center">
            <svg viewBox="0 0 500 500" className="w-[85%] h-[85%] object-contain">
              <defs>
                <radialGradient id="mandala-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#B9964B" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#0B3D2E" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#061F17" stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* Core glow */}
              <circle cx="250" cy="250" r="220" fill="url(#mandala-glow)" />
              
              {/* Luxury Sacred Geometries */}
              <g stroke="#B9964B" strokeWidth="1" strokeOpacity="0.25" fill="none">
                <circle cx="250" cy="250" r="190" strokeDasharray="2 8" />
                <circle cx="250" cy="250" r="160" />
                <circle cx="250" cy="250" r="130" strokeDasharray="6 6" />
                <circle cx="250" cy="250" r="100" />
                <circle cx="250" cy="250" r="70" />
                
                {/* 12 Traditional Petal Rays */}
                <path d="M 250,60 L 250,440" />
                <path d="M 60,250 L 440,250" />
                <path d="M 115,115 L 385,385" />
                <path d="M 115,385 L 385,115" />
                <path d="M 250,250 Q 200,150 250,60 Q 300,150 250,250" />
                <path d="M 250,250 Q 150,200 60,250 Q 150,300 250,250" />
                <path d="M 250,250 Q 300,350 250,440 Q 200,350 250,250" />
                <path d="M 250,250 Q 350,300 440,250 Q 350,200 250,250" />
              </g>
              
              {/* Nested rotating concentric star elements */}
              <circle cx="250" cy="250" r="210" fill="none" stroke="#B9964B" strokeOpacity="0.1" strokeWidth="2" />
              <circle cx="250" cy="250" r="10" fill="none" stroke="#B9964B" strokeOpacity="0.5" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Elegant traditional border lattices */}
          <div className="absolute top-0 left-0 w-full h-[15%] pointer-events-none opacity-25">
            <svg viewBox="0 0 1000 100" className="w-full h-full object-cover">
              {/* Intricate fine line Indian Jali pattern */}
              <path d="M 0,10 L 1000,10 M 0,30 L 1000,30 M 0,50 L 1000,50" stroke="#B9964B" strokeWidth="0.5" strokeOpacity="0.4" />
              <path d="M 10,0 L 20,20 L 30,0 L 40,20 L 50,0 L 60,20 L 70,0 L 80,20 L 90,0 L 100,20" stroke="#B9964B" strokeWidth="0.5" strokeOpacity="0.3" fill="none" />
              <path d="M 110,0 L 120,20 L 130,0 L 140,20 L 150,0 L 160,20 L 170,0 L 180,20 L 190,0 L 200,20" stroke="#B9964B" strokeWidth="0.5" strokeOpacity="0.3" fill="none" />
              <path d="M 210,0 L 220,20 L 230,0 L 240,20 L 250,0 L 260,20 L 270,0 L 280,20 L 290,0 L 300,20" stroke="#B9964B" strokeWidth="0.5" strokeOpacity="0.3" fill="none" />
              <path d="M 310,0 L 320,20 L 330,0 L 400,20 L 450,0 L 500,20 L 550,0 L 600,20 L 700,0 L 800,20" stroke="#B9964B" strokeWidth="0.5" strokeOpacity="0.3" fill="none" />
              <path d="M 810,0 L 820,20 L 830,0 L 840,20 L 850,0 L 860,20 L 870,0 L 880,20 L 890,0 L 1000,20" stroke="#B9964B" strokeWidth="0.5" strokeOpacity="0.3" fill="none" />
            </svg>
          </div>
        </div>

        {/* Header Branding */}
        <div className="z-10 flex justify-between items-center w-full">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="flex items-center gap-3.5"
          >
            <Flower2 className="text-brass rotate-12" size={26} />
            <span className="font-serif text-2xl tracking-[0.25em] text-lotus font-medium uppercase">
              Pure Bliss
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1.0, duration: 2.0 }}
            className="hidden sm:flex items-center gap-6 font-sans text-xs tracking-widest uppercase text-brass"
          >
            <span>Purification</span>
            <span>•</span>
            <span>Renewal</span>
            <span>•</span>
            <span>Stillness</span>
          </motion.div>
        </div>

        {/* Hero Central Typography */}
        <div className="z-10 my-auto max-w-2xl text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-sans text-xs tracking-[0.3em] text-brass uppercase font-bold block mb-4">
              A Meditative Spa Sanctuary
            </span>
            <h1 className="font-serif text-5xl md:text-7xl tracking-tight leading-[1.1] text-lotus font-normal mb-6">
              Where Every Drop <br />
              <span className="italic font-light text-brass">Restores</span> You
            </h1>
            <p className="font-sans text-sm md:text-base text-lotus/70 leading-relaxed max-w-md mb-10 tracking-wide font-light">
              Leave the noise of the world behind. Follow the flow of water and step into a sacred journey of deep cellular stillness and Ayurvedic renewal.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 1.5 }}
          >
            <button
              onClick={handleBeginJourney}
              className="px-8 py-4 bg-brass hover:bg-lotus text-rainforest hover:text-teak font-sans font-bold text-xs tracking-[0.2em] uppercase rounded-full shadow-2xl transition-all duration-500 flex items-center gap-3 group hover:scale-105"
              id="begin-journey-btn"
            >
              <span>🌿 Begin Your Journey</span>
              <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* Footer Guidance */}
        <div className="z-10 flex justify-between items-end w-full">
          <div className="flex gap-2 items-center text-xs font-sans text-stone/70">
            <Compass size={14} className="animate-spin-slow text-brass" />
            <span className="tracking-widest uppercase">Scroll to descend downstream</span>
          </div>
          <div className="text-right">
            <span className="font-serif text-2xl italic text-brass font-light leading-none block">
              The Sanctuary of Prana (प्राण)
            </span>
            <span className="font-sans text-[10px] tracking-[0.25em] text-stone uppercase">
              Chapter I
            </span>
          </div>
        </div>
      </section>

      {/* =======================================
          CHAPTER 2: THE STREAM (THERAPIES)
          ======================================= */}
      <section
        id="section-stream"
        className="relative w-full min-h-[100vh] flex flex-col justify-center px-8 py-24 md:px-20 bg-gradient-to-b from-[#0A3326] via-[#104333] to-[#124B39] overflow-hidden"
      >
        <div className="max-w-7xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-5 text-left">
            <span className="font-sans text-xs tracking-[0.3em] text-brass uppercase font-bold block mb-3">
              The Flow of Healing
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-lotus font-light leading-tight mb-6">
              Mossy Banks & <br />
              <span className="italic text-brass font-normal">Smooth Carved</span> Stones
            </h2>
            <p className="font-sans text-sm text-lotus/70 leading-relaxed mb-8 tracking-wide font-light">
              As the waterfall gathers into a winding stream, follow its path along the riverbanks. Emerging from the wet earth like ancient stones, our therapeutic core rituals provide a heavy, comforting physical anchor to restore weary bodies.
            </p>
            <div className="flex items-center gap-4 text-xs font-sans text-brass/80 tracking-widest uppercase">
              <Droplet size={14} className="text-brass animate-pulse" />
              <span>Hover cards to ripple currents</span>
            </div>
          </div>

          {/* Right Floating Stone Cards Column */}
          <div className="lg:col-span-7 flex flex-col sm:grid sm:grid-cols-2 gap-8 relative py-8">
            {/* Organic Carved Stone Card 1 */}
            <motion.div
              whileHover={{ scale: 1.04, y: -6, rotate: -1 }}
              transition={{ duration: 0.4 }}
              className="relative p-8 md:p-10 text-left cursor-default overflow-hidden group shadow-2xl river-stone rounded-[55%_45%_50%_50%_/_50%_50%_45%_55%] aspect-square flex flex-col justify-center"
              id="stone-card-deep-tissue"
            >
              {/* Internal ripple wave outline */}
              <div className="absolute inset-0 border border-white/10 rounded-full scale-95 group-hover:scale-105 group-hover:border-brass/30 transition-all duration-1000 opacity-60" />
              <div className="absolute inset-4 border border-brass/0 rounded-full group-hover:scale-110 group-hover:border-brass/15 transition-all duration-1000 opacity-0 group-hover:opacity-100" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brass/10 text-brass mb-6 group-hover:bg-brass group-hover:text-teak transition-all duration-500">
                  <Leaf size={20} />
                </div>
                <h3 className="font-serif text-2xl text-lotus font-normal mb-3">
                  Deep Tissue Flow
                </h3>
                <p className="font-sans text-xs text-lotus/80 leading-relaxed font-light">
                  Slow, synchronized strokes utilizing natural obsidian river stones to dissolve deep muscular tension and trigger physical release.
                </p>
              </div>
            </motion.div>

            {/* Organic Carved Stone Card 2 */}
            <motion.div
              whileHover={{ scale: 1.04, y: -6, rotate: 1 }}
              transition={{ duration: 0.4 }}
              className="relative p-8 md:p-10 text-left cursor-default overflow-hidden group shadow-2xl river-stone rounded-[45%_55%_55%_45%_/_45%_50%_50%_55%] aspect-square flex flex-col justify-center sm:translate-y-8"
              id="stone-card-aroma"
            >
              <div className="absolute inset-0 border border-white/10 rounded-full scale-95 group-hover:scale-105 group-hover:border-brass/30 transition-all duration-1000 opacity-60" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brass/10 text-brass mb-6 group-hover:bg-brass group-hover:text-rainforest transition-all duration-500">
                  <Sparkles size={18} />
                </div>
                <h3 className="font-serif text-2xl text-lotus font-normal mb-3">
                  Prana Aromatherapy
                </h3>
                <p className="font-sans text-xs text-lotus/80 leading-relaxed font-light">
                  A sensory stream of rare, wild-harvested Himalayan oils designed to re-align energy and settle an overactive nervous system.
                </p>
              </div>
            </motion.div>

            {/* Organic Carved Stone Card 3 */}
            <motion.div
              whileHover={{ scale: 1.04, y: -6, rotate: -2 }}
              transition={{ duration: 0.4 }}
              className="relative p-8 md:p-10 text-left cursor-default overflow-hidden group shadow-2xl river-stone rounded-[50%_50%_45%_55%_/_55%_45%_55%_45%] aspect-square flex flex-col justify-center sm:col-span-2 sm:max-w-sm sm:mx-auto sm:-translate-y-4"
              id="stone-card-steam"
            >
              <div className="absolute inset-0 border border-white/10 rounded-full scale-95 group-hover:scale-105 group-hover:border-brass/30 transition-all duration-1000 opacity-60" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brass/10 text-brass mb-6 group-hover:bg-brass group-hover:text-stone transition-all duration-500">
                  <Droplet size={18} />
                </div>
                <h3 className="font-serif text-2xl text-lotus font-normal mb-3">
                  Restorative Steam
                </h3>
                <p className="font-sans text-xs text-lotus/80 leading-relaxed font-light">
                  An infusion of hot eucalyptus, rosemary, and cedarwood vapors to clarify breath, soothe skin, and open tight cellular pathways.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Chapter marker */}
        <div className="absolute bottom-8 right-8 z-10 text-right">
          <span className="font-serif text-2xl italic text-brass font-light leading-none block">
            The Flow of Rasa (रस)
          </span>
          <span className="font-sans text-[10px] tracking-[0.25em] text-stone uppercase">
            Chapter II
          </span>
        </div>
      </section>

      {/* =======================================
          CHAPTER 3: THE FOREST (PRINCIPLES)
          ======================================= */}
      <section
        id="section-forest"
        className="relative w-full min-h-[100vh] flex flex-col justify-center px-8 py-24 md:px-20 bg-gradient-to-b from-[#124B39] via-[#0B3D2E] to-[#0A3326] overflow-hidden"
      >
        {/* Bamboo visual decoration elements */}
        <div className="absolute inset-0 z-0 opacity-10 flex justify-between pointer-events-none">
          <div className="w-[1px] h-full bg-lotus border-l border-lotus/40 mx-10" />
          <div className="w-[1px] h-full bg-lotus border-l border-lotus/40 mx-24 hidden md:block" />
          <div className="w-[2px] h-full bg-lotus border-l border-lotus/30 mx-40" />
          <div className="w-[1px] h-full bg-lotus border-l border-lotus/40 mx-16 hidden lg:block" />
        </div>

        <div className="max-w-5xl mx-auto w-full z-10 text-center">
          <span className="font-sans text-xs tracking-[0.3em] text-brass uppercase font-bold block mb-4">
            Healing isn't rushed
          </span>
          
          <h2 className="font-serif text-4xl md:text-6xl text-lotus leading-[1.1] font-light max-w-3xl mx-auto mb-16 tracking-tight">
            It’s allowed to <br className="sm:hidden" />
            <span className="italic text-brass font-normal">flow</span>.
          </h2>

          {/* Three pillars growing from the forest floor */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
            
            {/* Pillar 1: Relax */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 1.2 }}
              className="p-8 rounded-2xl frosted-glass hover:bg-white/10 text-center flex flex-col items-center group transition-all duration-500 hover:-translate-y-1"
              id="pillar-relax"
            >
              <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-brass mb-6 group-hover:scale-110 transition-transform duration-500">
                <Leaf size={24} className="text-brass" />
              </div>
              <h3 className="font-serif text-2xl text-lotus font-light mb-3">🌿 Relax</h3>
              <p className="font-sans text-xs text-lotus/80 leading-relaxed font-light">
                Unclench your jaw, drop your shoulders, and slow your breathing. Let the organic forest atmosphere soothe your mental landscape.
              </p>
            </motion.div>

            {/* Pillar 2: Restore */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 1.2 }}
              className="p-8 rounded-2xl frosted-glass hover:bg-white/10 text-center flex flex-col items-center group transition-all duration-500 hover:-translate-y-1"
              id="pillar-restore"
            >
              <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-brass mb-6 group-hover:scale-110 transition-transform duration-500">
                <Droplet size={22} className="text-brass" />
              </div>
              <h3 className="font-serif text-2xl text-lotus font-light mb-3">💧 Restore</h3>
              <p className="font-sans text-xs text-lotus/80 leading-relaxed font-light">
                Infuse your tissues with essential botanicals, warm stones, and targeted therapeutic currents to repair deeply stored muscular fatigue.
              </p>
            </motion.div>

            {/* Pillar 3: Renew */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 1.2 }}
              className="p-8 rounded-2xl frosted-glass hover:bg-white/10 text-center flex flex-col items-center group transition-all duration-500 hover:-translate-y-1"
              id="pillar-renew"
            >
              <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-brass mb-6 group-hover:scale-110 transition-transform duration-500">
                <Flower2 size={24} className="text-brass" />
              </div>
              <h3 className="font-serif text-2xl text-lotus font-light mb-3">🪷 Renew</h3>
              <p className="font-sans text-xs text-lotus/80 leading-relaxed font-light">
                Rise from your session with clarity, vital spirit alignment, and a profound, stable sense of renewal that travels home with you.
              </p>
            </motion.div>

          </div>
        </div>

        {/* Chapter marker */}
        <div className="absolute bottom-8 right-8 z-10 text-right">
          <span className="font-serif text-2xl italic text-brass font-light leading-none block">
            The Wisdom of Ritucharya (ऋतुचर्या)
          </span>
          <span className="font-sans text-[10px] tracking-[0.25em] text-stone uppercase">
            Chapter III
          </span>
        </div>
      </section>

      {/* =======================================
          CHAPTER 4: THE LOTUS POND (SERVICES)
          ======================================= */}
      <section
        id="section-pond"
        className="relative w-full min-h-[100vh] flex flex-col justify-center px-8 py-24 md:px-20 bg-gradient-to-b from-[#0A3326] via-[#104333] to-[#0F3B2E] overflow-hidden"
      >
        {/* Sacred Rangoli background geometric lines */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20 flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 600 600" className="w-[120%] h-[120%] max-w-[700px] object-contain animate-spin-slow" style={{ animationDuration: "120s" }}>
            <g stroke="#B9964B" strokeWidth="0.75" fill="none" strokeOpacity="0.35">
              <circle cx="300" cy="300" r="280" strokeDasharray="3 6" />
              <circle cx="300" cy="300" r="240" />
              <circle cx="300" cy="300" r="180" strokeDasharray="5 5" />
              <circle cx="300" cy="300" r="130" />
              <circle cx="300" cy="300" r="80" />
              <circle cx="300" cy="300" r="30" />
              
              {/* Radial symmetric rays with dots */}
              {Array.from({ length: 16 }).map((_, i) => {
                const angle = (i * Math.PI) / 8;
                const x1 = 300 + Math.cos(angle) * 80;
                const y1 = 300 + Math.sin(angle) * 80;
                const x2 = 300 + Math.cos(angle) * 280;
                const y2 = 300 + Math.sin(angle) * 280;
                return (
                  <g key={i}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="0.5" strokeOpacity="0.25" />
                    <circle cx={x2} cy={y2} r="3" fill="#B9964B" fillOpacity="0.5" />
                  </g>
                );
              })}

              {/* Overlapping circular petal arch patterns */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * Math.PI) / 6;
                const cx = 300 + Math.cos(angle) * 130;
                const cy = 300 + Math.sin(angle) * 130;
                return (
                  <circle key={i} cx={cx} cy={cy} r="130" strokeWidth="0.5" strokeOpacity="0.18" />
                );
              })}

              {/* Delicate square nodes */}
              <rect x="180" y="180" width="240" height="240" transform="rotate(45 300 300)" strokeWidth="0.5" strokeOpacity="0.2" />
              <rect x="200" y="200" width="200" height="200" strokeWidth="0.5" strokeOpacity="0.15" />
            </g>
          </svg>
        </div>

        <div className="max-w-6xl mx-auto w-full z-10 text-center">
          <span className="font-sans text-xs tracking-[0.3em] text-brass uppercase font-bold block mb-3">
            Service Showcase
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-lotus font-light mb-4">
            The <span className="italic text-brass font-normal">Lotus</span> Pond
          </h2>
          <p className="font-sans text-sm text-lotus/70 max-w-xl mx-auto mb-16 tracking-wide font-light">
            In our quiet central pond, floating sacred lotus flowers hold our most exquisite restorative packages. Click any blossom below to let it bloom, revealing its healing secrets.
          </p>

          {/* Interactive Clickable Lotus Blossoms */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {servicesData.map((service, index) => {
              const flowerColors = [
                "from-[#B9964B] to-[#F2EFE7]", // Signature
                "from-[#E3A393] to-[#F2EFE7]", // Aromatherapy
                "from-[#C57C80] to-[#F2EFE7]"  // Abhyanga
              ];
              return (
                <div
                  key={service.id}
                  className="flex flex-col items-center justify-center p-8 rounded-2xl frosted-glass hover:bg-white/10 hover:border-white/20 transition-all duration-500 cursor-pointer group relative overflow-hidden shadow-xl"
                  onClick={() => {
                    setSelectedService(service);
                    triggerBell();
                  }}
                  id={`lotus-flower-trigger-${service.id}`}
                >
                  {/* Subtle water rings beneath flower */}
                  <div className="absolute inset-0 bg-radial from-brass/5 to-transparent scale-75 group-hover:scale-110 transition-transform duration-1000" />
                  
                  {/* The Interactive Blooming Lotus Icon */}
                  <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform group-hover:scale-110 transition-all duration-700">
                      {/* Radiating sacred geometry */}
                      <circle cx="50" cy="50" r="32" stroke="#B9964B" strokeWidth="0.5" strokeOpacity="0.4" fill="none" strokeDasharray="2, 4" />
                      <circle cx="50" cy="50" r="24" stroke="#B9964B" strokeWidth="0.5" strokeOpacity="0.3" fill="none" />
                      {/* Sacred Lotus Fine Lines */}
                      <path d="M 50,20 C 35,35 30,65 50,80 C 70,65 65,35 50,20 Z" stroke="#B9964B" strokeWidth="1.2" fill="none" className="opacity-90" />
                      <path d="M 50,30 C 20,45 25,65 50,80 C 75,65 80,45 50,30 Z" stroke="#B9964B" strokeWidth="0.6" strokeOpacity="0.75" fill="none" />
                      <path d="M 50,40 C 35,50 35,70 50,80 C 65,70 65,50 50,40 Z" stroke="#B9964B" strokeWidth="0.5" fill="none" />
                      {/* Delicate Bindu / dot */}
                      <circle cx="50" cy="50" r="3" fill="#B9964B" className="animate-ping" />
                      <circle cx="50" cy="50" r="1.5" fill="#B9964B" />
                    </svg>
                  </div>

                  <span className="font-sans text-[10px] tracking-[0.2em] text-brass uppercase font-bold block mb-2">
                    {service.duration}
                  </span>
                  <h3 className="font-serif text-xl text-lotus font-light group-hover:text-brass transition-colors mb-3">
                    {service.name}
                  </h3>
                  <p className="font-sans text-xs text-brass/70 group-hover:text-lotus transition-colors duration-500 font-light italic">
                    Click to unfold blossom
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Blooming modal / overlay */}
        <AnimatePresence>
          {selectedService && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#061F17]/90 backdrop-blur-md"
              onClick={() => setSelectedService(null)}
              id="lotus-bloom-modal"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 180 }}
                className="w-full max-w-2xl texture-silk p-8 md:p-12 rounded-3xl shadow-2xl relative text-left border border-brass/40 text-teak"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedService(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-teak/10 text-teak hover:text-brass transition-colors focus:outline-none"
                  id="close-modal-btn"
                >
                  <X size={18} />
                </button>

                {/* Modal Header */}
                <span className="font-sans text-xs tracking-[0.3em] text-brass uppercase font-bold block mb-2">
                  {selectedService.duration} • {selectedService.price}
                </span>
                <h3 className="font-serif text-3xl md:text-4xl text-teak font-normal mb-6">
                  {selectedService.name}
                </h3>

                {/* Divider */}
                <div className="h-[1px] w-full bg-brass/35 mb-6" />

                {/* Description */}
                <p className="font-sans text-sm text-teak/80 leading-relaxed mb-8 font-medium">
                  {selectedService.description}
                </p>

                {/* Benefits List */}
                <h4 className="font-serif text-lg text-brass font-semibold mb-4 italic">
                  Key restorative benefits:
                </h4>
                <ul className="space-y-3.5 mb-10">
                  {selectedService.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex gap-3 text-xs md:text-sm font-sans text-teak/90 font-medium items-start">
                      <div className="w-5 h-5 rounded-full bg-brass/15 flex items-center justify-center shrink-0 mt-0.5 text-brass">
                        <Check size={12} />
                      </div>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Action button */}
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                  <div className="flex items-center gap-2 text-teak/60 text-xs font-sans font-medium">
                    <Sparkles size={14} className="text-brass" />
                    <span>Includes organic saffron infusion service</span>
                  </div>
                  <button
                    onClick={() => {
                      // Preselect service and scroll to booking
                      setBookingForm((prev) => ({ ...prev, serviceId: selectedService.id }));
                      setSelectedService(null);
                      const bookingSec = document.getElementById("section-booking");
                      if (bookingSec) {
                        bookingSec.scrollIntoView({ behavior: "smooth" });
                      }
                      triggerBell();
                    }}
                    className="px-6 py-3.5 bg-brass hover:bg-teak text-lotus hover:text-lotus font-sans font-bold text-xs tracking-wider uppercase rounded-full transition-all duration-300 flex items-center justify-center gap-2"
                    id="book-from-modal-btn"
                  >
                    <span>Reserve Session</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chapter marker */}
        <div className="absolute bottom-8 right-8 z-10 text-right">
          <span className="font-serif text-2xl italic text-brass font-light leading-none block">
            The Waters of Ojas (ओजस्)
          </span>
          <span className="font-sans text-[10px] tracking-[0.25em] text-stone uppercase">
            Chapter IV
          </span>
        </div>
      </section>

      {/* =======================================
          CHAPTER 5: THE REFLECTION POOL (REVIEWS)
          ======================================= */}
      <section
        id="section-reflection"
        className="relative w-full min-h-[100vh] flex flex-col justify-center px-8 py-24 md:px-20 bg-gradient-to-b from-[#0F3B2E] via-[#082E23] to-[#0D3629] overflow-hidden"
      >
        <div className="max-w-4xl mx-auto w-full z-10 text-center">
          <span className="font-sans text-xs tracking-[0.3em] text-brass uppercase font-bold block mb-4">
            Mirror Stillness
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-lotus font-light mb-16">
            The <span className="italic text-brass font-normal">Reflection</span> Pool
          </h2>

          {/* Slider / Stack of Testimonials */}
          <div className="space-y-16">
            {testimonialsData.map((t, idx) => (
              <div
                key={t.id}
                className="max-w-2xl mx-auto relative group py-4"
                id={`testimonial-${t.id}`}
              >
                {/* STABLE REAL TEXT */}
                <div className="relative z-20">
                  <p className="font-serif text-xl md:text-2xl text-lotus leading-relaxed italic font-light tracking-wide">
                    "{t.text}"
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brass" />
                    <span className="font-sans text-xs tracking-widest text-brass uppercase font-bold">
                      {t.name}
                    </span>
                    <span className="text-stone/60 text-xs font-sans">•</span>
                    <span className="font-sans text-xs text-stone tracking-wide font-light">
                      {t.role}
                    </span>
                  </div>
                </div>

                {/* MIRROR RIPPLE REFLECTION TEXT (flipped upside down) */}
                <div
                  className="absolute top-full left-0 right-0 z-10 opacity-15 pointer-events-none origin-top select-none mt-4 transition-transform duration-1000 group-hover:scale-y-[-0.95]"
                  style={{
                    transform: "scaleY(-1) translateY(-20px)",
                    filter: "blur(2.5px) url(#ripple-filter)"
                  }}
                >
                  <p className="font-serif text-xl md:text-2xl text-lotus leading-relaxed italic font-light tracking-wide">
                    "{t.text}"
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <span className="font-sans text-xs tracking-widest text-brass uppercase font-bold">
                      {t.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chapter marker */}
        <div className="absolute bottom-8 right-8 z-10 text-right">
          <span className="font-serif text-2xl italic text-brass font-light leading-none block">
            The Mirror of Dhyana (ध्यान)
          </span>
          <span className="font-sans text-[10px] tracking-[0.25em] text-stone uppercase">
            Chapter V
          </span>
        </div>
      </section>

      {/* =======================================
          CHAPTER 6: MEDITATION DECK (PRICING)
          ======================================= */}
      <section
        id="section-deck"
        className="relative w-full min-h-[100vh] flex flex-col justify-center px-8 py-24 md:px-20 bg-gradient-to-b from-[#0D3629] via-[#103E30] to-[#092B21] overflow-hidden"
      >
        {/* Glow of flicking oil lamps */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute bottom-1/4 left-1/4 w-[120px] h-[120px] rounded-full bg-amber-500/10 blur-2xl animate-pulse" style={{ animationDuration: "3.5s" }} />
          <div className="absolute top-1/4 right-1/4 w-[150px] h-[150px] rounded-full bg-orange-500/8 blur-3xl animate-pulse" style={{ animationDuration: "5.0s" }} />
        </div>

        <div className="max-w-6xl mx-auto w-full z-10 text-center">
          <span className="font-sans text-xs tracking-[0.3em] text-brass uppercase font-bold block mb-3">
            Wellness Memberships
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-lotus font-light mb-4">
            The <span className="italic text-brass font-normal">Meditation</span> Deck
          </h2>
          <p className="font-sans text-sm text-lotus/70 max-w-xl mx-auto mb-16 tracking-wide font-light">
            Step onto the wooden platform overlooking the quiet stream. Settle into our elegant, handcrafted membership circles for continuous, sustained cellular rest.
          </p>

          {/* Pricing wood boards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            {membershipsData.map((plan, index) => {
              const isHighlight = index === 1; // Flow Circle middle card highlight
              return (
                <motion.div
                  key={plan.id}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  className={`p-8 md:p-10 rounded-2xl relative flex flex-col justify-between text-left shadow-2xl border transition-all duration-500 texture-wood ${
                    isHighlight
                      ? "border-brass/70 shadow-brass/10"
                      : "border-stone/20 opacity-90 hover:opacity-100"
                  }`}
                  id={`membership-card-${plan.id}`}
                >
                  {/* Decorative corner brass pins for wood boards */}
                  <div className="absolute top-4 left-4 w-1.5 h-1.5 rounded-full bg-brass/60" />
                  <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-brass/60" />
                  <div className="absolute bottom-4 left-4 w-1.5 h-1.5 rounded-full bg-brass/60" />
                  <div className="absolute bottom-4 right-4 w-1.5 h-1.5 rounded-full bg-brass/60" />

                  <div>
                    {isHighlight && (
                      <span className="absolute top-4 right-8 px-2.5 py-0.5 rounded bg-brass/15 text-[#B9964B] font-sans text-[9px] tracking-widest uppercase font-bold">
                        Most Aligned
                      </span>
                    )}
                    <h3 className="font-serif text-2xl text-lotus font-light mb-2">
                      {plan.name}
                    </h3>
                    <p className="font-sans text-xs text-brass/80 italic mb-6">
                      {plan.description}
                    </p>
                    <div className="flex items-baseline gap-1 mb-8">
                      <span className="font-serif text-4xl text-brass font-normal">
                        {plan.price}
                      </span>
                      <span className="font-sans text-xs text-stone">
                        / {plan.period}
                      </span>
                    </div>

                    <div className="h-[1px] w-full bg-brass/15 mb-6" />

                    {/* Features list */}
                    <ul className="space-y-4 mb-10">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex gap-3 text-xs font-sans text-lotus/85 font-light items-start">
                          <Check size={12} className="text-brass shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      // Select membership name in notes and trigger chime
                      setBookingForm((prev) => ({
                        ...prev,
                        notes: `Enquiring about ${plan.name} Wellness Membership.`
                      }));
                      const bookingSec = document.getElementById("section-booking");
                      if (bookingSec) {
                        bookingSec.scrollIntoView({ behavior: "smooth" });
                      }
                      triggerBell();
                    }}
                    className={`w-full py-3.5 rounded-full font-sans font-bold text-xs tracking-widest uppercase transition-all duration-300 ${
                      isHighlight
                        ? "bg-brass hover:bg-lotus text-teak hover:text-rainforest"
                        : "bg-rainforest border border-brass/30 hover:border-brass/70 text-brass hover:text-lotus"
                    }`}
                    id={`membership-btn-${plan.id}`}
                  >
                    Select Plan
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Chapter marker */}
        <div className="absolute bottom-8 right-8 z-10 text-right">
          <span className="font-serif text-2xl italic text-brass font-light leading-none block">
            The Deck of Sadhana (साधना)
          </span>
          <span className="font-sans text-[10px] tracking-[0.25em] text-stone uppercase">
            Chapter VI
          </span>
        </div>
      </section>

      {/* =======================================
          CHAPTER 7: BOOKING (STONE BOWL)
          ======================================= */}
      <section
        id="section-booking"
        className="relative w-full min-h-[100vh] flex flex-col justify-center px-8 py-24 md:px-20 bg-gradient-to-b from-[#092B21] via-[#051E17] to-[#041611] overflow-hidden"
      >
        <div className="max-w-4xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left instructions */}
          <div className="lg:col-span-5 text-left relative">
            <span className="font-sans text-xs tracking-[0.3em] text-brass uppercase font-bold block mb-3">
              Sacred Reservations
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-lotus font-light leading-tight mb-6">
              Align Your <br />
              <span className="italic text-brass font-normal">Next Step</span>
            </h2>
            <p className="font-sans text-sm text-lotus/70 leading-relaxed mb-6 font-light">
              In the heart of this section sits our stone bowl. Water continuously drips into it, sending quiet ripples across the pool. Fill in the sacred coordinates of your booking form.
            </p>
            <p className="font-sans text-xs text-brass/80 leading-relaxed font-light italic">
              Choosing a service or submitting triggers a soft physical chime and visual ripple.
            </p>

            {/* Intricate Hand-Crafted Brass Diya */}
            <div className="mt-10 flex flex-col items-start gap-3">
              <span className="font-sans text-[10px] tracking-widest text-brass/80 uppercase font-bold">
                🪔 Sanctuary Diya Flame
              </span>
              <div className="relative w-28 h-20 flex items-center justify-start">
                <svg viewBox="0 0 100 80" className="w-full h-full filter drop-shadow-xl select-none pointer-events-none">
                  {/* Glowing flame area utilizing .diya-glow class */}
                  <g className="diya-glow origin-bottom transform translate-y-[-5px]">
                    {/* Flame outer gold */}
                    <path d="M 50,15 C 38,32 40,55 50,58 C 60,55 62,32 50,15 Z" fill="#B9964B" opacity="0.85" />
                    {/* Flame inner bright core */}
                    <path d="M 50,28 C 43,38 45,53 50,53 C 55,53 57,38 50,28 Z" fill="#F2EFE7" />
                  </g>
                  {/* Brass oil vessel with traditional curves */}
                  <path d="M 15,50 C 25,72 75,72 85,50 C 90,40 85,42 50,45 C 15,42 10,40 15,50 Z" fill="#B9964B" stroke="#4A3426" strokeWidth="0.5" />
                  {/* Base stand */}
                  <path d="M 35,66 C 40,74 60,74 65,66 Z" fill="#8C6F32" />
                  <path d="M 22,53 Q 50,58 78,53" fill="none" stroke="#F2EFE7" strokeWidth="0.5" strokeOpacity="0.4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right side form */}
          <div className="lg:col-span-7 relative">
            {/* The Guest Registry parchment (Hand-loomed Silk texture) */}
            <div
              className={`p-8 md:p-10 rounded-[35px] border transition-all duration-1000 relative z-20 texture-silk text-teak ${
                bookingRipple
                  ? "border-brass shadow-[0_0_35px_rgba(185,150,75,0.3)]"
                  : "border-brass/30"
              }`}
            >
              {/* Overlay water ripple animation when triggered */}
              <AnimatePresence>
                {bookingRipple && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 0.12, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 rounded-[35px] bg-[#1E5D45] pointer-events-none"
                  />
                )}
              </AnimatePresence>

              {bookingSuccess ? (
                <div className="py-12 text-center" id="booking-success-message">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brass/20 text-brass mb-6"
                  >
                    <Check size={28} />
                  </motion.div>
                  <h3 className="font-serif text-2xl text-teak mb-3 font-normal">Reservation Complete</h3>
                  <p className="font-sans text-xs text-teak/75 max-w-sm mx-auto leading-relaxed font-light mb-6">
                    We have recorded your parameters into the quiet waters of our books. A guide will reach out to you within 24 hours to coordinate your arrival.
                  </p>
                  <button
                    onClick={() => setBookingSuccess(false)}
                    className="px-6 py-2 border border-brass/55 text-brass hover:text-teak hover:border-teak font-sans text-xs tracking-wider uppercase rounded-full transition-all"
                  >
                    Close Status
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-5 text-left" id="spa-booking-form">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-sans tracking-widest text-brass uppercase font-bold mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingForm.name}
                        onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                        placeholder="Ananya"
                        className="w-full px-4 py-3 rounded-xl bg-white/60 border border-teak/10 focus:border-brass focus:ring-1 focus:ring-brass/40 text-teak text-xs font-sans outline-none transition-all placeholder:text-teak/30 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans tracking-widest text-brass uppercase font-bold mb-2">
                        Email Coordinates
                      </label>
                      <input
                        type="email"
                        required
                        value={bookingForm.email}
                        onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                        placeholder="ananya@gmail.com"
                        className="w-full px-4 py-3 rounded-xl bg-white/60 border border-teak/10 focus:border-brass focus:ring-1 focus:ring-brass/40 text-teak text-xs font-sans outline-none transition-all placeholder:text-teak/30 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans tracking-widest text-brass uppercase font-bold mb-2">
                      Select Rest Ritual
                    </label>
                    <select
                      value={bookingForm.serviceId}
                      onChange={(e) => {
                        setBookingForm({ ...bookingForm, serviceId: e.target.value });
                        triggerFormRipple();
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-white/60 border border-teak/10 focus:border-brass focus:ring-1 focus:ring-brass/40 text-teak text-xs font-sans outline-none transition-all font-medium cursor-pointer"
                    >
                      {servicesData.map((s) => (
                        <option key={s.id} value={s.id} className="bg-lotus text-teak font-sans">
                          {s.name} ({s.duration} - {s.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-sans tracking-widest text-brass uppercase font-bold mb-2">
                        Reserve Date
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingForm.date}
                        onChange={(e) => {
                          setBookingForm({ ...bookingForm, date: e.target.value });
                          triggerFormRipple();
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-white/60 border border-teak/10 focus:border-brass focus:ring-1 focus:ring-brass/40 text-teak text-xs font-sans outline-none transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-sans tracking-widest text-brass uppercase font-bold mb-2">
                        Preferred Hour
                      </label>
                      <input
                        type="time"
                        required
                        value={bookingForm.time}
                        onChange={(e) => {
                          setBookingForm({ ...bookingForm, time: e.target.value });
                          triggerFormRipple();
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-white/60 border border-teak/10 focus:border-brass focus:ring-1 focus:ring-brass/40 text-teak text-xs font-sans outline-none transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans tracking-widest text-brass uppercase font-bold mb-2">
                      Special Parameters / Intentions
                    </label>
                    <textarea
                      rows={3}
                      value={bookingForm.notes}
                      onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                      placeholder="e.g. focusing on Ajna Chakra Shirodhara and deep physical release..."
                      className="w-full px-4 py-3 rounded-xl bg-white/60 border border-teak/10 focus:border-brass focus:ring-1 focus:ring-brass/40 text-teak text-xs font-sans outline-none transition-all placeholder:text-teak/30 font-medium resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-brass hover:bg-teak text-[#F2EFE7] hover:text-[#F2EFE7] font-sans font-bold text-xs tracking-[0.2em] uppercase rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 group"
                    id="submit-booking-btn"
                  >
                    <span>Reserve Session Parameters</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Chapter marker */}
        <div className="absolute bottom-8 right-8 z-10 text-right">
          <span className="font-serif text-2xl italic text-brass font-light leading-none block">
            The Vessel of Kshema (क्षेम)
          </span>
          <span className="font-sans text-[10px] tracking-[0.25em] text-stone uppercase">
            Chapter VII
          </span>
        </div>
      </section>

      {/* =======================================
          FOOTER (ENDLESS LAKE)
          ======================================= */}
      <footer className="relative w-full h-[100vh] flex flex-col justify-between px-8 py-16 md:px-20 bg-gradient-to-b from-[#041611] via-[#020b08] to-[#010302] overflow-hidden text-center">
        {/* Fireflies and night sky glow */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-emerald-500/5 blur-3xl rounded-full" />
        </div>

        {/* Distant gold yantra mandala in mist */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-80 opacity-25 pointer-events-none z-0">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
            <circle cx="50" cy="50" r="45" stroke="#B9964B" strokeWidth="0.25" fill="none" strokeOpacity="0.4" strokeDasharray="1 3" />
            <circle cx="50" cy="50" r="36" stroke="#B9964B" strokeWidth="0.25" fill="none" strokeOpacity="0.3" />
            <polygon points="50,15 80,68 20,68" stroke="#B9964B" strokeWidth="0.2" fill="none" strokeOpacity="0.2" />
            <polygon points="50,85 80,32 20,32" stroke="#B9964B" strokeWidth="0.2" fill="none" strokeOpacity="0.2" />
            <circle cx="50" cy="50" r="10" stroke="#B9964B" strokeWidth="0.5" fill="none" strokeOpacity="0.4" />
          </svg>
        </div>

        {/* Top Spacer / decorative line */}
        <div className="z-10 w-full max-w-sm mx-auto">
          <div className="h-[1px] w-full bg-brass/25 mb-4" />
          <Flower2 size={24} className="text-brass mx-auto animate-pulse" />
        </div>

        {/* Central Quote & branding */}
        <div className="z-10 max-w-2xl mx-auto my-auto">
          <span className="font-sans text-[10px] tracking-[0.4em] text-brass uppercase font-bold block mb-6">
            A Peaceful Shore
          </span>
          <blockquote className="font-serif text-3xl md:text-5xl text-lotus italic font-light tracking-wide leading-relaxed mb-8">
            "Still water reflects the clearest mind."
          </blockquote>
          <p className="font-sans text-xs text-stone tracking-[0.25em] uppercase font-bold">
            Pure Bliss Spa • Mountain Valley Sanctuary
          </p>
        </div>

        {/* Footer legal & credentials */}
        <div className="z-10 flex flex-col md:flex-row justify-between items-center gap-6 w-full text-xs font-sans text-stone/50">
          <div>
            <span>© 2026 Pure Bliss. Handcrafted with reverence.</span>
          </div>
          <div className="flex gap-6">
            <a href="#section-hero" className="hover:text-brass transition-colors">Return to Source</a>
            <span>•</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Define local SVG petal gradient for convenience inside Sections
const LotusPetalGradient: React.FC = () => (
  <svg className="hidden">
    <defs>
      <linearGradient id="lotus-petal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F2EFE7" />
        <stop offset="40%" stopColor="#B9964B" />
        <stop offset="100%" stopColor="#4A3426" />
      </linearGradient>
    </defs>
  </svg>
);

export default Sections;
