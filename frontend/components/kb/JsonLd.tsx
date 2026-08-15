export default function JsonLd({ data }: { data: object }) {
    return (
        <script
            type="application/ld+json"
            // `data` is always server-built from trusted fields (titles,
            // dates, our own URLs) via the builders in
            // lib/kb/structured-data.ts — never raw article HTML — so
            // JSON.stringify-ing it straight into the page is safe.
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
