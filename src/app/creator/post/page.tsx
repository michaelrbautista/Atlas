import PostForm from "@/components/post/PostForm"

const page = () => {
    return (
        <div className="h-full w-full max-w-xl px-5 sm:py-10">
            <div className="flex justify-between items-center pb-5">
                <p className="text-foreground text-3xl font-bold">New Post</p>
            </div>
            <PostForm />
        </div>
    )
}
export default page