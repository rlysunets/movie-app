import React from 'react'

const MovieCard = ({ movie, onClick }) => {
  return (
   <li className="movie-card" onClick={onClick}>
      <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : "/no-movie.png"} alt={`${movie.title} poster`} />
      <div className="mt-4">
         <h4 className="text-amber-50 text-sm">{movie.title}</h4>
         <div className="content">
            <div className="rating">
               <img src="/Rating.svg" alt="Rating star" />
               <p>{movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</p>
            </div>

            <span>·</span>
            <p className="lang">{movie.original_language}</p>

            <span>·</span>
            <p className="year">{movie.release_date ? movie.release_date.split("-")[0] : "N/A"}</p>
         </div>
      </div>
   </li>
  )
}

export default MovieCard
