import React, { useEffect, useState } from 'react'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'
import { BsFillPinFill } from "react-icons/bs";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch, pinnedNotes }) => {

  const [ getPinnedNotes, setGetPinnedNotes ] = useState(false);

  const handlePinSearch = () => {
    setGetPinnedNotes((prev) => !prev);
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.value ? handleSearch() : onClearSearch();
    }
  }

  useEffect(()=>{
    if (getPinnedNotes) {
      pinnedNotes();
    } else {
      onClearSearch();
    }
  },[getPinnedNotes]);

  return (
    <div className='w-80 flex items-center justify-center px-4 rounded'>
        <input
          type="text"
          placeholder='Search notes'
          className='w-1/2 sm:w-full text-xs bg-transparent outline-none py-[11px] mt-2'
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
        />
        {value && <IoMdClose className='text-slate-400 mr-2 cursor-pointer hover:text-black' onClick={onClearSearch}/>}
        <FaMagnifyingGlass className='text-slate-400 cursor-pointer hover:text-black' onClick={handleSearch}/>
        <BsFillPinFill className={`ml-6 sm:ml-10 cursor-pointer text-xl hover:text-slate-600 duration-300 ${getPinnedNotes ? 'text-black' : 'text-slate-400'}`} onClick={handlePinSearch} />
    </div>
  )
}

export default SearchBar