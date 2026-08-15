import Link from "next/link";

export default function KBFooter() {
    return (
        <footer className="border-t border-[var(--color-border)]">
            <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-6 py-8 text-center text-xs text-[var(--color-text-muted)] sm:flex-row sm:justify-between sm:text-left">
                <p>
                    &copy; {new Date().getFullYear()} Aformix. All rights
                    reserved.
                </p>

                <Link href="/" className="footer-link hover:text-[var(--color-primary)]">
                    Back to Aformix
                </Link>
            </div>
        </footer>
    );
}
