import Sidebar from "@/components/custom/organisms/Sidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

const Chat = () => {
  return (
    <div>
      <div className="w-full fixed top-0 right-0 left-0 flex items-center justify-between pr-[10px] pl-[10px] h-[70px] border-b-[1px] border-solid border-[#656D78] bg-[#222836]">
        <div className="flex flex-row items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={25}
            height={25}
            fill="#5087FA"
          >
            <path d="M9 4C10.1046 4 11 4.89543 11 6V12.8271C10.1058 12.1373 8.96602 11.7305 7.6644 11.5136L7.3356 13.4864C8.71622 13.7165 9.59743 14.1528 10.1402 14.7408C10.67 15.3147 11 16.167 11 17.5C11 18.8807 9.88071 20 8.5 20C7.11929 20 6 18.8807 6 17.5V17.1493C6.43007 17.2926 6.87634 17.4099 7.3356 17.4864L7.6644 15.5136C6.92149 15.3898 6.1752 15.1144 5.42909 14.7599C4.58157 14.3573 4 13.499 4 12.5C4 11.6653 4.20761 11.0085 4.55874 10.5257C4.90441 10.0504 5.4419 9.6703 6.24254 9.47014L7 9.28078V6C7 4.89543 7.89543 4 9 4ZM12 3.35418C11.2671 2.52376 10.1947 2 9 2C6.79086 2 5 3.79086 5 6V7.77422C4.14895 8.11644 3.45143 8.64785 2.94126 9.34933C2.29239 10.2415 2 11.3347 2 12.5C2 14.0652 2.79565 15.4367 4 16.2422V17.5C4 19.9853 6.01472 22 8.5 22C9.91363 22 11.175 21.3482 12 20.3287C12.825 21.3482 14.0864 22 15.5 22C17.9853 22 20 19.9853 20 17.5V16.2422C21.2044 15.4367 22 14.0652 22 12.5C22 11.3347 21.7076 10.2415 21.0587 9.34933C20.5486 8.64785 19.8511 8.11644 19 7.77422V6C19 3.79086 17.2091 2 15 2C13.8053 2 12.7329 2.52376 12 3.35418ZM18 17.1493V17.5C18 18.8807 16.8807 20 15.5 20C14.1193 20 13 18.8807 13 17.5C13 16.167 13.33 15.3147 13.8598 14.7408C14.4026 14.1528 15.2838 13.7165 16.6644 13.4864L16.3356 11.5136C15.034 11.7305 13.8942 12.1373 13 12.8271V6C13 4.89543 13.8954 4 15 4C16.1046 4 17 4.89543 17 6V9.28078L17.7575 9.47014C18.5581 9.6703 19.0956 10.0504 19.4413 10.5257C19.7924 11.0085 20 11.6653 20 12.5C20 13.499 19.4184 14.3573 18.5709 14.7599C17.8248 15.1144 17.0785 15.3898 16.3356 15.5136L16.6644 17.4864C17.1237 17.4099 17.5699 17.2926 18 17.1493Z"></path>
          </svg>
          <h4 className="font-bold text-white">Sense AI</h4>
        </div>
        <div className="flex flex-row items-center space-x-6">
          <div className="relative cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 24 24" fill="#656D78">
              <path d="M5 18H19V11.0314C19 7.14806 15.866 4 12 4C8.13401 4 5 7.14806 5 11.0314V18ZM12 2C16.9706 2 21 6.04348 21 11.0314V20H3V11.0314C3 6.04348 7.02944 2 12 2ZM9.5 21H14.5C14.5 22.3807 13.3807 23.5 12 23.5C10.6193 23.5 9.5 22.3807 9.5 21Z"></path>
            </svg>
            <div className="w-[10px] h-[10px] bg-[#5087FA] rounded-full absolute top-0 right-0"></div>
          </div>
          <div className="flex cursor-pointer flex-row space-x-2 items-center">
            <div className="w-[40px] h-[40px] bg-[#656D78] overflow-hidden rounded-full">
              <img src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_1.png" className="w-full h-full object-cover object-center" alt="Profile" />
            </div>
            <div>
              <p className="text-xs text-white w-full cursor-pointer md:text-sm">Caleb Kwizera</p>
              <div className="bg-[#5087FA] flex w-[80px] justify-center items-center space-x-[3px] px-[4px] py-[2px] rounded-[12px]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={14} height={14} fill="#fff">
                  <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z"></path>
                </svg>
                <p className="text-xs text-white md:text-sm uppercase">Free</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-[70px]">
        <Sidebar />
        <div className="md:ml-[250px] pt-4 pl-4 pr-4 pb-10">
            <h4 className='font-normal text-white leading-[40px] text-2xl'>AI Chat Assistant</h4>

            <div className="w-full bg-[#222836] mt-4 p-6 rounded-[12px]">
                <div className="flex flex-row items-center space-x-2">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} fill="#5087FA">
                            <path d="M13.5 2C13.5 2.44425 13.3069 2.84339 13 3.11805V5H18C19.6569 5 21 6.34315 21 8V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V8C3 6.34315 4.34315 5 6 5H11V3.11805C10.6931 2.84339 10.5 2.44425 10.5 2C10.5 1.17157 11.1716 0.5 12 0.5C12.8284 0.5 13.5 1.17157 13.5 2ZM6 7C5.44772 7 5 7.44772 5 8V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V8C19 7.44772 18.5523 7 18 7H13H11H6ZM2 10H0V16H2V10ZM22 10H24V16H22V10ZM9 14.5C9.82843 14.5 10.5 13.8284 10.5 13C10.5 12.1716 9.82843 11.5 9 11.5C8.17157 11.5 7.5 12.1716 7.5 13C7.5 13.8284 8.17157 14.5 9 14.5ZM15 14.5C15.8284 14.5 16.5 13.8284 16.5 13C16.5 12.1716 15.8284 11.5 15 11.5C14.1716 11.5 13.5 12.1716 13.5 13C13.5 13.8284 14.1716 14.5 15 14.5Z"></path>
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs text-white w-full cursor-pointer md:text-sm">Sense AI Assistant</p>
                    </div>
                    <div className="bg-green-500 flex w-[80px] justify-center items-center space-x-[3px] px-[4px] py-[2px] rounded-[12px]">
                        <p className="text-xs text-white md:text-sm">Online</p>
                    </div>
                </div>

                <div className="min-h-[400px]">
                    <div className="flex flex-row mt-10 space-x-4 items-start">
                        <div className="w-[50px] h-[50px] rounded-full flex justify-center items-center bg-[#5087FA]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} fill="#fff">
                                <path d="M13.5 2C13.5 2.44425 13.3069 2.84339 13 3.11805V5H18C19.6569 5 21 6.34315 21 8V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V8C3 6.34315 4.34315 5 6 5H11V3.11805C10.6931 2.84339 10.5 2.44425 10.5 2C10.5 1.17157 11.1716 0.5 12 0.5C12.8284 0.5 13.5 1.17157 13.5 2ZM6 7C5.44772 7 5 7.44772 5 8V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V8C19 7.44772 18.5523 7 18 7H13H11H6ZM2 10H0V16H2V10ZM22 10H24V16H22V10ZM9 14.5C9.82843 14.5 10.5 13.8284 10.5 13C10.5 12.1716 9.82843 11.5 9 11.5C8.17157 11.5 7.5 12.1716 7.5 13C7.5 13.8284 8.17157 14.5 9 14.5ZM15 14.5C15.8284 14.5 16.5 13.8284 16.5 13C16.5 12.1716 15.8284 11.5 15 11.5C14.1716 11.5 13.5 12.1716 13.5 13C13.5 13.8284 14.1716 14.5 15 14.5Z"></path>
                            </svg>
                        </div>
                        <div>
                            <div className="p-4 rounded-[12px] bg-[#374151]">
                                <p className="text-xs text-white w-full cursor-pointer md:text-sm">
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Explicabo delectus deserunt optio omnis magnam similique itaque rerum blanditiis soluta et.
                                </p>
                            </div>
                            <p className="text-xs mt-[2px] text-white/70 w-full cursor-pointer">10:00 PM</p>
                        </div>
                    </div>
                    <div className="flex flex-row justify-end mt-10 space-x-4 items-start">
                        <div>
                            <div className="p-4 rounded-[12px] bg-[#374151]">
                                <p className="text-xs text-white w-full cursor-pointer md:text-sm">
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Explicabo delectus deserunt optio omnis magnam similique itaque rerum blanditiis soluta et.
                                </p>
                            </div>
                            <p className="text-xs mt-[2px] text-white/70 w-full cursor-pointer">10:00 PM</p>
                        </div>
                        <div className="w-[50px] h-[50px] bg-[#656D78] overflow-hidden rounded-full">
                            <img src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_1.png" className="w-full h-full object-cover object-center" alt="Profile" />
                        </div>
                    </div>
                </div>


                <div className="mt-10 border-t-[1px] border-solid border-[#656D78]">
                    <div className="mt-4 mb-4">
                        <p className="text-xs text-white w-full cursor-pointer md:text-sm">Quick Actions</p>
                        <div className="flex flex-row flex-wrap mt-2 space-x-4 items-center">
                            <Button className='bg-[#1B1F2F] border-[1px] border-solid border-[#656D78]'>
                                Start voice-to-text
                            </Button> 
                            <Button className='bg-[#1B1F2F] border-[1px] border-solid border-[#656D78]'>
                                Read this text aloud
                            </Button> 
                            <Button className='bg-[#1B1F2F] border-[1px] border-solid border-[#656D78]'>
                                Analyze an image
                            </Button> 
                            <Button className='bg-[#1B1F2F] border-[1px] border-solid border-[#656D78]'>
                                Navigation Help
                            </Button> 
                            <Button className='bg-[#1B1F2F] border-[1px] border-solid border-[#656D78]'>
                                Conect mobility device
                            </Button> 
                            <Button className='bg-[#1B1F2F] border-[1px] border-solid border-[#656D78]'>
                                Emergency assistance
                            </Button> 
                        </div>
                    </div>
                </div>

                <div className="border-t-[1px] w-full pt-4 border-solid border-[#656D78]">
                    <div className="flex w-full flex-row space-x-4 items-start">
                        <div className="flex justify-center bg-[#1B1F2F] border-[1px] border-solid border-[#656D78] items-center w-[50px] h-[50px] rounded-[12px]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} fill="#fff">
                                <path d="M11.9998 3C10.3429 3 8.99976 4.34315 8.99976 6V10C8.99976 11.6569 10.3429 13 11.9998 13C13.6566 13 14.9998 11.6569 14.9998 10V6C14.9998 4.34315 13.6566 3 11.9998 3ZM11.9998 1C14.7612 1 16.9998 3.23858 16.9998 6V10C16.9998 12.7614 14.7612 15 11.9998 15C9.23833 15 6.99976 12.7614 6.99976 10V6C6.99976 3.23858 9.23833 1 11.9998 1ZM3.05469 11H5.07065C5.55588 14.3923 8.47329 17 11.9998 17C15.5262 17 18.4436 14.3923 18.9289 11H20.9448C20.4837 15.1716 17.1714 18.4839 12.9998 18.9451V23H10.9998V18.9451C6.82814 18.4839 3.51584 15.1716 3.05469 11Z"></path>
                            </svg>
                        </div>
                        <form className="flex-1">
                            <Textarea className="bg-[#374151] text-white border-none outline-none flex-1" placeholder="Type your message" />
                        </form>
                        <div className="flex justify-center bg-[#5087FA] border-[1px] border-solid border-[#656D78] items-center w-[50px] h-[50px] rounded-[12px]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} fill="#fff">
                                <path d="M3.5 1.34558C3.58425 1.34558 3.66714 1.36687 3.74096 1.40747L22.2034 11.5618C22.4454 11.6949 22.5337 11.9989 22.4006 12.2409C22.3549 12.324 22.2865 12.3924 22.2034 12.4381L3.74096 22.5924C3.499 22.7255 3.19497 22.6372 3.06189 22.3953C3.02129 22.3214 3 22.2386 3 22.1543V1.84558C3 1.56944 3.22386 1.34558 3.5 1.34558ZM5 4.38249V10.9999H10V12.9999H5V19.6174L18.8499 11.9999L5 4.38249Z"></path>
                            </svg>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
