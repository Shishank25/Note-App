import React, { useState } from 'react'
import ProfileInfo from '../Cards/ProfileInfo'
import SearchBar from '../SearchBar/SearchBar'
import { useNavigate } from 'react-router-dom'

const Navbar = ({ userInfo, onSearchNote, handleClearSearch, pinnedNotes }) => {

  const [ searchQuery, setSearchQuery ] = useState("");
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if ( searchQuery ) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  }

  return (
    <>
      <div className="flex bg-white items-center justify-between px-3 sm:px-6 py-2 drop-shadow dark:bg-neutral-900">
          <h2 className='text-xl font-medium text-black py-2 dark:bg-neutral-900 dark:text-slate-50'> .notes </h2>

          <SearchBar 
            value={searchQuery} 
            onChange={({ target })=> {setSearchQuery(target.value)}} 
            handleSearch={handleSearch} 
            onClearSearch={onClearSearch}
            pinnedNotes={pinnedNotes}
          />

          <ProfileInfo userInfo={userInfo} onLogout={onLogout}/>
      </div>

    </>
  )
}

export default Navbar