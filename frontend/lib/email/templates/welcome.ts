import { renderAformixEmailLayout } from "./base";

export interface WelcomeEmailProps {
    name?: string | null;
}

export function generateWelcomeEmail({ name }: WelcomeEmailProps): {
    subject: string;
    html: string;
    text: string;
} {
    const greeting = name ? `Welcome to Aformix, ${name}!` : "Welcome to Aformix!";
    const subject = "Welcome to Aformix — Your Workspace is Ready";
    const appUrl = process.env.APP_URL || process.env.NEXTAUTH_URL || "https://aformix.com";
    const workspaceUrl = `${appUrl}/workspace`;

    const contentHtml = `
        <h1 class="title">${greeting}</h1>
        <p class="text">
            Your email has been successfully verified, and your Aformix account is now fully active!
        </p>

        <p class="text">
            Here is what you can do in your Aformix workspace:
        </p>

        <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px 22px; margin: 20px 0;">
            <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 14px; line-height: 1.8;">
                <li><strong>Write & Publish Articles:</strong> Draft, edit, and publish engaging blog articles with rich formatting and SEO metadata.</li>
                <li><strong>Personal Media Library:</strong> Upload, organize, and manage your images and media assets.</li>
                <li><strong>Author Dashboard:</strong> Track your published articles, manage works in progress, and organize your drafts.</li>
                <li><strong>Account & Security:</strong> Manage your profile, password security, and custom workspace preferences.</li>
            </ul>
        </div>

        <p class="text">
            Ready to start writing? Access your workspace right away:
        </p>
    `;

    const html = renderAformixEmailLayout({
        title: subject,
        preheader: "Your Aformix account is verified and ready. Start exploring your workspace.",
        contentHtml,
        actionButton: {
            text: "Open Workspace",
            url: workspaceUrl,
        },
        footerNote: "Need help getting started? Check our documentation or reply to this email for support.",
    });

    const text = `${greeting}

Your email has been successfully verified, and your Aformix account is now active!

You can now access your workspace tools:
- Write & Publish Blog Articles
- Upload & Manage Personal Media Files
- Author Content Overview & Drafts
- Account & Security Settings

Access your workspace now: ${workspaceUrl}

— The Aformix Team
`;

    return { subject, html, text };
}
