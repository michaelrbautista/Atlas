"use client";

import { ProgramSchema, SignUpSchema } from '@/app/schema';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Dispatch, SetStateAction, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Tables } from '../../../database.types';
import { useToast } from '../ui/use-toast';
import { signUpForWaitlist } from '@/server-actions/landingPage';

const SignUpForm = ({
    setIsOpen
}: {
    setIsOpen: Dispatch<SetStateAction<boolean>>
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [wasSignedUp, setWasSignedUp] = useState(false);

    const { toast } = useToast();

    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            email: ""
        }
    })

    async function onSubmit(data: z.infer<typeof SignUpSchema>) {
        setIsLoading(true);

        const formData = new FormData();
        
        if (data.email) {
            formData.append("email", data.email);
        }

        let { data: signUpData, error: signUpError } = await signUpForWaitlist(formData);

        if (signUpError && !signUpData) {
            if (signUpError.code == "23505") {
                toast({
                    title: "We've got you on the waitlist already.",
                    description: "If you haven't been emailed yet, please send an email to mrbautistadev@gmail.com."
                })
            } else {
                toast({
                    title: "An error occurred.",
                    description: signUpError.message
                })
            }

            setIsLoading(false);
            return
        }

        setWasSignedUp(true);
    }

    if (wasSignedUp) {
        return (
            <div>
                <p className="py-5">
                    Thanks for signing up. We'll be in contact soon.
                </p>
                <Button onClick={() => {setIsOpen(false)}} variant="secondary" size="full">Okay</Button>
            </div>
        )
    } else {
        return (
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
                        <Button type="submit" variant={isLoading ? "disabled" : "systemBlue"} size="full" className="mt-3" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign up"}
                        </Button>
                    </div>
                </form>
            </Form>
        )
    }
}

export default SignUpForm