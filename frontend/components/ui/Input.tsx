import { forwardRef, InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = "", ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={`w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
                {...props}
            />
        );
    }
);

Input.displayName = "Input";

export default Input;