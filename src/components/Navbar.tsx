import Link from "next/link";
import { buttonVariants } from "./ui/button";
import Image from "next/image";

const Navbar = () => {
    return (
        <div className="sticky z-50 top-0 inset-x-0 h-24">
            <div className="flex flex-row justify-between w-full h-full bg-systemGray6 px-8 border-b border-systemGray4">
                <div className="flex flex-row items-center gap-4">
                    <Image className="rounded-md border-[1px] border-systemGray4" src="/icon.jpg" width={40} height={40} alt="icon"></Image>
                    <div className="text-primaryText font-bold text-2xl">
                        Atlas
                    </div>
                </div>
                <div className="flex flex-row items-center">
                    <Link href="/login" className={buttonVariants({ variant: "disabled", size: "lg" })}>Login</Link>
                </div>
            </div>
        </div>
    )
};

export default Navbar;