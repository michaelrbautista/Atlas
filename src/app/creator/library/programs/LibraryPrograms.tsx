"use client";

import NewProgramButton from "../../../../components/creator/program/NewProgramButton";
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
import { Tables } from "../../../../../database.types";
import { Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { deleteProgram, redirectToCreatorsProgram } from "@/server-actions/program";
import ProgramOptions from "@/components/creator/program/ProgramOptions";
import { useToast } from "@/components/ui/use-toast";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

const LibraryPrograms = () => {
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

    return (
        <div className="flex flex-col gap-5 h-full w-full">
            <div className="flex justify-end">
                <NewProgramButton addProgram={addProgram}></NewProgramButton>
            </div>
            <DataTable
                columns={columns}
                data={programs}
                setData={setPrograms}
            />
        </div>
    );
}
export default LibraryPrograms