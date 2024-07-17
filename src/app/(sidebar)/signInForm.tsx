"use client";

import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "./actions";
import { cn } from "@/lib/utils";

const SignInForm = ({ onOpenChange }: { onOpenChange: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setShowError(false);
        setErrorMessage("");

        setIsLoading(true);

        if (emailRef.current !== null && passwordRef.current !== null) {
            if (emailRef.current.value !== "" && passwordRef.current.value !== "") {
                const loginError = await signIn(emailRef.current.value, passwordRef.current.value);

                if (loginError) {
                    setIsLoading(false);
                    setShowError(true);
                    setErrorMessage(loginError.errorMessage);
                } else {
                    onOpenChange(false);
                }
            } else {
                setIsLoading(false);
                setShowError(true);
                setErrorMessage("Please fill in all fields.");
            }
        } else {
            setIsLoading(false);
            setShowError(true);
            setErrorMessage("Email or password is incorrect.");
        }
    }

    return (
        <div className="flex flex-col w-full max-w-lg p-2 gap-10 rounded-md bg-systemGray6">
            <div className="flex justify-center items-center gap-5">
                <Image className="rounded-md border-[1px] border-systemGray4" src="/icon.jpg" width={40} height={40} alt="icon"></Image>
                <div className="text-primaryText font-bold text-2xl">
                    Atlas
                </div>
            </div>
            <form onSubmit={(e) => onSignIn(e)} className="flex flex-col items-center gap-4" noValidate>
                <Input ref={emailRef} type="email" placeholder="Email" id="email"></Input>
                <Input ref={passwordRef}  type="password" placeholder="Password" id="password"></Input>
                {isLoading ?
                    <Button className={buttonVariants({ size: "wide" })} disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/></Button>
                    :
                    <Button type="submit" className={buttonVariants({ variant: "systemBlue", size: "wide" })}>Sign In</Button>      
                }
                <h1 className={cn("text-primaryText text-sm text-center w-full", !showError && "hidden")}>{errorMessage}</h1>
            </form>
        </div>
    );
}
 
export default SignInForm;