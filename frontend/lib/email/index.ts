import { sendEmail } from "./client";
import { generateVerificationEmail, VerificationEmailProps } from "./templates/verification";
import { generateWelcomeEmail, WelcomeEmailProps } from "./templates/welcome";
import { generatePasswordResetEmail, PasswordResetEmailProps } from "./templates/password-reset";
import { generatePasswordChangedEmail, PasswordChangedEmailProps } from "./templates/password-changed";

export async function sendVerificationEmail(params: {
    to: string;
    name?: string | null;
    otp: string;
}): Promise<{ success: boolean; error?: string }> {
    const { subject, html, text } = generateVerificationEmail({
        name: params.name,
        otp: params.otp,
    });

    return sendEmail({
        to: params.to,
        subject,
        html,
        text,
    });
}

export async function sendWelcomeEmail(params: {
    to: string;
    name?: string | null;
}): Promise<{ success: boolean; error?: string }> {
    const { subject, html, text } = generateWelcomeEmail({
        name: params.name,
    });

    return sendEmail({
        to: params.to,
        subject,
        html,
        text,
    });
}

export async function sendPasswordResetEmail(params: {
    to: string;
    name?: string | null;
    resetUrl: string;
}): Promise<{ success: boolean; error?: string }> {
    const { subject, html, text } = generatePasswordResetEmail({
        name: params.name,
        resetUrl: params.resetUrl,
    });

    return sendEmail({
        to: params.to,
        subject,
        html,
        text,
    });
}

export async function sendPasswordChangedEmail(params: {
    to: string;
    name?: string | null;
    timestamp?: Date;
}): Promise<{ success: boolean; error?: string }> {
    const { subject, html, text } = generatePasswordChangedEmail({
        name: params.name,
        timestamp: params.timestamp,
    });

    return sendEmail({
        to: params.to,
        subject,
        html,
        text,
    });
}
