'use client';

import { useState, useRef } from "react";
import Program from "@/components/program";
import { Spinner } from "@/components/spinner";
import { getAllPrograms } from "./actions";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import webPreview from "../../public/webPreview.png";
import mobilePreview from "../../public/mobilePreview.png";
import Logo from "@/components/logo";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(null);
  
  const emailRef = useRef<HTMLInputElement>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full pb-10 bg-systemGray6">
        <Spinner></Spinner>
      </div>
    )
  } else {
    return (
      <div className="h-full">
        <div className="fixed w-full h-20 flex px-5 bg-systemGray6">
          <Logo></Logo>
        </div>
        <div className="pt-40 flex flex-col gap-2 w-full justify-center items-center">
          <div className="flex flex-col gap-2 w-3/5 sm:w-2/4">
            <p className="text-primaryText text-4xl md:text-6xl font-bold text-center">
              You can go D1.
            </p>
            <p className="text-secondaryText text-lg md:text-4xl font-medium text-center">
              Get access to training and nutrition programs created by Division 1 soccer players.
            </p>
            <div className="flex flex-col lg:flex-row mx-auto w-full sm:w-3/4 pt-10 gap-5">
              <Input placeholder="Enter your email"></Input>
              <Button className={buttonVariants({ variant: "systemBlue", size: "default" })}>Join Waitlist</Button>
            </div>
            <p className="text-systemGray6 text-center pt-2">Your email was added. We'll let you know when you have access.</p>
          </div>
          <div className="flex flex-col md:flex-row py-10 px-10 gap-5 justify-center items-center">
              <div className="">
                <Image layout="intrinsic" src="/webPreview.png" width={600} height={512} alt="web"></Image>
              </div>
              <div className="">
                <Image layout="intrinsic" src="/mobilePreview.png" width={180} height={844} alt="web"></Image>
              </div>
            </div>
        </div>
      </div>
      // <div className="flex flex-col w-full px-16 md:px-60 pt-10">
      //   <h1 className="text-primaryText text-2xl me:text-3xl font-bold pb-5">Home</h1>
      //   <div className="grid grid-cols-2 gap-5">

      //   </div>
      // </div>
    )
  }
}
