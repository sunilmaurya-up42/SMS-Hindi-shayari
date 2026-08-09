/**
 * ==========================================================
 * SMS Hindi Shayari
 * Comments JavaScript
 * ==========================================================
 */

"use strict";

const Comments = {

    init() {

        this.bindCommentForm();
        this.bindDeleteButtons();
        this.bindReplyButtons();
        this.autoResizeTextarea();

    },

    bindCommentForm() {

        const form = document.getElementById("commentForm");

        if (!form) return;

        form.addEventListener("submit", () => {

            const btn = form.querySelector("button[type='submit']");

            if (!btn) return;

            btn.disabled = true;
            btn.innerText = "Posting...";

        });

    },

    bindDeleteButtons() {

        document.querySelectorAll("[data-comment-delete]").forEach(button => {

            button.addEventListener("click", e => {

                const confirmDelete = confirm(
                    "Do you really want to delete this comment?"
                );

                if (!confirmDelete) {

                    e.preventDefault();

                }

            });

        });

    },

    bindReplyButtons() {

        document.querySelectorAll("[data-comment-reply]").forEach(button => {

            button.addEventListener("click", () => {

                const commentId = button.dataset.commentReply;

                const replyBox = document.getElementById(
                    `reply-box-${commentId}`
                );

                if (!replyBox) return;

                replyBox.classList.toggle("hidden");

            });

        });

    },

    autoResizeTextarea() {

        document.querySelectorAll("textarea").forEach(textarea => {

            textarea.addEventListener("input", function () {

                this.style.height = "auto";
                this.style.height = this.scrollHeight + "px";

            });

        });

    }

};

document.addEventListener("DOMContentLoaded", () => {

    Comments.init();

});
