"use client";

import { ExistingExerciseSchema } from "@/app/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addExercise } from "@/server-actions/exercise";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Tables } from "../../../database.types";

const ExistingExerciseForm = ({
    exercise,
    workoutId,
    exerciseNumber,
    setIsOpen,
    addNewExercise
}: {
    exercise: Tables<"exercises">,
    workoutId: string,
    exerciseNumber: number,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    addNewExercise: (exercise: Tables<"workout_exercises">) => void
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof ExistingExerciseSchema>>({
        resolver: zodResolver(ExistingExerciseSchema),
        defaultValues: {
            sets: 1,
            reps: 1
        }
    })

    async function onSubmit(data: z.infer<typeof ExistingExerciseSchema>) {
        setIsLoading(true);

        const formData = new FormData();

        // workout id
        formData.append("workoutId", workoutId);

        // exercise id
        formData.append("exerciseId", exercise.id);

        // exercise number
        formData.append("exerciseNumber", exerciseNumber.toString());

        // title
        formData.append("title", exercise.title);

        if (data.sets) {
            formData.append("sets", data.sets.toString());
        }

        if (data.reps) {
            formData.append("reps", data.reps.toString());
        }

        let { data: resultData, error: resultError } = await addExercise(formData);

        if (resultError || !resultData) {
            console.log(resultError);
            return
        }

        addNewExercise(resultData);
        setIsOpen(false);
    }

    return (
        <Form {...form}>
            <form className="py-5" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-3">
                    <FormField
                        control={form.control}
                        name="sets"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sets</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        id="sets"
                                        name="sets"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="reps"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Reps</FormLabel>
                                <FormControl>
                                <Input
                                        {...field}
                                        id="reps"
                                        name="reps"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" variant={isLoading ? "disabled" : "systemBlue"} size="full" className="mt-3" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? "Adding exercise" : "Add exercise"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default ExistingExerciseForm