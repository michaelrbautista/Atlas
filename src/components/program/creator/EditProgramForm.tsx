"use client";

import { ProgramSchema } from '@/app/schema';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import { memo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { editProgram, redirectToProgram } from '@/server-actions/program';
import { Tables } from '../../../../database.types';
import { useToast } from '../../ui/use-toast';
import { Switch } from '../../ui/switch';

const EditProgramForm = ({ 
    program
}: {
    program: Tables<"programs">
}) => {
    const [isSaving, setIsSaving] = useState(false);

    const { toast } = useToast();

    const form = useForm<z.infer<typeof ProgramSchema>>({
        resolver: zodResolver(ProgramSchema),
        defaultValues: {
            image: new File([], ""),
            title: program ? program.title : "",
            description: program?.description ? program.description : "",
            weeks: program ? program.weeks : 0,
            free: program ? program.free : false,
            paidSubscribersOnly: !program?.price,
            price: program?.price ? program.price : 0,
            private: program ? program.private : false
        }
    })

    async function onSubmit(data: z.infer<typeof ProgramSchema>) {
        setIsSaving(true);

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

        if (!program) {
            console.log("Couldn't get program.")
            return
        }

        let { data: programData, error: programError } = await editProgram(program, formData);

        if (programError && !programData) {
            toast({
                title: "An error occurred.",
                description: programError
            })
            return
        }

        // Redirect to new program
        if (programData) {
            redirectToProgram(programData.id);
        }
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
                    name="paidSubscribersOnly"
                    render={({ field }) => (
                        <FormItem className="flex flex-row justify-between items-center rounded-lg border p-4 pt-2">
                            <FormLabel className="mt-2">Subscribers only</FormLabel>
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
                            <FormLabel className={(form.getValues("free") || form.getValues("paidSubscribersOnly")) ? "text-secondaryText" : ""}>One-time payment price ($)</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    id="price"
                                    name="price"
                                    type="number"
                                    step={0.01}
                                    disabled={(form.getValues("free") || form.getValues("paidSubscribersOnly"))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                    <Button type="submit" variant={isSaving ? "disabled" : "systemBlue"} size="full" className="mt-3" disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {!isSaving && "Save program"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default memo(EditProgramForm)