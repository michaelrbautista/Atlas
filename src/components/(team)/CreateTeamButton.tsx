"use client";

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { createTeam } from "@/server-actions/team";
import { Loader2 } from "lucide-react";
import { useViewContext } from "@/context";
import { TeamSchema } from "@/app/schema";

const CreateTeamButton = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState("");

    const context = useViewContext();

    const createTeamSubmit = async (formData: FormData) => {
        setIsLoading(true);

        // Get image
        // const imageElement = document.getElementById("image") as HTMLInputElement;
        // const elementFiles = imageElement.files;

        // if (!elementFiles) {
        //     console.log("Couldn't get input element files.");
        //     return
        // }

        // const image = elementFiles[0];

        // const formData = new FormData(event.currentTarget);
        // formData.set("image", image);

        // if (!imageElement) {
        //     console.log("Couldn't get image element")
        //     return
        // }

        const newTeam = {
            name: formData.get("name"),
            description: formData.get("description")
        }

        const result = TeamSchema.safeParse(newTeam);
        if (!result.success) {
            let errorMessage = "";

            result.error.issues.forEach((issue) => {
                errorMessage = errorMessage + issue.path[0] + ": " + issue.message + ". ";
            })

            setError(errorMessage);
            setIsLoading(false);
            return
        }

        let error = await createTeam(formData);

        if (error) {
            console.log(error);
            setIsLoading(false);
            return
        }

        context.setView("creator");

        setIsLoading(false);
        setIsOpen(false);
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="hidden sm:flex" asChild>
                <Button className={buttonVariants({ variant: "systemBlue", size: "sm"})}>Create Team</Button>
            </SheetTrigger>
            <SheetTitle hidden></SheetTitle>
            <SheetDescription hidden></SheetDescription>
            <SheetContent side="right" className="p-0 border-0 w-96 bg-systemGray6 flex flex-col justify-between">
                <form action={createTeamSubmit} className="flex flex-col gap-5 pt-20 px-5">
                    <div className="grid w-full max-w-sm items-center gap-2">
                        <Label htmlFor="image">Team Image</Label>
                        <Input id="image" name="image" type="file" accept=".jpg, .jpeg, .png"/>
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-2">
                        <Label htmlFor="name">Team Name</Label>
                        <Input id="name" name="name" placeholder="Enter name"></Input>
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-2">
                        <Label htmlFor="description">Team Description</Label>
                        <Textarea id="description" name="description" placeholder="Enter description"></Textarea>
                    </div>
                    {(isLoading) ? (
                        <Button className={buttonVariants({ size: "full"})} disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating team
                        </Button>
                    ) : (
                        <Button type="submit" className={buttonVariants({ variant: "systemBlue", size: "full"})}>
                            Create Team
                        </Button>
                    )}
                    {(error !== "") && (
                        <p className="text-primaryText text-sm">{error}</p>
                    )}
                </form>
            </SheetContent>
        </Sheet>
    );
}
 
export default CreateTeamButton;