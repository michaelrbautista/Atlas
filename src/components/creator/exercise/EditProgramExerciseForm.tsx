"use client";

import { ExistingExerciseSchema } from "@/app/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { editProgramExercise } from "@/server-actions/exercise";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "../../ui/use-toast";
import { FetchedExercise } from "@/server-actions/fetch-types";

const EditProgramExerciseForm = ({
    programExercise,
    setIsOpen,
    updateProgramExercise
}: {
    programExercise: FetchedExercise,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    updateProgramExercise: (exercise: FetchedExercise, exerciseNumber: number) => void
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const { toast } = useToast();

    const form = useForm<z.infer<typeof ExistingExerciseSchema>>({
        resolver: zodResolver(ExistingExerciseSchema),
        defaultValues: {
            sets: programExercise.sets ?? 1,
            reps: programExercise.reps ?? 1
        }
    })

    async function onSubmit(data: z.infer<typeof ExistingExerciseSchema>) {
        setIsLoading(true);

        const formData = new FormData();

        if (data.sets) {
            formData.append("sets", data.sets.toString());
        }

        if (data.reps) {
            formData.append("reps", data.reps.toString());
        }

        let { data: resultData, error: resultError } = await editProgramExercise(programExercise, formData);

        if (resultError || !resultData) {
            toast({
                title: "An error occurred.",
                description: resultError
            })
            return
        }
        
        updateProgramExercise(resultData, programExercise.exercise_number);
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
                        {isLoading ? "Saving exercise" : "Save exercise"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default EditProgramExerciseForm