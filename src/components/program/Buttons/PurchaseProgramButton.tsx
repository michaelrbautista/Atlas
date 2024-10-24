"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { Button } from "../../ui/button";
import { Tables } from "../../../../database.types";
import StripePaymentForm from "../Forms/StripePaymentForm";
import Link from "next/link";
import { useUserContext } from "@/context";
import LoggedOutPurchaseButton from "./LoggedOutPurchaseButton";

const PurchaseProgramButton = ({
    program,
    creator
}: {
    program: Tables<"programs">
    creator: Tables<"users">
}) => {
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    });

    const { user: contextUser } = useUserContext();

    console.log(contextUser);

    if (contextUser) {
        return (
            <Button variant="systemBlue" size="full" asChild>
                <Link href={{
                    pathname: "purchase",
                    query: {
                        programId: program.id,
                        creatorId: creator.stripe_account_id,
                        userId: contextUser.id
                    }
                }}>
                    Purchase Program - {formatter.format(program.price)}
                </Link>
            </Button>
        )
    } else {
        return (
            <LoggedOutPurchaseButton program={program} />
        )
    }

    // return (
    //     <Dialog>
    //         <DialogTrigger asChild>
    //             <Button variant="systemBlue" size="full">
    //                 Purchase Program - {formatter.format(program.price)}
    //             </Button>
    //         </DialogTrigger>
    //         <DialogContent className="max-w-sm sm:max-w-3xl h-5/6 overflow-scroll">
    //             <DialogHeader>
    //                 <DialogTitle>Purchase Program</DialogTitle>
    //                 <DialogDescription></DialogDescription>
    //             </DialogHeader>
    //             <StripePaymentForm
    //                 program={program}
    //                 connectedAccountId={creator.stripe_account_id!}
    //             />
    //         </DialogContent>
    //     </Dialog>
    // )
}
export default PurchaseProgramButton