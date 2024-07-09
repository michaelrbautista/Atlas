'use client';

import Navbar from "@/components/Navbar";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import SignUpForm from "./signUpForm";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  async function checkInitialSession() {
    
  }

  checkInitialSession();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pb-10 bg-systemGray6">
        <h1 className="text-xl font-bold text-primaryText">Loading...</h1>
      </div>
    )
  } else {
    return (
      <div>
        <Navbar></Navbar>
        <div className="py-20 mx-auto text-center flex flex-col items-center max-w-80 lg:max-w-3xl gap-4">
          <h1 className="text-4xl lg:text-6xl font-bold text-primaryText">
            You can go D1.
          </h1>
          <h1 className="text-xl lg:text-3xl font-bold text-secondaryText">
            Get access to training and nutrition programs to play Division 1 soccer.
          </h1>
          <div className="mt-6 w-full lg:w-96">
            <SignUpForm></SignUpForm>
            {/* <Link href="/createAccount" className={buttonVariants({ variant: "systemBlue", size: "lg" })}>Create Account</Link> */}
          </div>
        </div>
      </div>
    )
  }
}
