"use client";

import { WorkoutSchema } from "@/app/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import { createWorkout } from "@/server-actions/workout";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Tables } from "../../../../database.types";

const WorkoutForm = ({
    programId,
    week,
    day,
    setIsOpen,
    addWorkout
}: {
    programId: string,
    week: number,
    day: string
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

        // program id
        formData.append("programId", programId);

        // week number
        formData.append("week", week.toString());

        // day
        formData.append("day", day);
        
        // title
        if (data.title) {
            formData.append("title", data.title);
        }

        // description
        if (data.description) {
            formData.append("description", data.description);
        }

        // Create workout
        // let { data: workoutData, error: workoutError } = await createWorkout(formData);

        // if (workoutError && !workoutData) {
        //     console.log(workoutError);
        //     return
        // }

        // addWorkout(workoutData!);
        setIsOpen(false);
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
                    <Button type="submit" variant={isLoading ? "disabled" : "systemBlue"} size="full" className="mt-3" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? "Creating workout" : "Create Workout"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default WorkoutForm