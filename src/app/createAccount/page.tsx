import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

const createAccount = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-systemGray6">
            <div className="flex flex-col w-full max-w-lg p-10 gap-10 rounded-md bg-systemGray6">
                <Link href="/" className="flex justify-center items-center gap-5">
                    <Image className="rounded-md border-[1px] border-systemGray4" src="/icon.jpg" width={40} height={40} alt="icon"></Image>
                    <div className="text-primaryText font-bold text-2xl">
                        Atlas
                    </div>
                </Link>
                <div className="flex flex-col items-center gap-4">
                    <Input type="" placeholder="Full Name"></Input>
                    <Input type="email" placeholder="Email"></Input>
                    <Input type="" placeholder="Username"></Input>
                    <Input type="password" placeholder="Password"></Input>
                    <Input type="password" placeholder="Confirm Password"></Input>
                    <Button className={buttonVariants({ variant: "systemBlue", size: "wide" })}>Create Account</Button>
                    <p className="text-secondaryText">
                        Already have an account? <Link href="/login" className="text-secondaryText underline">Sign in</Link>
                    </p>
                </div>
            </div>
            <div>

            </div>
        </div>
    )
};

export default createAccount;