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

})();
