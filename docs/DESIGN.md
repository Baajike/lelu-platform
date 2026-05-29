# Design System

The visual language. Everything is inline style — there is no theme provider, no design tokens object, no Tailwind. This doc is the *de facto* spec: copy from here when adding new UI.

## Brand

LELU positions itself as institutional / restrained. The dashboard uses navy + white as the primary palette with a small accent set for state. No gradients, no shadows that compete with content. Logo is a circular CSA emblem inside a white disc; the disc against a navy background is the signature header treatment.

## Color palette

### Core

| Token | Hex | Used for |
|---|---|---|
| Navy | `#0B1F3A` | Primary brand, dark backgrounds, headers, modal close-cases CTA |
| Blue | `#1A5FA8` | Primary action (CTAs, links, focus rings, accent borders) |
| Blue (deep) | `#154d8a` | Hover state for blue buttons |
| Blue (panel bg) | `#112847` | Sidebar active item background |
| Slate | `#4E6478` | Secondary text on dark backgrounds |
| Gray | `#8FA3BB` | Tertiary text, captions, placeholders |
| Light gray | `#A8BFCF` | Disabled state, dim text |
| Border gray | `#E2E8F0` | Card borders, dividers |
| Subtle bg | `#EEF2F7` | Background fills, badge backgrounds |
| Page bg | `#F7F9FC` | Default page background, hover row state |

### Semantic / status

| State | Foreground | Background |
|---|---|---|
| Success (Active, Accepted, Received) | `#1A7A4A` | `#E6F5EE` |
| Warning (Pending, stale, attention) | `#D4730A` | `#FEF3E2` |
| Caution (warm warning, soft) | `#8A5200` | `#FEF9E7` (border `#F5D79E`) |
| Danger (Declined, Closed reason, Delete, errors) | `#C0392B` | `#FDECEA` (border `#F5C6C2`) |
| Closed / inactive | `#4E6478` | `#EEF2F7` |
| Brutal danger (icons) | `#7D1616` | — |

### Category accents (used on dashboard heatmap and case badges)

| Category | Color |
|---|---|
| Electronic Fraud | `#C0392B` |
| Cyberstalking | `#D4730A` |
| Computer Access Offences | `#1A5FA8` |
| Child Exploitation | `#7D1616` |
| Identity Related Crimes | `#6B3FA0` |
| Data Interference | `#1A7A4A` |
| System Interference | `#0B6B7A` |
| Critical Infrastructure Attacks | `#5D2E8C` |
| Other | `#8FA3BB` |

### Role color (chip backgrounds)

| Role | bg | fg |
|---|---|---|
| HEAD_OF_UNIT | `#FEF3E2` | `#D4730A` |
| SUPERVISOR | `#F3EDFC` | `#6B3FA0` |
| OFFICE_ADMINISTRATOR | `#EBF3FB` | `#1A5FA8` |
| OFFICER | `#E6F5EE` | `#1A7A4A` |
| ADMIN | `#FDECEA` | `#C0392B` |
| Fallback | `#EEF2F7` | `#4E6478` |

## Typography

- **Font stack**: `'Segoe UI', sans-serif`. Set inline on every container.
- No external font load — relies on the system Segoe UI on Windows / falls back on other platforms.
- **Weights used**: 400 (body), 500 (mild emphasis), 600 (labels, buttons), 700 (titles, badges), 800 (numeric heroes, page titles, stat numbers).
- **Letter spacing**: `0.04em`–`0.18em` for UPPERCASE labels and badges. Body text is default tracking.

### Size scale (px, no rem)

| Use | Size |
|---|---|
| Splash hero title | 42 |
| Big stat number | 36 |
| Stat number medium | 32 / 20 |
| Page H1 | 22 |
| Section H2 | 16 |
| Section title | 13 |
| Body | 13 |
| Secondary body | 12 |
| Caption | 11 |
| Label / micro caption | 10 |
| Smallest UPPERCASE label | 9 |

## Spacing

- **Page padding**: 32 px on `/dashboard/*` page content.
- **Card padding**: 18–22 px vertical, 22–28 px horizontal.
- **Sidebar width**: 240 px.
- **Top bar height**: 60 px.
- **Modal width**: 440–520 px (480 default).
- **Modal padding**: 36 × 40 px.
- **Borders**: `1.5px solid #E2E8F0` for inputs, `1px solid #E2E8F0` for cards, `1px solid #EEF2F7` for inner dividers.

## Border radius

- `4` for buttons and inputs.
- `5` for nav items.
- `6` for cards, modals.
- `20` for chip-style assignment / officer pills.
- `50%` for avatars.

## Component patterns

### Primary button

```jsx
<button style={{
  background: "#1A5FA8", color: "white", border: "none",
  padding: "10px 22px", borderRadius: 4, fontSize: 12,
  fontWeight: 600, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif",
  letterSpacing: "0.05em",
}}>Action</button>
```

