import React from 'react'
import { getInitials } from '../../utils/helper'
import { useNavigate } from 'react-router-dom'

const ProfileInfo = ({ userInfo, onLogout }) => {
  const navigate = useNavigate();
  return (
    <>
    <div className='flex items-center p-4 gap-3 hover:scale-125 transition-all duration-500'>
        
        <div 
          className='flex items-center justify-center w-10 h-10 font-medium hover:cursor-pointer rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-all linear duration-200'
          onClick={()=>navigate('/user-profile')}  
        >
            {getInitials(userInfo?.fullName)}
        </div>

        <div className='hidden sm:block text-xs'>
            <p>{userInfo?.fullName}</p>
            <button className='hover:cursor-pointer text-slate-500 hover:text-slate-800 transition-all ease-in-out duration-300' onClick={onLogout}>Logout</button>
        </div>
        
    </div>
    </>
  )
}

export default ProfileInfo