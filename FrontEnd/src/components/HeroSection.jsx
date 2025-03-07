import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            searchJobHandler();
        }
    };

    return (
        <div className='text-center'>
            <div className='flex flex-col gap-5 my-10'>
                <span className='mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium'>No.1 Job Search Website</span>
                <h1 className='text-5xl font-bold'>Search, Apply &<br /> Get Your <span className='text-[#6A38C2]'>Dream Job</span></h1>
                <p>Welcome to <span className='font-bold'>Job <span className='text-[#F83002]'>Space</span></span>—your gateway to a world of opportunities.<br/> Start your journey today and land the job you deserve!</p>
                <div className='flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
                    <input
                        type='text'
                        placeholder='Find your dream job'
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className='outline-none border-none w-full'
                    ></input>
                    <Button onClick={searchJobHandler} className="rounded-r-full bg-[#6A38C2] text-white hover:bg-black">
                        <Search className='h-5 w-5' />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default HeroSection