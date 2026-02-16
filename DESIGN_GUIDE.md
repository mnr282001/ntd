# Note That Down — Design Guide

Use this as your single source of truth when designing in Figma.

---

## Brand Identity

**Name:** Note That Down
**Tagline:** Plan your day. Drop it in the group chat.
**Logo:** Orange gradient pill with 📝 emoji inside (rounded square, 10px radius at 32px size)
**Personality:** Warm, inviting, social, effortless. Feels like golden hour — the magic time of day when everything looks beautiful.

---

## Color System

### Core Palette

| Token | Hex | Usage |
|---|---|---|
| **Background** | `#FFFDF8` | Page background — warm off-white |
| **Background Warm** | `#FFF8F0` | Secondary background areas |
| **Surface** | `#FFFFFF` | Cards, modals, elevated elements |
| **Surface Dim** | `#F7F3EE` | Muted surface (date inputs, tags) |
| **Surface Hover** | `#F2EDE7` | Hover state for interactive surfaces |

### Text

| Token | Hex | Usage |
|---|---|---|
| **Text** | `#1A1614` | Headings, primary text |
| **Text Secondary** | `#5C534B` | Body copy, descriptions |
| **Text Dim** | `#9C928A` | Labels, metadata, timestamps |
| **Text Faint** | `#C4BBB3` | Placeholders, disabled text, time labels |

### Borders

| Token | Value | Usage |
|---|---|---|
| **Border** | `rgba(28, 22, 16, 0.08)` | Card borders, dividers |
| **Border Hover** | `rgba(28, 22, 16, 0.15)` | Hover/active borders |

### Accent (Brand Orange)

| Token | Hex | Usage |
|---|---|---|
| **Accent** | `#E8590C` | Primary buttons, links, active states |
| **Accent Hover** | `#D04E08` | Button hover |
| **Accent Soft** | `rgba(232, 89, 12, 0.08)` | Badge backgrounds, soft highlights |
| **Accent Glow** | `rgba(232, 89, 12, 0.15)` | Focus rings, ambient glows |
| **Accent Gradient** | `#E8590C → #F97316` | CTA buttons, logo pill, FAB (135deg) |

### Category Colors

Each activity category has a signature gradient (135deg) and a solid color:

| Category | Emoji | Gradient | Solid | Card BG use |
|---|---|---|---|---|
| **Food** | 🍽️ | `#FF6B35 → #FF9A5C` | `#FF6B35` | Timeline blocks, swipe cards |
| **Drinks** | 🍹 | `#F472B6 → #C084FC` | `#F472B6` | Timeline blocks, swipe cards |
| **Activity** | 🎯 | `#6366F1 → #818CF8` | `#6366F1` | Timeline blocks, swipe cards |
| **Outdoors** | 🌿 | `#10B981 → #34D399` | `#10B981` | Timeline blocks, swipe cards |
| **Culture** | 🎨 | `#F59E0B → #FBBF24` | `#F59E0B` | Timeline blocks, swipe cards |
| **Shopping** | 🛍️ | `#EC4899 → #F472B6` | `#EC4899` | Timeline blocks, swipe cards |
| **Transit** | 🚗 | `#64748B → #94A3B8` | `#94A3B8` | Timeline blocks, swipe cards |

### Use Case Card Tints

| Use Case | Background |
|---|---|
| City Day Trips | `#FFF7ED` (warm peach) |
| Date Nights | `#FFF1F2` (soft rose) |
| Friend Hangouts | `#F0F9FF` (light sky) |
| Weekend Getaways | `#F0FDF4` (pale mint) |

### Semantic Colors

| Purpose | Color |
|---|---|
| Success / Copied | `#059669` (green) |
| Destructive / Delete | `#DC2626` (red) |
| Current time indicator | `#E8590C` (accent) |

---

## Typography

### Font Families

| Role | Font | Google Fonts |
|---|---|---|
| **Display** | Bricolage Grotesque | `Bricolage+Grotesque:opsz,wght@12..96,200..800` |
| **Body** | Plus Jakarta Sans | `Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800` |

### Type Scale

| Element | Font | Weight | Size | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| **Hero H1** | Display | 800 | clamp(34px, 6.5vw, 68px) | 1.05 | -0.03em |
| **Section H2** | Display | 800 | clamp(24px, 4vw, 36px) | 1.1 | -0.02em |
| **Card H3** | Display | 700-800 | 17-22px | 1.2 | -0.01em |
| **Plan Name** | Display | 800 | 24px | 1.15 | -0.02em |
| **Swipe Card Title** | Display | 800 | 28px | 1.1 | -0.02em |
| **Section Label** | Body | 700 | 12px | 1.4 | 0.1em (uppercase) |
| **Body** | Body | 400 | 14-15px | 1.55-1.7 | 0 |
| **Body Small** | Body | 500-600 | 12-13px | 1.5 | 0 |
| **Caption** | Body | 600 | 11px | 1.4 | 0 |
| **Button Large** | Display | 700 | 16-17px | 1.2 | -0.01em |
| **Button Small** | Body | 700 | 13px | 1.2 | 0 |
| **Form Label** | Body | 700 | 11px | 1.3 | 0.06em (uppercase) |
| **Input** | Body | 500 | 15px | 1.4 | 0 |

