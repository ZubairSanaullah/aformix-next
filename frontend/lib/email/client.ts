import nodemailer from "nodemailer";

export interface SmtpConfig {
    host: string;
    port: number;
    secure: boolean;
    auth?: {
        user: string;
        pass: string;
    };
    fromEmail: string;
    fromName: string;
}

export function getSmtpConfig(): SmtpConfig | null {
    const host = process.env.SMTP_HOST;
    const portStr = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD;
    const fromEmail = process.env.SMTP_FROM_EMAIL || "notifications@aformix.com";
    const fromName = process.env.SMTP_FROM_NAME || "Aformix";

    if (!host || !portStr || !pass || pass.startsWith("YOUR_")) {
        return null;
    }

    const port = parseInt(portStr, 10) || 587;
    const secure = port === 465;

    return {
        host,
        port,
        secure,
        auth: user && pass ? { user, pass } : undefined,
        fromEmail,
        fromName,
    };
}

let transporterInstance: nodemailer.Transporter | null = null;

export function getEmailTransporter(): nodemailer.Transporter | null {
    const config = getSmtpConfig();
    if (!config) {
        return null;
    }

    if (!transporterInstance) {
        transporterInstance = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: config.auth,
        });
    }

    return transporterInstance;
}

export interface SendEmailPayload {
    to: string;
    subject: string;
    html: string;
    text: string;
}

export async function sendEmail(payload: SendEmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
        const config = getSmtpConfig();
        const transporter = getEmailTransporter();

        if (!transporter || !config) {
            // In development or when SMTP is not configured, log a clean notification to console
            // without leaking sensitive credentials or failing silent workflows.
            console.warn(
                `[Aformix Email Dev Notice] SMTP not configured. Simulating email send to: ${payload.to} | Subject: "${payload.subject}"`
            );
            return {
                success: true,
                messageId: `dev-simulated-${Date.now()}`,
            };
        }

        const info = await transporter.sendMail({
            from: `"${config.fromName}" <${config.fromEmail}>`,
            to: payload.to,
            subject: payload.subject,
            html: payload.html,
            text: payload.text,
        });

        return {
            success: true,
            messageId: info.messageId,
        };
    } catch (error: unknown) {
        const errMessage = error instanceof Error ? error.message : "Unknown SMTP error";
        console.error(`[Aformix Email Error] Failed to send email to ${payload.to}: ${errMessage}`);
        return {
            success: false,
            error: errMessage,
        };
    }
}
