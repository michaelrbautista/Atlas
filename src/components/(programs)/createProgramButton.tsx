"use client";

import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useRef } from "react";

const CreateProgramButton = () => {
    const titleRef = useRef<HTMLInputElement>(null);

    return (
        <Sheet>
            <SheetTrigger className="hidden sm:flex" asChild>
                <Button className={buttonVariants({ variant: "systemBlue", size: "sm"})}>Create Program</Button>
            </SheetTrigger>
            <SheetTitle hidden>Menu</SheetTitle>
            <SheetContent side="right" className="p-0 border-0 w-96 bg-systemGray6 flex flex-col justify-between">
                <div className="flex flex-col gap-5 pt-20 px-5">
                    <Input ref={titleRef} type="" placeholder="Program Title" id="title"></Input>
                    <Button className={buttonVariants({ variant: "systemBlue", size: "full"})}>Create Program</Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
 
export default CreateProgramButton;