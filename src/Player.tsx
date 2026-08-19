import { useState, useEffect, useRef } from 'react';

interface PlayerProps {
  movie: any;
  onClose: () => void;
}

const Player = ({ movie, onClose }: PlayerProps) => {
  const [iframeUrl, setIframeUrl] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    async function fetchImdbId() {
      const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
      const isTV = movie.media_type === 'tv' || movie.first_air_date;
      const mediaType = isTV ? 'tv' : 'movie';
      
      try {
        const response = await fetch(`https://api.themoviedb.org/3/${mediaType}/${movie.id}/external_ids?api_key=${API_KEY}`);
        const data = await response.json();
        
        if (data.imdb_id) {
          // Streaming server configuration loaded securely from environment variables
          const streamBaseUrl = import.meta.env.VITE_STREAM_BASE_URL;
          
          if (isTV) {
            setIframeUrl(`${streamBaseUrl}/tv/${data.imdb_id}`);
          } else {
            setIframeUrl(`${streamBaseUrl}/movie/${data.imdb_id}`);
          }
        } else {
          console.log("No IMDB ID found for this title.");
        }
      } catch (error) {
        console.error("Error connecting to the API:", error);
      }
    }
    fetchImdbId();
  }, [movie]);

  // Native function to force fullscreen mode
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full z-[100] bg-black flex flex-col animate-fadeIn">
      {/* Top control bar */}
      <div className="w-full h-16 bg-black flex justify-end items-center px-8 gap-6 z-50 relative shadow-md">
        
        <button 
          onClick={toggleFullScreen}
          className="text-gray-300 text-lg md:text-xl font-semibold hover:text-white transition-colors flex items-center gap-2"
        >
          {isFullscreen ? "🗗 Exit Fullscreen" : "🖵 Fullscreen"}
        </button>

        <button 
          onClick={() => {
            if (document.fullscreenElement) document.exitFullscreen();
            onClose();
          }} 
          className="text-white text-lg md:text-xl font-bold hover:text-red-500 transition-colors flex items-center gap-2 border-l border-gray-700 pl-6"
        >
          ✕ Close
        </button>
      </div>
      
      {/* Media Player */}
      <div className="w-full flex-grow bg-novaBlack flex items-center justify-center">
        {iframeUrl ? (
          <iframe 
            ref={iframeRef}
            src={iframeUrl} 
            className="w-full h-full border-none" 
            allowFullScreen
            allow="autoplay; fullscreen; encrypted-media"
            onLoad={(e) => e.currentTarget.focus()}
            onMouseEnter={(e) => e.currentTarget.focus()}
          ></iframe>
        ) : (
          <div className="text-white text-xl font-bold px-8 text-center animate-pulse">
            Connecting to server... <br/>
            <span className="text-sm text-gray-400 font-normal">(Loading player)</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Player;