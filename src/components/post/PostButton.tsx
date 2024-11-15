"use client";

import { redirectToNewPost } from "@/server-actions/post";
import { Button } from "../ui/button"

const PostButton = () => {

    const redirectToNewPostClient = async () => {
        redirectToNewPost();
    }

    return (
        <Button onClick={redirectToNewPostClient} variant="systemBlue" size="full">
            New Post
        </Button>
    )
}
export default PostButton