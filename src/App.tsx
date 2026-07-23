import { useEffect, useState } from "react";
import { BackgroundStream } from "./components/BackgroundStream";
import { Sections } from "./components/Sections";
import { triggerBell } from "./utils/audioSynth";
import { Flower2, Volume2, VolumeX, Menu, X, MapPin, ExternalLink, Navigation, Phone } from "lucide-react";

export type TabType = "home" | "therapies" | "memberships" | "about" | "contact";

export default function App() {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
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

  // Periodic temple bell chime every 2 minutes for natural serenity when unmuted
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isMuted) {
        triggerBell();
      }
    }, 120000);

    return () => clearInterval(interval);
  }, [isMuted]);

  // Handle Tab Switch with smooth scrolling to top and chime trigger
  const handleTabSwitch = (tab: TabType) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
    if (!isMuted) {
      triggerBell();
    }
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

      {/* FIXED HEADER - Elite luxury Navigation with Frosted Glass */}
      <header
        id="app-header"
        className="fixed top-0 left-0 right-0 z-50 frosted-glass border-b border-white/5 px-3 py-2.5 sm:px-6 sm:py-3.5 md:px-12 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => handleTabSwitch("home")}
              className="flex items-center gap-2 sm:gap-3 hover:opacity-85 transition-opacity text-left"
              id="header-logo-btn"
            >
              <Flower2 className="text-brass animate-spin-slow shrink-0" size={22} />
              <span className="font-serif text-base sm:text-xl md:text-2xl tracking-[0.15em] sm:tracking-[0.2em] text-lotus font-semibold uppercase whitespace-nowrap">
                Pure Bliss Wellness
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-sans text-xs sm:text-sm md:text-base tracking-widest uppercase font-bold text-lotus/70">
            {(["home", "therapies", "memberships", "about", "contact"] as TabType[]).map((tab) => {
              const labels: Record<TabType, string> = {
                home: "Home",
                therapies: "Therapies & Pricing",
                memberships: "Memberships & Combos",
                about: "About Sanctuary",
                contact: "Book & Location",
              };
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => handleTabSwitch(tab)}
                  className={`cursor-pointer hover:text-brass transition-colors py-1 relative ${
                    isActive ? "text-brass font-black" : "text-lotus/85"
                  }`}
                  id={`nav-link-${tab}`}
                >
                  {labels[tab]}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brass rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Header Right Interactions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sound chime toggle with visual indicator */}
            <button
              onClick={() => {
                if (isMuted) {
                  const { initAudio, setWaterVolume } = require("./utils/audioSynth");
                  initAudio();
                  setWaterVolume(0, 0); // No background water noise
                  triggerBell();
                  setIsMuted(false);
                } else {
                  setIsMuted(true);
                }
              }}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-full border border-white/10 text-brass hover:text-lotus hover:bg-white/5 transition-all text-[11px] sm:text-xs tracking-wider uppercase font-bold"
              id="header-mute-toggle"
              title={isMuted ? "Unmute Temple Bell Chimes" : "Mute Sound"}
            >
              <span>{isMuted ? "Chime Off" : "Chime On"}</span>
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="animate-pulse" />}
            </button>

            {/* Mobile Hamburger Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 text-lotus hover:text-brass transition-colors focus:outline-none"
              id="mobile-menu-trigger"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* SHORT FORMAL QUICK INFO & NAV LINK BAR FOR ALL PAGES */}
        <div className="w-full border-t border-white/5 mt-2 pt-2 pb-0.5 overflow-x-auto scrollbar-none flex items-center justify-between gap-3 text-[11px] sm:text-xs font-sans">
          {/* Formal info note per active tab */}
          <div className="flex items-center gap-2 shrink-0 text-lotus/90 font-medium">
            <span className="px-2 py-0.5 rounded bg-brass/20 text-brass font-bold uppercase tracking-wider text-[10px]">
              {activeTab === "home" && "JP Nagar 6th Phase"}
              {activeTab === "therapies" && "Therapies & Pricing"}
              {activeTab === "memberships" && "Wellness Packages"}
              {activeTab === "about" && "Certified Male Therapists"}
              {activeTab === "contact" && "1st Floor, BDA 583"}
            </span>
            <span className="hidden sm:inline text-stone/80">|</span>
            <span className="hidden sm:inline text-stone/90 font-light truncate max-w-xs md:max-w-md">
              {activeTab === "home" && "Bengaluru • 1st Floor, BDA 583, Sarakki • Near to JP Nagar Metro Station"}
              {activeTab === "therapies" && "Swedish, Deep Tissue, Kerala Ayurvedic & Steam"}
              {activeTab === "memberships" && "Monthly Passes & Dual-Therapist Combos"}
              {activeTab === "about" && "Hygiene & Discretion Guaranteed"}
              {activeTab === "contact" && "Direct Line: +91 98860 12345 • 10-Min Confirmation"}
            </span>
          </div>

          {/* Short Formal Quick Nav Links */}
          <div className="flex items-center gap-1.5 shrink-0 font-bold uppercase tracking-wider">
            <button
              onClick={() => handleTabSwitch("home")}
              className={`px-2 py-1 rounded-md transition-colors ${activeTab === "home" ? "bg-brass/20 text-brass" : "text-stone hover:text-lotus"}`}
            >
              Home
            </button>
            <button
              onClick={() => handleTabSwitch("therapies")}
              className={`px-2 py-1 rounded-md transition-colors ${activeTab === "therapies" ? "bg-brass/20 text-brass" : "text-stone hover:text-lotus"}`}
            >
              Rates
            </button>
            <button
              onClick={() => handleTabSwitch("contact")}
              className={`px-2 py-1 rounded-md transition-colors ${activeTab === "contact" ? "bg-brass/20 text-brass" : "text-stone hover:text-lotus"}`}
            >
              Reserve
            </button>
            <a
              href="https://maps.app.goo.gl/e5pfzqbjtzHXpE9WA?g_st=awb"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brass/15 hover:bg-brass/30 text-brass border border-brass/30 transition-all ml-1"
              title="Open Google Maps Location"
            >
              <Navigation size={11} />
              <span>Map</span>
              <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </header>

      {/* MOBILE FULLSCREEN OVERLAY MENU */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation-overlay"
          className="fixed inset-0 z-45 bg-[#0c0f0e]/95 backdrop-blur-lg flex flex-col justify-center items-center px-6 text-center pt-16"
        >
          <div className="flex flex-col gap-6 font-serif text-2xl sm:text-3xl tracking-widest text-lotus uppercase">
            {(["home", "therapies", "memberships", "about", "contact"] as TabType[]).map((tab) => {
              const labels: Record<TabType, string> = {
                home: "Home",
                therapies: "Therapies & Pricing",
                memberships: "Memberships & Combos",
                about: "About Sanctuary",
                contact: "Book & Location",
              };
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => handleTabSwitch(tab)}
                  className={`cursor-pointer hover:text-brass transition-colors ${
                    isActive ? "text-brass font-bold" : "text-lotus/80"
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
              href="https://maps.app.goo.gl/e5pfzqbjtzHXpE9WA?g_st=awb"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-brass text-[#0c0f0e] rounded-full font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Navigation size={14} />
              <span>Get Google Maps Directions</span>
            </a>
            <p className="text-stone/80 tracking-wider uppercase font-medium text-[11px] leading-tight">
              📍 BDA 583, 1st Floor, 16th Cross, Sarakki, JP Nagar 6th Phase, Bengaluru • +91 98860 12345
            </p>
          </div>
        </div>
      )}

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
                  if (!isMuted) triggerBell();
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
      <main className="w-full">
        <Sections
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeSection={activeSection}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
        />
      </main>
    </div>
  );
}
