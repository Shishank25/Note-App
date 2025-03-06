import { useState, useEffect } from 'react'
import 'regenerator-runtime/runtime';
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login'
import SignUp from './pages/SignUp/SignUp'
import Home from './pages/Home/Home'
import ProfilePage from './pages/Profile/ProfilePage';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ForgotPassword/ResetPassword';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={ <Home /> }/>
        <Route path='/login' element={ <Login /> }/>
        <Route path='/register' element={ <SignUp /> }/>
        <Route path='/user-profile' element={ <ProfilePage />}/>
        <Route path='/forgot-password' element={ <ForgotPassword /> }/>
        <Route path='/reset-password/:token' element={ <ResetPassword /> }/>
      </Routes>
    </>
  )
}

export default App
