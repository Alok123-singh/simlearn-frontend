import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {Button, Input, Logo} from "../index.js"
import {useForm} from "react-hook-form"

function Login() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const {register, handleSubmit} = useForm()
    const [error, setError] = useState("")

    const login = async(data) => {
        setLoading(true);
        console.log(data);
        setError("")
        try {
            setLoading(false);
            
        } catch (error) {
            setError(error.message)
            setLoading(false);
        }
    }

  return loading ? (
        <div className='dark:bg-gray-400 w-full flex justify-center items-center h-[10rem]'>
        <div className='bg-blue-400 w-[6rem] flex justify-center items-center p-2 m-2 rounded-md'> Loading! </div>
        </div>

    ) : 
    (
        <div
        className='flex items-center justify-center w-full py-10 dark:bg-gray-400 dark:text-gray-800'
        >
            <div className={`mx-auto w-full max-w-lg bg-gray-100 dark:bg-gray-300 rounded-xl p-10 border border-black/10`}>
            <div className="mb-2 flex justify-center">
                <span className="w-full flex justify-center items-center">
                    <Link 
                    to = "/"
                    >
                        <Logo width="100%" />
                    </Link>
                </span>
            </div>
            <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
            <p className="mt-2 text-center text-base text-black/60 font-bold">
                        Don&apos;t have any account?&nbsp;
                        <Link
                            to="/signup"
                            className="font-medium text-primary transition-all duration-200 hover:underline"
                        >
                            Sign Up
                        </Link>
            </p>
            {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
            <form onSubmit={handleSubmit(login)} className='mt-8'>
                <div className='space-y-5'>
                    <Input
                    label="Email: "
                    placeholder="Enter your email"
                    type="email"
                    {...register("email", {
                        required: true,
                        validate: {
                            matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                            "Email address must be a valid address",
                        }
                    })}
                    />
                    <Input
                    label="Password: "
                    type="text"
                    placeholder="Enter your password"
                    {...register("password", {
                        required: true,
                    })}
                    />
                    <Button
                    type="submit"
                    className="w-full"
                    >Sign in</Button>
                </div>
            </form>
            </div>
        </div>
    )
}

export default Login