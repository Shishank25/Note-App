import React, { useState } from 'react'
import PasswordInput from '../../components/Input/PasswordInput';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

const Login = () => {

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ error, setError ] = useState(null);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if(!validateEmail(email)) {
            setError("Please enter a valid Email Address");
            return;
        }

        if(!password) {
            setError("Please enter a Password");
            return;
        }


        try {

            const response = await axiosInstance.post("/login", {
                email: email.toLowerCase(),
                password: password,
            });

            if(response.data && response.data.accessToken) {
                localStorage.setItem('token', response.data.accessToken);
                console.log(response.data);
                navigate('/');
            }

        } catch (error) {

            if (error.response && error.response.data && error.response.data.message) {
                setError( error.response.data.message );
            } else {
                console.log(error);
                setError("An unexpected error has occured.")
            }
        }
    }

  return (
  <>
    <div className="flex bg-white items-center justify-between px-6 py-2 drop-shadow dark:bg-neutral-900 dark:text-slate-50">
          <h2 className='text-xl font-medium text-black py-2 dark:text-slate-50'> .notes </h2>
    </div>

    <div className='h-150 flex justify-center items-center dark:bg-neutral-900 dark:text-slate-50'>
        <div className='w-96 px-7 py-10 bg-white dark:bg-neutral-900 dark:text-slate-50'>
            <form className='p-3 flex flex-col' onSubmit={handleLogin}>
                <h4 className='text-2xl mb-7 '>Login</h4>

                <input 
                    type="email" 
                    placeholder='Email' 
                    className='input-box w-60 outline-none rounded p-2 pl-3 mb-4'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                />

                <PasswordInput 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className='text-red-500 text-xs'>{error}</p>}

                <button type='submit' className='btn-primary h-8 rounded mt-4 text-center w-full bg-blue-500 text-white'>Login</button>

                <p className='mt-10 text-center'>Not Registered yet? <br />
                    <Link to="/register" className='underline text-primary font-medium'>Create an Account</Link>
                </p>
            </form>
        </div>
    </div>
  </>
  )
}

export default Login