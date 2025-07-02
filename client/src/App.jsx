import React from 'react'
import { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import {Toaster} from 'react-hot-toast'
import { AuthContext } from '../context/Authcontext.jsx';
import { Navigate } from 'react-router-dom'


const App = () => {
  const {authuser} = useContext(AuthContext);
  return (
    <div className='bg-[url("/src/assets/bgImage.svg")] bg-contain'>
      <Toaster />
      <Routes >
        <Route path="/" element={authuser ? <HomePage /> : <Navigate to="/login"/>} />
        <Route path="/login" element={authuser ? <LoginPage /> : <Navigate  to="/"/>} />

        <Route path="/profile" element={authuser ? <ProfilePage /> : <Navigate to= "/login"/>} />
      </Routes>
    </div>
  )
}

export default App
