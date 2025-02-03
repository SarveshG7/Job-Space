import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import { USER_API_END_POINT } from '@/utils/constant'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.map(skill => skill) || "",
       // file: user?.profile?.resume || ""
       resume_link: user?.profile?.resume || ""
    })

    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    /*const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname",input.fullname);
        formData.append("email",input.email);
        formData.append("phoneNumber",input.phoneNumber);
        formData.append("bio",input.bio);
        formData.append("skills",input.skills);
        if(input.file){
            formData.append("file",input.file);
        }

        try{
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData,{
                headers:{
                    "Content-Type":"multipart/form-data"
                },
                withCredentials:true
            })
            if(res.data.success){
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }
        }catch(err){
            console.log(err);
            toast.success(err.response.data.message);
            
        }finally{
            setLoading(false);
        }
        setOpen(false);
    }*/

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        formData.append("resume_link", input.resume_link);
        /*if (input.file) {
            formData.append("file", input.file);
        }*/
        try {
            setLoading(true);
            const res = await axios?.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
        setOpen(false);
    }


    /*const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    }*/

    return (
        <div>
            <Dialog open={open}>
                <DialogContent className="bg-white rounded-full sm:max-w-[425px]" onInteractOutside={() => setOpen(false)}>
                    <DialogHeader >
                        <div className="flex justify-between items-center w-full">
                        <DialogTitle>Update Profile</DialogTitle>
                        <button
                            type="button"
                            className="text-gray-500 hover:text-black focus:outline-none"
                            onClick={() => setOpen(false)}
                            aria-label="Close"
                        >
                            ✕
                        </button>
                        </div>
                        
                    </DialogHeader>
                    <form onSubmit={submitHandler}>
                        <div className='grid gap-4 py-4'>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input
                                    id="name"
                                    name="fullname"
                                    type="text"
                                    onChange={changeEventHandler}
                                    value={input.fullname}
                                    className="col-span-3 border border-gray-300 focus:border-black focus:border-[2px]"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    onChange={changeEventHandler}
                                    value={input.email}
                                    className="col-span-3 border border-gray-300 focus:border-black focus:border-[2px]"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="number" className="text-right">Number</Label>
                                <Input
                                    id="number"
                                    name="phoneNumber"
                                    onChange={changeEventHandler}
                                    value={input.phoneNumber}
                                    className="col-span-3 border border-gray-300 focus:border-black focus:border-[2px]"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="bio" className="text-right">Bio</Label>
                                <Input
                                    id="bio"
                                    name="bio"
                                    onChange={changeEventHandler}
                                    value={input.bio}
                                    className="col-span-3 border border-gray-300 focus:border-black focus:border-[2px]"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="skills" className="text-right">Skills</Label>
                                <Input
                                    id="skills"
                                    name="skills"
                                    onChange={changeEventHandler}
                                    value={input.skills}
                                    className="col-span-3 border border-gray-300 focus:border-black focus:border-[2px]"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="file" className="text-right">Resume Link</Label>
                                <Input
                                    id="resume_link"
                                    name="resume_link"                                                            
                                    onChange={changeEventHandler}
                                    className="col-span-3 border border-gray-300 focus:border-black focus:border-[2px]"
                                />
                               {/*<Input
                                    id="file"
                                    name="file"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={fileChangeHandler}
                                    className="col-span-3 border border-gray-300 focus:border-black focus:border-[2px]"
                                />*/}
                            </div>
                        </div>
                        <DialogFooter>
                            {
                                loading ? <Button className='bg-black text-white border-solid border-black rounded w-full my-4 hover:bg-gray-200 hover:text-black'><Loader2 className='mr-2 h-4 w-4 animate-spin' />Please Wait</Button> : <Button type="submit" className='bg-black text-white border-solid border-black rounded w-full my-4 hover:bg-gray-200 hover:text-black'>Update</Button>
                            }
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UpdateProfileDialog