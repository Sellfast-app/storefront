import Image from 'next/image'
import React from 'react'
import Banner from '@/public/Banner.png'
import Profile from '@/public/profile.png'
import FacebookIcon from '@/components/svgIcons/FacebookIcon'
import WhatsappIcon from '@/components/svgIcons/WhatsappIcon'
import InstagramIcon from '@/components/svgIcons/InstagramIcon'

function page() {
    return (
        <div className='p-6 flex justify-between gap-4'>
            <div className='w-[45%]'>
                <div className='relative'>
                    <Image src={Banner} alt='' />
                    <div className='absolute bottom-[-60px] left-1/2 -translate-x-1/2'>
                        <Image src={Profile} alt='' />
                    </div>
                </div>
                <div className='mt-16'>
                    <h3 className='text-center mt-6  text-lg font-semibold'>Cassie&apos;s Kitchen</h3>
                    <div className='flex items-center justify-center gap-4 mt-2'>
                        <div className='flex flex-col items-center'>
                            <h3 className='text-lg font-semibold'>24</h3>
                            <span className='text-xs text-[#A0A0A0]'>Listings</span>
                        </div>
                        <div className='flex flex-col items-center'>
                            <h3 className='text-lg font-semibold'>4.5</h3>
                            <span className='text-xs text-[#A0A0A0]'>Ratings</span>
                        </div>
                        <div className='flex flex-col items-center'>
                            <h3 className='text-lg font-semibold'>87%</h3>
                            <span className='text-xs text-[#A0A0A0]'>Performance Score</span>
                        </div>
                    </div>
                </div>
                <div className='flex flex-row md:flex-col mt-6 gap-4'>
                    <div className='flex items-center gap-3'><FacebookIcon/> <span className='rounded-full bg-[#F5F5F5] text-sm p-2'>www.facebook.com/Cassies-Kitchen</span></div>
                    <div className='flex items-center gap-3'><WhatsappIcon/> <span className='rounded-full bg-[#F5F5F5] text-sm p-2'>wa.me/chat.whatsapp.com/2348093450098</span></div>
                    <div className='flex items-center gap-3'><InstagramIcon/> <span className='rounded-full bg-[#F5F5F5] text-sm p-2'>www.instagram.com/cassies-kitchen</span></div>
                </div>
                <div className='mt-6 flex justify-between items-center'>
                    <span>Reviews(420)</span>
                    <span>See All</span>
                </div>
            </div>
            <div className='w-[55%]'>page</div>
        </div>
    )
}

export default page