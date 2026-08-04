import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, ChevronLeft, ChevronRight, Quote, ShieldCheck, UserCheck, ExternalLink } from "lucide-react";

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  location: string;
  therapy: string;
  rating: number;
  comment: string;
  date: string;
}

const indianTestimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Vikram Gowda",
    title: "IT Project Director",
    location: "JP Nagar 6th Phase, Bengaluru",
    therapy: "Deep Tissue Massage + Scrub (90 Mins)",
    rating: 5,
    comment:
      "Working 12-hour desk shifts left me with chronic neck stiffness and severe lower back knots. The male therapist at Pure Bliss targeted every trigger point with expert precision. The 1st floor suite near JP Nagar Metro is quiet, hygienic, and extremely professional.",
    date: "Verified Visit • Yesterday"
  },
  {
    id: "t2",
    name: "Rajesh Sharma",
    title: "Senior Software Architect",
    location: "Jayanagar, Bengaluru",
    therapy: "Ayurvedic Full Body Oil Therapy",
    rating: 5,
    comment:
      "Authentic warm herbal oil treatment followed by deep relaxation. The male masseur understood classical Kerala stroke techniques perfectly. My muscle stiffness melted away. Pure Bliss is the premier male spa in JP Nagar.",
    date: "Verified Visit • 3 days ago"
  },
  {
    id: "t3",
    name: "Karthik Subramanian",
    title: "Financial Analyst",
    location: "BTM Layout, Bengaluru",
    therapy: "Swedish / Aroma Stress Relief (60 Mins)",
    rating: 5,
    comment:
      "Extremely clean, private atmosphere. Booking via WhatsApp was seamless and instant. The custom aromatherapy oils and peaceful ambiance made it worth every rupee. Outstanding hospitality for men.",
    date: "Verified Visit • 1 week ago"
  },
  {
    id: "t4",
    name: "Rohan Kulkarni",
    title: "Entrepreneur",
    location: "Indiranagar, Bengaluru",
    therapy: "Four Hands Dual Therapist Massage",
    rating: 5,
    comment:
      "The synchronized dual-therapist four-hands session is unmatched in Bangalore. Perfect rhythm, high quality cold-pressed oils, and total discretion. The best gentlemen's wellness sanctuary.",
    date: "Verified Visit • 2 weeks ago"
  },
  {
    id: "t5",
    name: "Sandeep Nair",
    title: "Operations Lead",
    location: "JP Nagar 2nd Stage, Bengaluru",
    therapy: "Dry Massage & Head Back Relief",
    rating: 5,
    comment:
      "Needed a quick 30-minute posture fix between meetings without oily residue. The Dry Massage was spot-on — firm pressure over clothing, instant relief, and zero cleanup needed. Highly recommended!",
    date: "Verified Visit • 2 weeks ago"
  },
  {
    id: "t6",
    name: "Dr. Arvind Rao",
    title: "Consultant Physician",
    location: "Koramangala, Bengaluru",
    therapy: "Potli Herbal Compress & Deep Relaxation",
    rating: 5,
    comment:
      "As a physician, hygiene and genuine therapy skills are my top requirements. Pure Bliss maintains clinical-grade cleanliness, sanitized towels, and knowledgeable male therapists. Truly relaxing.",
    date: "Verified Visit • 3 weeks ago"
  }
];

