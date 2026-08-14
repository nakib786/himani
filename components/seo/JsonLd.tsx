/**
 * Renders a JSON-LD block into the document.
 *
 * Everything passed here is authored in `lib/seo.ts` from our own catalogue —
 * never from user input — so serialising it directly is safe.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
