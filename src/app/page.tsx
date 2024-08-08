'use client';

import { useState, useRef } from "react";
import { Spinner } from "@/components/(misc)/spinner";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Logo from "@/components/(misc)/logo";

import { onJoin } from "./onJoin";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import CreateAccountForm from "@/components/(auth)/createAccountForm";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [showSignIn, setShowSignIn] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  const emailValidation = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  const onJoinClient = async () => {
    setShowConfirmation(false);
    setShowError(false);
    setIsSigningUp(true);

    if (emailRef.current !== null && emailRef.current.value !== "") {
      if (!emailValidation.test(emailRef.current.value)) {
        setShowError(true);
        setErrorMessage("Please enter a valid email.");
        setIsSigningUp(false);
        return
      }

      const error = await onJoin(emailRef.current.value);
      
      if (error) {
        if (error.code === '23505') {
          setShowConfirmation(true);
        } else {
            setShowError(true);
            setErrorMessage(error.message);
        }
      } else {
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
      <div className="flex flex-col items-center justify-center h-full w-full pb-10 bg-systemBackground">
        <Spinner></Spinner>
      </div>
    )
  } else {
    return (
      <div className="h-full">
        <div className="fixed w-full h-20 flex items-center justify-between px-5 sm:px-10 bg-systemBackground">
          <Logo></Logo>
          {/* <Dialog open={showSignIn} onOpenChange={setShowSignIn}>
              <DialogTrigger asChild>
                  <Button variant="ghost">Sign In</Button>
              </DialogTrigger>
              <DialogContent className="bg-background max-w-96 sm:max-w-md">
                  <DialogTitle hidden></DialogTitle>
                  <SignInForm onOpenChange={setShowSignIn}></SignInForm>
              </DialogContent>
          </Dialog> */}
        </div>
        <div className="pt-40 pb-20 flex flex-col gap-2 justify-center items-center">
          <div className="flex flex-col items-center gap-4 w-4/5 sm:w-2/4 max-w-3xl">
            <p className="text-primaryText text-4xl sm:text-6xl font-black text-center">
              Create your own training platform.
            </p>
            <p className="text-secondaryText text-base sm:text-lg font-medium text-center">
              Share health and fitness content with your community and grow your online fitness business.
            </p>
            <div className="flex flex-col items-center justify-center w-full sm:max-w-lg pt-4 gap-5">
              <Input ref={emailRef} type="email" placeholder="Enter your email"></Input>
              {isSigningUp ?
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                  </Button>
                  :
                  <Button onClick={onJoinClient} variant="systemBlue">Join Waitlist</Button>      
              }
              {showConfirmation && 
                <p className={cn("text-primaryText text-center pt-2")}>
                  Your email was added to the waitlist. We'll let you know when the app is launched.
                </p>
              }
              {showError && 
                <p className={cn("text-primaryText text-center pt-2")}>
                  {errorMessage}
                </p>
              }
              {/* <Dialog open={showCreateAccount} onOpenChange={setShowCreateAccount}>
                  <DialogTrigger asChild>
                    <Button className={buttonVariants({ variant: "systemBlue", size: "default" })}>Create Account</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-96 sm:max-w-md">
                    <DialogTitle hidden></DialogTitle>
                    <CreateAccountForm onOpenChange={setShowCreateAccount}></CreateAccountForm>
                  </DialogContent>
              </Dialog>  */}
            </div>
          </div>
          <div className="flex flex-col md:flex-row py-20 justify-center items-center w-4/5 max-w-3xl">
            <div className="">
              <Image layout="intrinsic" src="/landingPageImage.png" width={800} height={512} alt="web"></Image>
            </div>
          </div>
          <p className="text-secondaryText text-xl sm:text-3xl font-bold text-center pb-20 w-4/5 sm:w-2/4 max-w-3xl">
            <span className="text-primaryText">Atlas is a platform designed for fitness communities.</span> Give your community paid access to training programs, nutrition guidance, and more.
          </p>
          <div className="flex flex-col lg:flex-row gap-5 w-4/5 sm:w-2/4 max-w-3xl">
              <div className="bg-systemGray5 p-4 rounded-xl flex flex-col gap-2 sm:gap-2 items-center">
                <p className="min-w-10">🏃‍♂️ <span className="font-bold text-base">Training Programs</span></p>
                <p className="text-secondaryText font-medium text-sm sm:text-lg text-center">Sell structured training programs with detailed workouts and exercises.</p>
              </div>
              <div className="bg-systemGray5 p-4 rounded-xl flex flex-col gap-2 sm:gap-2 items-center">
                <p className="min-w-10">📱 <span className="font-bold text-base">Easy Access</span></p>
                <p className="text-secondaryText font-medium text-sm sm:text-lg text-center">Give your followers easy access to your content in the mobile app.</p>
              </div>
            </div>
        </div>
      </div>
    )
  }
}
