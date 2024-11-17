'use client';

import { useState, useEffect } from "react";
import { Spinner } from "@/components/misc/Spinner";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Logo from "@/components/misc/Logo";

import { Dialog, DialogTitle, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CreateAccountForm from "@/components/auth/CreateAccountForm";
import SignInForm from "@/components/auth/SignInForm";
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
        <div className="pt-40 flex flex-col gap-24 justify-center items-center">
          <div className="flex flex-col items-center gap-24 w-4/5 sm:w-2/4 max-w-3xl">
            <div className="flex flex-col items-center gap-5">
              <p className="text-primaryText text-4xl sm:text-6xl font-black text-center">
                The platform for fitness communities.
              </p>
              <p className="text-secondaryText text-base sm:text-lg font-medium text-center">
                Grow your online fitness business by giving your followers paid access to training programs.
              </p>
              <Dialog open={showCreateAccount} onOpenChange={setShowCreateAccount}>
                  <DialogTrigger>
                    <Button variant="systemBlue" size="default">Get Started For Free</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-96 sm:max-w-md">
                    <DialogTitle hidden></DialogTitle>
                    <CreateAccountForm fromLandingPage={true} setIsOpen={setShowCreateAccount}></CreateAccountForm>
                  </DialogContent>
              </Dialog>
            </div>
            <Image
              layout="intrinsic"
              src="/landingPageWeb.png"
              width={800}
              height={512}
              alt="web"
            />
            <div className="flex flex-col items-center gap-5">
              <p className="text-primaryText text-xl sm:text-3xl font-black text-center">
                Let your community follow your training programs in the iOS app.
              </p>
              <a target="_blank" href="https://apps.apple.com/us/app/atlas-health-and-fitness/id6484401731" rel="noopener noreferrer">
                  <Image
                    layout="intrinsic"
                    src="/appstoreicon.svg"
                    width={150}
                    height={150}
                    alt="web"
                  />
              </a>
            </div>
            <Image
              layout="intrinsic"
              src="/landingPageMobile.png"
              width={800}
              height={512}
              alt="web"
            />
            <div className="flex flex-col items-center gap-5">
              <p className="text-primaryText text-xl sm:text-3xl font-black text-center">
                Create an account and start selling your training programs for free.
              </p>
              <Dialog open={showCreateAccount} onOpenChange={setShowCreateAccount}>
                  <DialogTrigger asChild>
                    <Button className={buttonVariants({ variant: "systemBlue", size: "default" })}>Get Started For Free</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-96 sm:max-w-md">
                    <DialogTitle hidden></DialogTitle>
                    <CreateAccountForm fromLandingPage={true} setIsOpen={setShowCreateAccount}></CreateAccountForm>
                  </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="w-full h-20 flex items-center justify-between px-5 sm:px-10 border-t-[1px] border-systemGray6 bg-systemBackground">
              <p className="text-primaryText font-bold text-xl">Atlas</p>
              <p className="text-secondaryText">All rights reserved</p>
            </div>
        </div>
      </div>
    )
  }
}
