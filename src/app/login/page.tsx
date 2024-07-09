import Image from "next/image";
import LoginForm from "./loginForm";
import Link from "next/link";

const SignIn = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-systemGray6">
            <div className="flex flex-col w-full max-w-lg p-10 gap-10 rounded-md bg-systemGray6">
                <Link href="/" className="flex justify-center items-center gap-5">
                    <Image className="rounded-md border-[1px] border-systemGray4" src="/icon.jpg" width={40} height={40} alt="icon"></Image>
                    <div className="text-primaryText font-bold text-2xl">
                        Atlas
                    </div>
                </Link>
                <LoginForm></LoginForm>
            </div>
        </div>
    )
};

export default SignIn;