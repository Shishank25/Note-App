import React, { useState, useEffect } from 'react'
import TagInput from '../../components/Input/TagInput'
import { MdClose } from 'react-icons/md';
import { TbMicrophone } from "react-icons/tb";
import axiosInstance from '../../utils/axiosInstance';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import 'regenerator-runtime/runtime';


const AddEditNotes = ({ noteData, type, getAllNotes, onClose, toastMessage }) => {

    const [ title, setTitle ] = useState(noteData?.title || '');
    const [ content, setContent ] = useState(noteData?.content || '');
    const [ tags, setTags ] = useState(noteData?.tags || []);

    const [ selectedField, setSelectedField ] = useState('');

    const [ error, setError ] = useState(null);

    const [ isListening, setIsListening ] = useState(false);
    const startListening = async () => SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    const { transcript, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return null
    }

    const handleListening = () => {
        setIsListening(prev => {
            const newState = !prev;
            return newState;
        });
    }

    const handleWriting = () => {
        if (selectedField === 'title') {
            setTitle(prevTitle => {
                const newTitle = prevTitle ? prevTitle + ' ' + transcript : transcript;
                return newTitle;
            });
        } else {
            setContent(prevContent => {
                const newContent = prevContent ? prevContent + ' ' + transcript : transcript
                return newContent;
            });
        }
        resetTranscript();
    }

    useEffect(()=>{
        if (isListening) {
            resetTranscript();
            startListening();
        } else {
            SpeechRecognition.stopListening();
            handleWriting();
        }
    },[isListening])

    const handleFieldChange = (e) => {
        handleWriting();
        setSelectedField(e.target.name);
    }

    // Add New Note
    const addNewNote = async () => {
        try {
            const response = await axiosInstance.post('/add-note', {
                title,
                content,
                tags,
            });

            console.log(response.data);

            if ( response.data && response.data.note) {
                toastMessage('Note Added','add');
                getAllNotes();
                onClose();
            }
        } catch ( error ) {
            if ( error.response && error.response.data && error.response.data.message ) {
                setError( error.response.data.message );
            }
        }
    };


    // Edit Note 
    const editNote = async () => {
        const noteId = noteData._id;
        try {
            const response = await axiosInstance.put('/edit-note/' + noteId, {
                title,
                content,
                tags,
            });

            console.log(response.data);

            if ( response.data && response.data.note) {
                toastMessage('Note Updated','edit');
                getAllNotes();
                onClose();
            }
        } catch ( error ) {
            if ( error.response && error.response.data && error.response.data.message ) {
                setError( error.response.data.message );
            }
        }
    };

    const handleAddNote = () => {
        console.log('adding note');
        if (title === '') {
            setError('Please give your note a title!');
            return;
        };

        setError('');

        if(type === 'edit') {
            editNote()
        } else {
            addNewNote()
        }
    }

    

  return (
    <div className='bg-gray-300 p-4 rounded-xl relative dark:bg-neutral-800'>

        <button
            className="flex justify-center items-center w-10 h-10 absolute top-1 right-1 text-slate-400 hover:text-slate-800 dark:hover:text-slate-50 hover:scale-150 transition-all ease-in cursor-pointer"
            onClick={onClose}   
        >
                <MdClose />
        </button>

        {type !== 'view' && <button
            className="flex justify-center items-center w-10 h-10 absolute bottom-2 right-2 text-slate-400 hover:text-slate-800 hover:scale-150 dark:hover:text-slate-50 transition-all ease-in cursor-pointer"
            onClick={handleListening}   
        >
            <TbMicrophone />
        </button>}

        {isListening && <div className="transcript absolute -top-12 text-slate-800 bg-neutral-300 p-2 rounded-lg max-w-100">{ transcript }</div> }

        <div className="flex flex-col gap-2">
            <input
                name='title' 
                type="text" 
                className="text-2xl text-slate-950 outline-none dark:text-slate-300" 
                placeholder='Title'
                value={title}
                onChange={({target}) => setTitle(target.value)}
                onClick={handleFieldChange}
                disabled={type === 'view'}
            />
        </div>
    
        <div className="flex flex-col gap-2 mt-4">
            <textarea
                name='content'
                type='text'
                className='text-sm text-slate-950 outline-none bg-gray-300 p-2 rounded dark:bg-neutral-800 dark:text-slate-400'
                placeholder='note body...'
                rows={10}
                value={content}
                onChange={({target}) => setContent(target.value)}
                onClick={handleFieldChange}
                disabled={type === 'view'}
            />
        </div>

        <div className="flex mt-3 text-slate-500">
            <p className='pt-1 dark:text-slate-400'>tags:</p>
            <TagInput tags={tags} setTags={setTags} type={type}/>
        </div>

        

        <div className='flex flex-col items-center'>

            {error && <p className='text-xs'>{error}</p>}

            {type !== 'view' && <button 
            className='flex justify-center items-center rounded-md mt-2 font-semibold px-2 text-slate-400 hover:text-slate-800 dark:hover:text-slate-50 transition-all ease-in cursor-pointer'
            onClick={() => { handleAddNote(); }}
            >{type === 'edit' ? 'Update note' : 'Create note'}</button>}
        </div>
    
    </div>

  )
}

export default AddEditNotes;