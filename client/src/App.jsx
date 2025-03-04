import { useState, useEffect } from 'react'
import 'regenerator-runtime/runtime';
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login'
import SignUp from './pages/SignUp/SignUp'
import Home from './pages/Home/Home'
import ProfilePage from './pages/Profile/ProfilePage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<SignUp/>}/>
        <Route path='/user-profile' element={<ProfilePage />}/>
      </Routes>
    </>
  )
}

export default App
