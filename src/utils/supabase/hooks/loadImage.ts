import { createClient } from "../client"

export const loadImage = (imageUrl: string, bucketName: string) => {
    const supabase = createClient();

    const { data: imageData } = supabase
        .storage
        .from(bucketName)
        .getPublicUrl(imageUrl)

    return imageData.publicUrl
}