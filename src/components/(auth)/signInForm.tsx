"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "../../server-actions/auth";
import { SignInSchema } from "@/app/schema";
import { useFormStatus } from "react-dom";

const SignInForm = ({ 
    onOpenChange 
}: { 
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const formStatus = useFormStatus();
    const [error, setError] = useState("");

    const onSignIn = async (formData: FormData) => {
        console.log(formStatus.pending)

        const user = {
            email: formData.get("email"),
            password: formData.get("password")
        }

        const result = SignInSchema.safeParse(user);
        if (!result.success) {
            setError(result.error.issues[0].message);
            return
        }

        const loginError = await signIn(user.email as string, user.password as string);

        if (loginError) {
            setError(loginError.errorMessage);
        } else {
            onOpenChange(false);
        }
    }

    function SignInButton() {
        const { pending } = useFormStatus();

        return (
            <Button className={buttonVariants({ variant: "systemBlue", size: "full"})} disabled={pending}>
                {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {pending ? "Signing in" : "Sign in"}
            </Button>
        )
    }

    return (
        <div className="flex flex-col w-full max-w-lg p-2 gap-10 rounded-md bg-background">
            <div className="flex justify-center items-center gap-5">
                <Image className="rounded-md border-[1px] border-systemGray4" src="/icon.jpg" width={40} height={40} alt="icon"></Image>
                <div className="text-primaryText font-bold text-2xl">
                    Atlas
                </div>
            </div>
            <form action={onSignIn} className="flex flex-col items-center gap-4" noValidate>
                <Input id="email" name="email" placeholder="Email"></Input>
                <Input id="password" name="password" type="password" placeholder="Password"></Input>
                <SignInButton />
                {(error !== "") && (
                    <p className="text-primaryText text-sm">{error}</p>
                )}
            </form>
        </div>
    );
}
 
export default SignInForm;