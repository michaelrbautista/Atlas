"use client";

import CreateProgramButton from "../../../components/program/CreateProgramButton";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { redirectToHome } from "@/server-actions/creator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { Tables } from "../../../../database.types";
import { Dumbbell, Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import EditProgramForm from "@/components/program/EditProgramForm";
import Image from "next/image";
import { Rethink_Sans } from "next/font/google";
import EditProgramButton from "@/components/program/EditProgramButton";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import SignInForm from "@/components/auth/SignInForm";
import { deleteProgram } from "@/server-actions/program";
import ProgramOptions from "@/components/program/ProgramOptions";

const MyPrograms = () => {
    const [programs, setPrograms] = useState<Tables<"programs">[]>([]);

    useEffect(() => {
        const getTeamPrograms = async () => {
            const supabase = createClient();

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                console.log("Couldn't get current user.");
                return
            }

            const { data: userData, error: userError } = await supabase
                .from("users")
                .select()
                .eq("id", user.id)
                .single()

            if (userError && !userData) {
                console.log(userError);
                return
            }

            if (!userData.team_id) {
                console.log("User has not created a team yet.");
                redirectToHome();
                return
            }

            const { data, error } = await supabase
                .from("programs")
                .select()
                .eq("team_id", userData.team_id)
                .order("created_at", { ascending: false })

            if (data && !error) {
                setPrograms(data);
            } else {
                console.log("Couldnt get team's programs.");
            }
        }

        getTeamPrograms();
    }, []);

    const addProgram = (program: Tables<"programs">) => {
        const newPrograms = [program, ...programs];
        setPrograms(newPrograms);
    }

    const updateProgram = (updatedProgram: Tables<"programs">) => {
        setPrograms(programs.map(program => program.id === updatedProgram.id ? updatedProgram : program));
    }

    const deleteProgramClient = (programId: string) => {
        deleteProgram(programId);

        setPrograms(programs => programs.filter(program => program.id !== programId));
    }

    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    });

    return (
        <div className="h-full w-full px-5 py-20 sm:py-10">
            <div className="flex justify-between items-center pb-5">
                <p className="text-foreground text-2xl sm:text-2xl font-bold">My Programs</p>
                <CreateProgramButton addProgram={addProgram}></CreateProgramButton>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Weeks</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead />
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {programs.map((program, index) => {
                        return (
                            <TableRow key={program.id}>
                                <TableCell>
                                {(!program.image_url || program.image_url == "") ? (
                                    // Replace with placeholder image
                                    <div className="bg-systemGray5 shrink-0 h-[60px] w-[100px] rounded-xl flex items-center justify-center">
                                        <Dumbbell className="text-secondaryText" />
                                    </div>
                                ) : (
                                    <Image
                                        className="h-[60px] w-[100px] rounded-md"
                                        height={60}
                                        width={100}
                                        src={program.image_url}
                                        alt="programImage"
                                        style={{objectFit: "cover"}}
                                        priority
                                    />
                                )}
                                </TableCell>
                                <TableCell>{program.title}</TableCell>
                                <TableCell>{program.description}</TableCell>
                                <TableCell>{program.weeks}</TableCell>
                                <TableCell>{formatter.format(program.price)}</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link
                                            href={`/creator/program/${program.id}`}
                                            className="cursor-pointer"
                                        >
                                            View
                                        </Link>
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <ProgramOptions
                                        program={program}
                                        programIndex={index}
                                        updateProgram={updateProgram}
                                        deleteProgramClient={deleteProgramClient}
                                    />
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
 
export default MyPrograms;