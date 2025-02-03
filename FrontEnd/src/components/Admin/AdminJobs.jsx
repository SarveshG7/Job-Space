import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import AdminJobsTable from './AdminJobsTable'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '@/redux/jobSlice'

const AdminJobs = () => {
    useGetAllAdminJobs();
    const navigate = useNavigate();
    const [input, setInput] =useState("");
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(setSearchJobByText(input));
    },[input]);
    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10'>
                <div className='flex items-center justify-between my-5'>
                    <Input
                        className=" w-fit border border-gray-300 focus:border-black focus:border-[2px] placeholder:text-gray-500"
                        placeholder="Filter by name or role"
                        onChange={(e)=>setInput(e.target.value)}
                    />
                    <Button onClick={()=> navigate("/admin/jobs/create")} className='bg-black text-white border-solid border-black rounded my-4 hover:bg-gray-200 hover:text-black'>Post New Job</Button>
                </div>
                <AdminJobsTable/>
            </div>
        </div>
    )
}

export default AdminJobs