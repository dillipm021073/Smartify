# Design Guidelines: Smartify SIM with Device Platform

## Design Approach: Material Design System

**Rationale**: This application is utility-focused, information-dense, and form-heavy with critical emphasis on mobile usability. Material Design provides optimal touch-friendly components, proven form patterns, and clear visual hierarchy essential for multi-step transactional flows.

**Reference Inspiration**: Google's Material Design 3, with elements from banking apps like Chase Mobile and Revolut for trust-building and form efficiency.

---

## Typography System

### Font Family
- Primary: **Roboto** (via Google Fonts CDN)
- Fallback: system-ui, -apple-system, sans-serif

### Type Scale
- **Headings**:
  - H1: 32px/40px, font-weight: 700 (Page titles, step headers)
  - H2: 24px/32px, font-weight: 600 (Section titles)
  - H3: 20px/28px, font-weight: 600 (Subsection headers)
  - H4: 18px/24px, font-weight: 500 (Card titles)

- **Body Text**:
  - Large: 16px/24px, font-weight: 400 (Primary content, form labels)
  - Regular: 14px/20px, font-weight: 400 (Supporting text, descriptions)
  - Small: 12px/16px, font-weight: 400 (Captions, helper text, validation messages)

- **Interactive Elements**:
  - Buttons: 16px, font-weight: 500, uppercase letter-spacing: 0.5px
  - Links: 14px, font-weight: 500, underline on hover

---

## Layout System & Spacing

### Tailwind Spacing Primitives
Use consistent 8px base unit: **2, 4, 6, 8, 12, 16, 20, 24**
- Micro spacing (form elements): p-2, p-4, gap-2
- Component spacing: p-6, p-8, gap-6
- Section spacing: py-12, py-16, py-20

### Grid System
- **Mobile (< 768px)**: Single column, max-w-full with px-4 container padding
- **Tablet (768px - 1024px)**: max-w-2xl centered, px-6 container padding
- **Desktop (> 1024px)**: max-w-4xl centered, px-8 container padding

### Container Hierarchy
```
Outer wrapper: min-h-screen with padding
Main container: max-w-4xl mx-auto
Content sections: p-6 md:p-8
Cards/Panels: p-6 rounded-lg elevation
Form groups: space-y-6
Input groups: space-y-4
```

---

## Core Components

### 1. Progress Stepper
- **Top-fixed bar** showing "Step X of 7"
- Linear progress indicator showing completion percentage
- Step labels hidden on mobile, visible on tablet+
- Visual states: completed (checkmark), active (filled), upcoming (outlined)
- Height: 80px on mobile, 100px on tablet+

### 2. Form Components

**Text Inputs**:
- Floating labels that animate on focus/content
- Full-width on mobile, strategic grouping on tablet+
- Height: 56px (Material Design standard)
- Border radius: 8px
- Clear error/success states with icon indicators
- Helper text: 12px below input

**Dropdown Selects**:
- Cascading pattern for Province → City → Barangay
- Search functionality for long lists
- Mobile: Bottom sheet picker
- Desktop: Dropdown with max-height scroll

**File Upload Areas**:
- Dual-action buttons: "Choose from Gallery" | "Take Photo"
- Large touch targets (min 48px height)
- Image preview thumbnails (120px × 120px) with delete action
- Upload progress indicator
- File size/type restrictions clearly displayed

**Radio/Checkbox Groups**:
- Minimum 48px touch target
- Clear visual hierarchy with indentation
- Group labels in H4 style
- Required indicators (asterisk)

### 3. Digital Signature Canvas
- Full-width canvas with 16:9 aspect ratio
- Clear background with dotted line indicator
- Action buttons: "Clear" (outline) | "Accept" (filled)
- Touch-optimized with palm rejection
- Mobile: Force landscape orientation hint

### 4. Cards & Panels

**Summary Card** (Cart/Payment):
- Sticky positioning on desktop, inline on mobile
- Elevation: shadow-lg
- Line items with pricing breakdown
- Total with visual emphasis (larger text, bold)
- Padding: p-6

**Collapsible Sections** (Review Page):
- Accordion pattern with chevron indicators
- Section headers: H3 with expand/collapse icon
- Smooth height transitions
- Maintain state across interactions
- Dividers between sections

