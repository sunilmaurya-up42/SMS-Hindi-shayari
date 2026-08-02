/**
 * ==========================================================
 * SMS Hindi Shayari
 * Progressive Web App (PWA)
 * ==========================================================
 */

"use strict";

const PWA = {

    deferredPrompt: null,

    init() {

        this.registerServiceWorker();
        this.installPrompt();
        this.onlineStatus();

    },

    registerServiceWorker() {

        if (!("serviceWorker" in navigator)) return;

        window.addEventListener("load", async () => {

            try {

                const registration = await navigator.serviceWorker.register("/sw.js");

                console.log("✅ Service Worker Registered:", registration.scope);

            } catch (err) {

                console.error("❌ Service Worker Registration Failed:", err);

            }

        });

    },

    installPrompt() {

        window.addEventListener("beforeinstallprompt", (e) => {

            e.preventDefault();

            this.deferredPrompt = e;

            const installBtn = document.getElementById("installApp");

            if (!installBtn) return;

            installBtn.style.display = "inline-block";

            installBtn.addEventListener("click", async () => {

                installBtn.style.display = "none";

                this.deferredPrompt.prompt();

                const result = await this.deferredPrompt.userChoice;

                console.log("Install Status:", result.outcome);

                this.deferredPrompt = null;

            });

        });

    },

    onlineStatus() {

        const updateStatus = () => {

            if (navigator.onLine) {

                console.log("🌐 Online");

                document.body.classList.remove("offline");

                document.body.classList.add("online");

            } else {

                console.log("📴 Offline");

                document.body.classList.remove("online");

                document.body.classList.add("offline");

            }

        };

        window.addEventListener("online", updateStatus);

        window.addEventListener("offline", updateStatus);

        updateStatus();

    }

};

document.addEventListener("DOMContentLoaded", () => {

    PWA.init();

});
