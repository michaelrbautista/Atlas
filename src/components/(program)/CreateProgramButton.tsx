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

import { z } from "zod";

const ProgramSchema = z.object({
    content: z.string().trim().min(1).max(90)
})

const CreateProgramButton = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const createProgramSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setIsLoading(true);

        // Get image
        const imageElement = document.getElementById("image") as HTMLInputElement;
        const elementFiles = imageElement.files;

        if (!elementFiles) {
            console.log("Couldn't get input element files.");
            return
        }

        const image = elementFiles[0];

        const formData = new FormData(event.currentTarget);
        formData.set("image", image);

        if (!imageElement) {
            console.log("Couldn't get image element")
            return
        }

        // Create program
        await createProgram(formData);

        setIsLoading(false);
        setIsOpen(false);
    }

    return (
        <Sheet>
            <SheetTrigger className="hidden sm:flex" asChild>
                <Button className={buttonVariants({ variant: "systemBlue", size: "sm"})}>Create Program</Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-systemGray6">
                <SheetHeader>
                    <SheetTitle>New Program</SheetTitle>
                    <SheetDescription hidden></SheetDescription>
                </SheetHeader>
                <form onSubmit={createProgramSubmit} className="flex flex-col gap-5 pt-5">
                    <div className="grid w-full items-center gap-2">
                        <Label htmlFor="image">Image</Label>
                        <Input id="image" type="file" accept=".jpg, .jpeg, .png"/>
                    </div>
                    <div className="grid w-full items-center gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" type="" placeholder="Enter title"></Input>
                    </div>
                    <div className="grid w-full items-center gap-2">
                        <Label htmlFor="weeks">Number of weeks</Label>
                        <Input id="weeks" type="" placeholder="Enter number of weeks"></Input>
                    </div>
                    <div className="grid w-full items-center gap-2">
                        <Label htmlFor="price">Price</Label>
                        <Input id="price" type="" placeholder="Enter price"></Input>
                    </div>
                    <div className="grid w-full items-center gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="Enter description"></Textarea>
                    </div>
                    {(isLoading) ? (
                        <Button disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating program
                        </Button>
                    ) : (
                        <Button type="submit" className={buttonVariants({ variant: "systemBlue", size: "full"})}>
                            Create Program
                        </Button>
                    )}
                </form>
            </SheetContent>
        </Sheet>
    );
}
 
export default CreateProgramButton;