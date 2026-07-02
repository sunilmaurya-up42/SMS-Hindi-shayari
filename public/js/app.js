/**
 * ==========================================
 * SMS Hindi Shayari
 * Main Application Script
 * ==========================================
 */

"use strict";

/* ==========================================
   DOM Ready
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeApp();

});

/* ==========================================
   Initialize
========================================== */

function initializeApp() {

    initializeTooltips();

    initializePopovers();

    initializeLazyImages();

    initializeScrollTop();

    initializeTheme();

}

/* ==========================================
   Bootstrap Tooltips
========================================== */

function initializeTooltips() {

    const tooltips = [].slice.call(

        document.querySelectorAll(

            '[data-bs-toggle="tooltip"]'

        )

    );

    tooltips.forEach((element) => {

        new bootstrap.Tooltip(element);

    });

}

/* ==========================================
   Bootstrap Popovers
========================================== */

function initializePopovers() {

    const popovers = [].slice.call(

        document.querySelectorAll(

            '[data-bs-toggle="popover"]'

        )

    );

    popovers.forEach((element) => {

        new bootstrap.Popover(element);

    });

}

/* ==========================================
   Lazy Images
========================================== */

function initializeLazyImages() {

    const images = document.querySelectorAll(

        "img[data-src]"

    );

    if (!("IntersectionObserver" in window)) {

        images.forEach((img) => {

            img.src = img.dataset.src;

        });

        return;

    }

    const observer = new IntersectionObserver(

        (entries, obs) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {

                    return;

                }

                const image = entry.target;

                image.src = image.dataset.src;

                image.removeAttribute("data-src");

                obs.unobserve(image);

            });

        }

    );

    images.forEach((img) => {

        observer.observe(img);

    });

}
/* ==========================================
   Scroll To Top
========================================== */

function initializeScrollTop() {

    const button = document.getElementById(

        "scrollTopBtn"

    );

    if (!button) {

        return;

    }

    window.addEventListener("scroll", () => {

        if (window.scrollY > 300) {

            button.classList.remove("d-none");

        } else {

            button.classList.add("d-none");

        }

    });

    button.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}

/* ==========================================
   Theme
========================================== */

function initializeTheme() {

    const toggle = document.getElementById(

        "themeToggle"

    );

    if (!toggle) {

        return;

    }

    const currentTheme =

        localStorage.getItem("theme") ||

        "light";

    document.documentElement.setAttribute(

        "data-theme",

        currentTheme

    );

    toggle.addEventListener("click", () => {

        const theme =

            document.documentElement.getAttribute(

                "data-theme"

            ) === "dark"

                ? "light"

                : "dark";

        document.documentElement.setAttribute(

            "data-theme",

            theme

        );

        localStorage.setItem(

            "theme",

            theme

        );

    });

}

/* ==========================================
   Toast Notification
========================================== */

function showToast(

    message,

    type = "success"

) {

    const toast = document.getElementById(

        "appToast"

    );

    if (!toast) {

        return;

    }

    toast.className =

        `toast text-bg-${type}`;

    const body = toast.querySelector(

        ".toast-body"

    );

    if (body) {

        body.textContent = message;

    }

    bootstrap.Toast.getOrCreateInstance(

        toast

    ).show();

}

/* ==========================================
   Auto Close Alerts
========================================== */

document.querySelectorAll(

    ".alert[data-auto-close]"

).forEach((alert) => {

    setTimeout(() => {

        bootstrap.Alert

            .getOrCreateInstance(alert)

            .close();

    }, 5000);

});

/* ==========================================
   Copy To Clipboard
========================================== */

async function copyToClipboard(text) {

    try {

        await navigator.clipboard.writeText(text);

        showToast(

            "Copied to clipboard!"

        );

    } catch (error) {

        console.error(error);

        showToast(

            "Unable to copy text",

            "danger"

        );

    }

}

/* ==========================================
   Native Share
========================================== */

async function shareContent({

    title = document.title,

    text = "",

    url = window.location.href

} = {}) {

    try {

        if (navigator.share) {

            await navigator.share({

                title,

                text,

                url

            });

        } else {

            await copyToClipboard(url);

        }

    } catch (error) {

        console.error(error);

    }

}

/* ==========================================
   Helper
========================================== */

function qs(selector) {

    return document.querySelector(selector);

}

function qsa(selector) {

    return document.querySelectorAll(selector);

}

/* ==========================================
   Global App Object
========================================== */

window.App = {

    copyToClipboard,

    shareContent,

    showToast,

    qs,

    qsa

};

/* ==========================================
   End of File
========================================== */
