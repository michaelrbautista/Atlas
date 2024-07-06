'use client';

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { useRef, useState } from "react";
import ErrorToast from "../../components/errorToast";
import onSignIn from "./onSignIn";

const SignInForm = () => {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function clientSignIn(e: React.ChangeEvent<any>) {
        e.preventDefault();

        setShowError(false);
        setErrorMessage("");

        if (emailRef.current !== null && passwordRef.current !== null) {
            if (emailRef.current.value !== "" && passwordRef.current.value !== "") {
                const signedInUser = await onSignIn(emailRef.current.value, passwordRef.current.value);
                console.log({
                    data: signedInUser
                });
            } else {
                setShowError(true);
                setErrorMessage("Email or password is incorrect.");
            }
        } else {
            setShowError(true);
            setErrorMessage("Email or password is incorrect.");
        }
    }

    return (
        <form onSubmit={clientSignIn} className="flex flex-col items-center gap-4">
            <ErrorToast showError={showError}>{errorMessage}</ErrorToast>
            <Input ref={emailRef} type="email" placeholder="Email" id="email"></Input>
            <Input ref={passwordRef}  type="password" placeholder="Password" id="password"></Input>
            <Button onClick={clientSignIn} type="submit" className={buttonVariants({ variant: "systemBlue", size: "wide" })}>Login</Button>
            <p className="text-secondaryText">
                Don't have an account? <Link href="/createAccount" className="text-secondaryText underline">Create one</Link>
            </p>
        </form>
    )
}

export default SignInForm;