
import React, { useContext, useEffect } from 'react'
import {  useNavigate } from "react-router-dom";
import { UserContext } from '../store/context';
// import { CircularProgress } from '@mui/material';


function SecureRoute({children}) {
    const navigate = useNavigate();
    const {user,setUser,appLoaded} = useContext(UserContext);
    useEffect(()=>{
        
        
        if(appLoaded){
            
            if(!user){
                navigate("/login")
            }
        }
    },[appLoaded])
    if(!appLoaded){
        <>
        {/* <CircularProgress/> */}
        </>
    }
    return children;

}

export default SecureRoute