import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Check, MoreHorizontal, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const statusHandler = async (status, id) => {
        try {
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status }, {
                withCredentials: true
            });
            if(res.data.success){
                toast.success(res.data.message);
            }
        } catch (err) {
            toast.error(err.response.data.message);
        }
    }
    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied user.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applicants && applicants?.applications?.map((item) => (
                            <tr key={item._id}>
                                <TableCell>{item?.applicant?.fullname}</TableCell>
                                <TableCell>{item?.applicant?.email}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell>
                                    {
                                        item?.applicant?.profile?.resume_link ? <a href={item?.applicant?.profile?.resume_link} className='text-blue-500 hover:underline' target='_blank'>Link</a> : <p>NA</p>
                                    }
                                    {/*
                                        item?.applicant?.profile?.resume ? <a href={item?.applicant?.profile?.resume} className='text-blue-500 hover:underline' target='_blank'>{item?.applicant?.profile?.resumeOriginalName}</a> : <p>NA</p>
                                    */}
                                </TableCell>
                                <TableCell>{item?.applicant?.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="float-right cursor-pointer" >
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            {
                                                shortlistingStatus.map((status, index) => {
                                                    return (
                                                        <div onClick={()=>statusHandler(status,item?._id)} key={index} className='flex w-fit items-center my-2 cursor-pointer hover:bg-gray-200 px-1 py-1 rounded-md'>
                                                            <span className='hover:bg-gray'>{status}</span>
                                                            {status.toLowerCase() === "accepted" ? (
                                                                <Check className="text-green-500 h-4 w-4" strokeWidth={4} /> // Green check icon
                                                            ) : status.toLowerCase() === "rejected" ? (
                                                                <X className="text-red-500 h-4 w-4 " strokeWidth={4} /> // Red cross icon
                                                            ) : null}
                                                        </div>
                                                    )
                                                })
                                            }
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </tr>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default ApplicantsTable