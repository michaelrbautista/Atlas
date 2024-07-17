import Image from "next/image";
import Link from "next/link";

interface ProgramProps {
    title: string;
    creator: string;
}

const Program = ({ title, creator }: ProgramProps) => {
    return (
        <Link href="/program/123" className="bg-systemGray4 flex flex-col flex-auto rounded-xl">
            <h1 className="bg-slate-300 h-52 rounded-t-xl"></h1>
            <div className="flex flex-col p-3">
                <h1 className="text-primaryText font-bold text-xl">{title}</h1>
                <h1 className="text-secondaryText font-medium text-md">{creator}</h1>
            </div>
        </Link>
    )
};

export default Program;