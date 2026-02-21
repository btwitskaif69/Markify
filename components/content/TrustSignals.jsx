const formatDate = (value) => {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
};

export default function TrustSignals({ lastUpdated, reviewedBy, citations = [] }) {
  return (
    <section className="rounded-xl border border-border/70 bg-card/80 p-4">
      <div className="grid gap-2 text-sm md:grid-cols-2">
        <p>
          <span className="font-semibold text-foreground">Last updated:</span>{" "}
          <span className="text-muted-foreground">{formatDate(lastUpdated)}</span>
        </p>
        <p>
          <span className="font-semibold text-foreground">Reviewed by:</span>{" "}
          <span className="text-muted-foreground">{reviewedBy || "Markify Editorial Team"}</span>
        </p>
      </div>

      {citations.length ? (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground">
            Sources
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {citations.map((citation) => (
              <li key={citation.url}>
                <a
                  href={citation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {citation.title}
                </a>
                {citation.publisher ? ` (${citation.publisher})` : ""}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
