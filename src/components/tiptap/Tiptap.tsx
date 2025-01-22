"use client"

import BulletList from "@tiptap/extension-bullet-list"
import Heading from "@tiptap/extension-heading"
import ListItem from "@tiptap/extension-list-item"
import Placeholder from "@tiptap/extension-placeholder"
import OrderedList from "@tiptap/extension-ordered-list"
import Image from "@tiptap/extension-image"
import { useEditor, EditorContent, Editor, mergeAttributes } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import NewArticleForm from "../articles/NewArticleForm"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { Dispatch, SetStateAction, useRef, useState } from "react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { cn } from "@/lib/utils"
import { useToast } from "../ui/use-toast"

const Tiptap = ({
    collection
}: {
    collection: string
}) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                listItem: false,
                heading: false,
                bulletList: false,
                orderedList: false
            }),
            ListItem,
            Placeholder.configure({
                emptyEditorClass: "before:content-[attr(data-placeholder)] before:float-left before:text-systemGray2 before:h-0 before:pointer-events-none",
                placeholder: "Start writing...",
            }),
            Heading.extend({
                levels: [1, 2, 3],
                renderHTML({ node, HTMLAttributes }) {
                    const level = this.options.levels.includes(node.attrs.level)
                        ? node.attrs.level
                        : this.options.levels[0];
                    const classes: { [index: number]: string } = {
                        1: "text-3xl font-bold",
                        2: "text-2xl font-bold",
                        3: "text-xl font-bold",
                    };
                    return [
                        `h${level}`,
                        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                            class: `${classes[level]}`,
                        }),
                        0,
                    ];
                },
            }).configure({ levels: [1, 2, 3] }),
            BulletList.configure({
                HTMLAttributes: {
                    class: "list-disc ml-2",
                },
            }),
            OrderedList.configure({
                HTMLAttributes: {
                    class: "list-decimal ml-2",
                },
            }),
            Image.extend({
                addOptions() {
                    return {
                        HTMLAttributes: {
                            class: "block h-auto my-5 max-w-full rounded-lg",
                        }
                    }
                },
            })
        ],
        content: "",
        editorProps: {
            attributes: {
                spellcheck: "false",
                class: "p-4 min-h-[800px] rounded-lg border-[1px]"
            },
        },
        immediatelyRender: false,
    })

    if (!editor) {
        return (
            <></>
        )
    } else {
        return (
            <div className="flex flex-col gap-5">
                <NewArticleForm
                    collectionId={collection}
                    content={editor.getJSON()}
                />
                <div className="flex flex-col gap-2">
                    <h1 className="text-sm font-medium">Content</h1>
                    <MenuBar
                        editor={editor}
                    />
                    <EditorContent editor={editor}/>
                </div>
            </div>
        )
    }
}

const MenuBar = ({
    editor,
}: {
    editor: Editor | null,
}) => {
    const { toast } = useToast();

    const imageRef = useRef<HTMLInputElement>(null)

    if (!editor) {
        return null
    }

    const defaultButton = "px-2 py-1 mr-2 mb-2 rounded-md bg-systemGray5 text-base font-normal text-systemGray"
    const activeButton = "px-2 py-1 mr-2 mb-2 rounded-md bg-systemGray3 font-normal text-base"

    return (
        <div className="">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? activeButton : defaultButton}
            >
                Bold
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? activeButton : defaultButton}
            >
                Italic
            </button>
            <button
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={editor.isActive('paragraph') ? activeButton : defaultButton}
            >
                Paragraph
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={editor.isActive('heading', { level: 1 }) ? activeButton : defaultButton}
            >
                H1
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive('heading', { level: 2 }) ? activeButton : defaultButton}
            >
                H2
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={editor.isActive('heading', { level: 3 }) ? activeButton : defaultButton}
            >
                H3
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? activeButton : defaultButton}
            >
                Bullet list
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? activeButton : defaultButton}
            >
                Ordered list
            </button>
            <button
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className={defaultButton}
            >
                Separator
            </button>
            <Label>
                <input
                    type="file"
                    id="formImage"
                    ref={imageRef}
                    accept=".jpg, .jpeg, .png"
                    onChange={(event) => {
                        if (event.target.files && event.target.files[0]) {
                            editor.chain().focus().setImage({ src: URL.createObjectURL(event.target.files[0]) }).run();
                            event.target.value = "";
                        }
                    }}
                    hidden
                />
                <p className={cn(defaultButton, "inline-block cursor-pointer")}>Add image</p>
            </Label>
        </div>
    )
}

export default Tiptap