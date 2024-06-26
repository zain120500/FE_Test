'use client';

import { useRouter } from 'next/navigation'
import React, { useState } from 'react';
import anggotaService from "@/services/auth"
import Cookies from 'js-cookie';
import responseUtil from '@/utils/response';

const AuthStore = () => {
    const router = useRouter();

    const [authenticated, setAuthenticated] = useState(false);
    const [input, setInput] = useState<any>({
        username: '',
        password: '',
    });

    const authenticateUser = async () => {
        try {
            const response = await anggotaService.LOGIN(input.username, input.password)
            setAuthenticated(true);
            // Cookies.set('auth', "true", { expires: 1 });
            Cookies.set('token', `Bearer ${response.data.access_token}`, { expires: 1 });

            router.push('/dashboard');

        } catch (e: any) {
            console.log(e);
            return responseUtil.err(e.response.status, e.response.data.message[0])
        }
    };

    const logoutUser = async () => {
        // Lakukan logika logout di sini
        setAuthenticated(false);
    };


    return {
        input,
        setInput,
        authenticated,
        authenticateUser,
        logoutUser
    };
};

export default AuthStore;