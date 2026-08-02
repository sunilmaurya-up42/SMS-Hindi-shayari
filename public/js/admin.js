/**
 * ==========================================================
 * SMS Hindi Shayari
 * Admin Panel JavaScript
 * ==========================================================
 */

"use strict";

const Admin = {

    init() {

        this.sidebarToggle();
        this.deleteConfirm();
        this.selectAll();
        this.imagePreview();
        this.autoCloseAlerts();

    },

    sidebarToggle() {

        const toggle = document.getElementById("sidebarToggle");
        const sidebar = document.querySelector(".sidebar");

        if (!toggle || !sidebar) return;

        toggle.addEventListener("click", () => {

            sidebar.classList.toggle("active");

        });

    },

    deleteConfirm() {

        document.querySelectorAll("[data-delete]").forEach(btn => {

            btn.addEventListener("click", e => {

                const message =
                    btn.dataset.message ||
                    "Are you sure you want to delete this item?";

                if (!confirm(message)) {

                    e.preventDefault();

                }

            });

        });

    },

    selectAll() {

        const master = document.getElementById("selectAll");

        if (!master) return;

        master.addEventListener("change", () => {

            document.querySelectorAll(".select-item").forEach(item => {

                item.checked = master.checked;

            });

        });

    },

    imagePreview() {

        const input = document.getElementById("image");
        const preview = document.getElementById("imagePreview");

        if (!input || !preview) return;

        input.addEventListener("change", e => {

            const file = e.target.files[0];

            if (!file) return;

            const reader = new FileReader();

            reader.onload = ev => {

                preview.src = ev.target.result;
                preview.style.display = "block";

            };

            reader.readAsDataURL(file);

        });

    },

    autoCloseAlerts() {

        document.querySelectorAll(".alert").forEach(alert => {

            setTimeout(() => {

                alert.style.opacity = "0";

                setTimeout(() => {

                    alert.remove();

                }, 400);

            }, 5000);

        });

    }

};

document.addEventListener("DOMContentLoaded", () => {

    Admin.init();

});
