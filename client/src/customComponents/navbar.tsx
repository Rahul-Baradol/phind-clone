"use client"

import { Button } from '@/components/ui/button'
import { Poppins } from 'next/font/google'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react'

const poppins = Poppins({
   subsets: ["latin"],
   weight: "300"
});

function Navbar() {
   const pathname = usePathname();

   return (
      <>
         <nav className='flex flex-row h-fit py-4 border-2 justify-around items-center border-t-0 border-l-0 border-r-0'>
            <div className="flex gap-4 items-center">
               <Link href="/">
                  <h2 className={`${poppins.className} ${pathname === "/" ? "hidden" : "block"}`}>Phind</h2>
               </Link>
               <Link href="/prompt">
                  <Button variant="ghost">Chat</Button>
               </Link>
            </div>
            <ul className='flex gap-4'>
               <li><a href="#">Sign in</a></li>
               <li><a href="#">Sign up</a></li>
            </ul>
         </nav>
      </>
   )
}

export default Navbar