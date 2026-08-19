import React, { useState, useEffect, useRef } from 'react';

const base_url_images = "https://image.tmdb.org/t/p/original/";

interface DetailsModalProps {
  movie: any;
  onClose: () => void;
  onPlay: (movie: any) => void;
  onToggleWatchlist: (movie: any) => void;
  isWatchlisted: boolean;
  isRecent: boolean;
  onRemoveRecent: (movie: any) => void;
  onMovieChange: (movie: any) => void;
  userRating: number;
  onRate: (rating: number) => void;
}

const DetailsModal = ({ movie, onClose, onPlay, onToggleWatchlist, isWatchlisted, isRecent, onRemoveRecent, onMovieChange, userRating, onRate }: DetailsModalProps) => {
  const [extraDetails, setExtraDetails] = useState<any>(null);
  const [cast, setCast] = useState<any[]>([]);
  const [director, setDirector] = useState("");
  const [similarMovies, setSimilarMovies] = useState<any[]>([]);
  
  // Internal state for star rating hover effect
  const [hoverRating, setHoverRating] = useState(0); 
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchExtendedInfo() {
      const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
      const mediaType = movie.media_type === 'tv' || movie.first_air_date ? 'tv' : 'movie';

      if (modalRef.current) modalRef.current.scrollTop = 0;

      try {
        const detailRes = await fetch(`https://api.themoviedb.org/3/${mediaType}/${movie.id}?api_key=${API_KEY}&language=en-US`);
        const detailData = await detailRes.json();
        setExtraDetails(detailData);

        const creditsRes = await fetch(`https://api.themoviedb.org/3/${mediaType}/${movie.id}/credits?api_key=${API_KEY}&language=en-US`);
        const creditsData = await creditsRes.json();
        
        if (creditsData.cast) setCast(creditsData.cast.slice(0, 5)); 
        if (creditsData.crew) {
          const dirInfo = creditsData.crew.find((member: any) => member.job === "Director" || member.job === "Executive Producer");
          setDirector(dirInfo ? dirInfo.name : "Not available");
        }

        const similarRes = await fetch(`https://api.themoviedb.org/3/${mediaType}/${movie.id}/similar?api_key=${API_KEY}&language=en-US`);
        const similarData = await similarRes.json();
        if (similarData.results) setSimilarMovies(similarData.results.slice(0, 10));

      } catch (error) {
        console.error("Failed to fetch extended details:", error);
      }
    }
    fetchExtendedInfo();
  }, [movie]);

  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : movie.first_air_date ? movie.first_air_date.split('-')[0] : "N/A";
  const rating = movie.vote_average ? (movie.vote_average / 2).toFixed(1) : "0.0";
  
  const runtime = extraDetails?.runtime 
    ? `${Math.floor(extraDetails.runtime / 60)}h ${extraDetails.runtime % 60}m` 
    : extraDetails?.episode_run_time?.[0] 
      ? `${extraDetails.episode_run_time[0]} min per ep.` 
      : "Runtime N/A";

  const genres = extraDetails?.genres ? extraDetails.genres.map((g: any) => g.name).join(', ') : "Loading genres...";

  return (
    <div className="fixed top-0 left-0 w-full h-full z-[80] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 md:p-12 animate-fadeIn">
      <div className="relative bg-novaDarkGray w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh]">
        
        <button onClick={onClose} className="absolute top-4 right-4 z-50 bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold hover:bg-novaBlue transition-colors">
          ✕
        </button>

        <div className="hidden md:block w-2/5 h-full relative flex-shrink-0">
          <img src={`${base_url_images}${movie.poster_path}`} alt={movie.title || movie.name} className="w-full h-full object-cover" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-transparent to-novaDarkGray" />
        </div>

        <div ref={modalRef} className="w-full md:w-3/5 p-6 md:p-8 flex flex-col overflow-y-auto no-scrollbar">
          
          <h2 className="text-3xl md:text-4xl font-black mb-2 text-white">
            {movie.title || movie.name}
          </h2>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4 font-semibold">
            <span className="text-novaBlue">{releaseYear}</span>
            <span className="flex items-center gap-1 bg-gray-800 px-2 py-0.5 rounded text-yellow-500">★ {rating}</span>
            <span className="bg-gray-800 px-2 py-0.5 rounded text-gray-300">{runtime}</span>
            <span className="uppercase tracking-wider text-xs bg-novaLightGray px-2 py-0.5 rounded">
              {movie.media_type === 'tv' || movie.first_air_date ? 'TV Series' : 'Movie'}
            </span>
          </div>

          <div className="text-sm text-gray-400 mb-4 space-y-1 border-b border-gray-800 pb-4">
            <p><span className="text-gray-200 font-bold">Genres:</span> {genres}</p>
            {movie.first_air_date ? null : <p><span className="text-gray-200 font-bold">Director:</span> {director}</p>}
          </div>

          <p className="text-gray-300 text-sm md:text-base mb-6 leading-relaxed">
            {movie.overview || "No overview available for this title at the moment."}
          </p>

          {cast.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-gray-200 font-bold mb-1">Main Cast:</p>
              <p className="text-xs text-gray-400 tracking-wide">{cast.map(c => c.name).join(', ')}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-4 mb-4">
            <button onClick={() => onPlay(movie)} className="flex items-center justify-center gap-2 px-6 py-2.5 bg-novaBlue text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300 shadow-lg shadow-blue-500/20">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg> Play Now
            </button>

            <button onClick={() => onToggleWatchlist(movie)} className={`flex items-center justify-center gap-2 px-5 py-2.5 font-bold rounded-lg border transition duration-300 ${isWatchlisted ? 'bg-transparent border-green-500 text-green-500 hover:bg-green-500/10' : 'bg-transparent border-gray-500 text-white hover:bg-white/10'}`}>
              {isWatchlisted ? 'In My List' : 'Add to My List'}
            </button>

            {isRecent && (
              <button onClick={() => onRemoveRecent(movie)} className="flex items-center justify-center gap-2 px-4 py-2.5 font-bold rounded-lg border bg-transparent border-red-500 text-red-500 hover:bg-red-500/10 transition duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.895-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            )}
          </div>

          {/* RATING MODULE (STARS) */}
          <div className="flex items-center gap-1 mb-8 bg-gray-900/50 p-3 rounded-lg border border-gray-800 self-start">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest mr-3">Your Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => onRate(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-2xl transition-all focus:outline-none hover:scale-110"
              >
                <span className={`drop-shadow-md ${
                  (hoverRating || userRating) >= star 
                    ? "text-yellow-400" 
                    : "text-gray-600 hover:text-yellow-400"
                }`}>
                  ★
                </span>
              </button>
            ))}
          </div>

          {similarMovies.length > 0 && (
            <div className="mt-auto border-t border-gray-800 pt-6">
              <h3 className="text-white font-bold text-lg mb-4">Similar Titles</h3>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {similarMovies.map((similar) => (
                  similar.poster_path && (
                    <img 
                      key={similar.id}
                      onClick={() => onMovieChange(similar)}
                      className="w-24 md:w-28 h-36 md:h-40 object-cover rounded cursor-pointer hover:scale-105 transition-transform duration-300 shadow-xl border border-gray-700 hover:border-novaBlue flex-shrink-0"
                      src={`${base_url_images}${similar.poster_path}`} 
                      alt={similar.title || similar.name}
                    />
                  )
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default DetailsModal;