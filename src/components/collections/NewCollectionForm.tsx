"use client";

import { CollectionSchema } from "@/app/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Tables } from "../../../database.types";
import { createCollection } from "@/server-actions/collection";
import { useToast } from "../ui/use-toast";

const NewCollectionForm = ({
    setIsOpen,
    addCollection
}: {
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    addCollection: (collection: Tables<"collections">) => void
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const { toast } = useToast();

    const form = useForm<z.infer<typeof CollectionSchema>>({
        resolver: zodResolver(CollectionSchema),
        defaultValues: {
            title: "",
            description: ""
        }
    })

    async function onSubmit(data: z.infer<typeof CollectionSchema>) {
        setIsLoading(true);

        const formData = new FormData();

        // title
        if (data.title) {
            formData.append("title", data.title);
        }

        // description
        if (data.description) {
            formData.append("description", data.description);
        }

        // Create collection
        let { data: collectionData, error: collectionError } = await createCollection(formData);

        if (collectionError && !collectionData) {
            toast({
                title: "An error occurred.",
                description: collectionError
            })
            return
        }

        setIsOpen(false);
        addCollection(collectionData!);
    }

    return (
        <Form {...form}>
            <form className="py-5" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-3">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        id="title"
                                        name="title"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        id="description"
                                        name="description"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end w-full">
                        <Button type="submit" variant={isLoading ? "disabled" : "systemBlue"} className="mt-3" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {!isLoading && "Save collection"}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export default NewCollectionForm