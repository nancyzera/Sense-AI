import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const HeroSection = () => {
  return (
    <div className='w-full flex justify-center items-center mt-16'>
        <div className='w-full'>
            <div className='w-full flex flex-row justify-center'>
                <div className='bg-[#202943] border-[#26345B] w-[300px] flex justify-center items-center mb-10 border-solid border-[1px] py-2 rounded-full'>
                    <div className='flex flex-row space-x-2 items-center'>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} fill="#395AA3">
                                <path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path>
                            </svg>
                        </div>
                        <div>
                            <p className='text-center text-[#395AA3] text-xs md:text-sm'>Breaking Communication Barriers</p>
                        </div>
                    </div>
                </div>
            </div>
            <h4 className='font-normal text-white leading-[50px] text-4xl text-center'>AI-Powered Accessibility for<br /> <span className='text-[#5087FA]'>Everyone</span></h4>
            <p className='text-center mt-6 leading-[25px] text-[#656D78] text-xs md:text-sm'>Empowering individuals with disabilities through intelligent voice-to-text, text-to-speech,<br /> vision-support, and seamless wearable device integration.</p>
            <div className='mt-4 w-full flex flex-row justify-center items-center space-x-4'>
                <Link to={'/signup'}>
                    <Button className='bg-[#5087FA] flex flex-row items-center space-x-4'>
                        Get Started
                        <ArrowRight />
                    </Button> 
                </Link>
                <Button variant='outline' className='flex flex-row bg-transparent text-white/70 border-solid border-[1px] border-[#656D78] items-center space-x-4'>
                    Watch Demo
                </Button> 
            </div>
        </div>
    </div>
  )
}

export default HeroSection