"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createAccount, redirectToHome } from "../../server-actions/auth";
import { CreateAccountSchema } from "@/app/schema";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useToast } from "../ui/use-toast";

const CreateAccountForm = ({ 
    fromLandingPage,
    setIsOpen
}: { 
    fromLandingPage: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const { toast } = useToast();

    const form = useForm<z.infer<typeof CreateAccountSchema>>({
        resolver: zodResolver(CreateAccountSchema),
        defaultValues: {
            fullName: "",
            email: "",
            username: "",
            password: "",
            confirmPassword: ""
        }
    })

    async function onSubmit(data: z.infer<typeof CreateAccountSchema>) {
        setIsLoading(true);

        if (data.password !== data.confirmPassword) {
            toast({
                title: "An error occurred.",
                description: "Passwords must match."
            })
            setIsLoading(false);
            return
        }

        const { data: createAccountData, error: createAccountError } = await createAccount(
            data.fullName, 
            data.email, 
            data.username, 
            data.password
        );

        if (createAccountError && !createAccountData) {
            toast({
                title: "An error occurred.",
                description: createAccountError
            })
            setIsLoading(false);
            return
        }

        redirectToHome();

        setIsOpen(false);
    }

    return (
        <div className="flex flex-col w-full max-w-lg p-2 gap-5 rounded-md">
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
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id="fullName"
                                            name="fullName"
                                            // placeholder="Enter your full name"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                                            // placeholder="Enter your email"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id="username"
                                            name="username"
                                            // placeholder="Enter a username"
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
                                            // placeholder="********"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            // placeholder="********"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" variant={isLoading ? "disabled" : "systemBlue"} size="full" className="mt-3" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {!isLoading && "Create account"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
 
export default CreateAccountForm;