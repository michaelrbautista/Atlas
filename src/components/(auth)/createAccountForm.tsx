"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createAccount } from "../../server-actions/auth";
import { CreateAccountSchema } from "@/app/schema";
import { useFormStatus } from "react-dom";

const CreateAccountForm = ({ 
    onOpenChange
}: { 
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const [error, setError] = useState("");

    const onCreateAccount = async (formData: FormData) => {
        const newUser = {
            fullName: formData.get("fullName"),
            email: formData.get("email"),
            username: formData.get("username"),
            password: formData.get("password")
        }

        const result = CreateAccountSchema.safeParse(newUser);
        if (!result.success) {
            setError(result.error.issues[0].message);
            return
        }

        if (newUser.password !== formData.get("confirmPassword")) {
            setError("Passwords must match.");
            return
        }

        // Create user
        const createUserError = await createAccount(
            newUser.fullName as string, 
            newUser.email as string, 
            newUser.username as string, 
            newUser.password as string
        );

        if (createUserError) {
            setError(createUserError.errorMessage);
        } else {
            onOpenChange(false);
        }
    }

    function CreateAccountButton() {
        const { pending } = useFormStatus();

        return (
            <Button className={buttonVariants({ variant: "systemBlue", size: "full"})} disabled={pending}>
                {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {pending ? "Creating account" : "Create account"}
            </Button>
        )
    }

    return (
        <div className="flex flex-col w-full max-w-lg p-2 gap-10 rounded-md">
            <div className="flex justify-center items-center gap-5">
                <Image className="rounded-md border-[1px] border-systemGray4" src="/icon.jpg" width={40} height={40} alt="icon"></Image>
                <div className="text-primaryText font-bold text-2xl">
                    Atlas
                </div>
            </div>
            <form action={onCreateAccount} className="flex flex-col items-center gap-4">
                <Input id="fullName" name="fullName" placeholder="Full Name"></Input>
                <Input id="email" name="email" placeholder="Email"></Input>
                <Input id="username" name="username" placeholder="Username"></Input>
                <Input id="password" name="password" type="password" placeholder="Password"></Input>
                <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm Password"></Input>
                <CreateAccountButton />
                {(error !== "") && (
                    <p className="text-primaryText text-sm">{error}</p>
                )}
            </form>
        </div>
    );
}
 
export default CreateAccountForm;