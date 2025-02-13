import React from 'react'

const Search = ({ seatchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <div>
         <img src="/search.svg" alt="search" />

         <input 
            type="text" 
            placeholder="Search movie"
            value={seatchTerm}
            onChange={e => setSearchTerm(e.target.value)}
         />
      </div>
    </div>
  )
}

export default Search