---

## Spacing

Base unit: **4px**

| Token | Value | Common Usage |
|---|---|---|
| xs | 4px | Inner icon gaps |
| sm | 8px | Tight element gaps |
| md | 12-16px | Card padding, section gaps |
| lg | 20-24px | Section padding |
| xl | 28-36px | Card internal padding |
| 2xl | 40-48px | Section vertical padding |
| 3xl | 60-80px | Major section spacing (responsive) |

Page max-widths:
- **Landing page content:** 1080px
- **Plan view (mobile):** 100% (max 540px tablet, 600px desktop, 680px large)
- **Shared card area:** max 700px (mobile), 900px (tablet), 1000px (desktop)
- **Shared card stack:** max 400px (mobile), 480px (tablet), 520px (desktop)

---

## Border Radius

| Token | Value | Usage |
|---|---|---|
| **radius-xs** | 8px | Small buttons, tags, inputs |
| **radius-sm** | 12px | Cards, inputs, dropdowns |
| **radius** | 16px | Large cards, modals |
| **radius-full** | 9999px | Pills, CTA buttons, badges |
| Special: 14px | — | Timeline activity blocks |
| Special: 20px | — | Landing page cards |
| Special: 24px | — | Swipe cards, phone mockup, CTA section |
| Special: 28px | — | Mobile bottom sheet top corners |

---

## Shadows

All shadows use warm-toned `rgba(28, 22, 16, ...)`:

| Token | Value | Usage |
|---|---|---|
| **shadow-xs** | `0 1px 2px rgba(28,22,16,0.04)` | Subtle lift |
| **shadow-sm** | `0 2px 8px rgba(28,22,16,0.06), 0 1px 2px rgba(28,22,16,0.04)` | Cards, buttons |
| **shadow-md** | `0 4px 16px rgba(28,22,16,0.08), 0 2px 4px rgba(28,22,16,0.04)` | Elevated cards, hints |
| **shadow-lg** | `0 8px 32px rgba(28,22,16,0.10), 0 4px 8px rgba(28,22,16,0.05)` | Dropdowns, FAB |
| **shadow-xl** | `0 16px 48px rgba(28,22,16,0.12), 0 8px 16px rgba(28,22,16,0.06)` | Modals, phone mockup, swipe cards |
| **shadow-warm** | `0 8px 32px rgba(232,89,12,0.12)` | Accent buttons, branded elements |

---

## Components

### Buttons

**Primary CTA (large)**
- Background: Accent Gradient (135deg)
- Text: `#FFFFFF`, Display font, weight 700, 16-17px
- Padding: 15-16px vertical, 32-36px horizontal
- Border radius: full (pill)
- Shadow: shadow-warm + shadow-md
- Icon: 16-18px arrow SVG, stroke white, 2.5 strokeWidth

**Primary CTA (small / nav)**
- Background: `#1A1614` (text color)
- Text: `#FFFDF8`, Body font, weight 700, 13px
- Padding: 9px 20px
- Border radius: full (pill)
- Shadow: shadow-sm

**Share Button**
- Background: Accent Gradient
- Text: white, Body font, weight 700, 13px
- Padding: 8px 18px
- Border radius: full (pill)
- Shadow: shadow-warm
- Includes 14px arrow-up-right SVG icon

**Secondary / Copy Link**
- Background: Surface (`#FFFFFF`)
- Border: 1.5px solid border
- Text: Text Secondary, Body font, weight 600, 12px
- Padding: 7px 14px
- Border radius: radius-xs (8px)
- Shadow: shadow-xs

**Category Pill**
- Active: Accent Soft bg, Accent border, Accent text
- Inactive: Surface bg, Border border, Text Secondary text
- Font: Body, weight 600, 13px
- Padding: 8px 16px
- Border radius: full (pill)
- Border: 1.5px

**FAB (Floating Action Button)**
- Size: 56x56px
- Border radius: 18px
- Background: Accent Gradient
- Icon: 24px plus SVG, white, 2.5 strokeWidth
- Shadow: shadow-warm + shadow-lg
- Idle animation: pulse glow (when empty state)

