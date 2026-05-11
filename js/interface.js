document.addEventListener("DOMContentLoaded", () => {
            
    // --- 1. LOGO ANIMATION SEQUENCE (SLIDING EFFECT) ---
    const logoText = document.getElementById("logo-text");
    const drops = document.querySelectorAll(".drop");
    
    if (logoText && drops.length > 0) {
        const isMobile = window.matchMedia("(max-width: 767px)").matches;
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const initialDelay = prefersReducedMotion ? 0 : isMobile ? 220 : 1500;
        const holdBeforeCollapse = prefersReducedMotion ? 0 : isMobile ? 200 : 800;
        const glowClearDelay = prefersReducedMotion ? 0 : isMobile ? 450 : 800;

        setTimeout(() => {
            if (!prefersReducedMotion) {
                logoText.classList.add("logo-glow");
                logoText.style.transform = "scale(1.05)";
            }

            setTimeout(() => {
                drops.forEach((drop) => drop.classList.add("collapsed"));

                setTimeout(() => {
                    logoText.classList.remove("logo-glow");
                    logoText.style.transform = "scale(1)";
                }, glowClearDelay);
            }, holdBeforeCollapse);
        }, initialDelay);
    }

    // --- 2. MOBILE MENU LOGIC ---
    const menuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    
    if (menuBtn && mobileMenu) {
        const lines = menuBtn.querySelectorAll("div");
        const mobileLinks = document.querySelectorAll(".mobile-link");

        function toggleMenu() {
            const isOpen = mobileMenu.style.opacity === "1";
            
            if (isOpen) {
                // Close Menu
                mobileMenu.style.opacity = "0";
                mobileMenu.style.pointerEvents = "none";
                menuBtn.setAttribute("aria-expanded", "false");
                document.body.style.overflow = "";
                lines[0].style.transform = "rotate(0)";
                lines[1].style.opacity = "1";
                lines[2].style.transform = "rotate(0)";
            } else {
                // Open Menu
                mobileMenu.style.opacity = "1";
                mobileMenu.style.pointerEvents = "auto";
                menuBtn.setAttribute("aria-expanded", "true");
                document.body.style.overflow = "hidden";
                lines[0].style.transform = "rotate(45deg)";
                lines[1].style.opacity = "0";
                lines[2].style.transform = "rotate(-45deg)";
            }
        }

        menuBtn.addEventListener("click", toggleMenu);
        mobileLinks.forEach(link => link.addEventListener("click", toggleMenu));
    }
});