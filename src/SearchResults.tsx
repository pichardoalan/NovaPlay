import React, { useState, useEffect } from 'react';
import requests from './Requests';

const base_url_images = "https://image.tmdb.org/t/p/original/";

interface SearchProps {
  searchQuery: string;
  onMovieClick: (movie: any) => void;
}

const SearchResults = ({ searchQuery, onMovieClick }: SearchProps) => {
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    async function fetchSearch() {
      if (!searchQuery) return;
      try {
        const response = await fetch(`${requests.searchMovies}${searchQuery}`);
        const request = await response.json();
        setMovies(request.results || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setMovies([]);
      }
    }
    fetchSearch();
  }, [searchQuery]);

  return (
    <div className="pt-32 px-12 md:px-24 pb-24 w-full min-h-screen bg-novaBlack">
      <h2 className="text-white text-2xl font-bold mb-8">
        Results for: <span className="text-novaBlue">"{searchQuery}"</span>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {movies.map((movie) => (
          movie.poster_path && (
            <img 
              key={movie.id}
              onClick={() => onMovieClick(movie)}
              className="w-full h-auto object-cover rounded cursor-pointer hover:scale-105 transition-transform duration-300 shadow-xl border border-novaLightGray/30 hover:border-novaBlue"
              src={`${base_url_images}${movie.poster_path}`} 
              alt={movie.title || movie.name}
            />
          )
        ))}
      </div>
      {movies.length === 0 && searchQuery && (
        <p className="text-gray-400 text-lg mt-8">No titles found for this search.</p>
      )}
    </div>
  );
};

export default SearchResults;