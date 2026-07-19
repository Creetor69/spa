import { useEffect, useState } from "react";
import { BackgroundStream } from "./components/BackgroundStream";
import { Sections } from "./components/Sections";
import { triggerBell } from "./utils/audioSynth";

export default function App() {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  // Listen to window scroll events to drive the BackgroundStream petal and active states
  useEffect(() => {
    const handleScroll = () => {
      const sy = window.scrollY;
      setScrollY(sy);
      
      // Calculate active section based on scroll position vs innerHeight
      const h = window.innerHeight || 800;
      const index = Math.min(Math.max(Math.round(sy / h), 0), 7);
      setActiveSection(index);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Trigger once on load to lock current section
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Periodic temple bell chime every 2 minutes (120000ms) for natural serenity
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isMuted) {
        triggerBell();
      }
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, [isMuted]);

  return (
    <div className="relative w-full min-h-[800vh] bg-rainforest font-sans overflow-x-hidden selection:bg-brass/20 selection:text-lotus">
      {/* Background Interactive Stream and Golden Lotus Petal */}
      <BackgroundStream scrollY={scrollY} activeSection={activeSection} />

      {/* Left side fixed section vertical progress navigator */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-6 items-center">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
          const names = ["The Source", "The Stream", "The Forest", "Lotus Pond", "Reflection Pool", "Meditation Deck", "Booking", "Endless Lake"];
          const ids = [
            "section-hero",
            "section-stream",
            "section-forest",
            "section-pond",
            "section-reflection",
            "section-deck",
            "section-booking",
            "section-hero" // footer scrolls back up or to bottom
          ];
          const isActive = idx === activeSection;
          
          return (
            <button
              key={idx}
              onClick={() => {
                if (idx === 7) {
                  // Scroll to absolute bottom for the endless lake
                  window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
                } else {
                  const target = document.getElementById(ids[idx]);
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                  }
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
                  isActive ? "scale-110 opacity-100" : "scale-0 opacity-0 group-hover:scale-75 group-hover:opacity-50"
                }`}
              />
              {/* Inner core particle */}
              <div
                className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                  isActive ? "bg-brass scale-150" : "bg-stone/30 group-hover:bg-brass/60"
                }`}
              />
              {/* Tooltip text sliding out right */}
              <span className="absolute left-8 px-3 py-1 rounded bg-rainforest/90 border border-brass/10 text-brass text-[9px] tracking-widest uppercase font-bold opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl">
                {names[idx]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Left side corner Branding Shortcut */}
      <div className="fixed left-6 top-6 z-40">
        <a
          href="#section-hero"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("section-hero")?.scrollIntoView({ behavior: "smooth" });
            if (!isMuted) triggerBell();
          }}
          className="font-serif text-lg tracking-[0.25em] text-brass hover:text-lotus uppercase font-medium transition-colors"
          id="branding-logo-link"
        >
          Pure Bliss
        </a>
      </div>

      {/* Main Chapters Content Section */}
      <Sections
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />
    </div>
  );
}
