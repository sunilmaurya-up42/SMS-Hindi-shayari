/**
 * ==========================================
 * SMS Hindi Shayari
 * Theme Manager
 * ==========================================
 */

"use strict";

/* ==========================================
   Constants
========================================== */

const THEME_KEY = "sms-theme";

const DEFAULT_THEME = "light";

/* ==========================================
   DOM Ready
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeTheme();

});

/* ==========================================
   Initialize Theme
========================================== */

function initializeTheme() {

    const savedTheme =

        localStorage.getItem(THEME_KEY) ||

        DEFAULT_THEME;

    applyTheme(savedTheme);

    bindThemeToggle();

}

/* ==========================================
   Apply Theme
========================================== */

function applyTheme(theme) {

    document.documentElement.setAttribute(

        "data-theme",

        theme

    );

    document.body.setAttribute(

        "data-theme",

        theme

    );

    localStorage.setItem(

        THEME_KEY,

        theme

    );

    updateThemeIcon(theme);

}

/* ==========================================
   Toggle Theme
========================================== */

function toggleTheme() {

    const currentTheme =

        document.documentElement.getAttribute(

            "data-theme"

        ) || DEFAULT_THEME;

    const nextTheme =

        currentTheme === "dark"

            ? "light"

            : "dark";

    applyTheme(nextTheme);

}
/* ==========================================
   Bind Theme Toggle
========================================== */

function bindThemeToggle() {

    const toggleButton = document.getElementById(

        "themeToggle"

    );

    if (!toggleButton) {

        return;

    }

    toggleButton.addEventListener(

        "click",

        toggleTheme

    );

}

/* ==========================================
   Update Theme Icon
========================================== */

function updateThemeIcon(theme) {

    const icon = document.querySelector(

        "#themeToggle i"

    );

    if (!icon) {

        return;

    }

    icon.classList.remove(

        "fa-sun",

        "fa-moon"

    );

    icon.classList.add(

        theme === "dark"

            ? "fa-sun"

            : "fa-moon"

    );

}

/* ==========================================
   Detect System Theme
========================================== */

function getSystemTheme() {

    return window.matchMedia(

        "(prefers-color-scheme: dark)"

    ).matches

        ? "dark"

        : "light";

}

/* ==========================================
   Listen For System Theme Change
========================================== */

const mediaQuery = window.matchMedia(

    "(prefers-color-scheme: dark)"

);

mediaQuery.addEventListener(

    "change",

    (event) => {

        if (

            !localStorage.getItem(THEME_KEY)

        ) {

            applyTheme(

                event.matches

                    ? "dark"

                    : "light"

            );

        }

    }

);
/* ==========================================
   Reset Theme
========================================== */

function resetTheme() {

    localStorage.removeItem(

        THEME_KEY

    );

    applyTheme(

        getSystemTheme()

    );

}

/* ==========================================
   Current Theme
========================================== */

function getCurrentTheme() {

    return document.documentElement.getAttribute(

        "data-theme"

    ) || DEFAULT_THEME;

}

/* ==========================================
   Global Theme Object
========================================== */

window.Theme = {

    apply: applyTheme,

    toggle: toggleTheme,

    reset: resetTheme,

    current: getCurrentTheme,

    system: getSystemTheme

};

/* ==========================================
   End of File
========================================== */
