import StripePaymentForm from "@/components/profile/user/StripePaymentForm"
import { Tables } from "../../../../../database.types"
import { getProgram } from "@/server-actions/program";
import { Separator } from "@/components/ui/separator";

const PurchaseProgram = async ({
    searchParams
} : {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
    const { programId = "", creatorId = "", userId = "" } = await searchParams

    // Get program
    const program = await getProgram(programId)

    return (
        <div className="flex flex-col w-full max-w-xl px-5 py-20 sm:py-10 gap-10 sm:gap-10">
            <div className="flex flex-col items-center gap-5">
                <p className="text-primaryText text-3xl font-bold text-center">Purchase Program</p>
                <Separator />
                <StripePaymentForm
                    program={program}
                    connectedAccountId={creatorId}
                    userId={userId}
                />
            </div>
        </div>
    )
}

export default PurchaseProgram