export const ClientTestimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % indianTestimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % indianTestimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + indianTestimonials.length) % indianTestimonials.length);
  };

  const active = indianTestimonials[currentIndex];

  return (
    <section
      id="client-testimonials-section"
      className="relative w-full py-12 md:py-20 px-4 sm:px-8 md:px-16 bg-gradient-to-b from-[#0c0f0e] via-[#111614] to-[#0c0f0e] text-lotus border-t border-white/5 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto text-center space-y-8">
        
        {/* Header Badge & Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brass/10 border border-brass/20 text-brass text-xs tracking-[0.2em] uppercase font-black">
            <ShieldCheck size={14} />
            <span>Gentlemen Reviews & Experiences</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-lotus font-light">
            Verified <span className="italic text-brass font-normal">Client Testimonials</span>
          </h2>
          <p className="font-sans text-xs sm:text-sm text-stone max-w-lg mx-auto font-light leading-relaxed">
            Read authentic feedback from esteemed patrons across Bengaluru who trust our JP Nagar 6th Phase sanctuary.
          </p>
        </div>

        {/* Dynamic Carousel Container */}
        <div
          className="relative max-w-3xl mx-auto min-h-[320px] sm:min-h-[280px] p-6 sm:p-10 rounded-3xl bg-white/5 border border-brass/20 frosted-glass shadow-2xl flex flex-col justify-between items-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Quote Accent Icon */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-brass text-[#0c0f0e] flex items-center justify-center shadow-lg">
            <Quote size={20} className="fill-[#0c0f0e]" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="w-full space-y-6 pt-2"
            >
              {/* Star Rating */}
              <div className="flex justify-center items-center gap-1 text-brass">
                {Array.from({ length: active.rating }).map((_, i) => (
                  <Star key={i} size={18} className="fill-brass" />
                ))}
              </div>

              {/* Review Comment */}
              <p className="font-sans text-sm sm:text-base md:text-lg text-lotus/95 font-light leading-relaxed italic px-2 sm:px-6">
                "{active.comment}"
              </p>

              {/* Client Info & Therapy Badge */}
              <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    <UserCheck size={15} className="text-brass" />
                    <strong className="font-serif text-lg text-lotus font-bold">{active.name}</strong>
                  </div>
                  <span className="font-sans text-xs text-stone font-light block">
                    {active.title} • {active.location}
                  </span>
                </div>

                <div className="text-center sm:text-right space-y-1">
                  <span className="px-3 py-1 rounded-full bg-brass/15 border border-brass/30 text-brass text-[11px] font-sans font-bold tracking-wider uppercase block">
                    {active.therapy}
                  </span>
                  <span className="text-[10px] text-stone/70 block">{active.date}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons & Indicators */}
          <div className="w-full flex justify-between items-center pt-6 mt-4 border-t border-white/5">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-full bg-white/5 hover:bg-brass hover:text-[#0c0f0e] text-lotus border border-white/10 transition-all cursor-pointer"
              aria-label="Previous Review"
              id="prev-testimonial-btn"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-2">
              {indianTestimonials.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx ? "w-6 bg-brass" : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to review ${idx + 1}`}
                  id={`dot-testimonial-${idx}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-2.5 rounded-full bg-white/5 hover:bg-brass hover:text-[#0c0f0e] text-lotus border border-white/10 transition-all cursor-pointer"
              aria-label="Next Review"
              id="next-testimonial-btn"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Google Review Callout */}
        <div className="pt-2 flex flex-col items-center justify-center gap-3">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-brass/10 via-amber-500/10 to-brass/10 border border-brass/30 max-w-xl w-full text-center space-y-3 shadow-xl">
            <div className="flex justify-center items-center gap-1.5 text-brass">
              <Star size={16} className="fill-brass" />
              <Star size={16} className="fill-brass" />
              <Star size={16} className="fill-brass" />
              <Star size={16} className="fill-brass" />
              <Star size={16} className="fill-brass" />
            </div>
            <h3 className="font-serif text-lg sm:text-xl text-lotus font-bold">
              Visited Pure Bliss Wellness Recently?
            </h3>
            <p className="font-sans text-xs sm:text-sm text-stone font-light">
              Your valuable feedback helps fellow patrons experience authentic rejuvenation. Please share your review on Google!
            </p>
            <a
              href="https://share.google/JNdA5xOx7a3MzX1oF"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-brass via-amber-500 to-brass hover:from-amber-400 hover:to-brass text-[#0c0f0e] font-sans font-black text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(185,150,75,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-amber-300/40"
              id="google-review-btn"
            >
              <Star size={16} className="fill-[#0c0f0e]" />
              <span>Leave Us a Review on Google</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-[11px] font-sans text-stone/60 tracking-wider uppercase font-semibold">
          ⚡ 100% Authentic Indian Patron Feedback • Discretion & Professional Male Masseurs
        </p>

      </div>
    </section>
  );
};
