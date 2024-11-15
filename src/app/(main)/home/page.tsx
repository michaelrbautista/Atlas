import PostList from "@/components/post/PostList";
import { getAllPosts } from "@/server-actions/post";

const Home = async () => {
    return (
        <div className="h-full w-full max-w-xl px-5 sm:py-10">
            <div className="flex justify-between items-center pb-5">
                <p className="text-foreground text-3xl font-bold">Home</p>
            </div>
            <PostList />
        </div>
    );
}

export default Home;