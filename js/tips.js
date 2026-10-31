/**
 * Code4Care - Health Tips & Vitals Coach (js/tips.js)
 * 
 * Comprehensive interactive health tips engine:
 * 1. Rich science-backed tips repository across 5 health pillars
 * 2. Rotating "Tip of the Day" with shuffle, bookmark, and "Done today" tracking
 * 3. Interactive "How Are You Feeling Right Now?" Instant Wellness Advisor
 * 4. 60-Second "Desk Reset & Eye Relief" animated guided timer with Web Audio chime
 * 5. Daily Micro-Habits Checklist with progress tracking & streak persistence
 * 6. Search & category filter pills with instant reactive updates
 * 7. One-click shortcuts to launch corresponding Code4Care diagnostic tools
 * 8. Pure Vanilla JavaScript & LocalStorage persistence
 */

(function () {
  'use strict';

  // --- Health Tips Data Repository ---
  var HEALTH_TIPS = [
    {
      id: 'tip-20-20-20',
      title: 'The 20-20-20 Eye Strain Reset',
      category: 'posture',
      categoryName: 'Screen & Posture',
      categoryIcon: '👁️',
      badgeColor: 'cyan',
      readTime: '1 min read',
      summary: 'Protect your vision and prevent digital fatigue during long screen sessions.',
      science: 'Staring continuously at close screens locks the ciliary muscles in your eyes. Looking at least 20 feet away allows these tiny focusing muscles to fully relax, preventing headaches and dry eyes.',
      action: 'Every 20 minutes, look at an object 20 feet away (out a window or down a hallway) for 20 seconds.',
      toolId: 'breathing-pacer',
      toolLabel: 'Take a 2-min Breath Break'
    },
    {
      id: 'tip-morning-water',
      title: 'Morning Metabolic Hydration',
      category: 'nutrition',
      categoryName: 'Nutrition & Water',
      categoryIcon: '💧',
      badgeColor: 'cyan',
      readTime: '1 min read',
      summary: 'Re-energize your cells immediately after 7-8 hours of nighttime dehydration.',
      science: 'You lose between 500 mL and 1 liter of moisture overnight simply through respiration and skin perspiration. Drinking water first thing jumpstarts blood circulation and boosts metabolic rate by up to 24%.',
      action: 'Drink a full tall glass (400-500 mL) of room-temperature water before having your morning tea or coffee.',
      toolId: 'water-intake',
      toolLabel: 'Log in Water Tracker'
    },
    {
      id: 'tip-sleep-cycles',
      title: 'The 90-Minute Sleep Wave',
      category: 'sleep',
      categoryName: 'Sleep & Recovery',
      categoryIcon: '🌙',
      badgeColor: 'rose',
      readTime: '2 min read',
      summary: 'Wake up feeling crisp and alert by syncing your alarm with natural sleep stages.',
      science: 'Human sleep progresses through cyclical phases (Light, Deep Slow-Wave, and REM) lasting approximately 90 minutes. Waking in the middle of deep sleep causes grogginess (sleep inertia) that lasts for hours.',
      action: 'Aim for sleep durations that are multiples of 90 minutes (e.g. 6 hours = 4 cycles, or 7.5 hours = 5 cycles).',
      toolId: 'sleep-log',
      toolLabel: 'Calculate Bedtime'
    },
    {
      id: 'tip-physiological-sigh',
      title: 'Physiological Sigh for Rapid Calm',
      category: 'mental',
      categoryName: 'Mental Calm',
      categoryIcon: '🫁',
      badgeColor: 'rose',
      readTime: '1 min read',
      summary: 'The fastest, science-backed breathing pattern to switch off acute stress.',
      science: 'Studied extensively at Stanford Medicine, two quick inhales followed by one long, slow sighing exhale re-inflates collapsed pulmonary alveoli and stimulates the vagus nerve, rapidly slowing heart rate.',
      action: 'Take two sharp inhales through the nose (one big, one top-off), then exhale slowly through the mouth for 6-8 seconds. Repeat 3 times.',
      toolId: 'breathing-pacer',
      toolLabel: 'Open Breathing Pacer'
    },
    {
      id: 'tip-post-meal-walk',
      title: 'The 10-Minute Post-Meal Stroll',
      category: 'physical',
      categoryName: 'Physical & Cardio',
      categoryIcon: '🚶',
      badgeColor: 'emerald',
      readTime: '1 min read',
      summary: 'Blunt blood sugar spikes and avoid the dreaded afternoon food coma.',
      science: 'Contracting your major leg muscles (quadriceps and calves) within 30 minutes of eating absorbs glucose directly from the bloodstream into muscle cells via GLUT4 transporters, without requiring excess insulin.',
      action: 'Take a relaxed 10-minute walk around the block or inside your office right after lunch or dinner.',
      toolId: 'calorie-bmr',
      toolLabel: 'View Calorie & BMR'
    },
    {
      id: 'tip-caffeine-cutoff',
      title: 'The 10-Hour Caffeine Curfew',
      category: 'sleep',
      categoryName: 'Sleep & Recovery',
      categoryIcon: '☕',
      badgeColor: 'rose',
      readTime: '2 min read',
      summary: 'Preserve deep restorative slow-wave sleep without giving up your morning cup.',
      science: 'Caffeine has a quarter-life of up to 10-12 hours. A cup of coffee at 3:00 PM means 25% of that stimulant is still actively blocking adenosine receptors in your brain at midnight, disrupting restorative REM sleep.',
      action: 'Enjoy your last caffeinated drink at least 8 to 10 hours before your planned bedtime (around 1:00 PM for a 10:30 PM sleep).',
      toolId: 'sleep-log',
      toolLabel: 'Check Sleep Log'
    },
    {
      id: 'tip-morning-sunlight',
      title: 'Natural Morning Daylight Anchor',
      category: 'sleep',
      categoryName: 'Sleep & Recovery',
      categoryIcon: '☀️',
      badgeColor: 'warning',
      readTime: '1 min read',
      summary: 'Set your master circadian clock for morning energy and effortless nighttime drowsiness.',
      science: 'Sunlight hitting specialized retinal ganglion cells in the morning triggers a healthy cortisol pulse and starts a biological 14-hour timer for natural melatonin release in the evening.',
      action: 'Step outside for 10-15 minutes of natural sunlight within 60 minutes of waking up (even on overcast days).',
      toolId: 'sleep-log',
      toolLabel: 'View Sleep Tool'
    },
    {
      id: 'tip-desk-posture',
      title: 'The 90-Degree Ergonomic Posture',
      category: 'posture',
      categoryName: 'Screen & Posture',
      categoryIcon: '💻',
      badgeColor: 'cyan',
      readTime: '2 min read',
      summary: 'Relieve upper neck tension and prevent lumbar fatigue while working at a desk.',
      science: 'Bending your head forward at a 45-degree angle to look down at a laptop multiplies the gravitational stress on your cervical spine to approximately 49 lbs (22 kg).',
      action: 'Elevate your monitor so the top third of the screen is at eye level. Keep elbows bent at 90 degrees and feet flat on the floor.',
      toolId: 'ideal-weight',
      toolLabel: 'Check Weight & Frame'
    },
    {
      id: 'tip-box-breathing',
      title: 'Box Breathing for Laser Focus',
      category: 'mental',
      categoryName: 'Mental Calm',
      categoryIcon: '🧘',
      badgeColor: 'rose',
      readTime: '1 min read',
      summary: 'Downregulate nervous system arousal before important presentations, exams, or meetings.',
      science: 'A 4x4 balanced breathing pattern balances carbon dioxide and oxygen levels in the blood, shifting the autonomic nervous system from sympathetic fight-or-flight into steady parasympathetic control.',
      action: 'Inhale for 4s, hold your breath for 4s, exhale gently for 4s, hold empty for 4s. Repeat 4 full cycles.',
      toolId: 'breathing-pacer',
      toolLabel: 'Try Box Breathing'
    },
    {
      id: 'tip-fat-burn-zone',
      title: 'Heart Rate Zone 2 for Sustainable Fitness',
      category: 'physical',
      categoryName: 'Physical & Cardio',
      categoryIcon: '🫀',
      badgeColor: 'emerald',
      readTime: '2 min read',
      summary: 'Build immense cardiovascular endurance and burn fat without exhausting your body.',
      science: 'Zone 2 cardio (60-70% of maximum heart rate) maximizes mitochondrial density and fat oxidation while keeping systemic inflammation and cortisol minimal.',
      action: 'During your cardio or brisk walks, maintain a pace where you can still speak in full sentences without gasping for breath.',
      toolId: 'heart-rate-zones',
      toolLabel: 'Find Your Heart Zones'
    },
    {
      id: 'tip-54321-grounding',
      title: 'The 5-4-3-2-1 Sensory Grounding Reset',
      category: 'mental',
      categoryName: 'Mental Calm',
      categoryIcon: '🧠',
      badgeColor: 'rose',
      readTime: '2 min read',
      summary: 'Pull your mind out of spiraling worry and reconnect instantly to the physical present.',
      science: 'Engaging multiple sensory cortices simultaneously interrupts amygdala-driven threat loops and engages the prefrontal cortex in neutral observation.',
      action: 'Acknowledge 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.',
      toolId: 'stress-check',
      toolLabel: 'Take Quick Stress Check'
    },
    {
      id: 'tip-electrolytes',
      title: 'Electrolytes: More Than Just Plain Water',
      category: 'nutrition',
      categoryName: 'Nutrition & Water',
      categoryIcon: '🧂',
      badgeColor: 'cyan',
      readTime: '1 min read',
      summary: 'Prevent afternoon sluggishness caused by mineral depletion and cellular dehydration.',
      science: 'Water enters cells via osmotic gradients maintained by sodium, potassium, and magnesium. Guzzling plain water without minerals can dilute blood sodium and increase fatigue.',
      action: 'If exercising or drinking plenty of water, ensure your diet includes bananas, avocados, leafy greens, or a tiny pinch of unrefined sea salt.',
      toolId: 'water-intake',
      toolLabel: 'Track Water Intake'
    },
    {
      id: 'tip-digital-sunset',
      title: 'The 45-Minute Digital Sunset',
      category: 'sleep',
      categoryName: 'Sleep & Recovery',
      categoryIcon: '📵',
      badgeColor: 'rose',
      readTime: '1 min read',
      summary: 'Stop blue light from sabotaging your brain\'s natural sleep signals.',
      science: 'Short-wavelength blue light emitted from smartphones suppresses pineal melatonin production by up to 80%, tricking your brain into believing it is high noon.',
      action: 'Switch your devices to warm night-shift mode at dusk, and set your phone aside 45 minutes before turning off the lights.',
      toolId: 'sleep-log',
      toolLabel: 'Open Sleep Log'
    },
    {
      id: 'tip-pulse-recovery',
      title: 'Morning Resting Pulse as a Recovery Gauge',
      category: 'physical',
      categoryName: 'Physical & Cardio',
      categoryIcon: '💓',
      badgeColor: 'emerald',
      readTime: '1 min read',
      summary: 'Spot impending illness, dehydration, or overtraining before you feel symptoms.',
      science: 'An elevated resting heart rate (7-10 bpm above your normal baseline) indicates that your sympathetic nervous system is working overtime to fight infection, heal inflammation, or rehydrate.',
      action: 'Check your pulse first thing in the morning while still lying down. If it is high, treat yourself to extra rest and hydration.',
      toolId: 'pulse-counter',
      toolLabel: 'Tap Pulse Counter'
    },
    {
      id: 'tip-gratitude-rewire',
      title: 'Daily Micro-Gratitude Cognitive Shift',
      category: 'mental',
      categoryName: 'Mental Calm',
      categoryIcon: '✨',
      badgeColor: 'rose',
      readTime: '1 min read',
      summary: 'Rewire the brain\'s reticular activating system for lower anxiety and higher optimism.',
      science: 'Deliberate reflection on positive experiences releases dopamine and serotonin while dampening baseline hypothalamic-pituitary-adrenal (HPA) stress reactivity.',
      action: 'Write down or mentally note 3 specific small things that went well today before closing your eyes to sleep.',
      toolId: 'mood-tracker',
      toolLabel: 'Log in Mood Tracker'
    },
    {
      id: 'tip-bp-sodium',
      title: 'Blood Pressure Friendly Potassium Boost',
      category: 'physical',
      categoryName: 'Physical & Cardio',
      categoryIcon: '📊',
      badgeColor: 'emerald',
      readTime: '2 min read',
      summary: 'Naturally support smooth arterial elasticity and balanced blood pressure.',
      science: 'Potassium promotes urinary excretion of excess sodium and eases tension in blood vessel walls. A higher potassium-to-sodium dietary ratio significantly lowers cardiovascular stress.',
      action: 'Incorporate potassium-dense snacks like citrus, baked potatoes with skin, beans, or spinach into your daily meals.',
      toolId: 'blood-pressure',
      toolLabel: 'Check Blood Pressure'
    }
  ];

  // --- How Are You Feeling Recommendations Map ---
  var FEELING_RECOMMENDATIONS = {
    'low-energy': {
      title: 'Feeling Sluggish & Low on Energy',
      subtitle: 'Jumpstart your energy without reaching for excess sugar or stimulants:',
      tips: ['tip-morning-water', 'tip-post-meal-walk', 'tip-electrolytes'],
      quickAction: 'Drink a cold 400 mL glass of water and do 10 gentle bodyweight squats right now.'
    },
    'stressed': {
      title: 'Feeling Stressed or Overwhelmed',
      subtitle: 'Downshift your nervous system into a calm, grounded state:',
      tips: ['tip-physiological-sigh', 'tip-box-breathing', 'tip-54321-grounding'],
      quickAction: 'Do 3 Physiological Sighs right now: two sharp inhales through the nose, one long slow exhale.'
    },
    'desk-strain': {
      title: 'Experiencing Stiff Neck, Back or Eye Fatigue',
      subtitle: 'Release musculoskeletal tension and optical fatigue:',
      tips: ['tip-20-20-20', 'tip-desk-posture', 'tip-post-meal-walk'],
      quickAction: 'Try the 60-second guided Desk Reset below to roll your shoulders and rest your eyes.'
    },
    'cant-sleep': {
      title: 'Having Trouble Falling Asleep',
      subtitle: 'Create the biological conditions for deep, effortless rest:',
      tips: ['tip-sleep-cycles', 'tip-digital-sunset', 'tip-caffeine-cutoff'],
      quickAction: 'Turn off harsh overhead lights, put screens on night mode, and take 5 slow box breaths in bed.'
    },
    'sugar-craving': {
      title: 'Experiencing Afternoon Sugar Cravings',
      subtitle: 'Rebalance glucose and neurotransmitters sustainably:',
      tips: ['tip-post-meal-walk', 'tip-electrolytes', 'tip-morning-water'],
      quickAction: 'Drink a glass of water with a slice of lemon or a pinch of salt and wait 10 minutes.'
    },
    'brain-fog': {
      title: 'Dealing with Brain Fog or Inability to Focus',
      subtitle: 'Restore cerebral blood flow and mental clarity:',
      tips: ['tip-box-breathing', 'tip-20-20-20', 'tip-fat-burn-zone'],
      quickAction: 'Stand up, look outside a window for 20 seconds, and do 60 seconds of rhythmic breathing.'
    }
  };

  // --- 15 Simple Daily Micro-Habits ---
  var DEFAULT_HABITS = [
    // Morning Habits
    { id: 'habit-water', text: 'Drink a tall glass (400 mL) of water upon waking', icon: '💧', time: 'morning', timeLabel: 'Morning' },
    { id: 'habit-sun', text: 'Get 10+ minutes of natural morning outdoor sunlight', icon: '☀️', time: 'morning', timeLabel: 'Morning' },
    { id: 'habit-bed', text: 'Make your bed for an organized, calm morning win', icon: '🛏️', time: 'morning', timeLabel: 'Morning' },
    { id: 'habit-morning-stretch', text: 'Do 2 minutes of gentle neck and shoulder rolls', icon: '🧘', time: 'morning', timeLabel: 'Morning' },
    { id: 'habit-breakfast', text: 'Eat a protein-rich or fruit-filled nourishing breakfast', icon: '🥣', time: 'morning', timeLabel: 'Morning' },

    // Daytime / Work Habits
    { id: 'habit-eye-break', text: 'Take a 20-20-20 eye relief break from screens', icon: '👁️', time: 'daytime', timeLabel: 'Daytime' },
    { id: 'habit-posture-check', text: 'Check posture: shoulders down, spine straight, feet flat', icon: '🧍', time: 'daytime', timeLabel: 'Daytime' },
    { id: 'habit-walk', text: 'Take a 15-minute brisk walk or movement break', icon: '🚶', time: 'daytime', timeLabel: 'Daytime' },
    { id: 'habit-fruit-veg', text: 'Snack on fresh fruit, raw vegetables, or nuts', icon: '🍎', time: 'daytime', timeLabel: 'Daytime' },
    { id: 'habit-breath-reset', text: 'Practice 2 minutes of slow, deliberate box breathing', icon: '🫁', time: 'daytime', timeLabel: 'Daytime' },
    { id: 'habit-water-refill', text: 'Refill & finish another 500 mL water bottle before 3 PM', icon: '🥤', time: 'daytime', timeLabel: 'Daytime' },

    // Evening / Night Habits
    { id: 'habit-post-meal-walk', text: 'Take a gentle 10-minute stroll after lunch or dinner', icon: '🚶‍♂️', time: 'evening', timeLabel: 'Evening' },
    { id: 'habit-caffeine-curfew', text: 'No caffeine after 2:00 PM to protect deep restorative sleep', icon: '☕', time: 'evening', timeLabel: 'Evening' },
    { id: 'habit-digital-sunset', text: 'Turn off screens or switch to warm night mode 30m before bed', icon: '📵', time: 'evening', timeLabel: 'Evening' },
    { id: 'habit-gratitude', text: 'Reflect on 3 small, positive things that went well today', icon: '✨', time: 'evening', timeLabel: 'Evening' }
  ];

  // --- Local Storage Keys ---
  var STORAGE_BOOKMARKS_KEY = 'code4care_bookmarked_tips';
  var STORAGE_DONE_TIPS_KEY = 'code4care_done_tips';
  var STORAGE_HABITS_KEY = 'code4care_daily_habits';
  var STORAGE_HABITS_DATE_KEY = 'code4care_daily_habits_date';

  // --- State ---
  var currentTipIndex = 0;
  var activeCategory = 'all';
  var searchQuery = '';
  var activeFeeling = 'low-energy';
  var bookmarkedTips = [];
  var doneTipsToday = [];
  var dailyHabits = {};
  var habitFilter = 'all'; // 'all' | 'morning' | 'daytime' | 'evening' | 'pending'
  var isAudioMuted = false;

  // --- 60s Reset Timer State ---
  var resetTimerDuration = 60;
  var resetTimerRemaining = 60;
  var resetTimerInterval = null;
  var resetTimerRunning = false;

  // ========================================================================
  // Helpers & Audio Synthesis
  // ========================================================================
  function getTodayDateString() {
    var d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  }

  function playSoftChime() {
    if (isAudioMuted) return;
    try {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      var ctx = new AudioCtx();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880.00, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.25);
    } catch (e) {
      // AudioContext muted/unsupported
    }
  }

  function showToast(message) {
    var existing = document.getElementById('code4care-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.id = 'code4care-toast';
    toast.className = 'tips-toast-notification';
    toast.innerHTML = '<span>' + message + '</span>';
    document.body.appendChild(toast);

    setTimeout(function () {
      toast.classList.add('visible');
    }, 10);

    setTimeout(function () {
      toast.classList.remove('visible');
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 2400);
  }

  // ========================================================================
  // Storage Handlers
  // ========================================================================
  function loadStorage() {
    try {
      var savedBookmarks = localStorage.getItem(STORAGE_BOOKMARKS_KEY);
      bookmarkedTips = savedBookmarks ? JSON.parse(savedBookmarks) : [];

      var savedDone = localStorage.getItem(STORAGE_DONE_TIPS_KEY);
      doneTipsToday = savedDone ? JSON.parse(savedDone) : [];

      var savedHabitsDate = localStorage.getItem(STORAGE_HABITS_DATE_KEY);
      var today = getTodayDateString();

      if (savedHabitsDate === today) {
        var savedHabits = localStorage.getItem(STORAGE_HABITS_KEY);
        dailyHabits = savedHabits ? JSON.parse(savedHabits) : {};
      } else {
        dailyHabits = {};
        localStorage.setItem(STORAGE_HABITS_DATE_KEY, today);
        localStorage.setItem(STORAGE_HABITS_KEY, JSON.stringify(dailyHabits));
      }
    } catch (e) {
      bookmarkedTips = [];
      doneTipsToday = [];
      dailyHabits = {};
    }
  }

  function saveBookmarks() {
    try {
      localStorage.setItem(STORAGE_BOOKMARKS_KEY, JSON.stringify(bookmarkedTips));
    } catch (e) {}
  }

  function saveDoneTips() {
    try {
      localStorage.setItem(STORAGE_DONE_TIPS_KEY, JSON.stringify(doneTipsToday));
    } catch (e) {}
  }

  function saveHabits() {
    try {
      localStorage.setItem(STORAGE_HABITS_KEY, JSON.stringify(dailyHabits));
      localStorage.setItem(STORAGE_HABITS_DATE_KEY, getTodayDateString());
    } catch (e) {}
  }

  // ========================================================================
  // 1. Tip of the Day Rendering
  // ========================================================================
  function renderTipOfTheDay() {
    var heroContainer = document.getElementById('tip-hero-card-content');
    if (!heroContainer) return;

    var tip = HEALTH_TIPS[currentTipIndex % HEALTH_TIPS.length];
    if (!tip) return;

    var isBookmarked = bookmarkedTips.indexOf(tip.id) !== -1;
    var isDone = doneTipsToday.indexOf(tip.id) !== -1;

    heroContainer.innerHTML = 
      '<div class="tip-hero-header">' +
        '<div class="tip-category-pill pill-' + tip.badgeColor + '">' +
          '<span class="pill-icon">' + tip.categoryIcon + '</span>' +
          '<span>' + tip.categoryName + '</span>' +
          '<span class="pill-dot">&bull;</span>' +
          '<span>' + tip.readTime + '</span>' +
        '</div>' +
        '<div class="tip-hero-actions">' +
          '<button class="tip-btn-icon ' + (isBookmarked ? 'active' : '') + '" id="btn-hero-bookmark" title="' + (isBookmarked ? 'Remove Bookmark' : 'Bookmark Tip') + '" aria-label="Bookmark tip">' +
            (isBookmarked ? '★' : '☆') +
          '</button>' +
          '<button class="tip-btn-icon" id="btn-hero-copy" title="Copy Tip to Clipboard" aria-label="Copy tip">' +
            '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>' +
          '</button>' +
        '</div>' +
      '</div>' +

      '<h3 class="tip-hero-title">' + tip.title + '</h3>' +
      '<p class="tip-hero-summary">' + tip.summary + '</p>' +

      '<div class="tip-science-card">' +
        '<div class="tip-science-label">' +
          '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>' +
          '<span>The Science Behind It</span>' +
        '</div>' +
        '<p class="tip-science-text">' + tip.science + '</p>' +
      '</div>' +

      '<div class="tip-action-box">' +
        '<div class="tip-action-badge">&#9658; 1-Minute Action Step:</div>' +
        '<p class="tip-action-instruction">' + tip.action + '</p>' +
      '</div>' +

      '<div class="tip-hero-footer">' +
        '<div class="tip-footer-left">' +
          '<button class="btn ' + (isDone ? 'btn-success-active' : 'btn-secondary') + '" id="btn-hero-done">' +
            (isDone ? '✓ Completed Today' : 'Mark as Done Today') +
          '</button>' +
          (tip.toolId ? '<button class="btn btn-ghost tip-tool-btn" data-tool="' + tip.toolId + '">Launch ' + tip.toolLabel + ' &rarr;</button>' : '') +
        '</div>' +
        '<button class="btn btn-primary-outline" id="btn-hero-next" title="Shuffle next tip">' +
          '<span>Next Tip</span>' +
          '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>' +
        '</button>' +
      '</div>';

    // Also update the Bento Overview Tip preview if it exists
    updateBentoTipCard(tip);

    // Attach hero events
    var btnBookmark = document.getElementById('btn-hero-bookmark');
    if (btnBookmark) {
      btnBookmark.addEventListener('click', function () {
        toggleBookmark(tip.id);
        renderTipOfTheDay();
        renderTipsGrid();
      });
    }

    var btnCopy = document.getElementById('btn-hero-copy');
    if (btnCopy) {
      btnCopy.addEventListener('click', function () {
        copyTipText(tip);
      });
    }

    var btnDone = document.getElementById('btn-hero-done');
    if (btnDone) {
      btnDone.addEventListener('click', function () {
        toggleDoneToday(tip.id);
        renderTipOfTheDay();
        renderTipsGrid();
      });
    }

    var btnNext = document.getElementById('btn-hero-next');
    if (btnNext) {
      btnNext.addEventListener('click', function () {
        currentTipIndex = (currentTipIndex + 1) % HEALTH_TIPS.length;
        renderTipOfTheDay();
      });
    }

    // Attach tool launcher links
    var toolBtn = heroContainer.querySelector('.tip-tool-btn');
    if (toolBtn) {
      toolBtn.addEventListener('click', function () {
        var tid = toolBtn.getAttribute('data-tool');
        if (tid && typeof window.Code4CareOpenTool === 'function') {
          window.Code4CareOpenTool(tid);
        }
      });
    }
  }

  function updateBentoTipCard(tip) {
    var bentoTipTitle = document.getElementById('bento-tip-title');
    var bentoTipAction = document.getElementById('bento-tip-action');
    var bentoTipBadge = document.getElementById('bento-tip-badge');

    if (bentoTipTitle) bentoTipTitle.textContent = tip.title;
    if (bentoTipAction) bentoTipAction.textContent = tip.summary;
    if (bentoTipBadge) bentoTipBadge.textContent = tip.categoryIcon + ' ' + tip.categoryName;
  }

  function copyTipText(tip) {
    var text = '💡 ' + tip.title + '\n\n' + tip.summary + '\n\nAction Step: ' + tip.action + '\n\n— Via Code4Care Health Cockpit';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast('Tip copied to clipboard!');
      }).catch(function () {
        showToast('Tip ready to share!');
      });
    } else {
      showToast('Tip ready to share!');
    }
  }

  function toggleBookmark(tipId) {
    var index = bookmarkedTips.indexOf(tipId);
    if (index === -1) {
      bookmarkedTips.push(tipId);
      showToast('★ Tip saved to bookmarks!');
      playSoftChime();
    } else {
      bookmarkedTips.splice(index, 1);
      showToast('Tip removed from bookmarks');
    }
    saveBookmarks();
    updateTipsStats();
  }

  function toggleDoneToday(tipId) {
    var index = doneTipsToday.indexOf(tipId);
    if (index === -1) {
      doneTipsToday.push(tipId);
      showToast('✓ Great job! Marked as completed today.');
      playSoftChime();
    } else {
      doneTipsToday.splice(index, 1);
      showToast('Mark removed');
    }
    saveDoneTips();
    updateTipsStats();
  }

  // ========================================================================
  // 2. Interactive "How Are You Feeling" Advisor
  // ========================================================================
  function initFeelingAdvisor() {
    var chips = document.querySelectorAll('.feeling-chip');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var feelingKey = chip.getAttribute('data-feeling');
        if (!feelingKey) return;
        activeFeeling = feelingKey;

        chips.forEach(function (c) {
          c.classList.toggle('active', c === chip);
        });

        renderFeelingRecommendations();
      });
    });

    renderFeelingRecommendations();
  }

  function renderFeelingRecommendations() {
    var container = document.getElementById('feeling-recommendations-container');
    if (!container) return;

    var config = FEELING_RECOMMENDATIONS[activeFeeling];
    if (!config) return;

    var matchedTips = HEALTH_TIPS.filter(function (t) {
      return config.tips.indexOf(t.id) !== -1;
    });

    var tipsHtml = '';
    matchedTips.forEach(function (tip) {
      var isBookmarked = bookmarkedTips.indexOf(tip.id) !== -1;
      tipsHtml += 
        '<div class="advisor-tip-card">' +
          '<div class="advisor-tip-top">' +
            '<span class="tip-category-pill pill-' + tip.badgeColor + '">' + tip.categoryIcon + ' ' + tip.categoryName + '</span>' +
            '<button class="tip-btn-icon ' + (isBookmarked ? 'active' : '') + '" data-bookmark-tip="' + tip.id + '">' + (isBookmarked ? '★' : '☆') + '</button>' +
          '</div>' +
          '<h4 class="advisor-tip-title">' + tip.title + '</h4>' +
          '<p class="advisor-tip-action">' + tip.action + '</p>' +
          (tip.toolId ? '<button class="btn btn-ghost-sm tip-tool-btn" data-tool="' + tip.toolId + '">Open ' + tip.toolLabel + ' &rarr;</button>' : '') +
        '</div>';
    });

    container.innerHTML = 
      '<div class="advisor-results-header">' +
        '<div>' +
          '<h4 class="advisor-heading">' + config.title + '</h4>' +
          '<p class="advisor-subtext">' + config.subtitle + '</p>' +
        '</div>' +
        '<div class="advisor-quick-pill">' +
          '<strong>Fast Tip:</strong> ' + config.quickAction +
        '</div>' +
      '</div>' +
      '<div class="advisor-tips-grid">' + tipsHtml + '</div>';

    // Attach bookmark handlers
    container.querySelectorAll('[data-bookmark-tip]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tid = btn.getAttribute('data-bookmark-tip');
        toggleBookmark(tid);
        renderFeelingRecommendations();
        renderTipsGrid();
      });
    });

    // Attach tool buttons
    container.querySelectorAll('.tip-tool-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tid = btn.getAttribute('data-tool');
        if (tid && typeof window.Code4CareOpenTool === 'function') {
          window.Code4CareOpenTool(tid);
        }
      });
    });
  }

  // ========================================================================
  // 3. 60-Second Guided Desk Reset
  // ========================================================================
  function initDeskResetTimer() {
    var btnToggle = document.getElementById('btn-reset-timer-toggle');
    var btnRestart = document.getElementById('btn-reset-timer-restart');
    var progressCircle = document.getElementById('reset-timer-progress-svg');
    var textDisplay = document.getElementById('reset-timer-seconds');
    var instructionEl = document.getElementById('reset-timer-instruction');
    var stepBadgeEl = document.getElementById('reset-timer-step-badge');

    if (!btnToggle || !textDisplay) return;

    var circumference = 2 * Math.PI * 44; // r=44

    function updateTimerUI() {
      textDisplay.textContent = resetTimerRemaining + 's';
      var fraction = (resetTimerDuration - resetTimerRemaining) / resetTimerDuration;
      var offset = circumference * (1 - fraction);
      if (progressCircle) {
        progressCircle.style.strokeDashoffset = offset;
      }

      // Step Prompts based on remaining seconds
      var elapsed = resetTimerDuration - resetTimerRemaining;
      if (elapsed < 20) {
        if (stepBadgeEl) stepBadgeEl.textContent = 'Step 1 of 3: Eye Distance Relax';
        if (instructionEl) instructionEl.textContent = 'Look at an object at least 20 feet away (out a window or down the room). Blink slowly and release eye strain.';
      } else if (elapsed < 40) {
        if (stepBadgeEl) stepBadgeEl.textContent = 'Step 2 of 3: Shoulder Rolls & Neck Open';
        if (instructionEl) instructionEl.textContent = 'Roll your shoulders backwards 5 times. Gently drop your right ear toward your right shoulder, then switch.';
      } else {
        if (stepBadgeEl) stepBadgeEl.textContent = 'Step 3 of 3: Deep Diaphragmatic Breath';
        if (instructionEl) instructionEl.textContent = 'Inhale slowly through your nose for 4 seconds, then let out a slow, relaxing sigh through your mouth.';
      }
    }

    btnToggle.addEventListener('click', function () {
      if (resetTimerRunning) {
        // Pause
        clearInterval(resetTimerInterval);
        resetTimerRunning = false;
        btnToggle.innerHTML = '<span>Resume</span>';
      } else {
        // Start / Resume
        if (resetTimerRemaining <= 0) {
          resetTimerRemaining = resetTimerDuration;
        }
        resetTimerRunning = true;
        btnToggle.innerHTML = '<span>Pause</span>';
        playSoftChime();

        resetTimerInterval = setInterval(function () {
          resetTimerRemaining--;
          updateTimerUI();

          if (resetTimerRemaining <= 0) {
            clearInterval(resetTimerInterval);
            resetTimerRunning = false;
            btnToggle.innerHTML = '<span>Start Again</span>';
            if (stepBadgeEl) stepBadgeEl.textContent = 'Reset Complete!';
            if (instructionEl) instructionEl.textContent = 'Fantastic! Your eyes and posture are refreshed. Ready to continue with clear focus!';
            playSoftChime();
            showToast('🎉 60-Second Desk Reset Complete!');
          }
        }, 1000);
      }
    });

    if (btnRestart) {
      btnRestart.addEventListener('click', function () {
        clearInterval(resetTimerInterval);
        resetTimerRunning = false;
        resetTimerRemaining = resetTimerDuration;
        btnToggle.innerHTML = '<span>Start 60s Reset</span>';
        updateTimerUI();
      });
    }

    updateTimerUI();
  }

  // ========================================================================
  // ========================================================================
  // 4. Daily Micro-Habits Checklist (15 Vital Habits)
  // ========================================================================
  function initHabitsChecklist() {
    var container = document.getElementById('daily-habits-container');
    if (!container) return;

    // Filter tabs for morning / daytime / evening / to-do
    var filterTabs = document.querySelectorAll('.habit-tab[data-habit-filter]');
    filterTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var f = tab.getAttribute('data-habit-filter');
        if (!f) return;
        habitFilter = f;

        filterTabs.forEach(function (t) {
          t.classList.toggle('active', t === tab);
        });

        renderHabitsList();
      });
    });

    // Reset button
    var btnReset = document.getElementById('btn-habits-reset');
    if (btnReset) {
      btnReset.addEventListener('click', function () {
        if (confirm('Reset today\'s checked habits?')) {
          dailyHabits = {};
          saveHabits();
          renderHabitsList();
          showToast('Habits reset for today.');
        }
      });
    }

    renderHabitsList();
  }

  function renderHabitsList() {
    var container = document.getElementById('daily-habits-container');
    var progressFill = document.getElementById('habits-progress-fill');
    var progressText = document.getElementById('habits-progress-text');
    var levelBadge = document.getElementById('habits-level-badge');
    if (!container) return;

    var completedCount = 0;
    DEFAULT_HABITS.forEach(function (h) {
      if (dailyHabits[h.id]) completedCount++;
    });

    var total = DEFAULT_HABITS.length;
    var percent = Math.round((completedCount / total) * 100);

    // Update Progress UI
    if (progressFill) progressFill.style.width = percent + '%';
    if (progressText) {
      progressText.textContent = completedCount + ' of ' + total + ' habits completed (' + percent + '%)';
    }

    // Update Milestone Level Badge
    if (levelBadge) {
      if (completedCount === total) {
        levelBadge.textContent = '🥇 Gold Master (' + total + '/' + total + ')';
        levelBadge.className = 'habit-level-badge badge-gold';
      } else if (completedCount >= 10) {
        levelBadge.textContent = '🥈 Silver Vitality (' + completedCount + '/' + total + ')';
        levelBadge.className = 'habit-level-badge badge-silver';
      } else if (completedCount >= 5) {
        levelBadge.textContent = '🥉 Bronze Achiever (' + completedCount + '/' + total + ')';
        levelBadge.className = 'habit-level-badge badge-bronze';
      } else {
        levelBadge.textContent = '🌱 Daily Rhythm (' + completedCount + '/' + total + ')';
        levelBadge.className = 'habit-level-badge badge-starter';
      }
    }

    // Filter habits list
    var filtered = DEFAULT_HABITS.filter(function (habit) {
      if (habitFilter === 'morning') return habit.time === 'morning';
      if (habitFilter === 'daytime') return habit.time === 'daytime';
      if (habitFilter === 'evening') return habit.time === 'evening';
      if (habitFilter === 'pending') return !dailyHabits[habit.id];
      return true; // 'all'
    });

    if (filtered.length === 0) {
      container.innerHTML = 
        '<div class="habits-empty-filter">' +
          '<span style="font-size: 1.5rem;">🎉</span>' +
          '<p style="font-size: 0.85rem; color: var(--muted); margin-top: 4px;">No habits in this view right now!</p>' +
        '</div>';
      return;
    }

    var html = '';
    filtered.forEach(function (habit) {
      var isChecked = !!dailyHabits[habit.id];

      html += 
        '<div class="habit-item ' + (isChecked ? 'completed' : '') + '" data-habit-id="' + habit.id + '">' +
          '<label class="habit-label">' +
            '<input type="checkbox" class="habit-checkbox" ' + (isChecked ? 'checked' : '') + ' data-habit-input="' + habit.id + '">' +
            '<span class="habit-custom-checkbox"><span class="habit-check-mark">&#10003;</span></span>' +
            '<span class="habit-icon">' + habit.icon + '</span>' +
            '<div class="habit-content-wrapper">' +
              '<span class="habit-text">' + habit.text + '</span>' +
              '<span class="habit-time-badge habit-time-' + habit.time + '">' + habit.timeLabel + '</span>' +
            '</div>' +
          '</label>' +
        '</div>';
    });

    container.innerHTML = html;

    // Attach Listeners
    container.querySelectorAll('[data-habit-input]').forEach(function (input) {
      input.addEventListener('change', function () {
        var hid = input.getAttribute('data-habit-input');
        dailyHabits[hid] = input.checked;
        saveHabits();
        renderHabitsList();

        if (input.checked) {
          playSoftChime();
          showToast('✓ Habit checked off for today!');
        }

        // Check if all complete
        var allDone = DEFAULT_HABITS.every(function (h) { return !!dailyHabits[h.id]; });
        if (allDone) {
          showToast('🏆 Masterclass! All 15 daily vital habits completed today!');
        }
      });
    });
  }

  // ========================================================================
  // 5. Filterable Health Tips Library Grid
  // ========================================================================
  function renderTipsGrid() {
    var gridContainer = document.getElementById('tips-cards-grid');
    var counterEl = document.getElementById('tips-search-count');
    if (!gridContainer) return;

    var filtered = HEALTH_TIPS.filter(function (tip) {
      // Category Filter
      var matchesCategory = true;
      if (activeCategory === 'saved') {
        matchesCategory = bookmarkedTips.indexOf(tip.id) !== -1;
      } else if (activeCategory !== 'all') {
        matchesCategory = tip.category === activeCategory;
      }

      // Search Query
      var matchesSearch = true;
      var q = searchQuery.trim().toLowerCase();
      if (q) {
        var tMatch = tip.title.toLowerCase().indexOf(q) !== -1;
        var sMatch = tip.summary.toLowerCase().indexOf(q) !== -1;
        var sciMatch = tip.science.toLowerCase().indexOf(q) !== -1;
        var actMatch = tip.action.toLowerCase().indexOf(q) !== -1;
        var catMatch = tip.categoryName.toLowerCase().indexOf(q) !== -1;
        matchesSearch = tMatch || sMatch || sciMatch || actMatch || catMatch;
      }

      return matchesCategory && matchesSearch;
    });

    if (counterEl) {
      counterEl.textContent = filtered.length === 1 ? 'Showing 1 tip' : 'Showing ' + filtered.length + ' tips';
    }

    if (filtered.length === 0) {
      gridContainer.innerHTML = 
        '<div class="tips-empty-state">' +
          '<div style="font-size: 2.5rem; margin-bottom: 10px;">🔍</div>' +
          '<h4>No matching health tips found</h4>' +
          '<p style="color: var(--muted); font-size: 0.9rem; margin-top: 6px;">' +
            (activeCategory === 'saved' ? 'You haven\'t bookmarked any tips yet. Click the ★ icon on any tip card to save it!' : 'Try a different search word or select "All Tips".') +
          '</p>' +
        '</div>';
      return;
    }

    var html = '';
    filtered.forEach(function (tip) {
      var isBookmarked = bookmarkedTips.indexOf(tip.id) !== -1;
      var isDone = doneTipsToday.indexOf(tip.id) !== -1;

      html += 
        '<article class="tip-card card-' + tip.badgeColor + '" data-tip-id="' + tip.id + '">' +
          '<div class="tip-card-top">' +
            '<span class="tip-category-pill pill-' + tip.badgeColor + '">' + tip.categoryIcon + ' ' + tip.categoryName + '</span>' +
            '<div class="tip-card-header-icons">' +
              '<button class="tip-btn-icon ' + (isBookmarked ? 'active' : '') + '" data-grid-bookmark="' + tip.id + '" title="' + (isBookmarked ? 'Remove Bookmark' : 'Save Tip') + '" aria-label="Bookmark tip">' +
                (isBookmarked ? '★' : '☆') +
              '</button>' +
              '<button class="tip-btn-icon" data-grid-copy="' + tip.id + '" title="Copy Tip" aria-label="Copy tip">' +
                '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>' +
              '</button>' +
            '</div>' +
          '</div>' +

          '<h4 class="tip-card-title">' + tip.title + '</h4>' +
          '<p class="tip-card-summary">' + tip.summary + '</p>' +

          '<div class="tip-card-action-box">' +
            '<strong>Action:</strong> ' + tip.action +
          '</div>' +

          '<div class="tip-card-footer">' +
            '<button class="btn-grid-done ' + (isDone ? 'done-active' : '') + '" data-grid-done="' + tip.id + '">' +
              (isDone ? '✓ Tried Today' : '+ Try Today') +
            '</button>' +
            (tip.toolId ? '<button class="tip-grid-tool-link" data-tool="' + tip.toolId + '">Open Tool &rarr;</button>' : '') +
          '</div>' +
        '</article>';
    });

    gridContainer.innerHTML = html;

    // Attach Grid listeners
    gridContainer.querySelectorAll('[data-grid-bookmark]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var tid = btn.getAttribute('data-grid-bookmark');
        toggleBookmark(tid);
        renderTipOfTheDay();
        renderTipsGrid();
      });
    });

    gridContainer.querySelectorAll('[data-grid-copy]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var tid = btn.getAttribute('data-grid-copy');
        var tip = HEALTH_TIPS.find(function (t) { return t.id === tid; });
        if (tip) copyTipText(tip);
      });
    });

    gridContainer.querySelectorAll('[data-grid-done]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var tid = btn.getAttribute('data-grid-done');
        toggleDoneToday(tid);
        renderTipOfTheDay();
        renderTipsGrid();
      });
    });

    gridContainer.querySelectorAll('[data-tool]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var tid = btn.getAttribute('data-tool');
        if (tid && typeof window.Code4CareOpenTool === 'function') {
          window.Code4CareOpenTool(tid);
        }
      });
    });
  }

  // ========================================================================
  // 6. Category Filters & Library Search
  // ========================================================================
  function initFilters() {
    var filterBtns = document.querySelectorAll('.tips-filter-pill');
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.getAttribute('data-tip-category');
        if (!cat) return;
        activeCategory = cat;

        filterBtns.forEach(function (b) {
          b.classList.toggle('active', b === btn);
        });

        renderTipsGrid();
      });
    });

    var searchInput = document.getElementById('tips-search-input');
    var clearBtn = document.getElementById('tips-search-clear');

    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        searchQuery = e.target.value;
        if (clearBtn) clearBtn.style.display = searchQuery ? 'block' : 'none';
        renderTipsGrid();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        if (searchInput) searchInput.value = '';
        searchQuery = '';
        clearBtn.style.display = 'none';
        renderTipsGrid();
      });
    }
  }

  function updateTipsStats() {
    var statTotal = document.getElementById('stat-tips-total');
    var statSaved = document.getElementById('stat-tips-saved');
    var statDone = document.getElementById('stat-tips-done');

    if (statTotal) statTotal.textContent = HEALTH_TIPS.length;
    if (statSaved) statSaved.textContent = bookmarkedTips.length;
    if (statDone) statDone.textContent = doneTipsToday.length;
  }

  // ========================================================================
  // Public Interface & Boot
  // ========================================================================
  window.Code4CareTipsEngine = {
    init: function () {
      loadStorage();
      renderTipOfTheDay();
      initFeelingAdvisor();
      initDeskResetTimer();
      initHabitsChecklist();
      initFilters();
      renderTipsGrid();
      updateTipsStats();
    },
    nextTip: function () {
      currentTipIndex = (currentTipIndex + 1) % HEALTH_TIPS.length;
      renderTipOfTheDay();
    },
    refresh: function () {
      renderTipOfTheDay();
      renderTipsGrid();
      updateTipsStats();
    }
  };

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.Code4CareTipsEngine.init);
  } else {
    window.Code4CareTipsEngine.init();
  }

})();
