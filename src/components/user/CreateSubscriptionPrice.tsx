"use client";

import { ProgramSchema, SignUpSchema, SubscriptionPriceSchema } from '@/app/schema';
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
import { createSubscriptionPrice, redirectToHome } from '@/server-actions/creator';

const CreateSubscriptionPrice = ({
    stripeAccountId,
    paymentsEnabled
}: {
    stripeAccountId: string,
    paymentsEnabled: boolean
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const { toast } = useToast();

    const form = useForm<z.infer<typeof SubscriptionPriceSchema>>({
        resolver: zodResolver(SubscriptionPriceSchema),
        defaultValues: {
            price: 5.00
        }
    })

    async function onSubmit(data: z.infer<typeof SubscriptionPriceSchema>) {
        setIsLoading(true);

        const formData = new FormData();
        
        if (data.price) {
            formData.append("price", data.price.toString());
        }

        // Save subscription price in users table
        let error = await createSubscriptionPrice(formData);

        if (error) {
            toast({
                title: "An error occurred.",
                description: error.error
            })

            setIsLoading(false);
        }

        redirectToHome();
    }

    if (stripeAccountId === "" || !paymentsEnabled) {
        return (
            <div className="flex flex-col gap-2 w-full max-w-sm">
                <p className="text-primaryText text-base font-medium">3. Create subscription</p>
                <Input
                    disabled
                />
                <Button variant="disabled" size="full" disabled>
                    Create subscription price
                </Button>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col gap-2 w-full max-w-sm">
                <p className="text-primaryText text-base font-medium">3. Create subscription</p>
                <Form {...form}>
                    <form className="" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-3">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price of subscription</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                id="price"
                                                name="price"
                                                type="number"
                                                step={0.01}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" variant={isLoading ? "disabled" : "systemBlue"} size="full" className="mt-3" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create subscription"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        )
    }
}
export default CreateSubscriptionPrice