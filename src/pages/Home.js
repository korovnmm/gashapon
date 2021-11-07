import { useAuthState } from '../firebase'
import React from "react";
import logo from '../assets/gashapon_pink.png'

export const Home = () => {
    const { user } = useAuthState();
    
    return (
        <>
            <h1>Welcome to Project Gashapon!</h1>
            <div>Signed in as {user?.email}</div>
            <img
              class="img-fluid rounded mb-4 mb-lg-0"
              src={logo}
              alt=""
            />

        </>
    );
}

