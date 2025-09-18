import Sidebar from "@/components/custom/organisms/Sidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Settings } from "lucide-react";
import React from "react";

const Developer = () => {
    const isFree = false
  return (
    <div>
      <div className="w-full flex items-center justify-between pr-[10px] pl-[10px] h-[70px] border-b-[1px] border-solid border-[#656D78] bg-[#222836]">
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
      <div>
        <Sidebar />
        <div className="md:ml-[250px] flex-1 pt-4 pl-4 pr-4 pb-10">
            {isFree &&
                <div className="w-full flex flex-col mt-16 items-center justify-center">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={40} height={40} fill="#5087FA">
                            <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"></path>
                        </svg>
                    </div>
                    <h4 className='font-normal text-white leading-[40px] text-2xl text-center'>Premium Feature</h4>
                    <p className='text-center mt-4 text-[#656D78] text-xs md:text-sm'>This feature is available with our Pro or Enterprise plans.</p>
                    <Button className='bg-[#5087FA] mt-4'>
                        Upgrade to Access
                    </Button> 
                </div>
            }

            <div className="border-[1px] rounded-[12px] bg-[#222836] p-4 w-full pt-4 border-solid border-[#656D78]">
                <div className="flex flex-row space-x-4 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} fill="#5087FA">
                        <path d="M10.7577 11.8281L18.6066 3.97919L20.0208 5.3934L18.6066 6.80761L21.0815 9.28249L19.6673 10.6967L17.1924 8.22183L15.7782 9.63604L17.8995 11.7574L16.4853 13.1716L14.364 11.0503L12.1719 13.2423C13.4581 15.1837 13.246 17.8251 11.5355 19.5355C9.58291 21.4882 6.41709 21.4882 4.46447 19.5355C2.51184 17.5829 2.51184 14.4171 4.46447 12.4645C6.17493 10.754 8.81633 10.5419 10.7577 11.8281ZM10.1213 18.1213C11.2929 16.9497 11.2929 15.0503 10.1213 13.8787C8.94975 12.7071 7.05025 12.7071 5.87868 13.8787C4.70711 15.0503 4.70711 16.9497 5.87868 18.1213C7.05025 19.2929 8.94975 19.2929 10.1213 18.1213Z"></path>
                    </svg>
                    <p className="text-xs text-white w-full cursor-pointer md:text-sm">Device Delivery</p>
                </div>
                <div className="flex flex-row items-center space-x-4 w-full justify-between">
                    <div className="flex flex-row bg-[#1a1f2e] flex-1 rounded-[12px] mt-4 p-2 space-x-4 items-center">
                        <p className='text-center text-[#656D78] text-xs md:text-sm'>Your API key will appear here</p>
                    </div>
                    <Button className='bg-[#5087FA] flex flex-row items-center justify-center mt-4'>
                        Generate Key
                    </Button>
                </div>
                <div className="flex flex-row bg-[#1a1f2e] rounded-[12px] mt-4 p-2 space-x-4 items-center">
                    <Settings className="w-5 h-5 text-white" />
                    <p className='text-center text-[#656D78] text-xs md:text-sm'>Keep your API key secure.Don't share it in client-side code or public repositories.</p>
                </div> 
            </div>

            <div className="border-[1px] mt-4 rounded-[12px] bg-[#222836] p-4 w-full pt-4 border-solid border-[#656D78]">
                <div className="flex flex-row space-x-4 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} fill="#5087FA">
                        <path d="M13 10H18L12 16L6 10H11V3H13V10ZM4 19H20V12H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V12H4V19Z"></path>
                    </svg>
                    <p className="text-xs text-white w-full cursor-pointer md:text-sm">SDK Installation</p>
                </div>

                <div className="mt-4 w-full">
                    <Tabs defaultValue="javascript" className="w-full">
                        <TabsList>
                            <TabsTrigger className="text-white" value="javascript">Javascript</TabsTrigger>
                            <TabsTrigger className="text-white" value="python">Python</TabsTrigger>
                            <TabsTrigger className="text-white" value="react">React</TabsTrigger>
                            <TabsTrigger className="text-white" value="webhooks">Web hooks</TabsTrigger>
                        </TabsList>
                        <TabsContent value="javascript" className="bg-[#222836] rounded-[12px] flex flex-row items-center space-x-4 py-2 px-4">
                            <p className='text-center text-white/70 text-xs md:text-sm'>npm install @sense-ai/ai-sdk</p>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} fill="#fff">
                                    <path d="M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V20.9991C16.9998 21.5519 16.5499 22 15.993 22H4.00666C3.45059 22 3 21.5554 3 20.9991L3.0026 7.00087C3.0027 6.44811 3.45264 6 4.00942 6H6.9998ZM5.00242 8L5.00019 20H14.9998V8H5.00242ZM8.9998 6H16.9998V16H18.9998V4H8.9998V6Z"></path>
                                </svg>
                            </div>
                        </TabsContent>
                        <TabsContent value="password">Change your password here.</TabsContent>
                    </Tabs>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Developer;
