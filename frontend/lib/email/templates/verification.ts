import { renderAformixEmailLayout } from "./base";

export interface VerificationEmailProps {
    name?: string | null;
    otp: string;
}

export function generateVerificationEmail({ name, otp }: VerificationEmailProps): {
    subject: string;
    html: string;
    text: string;
} {
    const greeting = name ? `Hello ${name},` : "Hello,";
    const subject = "Verify your Aformix account";

    const contentHtml = `
        <h1 class="title">Verify your email address</h1>
        <p class="text">${greeting}</p>
        <p class="text">
            Thank you for registering with Aformix. Please use the following 6-digit verification code to confirm your email address and activate your account:
        </p>

        <div class="otp-box">
            <div class="otp-code">${otp}</div>
            <p style="margin: 8px 0 0 0; font-size: 13px; color: #64748B;">
                This code will expire in <strong>10 minutes</strong>.
            </p>
        </div>

        <p class="text">
            Enter this code on the email verification page to complete your registration.
        </p>

        <div class="alert-box">
            <strong>Security Notice:</strong> If you did not create an account on Aformix, please ignore this email or contact support. Never share this code with anyone.
        </div>
    `;

    const html = renderAformixEmailLayout({
        title: subject,
        preheader: `Your Aformix verification code is ${otp}. Valid for 10 minutes.`,
        contentHtml,
        footerNote: "This is an automated security verification message from Aformix.",
    });

    const text = `${greeting}

Thank you for registering with Aformix.

Your 6-digit email verification code is: ${otp}

This code will expire in 10 minutes.

If you did not request this verification code, please ignore this email.

— The Aformix Team
`;

    return { subject, html, text };
}
