import React from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "../../store/task";
import { logout } from "../../store/auth";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const currentUser = useSelector(state => state.auth.authUser)
    const hanldeLogout=async()=>{
        dispatch(reset())
        dispatch(logout())
        navigate('/login')

    }
    return <>
        <div className="border-bottom p-3 d-flex justify-content-between">
            <h3 >
                Hello {currentUser?.name}
            </h3>
            <div>
                <Button onClick={hanldeLogout}>Logout</Button>
            </div>
        </div>

    </>
}