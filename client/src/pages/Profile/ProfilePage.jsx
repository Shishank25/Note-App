import React, { useState, useEffect } from 'react'
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

import { LuPower } from "react-icons/lu";

const ProfilePage = () => {

    const [ userInfo, setUserInfo ] = useState(null);
    const [ firstName, setFirstName ] = useState('');
    const [ changeType, setChangeType ] = useState('');

    const [ name, setName ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ error, setError ] = useState('');

    const navigate = useNavigate();

    const getUserInfo = async () => {
        try {
          const response = await axiosInstance.get('/get-user');
          if ( response.data && response.data.user ) {
            setUserInfo(()=>{
                const user = response.data.user;
                setFirstName(user.fullName.split(' ')[0]);
                return user;
            } );
          } 
        } catch (error) {
            if(error.response.status === 401) {
              localStorage.clear();
              navigate('/login');
            }
        }
      };

    const handleRequest = async () => {
        if (changeType === 'name') {
            try {
                const response = await axiosInstance.put('/change-name', { newName: name });
                
                if (response.data) {
                    console.log(response.data.message);
                    setError(response.data.message);
                }
            } catch (error) {
                console.log('Something went wrong');
                return;
            }
        } 
        if (changeType === 'password') {
            try {
                const response = await axiosInstance.put('/change-password', { newPassword: password });

                if (response.data) {
                    console.log('response: ',response.data.message);
                    setError(response.data.message);
                }
            } catch (error) {
                setError(error.response.data.message);
                return;
            }
        }

        getUserInfo();
        setChangeType('');
        setTimeout(()=>setError(''),3000);
    }

    const clearChange = () => {
        setChangeType('');
        setName('');
        setPassword('');
        setError('');
    }

    const onLogout = () => {
        localStorage.clear();
        navigate("/login");
      };

    useEffect(() => {
        if( userInfo === null ) { 
          getUserInfo();
        }
        return () => {};
      },[])

  return (
    <>
    {userInfo !== null && 
        <div>
            <div className="flex h-22 bg-white items-center justify-between px-6 py-2 drop-shadow dark:bg-neutral-900">
                <h2 className='text-xl font-medium text-black py-2 cursor-pointer dark:text-slate-50' onClick={()=>navigate('/')}> .notes </h2>
            </div>


            <div className='flex justify-between px-6 mt-4 text-5xl font-medium dark:text-slate-300'>
                {firstName !== '' && <p className='self-end'>Hello {firstName},</p>}
                <div 
                    className='mr-5 p-2 text-slate-400 hover:text-orange-700 transition-all duration-300 cursor-pointer rounded-full hover:bg-gray-300 dark:hover:bg-neutral-700 dark:text-slate-300 dark:hover:text-orange-500'
                    onClick={onLogout}
                >
                <LuPower />
                </div>
            </div>

            <div className='flex-col px-8 mt-2 text-slate-800'>

                <p className='italic dark:text-slate-400'>{userInfo.email}</p>

                <div className='flex flex-col gap-10 h-17 mt-10 w-130 text-lg font-medium text-gray-600'>
                    <div className='flex items-center'>
                        <p className='cursor-pointer underline h-8 hover:text-black transition-all ease-in' onClick={()=>setChangeType('name')}>Change name?</p>

                        {changeType === 'name' && 
                        <input 
                            type="text" 
                            className='bg-neutral-300 ml-20 px-2 rounded-lg font-normal border-b outline-none text-black dark:text-slate-300 dark:bg-neutral-800' 
                            value={name}
                            onChange={({target})=>setName(target.value)}
                        />}

                    </div>

                    <div className='flex items-center'>
                        <p className='cursor-pointer underline h-8 hover:text-black transition-all ease-in' onClick={()=>setChangeType('password')}>Change password?</p>
                        {changeType ==='password' && 
                        <input 
                            type="text" 
                            className='bg-neutral-300 ml-20 px-2 rounded-lg font-normal border-b outline-none text-black dark:text-slate-300 dark:bg-neutral-800'
                            value={password}  
                            onChange={({target})=>setPassword(target.value)}  
                        />}

                    </div>
                    <div className="text-sm flex justify-center text-slate-500">
                    {error && <p>{error}</p> }
                    </div>
                    {changeType && <div className='flex items-center justify-between w-60 self-center'> 
                        
                            <button className='cursor-pointer hover:text-black transition-all ease-in' onClick={handleRequest}>Submit</button>
                            <button className='cursor-pointer hover:text-black transition-all ease-in' onClick={clearChange}>Cancel</button>
                    </div>}
                </div>
            </div>
        </div>
    }
    </>
  )
}

export default ProfilePage