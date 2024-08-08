import Image from "next/image";

const Logo = () => {
    return ( 
        <div className="flex flex-row items-center gap-4 p-5">
            <Image className="rounded-md border-[1px] border-systemGray4" src="/icon.jpg" width={40} height={40} alt="icon"></Image>
            <div className="text-primaryText font-bold text-2xl">
                Atlas
            </div>
        </div>
    );
}
    
export default Logo;  
