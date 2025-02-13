import { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'

import Search from '../components/Search'
import Spinner from '../components/Spinner'
import MovieCard from '../components/MovieCard'

import { getTrendingMovies, updateSearchCount } from '../appwrite'
import './App.css'
import MovieModal from '../components/MovieModal'

const API_BASE_URL = "https://api.themoviedb.org/3/"
const API_KEY = import.meta.env.VITE_TMBD_API_KEY
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

function App() {
  const [searchTerm, setSearchTerm] = useState("")
  const [errorMessage, setErrorMessage] = useState(null)
  const [movieList, setMovieList] = useState([])
  const [isloading, setIsLoading] = useState(false)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [trendingMovies, setTrendingMovies] = useState([])

  const [selectedMovie, setSelectedMovie] = useState(null)

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000,  [searchTerm])

  const featchMovies = async(query = "", pageNumber = 1) => {
    setIsLoading(true)
    setErrorMessage("")

    try {
      const response = query ? 
        await fetch(`${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`, API_OPTIONS) : 
        await fetch(`${API_BASE_URL}/discover/movie?S&page=${pageNumber}&sort_by=popularity.desc`, API_OPTIONS)
      
      if(!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
  
      const data = await response.json()
      
      if(data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies")
        setMovieList([])
        return
      }
      console.log(data);
      
      setMovieList(data.results || [])
      setTotalPages(data.total_pages)

      if(query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.log(`Error getching movies: ${error}`)
      setErrorMessage("Error getching movies. Please try again later")

      return null
    } finally {
      setIsLoading(false)
    }
  }

  const loadTrendinfMovies = async () => {
    try {
      const movies = await getTrendingMovies()
      
      setTrendingMovies(movies)
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`)
    }
  }

  const generatePageNumbers = () => {
    const pages = []
    for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
      pages.push(i);
    }
    return pages
  }

  useEffect(() => {
    featchMovies(debouncedSearchTerm, page)   
  }, [debouncedSearchTerm, page])

  useEffect(() => {
    loadTrendinfMovies()
  }, [])

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="/hero-img.png" alt="Hero banner" />
          <h1 className="">Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} className="rounded-md" />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2 className="mt-10">All Movies</h2>

          {isloading ? 
            <Spinner /> : 
            (errorMessage ? 
              (<p className="text-red-400">{errorMessage}</p>) :
              (<>
                <div className="pagination flex items-center gap-1 mt-3 flex-wrap">
                  <button 
                    onClick={() => setPage(1)} 
                    disabled={page === 1}
                    className="px-2 py-1 text-s bg-gray-200 rounded-md disabled:opacity-50 cursor-pointer"
                  >
                    ≪
                  </button>

                  <button 
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))} 
                    disabled={page === 1}
                    className="px-2 py-1 text-s bg-gray-200 rounded-md disabled:opacity-50 cursor-pointer"
                  >
                    &lt;
                  </button>

                  {generatePageNumbers().map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      className={`px-2 py-1 text-s rounded-md cursor-pointer ${
                        pageNumber === page 
                          ? "bg-purple-400 text-white font-bold" 
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  <button 
                    onClick={() => setPage(prev => (prev < totalPages ? prev + 1 : prev))} 
                    disabled={page >= totalPages}
                    className="px-2 py-1 text-s bg-gray-200 rounded-md disabled:opacity-50 cursor-pointer"
                  >
                    &gt;
                  </button>

                  <button 
                    onClick={() => totalPages && setPage(totalPages)} 
                    disabled={page === totalPages || !totalPages}  
                    className="px-2 py-1 text-s bg-gray-200 rounded-md disabled:opacity-50 cursor-pointer"
                  >
                    ≫
                  </button>
                </div>

                <ul>
                  {movieList.map(movie => <MovieCard key={movie.id} movie={movie} onClick={() => setSelectedMovie(movie)} />)}
                </ul>
              </>))
            }
        </section>
      </div>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </main>
  )
}

export default App
