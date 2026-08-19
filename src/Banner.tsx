import React, { useState, useEffect } from 'react';
import requests from './Requests';

const base_url_images = "https://image.tmdb.org/t/p/original/";

const Banner = () => {
  const [movie, setMovie] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(requests.fetchTrending);
        const request = await response.json();
        const randomMovie = request.results[
          Math.floor(Math.random() * request.results.length)
        ];
        setMovie(randomMovie);
      } catch (error) {
        console.error("Failed to fetch trending movies:", error);
      }
    }
    fetchData();
  }, []);

  // Truncate long text strings and append "..."
  const truncate = (str: string, n: number) => {
    return str?.length > n ? str.substring(0, n - 1) + "..." : str;
  };

  if (!movie) return <div className="w-full h-[85vh] bg-novaBlack"></div>;

  return (
    <div className="relative w-full h-[85vh]">
      {/* Dynamic background image */}
      <div className="absolute top-0 left-0 w-full h-full">
        <img 
          src={`${base_url_images}${movie?.backdrop_path || movie?.poster_path}`} 
          alt={movie?.title || movie?.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-novaBlack via-novaBlack/60 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-novaBlack to-transparent" />
      </div>

      {/* Dynamic content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-12 md:px-24 w-full md:w-1/2 pt-20">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-2xl tracking-wide">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>
        <p className="text-lg md:text-xl mb-8 drop-shadow-md text-gray-200 leading-relaxed">
          {truncate(movie?.overview, 180)}
        </p>
        
        <div className="flex gap-4">
          <button className="flex items-center justify-center gap-2 px-8 py-3 bg-white text-black font-bold rounded hover:bg-gray-300 transition duration-300">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4l12 6-12 6z" />
            </svg>
            Play
          </button>
          <button className="flex items-center justify-center gap-2 px-8 py-3 bg-novaLightGray/80 text-white font-bold rounded hover:bg-gray-500 transition duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;