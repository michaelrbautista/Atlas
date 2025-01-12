"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Button } from "../../ui/button";
import { useEffect, useState } from 'react';
import { Loader2, Pencil } from 'lucide-react';

import { useToast } from '../../ui/use-toast';
import { Tables } from '../../../../database.types';
import { UserSchema } from "@/app/schema";
import { editUser, redirectToProfile } from "@/server-actions/user";
import Image from "next/image";
import { Label } from "../../ui/label";

const EditProfileForm = ({
    user
}: {
    user: Tables<"users">
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(user.profile_picture_url ?? "");

    useEffect(() => {
        console.log(imagePreview);
    }, [imagePreview]);

    const { toast } = useToast();

    const form = useForm<z.infer<typeof UserSchema>>({
        resolver: zodResolver(UserSchema),
        defaultValues: {
            profilePicture: new File([], ""),
            fullName: user.full_name,
            username: user.username,
            bio: user.bio ?? ""
        }
    })

    async function onSubmit(data: z.infer<typeof UserSchema>) {
        setIsLoading(true);

        const formData = new FormData();
        
        if (data.profilePicture && data.profilePicture.size > 0) {
            formData.append("profilePicture", data.profilePicture);
        }

        if (data.fullName) {
            formData.append("fullName", data.fullName);
        }

        if (data.username) {
            formData.append("username", data.username);
        }

        if (data.bio) {
            formData.append("bio", data.bio);
        }

        // Edit user
        let { data: userData, error: userError} = await editUser(user, formData);

        if (userError && !userData) {
            toast({
                title: "An error occurred.",
                description: userError
            })
            setIsLoading(false);
            return
        }

        // Redirect back to profile
        if (userData) {
            redirectToProfile(userData.username);
        }
    }

    return (
        <Form {...form}>
            <form className="py-5" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-3">
                    <FormField
                        control={form.control}
                        name="profilePicture"
                        render={({ field }) => (
                            <FormItem className="w-28 h-28 rounded-full bg-slate-700">
                                <Label className="w-28 h-28 rounded-full">
                                    <input
                                        type="file"
                                        id="formImage"
                                        accept=".jpg, .jpeg, .png"
                                        onChange={(event) => {
                                            const reader = new FileReader();
                                            try {
                                                reader.onload = () => setImagePreview(reader.result);
                                                if (event.target.files) {
                                                    reader.readAsDataURL(event.target.files[0]);
                                                    form.setValue("profilePicture", event.target.files[0]);
                                                    form.clearErrors("profilePicture");
                                                }
                                            } catch (error) {
                                                if (!imagePreview) {
                                                    setImagePreview(null);
                                                    form.resetField("profilePicture");
                                                }
                                            }
                                        }}
                                        hidden
                                    />
                                    {imagePreview ? (
                                        <Image
                                            className="h-28 w-28 rounded-full cursor-pointer"
                                            height={112}
                                            width={112}
                                            src={imagePreview as string}
                                            alt="programImage"
                                            style={{objectFit: "cover"}}
                                            priority
                                        />
                                    ) : (
                                        <div className="bg-systemGray5 shrink-0 h-28 w-28 rounded-full flex items-center justify-center cursor-pointer">
                                            <Pencil className="text-secondaryText" />
                                        </div>
                                    )}
                                </Label>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        id="fullName"
                                        name="fullName"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        id="username"
                                        name="username"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        id="bio"
                                        name="bio"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" variant={isLoading ? "disabled" : "systemBlue"} size="full" className="mt-3" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {!isLoading && "Save"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
export default EditProfileForm