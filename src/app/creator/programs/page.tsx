"use client";

import CreateProgramButton from "../../../components/program/Buttons/CreateProgramButton";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Tables } from "../../../../database.types";
import { Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { deleteProgram } from "@/server-actions/program";
import ProgramOptions from "@/components/program/ProgramOptions";
import { useToast } from "@/components/ui/use-toast";

const MyPrograms = () => {
    const [programs, setPrograms] = useState<Tables<"programs">[]>([]);
    
    const { toast } = useToast();

    useEffect(() => {
        const getTeamPrograms = async () => {
            const supabase = createClient();

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast({
                    title: "An error occurred.",
                    description: "Couldn't get the current user."
                })
                return
            }

            const { data, error } = await supabase
                .from("programs")
                .select()
                .eq("created_by", user.id)
                .order("created_at", { ascending: false })

            if (data && !error) {
                setPrograms(data);
            } else {
                toast({
                    title: "An error occurred.",
                    description: error.message
                })
                return
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
                                <TableCell>
                                    {program.free ? "Free" : formatter.format(program.price)}
                                </TableCell>
                                <TableCell>
                                    <Button variant="secondary" size="sm" asChild>
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