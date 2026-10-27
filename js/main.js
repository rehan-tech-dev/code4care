/**
 * Code4Care - Main Application Script (js/main.js)
 * 
 * Handles interactions on the Home Page (index.html):
 * - Sticky navigation shadow on scroll
 * - Mobile hamburger menu toggle and accessibility states
 * - Smooth anchor scrolling with sticky header offset
 * - Automatic current year computation
 * 
 * Pure Vanilla JavaScript (No frameworks, works via file:// double click)
 */

(function () {
  'use strict';

  // 1. Automatic Copyright Year
  var copyrightEl = document.getElementById('copyright-year');
  if (copyrightEl) {
    copyrightEl.textContent = new Date().getFullYear();
  }

  // 2. Sticky Navbar Scroll State
  var siteHeader = document.getElementById('site-header');
  function handleHeaderScroll() {
    if (!siteHeader) return;
    if (window.scrollY > 20) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // 3. Mobile Hamburger Menu Toggle
  var hamburgerBtn = document.getElementById('hamburger-btn');
  var mobileMenu = document.getElementById('mobile-nav-menu');

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', function () {
      var isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      var newState = !isExpanded;

      hamburgerBtn.setAttribute('aria-expanded', String(newState));
      mobileMenu.setAttribute('aria-hidden', String(!newState));
      mobileMenu.classList.toggle('open', newState);
    });

    // Close mobile menu when a navigation link is clicked
    var mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        mobileMenu.classList.remove('open');
      });
    });

    // Close when clicking outside of navbar
    document.addEventListener('click', function (event) {
      if (!siteHeader.contains(event.target) && mobileMenu.classList.contains('open')) {
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        mobileMenu.classList.remove('open');
      }
    });
  }

  // 4. Smooth Anchor Link Navigation
  var anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = anchor.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      var targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        var headerOffset = 80;
        var elementPosition = targetElem.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 5. Interactive Home Page Tools Category Filtering
  var homeFilterBtns = document.querySelectorAll('[data-home-filter]');
  var homeToolTiles = document.querySelectorAll('#home-tools-grid .tool-preview-tile');

  if (homeFilterBtns.length > 0 && homeToolTiles.length > 0) {
    homeFilterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filterVal = btn.getAttribute('data-home-filter');

        homeFilterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        homeToolTiles.forEach(function (tile) {
          var category = tile.getAttribute('data-category');
          var shouldShow = filterVal === 'all' || category === filterVal;

          if (shouldShow) {
            tile.style.display = 'flex';
            tile.style.animation = 'tool-fade-in 0.3s ease-out';
          } else {
            tile.style.display = 'none';
          }
        });
      });
    });
  }

})();
