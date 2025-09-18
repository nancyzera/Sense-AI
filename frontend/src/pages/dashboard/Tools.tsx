import Sidebar from "@/components/custom/organisms/Sidebar";
import React from "react";

const Tools = () => {
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
            <div className="w-full flex flex-col mt-16 items-center justify-center">
                <h4 className='font-normal text-white leading-[40px] text-2xl text-center'>Select Tool</h4>
                <p className='text-center mt-4 text-[#656D78] text-xs md:text-sm'>Choose a tool from the dashboard to get started</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
