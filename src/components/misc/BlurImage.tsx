"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

const BlurImage = ({
    alt,
    src,
    contentMode,
    sizes,
    className,
    canSelect
}: {
    alt: string,
    src: string,
    contentMode: "contain" | "cover",
    sizes: string,
    className: string,
    canSelect: boolean
}) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Image
            alt={alt}
            src={src}
            fill
            style={{objectFit: contentMode}}
            sizes={sizes}
            priority
            className={cn(
                className,
                canSelect && "group-hover:opacity-75 duration-700 ease-in-out",
                isLoading
                    ? "grayscale blur-2xl scale-110"
                    : "grayscale-0 blur-0 scale-100"
            )}
            onLoad={() => {setIsLoading(false)}}
        />
    )
}
export default BlurImage