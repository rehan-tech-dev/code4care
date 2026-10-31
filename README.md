# Code4Care

**A privacy-focused, browser-based physical health and mental wellness
toolkit.**

-   **Live website:** https://code4care.netlify.app/
-   **Source repository:** https://github.com/rehan-tech-dev/code4care
-   **Deployment:** Netlify
-   **Application type:** Static website built with vanilla HTML, CSS
    and JavaScript

## Overview

Code4Care brings a collection of simple health and wellness utilities
together in one browser-based experience. It separates its tools into
two groups:

-   **Physical health (7 tools):** BMI calculator, calorie and BMR
    calculator, blood pressure checker, heart-rate zones, water intake
    tracker, ideal weight guide and tap pulse counter.
-   **Mental wellness (5 tools):** breathing pacer, quick stress check,
    daily mood tracker, sleep log and bedtime calculator, and meditation
    timer.

The public landing page introduces the tools and links to a dashboard
cockpit. The dashboard provides navigation for the overview, physical
health, mental wellness, progress and health tips areas, and mounts
selected tools into a shared tool panel.

## Main features

### Physical health

1.  **BMI Calculator** --- estimates body mass index from height and
    weight and presents an interpreted range.
2.  **Calorie & BMR Calculator** --- estimates basal metabolic rate and
    daily energy needs.
3.  **Blood Pressure Checker** --- presents a category for entered
    systolic and diastolic readings.
4.  **Heart-Rate Zones** --- presents exercise heart-rate zones.
5.  **Water Intake Tracker** --- lets a user track water intake.
6.  **Ideal Weight Guide** --- provides an estimated healthy-weight
    guide based on height.
7.  **Tap Pulse Counter** --- lets a user tap along with a pulse to
    estimate beats per minute.

### Mental wellness

1.  **Breathing Pacer** --- guides timed breathing exercises, including
    box breathing and 4-7-8 breathing.
2.  **Quick Stress Check** --- uses a short set of questions and
    provides general calming suggestions.
3.  **Daily Mood Tracker** --- provides mood check-ins and gratitude
    notes.
4.  **Sleep Log & Bedtime Calculator** --- supports sleep logging and
    estimates wake/sleep times using 90-minute cycle intervals.
5.  **Peaceful Meditation Timer** --- provides a timed focus session
    with a gentle sound cue.

> These tools provide general wellness information and estimates. They
> are not medical devices and must not be used to diagnose, treat, or
> replace advice from a qualified healthcare professional.

## Technology

The repository and live site identify the project as a static, vanilla
web application:

-   HTML5 for page structure
-   CSS3 for layout, styling and responsive presentation
-   Browser JavaScript for interactions and calculations
-   Google Fonts for typography (Inter, Space Grotesk and Plus Jakarta
    Sans are referenced in the HTML)
-   Netlify for hosting/deployment

The public pages do not show a conventional application backend or
framework build step. The landing page loads `js/main.js`. The dashboard
loads its data, tool implementation, dashboard controller and health
tips scripts in sequence.

## Repository structure

The following structure is based on the files and references visible in
the public repository. Confirm the exact contents of each folder against
the current repository before changing it.

``` text
code4care/
├── assets/                 # Images, logo and other static assets
├── css/
│   ├── style.css           # Shared / landing-page styles
│   ├── dashboard.css       # Dashboard-specific styles
│   └── tools.css           # Health-tool styles
├── js/
│   ├── main.js             # Landing-page interactions
│   ├── tools-data.js       # Tool catalogue / metadata
│   ├── tools-impl.js       # Tool rendering and tool logic
│   ├── dashboard.js        # Dashboard navigation and controller
│   └── tips.js             # Health tips functionality
├── index.html              # Public landing page
├── dashboard.html          # Health tools dashboard
└── start.bat               # Windows startup helper (inspect before use)
```

