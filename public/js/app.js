/**
 * ==========================================================
 * SMS Hindi Shayari
 * Global App JavaScript
 * ==========================================================
 */

"use strict";

const SMS = {

    init() {
        this.bindEvents();
        this.autoHideAlerts();
        this.copyButtons();
        this.backToTop();
        this.lazyImages();
    },

    bindEvents() {

        document.addEventListener("click", (e) => {

            if (e.target.matches("[data-copy]")) {

                this.copyText(e.target);

            }

        });

    },

    async copyText(button) {

        try {

            const selector = button.dataset.copy;
            const element = document.querySelector(selector);

            if (!element) return;

            await navigator.clipboard.writeText(element.innerText.trim());

            const oldText = button.innerText;

            button.innerText = "Copied ✓";

            setTimeout(() => {

                button.innerText = oldText;

            }, 2000);

        } catch (err) {

            console.error(err);

        }

    },

    autoHideAlerts() {

        document.querySelectorAll(".alert").forEach(alert => {

            setTimeout(() => {

                alert.style.opacity = "0";

                setTimeout(() => {

                    alert.remove();

                }, 500);

            }, 5000);

        });

    },

    backToTop() {

        const btn = document.getElementById("backToTop");

        if (!btn) return;

        window.addEventListener("scroll", () => {

            btn.style.display =
                window.scrollY > 300 ? "block" : "none";

        });

        btn.addEventListener("click", () => {

            window.scrollTo({

                top: 0,
                behavior: "smooth"

            });

        });

    },

    lazyImages() {

        const images = document.querySelectorAll("img[data-src]");

        if (!("IntersectionObserver" in window)) {

            images.forEach(img => {

                img.src = img.dataset.src;

            });

            return;

        }

        const observer = new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const img = entry.target;

                img.src = img.dataset.src;

                img.removeAttribute("data-src");

                observer.unobserve(img);

            });

        });

        images.forEach(img => observer.observe(img));

    }

};

document.addEventListener("DOMContentLoaded", () => {

    SMS.init();

});
