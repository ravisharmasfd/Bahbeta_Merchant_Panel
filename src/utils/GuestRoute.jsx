
import React, { useContext, useEffect } from 'react'
import {  useNavigate } from "react-router-dom";
import { UserContext } from '../store/context';
// import { CircularProgress } from '@mui/material';


function GuestRoute({children}) {
    const navigate = useNavigate();
    const {user,appLoaded} = useContext(UserContext);
    useEffect(()=>{
        if(appLoaded){
            console.log("🚀 ~ GuestRoute ~ user:", user)
            if(user){
                navigate("/")
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

export default GuestRoute