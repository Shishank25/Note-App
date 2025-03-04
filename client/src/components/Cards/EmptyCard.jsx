import React from 'react'
import { CgAdd } from 'react-icons/cg'
import { GiTumbleweed } from "react-icons/gi";


const EmptyCard = ({ setOpenAddEditModal, isSearch }) => {
  return (
    <div className='flex flex-col justify-evenly items-center text-slate-800 rounded-2xl h-65 w-50 border border-slate-400 mt-4 hover:shadow-2xl transition-all ease-in-out dark:text-slate-300'> 
        {isSearch ? <GiTumbleweed className='text-8xl font-medium hover:animate-[spin_2s_linear_infinite]'/> : <CgAdd 
            className='text-8xl font-medium transition-all ease-in-out duration-500 hover:scale-125 cursor-pointer'
            onClick={()=>{
                setOpenAddEditModal({ isShown: true, type: 'add', data: null });
                }}
            />}
        {isSearch ? <p className='text-center font-medium'> No Notes Found </p> : 
        <p className='text-center font-medium'>
            No notes yet.{<br/>}Press the 'Add' icon to start.
        </p>}
    </div>
  )
}

export default EmptyCard