import { useState, useEffect } from 'react'
import './App.css'

function App() {


  const API_KEY = "561e4195"

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filt, setFilt] = useState("All");
  const [selectedMovie, setSelectedMovie] = useState(null);

  const fetchMovie = async (title, type = "All") => {
    if (!title) return;
    setLoading(true);
    try {
      let typeQuery = "";
      if (type === "Movies") typeQuery = "&type=movie";
      if (type === "Series") typeQuery = "&type=series";

      const res = await fetch(`https://www.omdbapi.com/?s=${title}${typeQuery}&apikey=${API_KEY}`)
      const data = await res.json();

      if (data.Search) {
        setMovies(data.Search);
      } else {
        setMovies([])
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const fetchMovieDetails = async (id) => {
    try {
      const res = await fetch(`https://www.omdbapi.com/?i=${id}&plot=full&apikey=${API_KEY}`);
      const data = await res.json();
      setSelectedMovie(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMovie(search || "Movies", filt);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, filt]);

  return (
    <div className="bg-[#050505] text-zinc-100 min-h-screen font-sans selection:bg-blue-500/30">
      {/* Cinematic Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-blue-600/10 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 flex flex-col items-center gap-12 md:gap-20">

        {/* Header Section */}
        <div className="flex flex-col items-center text-center gap-6 max-w-3xl">
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Explore the Universe
          </div> */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
            Discover Movies <br /> Worth Watching
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-xl">
            Search thousands of movies and series instantly.
          </p>
        </div>

        {/* Search Bar & Tabs */}
        <div className="w-full max-w-2xl flex flex-col gap-6">
          <div className="relative flex items-center w-full gap-2 p-1.5 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl focus-within:border-zinc-700 focus-within:bg-zinc-900/90 transition-all duration-300 shadow-sm">
            <div className="pl-4 text-zinc-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <input
              type="text"
              placeholder="Search for movies, series..."
              className="w-full px-2 py-3 rounded-xl bg-transparent text-zinc-100 focus:outline-none placeholder:text-zinc-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button 
                onClick={() => setSearch("")}
                className="pr-4 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            )}
          </div>

          <div className="flex justify-center gap-2">
            {["All", "Movies", "Series"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilt(tab)}
                className={`px-8 py-2.5 rounded-full border text-sm font-semibold transition-all cursor-pointer ${filt === tab
                  ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  : "bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Movie Grid */}
        <div className="w-full flex flex-col gap-10">
          <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
            <h2 className="text-2xl font-bold text-zinc-100">
              {search ? `Results for "${search}"` : "Trending Movies"}
            </h2>
            <span className="text-zinc-500 text-sm">{movies.length} titles found</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
            {loading ? (
              [...Array(10)].map((_, i) => (
                <div key={i} className="flex flex-col gap-4 animate-pulse">
                  <div className="aspect-[2/3] w-full bg-zinc-900 rounded-2xl border border-zinc-800" />
                  <div className="h-4 w-3/4 bg-zinc-900 rounded" />
                  <div className="h-3 w-1/2 bg-zinc-900 rounded" />
                </div>
              )) /*animate skeleton loader while page is loading*/
            ) : (
              movies.map(movie => (
                <div
                  key={movie.imdbID}
                  className="group flex flex-col gap-3 cursor-pointer"
                  onClick={() => fetchMovieDetails(movie.imdbID)}
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-[2/3] bg-zinc-900 border border-zinc-800 transition-transform duration-500 group-hover:-translate-y-2">
                    <img
                      src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Image"}
                      alt={movie.Title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <button className="w-full py-2 bg-blue-600 rounded-lg text-sm font-bold text-white shadow-lg shadow-blue-600/20">
                        View Details
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold text-zinc-100 truncate group-hover:text-blue-400 transition-colors">
                      {movie.Title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-zinc-500">
                      <span>{movie.Year}</span>
                      <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] uppercase font-bold tracking-widest">{movie.Type}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {!loading && movies.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
              <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-700 border border-zinc-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-zinc-200">No movies found</h3>
                <p className="text-zinc-500 max-w-xs">We couldn't find anything matching "{search}". Try checking your spelling or using different keywords.</p>
              </div>
              {search && (
                <button 
                  onClick={() => setSearch("")}
                  className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-full text-sm font-medium transition-colors border border-zinc-700 cursor-pointer"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedMovie(null)}
          />
          <div className="relative bg-zinc-900 border border-zinc-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col md:flex-row gap-8 p-6 md:p-10 animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setSelectedMovie(null)}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors z-10"
            >
              ✕
            </button>

            <div className="w-full md:w-1/3 shrink-0">
              <img
                src={selectedMovie.Poster !== "N/A" ? selectedMovie.Poster : "https://via.placeholder.com/300x450"}
                alt={selectedMovie.Title}
                className="w-full rounded-2xl shadow-2xl border border-zinc-800"
              />
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">{selectedMovie.Type}</span>
                  <span className="text-zinc-500 text-sm">{selectedMovie.Runtime}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">{selectedMovie.Title}</h2>
                <div className="flex items-center gap-4 text-zinc-400 text-sm">
                  <span>{selectedMovie.Year}</span>
                  <span>•</span>
                  <span>{selectedMovie.Genre}</span>
                  <span>•</span>
                  <span className="text-yellow-500 font-bold">{selectedMovie.imdbRating}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Plot</h4>
                <p className="text-zinc-300 leading-relaxed">{selectedMovie.Plot}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Director</h4>
                  <p className="text-zinc-100 text-sm font-medium">{selectedMovie.Director}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Cast</h4>
                  <p className="text-zinc-100 text-sm font-medium">{selectedMovie.Actors}</p>
                </div>
              </div>

              <div className="mt-4 flex gap-4">
                <button className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                  Watch Now
                </button>
                <button className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold transition-all active:scale-95 border border-zinc-700">
                  Add to List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-zinc-900 mt-20 py-10 text-center text-zinc-600 text-sm">
        <p>© 2026 Dotman MovieHub. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
