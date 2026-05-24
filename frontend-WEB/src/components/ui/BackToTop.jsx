import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./BackToTop.css";

const SCROLL_THRESHOLD = 320;

function BackToTop() {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    toggleVisibility();
    window.addEventListener("scroll", toggleVisibility, { passive: true });

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  useEffect(() => {
    setIsVisible(window.scrollY > SCROLL_THRESHOLD);
  }, [pathname]);

  const handleScrollToTop = () => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <button
      type="button"
      className={`back-to-top ${isVisible ? "is-visible" : ""}`}
      onClick={handleScrollToTop}
      aria-label="Back to top"
      title="Back to top"
    >
      <span className="material-symbols-outlined" aria-hidden="true">
        arrow_upward
      </span>
    </button>
  );
}

export default BackToTop;
