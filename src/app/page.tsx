'use client';

import { useState, useRef } from "react";
import Program from "@/components/program";
import { Spinner } from "@/components/spinner";
import { getAllPrograms } from "./actions";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Logo from "@/components/logo";
import { onJoin } from "./onJoin";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const emailRef = useRef<HTMLInputElement>(null);

  const onJoinClient = async () => {
    setShowConfirmation(false);
    setShowError(false);
    setIsSigningUp(true);

    if (emailRef.current !== null && emailRef.current.value !== "") {
      const error = await onJoin(emailRef.current.value);
      
      if (error) {
        if (error.code === '23505') {
            setShowError(true);
            setErrorMessage("Your email has already been added.");
        } else {
            setShowError(true);
            setErrorMessage(error.message);
        }
      } else {
        console.log("here");
        setShowConfirmation(true);
      }
    } else {
      setShowError(true);
      setErrorMessage("Email can't be empty.");
    }

    setIsSigningUp(false);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full pb-10 bg-background">
        <Spinner></Spinner>
      </div>
    )
  } else {
    return (
      <div className="h-full">
        <div className="fixed w-full h-20 flex px-5 bg-background">
          <Logo></Logo>
        </div>
        <div className="py-40 flex flex-col gap-2 justify-center items-center">
          <div className="flex flex-col items-center gap-2 w-4/5 sm:w-2/4 max-w-3xl">
            <p className="text-primaryText text-4xl sm:text-6xl font-black text-center">
              You can go D1.
            </p>
            <p className="text-secondaryText text-lg sm:text-4xl font-medium text-center">
              Get access to training and nutrition programs to help you play at the next level.
            </p>
            <div className="flex flex-col items-center justify-center w-full sm:max-w-lg pt-10 gap-5">
              <Input ref={emailRef} type="email" placeholder="Enter your email"></Input>
              {isSigningUp ?
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                  </Button>
                  :
                  <Button onClick={onJoinClient}>Join Waitlist</Button>      
              }
            </div>
            {showConfirmation && 
              <p className={cn("text-primaryText text-center pt-2")}>
                Your email was added. We'll let you know when you have access.
              </p>
            }
            {showError && 
              <p className={cn("text-primaryText text-center pt-2")}>
                {errorMessage}
              </p>
            }
          </div>
          <div className="flex flex-col md:flex-row py-20 justify-center items-center w-4/5 max-w-3xl">
            <div className="">
              <Image layout="intrinsic" src="/landingPageImage.png" width={800} height={512} alt="web"></Image>
            </div>
          </div>
          <div className="bg-systemGray5 flex flex-col gap-5 sm:gap-10 w-4/5 max-w-3xl rounded-xl p-5 sm:p-10">
            <p className="text-primaryText font-black text-xl sm:text-3xl">Everything you need to unlock your athleticism.</p>
            <div className="flex flex-col gap-5">
              <div className="bg-systemGray4 p-3 sm:p-5 rounded-xl flex flex-row gap-3 sm:gap-5 items-center">
                <p className="min-w-10">🏃‍♂️🏋️‍♂️</p>
                <p className="text-primaryText font-bold text-sm sm:text-lg">Training, strength, and conditioning programs to improve your performance.</p>
              </div>
              <div className="bg-systemGray4 p-3 sm:p-5 rounded-xl flex flex-row gap-3 sm:gap-5 items-center">
                <p className="min-w-10">🍴💤</p>
                <p className="text-primaryText font-bold text-sm sm:text-lg">Nutrition and lifestyle protocols to consistently perform and avoid injury.</p>
              </div>
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
