---
description: EcoShoppr Frontend UI & Styling Standards
---

# Frontend UI & Styling Standards

This skill defines the technical styling guidelines for the EcoShoppr web app. 
**CRITICAL:** The EcoShoppr brand is defined by a "WOW" factor. The UI must look like a premium, modern application, not a generic minimum viable product.

## 1. Core Aesthetic Principles
- **Glassmorphism:** Use semi-transparent backgrounds with background blur (e.g., `backdrop-filter: blur(10px)`) for cards, modals, and sticky navbars to create depth.
- **Dark Theme Default:** The application is primarily dark-themed. Use deep, rich off-backs (e.g., `#121212`, `#1e1e1e`) rather than stark `#000000`. 
- **Typography:** Use modern, clean sans-serif fonts. `Inter` or `Outfit` are preferred. Do not use browser default fonts.
- **Color Palette:** Avoid harsh, generic colors (e.g., standard red `red`, blue `blue`). Use tailored HSL values. Primary accents should be vibrant (often neon greens/teals to represent "Eco").

## 2. Technical Implementation
- **Vanilla CSS:** We use strictly Vanilla CSS (`index.css` and CSS modules). **Do not use TailwindCSS or component libraries** unless explicitly requested by the user.
- **CSS Variables:** Define heavily used colors, radiuses, and spacing in `:root` variables to ensure consistency across the app.
  ```css
  :root {
    --bg-main: #121212;
    --card-bg: rgba(30, 30, 30, 0.6);
    --accent-green: #00ff88;
    --border-radius-lg: 16px;
    --transition-standard: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  ```

## 3. Interactivity & Micro-animations
Static pages are unacceptable. The app must feel alive.
- **Hover States:** All interactive elements (buttons, cards) must have smooth hover transitions (scale up slightly, increase brightness, or shift a gradient).
- **Loading States:** Use skeleton loaders or smooth, custom CSS spinners instead of generic "Loading..." text.
- **Transitions:** Use `cubic-bezier` for fluid, non-linear animations.

## 4. Icons & Imagery
- **SVG Icons:** Replace any temporary emoji placeholders with high-quality, custom SVG icons. Ensure `fill` or `stroke` colors inherit from the parent text color (using `currentColor`) or utilize the accent variables.
- **Images:** Any product imagery should be high quality, scaled properly with `object-fit: cover`, and feature subtle border radii matching the design system.
