import Tiptap from "@/components/tiptap/Tiptap";

const NewArticle = async ({
    searchParams
} : {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
    const {
        collection = ""
    } = await searchParams

    return (
        <div className="h-full w-full max-w-xl px-5 sm:py-10">
            <Tiptap
                collection={collection}
            />
        </div>
    )
}



export default NewArticle
