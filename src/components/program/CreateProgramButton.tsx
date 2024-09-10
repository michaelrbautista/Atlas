"use client";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Loader2 } from "lucide-react";
import { createProgram } from "@/server-actions/program";
import { useFormStatus } from "react-dom";
import { ProgramSchema } from "@/app/schema";
import ProgramForm from "./ProgramForm";

const CreateProgramButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    const createProgramSubmit = async (formData: FormData) => {
        // Client side validation
        const newProgram = {
            title: formData.get("title") as string,
            weeks: parseInt(formData.get("weeks") as string),
            price: parseFloat(formData.get("price") as string),
            description: formData.get("description") as string
        }

        const result = ProgramSchema.safeParse(newProgram);
        if (!result.success) {
            console.log(result.error.issues)
            return
        }

        // Add image to form data
        const imageElement = document.getElementById("image") as HTMLInputElement;
        const elementFiles = imageElement.files

        if (elementFiles) {
            formData.set("image", elementFiles[0])
        } else {
            console.log("Couldn't get file from input.");
        }

        let error = await createProgram(formData);

        if (error) {
            console.log(error);
            return
        }

        setIsOpen(false);
    }

    function CreateProgramButton() {
        const { pending } = useFormStatus();

        return (
            <Button className={buttonVariants({ variant: "systemBlue", size: "full"})} disabled={pending}>
                {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {pending ? "Creating program" : "Create program"}
            </Button>
        )
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="hidden sm:flex" asChild>
                <Button className={buttonVariants({ variant: "systemBlue", size: "sm"})}>Create Program</Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background">
                <SheetHeader>
                    <SheetTitle>New Program</SheetTitle>
                    <SheetDescription hidden></SheetDescription>
                </SheetHeader>
                <ProgramForm setIsOpen={setIsOpen}/>
            </SheetContent>
        </Sheet>
    );
}
 
export default CreateProgramButton;