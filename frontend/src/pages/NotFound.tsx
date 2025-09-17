import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function NotFound() {

    return (
        <>
            <div className='w-full h-full flex flex-col mt-[40px] items-center justify-center select-none'>
                <div className='w-10/12 max-sm:w-11/12 mb-5'>
                    <div className='w-full min-h-[50vh] flex flex-col items-center justify-center my-8'>
                        <div className='w-auto flex flex-col justify-center h-auto'>
                            <div className='flex mb-[50px] justify-center'>
                                <img src="/images/not-found.svg" className='w-[300px]' alt="Not found" />
                            </div>
                            <div className='flex flex-col items-center'>
                                <h1 className='text-black text-center font-sans text-[3em]'>Page Doesn&apos;t Exit</h1>
                            </div>
                            <p className='text-center text-black/70 leading-6 w-full mb-6 text-[.9em]'>
                                Page Not Available or Was Moved.
                            </p>
                            <div className='w-auto flex items-center mt-8 justify-center'>
                                <Link to={'/'}>
                                    <button 
                                    className="bg-[#405cb9]/[70%] mt-[30px] dark:bg-button-shadow-dark border-[1.5px] relative top-[2px] rounded-[8px] w-auto text-primary inline-block border-[#405cb9]/[20%] text-center group disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        <span
                                            className="relative text-white flex flex-row items-center space-x-[8px] text-center w-auto bg-[#405cb9] border-[#405cb9]/[70%] dark:border-[#b07916] dark:bg-orange rounded-[8px] text-[15px] font-bold border-[1.5px] px-5 py-2 -translate-y-1 hover:-translate-y-1.5 active:-translate-y-0.5 mx-[-1.5px] group-disabled:hover:!-translate-y-1 block active:transition-all active:duration-100 select-none"
                                        >
                                            Return back
                                        </span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
