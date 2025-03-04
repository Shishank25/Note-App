import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'

import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import AddEditNotes from './AddEditNotes'
import EmptyCard from '../../components/Cards/EmptyCard'
import Toast from '../../components/ToastMessage/Toast'

import { MdAdd } from 'react-icons/md'
import Modal from 'react-modal'



Modal.setAppElement("#root");

const Home = () => {

  const [openAddEditModal, setOpenAddEditModal] = useState({
                                                    isShown: false,
                                                    type: 'add',
                                                    data: null,
                                                  });

  const [ showToastMsg, setShowToastMsg ] = useState({
                                              isShown: false,
                                              message: '',
                                              type: 'add',
                                            })
  
  const [ allNotes, setAllNotes ] = useState([]);

  const [ userInfo, setUserInfo ] = useState(null);

  const [ isSearch, setIsSearch ] = useState(false);

  const navigate = useNavigate();

  const handleEdit = ( noteDetails ) => {     setOpenAddEditModal({ isShown: true, data: noteDetails, type: 'edit' })      };

  const toastMessage = ( message, type ) => { setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  }

  const handleCloseToast = (message) => {

    setTimeout(()=>setShowToastMsg(prev=> ({
        isShown: false,
        message: prev.message,
      }))
    ,2000)
  };

  // Get Users Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/get-user');
      if ( response.data && response.data.user ) {
        setUserInfo( response.data.user );
      } 
    } catch (error) {
        if(error.response.status === 401) {
          localStorage.clear();
          navigate('/login');
        }
    }
  };

  // Fetch All Notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get('/get-all-notes/');

      if (response.data && response.data.notes) {
        setAllNotes( response.data.notes );
      }
    } catch ( error ) {
      console.log("Unable to fetch notes, please try later");
    }
  };

  // Delete Note 
  const deleteNote = async (data) => {
    const noteId = data._id;
        try {
            const response = await axiosInstance.delete('/delete-note/' + noteId);

            console.log(response.data);

            if ( response.data && !response.data.error) {
                toastMessage('Note Deleted','delete');
                getAllNotes();
                onClose();
            }
        } catch ( error ) {
            if ( error.response && error.response.data && error.response.data.message ) {
                console.log("An unexpected error occurred");
            }
        }
  };

  // Search Notes
  const onSearchNote = async (query) => {
      try {
        const response = await axiosInstance.get('/search-notes', {
          params: { query },
        });

        if ( response.data && response.data.notes ) {
          setIsSearch( true );
          setAllNotes( response.data.notes );
        }
      } catch (error) {
        console.log(error);
      }
  };

  // Update isPinned
  const updateIsPinned = async ( noteData ) => {
    const noteId = noteData._id;
        try {
            const response = await axiosInstance.put('/update-pin/' + noteId);

            console.log(response.data);

            if ( response.data && response.data.note) {
                toastMessage(response.data.message);
                getAllNotes();
            }
        } catch ( error ) {
            console.log(error);
        }
  }

  // Get Pinned Notes
  const pinnedNotes = async () => {
    try {
      const response = await axiosInstance.get('/get-pinned-notes');

      if ( response.data && response.data.notes ) {
        setIsSearch( true );
        setAllNotes( response.data.notes );
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  }

  useEffect(() => {
    if( userInfo === null ) { 
      getUserInfo();
    }
    getAllNotes();
    return () => {};
  },[])





  return (

    <div className='h-full dark:bg-neutral-900 dark:text-slate-50'>
      
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} pinnedNotes={pinnedNotes}/> 

      <div className="container mx-10">
        {allNotes.length > 0 ? <div className="grid grid-cols-3 gap-4">

          {allNotes.map((item, index) => (

            <NoteCard
              key={item._id}
              title={item.title} 
              date={item.createdOn}
              content={item.content}
              tags={item.tags}
              isPinned={item.isPinned}
              onEdit={()=> handleEdit(item)}
              onDelete={()=>deleteNote(item)}
              onPinNote={()=>updateIsPinned(item)}
              onClick={()=>console.log('view')}
              setOpenAddEditModal={setOpenAddEditModal}
            />

          ))}
        
        </div> : <EmptyCard setOpenAddEditModal={setOpenAddEditModal} isSearch={isSearch}/> }
      </div>

      <button 
        className="h-16 w-16 flex items-center justify-center absolute right-10 bottom-10 cursor-pointer"
        onClick={()=>{
          setOpenAddEditModal({ isShown: true, type: 'add', data: null });
          }}
      >
        <MdAdd className="rounded-lg text-white bg-slate-400 text-[64px] hover:bg-slate-600 transition-all transition-[rounded] ease-in-out duration-300" />
      </button>

      <Modal 
        isOpen={openAddEditModal.isShown} 
        onRequestClose={() =>{}}
        style={ 
          {overlay: {backgroundColor: 'rgba(0,0,0,0.2)'}}
        }
        className='mt-20 h-auto w-[40%] mx-auto'
      >
          <div className="mx-10">
            <AddEditNotes
              type={openAddEditModal.type}
              noteData={openAddEditModal.data} 
              getAllNotes={getAllNotes}
              toastMessage={toastMessage}
              onClose={() => {
                setOpenAddEditModal({ isShown: false, type: '', data: null });
              }}
            />
          </div>
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </div>
  )
}

export default Home