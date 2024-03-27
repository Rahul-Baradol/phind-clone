"use client"

import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function page() {
   const searchParams = useSearchParams();
   const [query, setQuery] = useState(searchParams.get("query"));
   const [data, setData] = useState<any[] | null>(null);

   useEffect(() => {
      if (query) {
         setQuery(query)

         // Do something with the query
         fetch("/api/prompt", {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({
               prompt: query
            })
         }).then(res => res.json()).then(data => {
            setData(data.response)
            console.log(data.response);
         })
      }
   }, [searchParams.get("query")])

   return (
      <>
         <div className='w-screen h-fit flex justify-center'>
            <div className='w-fit h-fit shadow-2xl flex flex-col gap-6 py-5 rounded-xl'>
               <div className='text-2xl px-10 w-[90vw] h-fit'>{query}</div>
               <div className='flex md:flex-row flex-col w-[90vw] justify-around'>
                  <div className='flex flex-col gap-4'>
                     <div>Answer</div>
                     <div className='w-[95vw] md:w-[50vw]'>
                        {
                           Array.isArray(data) ? data.map((item: { data: string }, index: number) => {
                              return <div key={index} className='p-4'>
                                 <h3>{item.data}</h3>
                              </div>
                           })
                              : <div className='flex flex-col gap-4'>
                                 {
                                    new Array(20).fill(0).map((_, index) => {
                                       return <Skeleton className="h-4 w-full" key={index} />
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
                           Array.isArray(data) ? data.map((item: { links: string }, index: number) => {
                              return <div key={index} className=''> 
                                 <Link href={item.links}>{item.links}</Link>
                              </div>
                           })
                              : <div className='flex flex-col gap-4'>
                                 {    
                                    new Array(20).fill(0).map((_, index) => {
                                       return <Skeleton className="h-4 w-[95vw] md:w-[30vw]" key={index} />
                                    })
                                 }
                              </div>
                        }
                     </div>
                  </div>

               </div>
            </div>
         </div>
      </>
   )
}

export default page