**Arrow Navigation (desktop only)**
- Size: 44x44px circle
- Background: Surface (hover: Accent Soft)
- Border: 1.5px solid border-hover (hover: Accent)
- Icon: 18px chevron SVG
- Shadow: shadow-sm
- Disabled: 40% opacity, surface-dim bg

### Cards

**Landing Feature Card**
- Background: Surface
- Border: 1px solid border
- Border radius: 20px
- Padding: 24px
- Shadow: shadow-sm
- Icon square: 40x40px, category gradient bg, 12px radius, white checkmark SVG

**Landing Use Case Card**
- Background: Tinted (see use case tints above)
- Border: 1px solid border
- Border radius: 20px
- Padding: 24px
- Floating emoji: 32px, with `float` animation

**Landing Step Card**
- Background: Surface
- Border: 1px solid border
- Border radius: 20px
- Padding: 28px
- Shadow: shadow-sm
- Icon: 44x44px rounded square (14px radius), accent-soft bg, accent SVG icon

**Swipe Card (Shared View)**
- Full gradient background (category gradient)
- Border radius: 24px
- Shadow: shadow-xl (top card), shadow-md (stacked)
- Internal padding: 24px 22px
- Decorative: 55% circle blob (rgba white 8%) top-right, 35% circle (rgba black 4%) bottom-left
- Category/time pills: rgba white 18% bg, blur(10px), 12px radius
- Reaction bar: rgba white 12% bg, blur(10px), full radius

**Timeline Activity Block**
- Full gradient background (category gradient)
- Border radius: 14px
- Shadow: `0 4px 16px {color}22` + shadow-sm
- Drag handle: 24x3px white 30% rounded bar, centered top
- Edit/delete: 22x22px circles, rgba white 20%, blur(4px), white SVG icons

### Phone Mockup (Landing Page)

- Max width: 340px
- Background: Surface
- Border: 1px solid border
- Border radius: 24px
- Shadow: shadow-xl
- Padding: 20px 16px
- Fake status bar: 11px bold dim text for time, small rectangles for icons
- Contains mini timeline blocks (12px radius, 10-12px padding)

### Modal / Bottom Sheet

**Mobile:** slides up from bottom
- Top corners: 28px radius
- Background: `#FFFDF8` (bg)
- Border: 1px solid border
- Shadow: shadow-xl
- Handle bar: 36x4px, border-hover color, centered, 8px top margin
- Padding: 8px 20px 36px

**Desktop:** centered dialog
- All corners: 24px radius
- Max width: 480px
- Same styling otherwise

### Navigation Bar (Plan View)

- Sticky top: 0
- Background: `rgba(255, 253, 248, 0.85)` with `blur(20px)` backdrop
- Border bottom: 1px solid border
- Padding: 12px 16px
- Logo: 28x28px gradient pill + 15px Display font brand name

### Badge / Pill (Hero)

- Background: Accent Soft
- Border: 1px solid rgba(232, 89, 12, 0.12)
- Border radius: full
- Padding: 6px 14px 6px 8px
- Contains: 20x20px accent gradient circle with checkmark, 12px bold accent text

### Progress Dots (Shared View)

- Active: 24x8px, accent color
- Visited: 8x8px, rgba accent 25%
- Upcoming: 8x8px, border-hover
- All: 4px border radius
- Gap: 6px

### Reactions

**Reaction Count Pill (on gradient card)**
- Active: rgba white 25% bg, 1.5px white 35% border
- Inactive: rgba black 20% bg, 1.5px white 10% border
- Font: Body, 13px, weight 600, white
- Padding: 5px 11px
- Border radius: full
- Backdrop blur: 4px

**Reaction Picker Bar**
- Background: rgba white 12%, blur(10px)
- Border radius: full
- Padding: 7px 10px
- Emoji size: 21px
- Hover: scale(1.25) with spring easing

### Inputs

- Background: Surface (`#FFFFFF`)
- Border: 1.5px solid border
- Border radius: 12px
- Padding: 13px 16px
- Font: Body, 15px, weight 500
- Focus: Accent border + `0 0 0 3px accent-soft` ring
- Placeholder: Text Faint, weight 400

### CTA Section (Landing Page)

- Background: Text color (`#1A1614`)
- Border radius: 24px
- Decorative gradient blobs inside (orange/peach radial gradients, blurred)
- Text: `#FFFDF8` for heading, 60% opacity for body
- Button: Accent Gradient, `0 4px 20px rgba(232,89,12,0.4)` shadow

---

## Iconography

All icons are inline SVGs with consistent properties:
- **Stroke-based**, not filled
- Stroke width: 2-2.5px (1.5px for decorative/large)
- Stroke linecap: round
- Stroke linejoin: round
- Common sizes: 14px, 16px, 18px, 20px, 24px, 28px

