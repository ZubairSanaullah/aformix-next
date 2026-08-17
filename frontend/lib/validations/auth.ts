import { z } from "zod";

export const registerSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, "Name must be at least 2 characters.")
            .max(100, "Name is too long."),

        email: z
            .string()
            .trim()
            .toLowerCase()
            .email("Please enter a valid email address."),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters.")
            .max(128, "Password is too long."),

        confirmPassword: z
            .string()
            .optional(),
    })
    .refine(
        (data) => {
            if (data.confirmPassword !== undefined && data.confirmPassword !== "") {
                return data.password === data.confirmPassword;
            }
            return true;
        },
        {
            message: "Passwords do not match.",
            path: ["confirmPassword"],
        }
    );

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Please enter a valid email address."),

    password: z
        .string()
        .min(1, "Password is required."),
});

export const verifyOtpSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Please enter a valid email address."),

    otp: z
        .string()
        .trim()
        .regex(/^\d{6}$/, "Verification code must be 6 digits."),
});

export const resendVerificationSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Please enter a valid email address."),
});

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Please enter a valid email address."),
});

export const resetPasswordSchema = z
    .object({
        token: z
            .string()
            .min(1, "Reset token is required."),

        email: z
            .string()
            .trim()
            .toLowerCase()
            .email("Please enter a valid email address.")
            .optional(),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters.")
            .max(128, "Password is too long."),

        confirmPassword: z
            .string()
            .min(1, "Please confirm your password."),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    });

export const changePasswordSchema = z
    .object({
        currentPassword: z
            .string()
            .min(1, "Current password is required."),

        newPassword: z
            .string()
            .min(8, "New password must be at least 8 characters.")
            .max(128, "New password is too long."),

        confirmPassword: z
            .string()
            .min(1, "Please confirm your new password."),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "New passwords do not match.",
        path: ["confirmPassword"],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
        message: "New password must be different from your current password.",
        path: ["newPassword"],
    });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;