"use client";

import { useEffect, useRef, useState } from "react";

interface UseAutosaveOptions<T> {
    enabled: boolean;
    delay?: number;
    values: T;
    onSave: (values: T) => Promise<void>;
}

export function useAutosave<T>({
    enabled,
    delay = 2000,
    values,
    onSave,
}: UseAutosaveOptions<T>) {

    const previous = useRef(
        JSON.stringify(values)
    );

    const timer = useRef<NodeJS.Timeout | null>(
        null
    );

    const [status, setStatus] = useState<
        "idle" | "saving" | "saved" | "error"
    >("idle");

    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        setIsDirty(JSON.stringify(values) !== previous.current);
    }, [values]);


    useEffect(() => {

        if (!enabled) {
            return;
        }


        const current =
            JSON.stringify(values);


        if (current === previous.current) {
            return;
        }


        if (timer.current) {
            clearTimeout(timer.current);
        }


        timer.current = setTimeout(
            async () => {

                setStatus("saving");


                try {

                    await onSave(values);


                    previous.current =
                        current;


                    setStatus("saved");


                } catch (error) {

                    setStatus("error");
                }


            },
            delay
        );


        return () => {

            if (timer.current) {
                clearTimeout(timer.current);
            }

        };


    }, [
        values,
        enabled,
        delay,
        onSave,
    ]);




    return {
        status,

        timeAgo:
            status === "saved"
                ? "Just now"
                : "",

        isDirty,
    };
}