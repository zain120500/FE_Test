import React, { useState } from 'react';
import axios from 'axios';
interface UserInterface {
    username: string;
    password: string;
}


const AuthStore = () => {

    const API = process.env.BASE_URL
    const [authenticated, setAuthenticated] = useState(false);

    const authenticateUser = async ({ username, password }: UserInterface) => {
        const response = await axios({
            method: 'post',
            url: API+ 'users/login',
            withCredentials: true
        }).then((res)=>{
            console.log(res)
        })
        
        // try {
        //     console.log(process.env.BASE_URL);
            
        //     // const response = await axios.post(API+ 'users/login', {
        //     //     username,
        //     //     password
        //     // });
         
        //     // const response = await fetch(API + 'job', {
        //     //     mode: 'no-cors',
        //     //     method: 'get',
        //     //     headers: {
        //     //         'Content-Type': 'application/json',
        //     //         'Access-Control-Allow-Origin': 'http://localhost:3000'
        //     //     },
        //     //     body: JSON.stringify({ username, password })
        //     // });

        //     console.log(response);
            

        //     if (response.ok) {
        //         setAuthenticated(true);
        //     } else {
        //         // Jika respon tidak berhasil, tampilkan pesan kesalahan atau lakukan tindakan yang sesuai
        //         console.error('Gagal mengotentikasi pengguna');
        //     }
        // } catch (error) {
        //     // Tangani kesalahan seperti masalah jaringan
        //     console.error('Terjadi kesalahan:', error);
        // }
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