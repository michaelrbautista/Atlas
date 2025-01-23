"use client"

import BulletList from "@tiptap/extension-bullet-list"
import Heading from "@tiptap/extension-heading"
import ListItem from "@tiptap/extension-list-item"
import Placeholder from "@tiptap/extension-placeholder"
import OrderedList from "@tiptap/extension-ordered-list"
import { useEditor, EditorContent, mergeAttributes } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"

const ViewContent = ({
    content
}: {
    content: string
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
        content: JSON.parse(content),
        editable: false,
        editorProps: {
            attributes: {
                spellcheck: "false",
                class: ""
            },
        },
        immediatelyRender: false
    })

    return (
        <EditorContent editor={editor} className="" />
    )
}
export default ViewContent