Key icons used:
- **Calendar** (plan step): rect + lines
- **Share** (share step): circles + connecting lines
- **Lightning** (go step): polygon bolt
- **Plus** (FAB): two crossing lines
- **Arrow right** (CTA): line + polyline chevron
- **Arrow up-right** (share button): diagonal line + corner polyline
- **Chevron left/right** (navigation): polyline
- **Edit/pencil**: path-based edit icon
- **X/close**: two crossing diagonal lines
- **Map pin** (location): path + circle
- **Alert circle** (error): circle + lines
- **Checkmark** (badges): polyline

---

## Animation & Motion

### Easing Curves

| Name | Value | Usage |
|---|---|---|
| **ease-out** | `cubic-bezier(0.16, 1, 0.3, 1)` | Most entrances, page transitions |
| **ease-spring** | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy interactions (FAB press, emoji hover) |
| **ease-smooth** | `cubic-bezier(0.4, 0, 0.2, 1)` | Subtle state changes (focus, hover) |

### Entrance Animations

| Animation | Duration | Delay Pattern | Usage |
|---|---|---|---|
| **slideUp** | 0.4-0.7s | Stagger 0.05-0.15s per item | Cards, sections, content entry |
| **slideDown** | 0.5s | 0.2s | Badge pill above hero |
| **fadeIn** | 0.4-1.0s | Varies | Nav, hints, progress dots |
| **scaleIn** | 0.3-0.5s | 0.15s | Card stack, modals (desktop) |
| **float** | 3s infinite | Stagger 0.5s per item | Use case emojis, empty state icon |
| **gradientShift** | 4s infinite | — | Hero gradient text |

### Interaction Feedback

- Button hover: `transform 0.2s ease-out`
- Emoji hover: `scale(1.25)` with spring easing, 0.15s
- Card swipe: direct manipulation (no transition while dragging), 0.4s ease-out snap back
- Card exit: 0.28s smooth ease
- Swipe label rotation: -10deg / +10deg based on direction
- FAB pulse: 2.5s infinite glow animation (empty state only)
- Input focus: 0.2s border + shadow transition

### Splash Screen Sequence

1. **0ms:** Enter phase (everything opacity 0, translated down)
2. **100ms:** Hold phase — elements stagger in:
   - Glow: 0.8s scale from 0.5, ease-out
   - Logo: 0.7s translateY + scale, ease-out, 0.1s delay
   - Brand text: 0.6s translateY, ease-out, 0.2s delay
   - Tagline: 0.5s translateY, ease-out, 0.35s delay
   - Dots: fade in at 0.5s
3. **1400ms:** Exit phase — entire screen fades (0.6s) + slight scale up (1.04)
4. **2000ms:** Remove splash, content slides up (0.6s ease-out)

---

## Responsive Breakpoints

| Breakpoint | Width | Key Changes |
|---|---|---|
| **Mobile** | < 640px | Single column grids, bottom sheet modal, hidden desktop arrows, plan layout 100% width |
| **Tablet** | 640px+ | 3-col steps grid, 2-col features/uses, plan max 540px |
| **Desktop** | 768px+ | Desktop arrows shown, centered modal dialog, plan max 600px with side borders, shared cards bigger |
| **Large** | 1024px+ | 4-col feature/use grids, plan max 680px, shared view horizontal layout (sidebar header + cards) |

---

## Ambient Background

The Shell component renders fixed-position radial gradients behind all content:

1. **Top-right warm glow:** 70vw circle, `rgba(232, 89, 12, 0.05)` center → `rgba(249, 115, 22, 0.02)` → transparent, blur(60px)
2. **Bottom-left cool glow:** 55vw circle, `rgba(99, 102, 241, 0.03)` → transparent, blur(60px)
3. **Center warm wash:** 80vw ellipse, `rgba(251, 191, 36, 0.025)` → transparent, blur(80px)

Plus a subtle **grain texture** overlay on `#root::before` at 30% opacity using an SVG noise filter.

---

## Emoji Reactions

Standard set: 🔥 👀 ✅ 😍 🤔 👎

Displayed at 21px in the picker, 13-14px in count badges.

---

## Key Figma Setup Tips

1. **Create a color styles library** matching every token above
2. **Set up text styles** for each type scale entry
3. **Use Auto Layout** for all card components with the specified padding/gaps
4. **Create component variants** for buttons (primary/secondary/disabled), cards (each category), pills (active/inactive)
5. **Use the actual Google Fonts** — both are free on Google Fonts
6. **Design at 390px width** (iPhone 14) as the primary mobile frame, then adapt to 768px and 1280px
7. **Set corner smoothing to ~60%** on iOS-style rounded rectangles for a more native feel
