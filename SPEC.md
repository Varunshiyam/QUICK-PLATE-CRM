# SPECIFICATION: Top-Level Error Boundary Integration

Status: **FINALIZED**
Version: 1.0.0
Author: Antigravity AI
Date: 2026-05-18

---

## 1. Problem Statement
Unexpected runtime JavaScript errors in nested React components cause the entire Quick Plate CRM application to crash, presenting users with a blank screen ("white screen of death"). This degrades the user experience (UX) and decreases application resilience.

## 2. Proposed Solution
Implement a top-level `ErrorBoundary` React component:
- **Type**: Custom React Class Component (avoiding external packages to prevent React 19 compatibility/version issues).
- **Placement**: Wraps the core layout/routing inside App.jsx to gracefully catch UI errors.
- **Fallback UI**: A visually stunning, responsive, mobile-first design styled to match the CRM's existing brand guidelines.
- **Recovery Actions**:
  1. **Reload Application**: A primary action button to trigger a page refresh.
  2. **Return to Home**: A secondary action link to navigate back to the landing/home page.
- **Developer Debugging**: A collapsible, styled details panel containing the error message and component stack trace, visible in both production and development (with clear separation) to assist with debugging.

## 3. Architecture & File Structure

We will create a new directory for the Error Boundary:
- `src/components/ErrorBoundary/ErrorBoundary.jsx` - The main Error Boundary component.
- `src/components/ErrorBoundary/ErrorBoundary.css` - Custom styles for the fallback UI, leveraging global CSS variables.

## 4. Visual Design System Integration
The fallback UI will use design tokens from global.css:
- **Primary Color**: `var(--color-primary)` (`#fb7e18`) with primary hover states.
- **Background**: `var(--color-bg)` (`#FDFCFB`).
- **Text Styles**:
  - Fonts: `var(--font-display)` (Epilogue) for headings, `var(--font-sans)` (Outfit) for body/button text.
  - Colors: `var(--color-secondary)` (`#2D3134`) for body, `var(--color-gray-600)` for subtexts.
- **Layout**: Bound by `--max-width: 480px` to maintain a consistent card/mobile view centered on desktop screens.

## 5. Technical Requirements (React 19 Compatibility)
Since React 19 does not support hooks for catching render errors, we implement `ErrorBoundary` as a standard React Class Component.
```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }
}
```

## 6. Implementation Plan
- **Step 1**: Create `SPEC.md` (GSD step: Planning and spec lock) - *Complete*
- **Step 2**: Initialize `STATE.md` to track persistent memory and progress.
- **Step 3**: Implement `ErrorBoundary.css` with a high-fidelity, polished, responsive visual design.
- **Step 4**: Implement `ErrorBoundary.jsx` Class Component with fallback UI, reload button, home button, and a toggleable detail view for error stack traces.
- **Step 5**: Integrate `ErrorBoundary` inside `src/App.jsx`.
- **Step 6**: Test the implementation by triggering a mock runtime error.
- **Step 7**: Verify empirical correctness, write final documentation, and commit the changes.