### Page and script responsibilities

  -----------------------------------------------------------------------
  File                                Observed responsibility
  ----------------------------------- -----------------------------------
  `index.html`                        Landing page, feature sections,
                                      tool previews and navigation to
                                      dashboard

  `dashboard.html`                    Dashboard shell, navigation, tool
                                      mount point and dashboard layout

  `js/main.js`                        Loaded by the landing page

  `js/tools-data.js`                  Loaded first by dashboard; likely
                                      provides tool data/configuration

  `js/tools-impl.js`                  Loaded after tool data; provides
                                      tool implementations

  `js/dashboard.js`                   Loaded as the dashboard controller

  `js/tips.js`                        Loaded for health tips

  `css/style.css`                     Shared visual system

  `css/dashboard.css`                 Dashboard-specific presentation

  `css/tools.css`                     Tool-specific presentation
  -----------------------------------------------------------------------

The JavaScript responsibilities above are inferred from script names and
load order in the HTML. Inspect the source before relying on
undocumented internal APIs or data structures.

## Run locally

Because this is a static HTML/CSS/JavaScript project, it can generally
be run with a local static web server.

1.  Clone or download the repository.

2.  Open the project folder in a terminal or code editor.

3.  Start a local static server from the repository root. For example,
    if Python is installed:

    ``` bash
    python -m http.server 8000
    ```

4.  Open `http://localhost:8000/` in a browser.

5.  Open the dashboard at `http://localhost:8000/dashboard.html`.

The repository also contains `start.bat`; inspect its contents before
running it. A local server is recommended over opening files directly
because browser security rules can affect some features.

## Deployment

The live deployment is hosted at Netlify:

https://code4care.netlify.app/

The project appears to be deployed as a static site. When deploying
updates, ensure that the published directory contains `index.html`,
`dashboard.html`, and the referenced `assets/`, `css/` and `js/`
directories with their expected relative paths.

## Privacy and data handling

The public website describes Code4Care as client-side and says that
user-entered values remain on the local device. This is an important
product promise and should be verified against the implementation before
making stronger privacy claims.

When modifying the application:

-   Do not add analytics, remote APIs, cloud storage or third-party data
    transmission without an explicit product decision and clear
    disclosure.
-   Do not store sensitive health information unless there is a clear
    need, user consent and an appropriate security design.
-   If browser storage is used, explain what is stored, where, and how
    users can clear it.
-   Never commit `.env` files, passwords, API keys, tokens or private
    credentials.

## Medical and safety disclaimer

Code4Care is an educational and general-wellness project. Its
calculations and suggestions are estimates, not a clinical assessment.
Keep the medical disclaimer visible. Avoid diagnostic language,
treatment recommendations, or claims that the tools can detect or
prevent disease. Encourage users to consult qualified healthcare
professionals for medical concerns.

## Known documentation and verification boundaries

This README is based on the public landing page, repository file listing
and HTML references that were accessible during documentation
preparation. The JavaScript and CSS folder contents were not
independently inspected in full. Therefore:

-   Exact formulas, validation rules and edge-case handling have not
    been certified.
-   Actual persistence behavior (for example, `localStorage`) must be
    confirmed in the JavaScript.
-   Accessibility, browser compatibility, security and performance have
    not been formally tested.
-   The `start.bat` behavior has not been verified.
-   No medical accuracy or clinical validation is claimed.

For a complete technical audit, inspect every file under `js/`, `css/`
and `assets/`, then test each tool with normal, boundary and invalid
inputs.

## Suggested future improvements

-   Add a clear project version and changelog.
-   Add automated tests for calculation functions and input validation.
-   Add accessible labels, keyboard support, focus states and
    reduced-motion support.
-   Document the exact formula and assumptions used by each health
    calculator.
-   Add unit selection and validation for height, weight, time and blood
    pressure inputs.
-   Review mobile layouts and performance on low-end devices.
-   Add a privacy/data-handling page that matches the actual code.
-   Add a `LICENSE` file if the project is intended for reuse.

## Contributing

1.  Create a branch for your change.
2.  Keep the existing vanilla HTML/CSS/JavaScript architecture unless a
    migration is intentionally planned.
3.  Test the landing page and dashboard locally.
4.  Test the relevant tool with typical, boundary and invalid values.
5.  Update this README and the AI project context document when features
    or architecture change.

## Project status

Code4Care is a student mini-project / web-based wellness toolkit.
Feature descriptions reflect the public website; implementation details
should be confirmed from the source before being used in a formal
technical report.
