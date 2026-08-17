export interface EmailLayoutOptions {
    title: string;
    preheader?: string;
    contentHtml: string;
    actionButton?: {
        text: string;
        url: string;
    };
    footerNote?: string;
}

export function renderAformixEmailLayout(options: EmailLayoutOptions): string {
    const { title, preheader, contentHtml, actionButton, footerNote } = options;
    const appUrl = process.env.APP_URL || process.env.NEXTAUTH_URL || "https://www.aformix.com";
    const logoUrl = "https://www.aformix.com/images/main_logo.png";
    const currentYear = new Date().getFullYear();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${title}</title>
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
        body { margin: 0; padding: 0; width: 100% !important; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B; line-height: 1.6; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #F8FAFC; padding-bottom: 40px; }
        .main-container { max-width: 580px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04); }
        .header { background-color: #1A0F43; padding: 32px 36px; text-align: left; }
        .logo-badge { display: inline-block; width: 36px; height: 36px; line-height: 36px; background: linear-gradient(135deg, #00BFDE 0%, #31B98F 100%); border-radius: 10px; color: #1A0F43; font-weight: 800; font-size: 18px; text-align: center; vertical-align: middle; }
        .brand-name { display: inline-block; font-size: 20px; font-weight: 700; color: #FFFFFF; margin-left: 12px; vertical-align: middle; letter-spacing: -0.02em; }
        .body-content { padding: 36px; }
        .title { font-size: 22px; font-weight: 700; color: #0F172A; margin: 0 0 16px 0; letter-spacing: -0.02em; }
        .text { font-size: 15px; color: #475569; margin: 0 0 18px 0; line-height: 1.6; }
        .btn-wrapper { margin: 28px 0; }
        .btn { display: inline-block; padding: 12px 28px; background-color: #1A0F43; color: #FFFFFF !important; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 10px; box-shadow: 0 2px 8px rgba(26, 15, 67, 0.2); }
        .otp-box { background: #F1F5F9; border: 1px solid #CBD5E1; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
        .otp-code { font-family: 'SF Mono', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #1A0F43; margin: 0; }
        .alert-box { background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 10px; padding: 14px 18px; margin: 20px 0; font-size: 13px; color: #92400E; }
        .footer { padding: 24px 36px; text-align: center; font-size: 12px; color: #94A3B8; }
        .footer a { color: #64748B; text-decoration: underline; }
        @media only screen and (max-width: 600px) {
            .header { padding: 24px 20px !important; }
            .body-content { padding: 24px 20px !important; }
            .footer { padding: 20px !important; }
            .otp-code { font-size: 26px !important; letter-spacing: 6px !important; }
        }
    </style>
</head>
<body>
    ${preheader ? `<div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</div>` : ""}
    <table class="wrapper" role="presentation" border="0" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center" style="padding: 24px 12px;">
                <table class="main-container" role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <!-- Header -->
                    <tr>
                        <td class="header">
                            <a href="https://www.aformix.com" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: inline-block;">
                                <img src="${logoUrl}" alt="Aformix" height="32" style="display: block; height: 32px; max-height: 32px; width: auto; border: 0; outline: none; text-decoration: none;" />
                            </a>
                        </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                        <td class="body-content">
                            ${contentHtml}
                            ${actionButton ? `
                                <div class="btn-wrapper">
                                    <a href="${actionButton.url}" class="btn" target="_blank" rel="noopener noreferrer">
                                        ${actionButton.text}
                                    </a>
                                </div>
                            ` : ""}
                            ${footerNote ? `
                                <p style="font-size: 13px; color: #94A3B8; margin-top: 24px; border-top: 1px solid #F1F5F9; padding-top: 16px;">
                                    ${footerNote}
                                </p>
                            ` : ""}
                        </td>
                    </tr>
                </table>

                <!-- Footer -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin: 0 auto;">
                    <tr>
                        <td class="footer">
                            <p style="margin: 0 0 8px 0;">
                                &copy; ${currentYear} Aformix. All rights reserved.
                            </p>
                            <p style="margin: 0;">
                                Secure workspace management &bull; <a href="${appUrl}">Visit Aformix</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}
