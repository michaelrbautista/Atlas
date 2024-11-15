"use client";

import { PostSchema } from '@/app/schema';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import { createPost } from '@/server-actions/post';
import AddWorkoutToPostButton from './AddWorkoutToPostButton';
import AddProgramToPostButton from './AddProgramToPostButton';
import { Tables } from '../../../database.types';
import PostProgram from './PostProgram';
import PostWorkout from './PostWorkout';

const PostForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [program, setProgram] = useState<Tables<"programs"> | null>(null);
    const [workout, setWorkout] = useState<Tables<"workouts"> | null>(null);

    const { toast } = useToast();

    const form = useForm<z.infer<typeof PostSchema>>({
        resolver: zodResolver(PostSchema),
        defaultValues: {
            text: ""
        }
    })

    async function onSubmit(data: z.infer<typeof PostSchema>) {
        setIsLoading(true);

        const formData = new FormData();
        
        if (data.text) {
            formData.append("text", data.text);
        }

        if (program) {
            formData.append("programId", program.id);
        }

        if (workout) {
            formData.append("workoutId", workout.id);
        }

        const error = await createPost(formData);

        if (error) {
            toast({
                title: "An error occurred.",
                description: error.error
            })
            return
        }
    }

    return (
        <Form {...form}>
            <form className="py-5" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-3">
                    <FormField
                        control={form.control}
                        name="text"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Text</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        id="text"
                                        name="text"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {!program && !workout && (
                        <div>
                            <AddWorkoutToPostButton setWorkout={setWorkout} />
                            <AddProgramToPostButton setProgram={setProgram} />
                        </div>
                    )}
                    {program && (
                        <div className="flex flex-col gap-3 pt-2">
                            <PostProgram program={program} />
                            <Button onClick={() => {setProgram(null)}} variant="secondary" size="full">Remove program</Button>
                        </div>
                    )}
                    {workout && (
                        <div className="flex flex-col gap-3 pt-2">
                            <PostWorkout workout={workout} />
                            <Button onClick={() => {setWorkout(null)}} variant="secondary" size="full">Remove workout</Button>
                        </div>
                    )}
                    <Button
                        type="submit"
                        variant={isLoading || form.getValues("text") == "" ? "disabled" : "systemBlue"}
                        size="full"
                        className="mt-3"
                        disabled={isLoading || form.getValues("text") == ""}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {!isLoading && "Post"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default PostForm