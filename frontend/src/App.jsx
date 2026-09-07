import { signInWithPopup } from 'firebase/auth'
import React from 'react'
import { auth, googleProvider } from '../utils/firebase'
import api from '../utils/axios'
import Home from './pages/Home'
import { useEffect } from 'react'
import getCurrentUser from './features/getCurrentUser'
import { useDispatch, useSelector } from 'react-redux'
import { setUserdata } from './redux/userSlice'
const App = () => {
  const dispatch = useDispatch()
  useEffect(()=>{
    const getUser = async ()=>{
      const data = await getCurrentUser();
      dispatch(setUserdata(data));
    }
    getUser();
  },[])
  return (
    <>
      <Home>
        
      </Home>
    </>
  )
}

export default App