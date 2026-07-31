import { cn } from "@/lib/utils";

interface SectionContainerProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
}

export default function SectionContainer({
    children,
    className,
    id,
}: SectionContainerProps) {
    return (
        <section
            id={id}
            className={cn(
                "py-20",
                className
            )}
        >
            <div className="mx-auto w-full max-w-7xl px-6">
                {children}
            </div>
        </section>
    );
}