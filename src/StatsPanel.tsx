import React, { useEffect, useState } from 'react';

interface StatsPanelProps {
  onClose: () => void;
}

const StatsPanel = ({ onClose }: StatsPanelProps) => {
  const [historyCount, setHistoryCount] = useState(0);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [moviesCount, setMoviesCount] = useState(0);
  const [tvCount, setTvCount] = useState(0);

  // Analytics State
  const [isLoading, setIsLoading] = useState(true);
  const [topActor, setTopActor] = useState({ name: '', count: 0 });
  const [topDirector, setTopDirector] = useState({ name: '', count: 0 });
  const [topGenre, setTopGenre] = useState({ name: '', count: 0 });
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("novaPlay_recent") || "[]");
    const watchlist = JSON.parse(localStorage.getItem("novaPlay_watchlist") || "[]");

    setHistoryCount(recent.length);
    setWatchlistCount(watchlist.length);

    let mCount = 0;
    let tCount = 0;
    
    recent.forEach((item: any) => {
      if (item.media_type === 'tv' || item.first_air_date) tCount++;
      else mCount++;
    });

    setMoviesCount(mCount);
    setTvCount(tCount);

    // Core Function: Deep Data Analyzer
    async function calculateDeepStats() {
      if (recent.length === 0) {
        setIsLoading(false);
        return;
      }

      const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
      let actorsMap: Record<string, number> = {};
      let directorsMap: Record<string, number> = {};
      let genresMap: Record<string, number> = {};
      let minutesWatched = 0;

      // Fetch all items concurrently to reduce wait time
      const promises = recent.map((item: any) => {
        const mediaType = item.media_type === 'tv' || item.first_air_date ? 'tv' : 'movie';
        // append_to_response=credits fetches movie and cast in a single call
        return fetch(`https://api.themoviedb.org/3/${mediaType}/${item.id}?api_key=${API_KEY}&language=en-US&append_to_response=credits`)
          .then(res => res.json())
          .catch(() => null);
      });

      const results = await Promise.all(promises);

      results.forEach(data => {
        if (!data) return;

        // Calculate total hours
        if (data.runtime) minutesWatched += data.runtime;
        if (data.episode_run_time && data.episode_run_time.length > 0) minutesWatched += data.episode_run_time[0];

        // Tally genres
        if (data.genres) {
          data.genres.forEach((g: any) => {
            genresMap[g.name] = (genresMap[g.name] || 0) + 1;
          });
        }

        // Tally directors and actors
        if (data.credits) {
          if (data.credits.cast) {
            // Only count the top 4 billed actors to avoid extras
            data.credits.cast.slice(0, 4).forEach((c: any) => {
              actorsMap[c.name] = (actorsMap[c.name] || 0) + 1;
            });
          }
          if (data.credits.crew) {
            const directors = data.credits.crew.filter((c: any) => c.job === 'Director' || c.job === 'Executive Producer');
            directors.forEach((d: any) => {
              directorsMap[d.name] = (directorsMap[d.name] || 0) + 1;
            });
          }
        }
      });

      // Utility to find the winner in each category
      const getTop = (map: Record<string, number>) => {
        let max = 0;
        let topKey = 'None';
        for (const [key, value] of Object.entries(map)) {
          if (value > max) {
            max = value;
            topKey = key;
          }
        }
        return { name: topKey, count: max };
      };

      setTopActor(getTop(actorsMap));
      setTopDirector(getTop(directorsMap));
      setTopGenre(getTop(genresMap));
      setTotalHours(Math.round(minutesWatched / 60));
      setIsLoading(false);
    }

    calculateDeepStats();
  }, []);

  const totalWatched = moviesCount + tvCount;
  const moviePercentage = totalWatched === 0 ? 0 : Math.round((moviesCount / totalWatched) * 100);
  const tvPercentage = totalWatched === 0 ? 0 : Math.round((tvCount / totalWatched) * 100);

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-12 animate-fadeIn overflow-y-auto no-scrollbar">
      
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 md:top-12 md:right-12 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold bg-gray-800 hover:bg-novaBlue transition-colors z-50 text-xl"
      >
        ✕
      </button>

      <div className="w-full max-w-5xl flex flex-col items-center text-center py-12 mt-10 md:mt-0">
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-novaBlue to-purple-500 mb-2 tracking-tighter">
          Your NovaStats
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mb-12">
          The exact anatomy of your cinematic consumption.
        </p>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="w-12 h-12 border-4 border-novaBlue border-t-transparent rounded-full animate-spin"></div>
            <p className="text-novaBlue font-bold animate-pulse">Analyzing your credits and genres...</p>
          </div>
        ) : (
          <>
            {/* DEEP METRICS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full mb-8">
              
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center transform hover:-translate-y-2 transition-transform duration-300">
                <span className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-3">Titles Watched</span>
                <span className="text-4xl md:text-5xl font-black text-white">{historyCount}</span>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center transform hover:-translate-y-2 transition-transform duration-300">
                <span className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-3">Total Hours</span>
                <span className="text-4xl md:text-5xl font-black text-novaBlue">{totalHours}</span>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center transform hover:-translate-y-2 transition-transform duration-300">
                <span className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-3">Top Genre</span>
                <span className="text-xl md:text-2xl font-black text-purple-400 text-center leading-tight">
                  {topGenre.count > 0 ? topGenre.name : '-'}
                </span>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center transform hover:-translate-y-2 transition-transform duration-300">
                <span className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-3">In Watchlist</span>
                <span className="text-4xl md:text-5xl font-black text-green-500">{watchlistCount}</span>
              </div>

            </div>

            {/* TALENT SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8">
              <div className="bg-novaDarkGray border border-gray-800 p-8 rounded-2xl flex flex-col items-center text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-novaBlue/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-4">Top Cast Member</span>
                <span className="text-3xl font-black text-white mb-2">{topActor.count > 0 ? topActor.name : 'Not enough data'}</span>
                {topActor.count > 0 && <span className="text-sm text-novaBlue bg-novaBlue/10 px-3 py-1 rounded-full">Appears in {topActor.count} titles</span>}
              </div>

              <div className="bg-novaDarkGray border border-gray-800 p-8 rounded-2xl flex flex-col items-center text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-4">Favorite Director</span>
                <span className="text-3xl font-black text-white mb-2">{topDirector.count > 0 ? topDirector.name : 'Not enough data'}</span>
                {topDirector.count > 0 && <span className="text-sm text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full">Appears in {topDirector.count} titles</span>}
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="w-full bg-novaDarkGray border border-gray-800 p-8 rounded-2xl text-left">
              <h3 className="text-white font-bold text-xl mb-6">Format Trend</h3>
              
              <div className="flex justify-between text-sm font-bold text-gray-400 mb-2">
                <span>Movies ({moviePercentage}%)</span>
                <span>TV Shows ({tvPercentage}%)</span>
              </div>
              
              <div className="w-full h-4 flex rounded-full overflow-hidden bg-gray-800">
                <div className="bg-novaBlue h-full transition-all duration-1000 ease-out" style={{ width: `${moviePercentage}%` }}></div>
                <div className="bg-purple-500 h-full transition-all duration-1000 ease-out" style={{ width: `${tvPercentage}%` }}></div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default StatsPanel;