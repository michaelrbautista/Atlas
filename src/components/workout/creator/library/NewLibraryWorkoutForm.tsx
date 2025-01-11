"use client";

import { WorkoutSchema } from "@/app/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createLibraryWorkout } from "@/server-actions/workout";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Tables } from "../../../../../database.types";

const NewLibraryWorkoutForm = ({
    setIsOpen,
    addWorkout
}: {
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    addWorkout: (workout: Tables<"workouts">) => void
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof WorkoutSchema>>({
        resolver: zodResolver(WorkoutSchema),
        defaultValues: {
            title: "",
            description: ""
        }
    })

    async function onSubmit(data: z.infer<typeof WorkoutSchema>) {
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

        // Create workout
        let { data: workoutData, error: workoutError } = await createLibraryWorkout(formData);

        if (workoutError && !workoutData) {
            console.log(workoutError);
            return
        }

        setIsOpen(false);
        addWorkout(workoutData!);
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
                    <p className="text-secondaryText text-sm">Exercises can be added after creating the workout.</p>
                    <div className="flex justify-end w-full">
                        <Button type="submit" variant={isLoading ? "disabled" : "systemBlue"} className="mt-3" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? "Creating workout" : "Save workout"}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export default NewLibraryWorkoutForm