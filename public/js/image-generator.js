/**
 * ==========================================================
 * SMS Hindi Shayari
 * AI Image Generator
 * ==========================================================
 */

"use strict";

const ImageGenerator = {

    init() {

        this.bindBackgroundPreview();
        this.bindGenerateButton();
        this.bindDownloadButton();

    },

    bindBackgroundPreview() {

        const input = document.getElementById("backgroundImage");
        const preview = document.getElementById("backgroundPreview");

        if (!input || !preview) return;

        input.addEventListener("change", e => {

            const file = e.target.files[0];

            if (!file) return;

            const reader = new FileReader();

            reader.onload = event => {

                preview.src = event.target.result;
                preview.style.display = "block";

            };

            reader.readAsDataURL(file);

        });

    },

    bindGenerateButton() {

        const form = document.getElementById("imageGeneratorForm");

        if (!form) return;

        form.addEventListener("submit", async e => {

            e.preventDefault();

            const submitBtn =
                form.querySelector("button[type='submit']");

            submitBtn.disabled = true;
            submitBtn.innerText = "Generating...";

            try {

                const formData = new FormData(form);

                const response = await fetch("/api/image/generate", {

                    method: "POST",
                    body: formData

                });

                const data = await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message || "Image generation failed."
                    );

                }

                const output = document.getElementById("generatedImage");

                if (output) {

                    output.src = data.imageUrl;
                    output.style.display = "block";

                }

            } catch (err) {

                alert(err.message);

            } finally {

                submitBtn.disabled = false;
                submitBtn.innerText = "Generate Image";

            }

        });

    },

    bindDownloadButton() {

        const btn = document.getElementById("downloadImage");

        if (!btn) return;

        btn.addEventListener("click", () => {

            const img = document.getElementById("generatedImage");

            if (!img || !img.src) return;

            const a = document.createElement("a");

            a.href = img.src;
            a.download = "shayari-image.png";

            document.body.appendChild(a);

            a.click();

            a.remove();

        });

    }

};

document.addEventListener("DOMContentLoaded", () => {

    ImageGenerator.init();

});
