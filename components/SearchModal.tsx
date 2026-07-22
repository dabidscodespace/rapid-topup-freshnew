'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Gamepad2 } from 'lucide-react';
import Link from 'next/link';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      return;
    }

    const fetchGames = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_WP_URL}/wp-json/headless/v1/products`);
        const data = await res.json();
        setResults(data.data || []);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, [isOpen]);

  // Filter results based on query (even single character)
  const filteredGames = query.length > 0 
    ? results.filter((game) =>
        game.name.toLowerCase().includes(query.toLowerCase())
      )
    : []; // Show empty state when no query

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-3xl border-4 border-[#00f0ff] bg-[#0a0118] shadow-hard-cyan z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* CRT Overlay */}
        <div className="absolute inset-0 crt-overlay opacity-20 pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center border-b-4 border-[#ff00de] p-4 md:p-6 bg-[#1a0b2e]">
          <Search className="h-6 w-6 text-[#00f0ff] mr-4" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="TYPE TO SEARCH GAMES..."
            className="flex-1 bg-transparent font-pixel text-sm md:text-base text-[#fcee0a] placeholder-gray-600 focus:outline-none"
            autoComplete="off"
          />
          <button 
            onClick={onClose}
            className="ml-4 border-2 border-[#ff00de] bg-[#0a0118] px-3 py-2 font-pixel text-[10px] text-[#ff00de] hover:bg-[#ff00de] hover:text-white transition-colors btn-press"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="relative z-10 max-h-[60vh] overflow-y-auto p-4 bg-[#0a0118]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="font-pixel text-[10px] text-[#00f0ff] mb-4 animate-pulse">
                LOADING...
              </div>
              <div className="h-2 w-32 bg-[#00f0ff] animate-pulse" />
            </div>
          ) : query.length === 0 ? (
            <div className="py-12 text-center">
              <Gamepad2 className="h-12 w-12 text-[#ff00de] mx-auto mb-4" />
              <p className="font-pixel text-xs text-[#fcee0a] mb-2">
                INSERT COIN TO START
              </p>
              <p className="text-sm text-gray-400 font-bold">
                TYPE TO SEARCH GAMES...
              </p>
            </div>
          ) : filteredGames.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="font-pixel text-xs text-[#ff00de] mb-2">
                NO MATCH FOUND
              </p>
              <p className="text-sm text-gray-400 font-bold">
                TRY DIFFERENT SEARCH TERM
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="font-pixel text-[10px] text-[#00f0ff] mb-4 border-b-2 border-[#00f0ff] pb-2">
                FOUND {filteredGames.length} GAME{filteredGames.length !== 1 ? 'S' : ''}
              </div>
              {filteredGames.map((game) => (
                <Link 
                  key={game.id} 
                  href={`/products/${game.slug}`} 
                  onClick={onClose}
                  className="flex items-center gap-4 border-2 border-[#00f0ff] bg-[#1a0b2e] p-4 hover:bg-[#00f0ff] hover:text-black transition-all btn-press group"
                >
                  <div className="h-12 w-12 border-2 border-[#ff00de] bg-[#0a0118] overflow-hidden flex-shrink-0 group-hover:border-black">
                    <img 
                      src={game.image_url || 'https://placehold.co/100'} 
                      alt={game.name} 
                      className="h-full w-full object-cover"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-pixel text-xs text-[#fcee0a] truncate group-hover:text-black mb-1">
                      {game.name.toUpperCase()}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold group-hover:text-black">
                      ৳{game.min_price} - ৳{game.max_price}
                    </p>
                  </div>
                  <div className="border-2 border-[#fcee0a] bg-[#0a0118] px-3 py-2 font-pixel text-[8px] text-[#fcee0a] group-hover:bg-black group-hover:text-[#fcee0a]">
                    PLAY
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}