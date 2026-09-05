import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const SearchComponent = () => {
  return (
    <div className="relative flex items-center justify-center p-4 w-full">
      <div id="poda" className="relative flex items-center justify-center group w-full max-w-78.5">
        <div className="absolute z-[-1] overflow-hidden h-full w-full max-h-17.5 max-w-78.5 rounded-xl blur-[3px] 
                        before:absolute before:content-[''] before:z-[-2] before:w-249.75 before:h-249.75 before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-60
                        before:bg-[conic-gradient(#000,#F7931A_5%,#000_38%,#000_50%,#EA580C_60%,#000_87%)] before:transition-all before:duration-2000
                        group-hover:before:rotate-[-120deg] group-focus-within:before:rotate-420 group-focus-within:before:duration-4000">
        </div>
        <div className="absolute z-[-1] overflow-hidden h-full w-full max-h-16.25 max-w-78 rounded-xl blur-[3px] 
                        before:absolute before:content-[''] before:z-[-2] before:w-150 before:h-150 before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-82
                        before:bg-[conic-gradient(rgba(0,0,0,0),#EA580C,rgba(0,0,0,0)_10%,rgba(0,0,0,0)_50%,#FFD600,rgba(0,0,0,0)_60%)] before:transition-all before:duration-2000
                        group-hover:before:rotate-[-98deg] group-focus-within:before:rotate-442 group-focus-within:before:duration-4000">
        </div>
        <div className="absolute z-[-1] overflow-hidden h-full w-full max-h-16.25 max-w-78 rounded-xl blur-[3px] 
                        before:absolute before:content-[''] before:z-[-2] before:w-150 before:h-150 before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-82
                        before:bg-[conic-gradient(rgba(0,0,0,0),#EA580C,rgba(0,0,0,0)_10%,rgba(0,0,0,0)_50%,#FFD600,rgba(0,0,0,0)_60%)] before:transition-all before:duration-2000
                        group-hover:before:rotate-[-98deg] group-focus-within:before:rotate-442 group-focus-within:before:duration-4000">
        </div>
        <div className="absolute z-[-1] overflow-hidden h-full w-full max-h-16.25 max-w-78 rounded-xl blur-[3px] 
                        before:absolute before:content-[''] before:z-[-2] before:w-150 before:h-150 before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-82
                        before:bg-[conic-gradient(rgba(0,0,0,0),#EA580C,rgba(0,0,0,0)_10%,rgba(0,0,0,0)_50%,#FFD600,rgba(0,0,0,0)_60%)] before:transition-all before:duration-2000
                        group-hover:before:rotate-[-98deg] group-focus-within:before:rotate-442 group-focus-within:before:duration-4000">
        </div>

        <div className="absolute z-[-1] overflow-hidden h-full w-full max-h-15.75 max-w-76.75 rounded-lg blur-[2px] 
                        before:absolute before:content-[''] before:z-[-2] before:w-150 before:h-150 before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-83
                        before:bg-[conic-gradient(rgba(0,0,0,0)_0%,#ffb874,rgba(0,0,0,0)_8%,rgba(0,0,0,0)_50%,#FFD600,rgba(0,0,0,0)_58%)] before:brightness-140
                        before:transition-all before:duration-2000 group-hover:before:rotate-[-97deg] group-focus-within:before:rotate-443 group-focus-within:before:duration-4000">
        </div>

        <div className="absolute z-[-1] overflow-hidden h-full w-full max-h-14.75 max-w-75.75 rounded-xl blur-[0.5px] 
                        before:absolute before:content-[''] before:z-[-2] before:w-150 before:h-150 before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-70
                        before:bg-[conic-gradient(#1c191c,#F7931A_5%,#1c191c_14%,#1c191c_50%,#EA580C_60%,#1c191c_64%)] before:brightness-130
                        before:transition-all before:duration-2000 group-hover:before:rotate-[-110deg] group-focus-within:before:rotate-430 group-focus-within:before:duration-4000">
        </div>

        <div id="main" className="relative group w-full">
          <input placeholder="Search projects or issues..." type="text" name="text" className="bg-background-void border-none w-full h-14 rounded-lg text-white px-14.75 text-base focus:outline-none placeholder-gray-500 shadow-md transition-shadow focus:shadow-[0_0_20px_rgba(247,147,26,0.3)] ring-1 ring-white/10" />
          <div id="input-mask" className="pointer-events-none w-25 h-5 absolute bg-linear-to-r from-transparent to-background-void top-4.5 left-17.5 group-focus-within:hidden"></div>
          <div id="pink-mask" className="pointer-events-none w-7.5 h-5 absolute bg-[#F7931A] top-2.5 left-1.25 blur-2xl opacity-80 transition-all duration-2000 group-hover:opacity-0 group-focus-within:opacity-0"></div>
          <div className="absolute h-10.5 w-10 overflow-hidden top-1.75 right-1.75 rounded-lg
                          before:absolute before:content-[''] before:w-150 before:h-150 before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-90
                          before:bg-[conic-gradient(rgba(0,0,0,0),#4a2a10,rgba(0,0,0,0)_50%,rgba(0,0,0,0)_50%,#4a2a10,rgba(0,0,0,0)_100%)]
                          before:brightness-135 before:animate-[spin_4s_linear_infinite]">
          </div>
          <button id="filter-icon" className="absolute top-2 right-2 flex items-center justify-center z-2 max-h-10 max-w-9.5 h-full w-full isolate overflow-hidden rounded-lg bg-linear-to-b from-[#2a1300] via-[#0a0500] to-[#1c0d00] border border-transparent hover:brightness-125 transition-all cursor-pointer">
            <SlidersHorizontal className="w-4 h-4 text-[#e5e1e4]" />
          </button>
          <div id="search-icon" className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
            <Search className="w-5 h-5 text-[#F7931A]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
