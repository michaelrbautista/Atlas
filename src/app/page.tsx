"use client";

import { useState, useEffect } from "react";
import { Spinner } from "@/components/misc/Spinner";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Logo from "@/components/misc/Logo";

import { Dialog, DialogTitle, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CreateAccountForm from "@/components/auth/CreateAccountForm";
import SignInForm from "@/components/auth/SignInForm";
import { redirectToExplore } from "@/server-actions/auth";
import BlurImage from "@/components/misc/BlurImage";
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
                    <div className="flex flex-col items-center gap-24 w-4/5 sm:w-[900px]">
                        <div className="flex flex-col items-center gap-5">
                            <p className="text-primaryText text-6xl sm:text-5xl font-semibold text-center">
                                The platform for fitness content creators.
                            </p>
                            <p className="text-secondaryText text-base sm:text-lg font-medium text-center">
                                Grow your fitness business by giving your followers access to your 
                                training programs, nutrition protocols, and more.
                            </p>
                        </div>
                        <div className="relative flex items-center w-[350px] h-[200px] sm:w-[800px] sm:h-[400px]">
                            <BlurImage
                                alt="hero"
                                src="https://ltjnvfgpomlatmtqjxrk.supabase.co/storage/v1/object/public/landing_page//hero.png"
                                contentMode="contain"
                                sizes="(max-width: 640px) 350px, 800px"
                                className="rounded-md"
                                canSelect={false}
                            />
                        </div>
                        <Dialog open={showCreateAccount} onOpenChange={setShowCreateAccount}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="systemBlue"
                                    size="default"
                                >
                                    Sign up today
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-96 sm:max-w-md">
                                <DialogTitle hidden></DialogTitle>
                                <CreateAccountForm fromLandingPage={true} setIsOpen={setShowCreateAccount}></CreateAccountForm>
                            </DialogContent>
                        </Dialog>
                        <div className="flex flex-col gap-5 w-full">
                            <div className="flex flex-col w-full justify-start pb-5">
                                <h2 className="text-3xl font-semibold">For creators</h2>
                                <p className="text-secondaryText text-xl">All the tools you need to monetize your content.</p>
                            </div>
                            <div className="flex flex-col gap-5 w-full">
                                <div className="flex flex-col sm:flex-row gap-5 w-full">
                                    <div className="flex flex-col w-full gap-3 p-5 items-center bg-zinc-900 rounded-lg">
                                        <div className="flex flex-col">
                                            <h2 className="text-primaryText text-lg font-semibold">Training Programs</h2>
                                            <p className="text-secondaryText">Publish training programs with detailed workouts and exercises.</p>
                                        </div>
                                        <div className="relative flex items-center w-[330px] h-[200px] sm:w-[400px] sm:h-[260px] shrink-0">
                                            <BlurImage
                                                alt="feature8final"
                                                src="https://ltjnvfgpomlatmtqjxrk.supabase.co/storage/v1/object/public/landing_page//feature8final.png"
                                                contentMode="contain"
                                                sizes="(max-width: 640px) 330px, 400px"
                                                className="rounded-md"
                                                canSelect={false}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-full gap-3 p-5 items-center bg-zinc-900 rounded-lg">
                                        <div>
                                            <h2 className="text-primaryText text-lg font-semibold">Articles</h2>
                                            <p className="text-secondaryText">Publish articles about nutrition, sleep, mobility, and more.</p>
                                        </div>
                                        <div className="relative flex items-center w-[330px] h-[200px] sm:w-[400px] sm:h-[260px] shrink-0">
                                            <BlurImage
                                                alt="feature9final"
                                                src="https://ltjnvfgpomlatmtqjxrk.supabase.co/storage/v1/object/public/landing_page//feature9final.png"
                                                contentMode="contain"
                                                sizes="(max-width: 640px) 330px, 400px"
                                                className="rounded-md"
                                                canSelect={false}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-5 w-full">
                                    <div className="flex flex-col w-full gap-3 p-5 items-center bg-zinc-900 rounded-lg">
                                        <div>
                                            <h2 className="text-primaryText text-lg font-semibold">One-Time Purchase</h2>
                                            <p className="text-secondaryText sm:pb-6">Sell training programs for a one-time purchase.</p>
                                        </div>
                                        <div className="relative flex items-center w-[330px] h-[200px] sm:w-[400px] sm:h-[260px] shrink-0">
                                            <BlurImage
                                                alt="feature10final"
                                                src="https://ltjnvfgpomlatmtqjxrk.supabase.co/storage/v1/object/public/landing_page//feature10final.png"
                                                contentMode="contain"
                                                sizes="(max-width: 640px) 330px, 400px"
                                                className="rounded-md"
                                                canSelect={false}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-full gap-3 p-5 items-center bg-zinc-900 rounded-lg">
                                        <div>
                                            <h2 className="text-primaryText text-lg font-semibold">Susbcription</h2>
                                            <p className="text-secondaryText">Give access to all of your content for a monthly subscription.</p>
                                        </div>
                                        <div className="relative flex items-center w-[330px] h-[200px] sm:w-[400px] sm:h-[260px] shrink-0">
                                            <BlurImage
                                                alt="feature11final"
                                                src="https://ltjnvfgpomlatmtqjxrk.supabase.co/storage/v1/object/public/landing_page//feature11final.png"
                                                contentMode="contain"
                                                sizes="(max-width: 640px) 330px, 400px"
                                                className="rounded-md"
                                                canSelect={false}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-5 p-5 w-full bg-zinc-900 rounded-lg">
                                <div>
                                    <h2 className="text-primaryText text-lg font-semibold">Available on iOS</h2>
                                    <p className="text-secondaryText">Give your followers easy access to your content in the iOS app.</p>
                                </div>
                                <div className="flex flex-row sm:gap-5 justify-center">
                                    <div className="relative flex items-center w-[80px] h-[130px] sm:w-[190px] sm:h-[380px] shrink-0">
                                        <BlurImage
                                            alt="feature11final"
                                            src="https://ltjnvfgpomlatmtqjxrk.supabase.co/storage/v1/object/public/landing_page//mockup1.png"
                                            contentMode="contain"
                                            sizes="(max-width: 640px) 80px, 190px"
                                            className="rounded-md"
                                            canSelect={false}
                                        />
                                    </div>
                                    <div className="relative flex items-center w-[80px] h-[130px] sm:w-[190px] sm:h-[380px] shrink-0">
                                        <BlurImage
                                            alt="feature11final"
                                            src="https://ltjnvfgpomlatmtqjxrk.supabase.co/storage/v1/object/public/landing_page//mockup2.png"
                                            contentMode="contain"
                                            sizes="(max-width: 640px) 80px, 190px"
                                            className="rounded-md"
                                            canSelect={false}
                                        />
                                    </div>
                                    <div className="relative flex items-center w-[80px] h-[130px] sm:w-[190px] sm:h-[380px] shrink-0">
                                        <BlurImage
                                            alt="feature11final"
                                            src="https://ltjnvfgpomlatmtqjxrk.supabase.co/storage/v1/object/public/landing_page//mockup3.png"
                                            contentMode="contain"
                                            sizes="(max-width: 640px) 80px, 190px"
                                            className="rounded-md"
                                            canSelect={false}
                                        />
                                    </div>
                                    <div className="relative flex items-center w-[80px] h-[130px] sm:w-[190px] sm:h-[380px] shrink-0">
                                        <BlurImage
                                            alt="feature11final"
                                            src="https://ltjnvfgpomlatmtqjxrk.supabase.co/storage/v1/object/public/landing_page//mockup4.png"
                                            contentMode="contain"
                                            sizes="(max-width: 640px) 80px, 190px"
                                            className="rounded-md"
                                            canSelect={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-5 w-full">
                            <div className="flex flex-col w-full justify-start pb-5">
                                <h2 className="text-3xl font-semibold">For followers</h2>
                                <p className="text-secondaryText text-xl">All the tools you need to get in better shape.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-5 w-full">
                                <div className="flex flex-col w-full gap-3 p-5 items-center bg-zinc-900 rounded-lg">
                                    <div className="relative flex items-center w-[170px] h-[260px] sm:w-[170px] sm:h-[260px] shrink-0">
                                        <BlurImage
                                            alt="mockup6final"
                                            src="https://ltjnvfgpomlatmtqjxrk.supabase.co/storage/v1/object/public/landing_page//mockup7final.png"
                                            contentMode="contain"
                                            sizes="(max-width: 640px) 170px, 170px"
                                            className="rounded-md"
                                            canSelect={false}
                                        />
                                    </div>
                                    <h2 className="text-secondaryText text-lg font-semibold">Follow programs day-to-day.</h2>
                                </div>
                                <div className="flex flex-col w-full gap-3 p-5 items-center bg-zinc-900 rounded-lg">
                                <div className="relative flex items-center w-[170px] h-[260px] sm:w-[170px] sm:h-[260px] shrink-0">
                                        <BlurImage
                                            alt="mockup7final"
                                            src="https://ltjnvfgpomlatmtqjxrk.supabase.co/storage/v1/object/public/landing_page//mockup8final.png"
                                            contentMode="contain"
                                            sizes="(max-width: 640px) 170px, 170px"
                                            className="rounded-md"
                                            canSelect={false}
                                        />
                                    </div>
                                    <h2 className="text-secondaryText text-lg font-semibold">Search for creators.</h2>
                                </div>
                                <div className="flex flex-col w-full gap-3 p-5 items-center bg-zinc-900 rounded-lg">
                                    <div className="relative flex items-center w-[170px] h-[260px] sm:w-[170px] sm:h-[260px] shrink-0">
                                        <BlurImage
                                            alt="mockup8final"
                                            src="https://ltjnvfgpomlatmtqjxrk.supabase.co/storage/v1/object/public/landing_page//mockup6final.png"
                                            contentMode="contain"
                                            sizes="(max-width: 640px) 170px, 170px"
                                            className="rounded-md"
                                            canSelect={false}
                                        />
                                    </div>
                                    <h2 className="text-secondaryText text-lg font-semibold">Find the training protocols for you.</h2>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-10">
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
                        <div className="flex flex-col items-center gap-5">
                            <p className="text-primaryText text-md sm:text-2xl font-semibold text-center">
                                Get started for free.
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