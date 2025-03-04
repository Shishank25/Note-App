import React from 'react'
import {MdOutlinePushPin, MdCreate, MdDelete} from 'react-icons/md'
import moment from 'moment'

const NoteCard = ({
    title,
    date,
    content,
    tags,
    isPinned,
    onEdit,
    onDelete,
    onPinNote,
    setOpenAddEditModal,
}) => {

    const handleView = () => {     setOpenAddEditModal({ isShown: true, type: 'view', data: {title, content, tags} })      };

  return (
    <div 
        className='max-w-100 rounded p-4 hover:shadow-2xl hover:scale-120 hover:cursor-pointer transition-all duration-1000 ease-out mt-4'
    >
        <div className='flex items-center justify-between'>
            <div onClick={handleView}>
                <h6 className='text-sm font-medium dark:text-slate-300'>{title}</h6>
                <span className='text-xs text-slate-500'>{moment(date).format("Do MMM YYYY ")}</span>
            </div>

            <MdOutlinePushPin 
            className={`${isPinned ? 'black' : 'text-slate-400'} hover:text-black transition-all ease-in-out`} 
            onClick={onPinNote} />
        </div>
        <p className="content text-xs text-slate-800 dark:text-slate-400" onClick={handleView}>{content?.slice(0, 60)}</p>
        <div className='flex items-center justify-between'>
            <div className='text-xs text-slate-500'>{tags.map((tag, index) => `#${tag} `)}</div>

            <div className="flex items-center gap-2">
                <MdCreate 
                    className='hover:text-green-600'
                    onClick={onEdit}
                />
                <MdDelete 
                    className="hover:text-red-500" 
                    onClick={onDelete}
                />
            </div>
        </div>
    </div>
  )
}

export default NoteCard