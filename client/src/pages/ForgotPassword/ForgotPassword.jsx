import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'

const ForgotPassword = () => {
  
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [ error, setError ] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/forgot-password', { email: email });
      if ( response.data && !response.data.error) {
        setError('A link to reset your password has been sent to your email address. The Link is only valid for 30 minutes');
      }
      else {
        setError(response.data.message);
      }
    } catch ( error ) {
      if ( error.response && error.response.data ) { setError(error.response.data.message) }
      else if ( error.message ) { setError(error.message) }
      else { setError("Something went wrong") }
    }
  }

  return (
    <div className='dark:text-slate-50'>
        <div className="flex bg-white items-center justify-between px-6 py-2 drop-shadow dark:bg-neutral-900 dark:text-slate-50">
          <h2 className='text-xl font-medium text-black py-2 dark:text-slate-50 cursor-pointer' onClick={()=>navigate('/')}> .notes </h2>
          <h3 className='text-lg hover:underline cursor-pointer' onClick={()=>navigate('/login')}>Login</h3>
        </div>

        <div className='h-140 flex flex-col justify-evenly items-center w-full'>
            <div className='h-90 w-80 sm:w-100 flex flex-col items-center justify-between rounded-lg border border-white p-10'>
                <h4 className='text-2xl mb-7 '>Reset Password</h4>
                <input 
                  className='text-center outline-none w-75 rounded border border-white' 
                  type="email" 
                  placeholder='Enter your email'
                  value={email}
                  onChange={(e)=>{setEmail(e.target.value)}}
                />
                <p className='text-center'>{error}</p>
                <button className='cursor-pointer text-slate-500 hover:text-black dark:hover:text-slate-50' onClick={handleSubmit}>Reset</button>
            </div> Or
            <div className='hover:underline cursor-pointer' onClick={()=>{navigate('/register')}}>Create Account?</div>
        </div>
    </div>
  )
}

export default ForgotPassword