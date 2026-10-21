/**
 * Code4Care - Dashboard Controller (js/dashboard.js)
 * 
 * Manages all cockpit features:
 * - Dynamic time-of-day greeting & REAL date formatting
 * - Tool card rendering from js/tools-data.js
 * - Real-time live search & category filter tabs
 * - Slide-out drawer with modular tool mounting (Code4CareToolsRegistry)
 * - Sidebar & mobile bottom navigation synchronization
 * - LocalStorage state persistence (active tab & active section)
 * - Accessible keyboard navigation & focus management
 * 
 * Pure Vanilla JavaScript (No frameworks, 100% client-side)
 */

(function () {
  'use strict';

  // --- State Management ---
  var state = {
    activeCategory: 'all',     // 'all' | 'physical' | 'mental'
    activeSection: 'overview',  // 'overview' | 'physical' | 'mental' | 'progress'
    searchQuery: '',
    selectedTool: null,
    lastFocusedElement: null
  };

  // --- DOM Elements ---
  var greetingTextEl = document.getElementById('greeting-text');
  var currentDateDisplayEl = document.getElementById('current-date-display');
  var toolSearchInput = document.getElementById('tool-search-input');
  var searchClearBtn = document.getElementById('search-clear-btn');
  var filterTabBtns = document.querySelectorAll('.filter-tab-btn');
  var toolsCounterBadge = document.getElementById('tools-counter-badge');
  var toolsContainer = document.getElementById('tools-container');

  var sidebarLinks = document.querySelectorAll('.sidebar-link[data-section]');
  var mobileNavItems = document.querySelectorAll('.mobile-bottom-nav-item[data-section]');
  var overviewSection = document.getElementById('overview-section');
  var toolsSection = document.getElementById('tools-section');
  var progressSection = document.getElementById('progress-section');

  // Drawer Elements
  var drawerBackdrop = document.getElementById('drawer-backdrop');
  var toolDrawer = document.getElementById('tool-drawer');
  var drawerCloseBtn = document.getElementById('drawer-close-btn');
  var drawerIconEl = document.getElementById('drawer-icon');
  var drawerTitleEl = document.getElementById('drawer-title');
  var drawerCategoryBadgeEl = document.getElementById('drawer-category-badge');
  var drawerDescEl = document.getElementById('drawer-desc');
  var toolMountPoint = document.getElementById('tool-mount-point');

  // ========================================================================
  // 1. Time-of-Day Greeting & Real Current Date Display
  // ========================================================================
  function initHeaderTelemetry() {
    var now = new Date();
    var hours = now.getHours();

    // Time-of-day greeting
    var greeting = 'Welcome, Vital Seeker';
    if (hours >= 4 && hours < 12) {
      greeting = 'Good morning, Vital Seeker';
    } else if (hours >= 12 && hours < 17) {
      greeting = 'Good afternoon, Vital Seeker';
    } else if (hours >= 17 && hours < 22) {
      greeting = 'Good evening, Vital Seeker';
    } else {
      greeting = 'Night watch mode, Vital Seeker';
    }

    if (greetingTextEl) {
      greetingTextEl.textContent = greeting;
    }

    // Real formatted date (e.g. "Wednesday, October 21, 2026")
    if (currentDateDisplayEl) {
      var options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      var formattedDate = now.toLocaleDateString(undefined, options);
      currentDateDisplayEl.textContent = 'Telemetry active \u2022 ' + formattedDate;
    }
  }

  // ========================================================================
  // 2. Render Tool Cards to the DOM
  // ========================================================================
  function renderTools() {
    if (!toolsContainer || !window.TOOLS_DATA) return;

    var tools = window.TOOLS_DATA;
    var filtered = tools.filter(function (tool) {
      // Category filter
      var matchesCategory = (state.activeCategory === 'all') || (tool.category === state.activeCategory);

      // Search filter (name, description, features)
      var query = state.searchQuery.trim().toLowerCase();
      var matchesSearch = true;
      if (query) {
        var nameMatch = tool.name.toLowerCase().indexOf(query) !== -1;
        var descMatch = tool.description.toLowerCase().indexOf(query) !== -1;
        var catMatch = tool.category.toLowerCase().indexOf(query) !== -1;
        matchesSearch = nameMatch || descMatch || catMatch;
      }

      return matchesCategory && matchesSearch;
    });

    // Update counter badge
    if (toolsCounterBadge) {
      var totalText = filtered.length === 1 ? '1 tool found' : filtered.length + ' tools available';
      toolsCounterBadge.textContent = totalText;
    }

    // Render empty state if nothing matches
    if (filtered.length === 0) {
      toolsContainer.innerHTML = 
        '<div class="tools-empty-state">' +
          '<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; color: var(--muted);">' +
            '<circle cx="11" cy="11" r="8"></circle>' +
            '<line x1="21" y1="21" x2="16.65" y2="16.65"></line>' +
          '</svg>' +
          '<h3>No matching diagnostic tools</h3>' +
          '<p style="font-size: 0.9rem; margin-top: 6px;">Try adjusting your search query or switching categories.</p>' +
        '</div>';
      return;
    }

    // Render Cards
    var html = '';
    filtered.forEach(function (tool) {
      var isPhysical = tool.category === 'physical';
      var categoryLabel = isPhysical ? 'Physical' : 'Mental';
      var badgeClass = isPhysical ? 'badge' : 'badge badge-rose';
      var themeClass = isPhysical ? 'physical' : 'mental';

      html += 
        '<article class="tool-card ' + themeClass + '" data-tool-id="' + tool.id + '" tabindex="0" role="button" aria-label="Open ' + tool.name + ' tool details">' +
          '<div class="tool-card-top">' +
            '<div class="tool-card-icon" aria-hidden="true">' +
              tool.icon +
            '</div>' +
            '<span class="' + badgeClass + '">' + categoryLabel + '</span>' +
          '</div>' +

          '<div>' +
            '<h3 class="tool-card-title">' + tool.name + '</h3>' +
            '<p class="tool-card-desc">' + tool.description + '</p>' +
          '</div>' +

          '<div class="tool-card-footer">' +
            '<span class="tool-status-pill">' +
              (tool.status === 'active' ? 'Active' : 'Coming soon') +
            '</span>' +
            '<span class="tool-action-link">' +
              'Launch &rarr;' +
            '</span>' +
          '</div>' +
        '</article>';
    });

    toolsContainer.innerHTML = html;

    // Attach click and keyboard listeners to cards
    var cardElements = toolsContainer.querySelectorAll('.tool-card');
    cardElements.forEach(function (card) {
      var toolId = card.getAttribute('data-tool-id');

      card.addEventListener('click', function () {
        openToolDrawer(toolId);
      });

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openToolDrawer(toolId);
        }
      });
    });
  }

  // ========================================================================
  // 3. Side Panel (Drawer) Management & Tool Rendering Hook
  // ========================================================================
  function openToolDrawer(toolId) {
    if (!window.TOOLS_DATA) return;

    var tool = window.TOOLS_DATA.find(function (t) {
      return t.id === toolId;
    });

    if (!tool) return;

    state.selectedTool = tool;
    state.lastFocusedElement = document.activeElement;

    // Set Theme
    var isMental = tool.category === 'mental';
    if (isMental) {
      toolDrawer.classList.add('mental-theme');
    } else {
      toolDrawer.classList.remove('mental-theme');
    }

    // Populate Header Info
    if (drawerIconEl) drawerIconEl.innerHTML = tool.icon;
    if (drawerTitleEl) drawerTitleEl.textContent = tool.name;
    if (drawerDescEl) drawerDescEl.textContent = tool.description;

    if (drawerCategoryBadgeEl) {
      drawerCategoryBadgeEl.textContent = isMental ? 'Mental Wellness' : 'Physical Health';
      drawerCategoryBadgeEl.className = isMental ? 'badge badge-rose' : 'badge';
    }

    // Clean Mount Point
    if (toolMountPoint) {
      toolMountPoint.innerHTML = '';

      // Check if a dedicated tool module has registered a render function
      // e.g., window.Code4CareToolsRegistry['bmi-calculator'].render(toolMountPoint)
      var registeredModule = window.Code4CareToolsRegistry && window.Code4CareToolsRegistry[tool.id];

      if (registeredModule && typeof registeredModule.render === 'function') {
        // Execute real tool interactive renderer
        registeredModule.render(toolMountPoint, tool);
      } else {
        // Render sleek "Coming Soon" architectural placeholder
        renderComingSoonPlaceholder(toolMountPoint, tool);
      }
    }

    // Open Drawer
    drawerBackdrop.classList.add('active');
    toolDrawer.classList.add('active');
    drawerBackdrop.setAttribute('aria-hidden', 'false');

    // Focus close button for accessibility
    setTimeout(function () {
      if (drawerCloseBtn) drawerCloseBtn.focus();
    }, 150);
  }

  function closeToolDrawer() {
    drawerBackdrop.classList.remove('active');
    toolDrawer.classList.remove('active');
    drawerBackdrop.setAttribute('aria-hidden', 'true');

    // Restore focus to previously clicked card
    if (state.lastFocusedElement) {
      state.lastFocusedElement.focus();
    }
  }

  // Coming Soon Architectural Placeholder Template
  function renderComingSoonPlaceholder(container, tool) {
    var featuresHtml = '';
    if (tool.features && tool.features.length > 0) {
      featuresHtml = 
        '<div style="margin-top: 14px;">' +
          '<h4 style="font-size: 0.95rem; margin-bottom: 8px; color: var(--text-pure);">Planned Engine Features:</h4>' +
          '<ul class="placeholder-features-list">';
      tool.features.forEach(function (feat) {
        featuresHtml += 
          '<li class="placeholder-feature-item">' +
            '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>' +
            '<span>' + feat + '</span>' +
          '</li>';
      });
      featuresHtml += '</ul></div>';
    }

    container.innerHTML = 
      '<div class="tool-placeholder-wrapper">' +
        '<span class="placeholder-badge">&#9679; Module Under Staging</span>' +

        '<div>' +
          '<h4 style="font-size: 1.15rem; margin-bottom: 6px;">' + tool.name + ' Engine</h4>' +
          '<p style="font-size: 0.88rem; color: var(--muted); line-height: 1.5;">' +
            'This tool container is fully pre-wired. The calculation engine will be mounted in the next step.' +
          '</p>' +
        '</div>' +

        featuresHtml +

        '<div class="architecture-note">' +
          '<strong>// Modular Tool Mounting Hook:</strong><br>' +
          'To connect real code, add a script (e.g. <code>js/tools/' + tool.id + '.js</code>) defining:<br>' +
          '<code>window.Code4CareToolsRegistry[\'' + tool.id + '\'] = { render: function(container) { ... } };</code>' +
        '</div>' +

        '<button class="btn btn-secondary" id="btn-notify-tool" style="width: 100%; margin-top: 4px;">' +
          '<span>Notify Me When Live</span>' +
        '</button>' +
      '</div>';

    var notifyBtn = container.querySelector('#btn-notify-tool');
    if (notifyBtn) {
      notifyBtn.addEventListener('click', function () {
        notifyBtn.innerHTML = '<span>&#10003; Subscribed (Local Demo)</span>';
        notifyBtn.style.borderColor = 'var(--success)';
        notifyBtn.style.color = 'var(--success)';
      });
    }
  }

  // ========================================================================
  // 4. Category Tabs & Search Interaction
  // ========================================================================
  function setCategory(category) {
    state.activeCategory = category;

    // Update Tab UI
    filterTabBtns.forEach(function (btn) {
      var btnCat = btn.getAttribute('data-category');
      var isActive = btnCat === category;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });

    // Save to LocalStorage
    try {
      localStorage.setItem('code4care_active_tab', category);
    } catch (e) {
      console.warn('LocalStorage unavailable', e);
    }

    renderTools();
  }

  function initFiltersAndSearch() {
    // Filter Tabs Click
    filterTabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.getAttribute('data-category');
        setCategory(cat);
      });
    });

    // Live Search Input
    if (toolSearchInput) {
      toolSearchInput.addEventListener('input', function (e) {
        state.searchQuery = e.target.value;
        if (searchClearBtn) {
          searchClearBtn.style.display = state.searchQuery ? 'block' : 'none';
        }
        renderTools();
      });

      // Keyboard shortcut: Pressing "/" focuses search input
      window.addEventListener('keydown', function (e) {
        if (e.key === '/' && document.activeElement !== toolSearchInput) {
          e.preventDefault();
          toolSearchInput.focus();
        }
      });
    }

    // Clear Search Button
    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', function () {
        toolSearchInput.value = '';
        state.searchQuery = '';
        searchClearBtn.style.display = 'none';
        toolSearchInput.focus();
        renderTools();
      });
    }
  }

  // ========================================================================
  // 5. Section Navigation (Sidebar & Mobile Bottom Nav)
  // ========================================================================
  function setSection(sectionName) {
    state.activeSection = sectionName;

    // Update Sidebar Desktop
    sidebarLinks.forEach(function (link) {
      var isMatching = link.getAttribute('data-section') === sectionName;
      link.classList.toggle('active', isMatching);
    });

    // Update Mobile Bottom Nav
    mobileNavItems.forEach(function (btn) {
      var isMatching = btn.getAttribute('data-section') === sectionName;
      btn.classList.toggle('active', isMatching);
    });

    // Handle Section Visibility
    if (sectionName === 'overview') {
      overviewSection.style.display = 'flex';
      toolsSection.style.display = 'flex';
      progressSection.style.display = 'none';
      setCategory('all');
    } else if (sectionName === 'physical') {
      overviewSection.style.display = 'none';
      toolsSection.style.display = 'flex';
      progressSection.style.display = 'none';
      setCategory('physical');
    } else if (sectionName === 'mental') {
      overviewSection.style.display = 'none';
      toolsSection.style.display = 'flex';
      progressSection.style.display = 'none';
      setCategory('mental');
    } else if (sectionName === 'progress') {
      overviewSection.style.display = 'none';
      toolsSection.style.display = 'none';
      progressSection.style.display = 'flex';
    }

    // Save active section to LocalStorage
    try {
      localStorage.setItem('code4care_active_section', sectionName);
    } catch (e) {
      console.warn('LocalStorage unavailable', e);
    }

    // Scroll to top of content smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function initNavigation() {
    // Desktop sidebar clicks
    sidebarLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        var sec = link.getAttribute('data-section');
        if (sec) setSection(sec);
      });
    });

    // Mobile bottom nav clicks
    mobileNavItems.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var sec = btn.getAttribute('data-section');
        if (sec) setSection(sec);
      });
    });
  }

  // ========================================================================
  // 6. Interactive Demo Widget Logic
  // ========================================================================
  function initDemoWidgets() {
    // Quick water intake +250mL demo button
    var btnQuickWater = document.getElementById('btn-quick-water');
    var hydrationFill = document.getElementById('hydration-demo-fill');
    var currentWater = 1.8;

    if (btnQuickWater && hydrationFill) {
      btnQuickWater.addEventListener('click', function () {
        currentWater = Math.min(2.5, +(currentWater + 0.25).toFixed(2));
        var percent = Math.round((currentWater / 2.5) * 100);
        hydrationFill.style.width = percent + '%';
        
        var strongElem = btnQuickWater.closest('.bento-card').querySelector('strong');
        if (strongElem) {
          strongElem.innerHTML = currentWater + ' <span style="font-size: 0.9rem; color: var(--muted); font-weight: normal;">/ 2.5L</span>';
        }

        if (currentWater >= 2.5) {
          btnQuickWater.textContent = 'Goal Met!';
          btnQuickWater.disabled = true;
          btnQuickWater.style.background = 'var(--success)';
          btnQuickWater.style.borderColor = 'var(--success)';
        }
      });
    }

    // Export Data Demo Button
    var btnExport = document.getElementById('btn-export-data');
    if (btnExport) {
      btnExport.addEventListener('click', function () {
        var dummyData = {
          app: 'Code4Care',
          timestamp: new Date().toISOString(),
          status: 'Operational',
          localMetrics: {
            wellnessScore: 88,
            waterIntakeLiters: currentWater,
            streakDays: 6
          }
        };
        var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dummyData, null, 2));
        var downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', 'code4care-telemetry.json');
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      });
    }

    // Reset Demo Cache
    var btnClearCache = document.getElementById('btn-clear-cache');
    if (btnClearCache) {
      btnClearCache.addEventListener('click', function () {
        if (confirm('Reset your locally saved preferences (active tab and section)?')) {
          localStorage.removeItem('code4care_active_tab');
          localStorage.removeItem('code4care_active_section');
          window.location.reload();
        }
      });
    }
  }

  // ========================================================================
  // 7. Drawer Keyboard & Backdrop Handlers
  // ========================================================================
  function initDrawerEvents() {
    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', closeToolDrawer);
    }
    if (drawerBackdrop) {
      drawerBackdrop.addEventListener('click', closeToolDrawer);
    }

    // Escape key closes drawer
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toolDrawer.classList.contains('active')) {
        closeToolDrawer();
      }
    });
  }

  // ========================================================================
  // 8. Restore Saved State on Page Load
  // ========================================================================
  function restoreState() {
    try {
      var savedTab = localStorage.getItem('code4care_active_tab');
      if (savedTab && (savedTab === 'all' || savedTab === 'physical' || savedTab === 'mental')) {
        state.activeCategory = savedTab;
      }

      var savedSection = localStorage.getItem('code4care_active_section');
      if (savedSection && (savedSection === 'overview' || savedSection === 'physical' || savedSection === 'mental' || savedSection === 'progress')) {
        setSection(savedSection);
      } else {
        setCategory(state.activeCategory);
      }
    } catch (e) {
      console.warn('LocalStorage access issue:', e);
      setCategory('all');
    }
  }

  // ========================================================================
  // Initialize on DOM Ready
  // ========================================================================
  document.addEventListener('DOMContentLoaded', function () {
    initHeaderTelemetry();
    initFiltersAndSearch();
    initNavigation();
    initDrawerEvents();
    initDemoWidgets();
    restoreState();
    renderTools();
  });

})();
