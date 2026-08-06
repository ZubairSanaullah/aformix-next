"use client";

import { diffWords } from "diff";


interface Props {

    oldRevision: {

        title: string;
        content: string;
        seoTitle?: string | null;
        seoDescription?: string | null;

    };


    currentPost: {

        title: string;
        content: string;
        seoTitle?: string | null;
        seoDescription?: string | null;

    };

}

function htmlToText(html: string) {
    if (!html) return "";

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    return doc.body.textContent ?? "";
}

function DiffText({
    oldText,
    newText,
}: {
    oldText: string;
    newText: string;
}) {


    const changes = diffWords(
        oldText || "",
        newText || ""
    );


    return (

        <div className="leading-7 text-sm">

            {
                changes.map(
                    (part, index) => (
                        <span
                            key={index}
                            className={
                                part.added
                                    ?
                                    "rounded bg-green-100 px-1 text-green-700"
                                    :
                                    part.removed
                                        ?
                                        "rounded bg-red-100 px-1 text-red-700 line-through"
                                        :
                                        ""
                            }
                        >

                            {part.value}

                        </span>
                    )
                )
            }

        </div>

    );
}



export default function RevisionDiffViewer({
    oldRevision,
    currentPost,
}: Props) {
    console.log("========== DIFF ==========");
    console.log("Old Revision:", oldRevision);
    console.log("Current Post:", currentPost);

    console.log("Old Title:", oldRevision.title);
    console.log("New Title:", currentPost.title);

    console.log("Old Content:", htmlToText(oldRevision.content));
    console.log("New Content:", htmlToText(currentPost.content));

    return (

        <div className="space-y-8">


            <section>

                <h3 className="mb-3 text-lg font-semibold">
                    Title
                </h3>


                <div className="rounded-xl border p-4">

                    <DiffText
                        oldText={oldRevision.title}
                        newText={currentPost.title}
                    />

                </div>

            </section>




            <section>

                <h3 className="mb-3 text-lg font-semibold">
                    Content
                </h3>


                <div className="rounded-xl border p-4 whitespace-pre-wrap">

                    <DiffText
                        oldText={htmlToText(oldRevision.content)}
                        newText={htmlToText(currentPost.content)}
                    />

                </div>

            </section>





            <section>

                <h3 className="mb-3 text-lg font-semibold">
                    SEO
                </h3>


                <div className="space-y-5 rounded-xl border p-4">


                    <div>

                        <p className="mb-2 text-xs text-muted-foreground">
                            SEO Title
                        </p>

                        <DiffText
                            oldText={
                                oldRevision.seoTitle ?? ""
                            }
                            newText={
                                currentPost.seoTitle ?? ""
                            }
                        />

                    </div>



                    <div>

                        <p className="mb-2 text-xs text-muted-foreground">
                            SEO Description
                        </p>


                        <DiffText
                            oldText={
                                oldRevision.seoDescription ?? ""
                            }
                            newText={
                                currentPost.seoDescription ?? ""
                            }
                        />

                    </div>


                </div>


            </section>


        </div>

    );
}