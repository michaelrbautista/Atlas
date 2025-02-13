"use client";

import { Button } from "@/components/ui/button";
import { memo } from "react";
import { redirectToNewProgram } from "@/server-actions/program";

const NewProgramButton = () => {
    return (
        <Button
            variant="systemBlue"
            size="sm"
            onClick={() => {
                redirectToNewProgram();
            }}
        >
            New program
        </Button>
    );
}
 
export default memo(NewProgramButton);