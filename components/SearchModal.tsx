"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Gamepad2 } from "lucide-react";
import Link from "next/link";

interface Game {
  id: number | string;
  slug: string;
  name: string;
  image_url?: string | null;
  min_price?: number | string;
  max_price?: number | string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setHighlightedIndex(-1);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchGames = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/products`,
        );
        const data = await res.json();
        setResults(data.data || []);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, [isOpen]);

  // 🌟 SMARTER SEARCH LOGIC
  const filteredGames = useMemo(() => {
    // Only search if query is at least 2 characters
    if (query.length < 2) return [];

    const lowerQuery = query.toLowerCase();

    return results
      .map((game) => {
        const gameName = game.name.toLowerCase();
        let score = 0;

        // Priority 1: Exact match (highest priority)
        if (gameName === lowerQuery) {
          score = 100;
        }
        // Priority 2: Starts with the query
        else if (gameName.startsWith(lowerQuery)) {
          score = 80;
        }
        // Priority 3: Contains the query as a whole word
        else if (new RegExp(`\\b${lowerQuery}`, "i").test(gameName)) {
          score = 60;
        }
        // Priority 4: Contains the query anywhere
        else if (gameName.includes(lowerQuery)) {
          score = 40;
        }
        // No match
        else {
          return null;
        }

        return { game, score };
      })
      .filter((item): item is { game: Game; score: number } => item !== null)
      .sort((a, b) => b.score - a.score) // Sort by score (highest first)
      .map((item) => item.game);
  }, [query, results]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) => {
          const next = prev < filteredGames.length - 1 ? prev + 1 : 0;
          setTimeout(
            () =>
              resultsRef.current[next]?.scrollIntoView({
                block: "nearest",
                behavior: "smooth",
              }),
            0,
          );
          return next;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) => {
          const next =
            prev > 0
              ? prev - 1
              : filteredGames.length > 0
                ? filteredGames.length - 1
                : -1;
          setTimeout(
            () =>
              resultsRef.current[next]?.scrollIntoView({
                block: "nearest",
                behavior: "smooth",
              }),
            0,
          );
          return next;
        });
      } else if (e.key === "Enter") {
        if (highlightedIndex >= 0 && highlightedIndex < filteredGames.length) {
          e.preventDefault();
          const selectedGame = filteredGames[highlightedIndex];
          router.push(`/products/${selectedGame.slug}`);
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, filteredGames, highlightedIndex, router]);

  useEffect(() => {
    const t = setTimeout(() => setHighlightedIndex(-1), 0);
    return () => clearTimeout(t);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-32 px-3 sm:px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-2xl max-h-[60vh] sm:max-h-[70vh] border-4 border-[#00f0ff] bg-[#0a0118] shadow-hard-cyan z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-modal-title"
      >
        {/* CRT Overlay */}
        <div className="absolute inset-0 crt-overlay opacity-20 pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center border-b-4 border-[#ff00de] p-3 sm:p-5 bg-[#1a0b2e] flex-shrink-0">
          <Search className="h-4 w-4 sm:h-6 sm:w-6 text-[#00f0ff] mr-2 sm:mr-4 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH GAMES..."
            className="flex-1 bg-transparent font-pixel text-[11px] sm:text-sm md:text-base text-[#fcee0a] placeholder-gray-600 focus:outline-none"
            autoComplete="off"
            aria-label="Search games"
          />
          <button
            onClick={onClose}
            className="ml-2 border-2 border-[#ff00de] bg-[#0a0118] px-2 py-1.5 sm:px-3 sm:py-2 font-pixel text-[9px] sm:text-xs text-[#ff00de] hover:bg-[#ff00de] hover:text-white transition-colors btn-press flex items-center justify-center flex-shrink-0"
            aria-label="Close search"
          >
            <X className="h-3 w-3 sm:hidden" />
            <span className="hidden sm:inline">ESC</span>
          </button>
        </div>

        {/* Results Area */}
        <div
          id="search-results"
          className="relative z-10 flex-1 overflow-y-auto p-3 sm:p-4 bg-[#0a0118] scrollbar-thin scrollbar-thumb-[#00f0ff] scrollbar-track-[#1a0b2e]"
          role="listbox"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="font-pixel text-[10px] text-[#00f0ff] mb-3 animate-pulse">
                LOADING...
              </div>
              <div className="h-1.5 w-24 bg-[#00f0ff] animate-pulse" />
            </div>
          ) : query.length < 2 ? (
            <div className="py-8 text-center">
              <Gamepad2 className="h-8 w-8 sm:h-12 sm:w-12 text-[#ff00de] mx-auto mb-3" />
              <p className="font-pixel text-[10px] sm:text-xs text-[#fcee0a] mb-1">
                INSERT COIN TO START
              </p>
              <p className="text-[11px] sm:text-sm text-gray-400 font-bold">
                TYPE AT LEAST 2 CHARACTERS...
              </p>
            </div>
          ) : filteredGames.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="font-pixel text-[10px] sm:text-xs text-[#ff00de] mb-1">
                NO MATCH FOUND
              </p>
              <p className="text-[11px] sm:text-sm text-gray-400 font-bold">
                TRY DIFFERENT TERM
              </p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              <div className="font-pixel text-[9px] sm:text-[10px] text-[#00f0ff] mb-3 border-b-2 border-[#00f0ff] pb-1.5 flex justify-between items-center">
                <span>
                  {filteredGames.length} RESULT
                  {filteredGames.length !== 1 ? "S" : ""}
                </span>
                <span className="text-[8px] text-gray-500 hidden sm:inline">
                  ↑ ↓ TO NAVIGATE
                </span>
              </div>

              {filteredGames.map((game, index) => {
                const isHighlighted = highlightedIndex === index;
                return (
                  <Link
                    key={game.id}
                    id={`game-option-${index}`}
                    ref={(el) => {
                      resultsRef.current[index] = el;
                    }}
                    href={`/products/${game.slug}`}
                    onClick={onClose}
                    role="option"
                    aria-selected={isHighlighted}
                    className={`flex items-center gap-2 sm:gap-4 border-2 p-2 sm:p-3 transition-all btn-press group outline-none ${
                      isHighlighted
                        ? "border-[#fcee0a] bg-[#fcee0a] text-black ring-1 ring-[#00f0ff]"
                        : "border-[#00f0ff] bg-[#1a0b2e] text-[#fcee0a] hover:bg-[#00f0ff] hover:text-black"
                    }`}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <div
                      className={`h-9 w-9 sm:h-12 sm:w-12 border-2 overflow-hidden flex-shrink-0 ${isHighlighted ? "border-black" : "border-[#ff00de] bg-[#0a0118] group-hover:border-black"}`}
                    >
                      <img
                        src={game.image_url || "https://placehold.co/100"}
                        alt={game.name}
                        className="h-full w-full object-cover"
                        style={{ imageRendering: "pixelated" }}
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-pixel text-[10px] sm:text-xs truncate mb-0.5 sm:mb-1 ${isHighlighted ? "text-black" : "text-[#fcee0a] group-hover:text-black"}`}
                      >
                        {game.name.toUpperCase()}
                      </p>
                      <p
                        className={`text-[9px] sm:text-[10px] font-bold ${isHighlighted ? "text-black/70" : "text-gray-400 group-hover:text-black"}`}
                      >
                        ৳{game.min_price || "0"} - ৳{game.max_price || "0"}
                      </p>
                    </div>
                    <div
                      className={`border-2 px-2 py-1 sm:px-3 sm:py-1.5 font-pixel text-[8px] sm:text-[9px] flex-shrink-0 ${
                        isHighlighted
                          ? "border-black bg-black text-[#fcee0a]"
                          : "border-[#fcee0a] bg-[#0a0118] text-[#fcee0a] group-hover:bg-black group-hover:text-[#fcee0a]"
                      }`}
                    >
                      PLAY
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
