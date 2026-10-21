/**
 * Code4Care - Tools Data Registry (js/tools-data.js)
 * 
 * Central registry for all physical and mental health tools in Code4Care.
 * Designed for pure vanilla JavaScript (no ES modules required).
 * 
 * HOW TO ADD A NEW TOOL IN THE FUTURE:
 * 1. Add an entry to the `TOOLS_DATA` array below with:
 *    - id: unique string identifier (e.g., 'bmi', 'breathing')
 *    - name: human-readable tool title
 *    - category: 'physical' or 'mental'
 *    - icon: inline SVG icon string
 *    - description: concise 1-2 sentence overview
 *    - status: 'coming-soon' (default) or 'active'
 * 2. When creating the real tool logic (e.g., in `js/tools/bmi.js`):
 *    - Simply define: `window.Code4CareToolsRegistry['bmi'] = { render: function(container) { ... } };`
 *    - The dashboard drawer will automatically call your `render` function!
 */

// Global registry for tool renderers
window.Code4CareToolsRegistry = window.Code4CareToolsRegistry || {};

// SVG Icon Helpers (clean, high-tech, medical-monitor inline SVGs)
var ICONS = {
  scale: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/><path d="M7 12a5 5 0 0 0 10 0"/></svg>',
  flame: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
  activity: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
  heart: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  droplet: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
  target: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  watch: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.34a2 2 0 0 1 2 1.82l.35 3.83"/></svg>',
  wind: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>',
  zap: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  smile: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
  moon: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
  bell: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>'
};

// All planned Code4Care tools metadata
var TOOLS_DATA = [
  // --- PHYSICAL HEALTH TOOLS ---
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    category: 'physical',
    icon: ICONS.scale,
    description: 'Calculate Body Mass Index, body fat estimation, and healthy weight ranges.',
    status: 'coming-soon',
    features: ['Metric and Imperial units', 'WHO category classification', 'Healthy weight range indicator']
  },
  {
    id: 'calorie-bmr',
    name: 'Calorie and BMR',
    category: 'physical',
    icon: ICONS.flame,
    description: 'Estimate Basal Metabolic Rate and Total Daily Energy Expenditure (TDEE).',
    status: 'coming-soon',
    features: ['Mifflin-St Jeor formula', 'Activity multiplier options', 'Deficit/surplus caloric targets']
  },
  {
    id: 'blood-pressure',
    name: 'Blood Pressure Checker',
    category: 'physical',
    icon: ICONS.activity,
    description: 'Log and evaluate systolic and diastolic pressures against clinical stages.',
    status: 'coming-soon',
    features: ['AHA/ACC classification', 'Visual pressure radar', 'Pulse pressure calculation']
  },
  {
    id: 'heart-rate-zones',
    name: 'Heart-Rate Zones',
    category: 'physical',
    icon: ICONS.heart,
    description: 'Determine your 5 cardiovascular training zones based on resting and max HR.',
    status: 'coming-soon',
    features: ['Karvonen formula', 'Fat-burn & anaerobic thresholds', 'Workout target guidelines']
  },
  {
    id: 'water-intake',
    name: 'Water Intake',
    category: 'physical',
    icon: ICONS.droplet,
    description: 'Compute optimal daily hydration targets tailored to body mass and climate.',
    status: 'coming-soon',
    features: ['Dynamic hydration formula', 'One-click daily cup logging', 'Visual telemetry glass']
  },
  {
    id: 'ideal-weight',
    name: 'Ideal Weight',
    category: 'physical',
    icon: ICONS.target,
    description: 'Compare multiple clinical formulas (Devine, Robinson, Miller, Hamwi).',
    status: 'coming-soon',
    features: ['Multi-formula comparison', 'Gender-specific modeling', 'Confidence bounds']
  },
  {
    id: 'pulse-counter',
    name: 'Pulse Counter',
    category: 'physical',
    icon: ICONS.watch,
    description: 'Interactive tap-tempo pulse counter to measure heart rate in real time.',
    status: 'coming-soon',
    features: ['Tap-to-measure engine', 'Live BPM smoothing', 'Rhythm stability metric']
  },

  // --- MENTAL WELLNESS TOOLS ---
  {
    id: 'breathing-pacer',
    name: 'Breathing Pacer',
    category: 'mental',
    icon: ICONS.wind,
    description: 'Guided visual breath pacing (Box breathing 4-4-4-4, 4-7-8, and Coherence).',
    status: 'coming-soon',
    features: ['Expanding neon visual circle', 'Custom inhale/hold/exhale timings', 'Haptic & audio cues']
  },
  {
    id: 'stress-check',
    name: 'Stress Check',
    category: 'mental',
    icon: ICONS.zap,
    description: 'Rapid self-assessment questionnaire based on the Perceived Stress Scale.',
    status: 'coming-soon',
    features: ['Validated PSS-10 adaptation', 'Instant stress index score', 'Calming recommendations']
  },
  {
    id: 'mood-tracker',
    name: 'Mood Tracker',
    category: 'mental',
    icon: ICONS.smile,
    description: 'Log valence and energy levels on an interactive emotional circumplex matrix.',
    status: 'coming-soon',
    features: ['2D emotion quadrant', 'Trigger and gratitude notes', 'Weekly mood trends']
  },
  {
    id: 'sleep-log',
    name: 'Sleep Log',
    category: 'mental',
    icon: ICONS.moon,
    description: 'Record bedtime, latency, wake-ups, and calculate sleep efficiency scores.',
    status: 'coming-soon',
    features: ['Sleep cycle calculation (90m)', 'Debt & efficiency telemetry', 'Circadian consistency score']
  },
  {
    id: 'meditation-timer',
    name: 'Meditation Timer',
    category: 'mental',
    icon: ICONS.bell,
    description: 'Minimalist ambient session timer with gentle interval chimes and focus stats.',
    status: 'coming-soon',
    features: ['Custom session durations', 'Ambient sound generator', 'Streak logging']
  }
];

// Expose globally for vanilla scripts
window.TOOLS_DATA = TOOLS_DATA;
window.CODE4CARE_ICONS = ICONS;
