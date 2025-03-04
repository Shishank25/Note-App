import React, { useState, } from 'react'
import PasswordInput from '../../components/Input/PasswordInput';
import { validateEmail } from '../../utils/helper';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const SignUp = () => {

    const [ name, setName ] = useState('');
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ error, setError ] = useState(null);

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        if(!name) {
            setError('Please enter a Username');
            return;
        }

        if(!validateEmail(email)) {
                    setError("Please enter a valid Email Address");
                    return;
                }

        if(!password) {
            setError("Please enter a Password");
            return;
        }

        try {

            const response = await axiosInstance.post("/create-account", {
                fullName: name,
                email: email.toLowerCase(),
                password: password,
            });

            if(response.data && response.data.accessToken) {
                localStorage.setItem('token', response.data.accessToken);
                console.log(response.data);
                navigate('/');
            }

            if(response.data && response.data.error){
                setError( response.data.message);
                return 
            }

        } catch (error) {
            console.log(error);
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
        <div className="flex bg-white items-center justify-between px-6 py-2 drop-shadow dark:bg-neutral-900">
          <h2 className='text-xl font-medium text-black py-2 dark:text-slate-50'> .notes </h2>
        </div>

        <div className='flex justify-center items-center mt-28'>
            <div className='w-96 px-7 py-10 bg-white dark:bg-neutral-900 dark:text-slate-50'>
                <form className='p-3 flex flex-col' onSubmit={handleSignup}>
                    <h4 className='text-2xl mb-7 '>Sign Up</h4>

                    <input 
                    type="text" 
                    placeholder='Username' 
                    className='input-box w-60 outline-none rounded p-2 pl-3 mb-4'
                    value={name}
                    onChange={(e) => setName(e.target.value)} 
                    />

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

                    <button type='submit' className='btn-primary h-8 rounded mt-4 text-center w-full bg-blue-500 text-white hover:cursor-pointer'>Create Account</button>

                    <p className='mt-10 text-center'>Already have an account? <br />
                        <Link to="/login" className='underline text-primary font-medium'>Sign In</Link>
                    </p>

                </form>
            </div>
        </div>
    </>

  )
}

export default SignUp