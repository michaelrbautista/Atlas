"use client";

import { NewExerciseSchema } from "@/app/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { editExercise } from "@/server-actions/exercise";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Tables } from "../../../../database.types";
import { useToast } from "../../ui/use-toast";

const EditExerciseForm = ({
    exercise,
    setIsOpen,
    updateLibraryExercise,
}: {
    exercise: Tables<"exercises">,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    updateLibraryExercise: (exercise: Tables<"exercises">) => void
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const { toast } = useToast();

    const form = useForm<z.infer<typeof NewExerciseSchema>>({
        resolver: zodResolver(NewExerciseSchema),
        defaultValues: {
            video: new File([], ""),
            title: exercise.title,
            instructions: exercise.instructions ?? ""
        }
    })

    async function onSubmit(data: z.infer<typeof NewExerciseSchema>) {
        setIsLoading(true);

        const formData = new FormData();

        if (data.video && data.video.size > 0) {
            formData.append("video", data.video);
        }

        // title
        if (data.title) {
            formData.append("title", data.title);
        }

        // description
        if (data.instructions) {
            formData.append("instructions", data.instructions);
        }

        // Create exercise
        let { data: exerciseData, error: exerciseError } = await editExercise(exercise, formData);

        if (exerciseError || !exerciseData) {
            toast({
                title: "An error occurred.",
                description: exerciseError
            })
            return
        }

        updateLibraryExercise(exerciseData);
        setIsOpen(false);
    }

    return (
        <Form {...form}>
            <form className="py-5" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-3">
                    <FormField
                        control={form.control}
                        name="video"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Replace Video</FormLabel>
                                <FormControl>
                                    <Input
                                        id="video"
                                        type="file"
                                        accept=".mp4"
                                        onChange={(event) => {
                                            field.onChange(event.target.files ? event.target.files[0] : null)
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                                        // placeholder="Enter title"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="instructions"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Instructions</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        id="instructions"
                                        name="instructions"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" variant={isLoading ? "disabled" : "systemBlue"} size="full" className="mt-3" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? "Saving Exercise" : "Save Exercise"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default EditExerciseForm