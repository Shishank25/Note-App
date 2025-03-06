import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from '../../utils/axiosInstance'

const ResetPassword = () => {

    const { token } = useParams();
    const navigate = useNavigate();
    const [ newPassword, setNewPassword ] = useState("");
    const [ confirmPassword, setConfirmPassword ] = useState("");
    const [ message, setMessage ] = useState("");
    const [ linkCheck, setLinkCheck ] = useState(false);
    const [ error, setError ] = useState('');

    const verifyLink = async () => {
        try{
            const response = await axiosInstance.post("/reset-password/verification/" + token);
            console.log(response.data);
            if(!response.data.error){
                setLinkCheck(true);
            }
        }
        catch (error) {
            setLinkCheck(false);
            if ( error.response && error.response.data ) { setMessage(error.response.data.message) }
            else if ( error.message ) { setMessage(error.message) }
            else { setMessage("Something went wrong") }
        }
    }

    const handleChange = (e) => {
        if(e.target.name === "newPassword"){
            setNewPassword(e.target.value);
        }
        else if(e.target.name === "confirmPassword"){
            setConfirmPassword(e.target.value);
        }
        console.log(newPassword, confirmPassword);
    }

    const handleSubmit = async () => {
        if(newPassword === confirmPassword && newPassword !== ""){
            try {
                const response = await axiosInstance.post("/reset-password/" + token, { newPassword: newPassword });

                if( response.data && !response.data.error) {
                    setError('');
                    setMessage("Password reset successfully, you can now login with your new password");
                }
            } catch (error) {
                if ( error.response ) {
                    setError( error.response.data.message );
                }
                else {
                    setError('Something went wrong');
                }
            }
        } else if ( newPassword !== confirmPassword ) {
            setError('Passwords do not match');
        } else {
            setError('You must enter a new password');
        }
    }

    useEffect(() => {
        verifyLink();
    },[]);

  return (
    <div className='dark:text-slate-50'>
        <div className="flex bg-white items-center justify-between px-6 py-2 drop-shadow dark:bg-neutral-900 ">
            <h2 className='text-xl font-medium text-black py-2 dark:text-slate-50'> .notes </h2>
            <h3 className='text-lg hover:underline cursor-pointer' onClick={()=>navigate('/login')}>Login</h3>
        </div>
        <p className='ml-5 mt-5'>{message}</p>
        {linkCheck && message === '' && <div>
            <div className='flex flex-col h-120 items-center justify-evenly'>
                <h3 className='text-2xl'>Reset Password</h3>
                <div className='flex flex-col justify-between h-20'>
                    <input className='text-center w-60' name='newPassword' value={newPassword} type="password" placeholder='Enter New Password' onChange={handleChange}/>
                    <input className='text-center w-60' name='confirmPassword' value={confirmPassword} type="password" placeholder='Enter New Password Again' onChange={handleChange}/>
                </div>
                <p>{error}</p>
                <button className='w-40' onClick={handleSubmit}>Set New Password</button>
                </div>
        </div>}
  </div>
  )
}

export default ResetPassword