**Product Cards**:
- Image (aspect-ratio 3:2)
- Title, pricing, key features
- CTA button at bottom
- Hover state: subtle elevation increase

### 5. Navigation & Headers

**Customer Portal Header**:
- Fixed top position
- Logo left, progress indicator center (tablet+)
- Height: 64px
- Shadow on scroll

**Agent Portal Header**:
- Logo, search bar (tablet+), user menu
- Secondary navigation tabs below
- Height: 72px

**Mobile Navigation**:
- Bottom-fixed for customer portal (rare usage)
- Hamburger menu for agent portal

### 6. Modals & Overlays

**OTP Modal**:
- Centered on screen
- 6 separate input boxes (48px × 48px each)
- Auto-focus progression
- Countdown timer prominent
- Resend link after expiry

**Confirmation Dialogs**:
- Max-width: 400px
- Clear title, message, two-action layout
- Primary action right-aligned

### 7. Status Indicators

**Application Status Badges**:
- Pill shape, uppercase text
- Icons + text on desktop, icon only on mobile
- States: Pending, In Review, Approved, Rejected
- Size: px-3 py-1, text-xs

**Validation States**:
- Success: Checkmark icon, supporting text
- Error: X icon, error message, field highlight
- Loading: Spinner with "Processing..." text

### 8. Buttons

**Hierarchy**:
- Primary: Filled, high emphasis (Submit, Continue, Approve)
- Secondary: Outlined, medium emphasis (Cancel, Back)
- Tertiary: Text-only, low emphasis (Skip, Learn More)

**Sizing**:
- Large (mobile CTAs): h-14, text-base
- Medium (standard): h-12, text-sm
- Small (inline actions): h-10, text-sm

**Full-width on mobile**, auto-width on tablet+

---

## Responsive Patterns

### Mobile-First Breakpoints
- **Mobile (base)**: Stack all elements vertically, full-width components
- **Tablet (md: 768px)**: Two-column forms where logical, sidebar summary visible
- **Desktop (lg: 1024px)**: Optimal form width with sidebars, multi-column review

### Touch Targets
- Minimum 48px × 48px for all interactive elements
- Adequate spacing (8px minimum) between touch targets
- Large form inputs (56px height)

### Form Optimization
- **Mobile**: Single column, floating labels, native pickers
- **Tablet+**: Strategic grouping (First Name | Last Name in row), inline labels

---

## Interaction Patterns

### Loading States
- Skeleton screens for data-heavy pages
- Inline spinners for form submissions
- Full-screen loader for navigation transitions
- Disable buttons during async operations

### Error Handling
- Inline validation on blur
- Summary error panel at top of form (if multiple errors)
- Toast notifications for system errors
- Retry mechanisms with clear actions

### Success Feedback
- Checkmark animations for step completion
- Success modal for final submission
- Confirmation page with Cart ID and next steps
- Subtle haptic feedback (mobile)

---

## Special Considerations

### Document Upload Flow
1. ID Type selection (radio group)
2. Dual upload areas: Front | Back
3. Camera integration with orientation guide overlay
4. Preview with re-capture option
5. Compression before upload

### Address Cascade
- Disable dependent fields until parent selected
- Loading state in dropdowns during fetch
- Preserve selections on back navigation
- Auto-populate zip code (non-editable)

### Agent Portal Differences
- **Dense data tables** on desktop (not on mobile)
- **Search-first interaction**: Prominent search bar
- **Application detail**: Split view on desktop, full-page on mobile
- **Action panel**: Sticky bottom on mobile, sidebar on desktop

---

## Accessibility Standards
- WCAG 2.1 AA compliance
- Focus indicators on all interactive elements
- Proper heading hierarchy
- Form labels associated with inputs
- Error messages in aria-live regions
- Keyboard navigation support
- Screen reader announcements for dynamic content

---

## Images

### Product Images
- High-quality device photos on white background
- Aspect ratio: 3:2 or 1:1 for consistency
- Multiple angles in product detail view
- Lazy loading for performance

### Placeholder Usage
- ID document placeholder with example
- Profile placeholder for agents
- Empty state illustrations for lists/tables

**No hero images required** - this is a utility application focused on efficiency over visual storytelling.