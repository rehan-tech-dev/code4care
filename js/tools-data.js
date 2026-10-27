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

// All active Code4Care tools metadata with simple, friendly English
var TOOLS_DATA = [
  // --- PHYSICAL HEALTH TOOLS ---
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    category: 'physical',
    icon: ICONS.scale,
    description: 'Check if your weight is in a healthy balance for your height.',
    status: 'active',
    features: ['Metric (kg/cm) and US (lbs/ft) units', 'Clear colored health zones', 'Target healthy weight range']
  },
  {
    id: 'calorie-bmr',
    name: 'Calorie & BMR Calculator',
    category: 'physical',
    icon: ICONS.flame,
    description: 'See how many calories you burn each day and what to eat to reach your goals.',
    status: 'active',
    features: ['Resting calorie burn (BMR)', 'Daily workout activity boost', 'Protein, carb, and fat breakdown']
  },
  {
    id: 'blood-pressure',
    name: 'Blood Pressure Checker',
    category: 'physical',
    icon: ICONS.activity,
    description: 'Check your blood pressure numbers to see if they are healthy or if you need to rest.',
    status: 'active',
    features: ['Simple normal/elevated/high guide', 'Pulse pressure check', 'Helpful everyday health tips']
  },
  {
    id: 'heart-rate-zones',
    name: 'Heart-Rate Zones',
    category: 'physical',
    icon: ICONS.heart,
    description: 'Find the right pulse for warming up, burning fat, and cardio workouts.',
    status: 'active',
    features: ['5 custom exercise zones', 'Fat burn & endurance BPM', 'Easy-to-follow workout tips']
  },
  {
    id: 'water-intake',
    name: 'Water Intake Tracker',
    category: 'physical',
    icon: ICONS.droplet,
    description: 'Track how much water you drink each day to stay hydrated and refreshed.',
    status: 'active',
    features: ['Animated filling water glass', 'Quick +1 Cup (250 ml) tap', 'Daily goal progress bar']
  },
  {
    id: 'ideal-weight',
    name: 'Ideal Weight Guide',
    category: 'physical',
    icon: ICONS.target,
    description: 'Discover your comfortable, healthy weight range based on your height and frame.',
    status: 'active',
    features: ['Adjusts for body frame', 'Comfortable healthy range', 'Encouraging health reminders']
  },
  {
    id: 'pulse-counter',
    name: 'Tap Pulse Counter',
    category: 'physical',
    icon: ICONS.watch,
    description: 'Tap along with your heartbeat to measure your pulse in real time.',
    status: 'active',
    features: ['Interactive pulsing heart button', 'Live BPM speed counter', 'Instant resting rating']
  },

  // --- MENTAL WELLNESS TOOLS ---
  {
    id: 'breathing-pacer',
    name: 'Breathing Pacer',
    category: 'mental',
    icon: ICONS.wind,
    description: 'Calm your body and mind with soothing guided breathing exercises.',
    status: 'active',
    features: ['Expanding visual breath circle', 'Box breathing (4-4-4-4) & Sleep (4-7-8)', 'Soft audio chime cues']
  },
  {
    id: 'stress-check',
    name: 'Quick Stress Check',
    category: 'mental',
    icon: ICONS.zap,
    description: 'A 1-minute friendly check-in to see how stressed you feel and get calming advice.',
    status: 'active',
    features: ['4 quick check-in questions', 'Instant 0-100 stress score', '3 gentle tips to relax']
  },
  {
    id: 'mood-tracker',
    name: 'Daily Mood Tracker',
    category: 'mental',
    icon: ICONS.smile,
    description: 'Check in with how you feel today and notice what makes you happy.',
    status: 'active',
    features: ['5 animated emoji feelings', 'Quick tags (Exercise, Sleep, Friends)', 'Daily gratitude note']
  },
  {
    id: 'sleep-log',
    name: 'Sleep Log & Bedtime Calculator',
    category: 'mental',
    icon: ICONS.moon,
    description: 'Find the best bedtime to wake up refreshed and track last night\'s rest.',
    status: 'active',
    features: ['90-minute sleep cycle calculator', 'Wake up refreshed without grogginess', 'Log hours & quality']
  },
  {
    id: 'meditation-timer',
    name: 'Peaceful Meditation Timer',
    category: 'mental',
    icon: ICONS.bell,
    description: 'Take a quiet pause to rest your mind and reset your focus with gentle bells.',
    status: 'active',
    features: ['1, 3, 5, 10, or 15 minute timers', 'Circular animated timer ring', 'Gentle opening & closing bells']
  }
];

// Expose globally for vanilla scripts
window.TOOLS_DATA = TOOLS_DATA;
window.CODE4CARE_ICONS = ICONS;
