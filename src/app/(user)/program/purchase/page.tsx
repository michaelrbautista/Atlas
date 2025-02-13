import { getProgram } from "@/server-actions/program";
import { Separator } from "@/components/ui/separator";
import OneTimePaymentForm from "@/components/program/user/OneTimePaymentForm";
import { getCurrentUser, getUser } from "@/server-actions/user";

const PurchaseProgram = async ({
    searchParams
} : {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
    const { programId = "" } = await searchParams

    // Get current user
    const user = await getCurrentUser();

    // Get program
    const program = await getProgram(programId);

    // Get creator
    const creator = await getUser(program.created_by);

    return (
        <div className="flex flex-col w-full max-w-xl px-5 py-20 sm:py-10 gap-10 sm:gap-10">
            <div className="flex flex-col items-center gap-5">
                <p className="text-primaryText text-3xl font-bold text-center">Purchase Program</p>
                <Separator />
                {/* IMPLEMENT ONE TIME PAYMENT FORM */}
                <OneTimePaymentForm
                    connectedAccountId={creator.stripe_account_id ? creator.stripe_account_id : ""}
                    creatorId={program.created_by}
                    creatorUsername={creator.username}
                    userId={user.id}
                    userEmail={user.email}
                    price={program.price ?? 5}
                    programId={program.id}
                    programTitle={program.title}
                />
            </div>
        </div>
    )
}

export default PurchaseProgram