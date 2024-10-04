'use client';

import { useState, useEffect } from "react";
import { Spinner } from "@/components/misc/Spinner";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Logo from "@/components/misc/Logo";

import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";
import CreateAccountForm from "@/components/auth/CreateAccountForm";
import SignInForm from "@/components/auth/SignInForm";
import { DialogTrigger } from "@/components/ui/dialog";
import { checkAuth } from "@/server-actions/auth";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const [showSignIn, setShowSignIn] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);

  useEffect(() => {
    const getAuthSession = async () => {
      const currentSession = await checkAuth();

      if (currentSession) {
        setIsLoading(false);
      }
    }

    getAuthSession();
  }, []);

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
          <Dialog open={showSignIn} onOpenChange={setShowSignIn}>
              <DialogTrigger asChild>
                  <Button variant="ghost">Sign In</Button>
              </DialogTrigger>
              <DialogContent className="bg-background max-w-96 sm:max-w-md">
                  <DialogTitle hidden></DialogTitle>
                  <SignInForm fromLandingPage={true} setIsOpen={setShowSignIn}></SignInForm>
              </DialogContent>
          </Dialog>
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
              <Dialog open={showCreateAccount} onOpenChange={setShowCreateAccount}>
                  <DialogTrigger asChild>
                    <Button className={buttonVariants({ variant: "systemBlue", size: "default" })}>Create Account</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-96 sm:max-w-md">
                    <DialogTitle hidden></DialogTitle>
                    <CreateAccountForm fromLandingPage={true} setIsOpen={setShowCreateAccount}></CreateAccountForm>
                  </DialogContent>
              </Dialog>
              <a target="_blank" href="https://apps.apple.com/us/app/atlas-health-and-fitness/id6484401731" rel="noopener noreferrer">
                  <Image layout="intrinsic" src="/appstoreicon.svg" width={150} height={150} alt="web"></Image>
              </a>
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
