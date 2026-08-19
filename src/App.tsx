import React, { useState, useEffect } from 'react';
import Banner from './Banner';
import Row from './Row';
import SearchResults from './SearchResults';
import Player from './Player';
import DetailsModal from './DetailsModal';
import StatsPanel from './StatsPanel';
import requests from './Requests';

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [playingMovie, setPlayingMovie] = useState<any | null>(null);
  const [selectedMovieForModal, setSelectedMovieForModal] = useState<any | null>(null);
  
  const [recentMovies, setRecentMovies] = useState<any[]>([]);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const savedRecent = localStorage.getItem("novaPlay_recent");
    const savedWatchlist = localStorage.getItem("novaPlay_watchlist");
    const savedRatings = localStorage.getItem("novaPlay_ratings");
    
    if (savedRecent) setRecentMovies(JSON.parse(savedRecent));
    if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));
    if (savedRatings) setRatings(JSON.parse(savedRatings));
  }, []);

  const handlePosterClick = (movie: any) => {
    setSelectedMovieForModal(movie);
  };

  const handlePlayMovie = (movie: any) => {
    setPlayingMovie(movie); 
    setSelectedMovieForModal(null); 

    const filtered = recentMovies.filter(m => m.id !== movie.id);
    const newList = [movie, ...filtered].slice(0, 15);
    setRecentMovies(newList);
    localStorage.setItem("novaPlay_recent", JSON.stringify(newList));
  };

  const handleToggleWatchlist = (movie: any) => {
    const isAlreadyThere = watchlist.some(m => m.id === movie.id);
    let newList = [];

    if (isAlreadyThere) {
      newList = watchlist.filter(m => m.id !== movie.id); 
    } else {
      newList = [movie, ...watchlist]; 
    }

    setWatchlist(newList);
    localStorage.setItem("novaPlay_watchlist", JSON.stringify(newList));
  };

  const handleRemoveRecent = (movieToRemove: any) => {
    const newList = recentMovies.filter(m => m.id !== movieToRemove.id);
    setRecentMovies(newList); 
    localStorage.setItem("novaPlay_recent", JSON.stringify(newList)); 
    setSelectedMovieForModal(null); 
  };

  const handleRateMovie = (movieId: number, rating: number) => {
    const newRatings = { ...ratings, [movieId]: rating };
    setRatings(newRatings);
    localStorage.setItem("novaPlay_ratings", JSON.stringify(newRatings));
  };

  // Generate personalized recommendations based on the highest rated recent title
  const getRecommendationData = () => {
    const favoriteRecent = recentMovies.find(m => ratings[m.id] >= 4);

    if (favoriteRecent) {
      const mediaType = favoriteRecent.media_type === 'tv' || favoriteRecent.first_air_date ? 'tv' : 'movie';
      // Securely calling the API key from environment variables
      const apiKey = import.meta.env.VITE_TMDB_API_KEY; 
      const url = `https://api.themoviedb.org/3/${mediaType}/${favoriteRecent.id}/recommendations?api_key=${apiKey}&language=en-US`;
      return {
        title: `Because you liked "${favoriteRecent.title || favoriteRecent.name}"`,
        url: url
      };
    }
    return null;
  };

  const personalizedRecommendation = getRecommendationData();

  return (
    <div className="relative w-full h-screen bg-novaBlack text-white overflow-x-hidden overflow-y-auto no-scrollbar">
      
      {playingMovie && (
        <Player movie={playingMovie} onClose={() => setPlayingMovie(null)} />
      )}

      {selectedMovieForModal && (
        <DetailsModal 
          movie={selectedMovieForModal} 
          onClose={() => setSelectedMovieForModal(null)}
          onPlay={handlePlayMovie}
          onToggleWatchlist={handleToggleWatchlist}
          isWatchlisted={watchlist.some(m => m.id === selectedMovieForModal.id)}
          isRecent={recentMovies.some(m => m.id === selectedMovieForModal.id)}
          onRemoveRecent={handleRemoveRecent}
          onMovieChange={handlePosterClick}
          userRating={ratings[selectedMovieForModal.id] || 0}
          onRate={(rating) => handleRateMovie(selectedMovieForModal.id, rating)}
        />
      )}

      {showStats && (
        <StatsPanel onClose={() => setShowStats(false)} />
      )}

      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-12 py-6 bg-gradient-to-b from-black/90 to-black/30 backdrop-blur-sm transition-all duration-300">
        <div className="flex items-center gap-12">
          <div onClick={() => setSearchTerm("")} className="text-novaBlue text-4xl font-black tracking-wider cursor-pointer hover:scale-105 transition-transform">
            NOVAPLAY
          </div>
          <ul className="hidden md:flex gap-6 text-sm text-gray-200">
            <li className="font-bold text-white cursor-pointer" onClick={() => setSearchTerm("")}>Home</li>
            <li className="hover:text-gray-400 cursor-pointer transition">Series</li>
            <li className="hover:text-gray-400 cursor-pointer transition">Movies</li>
          </ul>
        </div>
        <div className="flex items-center gap-6 text-white">
          <div className="relative flex items-center bg-novaDarkGray border border-gray-700 rounded overflow-hidden focus-within:border-novaBlue transition-colors">
            <svg className="w-5 h-5 ml-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Titles, people, genres"
              className="bg-transparent border-none outline-none text-sm text-white px-3 py-2 w-48 focus:w-64 transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="pr-3 text-gray-400 hover:text-white">✕</button>
            )}
          </div>
          <span className="text-xs text-gray-400 tracking-widest uppercase hidden lg:block">By Alan Pichardo</span>
          
          <div 
            onClick={() => setShowStats(true)} 
            className="w-8 h-8 bg-gray-600 rounded cursor-pointer hover:ring-2 hover:ring-novaBlue transition-all shadow-lg"
          ></div>
        </div>
      </nav>
      
      {searchTerm.length > 0 ? (
        <SearchResults searchQuery={searchTerm} onMovieClick={handlePosterClick} />
      ) : (
        <>
          <Banner />
          <div className="pb-24 -mt-32 relative z-20">
            
            {watchlist.length > 0 && (
              <Row title="My List" moviesData={watchlist} onMovieClick={handlePosterClick} />
            )}

            {recentMovies.length > 0 && (
              <Row title="Continue Watching" moviesData={recentMovies} onMovieClick={handlePosterClick} />
            )}

            {personalizedRecommendation && (
              <div className="border-l-4 border-novaBlue ml-4 md:ml-12 pl-2">
                <Row title={personalizedRecommendation.title} fetchUrl={personalizedRecommendation.url} onMovieClick={handlePosterClick} />
              </div>
            )}
            
            <Row title="In Theaters" fetchUrl={requests.fetchNowPlaying} onMovieClick={handlePosterClick} />
            <Row title="Marvel Cinematic Universe" fetchUrl={requests.fetchMarvel} onMovieClick={handlePosterClick} />
            <Row title="Star Wars Saga" fetchUrl={requests.fetchStarWars} onMovieClick={handlePosterClick} />
            <Row title="Trending Now" fetchUrl={requests.fetchTrending} onMovieClick={handlePosterClick} />
            <Row title="Critically Acclaimed" fetchUrl={requests.fetchTopRated} onMovieClick={handlePosterClick} />
            <Row title="Explosive Action" fetchUrl={requests.fetchActionMovies} onMovieClick={handlePosterClick} />
            <Row title="Comedies" fetchUrl={requests.fetchComedyMovies} onMovieClick={handlePosterClick} />
            <Row title="Horror" fetchUrl={requests.fetchHorrorMovies} onMovieClick={handlePosterClick} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;