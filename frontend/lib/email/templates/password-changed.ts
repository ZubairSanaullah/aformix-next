import { renderAformixEmailLayout } from "./base";

export interface PasswordChangedEmailProps {
    name?: string | null;
    timestamp?: Date;
}

export function generatePasswordChangedEmail({ name, timestamp = new Date() }: PasswordChangedEmailProps): {
    subject: string;
    html: string;
    text: string;
} {
    const greeting = name ? `Hello ${name},` : "Hello,";
    const subject = "Security Alert: Your Aformix password was changed";
    const formattedTime = timestamp.toUTCString();
    const appUrl = process.env.APP_URL || process.env.NEXTAUTH_URL || "https://aformix.com";

    const contentHtml = `
        <h1 class="title">Password Changed Successfully</h1>
        <p class="text">${greeting}</p>
        <p class="text">
            This is a security confirmation that the password for your Aformix account was recently updated.
        </p>

        <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px 20px; margin: 20px 0;">
            <p style="margin: 0 0 6px 0; font-size: 14px; color: #334155;">
                <strong>Date / Time (UTC):</strong> ${formattedTime}
            </p>
            <p style="margin: 0; font-size: 14px; color: #334155;">
                <strong>Action:</strong> Password Update
            </p>
        </div>

        <div class="alert-box" style="background-color: #FEE2E2; border-color: #FCA5A5; color: #991B1B;">
            <strong>Did not make this change?</strong> If you did not update your password, your account may be compromised. Please reset your password immediately and contact Aformix support.
        </div>
    `;

    const html = renderAformixEmailLayout({
        title: subject,
        preheader: "Security alert: The password for your Aformix account was successfully updated.",
        contentHtml,
        actionButton: {
            text: "Review Account Security",
            url: `${appUrl}/workspace/settings`,
        },
        footerNote: "This security notification is automatically sent whenever your account credentials are changed.",
    });

    const text = `${greeting}

Your Aformix account password was changed at ${formattedTime}.

If you made this change, no further action is needed.

If you did NOT make this change, please reset your password immediately and contact support:
${appUrl}/forgot-password

— The Aformix Security Team
`;

    return { subject, html, text };
}
