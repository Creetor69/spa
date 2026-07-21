import { useEffect, useState } from "react";
import { BackgroundStream } from "./components/BackgroundStream";
import { Sections } from "./components/Sections";
import { triggerBell } from "./utils/audioSynth";
import { Flower2, Volume2, VolumeX, Menu, X } from "lucide-react";

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
        className="fixed top-0 left-0 right-0 z-50 frosted-glass border-b border-white/5 px-6 py-4 md:px-12 flex justify-between items-center transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleTabSwitch("home")}
            className="flex items-center gap-3 hover:opacity-85 transition-opacity"
            id="header-logo-btn"
          >
            <Flower2 className="text-brass animate-spin-slow" size={24} />
            <span className="font-serif text-xl tracking-[0.2em] text-lotus font-semibold uppercase">
              Pure Bliss Wellness
            </span>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 font-sans text-xs tracking-widest uppercase font-bold text-lotus/70">
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
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-brass rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Header Right Interactions */}
        <div className="flex items-center gap-4">
          {/* Sound toggle with visual indicator */}
          <button
            onClick={() => {
              if (isMuted) {
                // Initialize audio and unmute
                const { initAudio, setWaterVolume } = require("./utils/audioSynth");
                initAudio();
                setWaterVolume(0.8, 1.5);
                triggerBell();
                setIsMuted(false);
              } else {
                const { setWaterVolume } = require("./utils/audioSynth");
                setWaterVolume(0, 1.0);
                setIsMuted(true);
              }
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-brass hover:text-lotus hover:bg-white/5 transition-all text-[10px] tracking-wider uppercase font-bold"
            id="header-mute-toggle"
            title={isMuted ? "Unmute Ambient Stream" : "Mute Sound"}
          >
            <span>{isMuted ? "Muted" : "Playing"}</span>
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="animate-pulse" />}
          </button>

          {/* Mobile Hamburguer Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 text-lotus hover:text-brass transition-colors focus:outline-none"
            id="mobile-menu-trigger"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* MOBILE FULLSCREEN OVERLAY MENU */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation-overlay"
          className="fixed inset-0 z-45 bg-[#0c0f0e]/95 backdrop-blur-lg flex flex-col justify-center items-center px-8 text-center"
        >
          <div className="flex flex-col gap-8 font-serif text-3xl tracking-widest text-lotus uppercase">
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
          <div className="absolute bottom-12 text-center text-xs tracking-widest uppercase font-bold text-stone/50 font-sans">
            📍 JP Nagar, Bangalore • Professional Men's Wellness
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
