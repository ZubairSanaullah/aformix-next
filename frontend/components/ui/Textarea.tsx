import { forwardRef, TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className = "", ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                className={`min-h-[140px] w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
                {...props}
            />
        );
    }
);

Textarea.displayName = "Textarea";

export default Textarea;