"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { menuItems } from "@/data/menu-items";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = React.useState(initialQuery);

  const results = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return menuItems.filter((item) => item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q));
  }, [query]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.replace(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <h1 className="mb-6 font-display text-3xl text-charcoal">Search</h1>
      <form onSubmit={handleSubmit} className="relative mb-8">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-body" aria-hidden="true" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for meals, drinks, cakes..."
          className="h-14 pl-11 text-base"
          autoFocus
        />
      </form>

      {query.trim() === "" ? (
        <p className="text-sm text-body">Start typing to search the menu.</p>
      ) : results.length === 0 ? (
        <div className="rounded-card border border-dashed border-border py-16 text-center">
          <p className="font-display text-lg text-charcoal">No results for &ldquo;{query}&rdquo;</p>
          <p className="mt-2 text-sm text-body">Try a different search term.</p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-body">{results.length} result{results.length > 1 ? "s" : ""}</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {results.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <React.Suspense fallback={null}>
      <SearchContent />
    </React.Suspense>
  );
}
