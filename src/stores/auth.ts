'use client';

import { useRouter } from 'next/navigation'
import React, { useState } from 'react';
import anggotaService from "@/services/auth"
import Cookies from 'js-cookie';

interface UserInterface {
    username: string;
    password: string;
}

const AuthStore = () => {
    const router = useRouter();

    const [authenticated, setAuthenticated] = useState(false);

    const authenticateUser = async ({ username, password }: UserInterface) => {
        try{
            const response = await anggotaService.LOGIN(username , password)
            console.log(response);
            setAuthenticated(true); 
            Cookies.set('auth', "true", { expires: 1 });

            router.push('/dashboard');
        }catch(e :any){
            console.log(e);
            
           return e.response.data.errors
        }
    };

    const logoutUser = async () => {
        // Lakukan logika logout di sini
        setAuthenticated(false); 
    };
    

    return {
        authenticated,
        authenticateUser,
        logoutUser
    };
};

export default AuthStore;