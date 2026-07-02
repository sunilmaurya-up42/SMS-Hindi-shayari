/**
 * ==========================================
 * SMS Hindi Shayari
 * Main Frontend Script
 * ==========================================
 */

"use strict";

/* ==========================================
   DOM Ready
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeSearch();

    initializeCopyButtons();

    initializeShareButtons();

    initializeLikeButtons();

    initializeDownloadButtons();

});

/* ==========================================
   Search
========================================== */

function initializeSearch() {

    const form = document.getElementById(

        "searchForm"

    );

    if (!form) {

        return;

    }

    form.addEventListener(

        "submit",

        (event) => {

            const input = form.querySelector(

                "input[name='q']"

            );

            if (

                !input ||

                input.value.trim() === ""

            ) {

                event.preventDefault();

                App.showToast(

                    "Please enter a keyword.",

                    "warning"

                );

            }

        }

    );

}

/* ==========================================
   Copy Buttons
========================================== */

function initializeCopyButtons() {

    document.querySelectorAll(

        "[data-copy]"

    ).forEach((button) => {

        button.addEventListener(

            "click",

            async () => {

                await App.copyToClipboard(

                    button.dataset.copy

                );

            }

        );

    });

}

/* ==========================================
   Share Buttons
========================================== */

function initializeShareButtons() {

    document.querySelectorAll(

        "[data-share]"

    ).forEach((button) => {

        button.addEventListener(

            "click",

            async () => {

                await App.shareContent({

                    title:

                        button.dataset.title ||

                        document.title,

                    text:

                        button.dataset.text ||

                        "",

                    url:

                        button.dataset.share

                });

            }

        );

    });

}
/* ==========================================
   Like Buttons
========================================== */

function initializeLikeButtons() {

    document.querySelectorAll(

        "[data-like]"

    ).forEach((button) => {

        button.addEventListener(

            "click",

            async () => {

                const id = button.dataset.like;

                try {

                    const response = await fetch(

                        `/api/shayari/${id}/like`,

                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            }

                        }

                    );

                    const data = await response.json();

                    if (data.success) {

                        const counter =

                            button.querySelector(

                                ".like-count"

                            );

                        if (counter) {

                            counter.textContent =

                                data.likes;

                        }

                        App.showToast(

                            "Liked successfully."

                        );

                    }

                } catch (error) {

                    console.error(error);

                    App.showToast(

                        "Unable to like.",

                        "danger"

                    );

                }

            }

        );

    });

}

/* ==========================================
   Download Buttons
========================================== */

function initializeDownloadButtons() {

    document.querySelectorAll(

        "[data-download]"

    ).forEach((button) => {

        button.addEventListener(

            "click",

            async () => {

                const url =

                    button.dataset.download;

                window.open(

                    url,

                    "_blank"

                );

            }

        );

    });

}

/* ==========================================
   View Counter
========================================== */

function incrementViewCount(id) {

    if (!id) {

        return;

    }

    fetch(

        `/api/shayari/${id}/view`,

        {

            method: "POST"

        }

    ).catch(console.error);

}

/* ==========================================
   Infinite Scroll
========================================== */

function initializeInfiniteScroll() {

    const trigger = document.getElementById(

        "loadMoreTrigger"

    );

    if (!trigger) {

        return;

    }

    const observer = new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (

                    entry.isIntersecting &&

                    typeof window.loadMore === "function"

                ) {

                    window.loadMore();

                }

            });

        },

        {

            threshold: 1

        }

    );

    observer.observe(trigger);

}
/* ==========================================
   Filter Helpers
========================================== */

function filterCards(inputSelector, cardSelector) {

    const input = document.querySelector(inputSelector);

    if (!input) {

        return;

    }

    input.addEventListener("keyup", () => {

        const keyword = input.value

            .toLowerCase()

            .trim();

        document.querySelectorAll(cardSelector)

            .forEach((card) => {

                const text = card.textContent

                    .toLowerCase();

                card.style.display =

                    text.includes(keyword)

                        ? ""

                        : "none";

            });

    });

}

/* ==========================================
   AJAX Helper
========================================== */

async function request(

    url,

    options = {}

) {

    const response = await fetch(url, {

        headers: {

            "Content-Type":

                "application/json",

            ...(options.headers || {})

        },

        ...options

    });

    if (!response.ok) {

        throw new Error(

            "Request failed"

        );

    }

    return response.json();

}

/* ==========================================
   Initialize Extra Features
========================================== */

initializeInfiniteScroll();

/* ==========================================
   Global Object
========================================== */

window.Main = {

    request,

    filterCards,

    incrementViewCount,

    initializeSearch,

    initializeCopyButtons,

    initializeShareButtons,

    initializeLikeButtons,

    initializeDownloadButtons,

    initializeInfiniteScroll

};

/* ==========================================
   End of File
========================================== */
