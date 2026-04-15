"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams(searchParams);
      if (query.trim()) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      router.push(`/services?${params.toString()}`);
    },
    [query, searchParams, router]
  );

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un service (bricolage, jardinage, informatique...)"
          className="w-full px-4 py-3 pl-12 rounded-sm border-2 border-gray-300 focus:border-primary focus:outline-none text-sm"
        />
        <Search className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
        <Button
          type="submit"
          variant="default"
          size="sm"
          className="absolute right-1 h-10"
        >
          Chercher
        </Button>
      </div>
    </form>
  );
}
