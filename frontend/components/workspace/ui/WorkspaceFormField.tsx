import { ReactNode } from "react";

interface WorkspaceFormFieldProps {
    label?: string;
    description?: string;
    required?: boolean;
    error?: string;
    children: ReactNode;
}

export default function WorkspaceFormField({
    label,
    description,
    required,
    error,
    children,
}: WorkspaceFormFieldProps) {
    return (
        <div className="space-y-1.5">
            {label && (
                <div>
                    <label className="text-xs font-medium text-[var(--workspace-text)]">
                        {label}

                        {required && (
                            <span className="ml-1 text-[var(--workspace-primary)]">
                                *
                            </span>
                        )}
                    </label>

                    {description && (
                        <p className="mt-0.5 text-[11px] text-[var(--workspace-text-subtle)]">
                            {description}
                        </p>
                    )}
                </div>
            )}

            {children}

            {error && (
                <p className="text-[11px] text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}