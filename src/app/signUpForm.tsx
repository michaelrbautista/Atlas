'use client';

import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { useRef, useState } from "react";
import ErrorToast from "../components/errorToast";
import onSignUp from "./onSignUp";
import SignUpConfirmation from "./signUpConfirmation";

const SignUpForm = () => {
    const emailRef = useRef<HTMLInputElement>(null);

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [showConfirmation, setShowConfirmation] = useState(false);

    async function clientSignUp(e: React.ChangeEvent<any>) {
        e.preventDefault();

        setShowError(false);
        setErrorMessage("");

        if (emailRef.current !== null && emailRef.current.value !== "") {
            const error = await onSignUp(emailRef.current.value);
            
            if (error) {
                if (error.code === '23505') {
                    setShowError(true);
                    setErrorMessage("Your email has already been added.");
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
    }

    return (
        <form onSubmit={clientSignUp} className="flex flex-col items-center gap-4">
            <ErrorToast showError={showError}>{errorMessage}</ErrorToast>
            <Input ref={emailRef} type="email" placeholder="Enter your email" id="email"></Input>
            <Button onClick={clientSignUp} type="submit" className={buttonVariants({ variant: "systemBlue", size: "wide" })}>Get Access</Button>
            <SignUpConfirmation showConfirmation={showConfirmation}>Your email was added. We'll let you know when you have access.</SignUpConfirmation>
        </form>
    )
}

export default SignUpForm;