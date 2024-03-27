"use client"

import { Button } from "@/components/ui/button"
import {
   Card,
   CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Poppins } from 'next/font/google';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Typewriter } from "react-simple-typewriter"

const poppins = Poppins({
   subsets: ["latin"],
   weight: "100",
});

function Page() {
   const searchParams = useSearchParams();
   const [query, setQuery] = useState(searchParams.get("query"));
   const [data, setData] = useState<any | null>(null);
   const [mainData, setMainData] = useState<any[] | null>(null);
   const pathname = usePathname();

   const [newQuery, setNewQuery] = useState("");

   useEffect(() => {
      setData(null)
      setMainData(null)
      setNewQuery("")

      if (query) {
         setQuery(searchParams.get("query"))

         // Do something with the query
         fetch("/api/prompt", {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({
               prompt: searchParams.get("query")
            })
         }).then(res => res.json()).then(returnedData => {
            setMainData(returnedData.response)

            for (let i = 0; i < returnedData.response.length; i++) {
               setData((currentData: any) => {
                  console.log(currentData);
                  
                  if (currentData === null) {
                     return returnedData.response[i].data
                  } else {
                     return currentData + returnedData.response[i].data
                  }
               })
            }
         })
      }
   }, [searchParams.get("query")])

   return (
      <>
         <nav className='flex flex-row h-[100px] py-4 justify-center items-center border-t-0 border-l-0 border-r-0'>
            <div className="flex gap-4 items-center">
               <Link href="/">
                  <h2 className={`${poppins.className} ${pathname === "/" ? "hidden" : "block"} ${poppins.className} text-3xl `}>Phind</h2>
               </Link>
            </div>
         </nav>
         <div className='w-screen h-fit flex justify-center'>
            <div className='w-fit h-fit shadow-2xl flex flex-col gap-6 py-5 rounded-xl'>
               <div className='text-2xl px-10 w-[90vw] h-fit'>{query}</div>
               <div className='flex md:flex-row flex-col-reverse w-[90vw] md:justify-around items-center md:items-start'>
                  <div className='flex flex-col gap-4'>
                     <div>Answer</div>
                     <div className='w-[95vw] md:w-[50vw]'>
                        {
                           // Array.isArray(data) ? data.map((item: { data: string }, index: number) => {
                           //    return <div key={index} className='p-4 w-[95vw] break-words md:w-[50vw]'>
                           //       {item.data}
                           //    </div>
                           // })
                           data ? <Typewriter typeSpeed={1} loop={1} words={[data.substr(0, 4000)]} /> : <div className='flex flex-col gap-4'>
                                 {
                                    new Array(20).fill(0).map((_, index) => {
                                       return <div
                                          className="animate-pulse h-4 w-full bg-slate-800"
                                          key={index}
                                          style={{
                                             animationDelay: `${index * 0.05}s`,
                                             animationDuration: '1s'
                                          }}
                                       ></div>
                                    })
                                 }
                              </div>
                        }
                     </div>
                  </div>

                  <div className='flex flex-col items-center gap-2'>
                     <div className='w-[30vw]'>Sources</div>
                     <div className='min-w-[30vw] h-fit flex flex-col items-center px-4 gap-4'>
                        {
                           Array.isArray(mainData) ? mainData.map((item: { links: string }, index: number) => {
                              return <Link className="p-4 break-words w-[95vw] md:w-[30vw]" key={index} href={item.links}>{item.links}</Link>
                           })
                              : <div className='flex flex-col gap-4'>
                                 {
                                    new Array(20).fill(0).map((_, index) => {
                                       return <div className="animate-pulse bg-slate-800 h-4 w-[95vw] md:w-[30vw]"
                                          key={index}
                                          style={{
                                             animationDelay: `${index * 0.05}s`,
                                             animationDuration: '1s'
                                          }}
                                       ></div>
                                    })
                                 }
                              </div>
                        }
                     </div>
                  </div>

               </div>
            </div>
         </div>

         <div className="w-screen h-fit fixed bottom-3 flex justify-center">
            <Card className="shadow-2xl shadow-slate-900 w-[80vw] sm:w-[45vw] dark pt-7">
               <CardContent className="rounded-3xl flex gap-5">
                  <Input value={newQuery}
                     onChange={e => {
                        setNewQuery(e.target.value);
                     }}
                     type="text"
                     placeholder="Ask any query..." />
                  <Link className={`${newQuery.length > 0 ? "" : "pointer-events-none opacity-25 transition-opacity duration-1000"}`} href={`/prompt?query=${newQuery}`}>
                     <Button>Submit</Button>
                  </Link>
               </CardContent>
            </Card>
         </div>

      </>
   )
}

export default Page