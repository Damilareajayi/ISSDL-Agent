export type Publication = {
  title: string;
  authors: string[];
  year: number | null;
  abstract: string | null;
  url: string | null;
  doi: string | null;
  citationCount: number | null;
  source: "openalex" | "semantic_scholar" | "core";
};

// OpenAlex stores abstracts as inverted indices {word: [positions]}
function reconstructAbstract(invertedIndex: Record<string, number[]> | null): string | null {
  if (!invertedIndex) return null;
  const words: string[] = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const pos of positions) {
      words[pos] = word;
    }
  }
  const result = words.join(" ").trim();
  return result || null;
}

export async function searchOpenAlex(query: string, limit = 8): Promise<Publication[]> {
  const params = new URLSearchParams({
    search: query,
    "per-page": String(limit),
    sort: "relevance_score:desc",
    "mailto": "sdl-intelligence@research.org",
  });

  const res = await fetch(`https://api.openalex.org/works?${params}`);
  if (!res.ok) throw new Error(`OpenAlex error: ${res.status}`);

  const data = await res.json() as {
    results: Array<{
      title: string;
      authorships: Array<{ author: { display_name: string } }>;
      publication_year: number | null;
      abstract_inverted_index: Record<string, number[]> | null;
      doi: string | null;
      cited_by_count: number;
      primary_location: { landing_page_url: string | null } | null;
    }>;
  };

  return data.results.map((w) => ({
    title: w.title,
    authors: w.authorships.map((a) => a.author.display_name).slice(0, 5),
    year: w.publication_year,
    abstract: reconstructAbstract(w.abstract_inverted_index),
    url: w.primary_location?.landing_page_url ?? (w.doi ? `https://doi.org/${w.doi}` : null),
    doi: w.doi,
    citationCount: w.cited_by_count,
    source: "openalex" as const,
  }));
}

export async function searchSemanticScholar(query: string, limit = 8): Promise<Publication[]> {
  const params = new URLSearchParams({
    query,
    limit: String(limit),
    fields: "title,authors,year,abstract,citationCount,externalIds,url",
  });

  const res = await fetch(`https://api.semanticscholar.org/graph/v1/paper/search?${params}`);
  if (!res.ok) throw new Error(`Semantic Scholar error: ${res.status}`);

  const data = await res.json() as {
    data: Array<{
      title: string;
      authors: Array<{ name: string }>;
      year: number | null;
      abstract: string | null;
      citationCount: number | null;
      externalIds: { DOI?: string } | null;
      url: string | null;
    }>;
  };

  return (data.data ?? []).map((p) => ({
    title: p.title,
    authors: p.authors.map((a) => a.name).slice(0, 5),
    year: p.year,
    abstract: p.abstract,
    url: p.url,
    doi: p.externalIds?.DOI ?? null,
    citationCount: p.citationCount,
    source: "semantic_scholar" as const,
  }));
}

export async function searchCORE(query: string, limit = 8, apiKey: string): Promise<Publication[]> {
  const res = await fetch("https://api.core.ac.uk/v3/search/works", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ q: query, limit }),
  });
  if (!res.ok) throw new Error(`CORE error: ${res.status}`);

  const data = await res.json() as {
    results: Array<{
      title: string;
      authors: Array<{ name: string }> | null;
      yearPublished: number | null;
      abstract: string | null;
      doi: string | null;
      links: Array<{ url: string }> | null;
    }>;
  };

  return (data.results ?? []).map((p) => ({
    title: p.title,
    authors: (p.authors ?? []).map((a) => a.name).slice(0, 5),
    year: p.yearPublished,
    abstract: p.abstract,
    url: p.links?.[0]?.url ?? (p.doi ? `https://doi.org/${p.doi}` : null),
    doi: p.doi,
    citationCount: null,
    source: "core" as const,
  }));
}

export async function searchAllSources(
  query: string,
  limit = 5,
  coreApiKey?: string,
): Promise<Publication[]> {
  const searches: Promise<Publication[]>[] = [
    searchOpenAlex(query, limit).catch(() => []),
    searchSemanticScholar(query, limit).catch(() => []),
  ];

  if (coreApiKey) {
    searches.push(searchCORE(query, limit, coreApiKey).catch(() => []));
  }

  const results = await Promise.all(searches);

  // Merge and deduplicate by DOI
  const seen = new Set<string>();
  const merged: Publication[] = [];
  for (const batch of results) {
    for (const pub of batch) {
      const key = pub.doi ?? pub.title.toLowerCase().slice(0, 60);
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(pub);
      }
    }
  }

  return merged;
}
