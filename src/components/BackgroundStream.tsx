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
    landmarks: [500, 2200, 3900, 5600, 7500], // default approximations for 5 sections
    currentDistance: 500,
    time: 0,
    fireflies: [] as Array<{ id: number; x: number; y: number; speed: number; size: number; phase: number }>,
    mistParticles: [] as Array<{ id: number; x: number; y: number; vx: number; scale: number; opacity: number }>
  });

  // State to force trigger some React renders if needed, but mostly RAF-driven
  const [initComplete, setInitComplete] = useState(false);

  // SVG River path coordinate definition (A smooth, elegant, flowing bezier water stream)
  const riverPathD = `
    M 500,0 
    C 530,1000 470,2000 520,3000
    C 480,4000 520,5000 480,6000
    C 520,7000 500,7500 500,8000
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
      const targetYs = [500, 2200, 3900, 5600, 7500];
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
        const activeIdx = Math.min(Math.floor(scrollRatio * 4), 4);
        // Calculate remaining scroll ratio in the active segment
        const segmentStart = activeIdx / 4;
        const segmentEnd = (activeIdx + 1) / 4;
        const segmentProgress = (scrollRatio - segmentStart) * 4; // 0..1 inside this segment

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
          const nextIdx = Math.min(activeIdx + 1, 4);
          const startD = landmarks[activeIdx];
          const endD = landmarks[nextIdx];
          // Scale 0.7..1.0 progress to 0..1
          const t = (segmentProgress - 0.7) / 0.3;
          const smoothT = Math.sin((t - 0.5) * Math.PI) * 0.5 + 0.5;
          targetDistance = startD + (endD - startD) * smoothT;
          whirlpoolIntensity = smoothT * (nextIdx < 4 ? 1 : 0);
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
      className="absolute top-0 left-0 right-0 h-full pointer-events-none z-0 overflow-hidden"
      id="background-stream-container"
    >
      <svg
        viewBox="0 0 1000 8000"
        className="w-full h-full opacity-60"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Water gradients */}
          <linearGradient id="river-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E5D45" stopOpacity="0.08" />
            <stop offset="20%" stopColor="#1E5D45" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#5B7F4F" stopOpacity="0.18" />
            <stop offset="80%" stopColor="#0B3D2E" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#051c15" stopOpacity="0.30" />
          </linearGradient>

          <linearGradient id="stream-shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F2EFE7" stopOpacity="0.0" />
            <stop offset="50%" stopColor="#F2EFE7" stopOpacity="0.20" />
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
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          {/* Golden glow filter for petal and fireflies */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- LAYER 1: AMBIENT WATER RIVERBED --- */}
        <path
          d={riverPathD}
          fill="none"
          stroke="url(#river-gradient)"
          strokeWidth="45"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="water-ripple-effect opacity-60"
        />

        {/* --- LAYER 2: SHIMMERING ACTIVE CURRENT --- */}
        <path
          ref={flowCoreRef}
          d={riverPathD}
          fill="none"
          stroke="url(#stream-shimmer)"
          strokeWidth="14"
          strokeLinecap="round"
          className="water-ripple-effect opacity-40 mix-blend-overlay"
        />

        {/* --- LAYER 2B: INNER LIQUID SHIMMER VEINS --- */}
        <path
          d={riverPathD}
          fill="none"
          stroke="#F2EFE7"
          strokeWidth="2"
          strokeLinecap="round"
          className="water-ripple-effect opacity-20 mix-blend-screen"
        />

        <path
          d={riverPathD}
          fill="none"
          stroke="#B9964B"
          strokeWidth="1"
          strokeLinecap="round"
          className="water-ripple-effect opacity-20 mix-blend-color-dodge"
        />

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
        <g ref={petalRef} id="petal-guide" style={{ pointerEvents: "none" }}>
          {/* Subtle glow around petal */}
          <circle cx="0" cy="0" r="10" fill="#B9964B" fillOpacity="0.12" />
          {/* The Golden Lotus Petal geometry */}
          <path
            d="M 0,-12 C 6,-4 10,4 0,13 C -10,4 -6,-4 0,-12 Z"
            fill="url(#golden-petal)"
            stroke="#F2EFE7"
            strokeWidth="1"
            filter="url(#glow)"
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
