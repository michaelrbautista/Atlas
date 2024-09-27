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
import { useToast } from "../ui/use-toast";

const PurchaseProgramButton = ({
    program
}: {
    program: Tables<"programs">
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<Tables<"users"> | null>(null);
    const [creator, setCreator] = useState<Tables<"users"> | null>(null);

    const { toast } = useToast();

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
                toast({
                    title: "An error occurred.",
                    description: "Couldn't get current user."
                })
                return
            }

            const { data: userData, error: userError } = await supabase
                .from("users")
                .select()
                .eq("id", user.id)
                .single()

            if (userError && !userData) {
                toast({
                    title: "An error occurred.",
                    description: userError.message
                })
                return
            }
            
            setUser(userData);

            const { data: creatorData, error: creatorError } = await supabase
                .from("users")
                .select()
                .eq("id", program.created_by)
                .single()
                
            if(creatorError && !creatorData) {
                toast({
                    title: "An error occurred.",
                    description: creatorError.message
                })
                return
            }

            setCreator(creatorData);

            setIsLoading(false);
        }

        checkIfPurchased();
    }, []);

    if (isLoading || !user || !creator?.stripe_account_id) {
        return (
            <Button variant="secondary" size="full" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </Button>
        )
    } else {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="systemBlue" size="full">
                        Purchase Program - {formatter.format(program.price)}
                    </Button>
                </DialogTrigger>
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
            </Dialog>
        )
    }
}
export default PurchaseProgramButton