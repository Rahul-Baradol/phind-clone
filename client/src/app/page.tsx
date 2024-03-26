"use client"

import { Poppins } from "next/font/google";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

        <Card className="w-[80vw] sm:w-[45vw] dark pt-7">
          <CardContent>
            <Input value={prompt} onChange={e => {
              setPrompt(e.target.value);
            }} type="text" placeholder="How may i help you?" />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Link href={`/prompt?query=${prompt}`}>
              <Button onClick={async () => {
                try {
                  const response = await fetch("http://localhost:8000/prompt", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      prompt: prompt,
                    }),
                  })

                  const data = await response.json();
                  console.log(data);
                } catch {
                  console.log("failed to fetch");
                }
              }}>Submit</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}