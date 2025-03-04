import React, { useEffect, useState } from 'react'
import {FaRegEye, FaRegEyeSlash} from 'react-icons/fa6';

const PasswordInput = ({ value, onChange, placeholder }) => {

    const [ isShowPassword, setIsShowPassword ] = useState(false);

    const toggleShowPassword = () => {

        setIsShowPassword(!isShowPassword);

    };


  return (
    <div className='flex items-center'>
        <input 
        value={value}
        onChange={onChange}
        type={isShowPassword ? "text" : "password"}
        placeholder={placeholder || "Password"} 
        className='input-box outline-none rounded p-2 pl-3 w-60'/>

        {isShowPassword ? <FaRegEye
        size={22}
        className="cursor-pointer"
        onClick={toggleShowPassword}/> : <FaRegEyeSlash
        size={20}
        className="cursor-pointer"
        onClick={toggleShowPassword}/>}
    </div>
  )
}

export default PasswordInput