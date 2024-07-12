'use client';

import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { useRef, useState } from "react";
import ErrorToast from "../components/errorToast";
import onSignUp from "./onSignUp";
import SignUpConfirmation from "./signUpConfirmation";

const SignUpForm = () => {
    const phoneRef = useRef<HTMLInputElement>(null);

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [showConfirmation, setShowConfirmation] = useState(false);

    async function clientSignUp(e: React.ChangeEvent<any>) {
        e.preventDefault();

        setShowError(false);
        setErrorMessage("");

        if (phoneRef.current !== null && phoneRef.current.value !== "") {
            const error = await onSignUp(phoneRef.current.value);
            
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
            <Input ref={phoneRef} type="email" placeholder="Enter your email" id="email"></Input>
            <Button onClick={clientSignUp} type="submit" className={buttonVariants({ variant: "systemBlue", size: "wide" })}>Get Access</Button>
            <SignUpConfirmation showConfirmation={showConfirmation}>Your email was added. We'll send you an email when you have access.</SignUpConfirmation>
        </form>
    )
}

export default SignUpForm;