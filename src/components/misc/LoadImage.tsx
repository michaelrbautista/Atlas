"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

const LoadImage = ({
    alt,
    src,
    sizes,
    className,
    canSelect
}: {
    alt: string,
    src: string,
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
            objectFit="contain"
            sizes={sizes}
            className={cn(
                className,
                canSelect && "group-hover:opacity-75 duration-700 ease-in-out",
                isLoading
                    ? "grayscale blur-2xl scale-110"
                    : "grayscale-0 blur-0 scale-100"
            )}
            onLoadingComplete={() => {setIsLoading(false)}}
        />
    )
}
export default LoadImage