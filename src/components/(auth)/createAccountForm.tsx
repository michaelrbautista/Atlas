"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createAccount } from "./actions";

const CreateAccountForm = ({ onOpenChange }: { onOpenChange: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const fullNameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onCreateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setShowError(false);
        setErrorMessage("");

        setIsLoading(true);

        if (
            fullNameRef.current !== null && 
            emailRef.current !== null && 
            usernameRef.current !== null && 
            passwordRef.current !== null && 
            confirmPasswordRef.current !== null) {
            if (
                fullNameRef.current.value !== "" && 
                emailRef.current.value !== "" && 
                usernameRef.current.value !== "" && 
                passwordRef.current.value !== "" &&
                confirmPasswordRef.current.value !== "") {
                    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
                        setIsLoading(false);
                        setShowError(true);
                        setErrorMessage("Passwords must match.");
                        return
                    }

                    // Create user
                    const createUserError = await createAccount(
                        fullNameRef.current.value, 
                        emailRef.current.value, 
                        usernameRef.current.value, 
                        passwordRef.current.value
                    );

                    if (createUserError) {
                        setIsLoading(false);
                        setShowError(true);
                        setErrorMessage(createUserError.errorMessage);
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
        <div className="flex flex-col w-full max-w-lg p-2 gap-10 rounded-md">
            <div className="flex justify-center items-center gap-5">
                <Image className="rounded-md border-[1px] border-systemGray4" src="/icon.jpg" width={40} height={40} alt="icon"></Image>
                <div className="text-primaryText font-bold text-2xl">
                    Atlas
                </div>
            </div>
            <form onSubmit={(e) => onCreateAccount(e)} className="flex flex-col items-center gap-4">
                <Input ref={fullNameRef} type="fullname" placeholder="Full Name"></Input>
                <Input ref={emailRef} type="email" placeholder="Email"></Input>
                <Input ref={usernameRef} type="username" placeholder="Username"></Input>
                <Input ref={passwordRef} type="password" placeholder="Password"></Input>
                <Input ref={confirmPasswordRef} type="password" placeholder="Confirm Password"></Input>
                {isLoading ?
                    <Button className={buttonVariants({ size: "lg" })} disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/></Button>
                    :
                    <Button type="submit" className={buttonVariants({ variant: "systemBlue", size: "default" })}>Create Account</Button>      
                }
                <h1 className={cn("text-primaryText text-sm text-center w-full", !showError && "hidden")}>{errorMessage}</h1>
            </form>
        </div>
    );
}
 
export default CreateAccountForm;