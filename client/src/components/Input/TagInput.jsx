import React, { useEffect, useState } from 'react'
import { MdClose } from 'react-icons/md'

const TagInput = ({ tags, setTags, type }) => {

    const [ inputValue, setInputValue ] = useState('')

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const addNewTag = () => {
        const trimmedValue = inputValue.trim().toLowerCase(); 
        if(trimmedValue !== ''){
            if(tags.includes(trimmedValue)) { setInputValue(''); return; }
            setTags(prevTags => [...prevTags, trimmedValue]);
            setInputValue('');
        }
    };

    const handleKeyDown = (e) =>{
        if(e.key === 'Enter'){
            addNewTag();
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };


  return (
        
    <div>
        
        { tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mt-2.5 ml-2 font-medium text-xs dark:text-slate-400">
                {tags.map((tag, index) => (
                    <span key={tag}  className='flex items-center'>
                        #{tag}
                        {type !== 'view' && <button onClick={() => { handleRemoveTag(tag); }}>
                            <MdClose className='text-slate-400 hover:text-slate-800 ml-1'/>
                        </button>}
                    </span> )
                )}
        </div> )}

        {type !== 'view' && <div className="flex items-center gap-2">
            <input 
            type="text" 
            className='w-[45%] text-sm bg-transparent px-3 py-2 rounded outline-none'
            placeholder='Add Tags'
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}/>
            <button 
                className="flex items-center justify-center w-5 h-5 rounded-md text-xs ml-2 p-1 hover:bg-gray-600 hover:text-white transition-all ease-in cursor-pointer"
                onClick={() => { addNewTag(); }}
            > 
                + 
            </button>
        </div>}


    </div>
  )
}

export default TagInput