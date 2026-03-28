# Colour Correction Prompt for Claude Code

> Paste the section below the line into Claude Code after the initial build completes.

---

## COLOUR FIX — Match humaintech.ai Brand Identity

The colour scheme in this project is WRONG. It currently uses amber (#F59E0B) as the primary accent on a purple-dark background. It needs to match **humaintech.ai** exactly, where **green (#00FF96) is the primary accent** on a deep dark blue/black background, and amber is only a secondary highlight colour.

### What needs to change

**Replace the entire `:root` CSS variable block in `src/app/globals.css` with these exact values extracted from humaintech.ai:**

```css
:root {
  --bg-deep: #040810;
  --bg-primary: #0A0F1E;
  --bg-card: #0F1528;
  --bg-card-hover: #141B30;
  --border: rgba(0, 255, 150, 0.08);
  --border-hover: rgba(0, 255, 150, 0.2);
  --green: #00FF96;
  --green-mid: #00E68A;
  --green-glow: rgba(0, 255, 150, 0.25);
  --amber: #F59E0B;
  --amber-glow: rgba(245, 158, 11, 0.12);
  --white: #F8FAFC;
  --gray-100: #E2E8F0;
  --gray-300: #94A3B8;
  --gray-500: #64748B;
  --radius: 10px;
  --radius-lg: 14px;
}
```

### Specific corrections across ALL files:

1. **Primary accent colour:** Every use of `#F59E0B` / `var(--accent)` as a PRIMARY element (buttons, CTAs, highlights, headings, borders, glows) must change to `#00FF96` / `var(--green)`. Amber should ONLY be used as a secondary accent (e.g. badges, small highlights, warning states).

2. **Background colours:**
   - Body/page background: `#040810` (was `#0C0A1A`)
   - Main content areas: `#0A0F1E` (was missing)
   - Cards: `#0F1528` (was `#1E1B3A`)
   - Card hover: `#141B30` (was missing)

3. **Border colours:** All borders should use `rgba(0, 255, 150, 0.08)` default and `rgba(0, 255, 150, 0.2)` on hover (green-tinted, not white-tinted).

4. **Glow effects:** Any box-shadows or glow effects should use `rgba(0, 255, 150, 0.25)` not amber.

5. **Text selection:** `::selection` background should be `rgba(0, 255, 150, 0.3)` not amber.

6. **Scrollbar:** Thumb colour should use `#0F1528` and hover `#64748B`.

7. **Tailwind theme mapping** in `@theme inline {}` block must be updated to reference the new variable names.

8. **Component audit:** Search every `.tsx` file for hardcoded amber/accent references and update. Key files to check:
   - `src/components/layout/Header.tsx` (nav links, logo, mobile menu)
   - `src/components/layout/Footer.tsx`
   - `src/components/home/Hero.tsx` (CTA buttons)
   - `src/components/home/Pipeline.tsx` (step indicators)
   - `src/components/home/Problem.tsx` (highlighted column)
   - `src/components/home/Stats.tsx` (stat values)
   - `src/components/home/Verticals.tsx` (feature cards)
   - `src/components/home/CTASection.tsx` (buttons)
   - All page route files

### Design intent:
- **Green (#00FF96)** = energy, technology, "go" — the primary brand colour of HumAIn Technologies
- **Amber (#F59E0B)** = warmth, secondary highlights only — used sparingly for contrast
- **Deep dark backgrounds** = premium, cinematic tech feel

### After fixing:
- Run `npm run build` to verify no errors
- Visually check that the site feels like humaintech.ai — dark, green-accented, premium tech aesthetic
- Ensure green glows and borders create the signature HumAIn look
