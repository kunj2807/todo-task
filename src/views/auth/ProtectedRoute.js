import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute(){
    const user = localStorage.getItem('user');
    if(!user){
        return <Navigate to='/login'/>
    }
    return <Outlet/>
}