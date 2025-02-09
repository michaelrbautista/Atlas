"use client";

import { X } from "lucide-react";
import Image from "next/image"
import { useEffect, useState } from "react";
import Bowser from "bowser";

const MobileBanner = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [ua, setUa] = useState("");
    const [browser, setBrowser] = useState("");
    const [os, setOs] = useState("");
    const [platform, setPlatform] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const browserInfo = Bowser.getParser(window.navigator.userAgent);

            const uaString = browserInfo.getUA();
            const browserString = browserInfo.getBrowserName();
            const osString = browserInfo.getOSName();
            const platformString = browserInfo.getPlatformType();

            console.log(uaString);

            console.log(ua.includes("Instagram"));

            setUa(uaString);
            setBrowser(browserString);
            setOs(osString);
            setPlatform(platformString);
        }
    }, []);

    if (isOpen && ua.includes("Instagram")) {
        return (
            <div className="sticky top-0 z-50 flex flex-row sm:hidden w-full justify-between p-5">
                <div className="flex flex-row gap-2 items-center">
                    <X onClick={() => {setIsOpen(false)}} size={16} color="gray"/>
                    <Image
                        className="rounded-md border-[1px] border-systemGray4"
                        src="/icon.jpg"
                        width={40}
                        height={40}
                        alt="icon"
                    />
                    <div>
                        <p className="font-semibold">Atlas: Health and Fitness</p>
                        <p className="text-xs text-secondaryText">iOS app</p>
                        {/* <p>{ua}</p> */}
                    </div>
                </div>
                <div className="h-full flex items-center">
                    <a
                        className="px-4 py-2 rounded-full text-sm font-bold bg-systemBlue"
                        target="_blank"
                        href="https://apps.apple.com/us/app/atlas-health-and-fitness/id6484401731"
                        rel="noopener noreferrer"
                    >
                        Open
                    </a>
                </div>
            </div>
        )
    } else {
        return <></>
    }
}
export default MobileBanner