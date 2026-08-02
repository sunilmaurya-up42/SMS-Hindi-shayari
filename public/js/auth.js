/**
 * ==========================================================
 * SMS Hindi Shayari
 * Authentication JavaScript
 * ==========================================================
 */

"use strict";

const Auth = {

    init() {

        this.togglePassword();
        this.confirmPassword();
        this.formValidation();

    },

    togglePassword() {

        document.querySelectorAll("[data-toggle-password]").forEach(btn => {

            btn.addEventListener("click", () => {

                const input = document.querySelector(btn.dataset.target);

                if (!input) return;

                if (input.type === "password") {

                    input.type = "text";
                    btn.innerText = "Hide";

                } else {

                    input.type = "password";
                    btn.innerText = "Show";

                }

            });

        });

    },

    confirmPassword() {

        const password = document.getElementById("password");
        const confirm = document.getElementById("confirmPassword");

        if (!password || !confirm) return;

        confirm.addEventListener("input", () => {

            if (password.value !== confirm.value) {

                confirm.setCustomValidity("Passwords do not match");

            } else {

                confirm.setCustomValidity("");

            }

        });

    },

    formValidation() {

        document.querySelectorAll("form").forEach(form => {

            form.addEventListener("submit", e => {

                if (!form.checkValidity()) {

                    e.preventDefault();
                    e.stopPropagation();

                }

                form.classList.add("was-validated");

            });

        });

    }

};

document.addEventListener("DOMContentLoaded", () => {

    Auth.init();

});
