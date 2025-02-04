"use client";

import { useState, useEffect } from "react";
import { Spinner } from "@/components/misc/Spinner";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Logo from "@/components/misc/Logo";

import { Dialog, DialogTitle, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CreateAccountForm from "@/components/auth/CreateAccountForm";
import SignInForm from "@/components/auth/SignInForm";
import { checkAuth, redirectToExplore } from "@/server-actions/auth";
import { DialogDescription } from "@radix-ui/react-dialog";
import LoadImage from "@/components/misc/BlurImage";
import { useUserContext } from "@/context";

const Page = () => {
    const [isLoading, setIsLoading] = useState(true);

    const [showSignIn, setShowSignIn] = useState(false);
    const [showCreateAccount, setShowCreateAccount] = useState(false);

    const userContext = useUserContext();

    useEffect(() => {
        const checkSession = async () => {
            if (!userContext.isLoading) {
                if (userContext.user) {
                    redirectToExplore();
                } else {
                    setIsLoading(false);
                }
            }
        }
      
        checkSession();
    }, [userContext.isLoading]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full pb-10 bg-systemBackground">
                <Spinner></Spinner>
            </div>
        )
    } else {
        return (
            <div className="h-full">
                <div className="fixed z-50 w-full h-20 flex items-center justify-between px-5 sm:px-10 bg-systemBackground">
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
                    <div className="flex flex-col items-center gap-24 w-4/5 sm:w-[800px]">
                        <div className="flex flex-col items-center gap-5">
                            <p className="text-primaryText text-4xl sm:text-6xl font-black text-center">
                                The platform for fitness communities.
                            </p>
                            <p className="text-secondaryText text-base sm:text-2xl font-bold text-center">
                                Give your fitness community paid access to training programs, nutrition protocols, and more.
                            </p>
                            
                        </div>
                        <div className="relative flex items-center w-[350px] h-[200px] sm:w-[800px] sm:h-[400px]">
                            <LoadImage
                                alt="firstLandingPage"
                                src="https://ltjnvfgpomlatmtqjxrk.supabase.co/storage/v1/object/public/landing_page/landingPageOne.png?t=2025-01-16T04%3A48%3A38.958Z"
                                contentMode="contain"
                                sizes="(max-width: 640px) 350px, 800px"
                                className="rounded-md"
                                canSelect={false}
                            />
                        </div>
                        <Dialog open={showCreateAccount} onOpenChange={setShowCreateAccount}>
                            <DialogTrigger asChild>
                                <Button className={buttonVariants({ variant: "systemBlue", size: "default" })}>Get Started For Free</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-96 sm:max-w-md">
                                <DialogTitle hidden></DialogTitle>
                                <CreateAccountForm fromLandingPage={true} setIsOpen={setShowCreateAccount}></CreateAccountForm>
                            </DialogContent>
                        </Dialog>
                        <div className="flex flex-col gap-10">
                            <div className="relative flex items-center w-[350px] h-[300px] sm:w-[600px] sm:h-[400px]">
                                <LoadImage
                                    alt="secondLandingPage"
                                    src="https://ltjnvfgpomlatmtqjxrk.supabase.co/storage/v1/object/public/landing_page/landingPageTwo.png?t=2025-01-16T04%3A48%3A48.462Z"
                                    contentMode="contain"
                                    sizes="(max-width: 640px) 350px, 600px"
                                    className="rounded-md"
                                    canSelect={false}
                                />
                            </div>
                            <p className="text-secondaryText text-md sm:text-lg font-black text-center">
                                Monetize your training and nutrition protocols in one platform.
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-10">
                            <div className="relative flex items-center w-[350px] h-[200px] sm:w-[800px] sm:h-[400px]">
                                <LoadImage
                                    alt="thirdLandingPage"
                                    src="https://ltjnvfgpomlatmtqjxrk.supabase.co/storage/v1/object/public/landing_page/landingPageThree.png"
                                    contentMode="contain"
                                    sizes="(max-width: 640px) 350px, 800px"
                                    className="rounded-md"
                                    canSelect={false}
                                />
                            </div>
                            <p className="text-secondaryText text-md sm:text-lg font-black text-center">
                                Give your community easy access to all of your content with the mobile app.
                            </p>
                            <a
                                target="_blank"
                                href="https://apps.apple.com/us/app/atlas-health-and-fitness/id6484401731"
                                rel="noopener noreferrer"
                                className="relative flex items-center w-[150px] h-[50.13px]"
                            >
                                <Image
                                    alt="appStoreLink"
                                    src="/appstoreicon.svg"
                                    fill
                                    className="w-[150px] h-[50.13px]"
                                    style={{objectFit: "contain"}}
                                    sizes="150px"
                                />
                            </a>
                        </div>
                        <div className="flex flex-col items-center gap-5 py-20">
                            <p className="text-primaryText text-base sm:text-2xl font-bold text-center">
                                Grow your online fitness business and help your community get in better shape at the same time.
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

export default Page