Hover: darken to `#154d8a` (set via `onMouseEnter`/`onMouseLeave`).

### Destructive button

Same shape but `background: "#C0392B"`.

### Outline button (cancel)

```jsx
{ background: "white", border: "1px solid #E2E8F0", color: "#4E6478" }
```

### Outline destructive

```jsx
{ background: "white", border: "1px solid #C0392B", color: "#C0392B" }
```

(See the Delete Case button on the case detail page.)

### Status badge

```jsx
<span style={{
  background: <stateBg>, color: <stateFg>,
  fontSize: 10, fontWeight: 700,
  padding: "4px 12px", borderRadius: 3,
  letterSpacing: "0.06em", textTransform: "uppercase",
}}>{status}</span>
```

### Card

```jsx
<div style={{
  background: "white", borderRadius: 6, border: "1px solid #E2E8F0",
  boxShadow: "0 1px 6px rgba(11,31,58,0.06)",
  overflow: "hidden",
}}>
  <div style={{ padding: "18px 24px", borderBottom: "1px solid #EEF2F7" }}>
    {/* header */}
  </div>
  <div>{/* body */}</div>
</div>
```

### Stat card

White card with a 3 px top accent border in the metric's color, label uppercase + tracked, value 32–36 px bold navy, subline 11 px gray.

### Modal

```jsx
<div style={{
  position: "fixed", inset: 0,
  background: "rgba(11,31,58,0.6)", backdropFilter: "blur(4px)",
  zIndex: 100,
  display: "flex", alignItems: "center", justifyContent: "center",
}}>
  <div style={{
    background: "white", borderRadius: 6,
    padding: "36px 40px", width: 480,
    boxShadow: "0 24px 64px rgba(11,31,58,0.25)",
  }}>
    {/* header: title + X */}
    {/* body */}
    {/* footer: Cancel + Confirm */}
  </div>
</div>
```

### Input

```jsx
<input className="input-field" />
```

CSS defined once per page in an inline `<style>` block:

```css
.input-field {
  width: 100%; border: 1.5px solid #E2E8F0; border-radius: 4px;
  padding: 11px 14px; font-size: 13px; color: #0B1F3A;
  outline: none; box-sizing: border-box; font-family: 'Segoe UI', sans-serif;
  transition: border-color 0.2s; background: white;
}
.input-field:focus { border-color: #1A5FA8; }
.input-field::placeholder { color: #A8BFCF; }
```

### Avatar pill

Circle with initial(s):
- 28 × 28 for inline rows, 14 px bold white text, navy or blue bg.
- 34 × 34 for list items.
- 40 × 40 for approval cards.
- 140 × 140 white disc with logo image on splash.

### Notification panel item

Compact rows with a colored dot indicator, a small icon, a 12 px label, a 10–11 px subline in gray, and a chevron on the right. Hover row turns `#F7F9FC`.

## Animation

Defined inline per page where needed:

| Name | Use |
|---|---|
| `lelu-spin` | Spinner: 3 px ring, navy top, 700 ms infinite linear |
| `fadeInPage` | Page content fade on route change (400 ms cubic-bezier(.4,0,.2,1)) |
| `slideInLeft` | Sidebar item entrance (cascaded by `0.06 s * index`) |
| `dropIn` | Notification panel pop (180 ms scale + translate) |
| `fadeUp` | Splash page sequence (chained over ~1 s) |

Hover transitions use 0.15–0.2 s linear or ease. No spring physics.

## Empty states

Consistent pattern:
- 32–40 px tinted icon (gray/blue/orange/green at low opacity).
- 13 px label gray.
- 11 px sub-label very-light-gray.
- Centered, 48–60 px vertical padding.

## Iconography rules

- `lucide-react` only. Never bring in another icon set.
- 13–18 px in compact contexts (rows, badges).
- 28–40 px in hero / empty-state contexts.
- `strokeWidth` 1.8 for outline use, 2 / 2.5 for emphasis (e.g., warning bell, check marks).

## Accessibility notes (current state)

Honest assessment of where the design system today does not meet WCAG comfortably:

- No focus-visible styles besides the input border-color shift.
- `cursor: pointer` is used to signal clickability but not every clickable region is keyboard-reachable.
- Color contrast is generally fine for body text but some `#8FA3BB` on white captions sit at ~3.5:1, below 4.5:1.
- No skip links.
- Form labels are visible text, but the `<label>` element isn't always paired with `htmlFor` / `id`.

These are tracked in `SECURITY_CHECKLIST.md` under "still needed" (accessibility audit).

## When extending

- Don't introduce a new color. Reuse the palette above.
- Don't introduce a new font weight outside {400, 500, 600, 700, 800}.
- Don't introduce a new border radius. Pick from {4, 5, 6, 20, 50%}.
- Don't switch to Tailwind classes for a single component.
- New buttons inherit the canonical pattern above.
