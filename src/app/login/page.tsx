'use client'
import React, { useState } from 'react';

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from "yup";
import  AuthStore  from '@/stores/auth';

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

    const [error, setError] = useState(null);

    const { authenticated, authenticateUser, logoutUser } = AuthStore();
    return (
        <div className='flex items-center justify-center w-screen h-screen'>
            <Formik
                initialValues={{
                    username: '',
                    password: '',
                }}
                validationSchema={SignupSchema}
                onSubmit={(
                    values: Values,
                    { setSubmitting }: FormikHelpers<Values>
                ) => {
                    setError(null)
                    setTimeout( async () => {  
                        const response = await authenticateUser(values);
                        if (response) {
                            setError(response)
                        }
                        setSubmitting(false);
                    }, 500);
                }}

            >
                {({ errors, touched }) => (
                    <Form>
                        <div className='text-4xl pb-10 text-center'>Login</div>
                        <div className="mb-3">
                            <div>Username</div>
                            <Field name="username" className={`input input-bordered ${errors.username && touched.username ? 'input-error' : ''}`} placeholder='username...' />
                        </div>
                        <div className="mb-3">
                            <div>password</div>
                            <Field name="password" type="password" className={`input input-bordered ${errors.password && touched.password ? 'input-error' : ''}`} placeholder="password..." />
                        </div>

                        {error && <div className='text-red-500 pb-5'>{error}</div>}
                        <div className='flex justify-center'>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};