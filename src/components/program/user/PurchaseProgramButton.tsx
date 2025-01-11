"use client";

import { Button } from "../../ui/button";
import { Tables } from "../../../../database.types";
import Link from "next/link";
import { useUserContext } from "@/context";
import LoggedOutPurchaseButton from "./LoggedOutPurchaseButton";
import { Loader2 } from "lucide-react";

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

    const { user: contextUser, isLoading: contextIsLoading } = useUserContext();

    if (contextIsLoading) {
        return (
            <Button type="submit" variant="disabled" size="full" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </Button>
        )
    } else {
        if (contextUser) {
            return (
                <Button variant="systemBlue" size="sm" asChild>
                    <Link href={{
                        pathname: "purchase",
                        query: {
                            programId: program.id,
                            creatorId: creator.stripe_account_id,
                            userId: contextUser.id
                        }
                    }}>
                        Buy - {formatter.format(program.price)}
                    </Link>
                </Button>
            )
        } else {
            return (
                <LoggedOutPurchaseButton program={program} />
            )
        }
    }
}
export default PurchaseProgramButton