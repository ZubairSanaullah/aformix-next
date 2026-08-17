import { renderAformixEmailLayout } from "./base";

export interface PasswordResetEmailProps {
    name?: string | null;
    resetUrl: string;
}

export function generatePasswordResetEmail({ name, resetUrl }: PasswordResetEmailProps): {
    subject: string;
    html: string;
    text: string;
} {
    const greeting = name ? `Hello ${name},` : "Hello,";
    const subject = "Reset your Aformix password";

    const contentHtml = `
        <h1 class="title">Reset your password</h1>
        <p class="text">${greeting}</p>
        <p class="text">
            We received a request to reset the password for your Aformix account. Click the button below to choose a new password:
        </p>

        <div style="margin: 28px 0; text-align: left;">
            <a href="${resetUrl}" class="btn" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 12px 28px; background-color: #1A0F43; color: #FFFFFF !important; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 10px; box-shadow: 0 2px 8px rgba(26, 15, 67, 0.2);">
                Reset Password
            </a>
        </div>

        <p class="text" style="font-size: 13px; color: #64748B;">
            This password reset link is valid for <strong>1 hour</strong>. For security reasons, it can only be used once.
        </p>

        <p class="text" style="font-size: 13px; color: #64748B; word-break: break-all;">
            If the button doesn't work, copy and paste this URL into your browser:<br />
            <a href="${resetUrl}" style="color: #007D8C; text-decoration: underline;">${resetUrl}</a>
        </p>

        <div class="alert-box">
            <strong>Security Notice:</strong> If you did not request a password reset, no action is needed. Your account remains secure.
        </div>
    `;

    const html = renderAformixEmailLayout({
        title: subject,
        preheader: "Reset instructions for your Aformix account. Link expires in 1 hour.",
        contentHtml,
        footerNote: "If you suspect unauthorized access to your account, please contact our security team immediately.",
    });

    const text = `${greeting}

We received a request to reset the password for your Aformix account.

Click or copy the link below to set a new password:
${resetUrl}

This link will expire in 1 hour and can only be used once.

If you did not request this password reset, you can safely ignore this email.

— The Aformix Security Team
`;

    return { subject, html, text };
}
