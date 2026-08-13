"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useLayoutEffect,
    useState,
} from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(
    undefined
);

const THEME_STORAGE_KEY = "theme";

function applyTheme(theme: Theme) {
    const root = document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
        const systemTheme = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches
            ? "dark"
            : "light";

        root.classList.add(systemTheme);
    } else {
        root.classList.add(theme);
    }
}

export const ThemeProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>("system");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        let active = true;

        const loadTheme = async () => {
            try {
                const response = await fetch("/api/settings", {
                    cache: "no-store",
                });

                if (response.ok) {
                    const data = await response.json();

                    const databaseTheme = data?.settings?.theme;

                    if (
                        databaseTheme === "LIGHT" ||
                        databaseTheme === "DARK" ||
                        databaseTheme === "SYSTEM"
                    ) {
                        const normalizedTheme =
                            databaseTheme.toLowerCase() as Theme;

                        if (active) {
                            setThemeState(normalizedTheme);
                            localStorage.setItem(
                                THEME_STORAGE_KEY,
                                normalizedTheme
                            );
                        }

                        return;
                    }
                }
            } catch (error) {
                console.error(
                    "Failed to load theme preference:",
                    error
                );
            }

            const savedTheme = localStorage.getItem(
                THEME_STORAGE_KEY
            ) as Theme | null;

            if (
                active &&
                (
                    savedTheme === "light" ||
                    savedTheme === "dark" ||
                    savedTheme === "system"
                )
            ) {
                setThemeState(savedTheme);
            }
        };

        loadTheme().finally(() => {
            if (active) {
                setIsMounted(true);
            }
        });

        return () => {
            active = false;
        };
    }, []);

    useLayoutEffect(() => {
        if (!isMounted) {
            return;
        }

        applyTheme(theme);

        localStorage.setItem(
            THEME_STORAGE_KEY,
            theme
        );
    }, [theme, isMounted]);

    useEffect(() => {
        if (!isMounted || theme !== "system") {
            return;
        }

        const mediaQuery = window.matchMedia(
            "(prefers-color-scheme: dark)"
        );

        const handleChange = () => {
            applyTheme("system");
        };

        mediaQuery.addEventListener(
            "change",
            handleChange
        );

        return () => {
            mediaQuery.removeEventListener(
                "change",
                handleChange
            );
        };
    }, [theme, isMounted]);

    const setTheme = (nextTheme: Theme) => {
        setThemeState(nextTheme);
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(
            "useTheme must be used within a ThemeProvider"
        );
    }

    return context;
};