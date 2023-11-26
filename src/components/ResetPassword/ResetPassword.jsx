import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {Button, Input, Logo} from "../index.js"
import {useForm} from "react-hook-form"

function ResetPassword() {

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const {control, register, handleSubmit} = useForm()
    const [error, setError] = useState("")

    const reset = async (data) => {
        setLoading(true);
        console.log(data);
        setError("")

        try{
            const credentials = btoa('5595832005:5dceeeb7-47f3-4dc9-8f00-2845af1da8d2');
            const response = await fetch('http://localhost:8082/simlearn/authentication/api/v1/password',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Specify the content type as JSON
                    'Authorization': `Basic ${credentials}`,
                    // Add any other headers if needed
                },
                body: JSON.stringify(data), // Convert the data to a JSON string
            });
            // const data2 = await response.json();
            console.log("Response",response);
            
            if(response.status === 200){
                alert('Password has been reset');
                console.log("Reset Successfull");
                navigate('/login');
            }
            else{
                setError('Invalid username or password');
                console.log("Reset Failed");
            }

        }
        catch(error){
            console.log("Reset Password Error :",error);
            setError(error);
        }
        setLoading(false);
    };

    return (
        loading ? (
            <div className='dark:bg-gray-400 w-full flex justify-center items-center h-[10rem]'>
            <div className='bg-blue-400 w-[6rem] flex justify-center items-center p-2 m-2 rounded-md'> Loading! </div>
            </div>
    
        ) : 
        (
            <div
            className='flex items-center justify-center w-full py-8 dark:bg-gray-400 dark:text-gray-800'
            >
                <div className={`mx-auto w-full max-w-lg bg-gray-100 dark:bg-gray-300 rounded-xl p-7 border border-black/10`}>
                    <div className="mb-2 flex justify-center">
                        <span className="w-full flex justify-center items-center">
                            <Link 
                            to = "/"
                            >
                                <Logo width="100%" />
                            </Link>
                        </span>
                    </div>
                    <h2 className="text-center text-2xl font-bold leading-tight">
                        Reset Password
                    </h2>
                    {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                    <form onSubmit={handleSubmit(reset)} className='mt-8'>
                        <div className='space-y-7'>
                            <Input
                            // label = "Username"
                            type="text"
                            placeholder="Username"
                            {...register("username", {
                                required: true,
                            })}
                            
                            />
    
                            <Input
                            // label="Password: "
                            type="text"
                            placeholder="Old password"
                            {...register("oldPassword", {
                                required: true,
                            })}
                            />

                            <Input
                            // label="Password: "
                            type="text"
                            placeholder="New password"
                            {...register("newPassword", {
                                required: true,
                            })}
                            />
    
                            <Button
                            type="submit"
                            className="w-full"
                            >Reset</Button>
                        </div>
                    </form>
                    
                </div>
                
            
            </div>
        )
    )
}

export default ResetPassword