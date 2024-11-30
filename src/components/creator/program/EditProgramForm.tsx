"use client";

import { ProgramSchema } from '@/app/schema';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import { Dispatch, SetStateAction, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { editProgram } from '@/server-actions/program';
import { Tables } from '../../../../database.types';
import { useToast } from '../../ui/use-toast';
import { Separator } from '../../ui/separator';
import { Switch } from '../../ui/switch';

const EditProgramForm = ({
    program,
    updateProgram,
    setIsOpen
}: {
    program: Tables<"programs">,
    updateProgram: (program: Tables<"programs">) => void
    setIsOpen: Dispatch<SetStateAction<boolean>>
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const { toast } = useToast();

    const form = useForm<z.infer<typeof ProgramSchema>>({
        resolver: zodResolver(ProgramSchema),
        defaultValues: {
            image: new File([], ""),
            title: program.title,
            description: program.description ?? "",
            weeks: program.weeks,
            free: program.free,
            price: program.price,
            private: program.private
        }
    })

    async function onSubmit(data: z.infer<typeof ProgramSchema>) {
        setIsLoading(true);

        const formData = new FormData();
        
        if (data.image && data.image.size > 0) {
            formData.append("image", data.image);
        }

        if (data.title) {
            formData.append("title", data.title);
        }

        if (data.weeks) {
            formData.append("weeks", data.weeks.toString());
        }

        if (data.description) {
            formData.append("description", data.description);
        }

        formData.append("free", data.free.toString());

        if (data.price) {
            formData.append("price", data.price.toString());
        }

        let { data: programData, error: programError } = await editProgram(program, formData);

        if (programError && !programData) {
            toast({
                title: "An error occurred.",
                description: programError
            })
            return
        }

        updateProgram(programData!);
        setIsOpen(false);
    }

    return (
        <Form {...form}>
            <form className="py-5" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-3">
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Replace Image</FormLabel>
                                <FormControl>
                                    <Input
                                        id="image"
                                        type="file"
                                        accept=".jpg, .jpeg, .png"
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
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="weeks"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Number of weeks</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        id="weeks"
                                        name="weeks"
                                        type="number"
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
                    <FormField
                        control={form.control}
                        name="free"
                        render={({ field }) => (
                            <FormItem className="flex flex-row justify-between items-center rounded-lg border p-4 pt-2">
                                <FormLabel className="mt-2">Free</FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className={form.getValues("free") ? "text-secondaryText" : ""}>Price ($)</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        id="price"
                                        name="price"
                                        type="number"
                                        step={0.01}
                                        disabled={form.getValues("free")}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="private"
                        render={({ field }) => (
                            <FormItem className="flex flex-row justify-between items-center rounded-lg border p-4 pt-2">
                                <FormLabel className="mt-2">Private</FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" variant={isLoading ? "disabled" : "systemBlue"} size="full" className="mt-3" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? "Saving program" : "Save Program"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default EditProgramForm