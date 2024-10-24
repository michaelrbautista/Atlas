"use client";

import { TeamSchema } from '@/app/schema';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import { Dispatch, SetStateAction, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { createTeam, editTeam } from '@/server-actions/team';
import { useToast } from '../../ui/use-toast';
import { Tables } from '../../../../database.types';

const EditTeamForm = ({
    team,
    updateTeam,
    setIsOpen
}: {
    team: Tables<"teams">,
    updateTeam: (program: Tables<"teams">) => void,
    setIsOpen: Dispatch<SetStateAction<boolean>>
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const { toast } = useToast();

    const form = useForm<z.infer<typeof TeamSchema>>({
        resolver: zodResolver(TeamSchema),
        defaultValues: {
            image: new File([], ""),
            name: team.name,
            description: team.description ?? ""
        }
    })

    async function onSubmit(data: z.infer<typeof TeamSchema>) {
        setIsLoading(true);

        const formData = new FormData();
        
        if (data.image && data.image.size > 0) {
            formData.append("image", data.image);
        }

        if (data.name) {
            formData.append("name", data.name);
        }

        if (data.description) {
            formData.append("description", data.description);
        }

        let { data: teamData, error: teamError} = await editTeam(team, formData);

        if (teamError && !teamData) {
            toast({
                title: "An error occurred.",
                description: teamError
            })
            return
        }

        updateTeam(teamData!);
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
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        id="name"
                                        name="name"
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
                        {isLoading ? "Saving team" : "Save team"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
export default EditTeamForm