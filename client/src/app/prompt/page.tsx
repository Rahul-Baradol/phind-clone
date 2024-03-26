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
         fetch("http://localhost:8000/prompt", {
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
         <div className='w-screen min-h-[90vh] px-10 flex flex-col gap-10'>
            <h1 className='text-2xl w-fit h-fit'>{query}</h1>
            <div className='flex gap-4 w-[90vw] justify-between'>
               <div className='w-[40vw]'>
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
               <div className='w-[40vw] text-end'>
                  {
                     Array.isArray(data) ? data.map((item: { links: string }, index: number) => {
                        return <div key={index} className='p-4'>
                           <Link href={item.links}>{item.links}</Link>
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
         </div>
      </>
   )
}

export default page