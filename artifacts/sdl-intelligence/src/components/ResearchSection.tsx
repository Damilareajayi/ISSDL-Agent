import { useState } from "react";
import { Search, ExternalLink, BookOpen, Quote, Loader2 } from "lucide-react";

type Publication = {
  title: string;
  authors: string[];
  year: number | null;
  abstract: string | null;
  url: string | null;
  doi: string | null;
  citationCount: number | null;
  source: "openalex" | "semantic_scholar" | "core";
};

type SearchResponse = {
  query: string;
  results: Publication[];
};

const SOURCE_LABELS: Record<Publication["source"], string> = {
  openalex: "OpenAlex",
  semantic_scholar: "Semantic Scholar",
  core: "CORE",
};

const SOURCE_COLORS: Record<Publication["source"], string> = {
  openalex: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
  semantic_scholar: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
  core: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
};

const QUICK_SEARCHES = [
  "SDL readiness measurement",
  "self-directed learning Africa",
  "SDL higher education",
  "Garrison SDL model",
  "andragogy Knowles",
  "SDL online learning",
];

function PublicationCard({ pub }: { pub: Publication }) {
  const [expanded, setExpanded] = useState(false);
  const abstract = pub.abstract ?? "";
  const isLong = abstract.length > 280;

  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3 hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-heading font-semibold text-foreground text-sm leading-snug flex-1">
          {pub.title}
        </h3>
        {pub.url && (
          <a
            href={pub.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-foreground transition-colors shrink-0 mt-0.5"
            title="Open paper"
          >
            <ExternalLink size={15} />
          </a>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {pub.authors.length > 0 && (
          <span>{pub.authors.slice(0, 3).join(", ")}{pub.authors.length > 3 ? " et al." : ""}</span>
        )}
        {pub.year && <span className="text-primary font-medium">({pub.year})</span>}
      </div>

      {abstract && (
        <p className="text-muted-foreground text-xs leading-relaxed font-body">
          {isLong && !expanded ? `${abstract.slice(0, 280)}…` : abstract}
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="ml-1 text-primary hover:underline"
            >
              {expanded ? "less" : "more"}
            </button>
          )}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-1">
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${SOURCE_COLORS[pub.source]}`}
        >
          {SOURCE_LABELS[pub.source]}
        </span>
        {pub.citationCount !== null && (
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Quote size={10} />
            {pub.citationCount.toLocaleString()} citations
          </span>
        )}
      </div>
    </div>
  );
}

export default function ResearchSection() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search(q: string) {
    const trimmed = q.trim();
    if (!trimmed || isLoading) return;

    setQuery(trimmed);
    setIsLoading(true);
    setError(null);
    setSearched(false);

    try {
      const res = await fetch(`/api/research?q=${encodeURIComponent(trimmed)}&limit=12`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? `Server error ${res.status}`);
      }
      const data = (await res.json()) as SearchResponse;
      setResults(data.results);
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section
      id="research"
      className="py-24 bg-background relative border-t border-border"
      data-testid="section-research"
    >
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-12 fade-in-up">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4 uppercase tracking-wide">
            Research Explorer
          </h2>
          <p className="font-body text-muted-foreground text-lg max-w-2xl mx-auto">
            Search live across OpenAlex, Semantic Scholar, and CORE for SDL publications.
          </p>
        </div>

        {/* Search bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void search(query)}
              placeholder="Search SDL publications…"
              className="flex-1 bg-card border border-border rounded-xl py-3 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <button
              onClick={() => void search(query)}
              disabled={isLoading || !query.trim()}
              className="px-5 py-3 bg-primary text-primary-foreground rounded-xl font-heading font-semibold text-sm hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              Search
            </button>
          </div>

          {/* Quick search chips */}
          {!searched && (
            <div className="flex flex-wrap gap-2 mt-4">
              {QUICK_SEARCHES.map((s) => (
                <button
                  key={s}
                  onClick={() => void search(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="text-center text-red-500 text-sm mb-6">{error}</p>
        )}

        {/* Results */}
        {searched && !isLoading && (
          <>
            <div className="flex items-center gap-2 mb-6">
              <BookOpen size={16} className="text-primary" />
              <p className="text-muted-foreground text-sm">
                {results.length === 0
                  ? "No results found."
                  : `${results.length} publications found for "${query}"`}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((pub, i) => (
                <PublicationCard key={`${pub.doi ?? pub.title}-${i}`} pub={pub} />
              ))}
            </div>

            {searched && (
              <p className="text-center text-xs text-muted-foreground mt-8">
                Results from OpenAlex · Semantic Scholar · CORE — open academic databases.
                Google Scholar is not included due to access restrictions.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
