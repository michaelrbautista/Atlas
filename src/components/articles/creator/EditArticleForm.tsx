"use client";

import { ArticleSchema } from '@/app/schema';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import { Dispatch, SetStateAction, useState } from 'react';
import { Loader2, TriangleAlert } from 'lucide-react';
import { createProgram } from '@/server-actions/program';
import { Tables } from '../../../../database.types';
import { useToast } from '../../ui/use-toast';
import { Switch } from '../../ui/switch';
import { editArticle, publishArticle, redirectToArticle, saveArticleImage } from '@/server-actions/articles';
import { JSONContent } from '@tiptap/react';
import { FetchedArticle, TipTapNode } from '@/server-actions/models';
import { createClient } from '@/utils/supabase/client';

const EditArticleForm = ({
    article,
    content
}: {
    article: FetchedArticle,
    content: JSONContent
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const { toast } = useToast();

    const form = useForm<z.infer<typeof ArticleSchema>>({
        resolver: zodResolver(ArticleSchema),
        defaultValues: {
            title: article.title,
            content: article.content,
            free: article.free
        }
    })

    async function onSubmit(data: z.infer<typeof ArticleSchema>) {
        // setIsLoading(true);

        const formData = new FormData();

        formData.append("collectionId", article.collection_id);

        if (data.image && data.image.size > 0) {
            formData.append("image", data.image);
        }
        
        if (data.title) {
            formData.append("title", data.title);
        }

        formData.append("free", data.free.toString());

        // 1. Create array of old images
        const articleContent = JSON.parse(article.content) as JSONContent;
        const oldNodes = articleContent.content as TipTapNode[];

        const oldImages: string[] = [];

        for (let node of oldNodes) {
            if (node.type == "image" && node.attrs?.src) {
                oldImages.push(node.attrs.src);
            }
        }

        // 2. Create array of new images
        const newNodes = content.content as TipTapNode[];

        const newImages: string[] = [];
        const imagesToAdd: string[] = [];
        const imagesToKeep: string[] = [];

        // 3. Create array of images to remove, add, and keep
        for (let node of newNodes) {
            if (node.type == "image" && node.attrs?.src) {
                newImages.push(node.attrs.src);

                if (node.attrs.src.substring(0,4) == "blob") {
                    imagesToAdd.push(node.attrs.src);
                } else {
                    imagesToKeep.push(node.attrs.src);
                }
            }
        }

        let imagesToRemove = oldImages.filter((x) => !newImages.includes(x));

        let removePaths = imagesToRemove.map((src) => {
            const splitSrc = src.split("/");
            const imagePath = `${splitSrc[splitSrc.length - 2]}/${splitSrc[splitSrc.length - 1]}`;
            
            return imagePath
        })

        console.log("New images: ", newImages);
        console.log("Images to add: ", imagesToAdd);
        console.log("Images to keep: ", imagesToKeep);
        console.log("Images to remove: ", removePaths);

        // 4. Remove images
        const supabase = createClient();

        if (removePaths.length > 0) {
            const { error } = await supabase
            .storage
            .from("article_images")
            .remove(removePaths)

            if (error) {
                return {
                    error: "Couldn't delete article images."
                }
            }
        }

        // 5. Add new images
        const updatedNodes: TipTapNode[] = [];

        for (let node of newNodes) {
            if (node.type == "image" && node.attrs?.src) {
                if (node.attrs.src.startsWith("blob")) {
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

        // 6. Update database
        let { data: articleData, error: articleError } = await editArticle(article, formData);

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
                        <p className="text-foreground text-3xl font-bold">Edit Article</p>
                        <Button type="submit" variant={isLoading ? "disabled" : "systemBlue"} size="sm" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {!isLoading && "Save"}
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

export default EditArticleForm