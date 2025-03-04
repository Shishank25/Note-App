import React, { useEffect, useState } from 'react'
import { LuCheck } from 'react-icons/lu'
import { MdDelete } from 'react-icons/md'

const Toast = ({ isShown, message, type, onClose }) => {

  const [ isToast, setIsToast ] = useState(false);
  const [ toastText, setToastText ] = useState('');
  const [ toastType, setToastType ] = useState('');


  const updateOnClose = () => {
    onClose(message);
  }

  useEffect(()=>{

    if(isShown) {
      setToastType(type);
      setIsToast(true);
      onClose(message);
    } 
    
  },[onClose]);

  return (
    <>
      <div className={`absolute shadow-2xl font-medium -top-10 right-70 max-w-50 transition-all ease-in-out duration-1000 ${isShown ? 'translate-y-9' : 'translate-y-0'}`}>
        <div className='flex justify-center items-center gap-3 border px-4 pt-2 pb-1 rounded-b-lg'>
        {toastType === 'delete' ? <MdDelete className='text-md'/> : <LuCheck className="text-2xl" />}
          {isToast && <p>{message}</p>}
        </div>
      </div>
    </>
  )
}

export default Toast