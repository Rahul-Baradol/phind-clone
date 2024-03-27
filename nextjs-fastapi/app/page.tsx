"use client"

import { Poppins } from "next/font/google";
import { useState } from "react";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "100"
});

export default function Home() {
  const [prompt, setPrompt] = useState("");

  return (
    <>
      <div className="w-screen h-[90vh] flex flex-col items-center justify-center gap-5">
        <div className={`${poppins.className} text-5xl h-fit w-fit `}>
          phind
        </div>

        <Card className="shadow-2xl shadow-slate-900 w-[80vw] sm:w-[45vw] dark pt-7">
          <CardContent>
            <Input value={prompt} onChange={e => {
              setPrompt(e.target.value);
            }} type="text" placeholder="How may i help you?" />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Link className={`${prompt.length > 0 ? "" : "pointer-events-none opacity-25 transition-opacity duration-1000"}`} href={`/prompt?query=${prompt}`}>
              <Button>Submit</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}