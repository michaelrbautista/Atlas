"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Button } from "../ui/button";
import { Tables } from "../../../database.types";
import { getCreatorsPrograms } from "@/server-actions/program";
import { createClient } from "@/utils/supabase/client";

const AddProgramToPostButton = ({
    setProgram
}: {
    setProgram: Dispatch<SetStateAction<Tables<"programs"> | null>>
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [programs, setPrograms] = useState<Tables<"programs">[]>([]);

    useEffect(() => {
        const getProgramsClient = async () => {
            setIsLoading(true);

            const supabase = createClient();

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                console.log("Couldn't get user.");
                return
            }

            const programs = await getCreatorsPrograms(user.id, 90);

            setPrograms(programs);
        }

        getProgramsClient();
    }, []);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="secondary" size="full" className="mt-3">Add program</Button>
            </DialogTrigger>
            <DialogContent className="bg-background pt-12 min-w-[800px]">
                <DialogHeader>
                    <DialogTitle hidden></DialogTitle>
                    <DialogDescription hidden></DialogDescription>
                </DialogHeader>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {programs.map((program) => {
                            return (
                                <TableRow key={program.id}>
                                    <TableCell>{program.title}</TableCell>
                                    <TableCell>{program.description}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => {setProgram(program)}} variant="secondary" size="sm">
                                            Add to post
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </DialogContent>
        </Dialog>
    );
}
export default AddProgramToPostButton