"use client"

import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function page() {
   const searchParams = useSearchParams();
   const [query, setQuery] = useState(searchParams.get("query"));

   useEffect(() => {
      
   }, [])

   return (
      <>
         
      </>
   )
}

export default page