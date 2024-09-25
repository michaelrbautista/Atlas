"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "../../server-actions/auth";
import { SignInSchema } from "@/app/schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

const SignInForm = ({ 
    setIsOpen 
}: { 
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const form = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    async function onSubmit(data: z.infer<typeof SignInSchema>) {
        setIsLoading(true);
        setError("");

        let error = await signIn(
            data.email,
            data.password
        );

        if (error) {
            setError(error.errorMessage);
            setIsLoading(false);
            return
        }

        setIsOpen(false);
    }

    return (
        <div className="flex flex-col w-full max-w-lg p-2 gap-5 rounded-md bg-background">
            <div className="flex justify-center items-center gap-5">
                <Image className="rounded-md border-[1px] border-systemGray4" src="/icon.jpg" width={40} height={40} alt="icon"></Image>
                <div className="text-primaryText font-bold text-2xl">
                    Atlas
                </div>
            </div>
            <Form {...form}>
                <form className="py-5" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-3">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id="email"
                                            name="email"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id="password"
                                            name="password"
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" variant={isLoading ? "disabled" : "systemBlue"} size="full" className="mt-3" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? "Signing in" : "Sign in"}
                        </Button>
                        {(error != "") && (
                            <p className="text-destructive">{error}</p>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    );
}
 
export default SignInForm;