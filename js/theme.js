/**
 * theme.js
 * --------
 * 1. Reads saved theme from localStorage and applies it immediately
 *    (this runs inline in <head> before DOM paint — no flash).
 * 2. Wires the toggle button after DOMContentLoaded.
 * 3. Re-triggers the header colour after each theme switch.
 */

/* ── Apply saved theme BEFORE first paint ─────────────────── */
(function () {
    var saved = localStorage.getItem('itco-theme') || 'light';
    if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();

/* ── Wire toggle button after DOM is ready ────────────────── */
document.addEventListener('DOMContentLoaded', function () {

    var checkbox = document.getElementById('theme-checkbox');
    if (!checkbox) return;

    /* Sync checkbox to current state */
    checkbox.checked = (document.documentElement.getAttribute('data-theme') === 'dark');

    checkbox.addEventListener('change', function () {
        var isDark = checkbox.checked;
        var theme  = isDark ? 'dark' : 'light';

        /* Apply theme */
        document.documentElement.setAttribute('data-theme', theme);

        /* Persist */
        localStorage.setItem('itco-theme', theme);

        /* Pulse animation */
        var toggle = checkbox.closest('.theme-toggle');
        if (toggle) {
            toggle.classList.remove('pulse');
            void toggle.offsetWidth; /* force reflow */
            toggle.classList.add('pulse');
        }

        /* Update header background immediately if it was already coloured
           by the jQuery scroll handler in main.js */
        updateHeaderBg(isDark);
    });

    /* ── Sync header colour on load ──────────────────────────── */
    /* main.js uses jQuery to set header bg on scroll. After a theme
       switch we must re-apply it with the right colour. */
    function updateHeaderBg(isDark) {
        var header = document.querySelector('.header');
        if (!header) return;
        var inlineBg = header.style.background || header.style.backgroundColor;
        /* Only override if main.js has already applied a solid background */
        if (inlineBg && inlineBg !== 'none' && inlineBg !== '') {
            header.style.background = isDark ? '#0a1628' : '#002e5f';
        }
    }

    /* Run once on load to handle already-scrolled pages */
    updateHeaderBg(checkbox.checked);
});
