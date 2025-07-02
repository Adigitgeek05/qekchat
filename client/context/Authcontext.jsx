import React, { createContext,useState,useEffect } from 'react';

import axios from 'axios';
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client';

const backendUrl= import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL= backendUrl;


export const AuthContext= createContext();

export const AuthProvider= ({children}) => {
    const [token,settoken] = useState(localStorage.getItem('token'));
    const [authuser,setauthuser]=useState(null);
    const [onlineUsers,setonlineUsers]=useState([]);
    const [socket,setSocket]=useState(null);
    //check if user is authenticated and set the user date and connect to socket.io


   const checkAuth= async () => {
    try {
        const { data } = await axios.get('api/auth/check');
        if(data.success) {
            setauthuser(data.user);
            connectSocket(data.user);
         
        }
    } catch (error) {
        toast.error(error.message);

    }
   };

   //Login function to handle user authentication and socket connection

   const login = async (state,credentials) => {
    try {
        const {data} = await axios.post(`/api/auth/${state}`,credentials);
        if(data.success) {
            setauthuser(data.userData);
            connectSocket(data.userData);
            axios.defaults.headers.common["token"]=data.token;
            settoken(data.token);
            localStorage.setItem("token",data.token)
            toast.success(data.message);

        }
    } catch (error) {
        toast.error(error.message);
        
    }
   }

   //Logout function 
   const logout= async() => {
    localStorage.removeItem("token");
    settoken(null);
    setauthuser(null);
    setonlineUsers([]);
    axios.defaults.headers.common["token"]=null;
    toast.success("Logged out successfully");
    socket.disconnect();
    
   }
   // Update profile function to handle user profile updates
   const updateProfile= async (body)=> {
    try {
        const {data}= await axios.put("/api/auth/update-profile",body)
        if(data.success) {
            setauthuser(data.user);
            toast.success("Profile updated successfully");


        }
    } catch (error) {
        toast.error(error.message);

    }

   }


   const connectSocket= (userData) => {
    if(!userData || socket?.connected) return;
    const newSocket = io(backendUrl, {
        query: {
            userId: userData._id,
        },
    });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (users) => {
        setonlineUsers(users);
    });
   }

   

   useEffect(() => {
  if(token) {
    axios.defaults.headers.common["token"]= token;
  }
  checkAuth();
}, [token]); 
    const value= {
        axios,
        authuser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile

    }


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
