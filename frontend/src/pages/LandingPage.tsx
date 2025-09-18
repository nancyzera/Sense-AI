import HeroSection from '@/components/custom/molecules/Hero'
import React from 'react'
import Navbar from '@/components/custom/molecules/Navbar'
import { testimonials } from '@/data';
import TestimonialCard from '@/components/custom/atoms/TestmonialCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Footer from '@/components/custom/molecules/Footer';

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <div className='w-full h-full flex flex-col items-center'>
          <div className='w-10/12 max-sm:w-11/12'>
              <HeroSection />
          </div>
      </div>
      <div className='bg-[#202735] pr-10 pl-10 mt-24 w-full flex justify-center items-center pt-10 pb-10'>
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          <div className='flex flex-col items-center justify-center'>
            <div>
              <h4 className='font-normal text-white text-4xl text-center'>10M+</h4>
            </div>
            <div>
              <p className='text-center mt-6 text-[#656D78] text-xs md:text-sm'>Users Helped</p>
            </div>
          </div>
          <div className='flex flex-col items-center justify-center'>
            <div>
              <h4 className='font-normal text-white text-4xl text-center'>98%</h4>
            </div>
            <div>
              <p className='text-center mt-6 text-[#656D78] text-xs md:text-sm'>Accuracy Rate</p>
            </div>
          </div>
          <div className='flex flex-col items-center justify-center'>
            <div>
              <h4 className='font-normal text-white text-4xl text-center'>50+</h4>
            </div>
            <div>
              <p className='text-center mt-6 text-[#656D78] text-xs md:text-sm'>Languages</p>
            </div>
          </div>
          <div className='flex flex-col items-center justify-center'>
            <div>
              <h4 className='font-normal text-white text-4xl text-center'>24/7</h4>
            </div>
            <div>
              <p className='text-center mt-6 text-[#656D78] text-xs md:text-sm'>Availability</p>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full pl-24 pr-24 mt-16 pb-16 h-full flex flex-col items-center' id='features'>
        <div className='w-10/12 max-sm:w-11/12'>
          <h4 className='font-normal text-white leading-[50px] text-2xl text-center'>Comprehensive Accessibility Solutions</h4>
          <p className='text-center mt-6 leading-[25px] text-[#656D78] text-xs md:text-sm'>Our AI-powered platform provides a complete suite of tools designed to break down<br /> communication barriers and enhance accessibility.</p>
          <div className='mt-8'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>

              <div className='bg-[#2A3540] p-8 rounded-[12px]'>
                <div className='flex flex-row items-center space-x-2'>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} fill="#5087FA">
                      <path d="M11.9998 3C10.3429 3 8.99976 4.34315 8.99976 6V10C8.99976 11.6569 10.3429 13 11.9998 13C13.6566 13 14.9998 11.6569 14.9998 10V6C14.9998 4.34315 13.6566 3 11.9998 3ZM11.9998 1C14.7612 1 16.9998 3.23858 16.9998 6V10C16.9998 12.7614 14.7612 15 11.9998 15C9.23833 15 6.99976 12.7614 6.99976 10V6C6.99976 3.23858 9.23833 1 11.9998 1ZM3.05469 11H5.07065C5.55588 14.3923 8.47329 17 11.9998 17C15.5262 17 18.4436 14.3923 18.9289 11H20.9448C20.4837 15.1716 17.1714 18.4839 12.9998 18.9451V23H10.9998V18.9451C6.82814 18.4839 3.51584 15.1716 3.05469 11Z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className='text-center text-white/70 text-xs md:text-sm'>Voice-to-Text</p>
                  </div>
                </div>
                <div className='mt-4'>
                  <p className='text-start text-[#656D78] text-xs md:text-sm'>Convert spoken words into readable text in real-time with 98% accuracy</p>
                </div>
              </div>
              <div className='bg-[#2A3540] p-8 rounded-[12px]'>
                <div className='flex flex-row items-center space-x-2'>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} fill="#59AC77">
                      <path d="M6.60282 10.0001L10 7.22056V16.7796L6.60282 14.0001H3V10.0001H6.60282ZM2 16.0001H5.88889L11.1834 20.3319C11.2727 20.405 11.3846 20.4449 11.5 20.4449C11.7761 20.4449 12 20.2211 12 19.9449V4.05519C12 3.93977 11.9601 3.8279 11.887 3.73857C11.7121 3.52485 11.3971 3.49335 11.1834 3.66821L5.88889 8.00007H2C1.44772 8.00007 1 8.44778 1 9.00007V15.0001C1 15.5524 1.44772 16.0001 2 16.0001ZM23 12C23 15.292 21.5539 18.2463 19.2622 20.2622L17.8445 18.8444C19.7758 17.1937 21 14.7398 21 12C21 9.26016 19.7758 6.80629 17.8445 5.15557L19.2622 3.73779C21.5539 5.75368 23 8.70795 23 12ZM18 12C18 10.0883 17.106 8.38548 15.7133 7.28673L14.2842 8.71584C15.3213 9.43855 16 10.64 16 12C16 13.36 15.3213 14.5614 14.2842 15.2841L15.7133 16.7132C17.106 15.6145 18 13.9116 18 12Z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className='text-center text-white/70 text-xs md:text-sm'>Text-to-Speech</p>
                  </div>
                </div>
                <div className='mt-4'>
                  <p className='text-start text-[#656D78] text-xs md:text-sm'>Transform text into natural-sounding voice with multiple language support</p>
                </div>
              </div>
              <div className='bg-[#2A3540] p-8 rounded-[12px]'>
                <div className='flex flex-row items-center space-x-2'>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} fill="#3B0270">
                      <path d="M12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3ZM12.0003 19C16.2359 19 19.8603 16.052 20.7777 12C19.8603 7.94803 16.2359 5 12.0003 5C7.7646 5 4.14022 7.94803 3.22278 12C4.14022 16.052 7.7646 19 12.0003 19ZM12.0003 16.5C9.51498 16.5 7.50026 14.4853 7.50026 12C7.50026 9.51472 9.51498 7.5 12.0003 7.5C14.4855 7.5 16.5003 9.51472 16.5003 12C16.5003 14.4853 14.4855 16.5 12.0003 16.5ZM12.0003 14.5C13.381 14.5 14.5003 13.3807 14.5003 12C14.5003 10.6193 13.381 9.5 12.0003 9.5C10.6196 9.5 9.50026 10.6193 9.50026 12C9.50026 13.3807 10.6196 14.5 12.0003 14.5Z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className='text-center text-white/70 text-xs md:text-sm'>Vision Support</p>
                  </div>
                </div>
                <div className='mt-4'>
                  <p className='text-start text-[#656D78] text-xs md:text-sm'>AI powered image analysis and scene description for visual assistance</p>
                </div>
              </div>
              <div className='bg-[#2A3540] p-8 rounded-[12px]'>
                <div className='flex flex-row items-center space-x-2'>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} fill="#EF7722">
                      <path d="M12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3ZM12.0003 19C16.2359 19 19.8603 16.052 20.7777 12C19.8603 7.94803 16.2359 5 12.0003 5C7.7646 5 4.14022 7.94803 3.22278 12C4.14022 16.052 7.7646 19 12.0003 19ZM12.0003 16.5C9.51498 16.5 7.50026 14.4853 7.50026 12C7.50026 9.51472 9.51498 7.5 12.0003 7.5C14.4855 7.5 16.5003 9.51472 16.5003 12C16.5003 14.4853 14.4855 16.5 12.0003 16.5ZM12.0003 14.5C13.381 14.5 14.5003 13.3807 14.5003 12C14.5003 10.6193 13.381 9.5 12.0003 9.5C10.6196 9.5 9.50026 10.6193 9.50026 12C9.50026 13.3807 10.6196 14.5 12.0003 14.5Z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className='text-center text-white/70 text-xs md:text-sm'>Wearable Integration</p>
                  </div>
                </div>
                <div className='mt-4'>
                  <p className='text-start text-[#656D78] text-xs md:text-sm'>Connect smart watches and haptic devices for seamless notifications</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div className='w-full bg-[#202735] mt-16 pb-16 h-full flex flex-col items-center' id='pricing'>
        <div className='w-10/12 pt-10 pb-10 max-sm:w-11/12'>
          <h4 className='font-normal text-white leading-[50px] text-2xl text-center'>Choose Your Plan</h4>
          <p className='text-center mt-4 text-[#656D78] text-xs md:text-sm'>Start free and upgrade as you grow</p>

          <div className='mt-10 pr-24 pl-24 grid grid-cols-1 gap-4 sm:grid-cols-3'>
            <div className='bg-[#2A3540] rounded-[12px] shadow-sm p-8 flex justify-center'>
              <div>
                <p className='text-center mt-4 text-white text-xs md:text-sm'>Free</p>
                <p className='text-center mt-4 text-white font-bold text-xs md:text-[25px]'>$0<span className='text-xs md:text-sm font-normal text-[#656D78]'>/month</span></p>
                <p className='text-center mt-4 text-[#656D78] text-xs md:text-sm'>Perfect for trying out our platform</p>

                <div className='flex flex-col mt-10 space-y-2'>
                  <div className='flex flex-row items-center space-x-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} fill="#169976">
                      <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
                    </svg>
                    <p className='text-center text-[#656D78] text-xs md:text-sm'>100 minutes voice-to-text</p>
                  </div>
                  <div className='flex flex-row items-center space-x-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} fill="#169976">
                      <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
                    </svg>
                    <p className='text-center text-[#656D78] text-xs md:text-sm'>50 text-to-speech converstions</p>
                  </div>
                  <div className='flex flex-row items-center space-x-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} fill="#169976">
                      <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
                    </svg>
                    <p className='text-center text-[#656D78] text-xs md:text-sm'>Basic vision support</p>
                  </div>
                  <div className='flex flex-row items-center space-x-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} fill="#169976">
                      <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
                    </svg>
                    <p className='text-center text-[#656D78] text-xs md:text-sm'>One device connection</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='bg-[#2A3540] relative border-[2px] border-solid border-[#5087FA] rounded-[12px] shadow-sm p-8 flex justify-center'>
              <div className='bg-[#5087FA] absolute -top-3 left-1/2 -translate-x-1/2 px-[8px] py-[4px] rounded-md'>
                <p className='text-center text-white text-xs md:text-sm'>Most Popular</p>
              </div>
              <div>
                <p className='text-center mt-4 text-white text-xs md:text-sm'>Free</p>
                <p className='text-center mt-4 text-white font-bold text-xs md:text-[25px]'>$0<span className='text-xs md:text-sm font-normal text-[#656D78]'>/month</span></p>
                <p className='text-center mt-4 text-[#656D78] text-xs md:text-sm'>Perfect for trying out our platform</p>

                <div className='flex flex-col mt-10 space-y-2'>
                  <div className='flex flex-row items-center space-x-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} fill="#169976">
                      <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
                    </svg>
                    <p className='text-center text-[#656D78] text-xs md:text-sm'>100 minutes voice-to-text</p>
                  </div>
                  <div className='flex flex-row items-center space-x-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} fill="#169976">
                      <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
                    </svg>
                    <p className='text-center text-[#656D78] text-xs md:text-sm'>50 text-to-speech converstions</p>
                  </div>
                  <div className='flex flex-row items-center space-x-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} fill="#169976">
                      <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
                    </svg>
                    <p className='text-center text-[#656D78] text-xs md:text-sm'>Basic vision support</p>
                  </div>
                  <div className='flex flex-row items-center space-x-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} fill="#169976">
                      <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
                    </svg>
                    <p className='text-center text-[#656D78] text-xs md:text-sm'>One device connection</p>
                  </div>
                </div>
                <Button className='mt-4 w-full bg-[#5087FA]'>
                    Start Pro Trial
                </Button> 
              </div>
            </div>
            <div className='bg-[#2A3540] rounded-[12px] shadow-sm p-8 flex justify-center'>
              <div>
                <p className='text-center mt-4 text-white text-xs md:text-sm'>Free</p>
                <p className='text-center mt-4 text-white font-bold text-xs md:text-[25px]'>$0<span className='text-xs md:text-sm font-normal text-[#656D78]'>/month</span></p>
                <p className='text-center mt-4 text-[#656D78] text-xs md:text-sm'>Perfect for trying out our platform</p>

                <div className='flex flex-col mt-10 space-y-2'>
                  <div className='flex flex-row items-center space-x-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} fill="#169976">
                      <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
                    </svg>
                    <p className='text-center text-[#656D78] text-xs md:text-sm'>100 minutes voice-to-text</p>
                  </div>
                  <div className='flex flex-row items-center space-x-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} fill="#169976">
                      <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
                    </svg>
                    <p className='text-center text-[#656D78] text-xs md:text-sm'>50 text-to-speech converstions</p>
                  </div>
                  <div className='flex flex-row items-center space-x-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} fill="#169976">
                      <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
                    </svg>
                    <p className='text-center text-[#656D78] text-xs md:text-sm'>Basic vision support</p>
                  </div>
                  <div className='flex flex-row items-center space-x-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} fill="#169976">
                      <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
                    </svg>
                    <p className='text-center text-[#656D78] text-xs md:text-sm'>One device connection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full mt-16 pb-16 h-full flex flex-col items-center' id='testmonials'>
        <div className='w-10/12 pt-10 pb-10 max-sm:w-11/12'>
          <h4 className='font-normal text-white leading-[50px] text-2xl text-center'>Trusted by Thousands</h4>
          <p className='text-center mt-4 text-[#656D78] text-xs md:text-sm'>See what our users say about Sense AI</p>
          <div className="grid w-full grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3 sm:p-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </div>
      <div className='w-full pt-16 pb-16 bg-[#202943] flex justify-center'>
        <div>
          <h4 className='font-normal text-white leading-[35px] text-2xl text-center'>Ready to Break Communication<br /> Barriers?</h4>
          <p className='text-center mt-4 leading-[25px] text-[#656D78] text-xs md:text-sm'>Join thousands of users who are already experiencing the power of AI-driven accessibility.</p>

          <div className='mt-4 w-full flex justify-center'>
            <Button className='bg-[#5087FA] flex flex-row items-center space-x-4'>
                Start Your Free Trial Today
                <ArrowRight />
            </Button> 
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default LandingPage