"use client";

import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";

const CreateAccountForm = ({ onOpenChange }: { onOpenChange: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState(false);

    const onCreateAccount = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        setIsLoading(true);
    
        onOpenChange(false);
    }

    return (
        <div className="flex flex-col w-full max-w-lg p-2 gap-10 rounded-md bg-systemGray6">
            <div className="flex justify-center items-center gap-5">
                <Image className="rounded-md border-[1px] border-systemGray4" src="/icon.jpg" width={40} height={40} alt="icon"></Image>
                <div className="text-primaryText font-bold text-2xl">
                    Atlas
                </div>
            </div>
            <form onSubmit={(e) => onCreateAccount(e)} className="flex flex-col items-center gap-4">
                <Input type="" placeholder="Full Name"></Input>
                <Input type="email" placeholder="Email"></Input>
                <Input type="" placeholder="Username"></Input>
                <Input type="password" placeholder="Password"></Input>
                <Input type="password" placeholder="Confirm Password"></Input>
                {isLoading ?
                    <Button className={buttonVariants({ size: "lg" })} disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/></Button>
                    :
                    <Button onClick={() => {onOpenChange(false)}} type="submit" className={buttonVariants({ variant: "default", size: "lg" })}>Create Account</Button>      
                }
            </form>
        </div>
    );
}
 
export default CreateAccountForm;