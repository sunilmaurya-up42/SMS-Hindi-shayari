const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

    host: process.env.SMTP_HOST,

    port: Number(process.env.SMTP_PORT),

    secure: process.env.SMTP_SECURE === "true",

    auth: {

        user: process.env.SMTP_EMAIL,

        pass: process.env.SMTP_PASSWORD

    }

});

/**
 * Send Email
 */
exports.send = async ({
    to,
    subject,
    html,
    text,
    attachments = []
}) => {

    return transporter.sendMail({

        from: `"${process.env.SITE_NAME}" <${process.env.SMTP_EMAIL}>`,

        to,

        subject,

        text,

        html,

        attachments

    });

};

/**
 * Welcome Email
 */
exports.sendWelcome = async (user) => {

    return exports.send({

        to: user.email,

        subject: "Welcome",

        html: `
            <h2>Welcome ${user.name}</h2>
            <p>Thank you for joining ${process.env.SITE_NAME}.</p>
        `

    });

};

/**
 * Send OTP
 */
exports.sendOTP = async (email, otp) => {

    return exports.send({

        to: email,

        subject: "Your OTP",

        html: `
            <h2>OTP Verification</h2>
            <h1>${otp}</h1>
            <p>This OTP will expire in 10 minutes.</p>
        `

    });

};

/**
 * Password Reset
 */
exports.sendPasswordReset = async (email, link) => {

    return exports.send({

        to: email,

        subject: "Reset Password",

        html: `
            <h2>Password Reset</h2>
            <p>
                <a href="${link}">
                    Click here to reset password
                </a>
            </p>
        `

    });

};

/**
 * Contact Reply
 */
exports.replyContact = async (
    email,
    subject,
    message
) => {

    return exports.send({

        to: email,

        subject,

        html: `
            <h3>${subject}</h3>
            <p>${message}</p>
        `

    });

};

/**
 * Admin Notification
 */
exports.notifyAdmin = async (
    subject,
    message
) => {

    return exports.send({

        to: process.env.ADMIN_EMAIL,

        subject,

        html: `
            <h3>${subject}</h3>
            <p>${message}</p>
        `

    });

};

/**
 * Newsletter
 */
exports.newsletter = async (
    emails,
    subject,
    html
) => {

    return exports.send({

        to: emails.join(","),

        subject,

        html

    });

};

/**
 * Verify SMTP
 */
exports.verify = async () => {

    return transporter.verify();

};
