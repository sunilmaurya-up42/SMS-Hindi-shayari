/**
 * ==========================================================
 * SMS Hindi Shayari
 * Lazy Load Images
 * ==========================================================
 */

"use strict";

const LazyLoad = {

    observer: null,

    init() {

        const images = document.querySelectorAll(
            "img[data-src], img.lazy"
        );

        if (!images.length) return;

        if (!("IntersectionObserver" in window)) {

            images.forEach(img => this.loadImage(img));
            return;

        }

        this.observer = new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    this.loadImage(entry.target);

                    this.observer.unobserve(entry.target);

                });

            },

            {
                root: null,
                rootMargin: "100px",
                threshold: 0.1
            }

        );

        images.forEach(img => {

            this.observer.observe(img);

        });

    },

    loadImage(img) {

        const src = img.dataset.src;

        if (src) {

            img.src = src;

            img.removeAttribute("data-src");

        }

        img.classList.remove("lazy");

        img.classList.add("lazy-loaded");

        img.onload = () => {

            img.classList.add("fade-in");

        };

    }

};

document.addEventListener("DOMContentLoaded", () => {

    LazyLoad.init();

});
