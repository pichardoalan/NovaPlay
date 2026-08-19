import React, { useState, useEffect, useRef } from 'react';

const base_url_images = "https://image.tmdb.org/t/p/original/";

interface RowProps {
  title: string;
  fetchUrl?: string; 
  moviesData?: any[]; 
  onMovieClick: (movie: any) => void; 
}

const Row = ({ title, fetchUrl, moviesData, onMovieClick }: RowProps) => {
  const [movies, setMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true); 
  
  // Reference to control the scroll container
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fetchUrl) {
      async function fetchData() {
        setIsLoading(true);
        try {
          const response = await fetch(fetchUrl as string);
          const request = await response.json();
          // Fallback to empty array if request.results fails
          setMovies(request.results || []);
        } catch (error) {
          console.error("Error fetching row data:", error);
          setMovies([]);
        } finally {
          setIsLoading(false);
        }
      }
      fetchData();
    } 
    else if (moviesData) {
      setMovies(moviesData);
      setIsLoading(false);
    }
  }, [fetchUrl, moviesData]);

  // Handle horizontal scrolling behavior
  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      // Scroll by the current visible width
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (movies.length === 0 && !isLoading) return null;

  const skeletons = [...Array(10)];

  return (
    <div className="mt-8 mb-8 relative group">
      <h2 className="text-white text-xl md:text-2xl font-bold mb-4 drop-shadow-sm tracking-wide pl-12 md:pl-24">
        {title}
      </h2>
      
      <div className="relative">
        {/* Left Scroll Arrow */}
        <button 
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-0 bottom-0 z-40 w-12 md:w-16 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
        </button>

        {/* Scroll Container */}
        <div ref={rowRef} className="flex overflow-x-scroll overflow-y-hidden gap-4 no-scrollbar py-4 px-12 md:px-24">
          {isLoading ? (
            skeletons.map((_, index) => (
              <div key={index} className="w-32 md:w-48 h-48 md:h-72 bg-novaLightGray/50 rounded flex-shrink-0 animate-pulse border border-novaLightGray"></div>
            ))
          ) : (
            movies.map((movie) => (
              movie.poster_path && (
                <img 
                  key={movie.id}
                  onClick={() => onMovieClick(movie)} 
                  className="w-32 md:w-48 h-48 md:h-72 object-cover rounded cursor-pointer hover:scale-105 transition-transform duration-300 shadow-xl border border-novaLightGray/30 hover:border-novaBlue flex-shrink-0"
                  src={`${base_url_images}${movie.poster_path}`} 
                  alt={movie.title || movie.name}
                />
              )
            ))
          )}
        </div>

        {/* Right Scroll Arrow */}
        <button 
          onClick={() => handleScroll('right')}
          className="absolute right-0 top-0 bottom-0 z-40 w-12 md:w-16 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
};

export default Row;