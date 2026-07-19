/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Interactive Web Audio API Synthesizer for Pure Bliss.
 * Generates continuous organic water sounds and resonant Buddhist temple bell chimes
 * directly in the browser without requiring external audio files.
 */

let audioCtx: AudioContext | null = null;
let waterNoiseSource: AudioBufferSourceNode | null = null;
let waterGain: GainNode | null = null;
let isPlaying = false;

// Initialize the Web Audio Context and synthesizers
export function initAudio() {
  if (audioCtx) return;

  // Create audio context
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) {
    console.error("Web Audio API is not supported in this browser.");
    return;
  }
  
  audioCtx = new AudioContextClass();

  // Create main output gains
  waterGain = audioCtx.createGain();
  waterGain.gain.setValueAtTime(0, audioCtx.currentTime); // Start silent
  waterGain.connect(audioCtx.destination);

  // --- WATER SYNTHESIS ---
  // 1. Generate White Noise Buffer
  const bufferSize = 4 * audioCtx.sampleRate; // 4 seconds of unique noise
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  waterNoiseSource = audioCtx.createBufferSource();
  waterNoiseSource.buffer = buffer;
  waterNoiseSource.loop = true;

  // 2. Filters to shape white noise into natural water sound
  // Lowpass filter for deep rumbling water depth
  const lowpassFilter = audioCtx.createBiquadFilter();
  lowpassFilter.type = "lowpass";
  lowpassFilter.frequency.setValueAtTime(450, audioCtx.currentTime);

  // Bandpass filter with moving center frequency to simulate surging currents
  const bandpassFilter = audioCtx.createBiquadFilter();
  bandpassFilter.type = "bandpass";
  bandpassFilter.Q.setValueAtTime(1.2, audioCtx.currentTime);
  bandpassFilter.frequency.setValueAtTime(280, audioCtx.currentTime);

  // Highpass filter for the crisp, splashy mist/rain effect
  const highpassFilter = audioCtx.createBiquadFilter();
  highpassFilter.type = "highpass";
  highpassFilter.frequency.setValueAtTime(1200, audioCtx.currentTime);

  // Create a separate dry gain for high frequency splashiness
  const highpassGain = audioCtx.createGain();
  highpassGain.gain.setValueAtTime(0.06, audioCtx.currentTime);

  // 3. Low Frequency Oscillator (LFO) to modulate bandpass filter (simulates water swelling)
  const lfo = audioCtx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.setValueAtTime(0.08, audioCtx.currentTime); // Very slow rise and fall (12.5 seconds)

  const lfoGain = audioCtx.createGain();
  lfoGain.gain.setValueAtTime(140, audioCtx.currentTime); // Swings filter frequency by +/- 140Hz

  // Connections for water noise
  lfo.connect(lfoGain);
  lfoGain.connect(bandpassFilter.frequency);

  // Split noise path to combine deep hum with splashy spray
  waterNoiseSource.connect(lowpassFilter);
  lowpassFilter.connect(bandpassFilter);
  bandpassFilter.connect(waterGain);

  waterNoiseSource.connect(highpassFilter);
  highpassFilter.connect(highpassGain);
  highpassGain.connect(waterGain);

  // Start sound sources
  waterNoiseSource.start(0);
  lfo.start(0);

  isPlaying = true;
}

// Fade water volume in or out
export function setWaterVolume(targetVolume: number, duration: number = 2.0) {
  if (!audioCtx) initAudio();
  if (!audioCtx || !waterGain) return;

  // Resume context if suspended (browser security autoplays blocking)
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  const now = audioCtx.currentTime;
  waterGain.gain.linearRampToValueAtTime(targetVolume * 0.45, now + duration); // Max 45% volume for comfort
}

// Resonant Buddhist Temple Bell synthesis
export function triggerBell() {
  if (!audioCtx) initAudio();
  if (!audioCtx) return;

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  const now = audioCtx.currentTime;

  // Bell base frequencies (sacred intervals & non-harmonics for metallic chime)
  // Fundamental at 108Hz (highly sacred and resonant)
  const partials = [
    { freq: 108, gain: 0.8, decay: 10.0 }, // Fundamental, deep resonance
    { freq: 216.4, gain: 0.5, decay: 6.0 },  // Octave
    { freq: 324.6, gain: 0.4, decay: 4.5 },  // Octave + Fifth
    { freq: 440.0, gain: 0.35, decay: 3.0 }, // Non-harmonic clang partial
    { freq: 592.5, gain: 0.25, decay: 2.0 }, // High bell hum
    { freq: 745.0, gain: 0.15, decay: 1.2 }, // Crisp bronze strike
    { freq: 1010.0, gain: 0.08, decay: 0.6 } // Tiny initial metal clink
  ];

  // Master bell node to route through delay line (eco effect in mountain valleys)
  const bellMasterGain = audioCtx.createGain();
  bellMasterGain.gain.setValueAtTime(0.35, now); // Control loudness of strike

  // Create delay node for mountain echoes
  const delayNode = audioCtx.createDelay(2.0);
  delayNode.delayTime.setValueAtTime(0.65, now); // 650ms echo

  const delayFeedback = audioCtx.createGain();
  delayFeedback.gain.setValueAtTime(0.4, now); // 40% feedback decay

  // Connect delay feedback loop
  delayNode.connect(delayFeedback);
  delayFeedback.connect(delayNode);

  // Connect master path
  bellMasterGain.connect(audioCtx.destination);
  bellMasterGain.connect(delayNode);
  delayNode.connect(audioCtx.destination);

  // Synthesis each partial
  partials.forEach((p) => {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(p.freq, now);

    // Exponential strike decay envelope
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.exponentialRampToValueAtTime(p.gain, now + 0.04); // Fast strike attack (40ms)
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + p.decay); // Exp decay

    osc.connect(gainNode);
    gainNode.connect(bellMasterGain);

    // Start & clean up oscillator
    osc.start(now);
    osc.stop(now + p.decay + 0.5);
  });
}
