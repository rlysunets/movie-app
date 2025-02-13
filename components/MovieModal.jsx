const MovieModal = ({ movie, onClose }) => {
   if (!movie) return null
 
   return (
     <div className="modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
       <div className="bg-white rounded-lg p-6 pt-10 w-96 max-h-[80vh] overflow-y-auto relative">
         <button 
           onClick={onClose} 
           className="absolute top-2 right-2 text-gray-700 hover:text-black text-lg cursor-pointer"
         >
           ✖
         </button>
         
         <img 
           src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
           alt={movie.title} 
           className="rounded-lg mb-3"
         />
         <h2 className="text-xl font-bold mb-2 text-blue-500">{movie.title}</h2>
         <p className="text-gray-700">{movie.overview}</p>
         <p className="mt-2 text-sm text-gray-500">⭐ {movie.vote_average} / 10</p>
       </div>
     </div>
   )
 }
 
export default MovieModal