"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "../../../database.types";
import { Loader2 } from "lucide-react";
import StripePaymentForm from "./StripePaymentForm";
import SignInButton from "../auth/SignInButton";
import CreateAccountButton from "../auth/CreateAccountButton";

const PurchaseProgramButton = ({
    program
}: {
    program: Tables<"programs">
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<Tables<"users"> | null>(null);
    const [creator, setCreator] = useState<Tables<"users"> | null>(null);

    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    });
    
    useEffect(() => {
        const checkIfPurchased = async () => {
            setIsLoading(true);

            const supabase = createClient();

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                console.log("No user is logged in or couldn't get current user.");
                setIsLoading(false);
                return
            }

            setIsLoggedIn(true);

            const { data: userData, error: userError } = await supabase
                .from("users")
                .select()
                .eq("id", user.id)
                .single()
            
            if (userData && !userError) {
                setUser(userData);
            }

            const { data: creatorData, error: creatorError } = await supabase
                .from("users")
                .select()
                .eq("id", program.created_by)
                .single()
                
            if(creatorError && !creatorData) {
                console.log(creatorError);
                return
            }

            setCreator(creatorData);

            setIsLoading(false);
        }

        checkIfPurchased();
    }, [])

    if (isLoading) {
        return (
            <Button variant="secondary" size="full" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </Button>
        )
    } else {
        return (
            <Dialog>
                <DialogTrigger className="w-full" asChild>
                    <Button variant="systemBlue" size="full">
                        Purchase Program - {formatter.format(program.price)}
                    </Button>
                </DialogTrigger>
                {(isLoggedIn && user && creator?.stripe_account_id) ? (
                    <DialogContent className="max-w-sm sm:max-w-3xl h-5/6 overflow-scroll">
                        <DialogHeader>
                            <DialogTitle>Purchase Program</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <StripePaymentForm
                            program={program}
                            currentUserId={user.id}
                            connectedAccountId={creator.stripe_account_id}
                        />
                    </DialogContent>
                ): (
                    <DialogContent className="w-11/12">
                        <DialogHeader>
                            <DialogTitle>Purchase Program</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-5 pt-5">
                            <p className="text-primaryText">You must login or create an account to purchase a program.</p>
                            <div className="flex flex-col gap-3">
                                <SignInButton />
                                <CreateAccountButton />
                            </div>
                        </div>
                    </DialogContent>
                )}
                
            </Dialog>
        )
    }
}
export default PurchaseProgramButton