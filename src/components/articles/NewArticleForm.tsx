"use client";

import { ArticleSchema } from '@/app/schema';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Dispatch, SetStateAction, useState } from 'react';
import { Loader2, TriangleAlert } from 'lucide-react';
import { createProgram } from '@/server-actions/program';
import { Tables } from '../../../database.types';
import { useToast } from '../ui/use-toast';
import { Switch } from '../ui/switch';
import { publishArticle, redirectToArticle, saveArticleImage } from '@/server-actions/articles';
import { JSONContent } from '@tiptap/react';
import { TipTapNode } from '@/server-actions/models';

const NewArticleForm = ({
    collectionId,
    content
}: {
    collectionId: string,
    content: JSONContent
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const { toast } = useToast();

    const form = useForm<z.infer<typeof ArticleSchema>>({
        resolver: zodResolver(ArticleSchema),
        defaultValues: {
            title: "",
            content: ""
        }
    })

    async function onSubmit(data: z.infer<typeof ArticleSchema>) {
        setIsLoading(true);

        const formData = new FormData();

        formData.append("collectionId", collectionId);

        if (data.image && data.image.size > 0) {
            formData.append("image", data.image);
        }
        
        if (data.title) {
            formData.append("title", data.title);
        }

        formData.append("free", data.free.toString());

        if (!content.content) {
            toast({
                title: "An error occurred.",
                description: "There was an error publishing the article."
            })
            return
        }

        const formattedNodes = content.content as TipTapNode[];

        const updatedNodes: TipTapNode[] = [];
        for (let node of formattedNodes) {
            if (node.type == "image" && node.attrs?.src) {
                const response = await fetch(node.attrs.src);
                const blob = await response.blob();

                const fileType = blob.type || "image/jpeg";

                const image = new File([blob], `articleImage.${fileType.split("/").pop()}`, { type: fileType });

                const imageFormData = new FormData();
                if (image.size > 0) {
                    imageFormData.append("image", image);
                    imageFormData.append("fileType", fileType);
                }

                let { data: imageData, error: imageError } = await saveArticleImage(imageFormData);

                if (imageError && !imageData) {
                    toast({
                        title: "An error occurred.",
                        description: imageError
                    })
                    return
                }

                const newNode = {
                    type: "image",
                    attrs: {
                        src: imageData
                    }
                } as TipTapNode;

                updatedNodes.push(newNode);
            } else {
                updatedNodes.push(node);
            }
        }

        // Add content to formData
        const newContent = {
            type: "doc",
            content: updatedNodes
        }

        formData.append("content", JSON.stringify(newContent));

        // 4. Upload article to supabase table
        let { data: articleData, error: articleError } = await publishArticle(formData);

        if (articleError && !articleData) {
            toast({
                title: "An error occurred.",
                description: articleError
            })
            return
        }

        redirectToArticle(articleData!.id);
    }

    return (
        <Form {...form}>
            <form className="py-5" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center pb-5">
                        <p className="text-foreground text-3xl font-bold">New Article</p>
                        <Button type="submit" variant={isLoading ? "disabled" : "systemBlue"} size="sm" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {!isLoading && "Publish"}
                        </Button>
                    </div>
                    <Alert>
                        <TriangleAlert className="h-4 w-4" />
                        <AlertTitle hidden></AlertTitle>
                        <AlertDescription>
                            Drafts aren't saved, so we recommend you write articles externally then copy them here.
                        </AlertDescription>
                    </Alert>
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
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cover Image</FormLabel>
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
                </div>
            </form>
        </Form>
    )
}

export default NewArticleForm