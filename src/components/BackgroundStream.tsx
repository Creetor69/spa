import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface BackgroundStreamProps {
  scrollY: number;
  activeSection: number;
}

export const BackgroundStream: React.FC<BackgroundStreamProps> = ({ scrollY, activeSection }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const petalRef = useRef<SVGGElement>(null);
  const flowCoreRef = useRef<SVGPathElement>(null);

  // Constants for coordinate mapping
  // Total height coordinate system is 0 to 8000.
  // There are 8 main vertical landing levels (from Hero=0 to Footer=7)
  const totalHeightCoords = 8000;
  
  // Track river properties in ref for RAF loop
  const stateRef = useRef({
    totalLength: 0,
    landmarks: [500, 1500, 2500, 3500, 4500, 5500, 6500, 7500], // default approximations
    currentDistance: 500,
    time: 0,
    fireflies: [] as Array<{ id: number; x: number; y: number; speed: number; size: number; phase: number }>,
    mistParticles: [] as Array<{ id: number; x: number; y: number; vx: number; scale: number; opacity: number }>
  });

  // State to force trigger some React renders if needed, but mostly RAF-driven
  const [initComplete, setInitComplete] = useState(false);

  // SVG River path coordinate definition (A gorgeous winding bezier stream)
  const riverPathD = `
    M 500,0 
    C 480,250 440,400 450,500
    C 460,600 520,750 500,1000
    C 480,1250 550,1350 540,1500
    C 530,1650 440,1750 460,2000
    C 480,2250 560,2350 550,2500
    C 540,2650 450,2750 460,3000
    C 470,3250 430,3350 500,3500
    C 570,3650 520,3850 500,4000
    C 480,4150 470,4350 500,4500
    C 530,4650 520,4850 490,5000
    C 460,5150 430,5350 440,5500
    C 450,5650 530,5850 500,6000
    C 470,6150 480,6350 500,6500
    C 520,6650 500,6850 500,7000
    C 500,7250 500,7500 500,8000
  `.trim().replace(/\s+/g, " ");

  useEffect(() => {
    // Generate fireflies (Section 4 onwards, visible at night footer)
    const fireflies = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      x: 100 + Math.random() * 800,
      y: 4000 + Math.random() * 3900, // Bottom half
      speed: 0.5 + Math.random() * 1.5,
      size: 2 + Math.random() * 4,
      phase: Math.random() * Math.PI * 2,
    }));

    // Generate drift mist particles
    const mistParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 1000,
      y: Math.random() * 8000,
      vx: -0.2 - Math.random() * 0.4,
      scale: 1.5 + Math.random() * 2,
      opacity: 0.15 + Math.random() * 0.25,
    }));

    stateRef.current.fireflies = fireflies;
    stateRef.current.mistParticles = mistParticles;

    // Initialize SVG Path length calculations
    const path = pathRef.current;
    if (path) {
      const length = path.getTotalLength();
      stateRef.current.totalLength = length;

      // Programmatically scan path to locate optimal distances for Y centers
      const targetYs = [500, 1500, 2500, 3500, 4500, 5500, 6500, 7500];
      const scannedLandmarks = targetYs.map((targetY) => {
        let bestDist = 0;
        let minDistDiff = Infinity;
        // Search path points
        for (let d = 0; d <= length; d += length / 400) {
          const pt = path.getPointAtLength(d);
          const diff = Math.abs(pt.y - targetY);
          if (diff < minDistDiff) {
            minDistDiff = diff;
            bestDist = d;
          }
        }
        return bestDist;
      });

      stateRef.current.landmarks = scannedLandmarks;
      setInitComplete(true);
    }
  }, []);

  // Frame animation loop (highly performant ref-based layout steering)
  useEffect(() => {
    let animId: number;
    
    const updateLoop = () => {
      stateRef.current.time += 16.67; // approx 60fps frame increments
      const time = stateRef.current.time;
      const path = pathRef.current;
      const petal = petalRef.current;

      if (path && petal && stateRef.current.totalLength > 0) {
        const totalLength = stateRef.current.totalLength;
        const landmarks = stateRef.current.landmarks;

        // 1. Calculate active section and progress in that section
        // We assume each of the 8 visual sections occupies 100vh of space.
        // Let's compute overall document scroll ratio
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const rawScrollRatio = docHeight > 0 ? scrollY / docHeight : 0;
        const scrollRatio = Math.min(Math.max(rawScrollRatio, 0), 1);

        // Map scrollRatio to section index and progress
        const activeIdx = Math.min(Math.floor(scrollRatio * 7), 7);
        // Calculate remaining scroll ratio in the active segment
        const segmentStart = activeIdx / 7;
        const segmentEnd = (activeIdx + 1) / 7;
        const segmentProgress = (scrollRatio - segmentStart) * 7; // 0..1 inside this segment

        // 2. Interpolate path distance with "Whirlpool pause" plateaus
        let targetDistance = 0;
        let whirlpoolIntensity = 0;

        if (segmentProgress < 0.3) {
          // Transitioning between previous section center and this section center
          const prevIdx = Math.max(activeIdx - 1, 0);
          const startD = landmarks[prevIdx];
          const endD = landmarks[activeIdx];
          // Scale 0..0.3 progress to 0..1
          const t = segmentProgress / 0.3;
          const smoothT = Math.sin((t - 0.5) * Math.PI) * 0.5 + 0.5; // Hermite-like wave
          targetDistance = startD + (endD - startD) * smoothT;
          whirlpoolIntensity = (1 - smoothT) * (prevIdx > 0 ? 1 : 0);
        } else if (segmentProgress > 0.7) {
          // Transitioning out of this section to next
          const nextIdx = Math.min(activeIdx + 1, 7);
          const startD = landmarks[activeIdx];
          const endD = landmarks[nextIdx];
          // Scale 0.7..1.0 progress to 0..1
          const t = (segmentProgress - 0.7) / 0.3;
          const smoothT = Math.sin((t - 0.5) * Math.PI) * 0.5 + 0.5;
          targetDistance = startD + (endD - startD) * smoothT;
          whirlpoolIntensity = smoothT * (nextIdx < 7 ? 1 : 0);
        } else {
          // Staying in the center zone -> Perfect plateau, full whirlpool circle!
          targetDistance = landmarks[activeIdx];
          whirlpoolIntensity = 1.0;
        }

        // Smoothly interpolate currentDistance to targetDistance for momentum inertia
        stateRef.current.currentDistance += (targetDistance - stateRef.current.currentDistance) * 0.12;
        const d = stateRef.current.currentDistance;

        // 3. Compute position along the SVG path
        const pt = path.getPointAtLength(d);

        // 4. Compute path direction (tangent angle) for automatic steering
        const ptAhead = path.getPointAtLength(Math.min(d + 4, totalLength));
        const tangentAngleRad = Math.atan2(ptAhead.y - pt.y, ptAhead.x - pt.x);
        let tangentAngleDeg = (tangentAngleRad * 180) / Math.PI;

        // 5. Add circular whirlpool swirl offsets
        let ox = 0;
        let oy = 0;
        let swirlAngleDeg = 0;

        if (whirlpoolIntensity > 0.02) {
          const swirlSpeed = 0.0035;
          const swirlRadius = whirlpoolIntensity * 28; // Orbit up to 28 units out
          const theta = time * swirlSpeed;
          ox = Math.cos(theta) * swirlRadius;
          oy = Math.sin(theta) * swirlRadius;
          swirlAngleDeg = Math.sin(time * 0.002) * 15 * whirlpoolIntensity; // rotational sway in pool
        }

        // Gentle leaf floating/bobbing rotation
        const swayAngle = Math.sin(time * 0.0015) * 12;
        const finalRotation = tangentAngleDeg + swayAngle + swirlAngleDeg;

        // 6. Direct DOM update for top-tier 60fps performance without React updates!
        const finalX = pt.x + ox;
        const finalY = pt.y + oy;
        petal.setAttribute(
          "transform",
          `translate(${finalX}, ${finalY}) rotate(${finalRotation})`
        );
      }

      // Update canvas / animate decorative elements if we have fireflies or mist
      // We can also animate fireflies in React or direct DOM using individual references.
      // Since fireflies are standard SVGs, let's let CSS/react animate or animate them inside the SVG.
      // Actually, we can animate fireflies dynamically inside SVG groups!
      const firefliesGroup = document.getElementById("fireflies-group");
      if (firefliesGroup && stateRef.current.fireflies.length > 0) {
        const children = firefliesGroup.children;
        const ff = stateRef.current.fireflies;
        for (let i = 0; i < children.length; i++) {
          const el = children[i];
          const data = ff[i];
          if (el && data) {
            const phase = data.phase + time * 0.001 * data.speed;
            const ox = Math.sin(phase * 1.5) * 20;
            const oy = Math.cos(phase * 0.8) * 15;
            const x = data.x + ox;
            const y = data.y + oy;
            const opacity = 0.3 + Math.sin(phase * 2.5) * 0.6; // beautiful glowing pulse
            el.setAttribute("cx", x.toString());
            el.setAttribute("cy", y.toString());
            el.setAttribute("opacity", opacity.toString());
          }
        }
      }

      animId = requestAnimationFrame(updateLoop);
    };

    animId = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(animId);
  }, [scrollY, initComplete]);

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 right-0 h-full pointer-events-none z-10 overflow-hidden"
      id="background-stream-container"
    >
      <svg
        viewBox="0 0 1000 8000"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Water gradients */}
          <linearGradient id="river-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E5D45" stopOpacity="0.12" />
            <stop offset="15%" stopColor="#1E5D45" stopOpacity="0.25" />
            <stop offset="45%" stopColor="#5B7F4F" stopOpacity="0.28" />
            <stop offset="65%" stopColor="#1E5D45" stopOpacity="0.35" />
            <stop offset="85%" stopColor="#0B3D2E" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#051c15" stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id="stream-shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F2EFE7" stopOpacity="0.0" />
            <stop offset="50%" stopColor="#F2EFE7" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#F2EFE7" stopOpacity="0.0" />
          </linearGradient>

          {/* Lotus Petal Golden Gradient */}
          <linearGradient id="golden-petal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F2EFE7" />
            <stop offset="40%" stopColor="#B9964B" />
            <stop offset="100%" stopColor="#4A3426" />
          </linearGradient>

          {/* Water ripple displace filters with dynamic organic animation */}
          <filter id="ripple-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.05" numOctaves="3" result="noise">
              <animate attributeName="baseFrequency" dur="25s" values="0.015 0.04; 0.015 0.08; 0.015 0.04" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="18" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          {/* Golden glow filter for petal and fireflies */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- LAYER 1: WIDE AMBIENT WATER RIVERBED --- */}
        <path
          d={riverPathD}
          fill="none"
          stroke="url(#river-gradient)"
          strokeWidth="65"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="water-ripple-effect opacity-80"
        />

        {/* --- LAYER 2: SHIMMERING ACTIVE CURRENT 1 (Main Stream) --- */}
        <path
          ref={flowCoreRef}
          d={riverPathD}
          fill="none"
          stroke="url(#stream-shimmer)"
          strokeWidth="20"
          strokeLinecap="round"
          className="water-ripple-effect opacity-60 mix-blend-overlay"
        />

        {/* --- LAYER 2B: INNER LIQUID CURRENT SHIMMER VEINS (Continuous flowing water) --- */}
        <path
          d={riverPathD}
          fill="none"
          stroke="#F2EFE7"
          strokeWidth="3"
          strokeLinecap="round"
          className="water-ripple-effect opacity-35 mix-blend-screen"
        />

        <path
          d={riverPathD}
          fill="none"
          stroke="#B9964B"
          strokeWidth="1"
          strokeLinecap="round"
          className="water-ripple-effect opacity-20 mix-blend-color-dodge"
        />

        {/* --- SPECIAL ENVIRONMENT POOLS --- */}
        {/* Lotus Pond Center Expansion (Y=3500) */}
        <circle
          cx="500"
          cy="3500"
          r="140"
          fill="#1E5D45"
          fillOpacity="0.15"
          stroke="#F2EFE7"
          strokeOpacity="0.1"
          strokeWidth="2"
          className="water-ripple-effect"
        />
        <circle
          cx="500"
          cy="3500"
          r="95"
          fill="none"
          stroke="#B9964B"
          strokeOpacity="0.12"
          strokeWidth="1"
          strokeDasharray="4 8"
        />

        {/* Reflection Pool Center Expansion (Y=4500) */}
        <rect
          x="350"
          y="4320"
          width="300"
          height="360"
          rx="25"
          fill="#1E5D45"
          fillOpacity="0.12"
          stroke="#F2EFE7"
          strokeOpacity="0.08"
          strokeWidth="3"
          className="water-ripple-effect"
        />

        {/* Meditation Deck Stone Bowl (Y=6500) */}
        <circle
          cx="500"
          cy="6500"
          r="110"
          fill="#0B3D2E"
          stroke="#8D8F86"
          strokeWidth="14"
          className="shadow-2xl"
        />
        <circle
          cx="500"
          cy="6500"
          r="92"
          fill="#1E5D45"
          fillOpacity="0.4"
          stroke="#B9964B"
          strokeOpacity="0.25"
          strokeWidth="2"
          className="water-ripple-effect"
        />
        
        {/* Dripping Ripple Waves (Drips triggered periodically from CSS/JS) */}
        <circle cx="500" cy="6500" r="10" fill="none" stroke="#F2EFE7" strokeWidth="1" opacity="0">
          <animate attributeName="r" values="10;90" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="500" cy="6500" r="10" fill="none" stroke="#B9964B" strokeWidth="1" opacity="0">
          <animate attributeName="r" values="10;90" dur="4s" begin="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0" dur="4s" begin="2s" repeatCount="indefinite" />
        </circle>

        {/* --- DECORATIVE MOSS ROCKS AND FLOATING LEAVES --- */}
        {/* Stone shapes strategically placed bordering the river */}
        <g id="riverbank-details" fill="#8D8F86" opacity="0.4">
          {/* Rocks Section 2 (The Stream) */}
          <path d="M 400,1200 Q 370,1180 380,1230 Z" fill="#4A3426" />
          <path d="M 610,1350 Q 640,1380 590,1400 Z" fill="#8D8F86" />
          <path d="M 410,1720 Q 390,1760 430,1780 Z" fill="#5B7F4F" />
          
          {/* Rocks Section 3 (The Forest) */}
          <path d="M 620,2250 Q 590,2290 630,2300 Z" fill="#8D8F86" />
          <path d="M 370,2650 Q 380,2600 410,2630 Z" fill="#4A3426" />
          
          {/* Rocks Section 5 (Meditation Deck) */}
          <path d="M 380,5350 Q 360,5400 390,5420 Z" fill="#8D8F86" />
          <path d="M 600,5650 Q 640,5620 610,5680 Z" fill="#5B7F4F" />
        </g>

        {/* --- LAYER 3: THE GOLDEN FLIGHT OF THE LOTUS PETAL --- */}
        {/* This invisible guiding path is identical to the visual river path */}
        <path
          ref={pathRef}
          d={riverPathD}
          fill="none"
          stroke="none"
          strokeWidth="0"
          className="hidden"
        />

        {/* Floating Lotus Petal Element */}
        <g ref={petalRef} id="petal-guide" style={{ cursor: "pointer" }}>
          {/* Pulsing visual indicator around the petal */}
          <circle cx="0" cy="0" r="22" fill="#B9964B" fillOpacity="0.15" filter="url(#glow)">
            <animate attributeName="r" values="18;26;18" dur="3s" repeatCount="indefinite" />
            <animate attributeName="fill-opacity" values="0.1;0.25;0.1" dur="3s" repeatCount="indefinite" />
          </circle>
          {/* The Golden Lotus Petal geometry */}
          <path
            d="M 0,-15 C 8,-5 12,5 0,16 C -12,5 -8,-5 0,-15 Z"
            fill="url(#golden-petal)"
            stroke="#F2EFE7"
            strokeWidth="1.2"
            filter="url(#glow)"
            style={{ transform: "scale(1.2)" }}
          />
          {/* Inner details */}
          <path
            d="M 0,-12 C 3,-4 3,4 0,10"
            fill="none"
            stroke="#F2EFE7"
            strokeWidth="0.5"
            opacity="0.6"
          />
        </g>

        {/* --- LAYER 4: ACTIVE FIREFLIES DYNAMIC GROUP --- */}
        <g id="fireflies-group" filter="url(#glow)">
          {Array.from({ length: 45 }).map((_, i) => (
            <circle
              key={i}
              cx="0"
              cy="0"
              r={2 + Math.random() * 3}
              fill="#F2EFE7"
              opacity="0"
            />
          ))}
        </g>
      </svg>
    </div>
  );
};
