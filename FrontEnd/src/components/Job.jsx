import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const Job = ({job}) => {
    const navigate = useNavigate();
    const jobId = job?._id;
    const daysAgo = (mongodbTime) =>{
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDiff = currentTime-createdAt;
        return Math.floor(timeDiff/(1000*24*60*60));
    }

    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-200'>
            <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-500'>{daysAgo(job?.createdAt)==0 ? "Today" : `${daysAgo(job?.createdAt)} days ago`}</p>
                {/*<Button className="rounded-full hover:bg-gray-100" size="icon"><Bookmark /></Button>*/}
            </div>
            <div className='flex items-center gap-2 my-2'>
                <Button className="p-6 rounded-full" size="icon">
                    <Avatar>
                        <AvatarImage src={job?.company?.logo || "https://www.shutterstock.com/image-vector/image-icon-trendy-flat-style-600nw-643080895.jpg"} />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
                    <p className='text-sm text-gray-500'>India</p>
                </div>
            </div>

            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600'>{job?.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType} </Badge>
                <Badge className={'text-[#7209B7] font-bold'} variant="ghost">{job?.salary}LPA</Badge>
            </div>
            <div className='flex items-center gap-4 mt-4'>
                <Button className='bg-black text-white border-solid border-black rounded my-4 hover:bg-gray-200 hover:text-black' onClick={()=> navigate(`/description/${jobId}`)}>Details</Button>
                {/*<Button className='bg-black text-white border-solid border-black rounded my-4 hover:bg-gray-200 hover:text-black'>Save For Later</Button>*/}
            </div>
        </div>
    )
}

export default Job