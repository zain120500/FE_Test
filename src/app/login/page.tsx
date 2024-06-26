'use client'
import React, { useState } from 'react';

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from "yup";
import AuthStore from '@/stores/auth';
import Image from 'next/image'
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";

const SignupSchema = Yup.object().shape({
    username: Yup.string()
        .required('Required'),
    password: Yup.string()
        .required('Required'),
});

interface Values {
    username: string;
    password: string;
}

export default function LoginForm() {


    const [errors, setErrors] = useState<any>({})

    const [loading, setLoading] = useState(false);

    const { authenticated, authenticateUser, input, setInput } = AuthStore();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setInput((prevInput: any) => ({
            ...prevInput,
            [name]: value,
        }));
    };

    const validateForm = async () => {
        setErrors({})

        return SignupSchema.validate(input, { abortEarly: false })
            .then(() => {
                return true
            })
            .catch(validationErrors => {
                setErrors(validationErrors.inner.reduce((acc: any, error: any) => {
                    acc[error.path] = error.message;
                    return acc;
                }, {}))
                return false
            });
    }

    const onLogin = async () => {

        if (!await validateForm()) {
            return
        }

        setLoading(true);
        const response = await authenticateUser();
        if (response) {
            setErrors(response)
        }
        setLoading(false);
    }
    return (
        <>
            {loading}
            <div className='flex relative'>
                <div className='md:w-[470px] lg:w-[512px] absolute md:relative z-40 flexCenter top-0 right-0 bottom-0 left-0'>
                    <div className='bg-white shadow-lg md:shadow-none max-w-md p-12 relative rounded-2xl w-full m-5'>
                        <div>
                            <Image src="/logo.png" width={250} height={250} className="h-8 w-auto" alt="Logo" />
                        </div>
                        <div className='my-12'>


                            <div className="mb-3">
                                <label className="block mb-1 text-sm">Login</label>
                                <div className={`flex focus-within:border-blue-300 items-center border p-2 rounded-lg mr-2 ${errors.username ? 'border-red-300 border-2' : ''}`}>
                                    <div className="w-6 flexCenter text-slate-400">
                                        <FaUser />
                                    </div>
                                    <input name="username" onChange={handleChange} className="w-full outline-none bg-transparent text-sm" placeholder='username...' />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="block mb-1 text-sm">Password</label>
                                <div className={`flex focus-within:border-blue-300 items-center border p-2 rounded-lg mr-2 ${errors.password ? 'border-red-300 border-2' : ''}`}>
                                    <div className="w-6 flexCenter text-slate-400">
                                        <RiLockPasswordFill />
                                    </div>
                                    <input name="password" onChange={handleChange} type="password" className="w-full outline-none bg-transparent text-sm" placeholder="password..." />
                                </div>
                            </div>

                            {errors && <div className='text-red-500 pb-5'>{errors.message}</div>}

                            <div className='flex justify-center'>
                                <button onClick={onLogin} type="submit" className="btn btn-primary" disabled={loading}>{(loading) ? 'Loading...' : 'Log In'}</button>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="relative flex-1 h-screen">
                    <div className="absolute left-0 right-0 top-0 bottom-0">
                        <div className="layer-auth-bg backdrop-blur-sm text-white flex-col">
                            <h1 className="text-4xl hidden md:block font-bold title slide-top ">Selamat Datang!</h1>
                            <p className="text-xl hidden md:block font-light text-slate-50 mt-2 sub-title slide-bottom">Sistem Baru, Semangat Baru</p>
                        </div>
                        <img className="h-full w-full object-cover object-top" src="/loginBG.jpg" alt="pgi" />
                    </div>
                </div>
            </div>
        </>
    );
};