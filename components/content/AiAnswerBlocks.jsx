import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const wordCount = (value = "") => value.trim().split(/\s+/).filter(Boolean).length;

export const QuestionFirstAnswer = ({ question, answer }) => {
  if (!question || !answer) return null;
  const count = wordCount(answer);
  const outOfRange = count < 40 || count > 80;

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-lg">Quick answer: {question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm leading-7">{answer}</p>
        {process.env.NODE_ENV !== "production" && outOfRange ? (
          <p className="text-xs text-muted-foreground">
            Author note: keep this answer between 40 and 80 words for extraction quality.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
};

export const TldrSummary = ({ points = [] }) => {
  if (!points.length) return null;
  return (
    <Card className="border-border/70 bg-card/80">
      <CardHeader>
        <CardTitle className="text-base">TL;DR</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {points.map((point) => (
            <li key={point} className="flex gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export const KeyStatsWithSources = ({ stats = [] }) => {
  if (!stats.length) return null;
  return (
    <Card className="border-border/70 bg-card/80">
      <CardHeader>
        <CardTitle className="text-base">Key stats (with sources)</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/70 text-left text-muted-foreground">
              <th className="px-2 py-2 font-medium">Metric</th>
              <th className="px-2 py-2 font-medium">Value</th>
              <th className="px-2 py-2 font-medium">Source</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((item) => (
              <tr key={`${item.label}-${item.value}`} className="border-b border-border/40">
                <td className="px-2 py-2">{item.label}</td>
                <td className="px-2 py-2 font-semibold">{item.value}</td>
                <td className="px-2 py-2">
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {item.sourceLabel || "Source"}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export const ProsConsTable = ({ pros = [], cons = [] }) => {
  if (!pros.length && !cons.length) return null;
  return (
    <Card className="border-border/70 bg-card/80">
      <CardHeader>
        <CardTitle className="text-base">Pros and cons</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-emerald-600">Pros</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {pros.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-rose-600">Cons</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {cons.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-rose-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export const AlternativesSection = ({ items = [] }) => {
  if (!items.length) return null;
  return (
    <Card className="border-border/70 bg-card/80">
      <CardHeader>
        <CardTitle className="text-base">Alternatives</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {items.map((item) => (
          <div key={item.href} className="rounded-lg border border-border/70 p-4">
            <Link href={item.href} className="font-medium text-primary hover:underline">
              {item.name}
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">{item.summary}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
