import React, { useEffect, useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../shared/Navbar'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast, Toaster } from 'sonner'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import store from '@/redux/store'
import { Loader2 } from 'lucide-react'

const Login = () => {

    const [input, setInput] = useState({
        email: "",
        password: "",
        role: ""
    });

    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    'Content-Type': "application/json"
                },
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        }
        catch (err) {
            toast.error(err.response.data.message);
            console.log(err);
        }
        finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, []);
    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-xl mb-5'>Login</h1>
                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                            className="focus:border-dark border-2 border-gray-300 placeholder:text-gray-400 "
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="sarvesh@gmail.com"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Password</Label>
                        <Input
                            className="focus:border-dark border-2 border-gray-300 placeholder:text-gray-400 "
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className='flex items-center justify-between'>
                        <RadioGroup className="flex items-center gap-4 my-5">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r1">Applicant</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r2">Recruiter</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    {
                        loading ? <Button className='bg-black text-white border-solid border-black rounded w-full my-4 hover:bg-gray-200 hover:text-black'><Loader2 className='mr-2 h-4 w-4 animate-spin' />Please Wait</Button> : <Button type="submit" className='bg-black text-white border-solid border-black rounded w-full my-4 hover:bg-gray-200 hover:text-black'>Login</Button>
                    }
                    <span className='text-sm'>Don't have an account? <Link to="/signup" className='text-blue-600 hover:underline'>Sign Up</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Login