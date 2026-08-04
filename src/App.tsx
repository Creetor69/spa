import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BackgroundStream } from "./components/BackgroundStream";
import { Sections } from "./components/Sections";
import { Flower2, Menu, X, Navigation, ExternalLink, MapPin } from "lucide-react";

export type TabType = "home" | "therapies" | "memberships" | "about" | "contact";

export default function App() {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Listen to window scroll events ONLY when active tab is "home"
  useEffect(() => {
    if (activeTab !== "home") {
      setScrollY(0);
      setActiveSection(0);
      return;
    }

    const handleScroll = () => {
      const sy = window.scrollY;
      setScrollY(sy);
      
      // Calculate active section based on scroll position vs innerHeight (5 sections total: 0, 1, 2, 3, 4)
      const h = window.innerHeight || 800;
      const index = Math.min(Math.max(Math.round(sy / h), 0), 4);
      setActiveSection(index);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeTab]);

  // Handle Tab Switch with smooth scrolling to top
  const handleTabSwitch = (tab: TabType) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <div
      id="app-root-container"
      className={`relative w-full bg-[#0c0f0e] font-sans overflow-x-hidden selection:bg-brass/20 selection:text-lotus transition-colors duration-1000 ${
        activeTab === "home" ? "min-h-[500vh]" : "min-h-[100vh]"
      }`}
    >
      {/* Background Interactive Stream and Golden Lotus Petal */}
      <BackgroundStream scrollY={scrollY} activeSection={activeSection} />

      {/* FIXED HEADER - Ultra-compact slim Navigation for all devices */}
      <header
        id="app-header"
        className="fixed top-0 left-0 right-0 z-50 frosted-glass border-b border-white/10 px-4 py-2.5 sm:px-8 sm:py-3 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => handleTabSwitch("home")}
            className="flex items-center gap-2 sm:gap-3 hover:opacity-85 transition-opacity text-left cursor-pointer"
            id="header-logo-btn"
          >
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-brass/80 shrink-0 shadow-[0_0_15px_rgba(185,150,75,0.4)] flex items-center justify-center bg-[#0c0f0e]">
              <img
                src="https://i.ibb.co/93CPrBWC/global-000054e2ea70026d-0000015f-2-000054e2ea70026d-0000000000000001-7c3179df6256d115-00000212c420.png"
                alt="Pure Bliss Wellness Logo"
                className="w-full h-full object-cover scale-95 -translate-x-[2px]"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-serif text-base sm:text-lg md:text-xl tracking-[0.15em] sm:tracking-[0.2em] text-lotus font-bold uppercase whitespace-nowrap">
              Pure Bliss Wellness
            </span>
          </button>

          {/* Header Right: Hamburger Menu Button for all devices */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/917411397005?text=Hello%20Pure%20Bliss%20Wellness,%20I%20would%20like%20to%20book%20a%20spa%20session%20at%20JP%20Nagar."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xs:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider transition-all"
              title="Book via WhatsApp"
            >
              <span>💬 WhatsApp</span>
            </a>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 sm:p-2.5 rounded-full border border-brass/40 bg-brass/10 hover:bg-brass/25 text-brass transition-all flex items-center justify-center focus:outline-none cursor-pointer shadow-md"
              id="header-hamburger-menu-trigger"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* FULLSCREEN OVERLAY MENU FOR PAGES */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-navigation-overlay"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-45 bg-[#0c0f0e]/98 backdrop-blur-xl flex flex-col justify-center items-center px-6 text-center pt-20"
          >
            <div className="flex flex-col gap-6 font-serif text-2xl sm:text-3xl tracking-widest text-lotus uppercase">
              {(["home", "therapies", "memberships", "about", "contact"] as TabType[]).map((tab) => {
                const labels: Record<TabType, string> = {
                  home: "Home",
                  therapies: "Therapies & Pricing",
                  memberships: "Memberships & Combos",
                  about: "About Sanctuary",
                  contact: "Contact Us",
                };
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => handleTabSwitch(tab)}
                    className={`cursor-pointer hover:text-brass transition-colors py-1 ${
                      isActive ? "text-brass font-bold border-b border-brass" : "text-lotus/85"
                    }`}
                    id={`mobile-nav-link-${tab}`}
                  >
                    {labels[tab]}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 w-full max-w-xs space-y-3 font-sans text-xs">
              <a
                href="https://maps.app.goo.gl/wWJ7FFXRyY7FjwfcA"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-brass text-[#0c0f0e] rounded-full font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-lotus transition-all shadow-lg"
              >
                <Navigation size={14} />
                <span>Get Google Maps Directions</span>
              </a>

              {/* Facebook & Instagram Social Links */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href="https://www.facebook.com/share/18yZoqjYDE/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                  title="Follow us on Facebook"
                  id="menu-facebook-link"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </a>
                <a
                  href="https://www.instagram.com/pureblisswellness.jpnagar?utm_source=qr&igsh=MWhpYms4bGc5b3ZzbQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-full bg-pink-600/20 hover:bg-pink-600/30 text-pink-400 border border-pink-500/30 font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                  title="Follow us on Instagram"
                  id="menu-instagram-link"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Instagram</span>
                </a>
              </div>

              <p className="text-stone/80 tracking-wider uppercase font-medium text-[11px] leading-tight pt-1">
                📍 No. 583, 1st Floor, 16th Cross, Sarakki, JP Nagar 6th Phase, Bengaluru • +91 74113 97005
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT FIXED DOT NAVIGATOR - Home Page Section Tracker (Only on Home Page) */}
      {activeTab === "home" && (
        <div className="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-6 items-center">
          {[0, 1, 2, 3, 4].map((idx) => {
            const names = [
              "The Sanctuary",
              "Core Elements",
              "Signature Chime",
              "Reflection Pool",
              "About JP Nagar",
            ];
            const ids = [
              "section-hero",
              "section-elements",
              "section-signature",
              "section-reflections",
              "section-sanctuary",
            ];
            const isActive = idx === activeSection;

            return (
              <button
                key={idx}
                onClick={() => {
                  const target = document.getElementById(ids[idx]);
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="group relative flex items-center justify-center w-5 h-5 focus:outline-none cursor-pointer"
                title={names[idx]}
                id={`nav-dot-${idx}`}
              >
                {/* Outer blooming halo */}
                <div
                  className={`absolute inset-0 rounded-full border border-brass/45 transition-all duration-700 scale-50 ${
                    isActive
                      ? "scale-110 opacity-100"
                      : "scale-0 opacity-0 group-hover:scale-75 group-hover:opacity-50"
                  }`}
                />
                {/* Inner core particle */}
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                    isActive ? "bg-brass scale-150" : "bg-stone/30 group-hover:bg-brass/60"
                  }`}
                />
                {/* Tooltip text sliding out right */}
                <span className="absolute left-8 px-3 py-1 rounded bg-[#0c0f0e]/90 border border-brass/10 text-brass text-[9px] tracking-widest uppercase font-bold opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl">
                  {names[idx]}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* MAIN CONTENT PORT */}
      <main className="relative z-10 w-full">
        <Sections
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeSection={activeSection}
        />
      </main>

      {/* STICKY FLOATING GOOGLE MAPS BUTTON ON ALL PAGES */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40">
        <a
          href="https://maps.app.goo.gl/wWJ7FFXRyY7FjwfcA"
          target="_blank"
          rel="noopener noreferrer"
          className="group w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-brass via-amber-500 to-brass hover:from-amber-400 hover:to-brass text-[#0c0f0e] rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(185,150,75,0.6)] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border border-amber-300/40"
          id="sticky-google-maps-btn"
          title="Open Location in Google Maps"
          aria-label="Google Maps Location"
        >
          <MapPin size={22} className="text-[#0c0f0e] group-hover:scale-110 transition-transform" />
        </a>
      </div>
    </div>
  );
}
