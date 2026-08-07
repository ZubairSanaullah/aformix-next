import { diffWords } from "diff";
import { htmlToText } from "../utils/htmlToText";
import type { Revision } from "../types";

interface ComparisonResult {
    older: Revision;
    newer: Revision;

    titleChanged: boolean;
    contentChanged: boolean;

    seoTitleChanged: boolean;
    seoDescriptionChanged: boolean;

    wordsAdded: number;
    wordsRemoved: number;

    paragraphsChanged: number;

    readingTimeDifference: number;

    totalChanges: number;
}

export function useRevisionComparison(
    leftRevision: Revision,
    rightRevision: Revision
): ComparisonResult {

    const older =
        new Date(leftRevision.createdAt).getTime() <=
            new Date(rightRevision.createdAt).getTime()
            ? leftRevision
            : rightRevision;

    const newer =
        older === leftRevision
            ? rightRevision
            : leftRevision;

    const titleChanged =
        older.title !== newer.title;

    const contentChanged =
        older.content !== newer.content;

    const seoTitleChanged =
        (older.seoTitle ?? "") !==
        (newer.seoTitle ?? "");

    const seoDescriptionChanged =
        (older.seoDescription ?? "") !==
        (newer.seoDescription ?? "");

    const oldContent =
        htmlToText(older.content);

    const newContent =
        htmlToText(newer.content);

    const wordDiff =
        diffWords(oldContent, newContent);

    let wordsAdded = 0;
    let wordsRemoved = 0;

    wordDiff.forEach((part) => {

        const count =
            part.value
                .trim()
                .split(/\s+/)
                .filter(Boolean).length;

        if (part.added) {
            wordsAdded += count;
        }

        if (part.removed) {
            wordsRemoved += count;
        }

    });

    const oldParagraphs =
        oldContent.split("\n\n");

    const newParagraphs =
        newContent.split("\n\n");

    const totalParagraphs = Math.max(
        oldParagraphs.length,
        newParagraphs.length
    );

    let paragraphsChanged = 0;

    for (let i = 0; i < totalParagraphs; i++) {

        if (
            (oldParagraphs[i] ?? "") !==
            (newParagraphs[i] ?? "")
        ) {
            paragraphsChanged++;
        }

    }

    const readingTimeDifference =
        newer.readingTime - older.readingTime;

    const totalChanges = [
        titleChanged,
        contentChanged,
        seoTitleChanged,
        seoDescriptionChanged,
    ].filter(Boolean).length;

    return {

        older,
        newer,

        titleChanged,
        contentChanged,

        seoTitleChanged,
        seoDescriptionChanged,

        wordsAdded,
        wordsRemoved,

        paragraphsChanged,

        readingTimeDifference,

        totalChanges,
    };
}