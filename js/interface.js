document.addEventListener("DOMContentLoaded", () => {
    const logoText = document.getElementById("logo-text");
    const mobileQuery = window.matchMedia("(max-width: 1023px)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function runLogoAnimation() {
        if (!logoText) return;

        logoText.classList.add("animate-in");

        if (reducedMotionQuery.matches) {
            return;
        }

        const isMobile = mobileQuery.matches;
        const introDelay = isMobile ? 200 : 700;
        const glowHold = isMobile ? 450 : 650;

        setTimeout(() => {
            logoText.classList.add("logo-glow");

            setTimeout(() => {
                logoText.classList.remove("logo-glow");
            }, glowHold);
        }, introDelay);
    }

    runLogoAnimation();

    // --- MOBILE MENU LOGIC ---
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

    function setupAccordion(selector) {
        const cards = document.querySelectorAll(selector);

        cards.forEach((card) => {
            const trigger = card.querySelector(".service-card-trigger");

            if (!trigger) return;

            trigger.addEventListener("click", () => {
                const isOpen = card.classList.contains("is-open");

                cards.forEach((otherCard) => {
                    otherCard.classList.remove("is-open");
                    const otherTrigger = otherCard.querySelector(".service-card-trigger");
                    if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
                });

                if (!isOpen) {
                    card.classList.add("is-open");
                    trigger.setAttribute("aria-expanded", "true");
                }
            });
        });
    }

    setupAccordion(".service-card:not(.faq-card)");
    setupAccordion(".faq-card");

    const serviceMultiselects = document.querySelectorAll("[data-services-multiselect]");

    serviceMultiselects.forEach((multiselect) => {
        const trigger = multiselect.querySelector(".services-multiselect-trigger");
        const valueLabel = multiselect.querySelector(".services-multiselect-value");
        const hiddenInput = multiselect.querySelector('input[type="hidden"][name="services"]');
        const checkboxes = multiselect.querySelectorAll('.services-multiselect-option input[type="checkbox"]');

        if (!trigger || !valueLabel || !hiddenInput || checkboxes.length === 0) return;

        function updateSelection() {
            const selected = Array.from(checkboxes)
                .filter((box) => box.checked)
                .map((box) => box.value);

            hiddenInput.value = selected.join(", ");

            if (selected.length === 0) {
                valueLabel.textContent = "Select one or more services";
                trigger.classList.remove("has-selection");
            } else if (selected.length === 1) {
                valueLabel.textContent = selected[0];
                trigger.classList.add("has-selection");
            } else {
                valueLabel.textContent = `${selected.length} services selected`;
                trigger.classList.add("has-selection");
            }
        }

        function closePanel() {
            multiselect.classList.remove("is-open");
            trigger.setAttribute("aria-expanded", "false");
        }

        trigger.addEventListener("click", () => {
            const isOpen = multiselect.classList.contains("is-open");
            serviceMultiselects.forEach((other) => {
                other.classList.remove("is-open");
                const otherTrigger = other.querySelector(".services-multiselect-trigger");
                if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
            });

            if (!isOpen) {
                multiselect.classList.add("is-open");
                trigger.setAttribute("aria-expanded", "true");
            }
        });

        checkboxes.forEach((box) => {
            box.addEventListener("change", updateSelection);
        });

        multiselect.closest("form")?.addEventListener("submit", updateSelection);

        document.addEventListener("click", (event) => {
            if (!multiselect.contains(event.target)) closePanel();
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closePanel();
        });
    });

    document.querySelectorAll('form[action="https://api.web3forms.com/submit"]').forEach((form) => {
        form.addEventListener("submit", (event) => {
            if (!form.querySelector('.h-captcha[data-captcha="true"]')) return;

            const captchaResponse = form.querySelector('textarea[name="h-captcha-response"]');
            if (captchaResponse && !captchaResponse.value) {
                event.preventDefault();
                alert("Please complete the captcha before sending your message.");
            }
        });
    });
});