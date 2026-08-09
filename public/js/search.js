/**
 * ==========================================================
 * SMS Hindi Shayari
 * Search JavaScript
 * ==========================================================
 */

"use strict";

const Search = {

    timer: null,

    init() {

        this.bindSearch();

    },

    bindSearch() {

        const input = document.getElementById("searchInput");
        const resultBox = document.getElementById("searchSuggestions");

        if (!input) return;

        input.addEventListener("input", () => {

            clearTimeout(this.timer);

            const keyword = input.value.trim();

            if (keyword.length < 2) {

                if (resultBox) resultBox.innerHTML = "";

                return;

            }

            this.timer = setTimeout(() => {

                this.fetchSuggestions(keyword, resultBox);

            }, 300);

        });

    },

    async fetchSuggestions(keyword, resultBox) {

        try {

            const response = await fetch(`/search?q=${encodeURIComponent(keyword)}`, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                }
            });

            if (!response.ok) throw new Error("Search failed");

            const data = await response.json();

            if (!resultBox) return;

            resultBox.innerHTML = "";

            if (!Array.isArray(data) || data.length === 0) {

                resultBox.innerHTML =
                    "<div class='search-empty'>No results found.</div>";

                return;

            }

            data.forEach(item => {

                const div = document.createElement("div");

                div.className = "search-item";

                div.innerHTML = `
                    <a href="/shayari/${item.slug}">
                        ${item.title}
                    </a>
                `;

                resultBox.appendChild(div);

            });

        } catch (err) {

            console.error(err);

        }

    }

};

document.addEventListener("DOMContentLoaded", () => {

    Search.init();

});
