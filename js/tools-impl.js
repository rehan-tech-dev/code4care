/**
 * Code4Care - Complete Interactive Tools Implementation (js/tools-impl.js)
 * 
 * Provides interactive, simple English, beautifully animated renderers
 * for all 12 Physical Health & Mental Wellness tools in the Code4Care suite.
 * 
 * Pure Vanilla JavaScript (Zero external dependencies, 100% client-side)
 */

(function () {
  'use strict';

  // Ensure tools registry exists
  window.Code4CareToolsRegistry = window.Code4CareToolsRegistry || {};

  // Simple Web Audio Tone Generator (for meditation bell and breathing cues)
  var AudioHelper = {
    ctx: null,
    init: function () {
      if (!this.ctx) {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    },
    playChime: function (freq, type, duration) {
      try {
        this.init();
        if (!this.ctx) return;
        var osc = this.ctx.createOscillator();
        var gain = this.ctx.createGain();
        osc.type = type || 'sine';
        osc.frequency.setValueAtTime(freq || 528, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.2, this.ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + (duration || 1.5));

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + (duration || 1.5));
      } catch (e) {
        // Audio unavailable or blocked by browser policy
      }
    }
  };

  // Helper to notify dashboard of data updates
  function notifyDashboardUpdate(key, value) {
    try {
      localStorage.setItem('code4care_' + key, JSON.stringify(value));
      window.dispatchEvent(new CustomEvent('code4care_data_updated', {
        detail: { key: key, value: value }
      }));
    } catch (e) {}
  }

  // ==========================================================================
  // 1. BMI CALCULATOR
  // ==========================================================================
  window.Code4CareToolsRegistry['bmi-calculator'] = {
    render: function (container) {
      var unit = 'metric'; // 'metric' | 'us'

      container.innerHTML = 
        '<div class="tool-ui-container">' +
          '<div class="segmented-control">' +
            '<button class="segmented-btn active" id="bmi-unit-metric">Metric (cm, kg)</button>' +
            '<button class="segmented-btn" id="bmi-unit-us">US Units (ft/in, lbs)</button>' +
          '</div>' +

          '<div class="tool-section">' +
            '<div id="bmi-inputs-container">' +
              // Populated dynamically based on unit
            '</div>' +

            '<button class="tool-calc-btn" id="bmi-calc-btn">' +
              '<span>Calculate My BMI</span> &rarr;' +
            '</button>' +
          '</div>' +

          '<div id="bmi-result-mount"></div>' +
        '</div>';

      var inputsBox = container.querySelector('#bmi-inputs-container');
      var resultMount = container.querySelector('#bmi-result-mount');
      var btnMetric = container.querySelector('#bmi-unit-metric');
      var btnUs = container.querySelector('#bmi-unit-us');
      var calcBtn = container.querySelector('#bmi-calc-btn');

      function renderInputs() {
        if (unit === 'metric') {
          inputsBox.innerHTML = 
            '<div class="tool-input-row" style="margin-bottom: 12px;">' +
              '<div class="tool-input-group">' +
                '<label class="tool-label">Height (cm) <span class="tool-hint" id="bmi-height-hint">175 cm</span></label>' +
                '<input type="number" class="tool-input" id="bmi-height-cm" value="175" min="80" max="250">' +
              '</div>' +
            '</div>' +
            '<div class="tool-input-row">' +
              '<div class="tool-input-group">' +
                '<label class="tool-label">Weight (kg) <span class="tool-hint" id="bmi-weight-hint">70 kg</span></label>' +
                '<input type="number" class="tool-input" id="bmi-weight-kg" value="70" min="20" max="300">' +
              '</div>' +
            '</div>';
        } else {
          inputsBox.innerHTML = 
            '<div class="tool-input-row" style="margin-bottom: 12px;">' +
              '<div class="tool-input-group">' +
                '<label class="tool-label">Height (Feet)</label>' +
                '<input type="number" class="tool-input" id="bmi-height-ft" value="5" min="3" max="8">' +
              '</div>' +
              '<div class="tool-input-group">' +
                '<label class="tool-label">Inches</label>' +
                '<input type="number" class="tool-input" id="bmi-height-in" value="9" min="0" max="11">' +
              '</div>' +
            '</div>' +
            '<div class="tool-input-row">' +
              '<div class="tool-input-group">' +
                '<label class="tool-label">Weight (lbs)</label>' +
                '<input type="number" class="tool-input" id="bmi-weight-lbs" value="154" min="40" max="600">' +
              '</div>' +
            '</div>';
        }
      }

      function calculateBMI() {
        var heightMeters = 1.75;
        var weightKg = 70;

        if (unit === 'metric') {
          var cm = parseFloat(container.querySelector('#bmi-height-cm').value) || 175;
          weightKg = parseFloat(container.querySelector('#bmi-weight-kg').value) || 70;
          heightMeters = cm / 100;
        } else {
          var ft = parseFloat(container.querySelector('#bmi-height-ft').value) || 5;
          var inches = parseFloat(container.querySelector('#bmi-height-in').value) || 9;
          var lbs = parseFloat(container.querySelector('#bmi-weight-lbs').value) || 154;
          var totalInches = (ft * 12) + inches;
          heightMeters = totalInches * 0.0254;
          weightKg = lbs * 0.453592;
        }

        if (heightMeters <= 0 || weightKg <= 0) return;

        var bmi = weightKg / (heightMeters * heightMeters);
        var roundedBMI = bmi.toFixed(1);

        // Healthy weight range for this height
        var minHealthyKg = (18.5 * heightMeters * heightMeters).toFixed(0);
        var maxHealthyKg = (24.9 * heightMeters * heightMeters).toFixed(0);
        var minHealthyLbs = (minHealthyKg * 2.20462).toFixed(0);
        var maxHealthyLbs = (maxHealthyKg * 2.20462).toFixed(0);

        var category = '';
        var badgeClass = '';
        var explanation = '';
        var needlePct = 0; // 0 to 100% on meter

        if (bmi < 18.5) {
          category = 'Underweight';
          badgeClass = 'badge-blue';
          explanation = 'You are a bit under the typical weight range. Focus on nutrient-rich meals with healthy fats, protein, and strength workouts.';
          needlePct = Math.max(5, (bmi / 18.5) * 25);
        } else if (bmi <= 24.9) {
          category = 'Healthy Weight';
          badgeClass = 'badge-green';
          explanation = 'Great job! Your weight is in a healthy balance for your height. Keep up your balanced nutrition and daily movement.';
          needlePct = 25 + ((bmi - 18.5) / 6.4) * 35;
        } else if (bmi <= 29.9) {
          category = 'Slightly Overweight';
          badgeClass = 'badge-orange';
          explanation = 'You are slightly above the standard range. Small habits like drinking more water, brisk walks, and home-cooked meals can help.';
          needlePct = 60 + ((bmi - 25) / 4.9) * 25;
        } else {
          category = 'High Weight Range';
          badgeClass = 'badge-coral';
          explanation = 'Your weight is higher than recommended. Making simple shifts in daily movement and talking with a healthcare guide can make a big difference.';
          needlePct = Math.min(95, 85 + ((bmi - 30) / 10) * 10);
        }

        var healthyWeightText = unit === 'metric'
          ? minHealthyKg + ' - ' + maxHealthyKg + ' kg'
          : minHealthyLbs + ' - ' + maxHealthyLbs + ' lbs';

        resultMount.innerHTML = 
          '<div class="tool-result-box">' +
            '<div class="tool-result-header">' +
              '<div>' +
                '<span class="tool-hint">YOUR BMI SCORE</span>' +
                '<div class="tool-result-number">' + roundedBMI + '</div>' +
              '</div>' +
              '<span class="tool-result-badge ' + badgeClass + '">' + category + '</span>' +
            '</div>' +

            '<div class="bmi-meter-track">' +
              '<div class="bmi-meter-needle" id="bmi-needle" style="left: 0%;"></div>' +
            '</div>' +
            '<div class="bmi-meter-labels">' +
              '<span>Under</span>' +
              '<span>Healthy (18.5-25)</span>' +
              '<span>Over</span>' +
              '<span>High (30+)</span>' +
            '</div>' +

            '<p class="tool-result-desc">' + explanation + '</p>' +

            '<div style="background: rgba(255,255,255,0.04); padding: 10px 14px; border-radius: 8px; font-size: 0.85rem; display: flex; justify-content: space-between;">' +
              '<span style="color: var(--muted);">Healthy range for your height:</span>' +
              '<strong>' + healthyWeightText + '</strong>' +
            '</div>' +
          '</div>';

        setTimeout(function () {
          var needle = container.querySelector('#bmi-needle');
          if (needle) needle.style.left = needlePct + '%';
        }, 50);
      }

      btnMetric.addEventListener('click', function () {
        unit = 'metric';
        btnMetric.classList.add('active');
        btnUs.classList.remove('active');
        renderInputs();
      });

      btnUs.addEventListener('click', function () {
        unit = 'us';
        btnUs.classList.add('active');
        btnMetric.classList.remove('active');
        renderInputs();
      });

      calcBtn.addEventListener('click', calculateBMI);

      // Initial render & calculate
      renderInputs();
      calculateBMI();
    }
  };

  // ==========================================================================
  // 2. CALORIE & BMR CALCULATOR
  // ==========================================================================
  window.Code4CareToolsRegistry['calorie-bmr'] = {
    render: function (container) {
      container.innerHTML = 
        '<div class="tool-ui-container">' +
          '<div class="tool-section">' +
            '<div class="tool-input-row">' +
              '<div class="tool-input-group">' +
                '<label class="tool-label">Gender</label>' +
                '<div class="segmented-control">' +
                  '<button class="segmented-btn active" id="bmr-gender-m">Male</button>' +
                  '<button class="segmented-btn" id="bmr-gender-f">Female</button>' +
                '</div>' +
              '</div>' +
              '<div class="tool-input-group">' +
                '<label class="tool-label">Age</label>' +
                '<input type="number" class="tool-input" id="bmr-age" value="28" min="15" max="100">' +
              '</div>' +
            '</div>' +

            '<div class="tool-input-row">' +
              '<div class="tool-input-group">' +
                '<label class="tool-label">Height (cm)</label>' +
                '<input type="number" class="tool-input" id="bmr-height" value="175" min="100" max="230">' +
              '</div>' +
              '<div class="tool-input-group">' +
                '<label class="tool-label">Weight (kg)</label>' +
                '<input type="number" class="tool-input" id="bmr-weight" value="70" min="30" max="250">' +
              '</div>' +
            '</div>' +

            '<div class="tool-input-group">' +
              '<label class="tool-label">Daily Activity</label>' +
              '<select class="tool-input" id="bmr-activity">' +
                '<option value="1.2">Mostly sitting (desk job / light walking)</option>' +
                '<option value="1.375" selected>Light exercise (1-3 days per week)</option>' +
                '<option value="1.55">Moderate exercise (3-5 days per week)</option>' +
                '<option value="1.725">Very active (sports / physical job)</option>' +
              '</select>' +
            '</div>' +

            '<div class="tool-input-group">' +
              '<label class="tool-label">Your Goal</label>' +
              '<div class="segmented-control">' +
                '<button class="segmented-btn active" id="goal-maintain">Maintain</button>' +
                '<button class="segmented-btn" id="goal-lose">Gentle Loss</button>' +
                '<button class="segmented-btn" id="goal-gain">Build Muscle</button>' +
              '</div>' +
            '</div>' +

            '<button class="tool-calc-btn" id="bmr-calc-btn">' +
              '<span>Calculate Daily Calories</span> &rarr;' +
            '</button>' +
          '</div>' +

          '<div id="bmr-result-mount"></div>' +
        '</div>';

      var gender = 'male';
      var goal = 'maintain';

      var btnM = container.querySelector('#bmr-gender-m');
      var btnF = container.querySelector('#bmr-gender-f');
      var btnMaintain = container.querySelector('#goal-maintain');
      var btnLose = container.querySelector('#goal-lose');
      var btnGain = container.querySelector('#goal-gain');
      var calcBtn = container.querySelector('#bmr-calc-btn');
      var resultMount = container.querySelector('#bmr-result-mount');

      btnM.addEventListener('click', function () {
        gender = 'male';
        btnM.classList.add('active');
        btnF.classList.remove('active');
      });
      btnF.addEventListener('click', function () {
        gender = 'female';
        btnF.classList.add('active');
        btnM.classList.remove('active');
      });

      btnMaintain.addEventListener('click', function () {
        goal = 'maintain';
        btnMaintain.classList.add('active');
        btnLose.classList.remove('active');
        btnGain.classList.remove('active');
      });
      btnLose.addEventListener('click', function () {
        goal = 'lose';
        btnLose.classList.add('active');
        btnMaintain.classList.remove('active');
        btnGain.classList.remove('active');
      });
      btnGain.addEventListener('click', function () {
        goal = 'gain';
        btnGain.classList.add('active');
        btnMaintain.classList.remove('active');
        btnLose.classList.remove('active');
      });

      function calculate() {
        var age = parseFloat(container.querySelector('#bmr-age').value) || 28;
        var h = parseFloat(container.querySelector('#bmr-height').value) || 175;
        var w = parseFloat(container.querySelector('#bmr-weight').value) || 70;
        var activity = parseFloat(container.querySelector('#bmr-activity').value) || 1.375;

        // Mifflin-St Jeor formula
        var bmr = (10 * w) + (6.25 * h) - (5 * age);
        bmr += (gender === 'male' ? 5 : -161);

        var tdee = bmr * activity;
        var targetCalories = tdee;

        if (goal === 'lose') {
          targetCalories = tdee - 400;
        } else if (goal === 'gain') {
          targetCalories = tdee + 350;
        }

        var bmrVal = Math.round(bmr);
        var targetVal = Math.round(targetCalories);

        // Daily macros suggestion (25% Protein, 50% Carbs, 25% Fats)
        var proteinGrams = Math.round((targetVal * 0.25) / 4);
        var carbsGrams = Math.round((targetVal * 0.50) / 4);
        var fatsGrams = Math.round((targetVal * 0.25) / 9);

        resultMount.innerHTML = 
          '<div class="tool-result-box">' +
            '<div class="tool-result-header">' +
              '<div>' +
                '<span class="tool-hint">DAILY CALORIE TARGET</span>' +
                '<div class="tool-result-number">' + targetVal.toLocaleString() + ' <span class="tool-result-unit">kcal / day</span></div>' +
              '</div>' +
              '<span class="tool-result-badge badge-green">Target Energy</span>' +
            '</div>' +

            '<div style="background: rgba(255,255,255,0.04); padding: 12px; border-radius: 8px; margin-top: 6px;">' +
              '<div style="display: flex; justify-content: space-between; margin-bottom: 4px;">' +
                '<span style="font-size: 0.88rem; color: var(--muted);">Resting Burn (BMR):</span>' +
                '<strong>' + bmrVal.toLocaleString() + ' kcal</strong>' +
              '</div>' +
              '<p style="font-size: 0.78rem; color: var(--muted); margin: 0;">This is what your body burns just keeping your heart, lungs, and brain running.</p>' +
            '</div>' +

            '<div style="margin-top: 8px;">' +
              '<span class="tool-hint" style="margin-bottom: 8px; display: block;">BALANCED DAILY MEAL GUIDE</span>' +
              '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; text-align: center;">' +
                '<div style="background: rgba(0, 167, 225, 0.1); border: 1px solid rgba(0, 167, 225, 0.25); border-radius: 8px; padding: 10px;">' +
                  '<div style="font-size: 1.1rem; font-weight: 700; color: var(--cerulean);">' + proteinGrams + 'g</div>' +
                  '<span style="font-size: 0.72rem; color: var(--muted);">Protein</span>' +
                '</div>' +
                '<div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 8px; padding: 10px;">' +
                  '<div style="font-size: 1.1rem; font-weight: 700; color: #10B981;">' + carbsGrams + 'g</div>' +
                  '<span style="font-size: 0.72rem; color: var(--muted);">Good Carbs</span>' +
                '</div>' +
                '<div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: 8px; padding: 10px;">' +
                  '<div style="font-size: 1.1rem; font-weight: 700; color: #F59E0B;">' + fatsGrams + 'g</div>' +
                  '<span style="font-size: 0.72rem; color: var(--muted);">Healthy Fats</span>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>';
      }

      calcBtn.addEventListener('click', calculate);
      calculate();
    }
  };

  // ==========================================================================
  // 3. BLOOD PRESSURE CHECKER
  // ==========================================================================
  window.Code4CareToolsRegistry['blood-pressure'] = {
    render: function (container) {
      container.innerHTML = 
        '<div class="tool-ui-container">' +
          '<div class="tool-section">' +
            '<p class="tool-hint" style="margin: 0 0 6px;">Enter the two numbers from your blood pressure monitor cuff:</p>' +
            '<div class="tool-input-row">' +
              '<div class="tool-input-group">' +
                '<label class="tool-label">Systolic (Top Number)' +
                  '<span class="tool-hint">mmHg</span>' +
                '</label>' +
                '<input type="number" class="tool-input" id="bp-systolic" value="118" min="70" max="250">' +
              '</div>' +
              '<div class="tool-input-group">' +
                '<label class="tool-label">Diastolic (Bottom Number)' +
                  '<span class="tool-hint">mmHg</span>' +
                '</label>' +
                '<input type="number" class="tool-input" id="bp-diastolic" value="78" min="40" max="150">' +
              '</div>' +
            '</div>' +

            '<div>' +
              '<span class="tool-hint" style="margin-bottom: 6px; display: block;">Quick Presets:</span>' +
              '<div style="display: flex; gap: 6px; flex-wrap: wrap;">' +
                '<button class="tool-secondary-btn" id="preset-normal" style="padding: 4px 10px; font-size: 0.78rem;">118/78 (Normal)</button>' +
                '<button class="tool-secondary-btn" id="preset-elevated" style="padding: 4px 10px; font-size: 0.78rem;">126/82 (Elevated)</button>' +
                '<button class="tool-secondary-btn" id="preset-high" style="padding: 4px 10px; font-size: 0.78rem;">142/92 (High)</button>' +
              '</div>' +
            '</div>' +

            '<button class="tool-calc-btn" id="bp-check-btn">' +
              '<span>Check My Blood Pressure</span> &rarr;' +
            '</button>' +
          '</div>' +

          '<div id="bp-result-mount"></div>' +
        '</div>';

      var sysInput = container.querySelector('#bp-systolic');
      var diaInput = container.querySelector('#bp-diastolic');
      var checkBtn = container.querySelector('#bp-check-btn');
      var resultMount = container.querySelector('#bp-result-mount');

      container.querySelector('#preset-normal').addEventListener('click', function () {
        sysInput.value = 118;
        diaInput.value = 78;
        evaluateBP();
      });
      container.querySelector('#preset-elevated').addEventListener('click', function () {
        sysInput.value = 126;
        diaInput.value = 82;
        evaluateBP();
      });
      container.querySelector('#preset-high').addEventListener('click', function () {
        sysInput.value = 142;
        diaInput.value = 92;
        evaluateBP();
      });

      function evaluateBP() {
        var sys = parseInt(sysInput.value, 10) || 120;
        var dia = parseInt(diaInput.value, 10) || 80;

        var category = '';
        var badgeClass = '';
        var message = '';
        var pulsePressure = sys - dia;

        if (sys < 120 && dia < 80) {
          category = 'Normal & Healthy';
          badgeClass = 'badge-green';
          message = 'Excellent reading! Your heart and blood vessels are resting at a very healthy level. Keep staying hydrated and active.';
        } else if (sys <= 129 && dia < 80) {
          category = 'Slightly Elevated';
          badgeClass = 'badge-yellow';
          message = 'Your top number is just a bit elevated. Drinking extra water, cutting back on salty foods, and taking a daily 20-minute walk will help.';
        } else if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) {
          category = 'High Stage 1';
          badgeClass = 'badge-orange';
          message = 'Your reading is mildly high. Take slow, relaxed breaths, rest quietly for 5 minutes, and take another reading. If it stays here, discuss with a doctor.';
        } else {
          category = 'High Stage 2';
          badgeClass = 'badge-coral';
          message = 'This reading is high. Sit down in a quiet room, avoid caffeine, and re-test in 10 minutes. If you feel dizzy or have chest pain, seek medical guidance promptly.';
        }

        resultMount.innerHTML = 
          '<div class="tool-result-box">' +
            '<div class="tool-result-header">' +
              '<div>' +
                '<span class="tool-hint">READING</span>' +
                '<div class="tool-result-number">' + sys + '<span style="font-size: 1.4rem; color: var(--muted);">/' + dia + '</span>' +
                  '<span class="tool-result-unit">mmHg</span>' +
                '</div>' +
              '</div>' +
              '<span class="tool-result-badge ' + badgeClass + '">' + category + '</span>' +
            '</div>' +

            '<p class="tool-result-desc">' + message + '</p>' +

            '<div style="background: rgba(255,255,255,0.04); padding: 10px 14px; border-radius: 8px; font-size: 0.85rem; display: flex; justify-content: space-between;">' +
              '<span style="color: var(--muted);">Pulse Pressure (difference):</span>' +
              '<strong>' + pulsePressure + ' mmHg ' + (pulsePressure >= 30 && pulsePressure <= 50 ? '(Healthy)' : '') + '</strong>' +
            '</div>' +
          '</div>';
      }

      checkBtn.addEventListener('click', evaluateBP);
      evaluateBP();
    }
  };

  // ==========================================================================
  // 4. HEART-RATE ZONES
  // ==========================================================================
  window.Code4CareToolsRegistry['heart-rate-zones'] = {
    render: function (container) {
      container.innerHTML = 
        '<div class="tool-ui-container">' +
          '<div class="tool-section">' +
            '<div class="tool-input-row">' +
              '<div class="tool-input-group">' +
                '<label class="tool-label">Your Age</label>' +
                '<input type="number" class="tool-input" id="hr-age" value="28" min="12" max="99">' +
              '</div>' +
              '<div class="tool-input-group">' +
                '<label class="tool-label">Resting Pulse (BPM)' +
                  '<span class="tool-hint">optional</span>' +
                '</label>' +
                '<input type="number" class="tool-input" id="hr-resting" value="68" min="40" max="110">' +
              '</div>' +
            '</div>' +

            '<button class="tool-calc-btn" id="hr-calc-btn">' +
              '<span>Calculate My Workout Zones</span> &rarr;' +
            '</button>' +
          '</div>' +

          '<div id="hr-result-mount"></div>' +
        '</div>';

      var ageInput = container.querySelector('#hr-age');
      var restInput = container.querySelector('#hr-resting');
      var calcBtn = container.querySelector('#hr-calc-btn');
      var resultMount = container.querySelector('#hr-result-mount');

      function calculateZones() {
        var age = parseInt(ageInput.value, 10) || 28;
        var maxHR = 220 - age;

        var zones = [
          { name: 'Zone 1: Warm Up & Recovery', pct: '50% - 60%', min: Math.round(maxHR * 0.50), max: Math.round(maxHR * 0.60), color: '#3B82F6', desc: 'Easy breathing. Perfect for warm-ups, cool-downs, and recovery walks.' },
          { name: 'Zone 2: Fat Burning & Endurance', pct: '60% - 70%', min: Math.round(maxHR * 0.60), max: Math.round(maxHR * 0.70), color: '#10B981', desc: 'Most comfortable conversational pace. Best for burning stored fat and stamina.' },
          { name: 'Zone 3: Aerobic Cardio', pct: '70% - 80%', min: Math.round(maxHR * 0.70), max: Math.round(maxHR * 0.80), color: '#F59E0B', desc: 'Moderate sweat. Strengthens your heart muscle and lung capacity.' },
          { name: 'Zone 4: Anaerobic Power', pct: '80% - 90%', min: Math.round(maxHR * 0.80), max: Math.round(maxHR * 0.90), color: '#F97316', desc: 'Hard effort. Builds speed and endurance for athletic performance.' },
          { name: 'Zone 5: Maximum Effort', pct: '90% - 100%', min: Math.round(maxHR * 0.90), max: maxHR, color: '#EF4444', desc: 'Peak sprinting intensity. Keep to short 15-30 second intervals only.' }
        ];

        var zonesHtml = '';
        zones.forEach(function (z) {
          zonesHtml += 
            '<div class="zone-row" style="border-left-color: ' + z.color + ';">' +
              '<div class="zone-info">' +
                '<h5 style="color: ' + z.color + ';">' + z.name + ' <span style="font-size: 0.75rem; color: var(--muted); font-weight: normal;">(' + z.pct + ')</span></h5>' +
                '<p>' + z.desc + '</p>' +
              '</div>' +
              '<div class="zone-bpm">' + z.min + ' - ' + z.max + ' <small style="font-size: 0.72rem; color: var(--muted);">BPM</small></div>' +
            '</div>';
        });

        resultMount.innerHTML = 
          '<div class="tool-result-box">' +
            '<div class="tool-result-header">' +
              '<div>' +
                '<span class="tool-hint">ESTIMATED MAXIMUM HEART RATE</span>' +
                '<div class="tool-result-number">' + maxHR + ' <span class="tool-result-unit">BPM</span></div>' +
              '</div>' +
              '<span class="tool-result-badge badge-green">5 Cardio Zones</span>' +
            '</div>' +

            '<div class="zones-stack" style="margin-top: 10px;">' +
              zonesHtml +
            '</div>' +
          '</div>';
      }

      calcBtn.addEventListener('click', calculateZones);
      calculateZones();
    }
  };

  // ==========================================================================
  // 5. WATER INTAKE TRACKER & CALCULATOR
  // ==========================================================================
  window.Code4CareToolsRegistry['water-intake'] = {
    render: function (container) {
      var savedDrank = 1800;
      try {
        var localWater = localStorage.getItem('code4care_water_drank');
        if (localWater) savedDrank = parseInt(localWater, 10);
      } catch (e) {}

      container.innerHTML = 
        '<div class="tool-ui-container">' +
          '<div class="tool-section">' +
            '<div class="tool-input-row">' +
              '<div class="tool-input-group">' +
                '<label class="tool-label">Your Weight (kg)</label>' +
                '<input type="number" class="tool-input" id="water-weight" value="70" min="30" max="200">' +
              '</div>' +
              '<div class="tool-input-group">' +
                '<label class="tool-label">Active Workout Today?</label>' +
                '<div class="segmented-control">' +
                  '<button class="segmented-btn" id="water-workout-no">No</button>' +
                  '<button class="segmented-btn active" id="water-workout-yes">Yes (+500ml)</button>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +

          '<div class="tool-result-box">' +
            '<div class="water-glass-wrapper">' +
              '<div class="water-glass">' +
                '<div class="water-level" id="water-visual-level"></div>' +
                '<div class="water-bubbles"></div>' +
              '</div>' +

              '<div style="flex: 1;">' +
                '<span class="tool-hint">TODAY\'S HYDRATION</span>' +
                '<div style="font-size: 1.8rem; font-weight: 800; color: #FFFFFF;" id="water-counter-text">' +
                  (savedDrank / 1000).toFixed(1) + ' <span style="font-size: 1rem; color: var(--muted); font-weight: normal;">/ 2.5 L</span>' +
                '</div>' +
                '<div id="water-pct-badge" class="tool-result-badge badge-green" style="margin-top: 6px;">72% Completed</div>' +
              '</div>' +
            '</div>' +

            '<div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px;">' +
              '<button class="tool-calc-btn" id="btn-add-glass" style="flex: 1; padding: 10px;">' +
                '<span>+1 Glass (250 mL)</span>' +
              '</button>' +
              '<button class="tool-secondary-btn" id="btn-add-bottle" style="flex: 1; padding: 10px;">' +
                '<span>+1 Bottle (500 mL)</span>' +
              '</button>' +
              '<button class="tool-secondary-btn" id="btn-reset-water" style="padding: 10px; color: var(--rose);">' +
                '<span>Reset</span>' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>';

      var weightInput = container.querySelector('#water-weight');
      var btnNo = container.querySelector('#water-workout-no');
      var btnYes = container.querySelector('#water-workout-yes');
      var addGlassBtn = container.querySelector('#btn-add-glass');
      var addBottleBtn = container.querySelector('#btn-add-bottle');
      var resetBtn = container.querySelector('#btn-reset-water');

      var visualLevel = container.querySelector('#water-visual-level');
      var counterText = container.querySelector('#water-counter-text');
      var pctBadge = container.querySelector('#water-pct-badge');

      var workout = true;
      var drankMl = savedDrank;

      btnNo.addEventListener('click', function () {
        workout = false;
        btnNo.classList.add('active');
        btnYes.classList.remove('active');
        updateGoal();
      });
      btnYes.addEventListener('click', function () {
        workout = true;
        btnYes.classList.add('active');
        btnNo.classList.remove('active');
        updateGoal();
      });

      function getGoal() {
        var w = parseFloat(weightInput.value) || 70;
        var base = w * 35; // 35 ml per kg
        if (workout) base += 500;
        return Math.round(base / 100) * 100; // Round to nearest 100ml
      }

      function updateGoal() {
        var goal = getGoal();
        var pct = Math.min(100, Math.round((drankMl / goal) * 100));

        if (counterText) {
          counterText.innerHTML = (drankMl / 1000).toFixed(2) + ' <span style="font-size: 1rem; color: var(--muted); font-weight: normal;">/ ' + (goal / 1000).toFixed(1) + ' L</span>';
        }
        if (visualLevel) {
          visualLevel.style.height = pct + '%';
        }
        if (pctBadge) {
          pctBadge.textContent = pct + '% Completed';
          if (pct >= 100) {
            pctBadge.className = 'tool-result-badge badge-green';
            pctBadge.textContent = '🎉 Goal Reached!';
          } else {
            pctBadge.className = 'tool-result-badge badge-blue';
          }
        }

        // Save and sync with dashboard overview widget
        try {
          localStorage.setItem('code4care_water_drank', drankMl);
        } catch (e) {}
        notifyDashboardUpdate('water', { drankLiters: +(drankMl / 1000).toFixed(2), goalLiters: +(goal / 1000).toFixed(1) });
      }

      addGlassBtn.addEventListener('click', function () {
        drankMl += 250;
        AudioHelper.playChime(600, 'sine', 0.2);
        updateGoal();
      });

      addBottleBtn.addEventListener('click', function () {
        drankMl += 500;
        AudioHelper.playChime(650, 'sine', 0.25);
        updateGoal();
      });

      resetBtn.addEventListener('click', function () {
        if (confirm('Reset today\'s water log to 0 mL?')) {
          drankMl = 0;
          updateGoal();
        }
      });

      weightInput.addEventListener('input', updateGoal);
      updateGoal();
    }
  };

  // ==========================================================================
  // 6. IDEAL WEIGHT CALCULATOR
  // ==========================================================================
  window.Code4CareToolsRegistry['ideal-weight'] = {
    render: function (container) {
      container.innerHTML = 
        '<div class="tool-ui-container">' +
          '<div class="tool-section">' +
            '<div class="tool-input-row">' +
              '<div class="tool-input-group">' +
                '<label class="tool-label">Gender</label>' +
                '<div class="segmented-control">' +
                  '<button class="segmented-btn active" id="iw-gender-m">Male</button>' +
                  '<button class="segmented-btn" id="iw-gender-f">Female</button>' +
                '</div>' +
              '</div>' +
              '<div class="tool-input-group">' +
                '<label class="tool-label">Body Frame</label>' +
                '<select class="tool-input" id="iw-frame">' +
                  '<option value="small">Small Frame</option>' +
                  '<option value="medium" selected>Medium Frame</option>' +
                  '<option value="large">Large / Broad Frame</option>' +
                '</select>' +
              '</div>' +
            '</div>' +

            '<div class="tool-input-group">' +
              '<label class="tool-label">Your Height (cm)</label>' +
              '<input type="number" class="tool-input" id="iw-height" value="175" min="120" max="230">' +
            '</div>' +

            '<button class="tool-calc-btn" id="iw-calc-btn">' +
              '<span>Find Healthy Weight Range</span> &rarr;' +
            '</button>' +
          '</div>' +

          '<div id="iw-result-mount"></div>' +
        '</div>';

      var gender = 'male';
      var btnM = container.querySelector('#iw-gender-m');
      var btnF = container.querySelector('#iw-gender-f');
      var heightInput = container.querySelector('#iw-height');
      var frameSelect = container.querySelector('#iw-frame');
      var calcBtn = container.querySelector('#iw-calc-btn');
      var resultMount = container.querySelector('#iw-result-mount');

      btnM.addEventListener('click', function () {
        gender = 'male';
        btnM.classList.add('active');
        btnF.classList.remove('active');
      });
      btnF.addEventListener('click', function () {
        gender = 'female';
        btnF.classList.add('active');
        btnM.classList.remove('active');
      });

      function calculateIdealWeight() {
        var h = parseFloat(heightInput.value) || 175;
        var inchesOver5ft = Math.max(0, (h / 2.54) - 60);

        // Devine Formula
        var baseWeightKg = gender === 'male' ? 50 : 45.5;
        var idealKg = baseWeightKg + (2.3 * inchesOver5ft);

        var frame = frameSelect.value;
        var modifier = 1.0;
        if (frame === 'small') modifier = 0.95;
        if (frame === 'large') modifier = 1.05;

        idealKg = idealKg * modifier;

        var minKg = Math.round(idealKg - 4);
        var maxKg = Math.round(idealKg + 4);

        var minLbs = Math.round(minKg * 2.20462);
        var maxLbs = Math.round(maxKg * 2.20462);

        resultMount.innerHTML = 
          '<div class="tool-result-box">' +
            '<div class="tool-result-header">' +
              '<div>' +
                '<span class="tool-hint">TARGET HEALTHY RANGE</span>' +
                '<div class="tool-result-number">' + minKg + ' - ' + maxKg + ' <span class="tool-result-unit">kg</span></div>' +
              '</div>' +
              '<span class="tool-result-badge badge-green">' + minLbs + ' - ' + maxLbs + ' lbs</span>' +
            '</div>' +

            '<p class="tool-result-desc">' +
              'Remember that body weight naturally fluctuates by 1-2 kg each day depending on hydration, salt, and sleep. ' +
              'Focusing on energy, strength, and feeling good is always better than any single number!' +
            '</p>' +
          '</div>';
      }

      calcBtn.addEventListener('click', calculateIdealWeight);
      calculateIdealWeight();
    }
  };

  // ==========================================================================
  // 7. PULSE COUNTER (INTERACTIVE TAP ENGINE)
  // ==========================================================================
  window.Code4CareToolsRegistry['pulse-counter'] = {
    render: function (container) {
      container.innerHTML = 
        '<div class="tool-ui-container">' +
          '<div class="tool-section" style="text-align: center;">' +
            '<p class="tool-hint" style="margin: 0;">' +
              'Put two fingers lightly on your wrist or neck. When you feel a heartbeat, tap the pulsing heart below in rhythm!' +
            '</p>' +

            '<div class="pulse-tap-container">' +
              '<button class="pulse-heart-btn" id="pulse-tap-btn" aria-label="Tap along with your pulse">' +
                '<div class="pulse-ripple" id="pulse-ripple"></div>' +
                '<svg viewBox="0 0 24 24" width="46" height="46" fill="currentColor">' +
                  '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>' +
                '</svg>' +
                '<span style="font-size: 0.8rem; font-weight: 700; margin-top: 4px;">TAP HERE</span>' +
              '</button>' +

              '<div style="text-align: center;">' +
                '<div style="font-size: 2.4rem; font-weight: 800; color: #FFFFFF;" id="pulse-bpm-display">-- <small style="font-size: 1rem; color: var(--muted); font-weight: normal;">BPM</small></div>' +
                '<div id="pulse-status-badge" class="tool-result-badge badge-blue" style="margin-top: 4px;">Tap 4 times to begin</div>' +
              '</div>' +

              '<button class="tool-secondary-btn" id="pulse-reset-btn" style="font-size: 0.8rem; padding: 6px 14px;">' +
                '<span>Reset Counter</span>' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>';

      var tapBtn = container.querySelector('#pulse-tap-btn');
      var ripple = container.querySelector('#pulse-ripple');
      var bpmDisplay = container.querySelector('#pulse-bpm-display');
      var statusBadge = container.querySelector('#pulse-status-badge');
      var resetBtn = container.querySelector('#pulse-reset-btn');

      var tapTimes = [];

      function handleTap() {
        var now = performance.now();
        tapTimes.push(now);

        // Keep last 10 taps max
        if (tapTimes.length > 10) {
          tapTimes.shift();
        }

        // Ripple animation
        ripple.classList.remove('active');
        void ripple.offsetWidth;
        ripple.classList.add('active');

        // Play gentle soft thump
        AudioHelper.playChime(150, 'triangle', 0.08);

        // Calculate intervals
        if (tapTimes.length >= 2) {
          var intervals = [];
          for (var i = 1; i < tapTimes.length; i++) {
            intervals.push(tapTimes[i] - tapTimes[i - 1]);
          }

          var avgInterval = intervals.reduce(function (a, b) { return a + b; }, 0) / intervals.length;
          var bpm = Math.round(60000 / avgInterval);

          if (bpm >= 40 && bpm <= 220) {
            bpmDisplay.innerHTML = bpm + ' <small style="font-size: 1rem; color: var(--muted); font-weight: normal;">BPM</small>';

            if (bpm < 60) {
              statusBadge.className = 'tool-result-badge badge-blue';
              statusBadge.textContent = 'Athletic / Resting Slow (' + tapTimes.length + ' taps)';
            } else if (bpm <= 100) {
              statusBadge.className = 'tool-result-badge badge-green';
              statusBadge.textContent = 'Normal Resting Heart Rate (' + tapTimes.length + ' taps)';
            } else {
              statusBadge.className = 'tool-result-badge badge-orange';
              statusBadge.textContent = 'Elevated / Active Pulse (' + tapTimes.length + ' taps)';
            }
          }
        } else {
          statusBadge.textContent = 'Keep tapping to measure...';
        }
      }

      tapBtn.addEventListener('click', handleTap);
      resetBtn.addEventListener('click', function () {
        tapTimes = [];
        bpmDisplay.innerHTML = '-- <small style="font-size: 1rem; color: var(--muted); font-weight: normal;">BPM</small>';
        statusBadge.className = 'tool-result-badge badge-blue';
        statusBadge.textContent = 'Tap 4 times to begin';
      });
    }
  };

  // ==========================================================================
  // 8. BREATHING PACER (ANIMATED GUIDED BREATHING)
  // ==========================================================================
  window.Code4CareToolsRegistry['breathing-pacer'] = {
    render: function (container) {
      container.innerHTML = 
        '<div class="tool-ui-container">' +
          '<div class="segmented-control">' +
            '<button class="segmented-btn active" id="breath-mode-box">Box Breath (4-4-4-4)</button>' +
            '<button class="segmented-btn" id="breath-mode-sleep">Sleep (4-7-8)</button>' +
            '<button class="segmented-btn" id="breath-mode-calm">Gentle Calm (4-6)</button>' +
          '</div>' +

          '<div class="tool-section" style="padding: 24px 14px;">' +
            '<div class="breather-container">' +
              '<div class="breather-visual-wrapper">' +
                '<div class="breather-halo" id="breather-halo"></div>' +
                '<div class="breather-circle" id="breather-circle">' +
                  '<div class="breather-timer-text" id="breather-timer">4</div>' +
                '</div>' +
              '</div>' +

              '<div class="breather-prompt-text" id="breather-prompt">Ready to relax</div>' +

              '<div style="display: flex; gap: 10px; width: 100%; max-width: 280px;">' +
                '<button class="tool-calc-btn" id="breather-start-btn" style="flex: 1;">' +
                  '<span>Start Session</span>' +
                '</button>' +
                '<button class="tool-secondary-btn" id="breather-reset-btn">' +
                  '<span>Reset</span>' +
                '</button>' +
              '</div>' +

              '<div style="font-size: 0.8rem; color: var(--muted);" id="breather-cycle-count">' +
                '0 breaths completed' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';

      var circle = container.querySelector('#breather-circle');
      var timerText = container.querySelector('#breather-timer');
      var promptText = container.querySelector('#breather-prompt');
      var startBtn = container.querySelector('#breather-start-btn');
      var resetBtn = container.querySelector('#breather-reset-btn');
      var countText = container.querySelector('#breather-cycle-count');

      var modeBox = container.querySelector('#breath-mode-box');
      var modeSleep = container.querySelector('#breath-mode-sleep');
      var modeCalm = container.querySelector('#breath-mode-calm');

      var currentMode = 'box'; // 'box' | 'sleep' | 'calm'
      var timerInterval = null;
      var isRunning = false;
      var completedCycles = 0;

      // Pattern timings: array of { phase: 'inhale'|'hold'|'exhale', text: '...', duration: seconds }
      function getPattern() {
        if (currentMode === 'box') {
          return [
            { phase: 'inhale', text: 'Breathe in slowly...', duration: 4 },
            { phase: 'hold', text: 'Gently hold your breath...', duration: 4 },
            { phase: 'exhale', text: 'Breathe out quietly...', duration: 4 },
            { phase: 'hold', text: 'Rest empty...', duration: 4 }
          ];
        } else if (currentMode === 'sleep') {
          return [
            { phase: 'inhale', text: 'Inhale through nose...', duration: 4 },
            { phase: 'hold', text: 'Hold peacefully...', duration: 7 },
            { phase: 'exhale', text: 'Slow exhale through mouth...', duration: 8 }
          ];
        } else {
          return [
            { phase: 'inhale', text: 'Breathe in peace...', duration: 4 },
            { phase: 'exhale', text: 'Release tension...', duration: 6 }
          ];
        }
      }

      function stop() {
        isRunning = false;
        clearInterval(timerInterval);
        startBtn.innerHTML = '<span>Start Session</span>';
        circle.className = 'breather-circle';
        timerText.textContent = '4';
        promptText.textContent = 'Ready to relax';
      }

      function start() {
        isRunning = true;
        startBtn.innerHTML = '<span>Pause</span>';
        var pattern = getPattern();
        var stepIndex = 0;
        var secondsLeft = pattern[0].duration;

        function applyStep(step) {
          circle.className = 'breather-circle ' + step.phase;
          promptText.textContent = step.text;
          secondsLeft = step.duration;
          timerText.textContent = secondsLeft;
          AudioHelper.playChime(step.phase === 'inhale' ? 440 : 528, 'sine', 0.8);
        }

        applyStep(pattern[stepIndex]);

        timerInterval = setInterval(function () {
          secondsLeft--;
          if (secondsLeft > 0) {
            timerText.textContent = secondsLeft;
          } else {
            stepIndex++;
            if (stepIndex >= pattern.length) {
              stepIndex = 0;
              completedCycles++;
              countText.textContent = completedCycles + (completedCycles === 1 ? ' breath completed' : ' breaths completed');
            }
            applyStep(pattern[stepIndex]);
          }
        }, 1000);
      }

      startBtn.addEventListener('click', function () {
        if (isRunning) {
          stop();
        } else {
          start();
        }
      });

      resetBtn.addEventListener('click', function () {
        stop();
        completedCycles = 0;
        countText.textContent = '0 breaths completed';
      });

      modeBox.addEventListener('click', function () {
        currentMode = 'box';
        modeBox.classList.add('active');
        modeSleep.classList.remove('active');
        modeCalm.classList.remove('active');
        stop();
      });
      modeSleep.addEventListener('click', function () {
        currentMode = 'sleep';
        modeSleep.classList.add('active');
        modeBox.classList.remove('active');
        modeCalm.classList.remove('active');
        stop();
      });
      modeCalm.addEventListener('click', function () {
        currentMode = 'calm';
        modeCalm.classList.add('active');
        modeBox.classList.remove('active');
        modeSleep.classList.remove('active');
        stop();
      });
    }
  };

  // ==========================================================================
  // 9. STRESS CHECK QUESTIONNAIRE
  // ==========================================================================
  window.Code4CareToolsRegistry['stress-check'] = {
    render: function (container) {
      var questions = [
        { text: 'Have you felt rushed, hurried, or overloaded with tasks this week?' },
        { text: 'Have you found it hard to unwind, sleep, or stop thinking about chores/work?' },
        { text: 'Have you felt calm and in control of your daily routine?' },
        { text: 'Have you felt energetic, rested, and ready for your day?' }
      ];

      var answers = [1, 1, 1, 1]; // 0: Never/Rarely, 1: Sometimes, 2: Often

      function renderQuiz() {
        var qHtml = '';
        questions.forEach(function (q, idx) {
          qHtml += 
            '<div style="margin-bottom: 14px;">' +
              '<p style="font-size: 0.88rem; font-weight: 600; margin-bottom: 8px;">' + (idx + 1) + '. ' + q.text + '</p>' +
              '<div class="segmented-control" data-q-index="' + idx + '">' +
                '<button class="segmented-btn ' + (answers[idx] === 0 ? 'active' : '') + '" data-val="0">Rarely</button>' +
                '<button class="segmented-btn ' + (answers[idx] === 1 ? 'active' : '') + '" data-val="1">Sometimes</button>' +
                '<button class="segmented-btn ' + (answers[idx] === 2 ? 'active' : '') + '" data-val="2">Often</button>' +
              '</div>' +
            '</div>';
        });

        container.innerHTML = 
          '<div class="tool-ui-container">' +
            '<div class="tool-section">' +
              '<span class="tool-hint" style="margin-bottom: 6px;">Answer these 4 simple questions to check your current stress levels:</span>' +
              qHtml +
              '<button class="tool-calc-btn" id="stress-calc-btn">' +
                '<span>Check My Stress Level</span> &rarr;' +
              '</button>' +
            '</div>' +
            '<div id="stress-result-mount"></div>' +
          '</div>';

        // Attach listeners
        var controls = container.querySelectorAll('.segmented-control[data-q-index]');
        controls.forEach(function (ctrl) {
          var qIdx = parseInt(ctrl.getAttribute('data-q-index'), 10);
          var btns = ctrl.querySelectorAll('.segmented-btn');
          btns.forEach(function (btn) {
            btn.addEventListener('click', function () {
              var val = parseInt(btn.getAttribute('data-val'), 10);
              answers[qIdx] = val;
              btns.forEach(function (b) { b.classList.remove('active'); });
              btn.classList.add('active');
            });
          });
        });

        container.querySelector('#stress-calc-btn').addEventListener('click', calculateStress);
      }

      function calculateStress() {
        // Questions 0 & 1 increase stress (0, 1, 2)
        // Questions 2 & 3 reduce stress if answered often, so inverse (2 - val)
        var rawScore = answers[0] + answers[1] + (2 - answers[2]) + (2 - answers[3]);
        var stressPct = Math.round((rawScore / 8) * 100);

        var category = '';
        var badgeClass = '';
        var advice = '';

        if (stressPct <= 35) {
          category = 'Low Stress &bull; Peaceful';
          badgeClass = 'badge-green';
          advice = 'You are in a wonderful, calm mental state. Keep enjoying your daily routine, getting fresh air, and smiling!';
        } else if (stressPct <= 65) {
          category = 'Moderate &bull; Manageable';
          badgeClass = 'badge-yellow';
          advice = 'A little tension has built up. Remember to take 5-minute pauses, stretch your neck and shoulders, and step outside for daylight.';
        } else {
          category = 'High Tension &bull; Time to Slow Down';
          badgeClass = 'badge-coral';
          advice = 'Your body and mind are asking for gentle rest. Try our Breathing Pacer for 3 minutes, drink a glass of water, and give yourself permission to pause.';
        }

        var mount = container.querySelector('#stress-result-mount');
        mount.innerHTML = 
          '<div class="tool-result-box">' +
            '<div class="tool-result-header">' +
              '<div>' +
                '<span class="tool-hint">STRESS SCORE</span>' +
                '<div class="tool-result-number">' + stressPct + '<span class="tool-result-unit">/ 100</span></div>' +
              '</div>' +
              '<span class="tool-result-badge ' + badgeClass + '">' + category + '</span>' +
            '</div>' +

            '<p class="tool-result-desc">' + advice + '</p>' +

            '<div style="display: flex; gap: 8px; margin-top: 6px;">' +
              '<button class="tool-secondary-btn" id="btn-stress-to-breathing" style="flex: 1;">' +
                '<span>Open Breathing Pacer &rarr;</span>' +
              '</button>' +
            '</div>' +
          '</div>';

        var breathBtn = mount.querySelector('#btn-stress-to-breathing');
        if (breathBtn) {
          breathBtn.addEventListener('click', function () {
            // Trigger opening the breathing pacer
            var drawerTitle = document.getElementById('drawer-title');
            if (drawerTitle) {
              window.Code4CareToolsRegistry['breathing-pacer'].render(document.getElementById('tool-mount-point'));
              drawerTitle.textContent = 'Breathing Pacer';
            }
          });
        }
      }

      renderQuiz();
    }
  };

  // ==========================================================================
  // 10. MOOD TRACKER
  // ==========================================================================
  window.Code4CareToolsRegistry['mood-tracker'] = {
    render: function (container) {
      var moods = [
        { id: 'great', emoji: '🤩', name: 'Great', label: 'Energized & Happy' },
        { id: 'good', emoji: '😊', name: 'Good', label: 'Calm & Positive' },
        { id: 'okay', emoji: '😐', name: 'Okay', label: 'Neutral & Steady' },
        { id: 'tired', emoji: '🥱', name: 'Tired', label: 'Low Energy' },
        { id: 'stressed', emoji: '😔', name: 'Down', label: 'Need a Break' }
      ];

      var tags = ['🏃 Exercise', '🥗 Healthy Food', '😴 Great Sleep', '💼 Productive Work', '👨‍👩‍👧 Family & Friends', '☀️ Outdoors', '📖 Reading'];

      var selectedMood = 'good';
      var activeTags = ['🏃 Exercise'];

      container.innerHTML = 
        '<div class="tool-ui-container">' +
          '<div class="tool-section">' +
            '<span class="tool-label">How are you feeling right now?</span>' +
            '<div class="mood-picker-grid" id="mood-grid">' +
              // Populated below
            '</div>' +

            '<div style="margin-top: 10px;">' +
              '<span class="tool-label" style="margin-bottom: 8px;">What influenced your mood today?</span>' +
              '<div class="tag-chips-wrapper" id="tag-chips">' +
                // Populated below
              '</div>' +
            '</div>' +

            '<div style="margin-top: 10px;">' +
              '<label class="tool-label" style="margin-bottom: 6px;">Add a quick gratitude or note (optional):</label>' +
              '<input type="text" class="tool-input" id="mood-note" placeholder="e.g. Went for a peaceful walk in the sun...">' +
            '</div>' +

            '<button class="tool-calc-btn" id="mood-save-btn">' +
              '<span>Save Today\'s Mood</span>' +
            '</button>' +
          '</div>' +

          '<div id="mood-saved-alert"></div>' +
        '</div>';

      var moodGrid = container.querySelector('#mood-grid');
      var tagChips = container.querySelector('#tag-chips');
      var saveBtn = container.querySelector('#mood-save-btn');
      var alertBox = container.querySelector('#mood-saved-alert');

      moods.forEach(function (m) {
        var btn = document.createElement('button');
        btn.className = 'mood-btn ' + (m.id === selectedMood ? 'selected' : '');
        btn.innerHTML = '<span class="emoji-icon">' + m.emoji + '</span><span class="mood-name">' + m.name + '</span>';
        btn.addEventListener('click', function () {
          selectedMood = m.id;
          moodGrid.querySelectorAll('.mood-btn').forEach(function (b) { b.classList.remove('selected'); });
          btn.classList.add('selected');
        });
        moodGrid.appendChild(btn);
      });

      tags.forEach(function (tag) {
        var chip = document.createElement('button');
        chip.className = 'tag-chip ' + (activeTags.indexOf(tag) !== -1 ? 'active' : '');
        chip.textContent = tag;
        chip.addEventListener('click', function () {
          chip.classList.toggle('active');
          var idx = activeTags.indexOf(tag);
          if (idx !== -1) activeTags.splice(idx, 1);
          else activeTags.push(tag);
        });
        tagChips.appendChild(chip);
      });

      saveBtn.addEventListener('click', function () {
        var note = container.querySelector('#mood-note').value;
        AudioHelper.playChime(587, 'sine', 0.5);

        // Notify dashboard Overview Mood widget
        var moodObj = moods.find(function (m) { return m.id === selectedMood; });
        notifyDashboardUpdate('mood', {
          name: moodObj ? moodObj.name : 'Good',
          emoji: moodObj ? moodObj.emoji : '😊',
          tags: activeTags,
          note: note
        });

        alertBox.innerHTML = 
          '<div class="tool-result-box" style="text-align: center; border-color: var(--success);">' +
            '<div style="font-size: 1.6rem; margin-bottom: 4px;">🎉 Saved to your daily log!</div>' +
            '<p style="font-size: 0.88rem; color: var(--muted); margin: 0;">Your feelings matter. Thank you for taking a moment to check in with yourself.</p>' +
          '</div>';

        saveBtn.textContent = '✓ Saved Successfully';
        saveBtn.style.background = 'var(--success)';
      });
    }
  };

  // ==========================================================================
  // 11. SLEEP LOG & BEDTIME CALCULATOR
  // ==========================================================================
  window.Code4CareToolsRegistry['sleep-log'] = {
    render: function (container) {
      container.innerHTML = 
        '<div class="tool-ui-container">' +
          '<div class="segmented-control">' +
            '<button class="segmented-btn active" id="sleep-tab-calc">Bedtime Calculator</button>' +
            '<button class="segmented-btn" id="sleep-tab-log">Log Last Night</button>' +
          '</div>' +

          '<div id="sleep-tab-content"></div>' +
        '</div>';

      var tabCalc = container.querySelector('#sleep-tab-calc');
      var tabLog = container.querySelector('#sleep-tab-log');
      var tabContent = container.querySelector('#sleep-tab-content');

      function renderCalculator() {
        tabContent.innerHTML = 
          '<div class="tool-section">' +
            '<label class="tool-label">What time do you need to wake up?' +
              '<span class="tool-hint">Target Alarm</span>' +
            '</label>' +
            '<input type="time" class="tool-input" id="sleep-wake-time" value="07:00">' +
            '<button class="tool-calc-btn" id="sleep-calc-btn">' +
              '<span>Find Best Bedtimes</span> &rarr;' +
            '</button>' +
          '</div>' +
          '<div id="sleep-results-mount"></div>';

        function calcBedtimes() {
          var wakeTimeVal = tabContent.querySelector('#sleep-wake-time').value || '07:00';
          var parts = wakeTimeVal.split(':');
          var wakeHour = parseInt(parts[0], 10);
          var wakeMin = parseInt(parts[1], 10);

          // Natural human sleep happens in 90-minute (1.5h) cycles
          // Average person takes 14 minutes to fall asleep
          function getBedtime(cycles) {
            var totalMin = (wakeHour * 60) + wakeMin;
            var sleepMin = (cycles * 90) + 15; // 15m to fall asleep
            var bedMin = totalMin - sleepMin;
            if (bedMin < 0) bedMin += 1440; // wrap day

            var h = Math.floor(bedMin / 60);
            var m = bedMin % 60;
            var ampm = h >= 12 ? 'PM' : 'AM';
            var displayH = h % 12;
            if (displayH === 0) displayH = 12;
            var displayM = m < 10 ? '0' + m : m;
            return displayH + ':' + displayM + ' ' + ampm;
          }

          var rMount = tabContent.querySelector('#sleep-results-mount');
          rMount.innerHTML = 
            '<div class="tool-result-box">' +
              '<span class="tool-hint">BEST BEDTIMES TO WAKE UP FRESH AT ' + wakeTimeVal + ':</span>' +
              '<div class="bedtime-cards-grid" style="margin-top: 10px;">' +
                '<div class="bedtime-card featured">' +
                  '<div class="bedtime-time">' + getBedtime(5) + '</div>' +
                  '<div class="bedtime-cycles">7.5 hrs &bull; 5 Cycles</div>' +
                  '<div style="font-size: 0.72rem; color: #10B981; font-weight: 700; margin-top: 4px;">RECOMMENDED</div>' +
                '</div>' +
                '<div class="bedtime-card">' +
                  '<div class="bedtime-time">' + getBedtime(6) + '</div>' +
                  '<div class="bedtime-cycles">9.0 hrs &bull; 6 Cycles</div>' +
                  '<div style="font-size: 0.72rem; color: var(--muted); margin-top: 4px;">Deep Rest</div>' +
                '</div>' +
                '<div class="bedtime-card">' +
                  '<div class="bedtime-time">' + getBedtime(4) + '</div>' +
                  '<div class="bedtime-cycles">6.0 hrs &bull; 4 Cycles</div>' +
                  '<div style="font-size: 0.72rem; color: var(--muted); margin-top: 4px;">Minimum</div>' +
                '</div>' +
              '</div>' +
              '<p class="tool-result-desc" style="margin-top: 12px;">' +
                'Waking up in the middle of a 90-minute sleep cycle causes morning grogginess. ' +
                'Sleeping at one of these times helps you wake up between cycles feeling energized!' +
              '</p>' +
            '</div>';
        }

        tabContent.querySelector('#sleep-calc-btn').addEventListener('click', calcBedtimes);
        calcBedtimes();
      }

      function renderLogger() {
        tabContent.innerHTML = 
          '<div class="tool-section">' +
            '<div class="tool-input-group">' +
              '<label class="tool-label">Hours slept last night: <span class="tool-hint" id="sleep-hours-val">7.5 hours</span></label>' +
              '<input type="range" class="tool-range" id="sleep-hours-range" min="4" max="11" step="0.5" value="7.5">' +
            '</div>' +

            '<div class="tool-input-group">' +
              '<label class="tool-label">How refreshed do you feel?</label>' +
              '<div class="segmented-control" id="sleep-quality-ctrl">' +
                '<button class="segmented-btn" data-q="Tired">Tired</button>' +
                '<button class="segmented-btn" data-q="Fair">Fair</button>' +
                '<button class="segmented-btn active" data-q="Refreshed">Refreshed</button>' +
                '<button class="segmented-btn" data-q="Great">Energized</button>' +
              '</div>' +
            '</div>' +

            '<button class="tool-calc-btn" id="sleep-save-btn">' +
              '<span>Save Sleep Record</span>' +
            '</button>' +
          '</div>' +
          '<div id="sleep-save-alert"></div>';

        var range = tabContent.querySelector('#sleep-hours-range');
        var valText = tabContent.querySelector('#sleep-hours-val');
        var qualityBtns = tabContent.querySelectorAll('#sleep-quality-ctrl .segmented-btn');
        var saveBtn = tabContent.querySelector('#sleep-save-btn');
        var alertMount = tabContent.querySelector('#sleep-save-alert');
        var quality = 'Refreshed';

        range.addEventListener('input', function () {
          valText.textContent = range.value + ' hours';
        });

        qualityBtns.forEach(function (btn) {
          btn.addEventListener('click', function () {
            qualityBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            quality = btn.getAttribute('data-q');
          });
        });

        saveBtn.addEventListener('click', function () {
          var hours = parseFloat(range.value);
          AudioHelper.playChime(528, 'sine', 0.4);

          notifyDashboardUpdate('sleep', {
            hours: hours,
            quality: quality
          });

          alertMount.innerHTML = 
            '<div class="tool-result-box" style="text-align: center; border-color: var(--success);">' +
              '<div style="font-size: 1.4rem; font-weight: 700; color: #FFFFFF;">✓ Saved ' + hours + ' hours!</div>' +
              '<p style="font-size: 0.85rem; color: var(--muted); margin: 4px 0 0;">Updated your dashboard overview widgets.</p>' +
            '</div>';
        });
      }

      tabCalc.addEventListener('click', function () {
        tabCalc.classList.add('active');
        tabLog.classList.remove('active');
        renderCalculator();
      });

      tabLog.addEventListener('click', function () {
        tabLog.classList.add('active');
        tabCalc.classList.remove('active');
        renderLogger();
      });

      renderCalculator();
    }
  };

  // ==========================================================================
  // 12. MEDITATION & FOCUS TIMER
  // ==========================================================================
  window.Code4CareToolsRegistry['meditation-timer'] = {
    render: function (container) {
      var quotes = [
        '“Breathe in peace, breathe out tension.”',
        '“You are here, right now. Everything is okay.”',
        '“Quiet the mind, and the soul will speak.”',
        '“Give yourself permission to pause and recharge.”',
        '“Smile, breathe, and go slowly.”'
      ];

      var targetDuration = 300; // 5 min default
      var remainingSeconds = targetDuration;
      var timerInterval = null;
      var isRunning = false;

      container.innerHTML = 
        '<div class="tool-ui-container">' +
          '<div class="segmented-control">' +
            '<button class="segmented-btn" data-sec="60">1 Min</button>' +
            '<button class="segmented-btn" data-sec="180">3 Min</button>' +
            '<button class="segmented-btn active" data-sec="300">5 Min</button>' +
            '<button class="segmented-btn" data-sec="600">10 Min</button>' +
            '<button class="segmented-btn" data-sec="900">15 Min</button>' +
          '</div>' +

          '<div class="tool-section">' +
            '<div class="meditation-timer-wrap">' +
              '<div style="position: relative; display: flex; align-items: center; justify-content: center;">' +
                '<svg class="meditation-circle-svg" viewBox="0 0 160 160">' +
                  '<circle class="meditation-bg-ring" cx="80" cy="80" r="75"></circle>' +
                  '<circle class="meditation-progress-ring" id="med-ring" cx="80" cy="80" r="75"></circle>' +
                '</svg>' +
                '<div class="meditation-center-display">' +
                  '<div class="meditation-time-text" id="med-display">05:00</div>' +
                  '<span class="tool-hint" id="med-status">Calm Focus</span>' +
                '</div>' +
              '</div>' +

              '<div class="meditation-quote" id="med-quote">' + quotes[0] + '</div>' +

              '<div style="display: flex; gap: 10px; width: 100%; max-width: 280px;">' +
                '<button class="tool-calc-btn" id="med-start-btn" style="flex: 1;">' +
                  '<span>Start Session</span>' +
                '</button>' +
                '<button class="tool-secondary-btn" id="med-reset-btn">' +
                  '<span>Reset</span>' +
                '</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';

      var ring = container.querySelector('#med-ring');
      var display = container.querySelector('#med-display');
      var status = container.querySelector('#med-status');
      var quoteText = container.querySelector('#med-quote');
      var startBtn = container.querySelector('#med-start-btn');
      var resetBtn = container.querySelector('#med-reset-btn');
      var presetBtns = container.querySelectorAll('.segmented-btn[data-sec]');

      var circumference = 2 * Math.PI * 75; // ~471.2
      ring.style.strokeDasharray = circumference;

      function updateDisplay() {
        var m = Math.floor(remainingSeconds / 60);
        var s = remainingSeconds % 60;
        display.textContent = (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);

        var progress = (targetDuration - remainingSeconds) / targetDuration;
        var offset = circumference * (1 - progress);
        ring.style.strokeDashoffset = offset;
      }

      function stop() {
        isRunning = false;
        clearInterval(timerInterval);
        startBtn.innerHTML = '<span>Start Session</span>';
        status.textContent = 'Calm Focus';
      }

      function start() {
        isRunning = true;
        startBtn.innerHTML = '<span>Pause</span>';
        status.textContent = 'Breathe Quietly...';
        AudioHelper.playChime(528, 'sine', 1.8);

        timerInterval = setInterval(function () {
          remainingSeconds--;
          updateDisplay();

          if (remainingSeconds % 60 === 0) {
            var randQuote = quotes[Math.floor(Math.random() * quotes.length)];
            quoteText.textContent = randQuote;
          }

          if (remainingSeconds <= 0) {
            stop();
            display.textContent = '00:00';
            status.textContent = 'Session Complete 🙏';
            AudioHelper.playChime(432, 'sine', 3.0);
            quoteText.textContent = '“Peace comes from within. Well done!”';
          }
        }, 1000);
      }

      startBtn.addEventListener('click', function () {
        if (isRunning) {
          stop();
        } else {
          start();
        }
      });

      resetBtn.addEventListener('click', function () {
        stop();
        remainingSeconds = targetDuration;
        updateDisplay();
      });

      presetBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          stop();
          presetBtns.forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          targetDuration = parseInt(btn.getAttribute('data-sec'), 10);
          remainingSeconds = targetDuration;
          updateDisplay();
        });
      });

      updateDisplay();
    }
  };

})();
